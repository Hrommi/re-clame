<script>
  import { onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import { formatTime } from '../../utils/time.js';

  import Form from './Form.svelte';
  import Player from './Player.svelte';
  import Canvas from './Canvas.svelte';

  const key = {};
  let url = writable('');
  let time = writable(0);
  let beginTime = writable(null);
  let endTime = writable(null);
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
    beginTime,
    endTime,
    size,
    points,
  });

  const resetPoints = () => {
    $points = [];
  };

  const unsubscribe = url.subscribe((currentUrl) => {
    if (currentUrl) {
      isSaved = false;
    }
    resetPoints();
  });

  const handleStart = () => {
    $beginTime = $time;
  };

  const handleStop = () => {
    $endTime = $time;
  };

  const handleReset = () => {
    $points = [];
    $beginTime = null;
    $endTime = null;
  }

  const handleSave = async () => {
    errorMessage = null;
    isSaving = true;
    try {
      const data = {
        size: $size,
        url: $url,
        steps: [
          {
            beginTime: $beginTime,
            endTime: $endTime,
            points: $points,
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
      $url = '';
      isSaved = true;
      handleReset();
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
  <div class='notification is-success'>Data has been saved.</div>
{:else if $url}
  <Player {key} src={$url}>
    <Canvas {key} />
  </Player>

  <div class='actions'>
    {#if $points.length < 3}
      <div class="notification">Select area on video</div>
    {/if}
    {#if errorMessage}
      <div class='notification is-danger'>{errorMessage}</div>
    {/if}

    {#if $beginTime === null}
      <button
        class='button is-info'
        on:click={handleStart}
        disabled={$points.length < 3}
        title={$points.length < 3 ? 'select area on video' : ''}>
        Start
      </button>
    {:else if $endTime === null}
      <button
        class='button is-info'
        on:click={handleStop}
        disabled={$time <= $beginTime}
        title={$time <= $beginTime ? 'end time must be greater than start time' : ''}>
        Stop
      </button>
    {:else}
      <div class='buttons'>
        <button
          class='button is-danger'
          on:click={handleReset}>
          Reset
        </button>
        <button
          class='button is-success'
          on:click={handleSave}
          class:is-loading={isSaving}>
          Save
        </button>
        <button class="button is-white">{formatTime($beginTime)} / {formatTime($endTime)}</button>
      </div>
    {/if}
  </div>
{/if}
