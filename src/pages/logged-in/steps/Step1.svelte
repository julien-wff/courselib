<script>
    import { getContext, createEventDispatcher } from 'svelte';
    import Select from '../../../components/ui/Select.svelte';
    import Button from '../../../components/ui/Button.svelte';
    import TextInput from '../../../components/ui/TextInput.svelte';
    import { firebaseContext, userContext } from '../../../contexts/contexts';
    import schools from '../../../schools.json';

    const { callFunction } = getContext(firebaseContext);
    const addPersonalData = callFunction('addPersonalData');

    let user = getContext(userContext);

    const dispatch = createEventDispatcher();

    let error = null;

    let data = {
        firstName: '',
        lastName: '',
        school: '',
        grade: '',
        way: '',
        class: '',
    };

    function handleSchoolChange() {
        data = {
            ...data,
            grade: '',
            way: '',
            class: '',
        };
    }

    function handleGradeChange() {
        data = {
            ...data,
            way: '',
            class: '',
        };
    }

    function handleWayChange() {
        data = {
            ...data,
            class: '',
        };
    }

    function handleFormSubmit() {
        error = null;
        dispatch('disable');
        addPersonalData(data)
            .then(({ data: { action } }) => {
                if (action === 'nextStep')
                    $user = {
                        ...$user,
                        prefs: {
                            ...$user.prefs,
                            registerStep: 2,
                            ...data,
                        }
                    };
            })
            .catch(e => {
                console.error(e);
                error = e.message;
            })
            .finally(() => dispatch('enable'));
    }
</script>


<h1 class="text-center mb-4">À propos de vous</h1>

{#if error}
    <p class="mb-4 inline-block text-red-500">{error}</p>
{/if}

<form on:submit|preventDefault={handleFormSubmit}>

    <TextInput label="Nom" bind:value={data.lastName} required/>

    <TextInput label="Prénom" bind:value={data.firstName} required/>

    <Select
            label="Établissement"
            options={Object.keys(schools).reduce((prev, key) => ({...prev, [key]: schools[key].name}), {})}
            bind:value={data.school}
            on:change={handleSchoolChange}
            blank
            required/>

    <span class="block mb-1">Classe</span>
    <div class="flex flex-row justify-between">
        <Select
                options={data.school
                    ? Object.keys(schools[data.school].grades)
                        .reduce((prev, key) => ({...prev, [key]: schools[data.school].grades[key].name}), {})
                    : {'': 'Terminale'}}
                bind:value={data.grade}
                disabled={!data.school}
                on:change={handleGradeChange}
                blank
                wAuto
                required/>
        <Select
                class="mx-2"
                options={data.grade
                    ? Object.keys(schools[data.school].grades[data.grade].ways)
                        .reduce((prev, key) => ({...prev, [key]: schools[data.school].grades[data.grade].ways[key].name}), {})
                    : {'': 'Générale'}}
                bind:value={data.way}
                disabled={!data.grade}
                on:change={handleWayChange}
                blank
                wAuto
                required/>
        <Select
                options={data.way
                    ? schools[data.school].grades[data.grade].ways[data.way].classes
                    : {'': '1'}}
                bind:value={data.class}
                disabled={!data.way}
                blank
                wAuto
                required/>
    </div>

    <Button variant="primary" class="w-full mt-2">Suivant</Button>

</form>
