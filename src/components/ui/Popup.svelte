<script>
    import CentredCard from './CentredCard.svelte';

    export let disabled;
</script>


<div class="absolute top-0 left-0 w-screen h-screen backdrop">
    <CentredCard {disabled}>
        <slot/>
    </CentredCard>
</div>