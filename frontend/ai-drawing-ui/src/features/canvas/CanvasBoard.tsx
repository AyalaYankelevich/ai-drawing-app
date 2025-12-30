import { useEffect, useRef } from "react";
import type { Shape } from "../../types/models";
import { drawShapes } from "./canvasDraw";

export function CanvasBoard({ shapes }: { shapes: Shape[] }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
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

