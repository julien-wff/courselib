<script>
    import { createEventDispatcher } from 'svelte';
    import CentredCard from './CentredCard.svelte';

    export let disabled;

    const dispatch = createEventDispatcher();

    function handleKeypress(ev) {
        if (ev.key === 'Escape')
            dispatch('close', { source: 'escKey' });
    }
</script>


<svelte:window on:keydown={handleKeypress}/>

<div class="absolute top-0 left-0 w-screen h-screen backdrop z-50">
    <CentredCard {disabled}>
        <slot/>
    </CentredCard>
</div>