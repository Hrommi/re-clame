<script>
  import { onDestroy, getContext } from 'svelte';

  export let key;
  let { url } = getContext(key);

  let value = 'https://sveltejs.github.io/assets/caminandes-llamigos.mp4';

  const handleSubmit = () => {
    $url = value;
  }

  const unsubscribe = url.subscribe((currentUrl) => {
    value = currentUrl;
  })

  onDestroy(unsubscribe);
</script>

<form class="mb-5" on:submit|preventDefault={handleSubmit}>
  <div class="field has-addons">
    <div class="control is-expanded">
      <input bind:value class="input" type="text" placeholder="url">
    </div>
    <div class="control">
      <button class="button is-info">
        load video
      </button>
    </div>
  </div>
</form>
