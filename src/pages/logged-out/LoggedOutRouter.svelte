<script>
    import { getContext, createEventDispatcher } from 'svelte';
    import { Router, Route, navigate } from 'svelte-routing';
    import { firebaseContext } from '../../contexts/contexts';
    import Login from './Login.svelte';
    import Register from './Register.svelte';

    const REGISTER_STEPS = 4;

    const { firebase } = getContext(firebaseContext);
    const dispatch = createEventDispatcher();

    let url = '';

    $: if (!['login', /register/].find(u => url.match(u)))
        navigate('/login');

    async function signIn(ev) {
        const user = ev.detail.user;
        const userDoc = await firebase().firestore().doc(`users/${user.uid}`).get();

        if (!userDoc.exists) {
            navigate('/register/0');
            return;
        }

        const userData = userDoc.data();

        if (userData.registerStep < REGISTER_STEPS) {
            navigate(`/register/${userData.registerStep}`);
        } else {
            dispatch('stateChange', { connected: true });
        }
    }
</script>

<Router {url}>
    <Route path="login">
        <Login on:signin={signIn}/>
    </Route>
    <Route path="register">
        <Register on:signin={signIn}/>
    </Route>
    <Route path="register/:step" component={Register}/>
</Router>
