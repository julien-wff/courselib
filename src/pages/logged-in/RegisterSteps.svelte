<script>
    import { getContext } from 'svelte';
    import CentredCard from '../../components/ui/CentredCard.svelte';
    import { userContext } from '../../contexts/contexts';
    import Step0 from './steps/Step0.svelte';
    import Step1 from './steps/Step1.svelte';

    const user = getContext(userContext);
    let step;
    let disabled = false;

    $: step = $user.prefs ? $user.prefs.registerStep : 0;

    const stepsComponents = [
        Step0,
        Step1
    ];
</script>

<CentredCard containerClass="2sm:bg-gray-200" {disabled}>
    <svelte:component this={stepsComponents[step]} on:disable={() => disabled = true} on:enable={() => disabled = false}/>
</CentredCard>