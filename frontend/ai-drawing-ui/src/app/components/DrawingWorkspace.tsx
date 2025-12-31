import { useDrawingWorkspace } from "../hooks/useDrawingWorkspace";
import { DrawingHeader } from "./DrawingHeader";
import { DrawingLayout } from "./DrawingLayout";

export function DrawingWorkspace() {
  const {
    drawings,
    currentId,
    current,
    isLoadingDrawings,
    hasLoaded,
    setCurrentId,
    loadDrawings,
    handleNewDrawing,
    handleSave,
    shapes,
    canUndo,
    canRedo,
    undoHistory,
    redoHistory,
    clearShapes,
    appendShapes,
    isLoadingDrawing,
    isSaving,
  } = useDrawingWorkspace();

  return (
    <div className="page">
      <DrawingHeader
        drawings={drawings}
        currentId={currentId}
        isLoadingDrawings={isLoadingDrawings}
        hasLoaded={hasLoaded}
        canUndo={canUndo}
        canRedo={canRedo}
        isSaving={isSaving}
        onSelect={setCurrentId}
        onCreateNew={handleNewDrawing}
        onLoadDrawings={loadDrawings}
        onUndo={undoHistory}
        onRedo={redoHistory}
        onClear={clearShapes}
        onSave={handleSave}
        hasCurrentDrawing={!!current}
      />

      <DrawingLayout
        drawingId={currentId}
        shapes={shapes}
        isLoadingDrawing={isLoadingDrawing}
        onShapesAppend={appendShapes}
      />
    </div>
  );
}
