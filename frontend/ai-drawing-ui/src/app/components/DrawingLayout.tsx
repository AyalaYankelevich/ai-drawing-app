import { ChatPanel } from "../../features/chat";
import { CanvasBoard } from "../../features/canvas";
import type { Shape } from "../../types/models";

interface DrawingLayoutProps {
  drawingId: string | null;
  shapes: Shape[];
  isLoadingDrawing: boolean;
  onShapesAppend: (shapes: Shape[]) => void;
}

export function DrawingLayout({
  drawingId,
  shapes,
  isLoadingDrawing,
  onShapesAppend,
}: DrawingLayoutProps) {
  return (
    <main className="layout">
      <section className="panel chat">
        <ChatPanel
          drawingId={drawingId}
          currentShapes={shapes}
          onShapesAppend={onShapesAppend}
          isLoadingDrawing={isLoadingDrawing}
        />
      </section>

      <section className="panel canvas">
        <CanvasBoard shapes={shapes} />
      </section>
    </main>
  );
}

