<script>
    export let variant;

    let stroke;

    $: switch (variant) {
        case 'light':
            stroke = '#f7fafc';
            break;
        default:
        case 'dark':
            stroke = '#718096';
            break;
    }
</script>


<style>
  svg {
    animation: turn 2s ease-in-out infinite;
    height: 100px;
    width: 100px;
  }

  @keyframes turn {
    from {
      transform: rotate(0turn);
    }
    to {
      transform: rotate(3turn);
    }
  }
</style>

<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <clipPath id="cut-off-quarter">
            <path d="M26 1H1V51H51V26H26V1Z"/>
        </clipPath>
    </defs>
    <circle cx="25" cy="25" r="22" fill="none" stroke-width="3" {stroke} clip-path="url(#cut-off-quarter)"/>
</svg>
