<script>
    import Header from './Header.svelte';
    import Nav from './Nav.svelte';
</script>


<div class="w-full min-h-screen flex flex-row bg-gray-200">

    <Nav>
        <slot name="nav"/>
    </Nav>

    <div class="flex-1 flex flex-col">

        <Header>
            <slot name="header"/>
        </Header>

        <main>
            <slot name="main"/>
        </main>

    </div>
</div>
