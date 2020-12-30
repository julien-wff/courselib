<script>
    import { navigate } from 'svelte-routing';
    import Button from '../../../components/ui/Button.svelte';
    import Select from '../../../components/ui/Select.svelte';
    import { createEventDispatcher, getContext } from 'svelte';
    import Popup from '../../../components/ui/Popup.svelte';
    import TextInput from '../../../components/ui/TextInput.svelte';
    import { firebaseContext } from '../../../contexts/contexts';

    export let subject;
    export let subjects = {};

    const dispatch = createEventDispatcher();

    const { callFunction, firebase } = getContext(firebaseContext);
    const createCourse = callFunction('createCourse');

    let newCourseData = {
        name: '',
        category: 'none',
        subject,
        index: null,
    };
    let disabled = false, error = null;

    function handleCreateCourse() {
        disabled = true;
        error = null;
        createCourse(newCourseData)
            .then(({ data }) => {
                navigate(`/course/${data.id}`);
            })
            .catch(e => {
                error = e.message;
                console.error(e);
            })
            .finally(() => disabled = false);
    }
</script>


<Popup {disabled}>

    <h1 class="text-center mb-4">Nouveau cours</h1>

    {#if error}
        <p class="mb-4 inline-block text-red-500">{error}</p>
    {/if}

    <form class="my-2 inline-block w-full" on:submit|preventDefault={handleCreateCourse}>

        <TextInput label="Nom" required bind:value={newCourseData.name}/>

        <Select label="Matière" options={subjects} bind:value={newCourseData.subject}/>

        <Select label="Catégorie" options={{ none: 'Aucune' }} bind:value={newCourseData.category} noMB/>
        <div class="flex justify-end mb-4">
            <span class="text-right cursor-pointer text-blue-500">Nouvelle catégorie</span>
        </div>

        <TextInput label="Numéro du chapitre (optionnel)" type="number" min="0" bind:value={newCourseData.index}/>

        <div class="flex justify-between inline-block">
            <Button type="button" variant="secondary" class="flex-1 mr-2" on:click={() => dispatch('close')}>
                Retour
            </Button>
            <Button type="submit" class="flex-1 ml-2">Créer</Button>
        </div>
    </form>

</Popup>