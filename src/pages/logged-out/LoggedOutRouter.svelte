<script>
    import { getContext, createEventDispatcher } from 'svelte';
    import { Router, Route, navigate } from 'svelte-routing';
    import { firebaseContext, userContext } from '../../contexts/contexts';
    import { getAccountPrefs } from '../../firebase/get-account-prefs';
    import Login from './Login.svelte';
    import Register from './Register.svelte';

    const { firebase } = getContext(firebaseContext);
    let user = getContext(userContext);
    const dispatch = createEventDispatcher();

    let url = '';

    $: if (!['login', 'register'].find(u => url.match(u)))
        navigate('/login');

    async function signIn(ev) {
        const userAccount = ev.detail.user;
        const userPrefs = await getAccountPrefs(firebase(), userAccount.uid);
        $user = {
            ...$user,
            account: userAccount,
            prefs: userPrefs,
        };
        dispatch('stateChange', { connected: true });
    }
</script>

<Router {url}>
    <Route path="login">
        <Login on:signin={signIn}/>
    </Route>
    <Route path="register">
        <Register on:signin={signIn}/>
    </Route>
</Router>
