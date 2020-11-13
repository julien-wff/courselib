<script>
    import { navigate } from 'svelte-routing';
    import Button from '../../../components/ui/Button.svelte';
    import { createEventDispatcher, getContext, onMount } from 'svelte';
    import { firebaseContext, userContext } from '../../../contexts/contexts';
    import schools from '../../../schools.json';
    import subjects from '../../../subjects.json';

    let user = getContext(userContext);
    const { callFunction } = getContext(firebaseContext);
    const addOptions = callFunction('addOptions');

    const dispatch = createEventDispatcher();

    let options = [];
    onMount(() => {
        const opts = schools[$user.prefs.school].options;
        options = Object
            .keys(opts)
            .map(key => ({
                key,
                name: subjects[key],
                selected: false,
                incompatible: opts[key].incompatible || [],
                // require: opts[key].require || [],
                // requiredBy: opts[key].requiredBy || [],
            }));
    });

    let error = null;

    function toggleOption(spe) {
        const specialityIndex = options.findIndex(({ key }) => key === spe);
        const currentOption = options[specialityIndex];

        // if (!currentOption.selected && currentOption.require.length > 0) {
        //     options.forEach(opt => currentOption.require.includes(opt.key) && !opt.selected && toggleOption(opt.key));
        // }
        //
        // if (currentOption.selected && currentOption.requiredBy.length > 0) {
        //     options.forEach(opt => currentOption.requiredBy.includes(opt.key) && opt.selected && toggleOption(opt.key));
        // }

        if (!currentOption.selected && currentOption.incompatible.length > 0) {
            options.forEach(opt => currentOption.incompatible.includes(opt.key) && opt.selected && toggleOption(opt.key));
        }

        options[specialityIndex].selected = !currentOption.selected;
    }

    function submitOptions() {
        error = null;
        const selectedOptions = getSelectedOptions();
        dispatch('disable');
        addOptions(selectedOptions)
            .then(({ data }) => {
                if (data.action === 'nextStep') {
                    $user = {
                        ...$user,
                        prefs: {
                            ...$user.prefs,
                            options: selectedOptions,
                            registerStep: 4,
                        }
                    };
                    navigate('/');
                }
            })
            .catch(e => {
                console.error(e);
                error = e.message;
            })
            .finally(() => dispatch('enable'));
    }

    const getSelectedOptions = () => options
        .filter(opt => opt.selected)
        .map(opt => opt.key);

</script>


<h1 class="text-center">Vos options</h1>

<p class="my-4">Sélectionnez vos options</p>

{#if error}
    <p class="mb-4 inline-block text-red-500">{error}</p>
{/if}

<div class="flex flex-wrap mb-4">
    {#each options as { key, name, selected } (key + selected)}
        <Button
                class="mb-2 mr-2"
                variant={selected ? 'primary' : 'primary-light'}
                on:click={() => toggleOption(key)}>
            {name}
        </Button>
    {/each}
</div>

<Button class="w-full" on:click={submitOptions}>Terminé</Button>
