<script>
    import Error from '../../components/ui/Error.svelte';
    import Loading from '../Loading.svelte';
    import { Router, Route, navigate } from 'svelte-routing';
    import Button from '../../components/ui/Button.svelte';
    import CentredCard from '../../components/ui/CentredCard.svelte';
    import { createEventDispatcher, getContext, onMount } from 'svelte';
    import { firebaseContext, userContext } from '../../contexts/contexts';

    const REGISTER_STEPS = 4;

    let user = getContext(userContext);
    const { firebase } = getContext(firebaseContext);
    const auth = firebase().auth();

    const dispatch = createEventDispatcher();

    let url = '';

    onMount(() => {
        if (!$user.prefs || $user.prefs.registerStep < REGISTER_STEPS)
            navigate(`/register`);
    });

    function signOut() {
        auth.signOut();
        dispatch('stateChange', { connected: false });
    }

    const getRegisterSteps = () => import(/* webpackChunkName: "registerSteps" */ './RegisterSteps.svelte');
</script>


<Router {url}>

    <Route path="/">
        <CentredCard>
            <h1>Connecté en tant que {auth.currentUser.email}</h1>

            <Button on:click={signOut} class="mt-4">Se déconnecter</Button>
        </CentredCard>
    </Route>

    <Route path="register">
        {#await getRegisterSteps()}
            <Loading text="Chargement du code"/>
        {:then RegisterSteps}
            <svelte:component this={RegisterSteps.default}/>
        {:catch error}
            <Error {error}/>
        {/await}
    </Route>

</Router>
