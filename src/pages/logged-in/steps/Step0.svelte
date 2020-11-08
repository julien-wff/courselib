<script>
    import { getContext, onMount, createEventDispatcher } from 'svelte';
    import Button from '../../../components/ui/Button.svelte';
    import TextInput from '../../../components/ui/TextInput.svelte';
    import { firebaseContext, userContext } from '../../../contexts/contexts';

    const { firebase } = getContext(firebaseContext);
    let user = getContext(userContext);
    const createUser = firebase().functions().httpsCallable('createUser');
    const confirmMbnCode = firebase().functions().httpsCallable('confirmMbnCode');

    const dispatch = createEventDispatcher();

    let email = '',
        code = '',
        error = null,
        showCodeConfirm = false,
        lastEmailVerif;

    onMount(() => {
        if ($user.prefs && $user.prefs.lastEmailVerif)
            lastEmailVerif = $user.prefs.lastEmailVerif.seconds * 1000;

        if (lastEmailVerif &&
            lastEmailVerif + (600 - 30) * 1000 > Date.now() // If the confirmation date is valid for the 30 next seconds
        ) {
            showCodeConfirm = true;
        }

        if ($user.prefs && $user.prefs.mbnMail && $user.prefs.mbnMail.endsWith('@monbureaunumerique.fr'))
            email = $user.prefs.mbnMail;
    });

    function submitEmail() {
        if (!email.endsWith('@monbureaunumerique.fr')) {
            return error = 'Un email @monbureaunumerique.fr est requis.';
        }
        error = null;
        dispatch('disable');
        createUser({ email })
            .then(({ data }) => {
                if (data.action === 'verif') {
                    showCodeConfirm = true;
                    lastEmailVerif = Date.now();
                }
            })
            .catch(e => {
                console.error(e);
                error = e.message;
            })
            .finally(() => dispatch('enable'));
    }

    function sendConfirmCode() {
        dispatch('disable');
        confirmMbnCode({ code })
            .then(({ data }) => {
                if (data.action === 'nextStep') {
                    $user = {
                        ...$user,
                        prefs: {
                            ...$user.prefs,
                            mbnMail: email,
                            registerStep: 1,
                        }
                    };
                }
            })
            .catch(e => {
                console.error(e);
                error = e.message;
            })
            .finally(() => dispatch('enable'));
    }

    function modifyOrResendEmail() {
        const waitingTime = (lastEmailVerif + 120 * 1000) - Date.now();
        if (waitingTime > 0) { // If the last email was send less than 2mins ago
            const durationFormat = new Intl.RelativeTimeFormat('fr');
            error = `Vous pourrez renvoyer un mail ${durationFormat.format(Math.trunc(waitingTime / 1000), 'second')}`;
        } else {
            error = null;
            showCodeConfirm = false;
        }
    }
</script>


<h1 class="text-center">Vérification de l'identité</h1>

<p class="my-4">
    Pour vérifier votre identité, un mail de confirmation contenant un code vous sera envoyé sur Mon bureau Numérique.
</p>

{#if error}
    <p class="mb-4 inline-block text-red-500">{error}</p>
{/if}

{#if !showCodeConfirm}
    <form on:submit|preventDefault={submitEmail}>
        <TextInput type="email" bind:value={email} required placeholder="prenom.nom@monbureaunumerique.fr" noMB/>
        {#if $user.prefs && lastEmailVerif + 600 * 1000 > Date.now()}
            <span class="float-right text-blue-500 cursor-pointer" on:click={() => showCodeConfirm = true}>
                Entrer un code
            </span>
        {/if}
        <Button variant="primary" class="w-full mt-4">{!showCodeConfirm ? 'Envoyer' : 'Renvoyer'} le mail</Button>
    </form>
{:else}
    <form on:submit|preventDefault={sendConfirmCode}>
        <TextInput
                bind:value={code}
                required
                placeholder="ACB12"
                label="Entrez le code reçu sur MBN"
                noMB
                pattern={"^[A-Z0-9]{5}$"}/>
        <span class="float-right text-blue-500 cursor-pointer" on:click={modifyOrResendEmail}>
            Modifier / renvoyer le mail
        </span>
        <Button variant="primary" class="w-full mt-4">Valider</Button>
    </form>
{/if}
