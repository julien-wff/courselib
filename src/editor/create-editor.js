/**
 * @param CKeditor {{Watchdog: Class, Editor: Class}}
 * @param mountElement {HTMLElement}
 * @param errCallback {Function}
 * @param finishCallback {Function}
 */
export function createEditor(CKeditor, mountElement, errCallback = undefined, finishCallback = undefined) {

    const watchdog = new CKeditor.Watchdog();
    errCallback = errCallback || console.error;

    watchdog.setCreator((element, config) => {
        return CKeditor.Editor
            .create(element, config)
            .then(editor => {
                finishCallback(editor);
                return editor;
            });
    });

    watchdog.setDestructor(editor => {
        return editor.destroy();
    });

    watchdog.on('error', errCallback);

    watchdog
        .create(mountElement, {
            toolbar: {
                items: [
                    'heading',
                    '|',
                    'fontColor',
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    'removeFormat',
                    'subscript',
                    'superscript',
                    '|',
                    'link',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'indent',
                    'outdent',
                    '|',
                    'imageInsert',
                    'mediaEmbed',
                    'insertTable',
                    '|',
                    'MathType',
                    'ChemType',
                    '|',
                    'exportPdf',
                    'exportWord',
                    '|',
                    'undo',
                    'redo'
                ]
            },
            language: 'fr',
            shouldNotGroupWhenFull: false,
            image: {
                toolbar: [
                    'imageTextAlternative',
                    'imageStyle:full',
                    'imageStyle:side'
                ]
            },
            table: {
                contentToolbar: [
                    'tableColumn',
                    'tableRow',
                    'mergeTableCells',
                    'tableCellProperties',
                    'tableProperties'
                ]
            },
            licenseKey: '',

        })
        .catch(errCallback);
}
