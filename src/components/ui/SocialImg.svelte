<script>
    export let src;
    export let alt;
    export let provider;


    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function click() {
        dispatch('social-click', { provider });
    }

</script>

<img {src} {alt} height="30" width="30" class="mx-2 cursor-pointer" on:click={click}/>
