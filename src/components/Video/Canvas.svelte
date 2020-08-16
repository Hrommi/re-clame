<script>
  import { onMount, getContext } from "svelte";

  import { paint } from "../../utils/canvas.js";

  export let key;
  let { points, size } = getContext(key);
  let canvas;
  let mouse = { x: 0, y: 0, button: 0, lx: 0, ly: 0, update: true };
  let polygon;

  const updatePoints = (newPoints) => {
    if (!polygon) {
      return;
    }
    if (JSON.stringify(newPoints) !== JSON.stringify(polygon.points)) {
      polygon.updatePoints(newPoints);
    }
  };

  $: {
    updatePoints($points);
  }

  const mouseEvents = (e) => {
    const bounds = canvas.getBoundingClientRect();
    mouse.x = e.pageX - bounds.left - window.scrollX;
    mouse.y = e.pageY - bounds.top - window.scrollY;
    mouse.button =
      e.type === "mousedown"
        ? true
        : e.type === "mouseup"
        ? false
        : mouse.button;
    mouse.update = true;
  };

  onMount(() => {
    const { frame, polygon: paintPolygon } = paint(
      canvas,
      mouse,
      $points,
      points.set
    );
    polygon = paintPolygon;

    return () => {
      cancelAnimationFrame(frame);
    };
  });
</script>

<canvas
  width={$size.width}
  height={$size.height}
  bind:this={canvas}
  on:mousedown={mouseEvents}
  on:mouseup={mouseEvents}
  on:mousemove={mouseEvents} />
