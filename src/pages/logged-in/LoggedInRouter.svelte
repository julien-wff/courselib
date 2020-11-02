<script>
    import Button from '../../components/ui/Button.svelte';
    import CentredCard from '../../components/ui/CentredCard.svelte';
    import { createEventDispatcher, getContext } from 'svelte';
    import { firebaseContext } from '../../contexts/contexts';

    const { firebase } = getContext(firebaseContext);
    const auth = firebase().auth();

    const dispatch = createEventDispatcher();

    function signOut() {
        auth.signOut();
        dispatch('stateChange', { connected: false });
    }
</script>

<CentredCard>
    <h1>Connecté en tant que {auth.currentUser.email}</h1>

    <Button on:click={signOut} class="mt-4">Se déconnecter</Button>
</CentredCard>
