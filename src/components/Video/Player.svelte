<script>
  import { getContext } from 'svelte';

  import { formatTime } from '../../utils/time.js';

  export let key;
  export let src;
  let player;
  let currentTime = 0;
  let duration;
  let paused = true;
  let { time, size } = getContext(key);

  $: {
    $time = Math.floor(currentTime * 10) / 10;
  }

  function handleChangeDuration(e) {
    if (!duration) {
      return;
    }

    const { left, right } = this.getBoundingClientRect();
    currentTime = (duration * (e.clientX - left)) / (right - left);
  }

  const togglePaused = () => {
    if (paused) {
      player.play();
    } else {
      player.pause();
    }
  };

  const onLoadedData = (e) => {
    $size = {
      width: player.offsetWidth,
      height: player.offsetHeight,
    };
  };

  const handleKeydown = (e) => {
    if (!duration) {
      return;
    }

    switch (e.keyCode) {
      case 39: {
        currentTime = Math.min(currentTime + 0.1, duration);
        break;
      }
      case 37: {
        currentTime = Math.max(0, currentTime - 0.1);
      }
    }
  };
</script>

<style lang='scss'>
  .controls {
    display: flex;
    align-items: center;
    margin-top: 10px;

    &__button {
      svg {
        fill: currentColor;
      }
    }

    &__time,
    &__button {
      flex-shrink: 0;
    }

    &__progress {
      flex-grow: 1;
      display: block;
      width: 100%;
      height: 10px;
      margin: 0 10px;
      -webkit-appearance: none;
      appearance: none;
    }

    &__progress::-webkit-progress-bar {
      background-color: rgba(#3298dc, 0.2);
    }

    &__progress::-webkit-progress-value {
      background-color: rgba(#3273dc, 0.6);
    }
  }

  .video {
    position: relative;

    &__player {
      width: 100%;
    }

    &__canvas {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
</style>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y-media-has-caption -->
<div class='video'>
  <video
    class='video__player'
    {src}
    bind:currentTime
    bind:duration
    bind:paused
    bind:this={player}
    on:loadedmetadata={onLoadedData} />
  <div class='video__canvas'>
    <slot />
  </div>
</div>

<div class='controls'>
  <button
    class='controls__button button is-info'
    type='button'
    on:click={togglePaused}>
    <span class='icon is-small'>
      <svg
        width='24'
        height='24'
        xmlns='http://www.w3.org/2000/svg'
        fill-rule='evenodd'
        clip-rule='evenodd'>
        {#if paused}
          <path d='M3 22v-20l18 10-18 10z' />
        {:else}
          <path d='M11 22h-4v-20h4v20zm6-20h-4v20h4v-20z' />
        {/if}
      </svg>
    </span>
  </button>
  <progress
    class='controls__progress'
    on:click={handleChangeDuration}
    value={currentTime / duration || 0} />
  <div class='controls__time'>{formatTime(currentTime)} / {formatTime(duration)}</div>
</div>
