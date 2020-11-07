<script>
    export let label;
    export let value;
    export let blank = false;
    export let options = {};
    export let noMB = false;
    export let wAuto = false;

    let props = {};
    $: props = {
        ...$$props,
        options: undefined,
        blank: undefined,
        class: `${noMB ? '' : 'mb-4'} ${wAuto ? '' : 'w-full'}
        px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-blue-400 shadow-none
        ${$$props.class || ''}`
    };
</script>

<label>
    {#if label}
        <span class="block mb-1">{label}</span>
    {/if}
    <select {...props} bind:value on:change>
        {#if blank}
            <option value="" disabled selected>{typeof blank === 'string' ? blank : ''}</option>
        {/if}
        {#each Object.keys(options) as key}
            <option value={key}>{options[key]}</option>
        {/each}
    </select>
</label>
