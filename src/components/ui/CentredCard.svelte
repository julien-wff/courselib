<script>
    import Spinner from './Spinner.svelte';
    import { fade } from 'svelte/transition';
    import Container from '../utils/Container.svelte';
    import Center from '../utils/Center.svelte';

    export let containerClass = '';
    export let disabled = false;
</script>


<style>
  .disabled {
    background: rgba(.2, .2, .2, .3);
    backdrop-filter: blur(.04rem);
  }
</style>

<Container wFull hFull class="{containerClass}">
    <Center>
        <div class="bg-white 2sm:rounded-md 2sm:shadow-md 2sm:p-8 p-4 w-full 2sm:w-100 2sm:relative {$$props.class || ''}">
            {#if disabled}
                <div
                        transition:fade={{duration: 100}}
                        class="disabled w-full h-full absolute 2sm:rounded-md left-0 top-0 flex items-center justify-center">
                    <Spinner variant="light"/>
                </div>
            {/if}
            <slot/>
        </div>
    </Center>
</Container>