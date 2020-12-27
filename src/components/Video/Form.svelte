<script>
  import { onDestroy, getContext } from 'svelte';
  import * as yup from 'yup';

  export let key;
  let { url } = getContext(key);

  const SUPPORTED_EXTENSIONS = [
    'WEBM',
    'OGG',
    'MP4',
    'AVI',
  ];

  let value = '';
  let valid = true;
  let errorMessage = null;

  const validateUrl = (currentUrl) => {
    const urlSchema = yup
      .string()
      .url('Link must be a valid URL')
      .required('Link is a required field')
      .test(
        'fileType',
        'Unsupported file extension',
        (currentValue) => {
          const extension = currentValue.substring(
            currentValue.lastIndexOf('.') + 1,
            currentValue.length
          );
          return SUPPORTED_EXTENSIONS.includes(extension.toUpperCase());
        }
      );

    try {
      urlSchema.validateSync(currentUrl);
      return null;
    } catch (e) {
      return e.message;
    }
  };

  const handleSubmit = () => {
    const error = validateUrl(value);
    if (error) {
      valid = false;
      errorMessage = error;
    } else {
      valid = true;
      errorMessage = null;
      $url = value;
    }
  };

  const unsubscribe = url.subscribe((currentUrl) => {
    value = currentUrl;
  });

  onDestroy(unsubscribe);
</script>

<form class='mb-5' on:submit|preventDefault={handleSubmit}>
  <div class='field has-addons'>
    <div class='control is-expanded'>
      <input
        class='input'
        class:is-danger={!valid}
        bind:value
        type='text'
        placeholder='Video link'
      >
      {#if errorMessage}
        <p class='help is-danger'>{errorMessage}</p>
      {:else}
        <p class='help'>Example: https://www.w3schools.com/html/mov_bbb.mp4</p>
      {/if}
    </div>
    <div class='control'>
      <button class='button is-info'>load video</button>
    </div>
  </div>
</form>
