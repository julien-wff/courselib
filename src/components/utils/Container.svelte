<script>
    export let wFull = false;
    export let hFull = false;
</script>

<div class="{wFull ? 'w-full' : ''} {hFull ? 'h-screen' : ''} {$$props.class || ''}">
    <slot/>
</div>