<script>
    import { onDestroy, onMount } from 'svelte';

    export let showNav = false;

    $: if (showNav)
        window.history.pushState({}, '', '#');
    else
        window.history.replaceState({}, '', window.location.href.replace(/#$/, ''));

    function onHistoryChange() {
        if (showNav) {
            showNav = false;
        }
    }

    onMount(() => {
        window.addEventListener('popstate', onHistoryChange);
    });

    onDestroy(() => {
        window.removeEventListener('popstate', onHistoryChange);
    });

    function hideNav() {
        showNav = false;
    }
</script>

<style>
    nav {
        width: 300px;
        max-width: calc(100vw - 20px);
        transition: transform .2s;
    }
</style>

<svelte:body on:keydown={e => e.key === 'Escape' && showNav && (showNav = false)}/>
<svelte:window on:resize={ev => showNav && ev.target.innerWidth >= 1024 && (showNav = false)}/>

<!-- Background -->
<div class="absolute top-0 left-0 w-screen h-screen lg:hidden lg:pointer-events-none z-10 backdrop transition-opacity duration-200
     {showNav ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
     on:click={() => showNav = false}/>

<!-- TODO: Draggable bar -->

<nav class="bg-white px-4 py-3 lg:relative absolute h-screen top-0 right-0 z-20 transform lg:translate-x-0 overflow-y-auto
     {!showNav ? 'translate-x-full' : ''} {$$props.class || ''}">
    <slot {hideNav}/>
</nav>
