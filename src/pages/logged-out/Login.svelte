<script>
    import { getContext, createEventDispatcher } from 'svelte';
    import SocialLogin from '../../components/ui/SocialLogin.svelte';
    import Button from '../../components/ui/Button.svelte';
    import TextInput from '../../components/ui/TextInput.svelte';
    import CentredCard from '../../components/ui/CentredCard.svelte';
    import { Link } from 'svelte-routing';
    import { firebaseContext } from '../../contexts/contexts';
    import { authError } from './auth-error';

    const { firebase, getProvider } = getContext(firebaseContext);
    const auth = firebase().auth();

    let email = '', password = '';
    let loading = false;
    let error;

    const dispatch = createEventDispatcher();

    function emailLogin() {
        error = undefined;
        loading = true;
        auth.signInWithEmailAndPassword(email, password)
            .then(user => {
                dispatch('signin', user);
            })
            .catch(e => {
                loading = false;
                error = authError(e);
            });
    }


    function socialLogin(ev) {
        error = undefined;
        loading = true;

        const provider = getProvider(ev.detail.provider);
        if (!provider) {
            error = 'Une erreur est survenue. Code: auth/provider-not-found';
            loading = false;
            console.error('Error: provider not found.', ev);
            return;
        }

        auth.signInWithPopup(provider)
            .then(user => {
                dispatch('signin', user);
            })
            .catch(e => {
                loading = false;
                error = authError(e);
            });
    }

</script>


<CentredCard containerClass="2sm:bg-gray-200" disabled={loading}>

    <h1 class="text-center mb-2">Connexion</h1>

    {#if error}
        <div class="my-2 inline-block text-red-500">{error}</div>
    {/if}

    <div class="my-2 inline-block w-full">
        <form on:submit|preventDefault={emailLogin}>
            <TextInput label="Email" type="email" required bind:value={email}/>
            <TextInput label="Mot de passe" type="password" required noMB bind:value={password}/>
            <a href=".." class="float-right">Mot de passe oublié</a>
            <Button class="inline-block w-full mt-4">Se connecter</Button>
        </form>

        <div>
            <span class="inline-block w-full mt-8 text-center font-bold">Où connectez-vous avec</span>
            <SocialLogin on:social-click={socialLogin}/>
        </div>

        <span class="inline-block w-full text-center mt-4">
            Pas de compte ?
            <Link to="register">En créer un</Link>
        </span>
    </div>

</CentredCard>
