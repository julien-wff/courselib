<script>
    import Button from '../../components/ui/Button.svelte';
    import CentredCard from '../../components/ui/CentredCard.svelte';
    import { getContext } from 'svelte';
    import { firebaseContext } from '../../contexts/contexts';

    const { firebase } = getContext(firebaseContext);
    const auth = firebase().auth();
</script>

<CentredCard>
    <h1>Connecté en tant que {auth.currentUser.email}</h1>

    <Button on:click={() => auth.signOut()} class="mt-4">Se déconnecter</Button>
</CentredCard>
