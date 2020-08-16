export const paint = (canvas, mouse, points, updatePoints) => {
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 2;

  const point = (x, y) => ({ x, y });

  function Polygon() {
    (this.points = points),
      (this.updatePoints = (p) => {
        this.points = p;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    this.addPoint = (p) => {
      this.points.push(point(p.x, p.y));
      updatePoints(this.points);
    };
    this.draw = () => {
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#3298dc';
      ctx.beginPath();
      for (const p of this.points) {
        ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      for (const p of this.points) {
        ctx.moveTo(p.x + 4, p.y);
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      }
      ctx.stroke();
    };
    this.closest = (pos, dist = 8) => {
      let i = 0;
      let index = -1;
      dist *= dist;
      for (const p of this.points) {
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
        return this.points[index];
      }
    };
  }

  const drawCircle = (pos, color = '#f14668', size = 8) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    ctx.stroke();
  };

  const polygon = new Polygon();
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
            updatePoints(polygon.points);
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
  };

  const frame = requestAnimationFrame(update);

  return {
    frame,
    polygon,
  };
};
