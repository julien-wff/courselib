<script>
    export let variant = 'primary';

    let theme = '';
    switch (variant) {
        case 'primary':
            theme = 'bg-blue-600 text-white';
            break;
        case 'primary-light':
            theme = 'bg-blue-100 text-black';
            break;
    }
</script>

<button on:click class="px-4 py-2 rounded cursor-pointer focus:outline-none {theme} {$$props.class || ''}">
    <slot/>
</button>
