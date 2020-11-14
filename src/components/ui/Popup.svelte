<script>
    import CentredCard from './CentredCard.svelte';

    export let disabled;
</script>

<style>
  .backdrop {
    background: rgba(.2, .2, .2, .3);
  }
</style>

<div class="absolute top-0 left-0 w-screen h-screen backdrop">
    <CentredCard {disabled}>
        <slot/>
    </CentredCard>
</div>