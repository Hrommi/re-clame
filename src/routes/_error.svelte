<script>
  export let status;
  export let error;

  const dev = process.env.NODE_ENV === 'development';
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<h1 class="title is-1">{status}</h1>

<p class="subtitle is-5">{error.message}</p>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
