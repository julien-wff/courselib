<script>
    import Button from '../../../components/ui/Button.svelte';
    import { createEventDispatcher, getContext, onMount } from 'svelte';
    import { firebaseContext, userContext } from '../../../contexts/contexts';
    import schools from '../../../schools.json';
    import subjects from '../../../subjects.json';

    let user = getContext(userContext);
    const { callFunction } = getContext(firebaseContext);
    const addSpecialities = callFunction('addSpecialities');

    const dispatch = createEventDispatcher();

    let specialities = [];
    onMount(() => {
        specialities = schools[$user.prefs.school].specialities
            .map(key => ({ key, name: subjects[key], selected: false }));
        maxSpesCount = $user.prefs.grade === 'terminale' ? 2 : 3;
    });

    let error = null;
    let maxSpesCount;

    function toggleSpeciality(spe) {
        error = null;
        const specialityIndex = specialities.findIndex(({ key }) => key === spe);
        const isSpeSelected = specialities[specialityIndex].selected;

        if (getSelectedSpecialities().length === maxSpesCount && !isSpeSelected)
            return error = `Vous êtes limités à ${maxSpesCount} spécialités`;

        specialities[specialityIndex].selected = !isSpeSelected;
    }

    function submitSpecialities() {
        error = null;
        const selectedSpecialities = getSelectedSpecialities();
        if (selectedSpecialities.length !== maxSpesCount)
            return error = `Veuillez sélectionner ${maxSpesCount} spécialités`;
        dispatch('disable');
        addSpecialities(selectedSpecialities)
            .then(({ data }) => {
                if (data.action === 'nextStep')
                    $user = {
                        ...$user,
                        prefs: {
                            ...$user.prefs,
                            specialities: selectedSpecialities,
                            registerStep: 3,
                        }
                    };
            })
            .catch(e => {
                console.error(e);
                error = e.message;
            })
            .finally(() => dispatch('enable'));
    }

    const getSelectedSpecialities = () => specialities
        .filter(spe => spe.selected)
        .map(spe => spe.key);

</script>


<h1 class="text-center">Vos enseignements</h1>

<p class="my-4">Sélectionnez vos enseignements de spécialité</p>

{#if error}
    <p class="mb-4 inline-block text-red-500">{error}</p>
{/if}

<div class="flex flex-wrap mb-4">
    {#each specialities as { key, name, selected } (key + selected)}
        <Button
                class="mb-2 mr-2"
                variant={selected ? 'primary' : 'primary-light'}
                on:click={() => toggleSpeciality(key)}>
            {name}
        </Button>
    {/each}
</div>

<Button class="w-full" on:click={submitSpecialities}>Suivant</Button>
