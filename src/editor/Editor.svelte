<script>
    let state = 'Chargement de la librairie';
    let editorDiv;

    async function loadEditor() {
        const CKeditor = await import(/* webpackChunkName: "ckeditor" */'./ckeditor5');
        state = 'Chargement de l\'éditeur';
        CKeditor.createEditor(
            CKeditor,
            editorDiv,
            undefined,
            () => state = null,
        );
    }

    loadEditor();
</script>

<style>
  .hidden {
    display: none;
  }
</style>

{#if state}
    Etape : {state}
{/if}

<div id="editor" bind:this={editorDiv} class:hidden={!!state}/>
