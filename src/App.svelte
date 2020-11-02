<script>
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import { firebaseContext } from './contexts/contexts';
    import Loading from './pages/Loading.svelte';

    let Router;
    let firebase, providers;
    let user = writable(undefined);
    setContext(firebaseContext, {
        firebase: () => firebase,
        getProvider: name => providers[name] && new providers[name](),
        user
    });

    let loadingText = 'Chargement de l\'application';

    async function loadFirebase() {
        const { initFirebase, PROVIDERS } = await import(/* webpackChunkName: "firebase" */ './firebase/firebase');
        firebase = initFirebase();
        providers = PROVIDERS;
        loadingText = 'Chargement du compte';
        $user = await new Promise(resolve => {
            const unsubscribe = firebase.auth().onAuthStateChanged(u => {
                unsubscribe();
                resolve(u);
            });
        });
        loadingText = 'Chargement du code';
        await setRouter($user);
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
    {error}
{/await}
