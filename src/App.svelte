<script>
    import Error from './components/ui/Error.svelte';
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import { firebaseContext, userContext } from './contexts/contexts';
    import { getAccountPrefs } from './firebase/get-account-prefs';
    import Loading from './pages/Loading.svelte';

    let Router;
    let firebase, providers;
    setContext(firebaseContext, {
        firebase: () => firebase,
        getProvider: name => providers[name] && new providers[name](),
    });

    let user = writable({
        account: null,
        prefs: null,
    });
    setContext(userContext, user);

    let loadingText = 'Chargement de l\'application';


    async function loadFirebase() {
        const { initFirebase, PROVIDERS } = await import(/* webpackChunkName: "firebase" */ './firebase/firebase');
        firebase = initFirebase();
        providers = PROVIDERS;

        loadingText = 'Chargement du compte';
        const userAccount = await new Promise(resolve => {
            const unsubscribe = firebase.auth().onAuthStateChanged(u => {
                unsubscribe();
                resolve(u);
            });
        });
        $user = { ...$user, account: userAccount };

        if (userAccount) {
            loadingText = 'Chargement des préférences';
            const prefs = await getAccountPrefs(firebase, $user.account.uid);
            $user = { ...$user, prefs };
        }

        loadingText = 'Chargement du code';
        await setRouter($user.account);
    }


    async function setRouter(connected) {
        if (connected)
            Router = await import(/* webpackChunkName: "loggedInRouter" */'./pages/logged-in/LoggedInRouter.svelte');
        else
            Router = await import(/* webpackChunkName: "loggedOutRouter" */'./pages/logged-out/LoggedOutRouter.svelte');
    }
</script>

{#await loadFirebase()}
    <Loading text={loadingText}/>
{:then _}
    <svelte:component this={Router.default} on:stateChange={ev => setRouter(ev.detail.connected)}/>
{:catch error}
    <Error {error}/>
{/await}
