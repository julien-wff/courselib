<script>
    import { getContext } from 'svelte';
    import CentredCard from '../../components/ui/CentredCard.svelte';
    import { userContext } from '../../contexts/contexts';

    const user = getContext(userContext);
</script>

<CentredCard containerClass="2sm:bg-gray-200">
    <h1>Step : {$user.prefs ? $user.prefs.registerStep : 0}</h1>
</CentredCard>