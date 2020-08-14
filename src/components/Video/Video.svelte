<script>
  import { onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import Form from './Form.svelte';
  import Player from './Player.svelte';
  import Canvas from './Canvas.svelte';

  const key = {};
  let url = writable('');
  let time = writable(0);
  let size = writable({
    width: 0,
    height: 0,
  });
  let points = writable([]);

  let errorMessage = null;
  let isSaving = false;
  let isSaved = false;

  setContext(key, {
    url,
    time,
    size,
    points,
  });

  const resetPoints = () => {
    $points = [];
  }

  const unsubscribe = url.subscribe((currentUrl) => {
    if (currentUrl) {
      isSaved = false;
    }
    resetPoints();
  });

  const handleSave = async () => {
    errorMessage = null;
    isSaving = true;
    try {
      const data = {
        size: $size,
        url: $url,
        steps: [
          {
            time: 0,
            points: $points,
          },
          {
            time: $time,
            points: null,
          },
        ],
      };
      const response = await fetch('/api/videos', {
        method: 'POST',
        body: JSON.stringify({ data }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 201) {
        const { message } = await response.json();
        throw new Error(message);
      }
      url.set('');
      isSaved = true;
    } catch (error) {
      errorMessage = error.message;
    }
    isSaving = false;
  };

  onDestroy(unsubscribe);
</script>

<style>
  .actions {
    margin-top: 20px;
  }
</style>

<Form {key} />

{#if isSaved}
  <div class="notification is-success">
    Data has been saved.
  </div>
{:else}
  {#if $url}
    <Player {key} src={$url}>
      <Canvas {key} />
    </Player>

    {#if errorMessage}
      <div class="notification is-danger">{errorMessage}</div>
    {/if}

    <button
      class='actions button is-success'
      on:click={handleSave}
      class:is-loading={isSaving}
      disabled={$points.length < 3}>
      Save
    </button>
  {/if}
{/if}
