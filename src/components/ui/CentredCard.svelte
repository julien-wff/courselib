<script>
    import { fade } from 'svelte/transition';
    import Container from '../utils/Container.svelte';
    import Center from '../utils/Center.svelte';

    export let containerClass = '';
    export let disabled = false;
</script>


<style>
  .disabled {
    @apply w-full h-full absolute rounded-md left-0 top-0;
    background: rgba(.2, .2, .2, .2);
  }
</style>

<Container wFull hFull class="{containerClass}">
    <Center>
        <div class="bg-white 2sm:rounded-md 2sm:shadow-md p-8 w-full 2sm:w-100 2sm:relative {$$props.class || ''}">
            {#if disabled}
                <div transition:fade={{duration: 100}} class="disabled"/>
            {/if}
            <slot/>
        </div>
    </Center>
</Container>