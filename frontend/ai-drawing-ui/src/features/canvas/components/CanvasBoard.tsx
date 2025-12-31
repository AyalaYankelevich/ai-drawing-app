import { useEffect, useRef } from "react";
import type { Shape } from "../../../types/models";
import { drawShapes } from "../utils/canvasDraw";

interface CanvasBoardProps {
  shapes: Shape[];
}

export function CanvasBoard({ shapes }: CanvasBoardProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;

    const ctx = c.getContext("2d");
    if (!ctx) return;

    // Clear and redraw smoothly
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, c.width, c.height);
    
    drawShapes(ctx, shapes);
  }, [shapes]);

  return (
    <div className="canvasWrap">
      <div className="canvasFrame">
        <canvas ref={ref} width={900} height={520} className="canvas" />
      </div>
    </div>
  );
}

