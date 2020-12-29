<script>
    import Header from './Header.svelte';
    import Nav from './Nav.svelte';

    let showNav = false;
</script>


<style>
  main {
    width: calc(100vw - 300px);
  }

  @media all and (max-width: 1024px) {
    main {
      width: 100vw;
    }
  }
</style>


<div class="w-screen min-h-screen flex flex-row bg-gray-200">

    <Nav bind:showNav let:hideNav>
        <slot name="nav" {hideNav}/>
    </Nav>

    <div class="flex-1 flex flex-col">

        <Header on:toggleNav={() => showNav = !showNav}>
            <slot name="header"/>
        </Header>

        <main>
            <slot name="main"/>
        </main>

    </div>
</div>
