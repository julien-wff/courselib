<script>
    import { getEditor } from '../../chunks';
    import Layout from '../../components/ui/Layout.svelte';
    import Error from '../../components/ui/Error.svelte';
    import Spinner from '../../components/ui/Spinner.svelte';
    import Center from '../../components/utils/Center.svelte';
    import { getContext } from 'svelte';
    import { firebaseContext } from '../../contexts/contexts';
    import subjectLocales from '../../subjects.json';

    export let courseId;

    const { firebase } = getContext(firebaseContext);

    let courseData, Editor, editor;


    async function loadCourse() {
        const results = await Promise.all([
            firebase()
                .firestore()
                .doc(`courses/${courseId}`)
                .get()
                .then(d => d.data()),

            getEditor()
        ]);

        courseData = results[0];
        Editor = results[1];
    }
</script>


{#await loadCourse()}
    <Center class="flex-col bg-gray-200">
        <Spinner/>
        <h1 class="text-xl mt-2">Chargement du cours</h1>
    </Center>
{:then _}
    <Layout>
        <h1 slot="header">{subjectLocales[courseData.class] || courseData.class} - {courseData.name}</h1>
        <div slot="main" class="md:p-4 flex justify-center w-full">
            <div class="max-w-5xl w-full">
                <svelte:component
                        this={Editor}
                        initialData="<h1>{courseData.name}</h1>"
                        on:error={ev => console.error(ev.detail)}
                        on:load={ev => editor = ev.detail}/>
            </div>
        </div>
    </Layout>
{:catch error}
    <Error {error}/>
{/await}
