/**
 * @param CKeditor {{Watchdog: Class, Editor: Class}}
 * @param mountElement {HTMLElement}
 * @param errCallback {Function}
 * @param finishCallback {Function}
 */
export function createEditor(CKeditor, mountElement, errCallback = undefined, finishCallback = undefined) {

    const watchdog = new CKeditor.Watchdog();
    errCallback = errCallback || handleError;

    window.watchdog = watchdog;

    watchdog.setCreator((element, config) => {
        return CKeditor.Editor
            .create(element, config)
            .then(editor => {
                window.editor = editor;
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
        .then(finishCallback)
        .catch(errCallback);

    function handleError(error) {
        console.error('Oops, something went wrong!');
        console.error('Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:');
        console.error(error);
        console.warn('Build id: 7bgxqar1rkyy-wg5kcj9k9q4v');
    }
}