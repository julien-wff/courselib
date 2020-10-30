<script>
    import Spinner from '../components/ui/Spinner.svelte';
    import Container from '../components/utils/Container.svelte';
    import Center from '../components/utils/Center.svelte';

    export let text;
</script>


<Container wFull hFull class="bg-gray-200">
    <Center class="flex-col">
        <Spinner/>
        {#if text}
            <h1 class="text-xl mt-2">{text}</h1>
        {/if}
    </Center>
</Container>
