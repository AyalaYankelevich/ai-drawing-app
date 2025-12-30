import type { Shape } from "../../types/models";

export function drawShapes(ctx: CanvasRenderingContext2D, shapes: Shape[]) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const s of shapes) {
    if (s.type === "circle") {
      ctx.beginPath();
      ctx.fillStyle = s.color ?? "black";
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    } else if (s.type === "rect") {
      ctx.fillStyle = s.color ?? "black";
      ctx.fillRect(s.x, s.y, s.w, s.h);
    } else if (s.type === "line") {
      ctx.beginPath();
      ctx.strokeStyle = s.color ?? "black";
      ctx.lineWidth = s.width ?? 2;
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.stroke();
    }
  }
}
