<script>
    import { getFirebase, getLoggedInRouter, getLoggedOutRouter } from './chunks';
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
        callFunction: name => process.env.NODE_ENV !== 'production'
            ? firebase.functions().httpsCallable(name)
            : firebase.app().functions('europe-west1').httpsCallable(name),
        getProvider: name => providers[name] && new providers[name](),
        disconnect: redirectFunction => {
            firebase.auth().signOut();
            if (redirectFunction)
                redirectFunction('/login');
            setRouter(false);
        }
    });

    let user = writable({
        account: null,
        prefs: null,
    });
    setContext(userContext, user);

    let loadingText = 'Chargement de l\'application';


    async function loadFirebase() {
        const { initFirebase, PROVIDERS } = await getFirebase();
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
            Router = await getLoggedInRouter();
        else
            Router = await getLoggedOutRouter();
    }
</script>


<div class="w-screen h-screen relative overflow-hidden" id="app">

    {#await loadFirebase()}
        <Loading text={loadingText}/>
    {:then _}
        <svelte:component this={Router} on:stateChange={ev => setRouter(ev.detail.connected)}/>
    {:catch error}
        <Error {error}/>
    {/await}

</div>
