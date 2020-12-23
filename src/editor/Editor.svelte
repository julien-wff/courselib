<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import CKeditor from './ckeditor5';
    import { createEditor } from './create-editor';

    export let initialData;
    export let showWhileLoading = false;

    const dispatch = createEventDispatcher();

    let editorDiv, loaded = false;

    onMount(() => {
        createEditor(
            CKeditor,
            editorDiv,
            err => dispatch('error', err),
            editor => {
                loaded = true;
                editor.sourceElement.nextSibling.style.width = '100%';
                dispatch('load', editor);
            },
        );
    });
</script>


<style>
    :global(.ck-editor__editable) {
        max-height: calc(100vh - 150px);
    }
</style>


<div id="editor" bind:this={editorDiv} class="{!showWhileLoading && !loaded ? 'hidden' : ''} {$$props.class || ''}">
    {@html initialData}
</div>
