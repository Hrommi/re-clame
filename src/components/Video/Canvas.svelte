<script>
  import { onMount, getContext } from 'svelte';

  let canvas;
  let mouse = { x: 0, y: 0, button: 0, lx: 0, ly: 0, update: true };

  export let key;
  let { points, size } = getContext(key);

  const mouseEvents = (e) => {
    const bounds = canvas.getBoundingClientRect();
    mouse.x = e.pageX - bounds.left - window.scrollX;
    mouse.y = e.pageY - bounds.top - window.scrollY;
    mouse.button =
      e.type === 'mousedown'
        ? true
        : e.type === 'mouseup'
        ? false
        : mouse.button;
    mouse.update = true;
  }

  onMount(() => {
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;

    const point = (x, y) => ({ x, y });

    function Poly() {
      this.addPoint = (p) => {
        $points = [...$points, point(p.x, p.y)];
      };
      this.draw = () => {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#3298dc';
        ctx.beginPath();
        for (const p of $points) {
          ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        for (const p of $points) {
          ctx.moveTo(p.x + 4, p.y);
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        }
        ctx.stroke();
      };
      this.closest = (pos, dist = 8) => {
        let i = 0;
        let index = -1;
        dist *= dist;
        for (const p of $points) {
          let x = pos.x - p.x;
          let y = pos.y - p.y;
          let d2 = x * x + y * y;
          if (d2 < dist) {
            dist = d2;
            index = i;
          }
          i++;
        }
        if (index > -1) {
          return $points[index];
        }
      };
    };

    const drawCircle = (pos, color = '#f14668', size = 8) => {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
      ctx.stroke();
    }

    const polygon = new Poly();
    let activePoint, cursor;
    let dragging = false;

    const update = () => {
      if (mouse.update) {
        cursor = 'crosshair';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!dragging) {
          activePoint = polygon.closest(mouse);
        }
        if (activePoint === undefined && mouse.button) {
          polygon.addPoint(mouse);
          mouse.button = false;
        } else if (activePoint) {
          if (mouse.button) {
            if (dragging) {
              activePoint.x += mouse.x - mouse.lx;
              activePoint.y += mouse.y - mouse.ly;
              $points = $points;
            } else {
              dragging = true;
            }
          } else {
            dragging = false;
          }
        }
        polygon.draw();
        if (activePoint) {
          drawCircle(activePoint);
          cursor = 'move';
        }

        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        canvas.style.cursor = cursor;
        mouse.update = false;
      }
      requestAnimationFrame(update);
    }

    const frame = requestAnimationFrame(update);

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
  on:mousemove={mouseEvents}
></canvas>
