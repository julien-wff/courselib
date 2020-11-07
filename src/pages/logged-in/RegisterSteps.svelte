<script>
    import { getContext } from 'svelte';
    import CentredCard from '../../components/ui/CentredCard.svelte';
    import { userContext } from '../../contexts/contexts';
    import Step0 from './steps/Step0.svelte';

    const user = getContext(userContext);
    let step;

    $: step = $user.prefs ? $user.prefs.registerStep : 0;

    const stepsComponents = [
        Step0,
    ];
</script>

<CentredCard containerClass="2sm:bg-gray-200">
    <svelte:component this={stepsComponents[step]}/>
</CentredCard>