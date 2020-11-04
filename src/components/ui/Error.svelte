<script>
    import CentredCard from './CentredCard.svelte';

    export let error;

    $: console.error(error);

    function displayError(err) {
        if (err instanceof Error) {
            return `${err.name}: ${err.message}`;
        } else if (typeof err === 'object') {
            return JSON.stringify(err, null, 2);
        } else {
            return err;
        }
    }
</script>


<CentredCard containerClass="2sm:bg-gray-200">
    <h1 class="mb-4 text-center">Une erreur s'est produite</h1>
    <p>{displayError(error)}</p>
</CentredCard>