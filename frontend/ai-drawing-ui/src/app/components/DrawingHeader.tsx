import { DrawingPicker, DrawingToolbar } from "../../features/drawings";
import type { Drawing } from "../../types/models";

interface DrawingHeaderProps {
  drawings: Drawing[];
  currentId: string | null;
  isLoadingDrawings: boolean;
  hasLoaded: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  onLoadDrawings: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  hasCurrentDrawing: boolean;
}

export function DrawingHeader({
  drawings,
  currentId,
  isLoadingDrawings,
  hasLoaded,
  canUndo,
  canRedo,
  isSaving,
  onSelect,
  onCreateNew,
  onLoadDrawings,
  onUndo,
  onRedo,
  onClear,
  onSave,
  hasCurrentDrawing,
}: DrawingHeaderProps) {
  return (
    <header className="topbar">
      <div className="left">
        <DrawingPicker
          drawings={drawings}
          currentId={currentId}
          isLoading={isLoadingDrawings}
          hasLoaded={hasLoaded}
          onSelect={onSelect}
          onCreateNew={onCreateNew}
          onLoadDrawings={onLoadDrawings}
        />
      </div>

      <div className="right">
        <DrawingToolbar
          canUndo={canUndo}
          canRedo={canRedo}
          isSaving={isSaving}
          onUndo={onUndo}
          onRedo={onRedo}
          onClear={onClear}
          onSave={onSave}
          hasCurrentDrawing={hasCurrentDrawing}
        />
      </div>
    </header>
  );
}

