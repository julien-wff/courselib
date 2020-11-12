<script>
    import { getContext } from 'svelte';
    import { Link } from 'svelte-routing';
    import Header from '../../components/ui/Header.svelte';
    import Nav from '../../components/ui/Nav.svelte';
    import { userContext } from '../../contexts/contexts';
    import subjects from '../../subjects.json';

    export let subject;

    let user = getContext(userContext);
</script>

<div class="w-full min-h-screen flex flex-row bg-gray-200">

    <Nav>
        <h2 style="line-height: 36px" class="mb-2">Matières disponibles</h2>
        {#each [...$user.prefs.classes, ...$user.prefs.specialities] as key}
            <Link to="/home/{key}">
                <span class="block py-1 {subject === key ? 'text-blue-700' : 'text-black'}">
                    {subjects[key]}
                </span>
            </Link>
        {/each}

        <h2 style="line-height: 36px" class="mb-2 mt-8">Créer</h2>
        <span class="text-black block py-1 cursor-pointer">Nouveau cours</span>
        <span class="text-black block py-1 cursor-pointer">Nouvelle fiche de révision</span>

        <h2 style="line-height: 36px" class="mb-2 mt-8">Compte</h2>
        <Link to="/profile">
            <span class="text-black block py-1">Profil</span>
        </Link>
        <span class="text-black block py-1 cursor-pointer">Déconnexion</span>
    </Nav>

    <div class="flex-1 flex flex-col">

        <Header>
            <h1>{subjects[subject]}</h1>
        </Header>

        <div>Cours dispos</div>

    </div>

</div>
