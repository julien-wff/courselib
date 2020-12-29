<script>
    import { createEventDispatcher } from 'svelte';
    import Menu from '../../images/icons/menu.svg';

    const dispatch = createEventDispatcher();
</script>

<style>
  header {
    height: 60px;
  }

  .menu-toggle-container {
    height: 36px;
    width: 36px;
  }
</style>

<header class="w-full bg-white px-4 py-3 flex flex-row {$$props.class || ''}">
    <div class="flex-1">
        <slot/>
    </div>
    <div class="menu-toggle-container cursor-pointer lg:hidden flex items-center justify-center"
         on:click={() => dispatch('toggleNav')}>
        <img class="h-8 w-8" src={Menu} alt="menu"/>
    </div>
</header>
