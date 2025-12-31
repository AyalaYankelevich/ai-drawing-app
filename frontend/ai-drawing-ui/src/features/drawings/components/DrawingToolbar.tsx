import { Button } from "../../../ui/Button";
import { Spinner } from "../../../ui/Spinner";

interface DrawingToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  hasCurrentDrawing: boolean;
}

export function DrawingToolbar({
  canUndo,
  canRedo,
  isSaving,
  onUndo,
  onRedo,
  onClear,
  onSave,
  hasCurrentDrawing,
}: DrawingToolbarProps) {
  return (
    <>
      <Button onClick={onUndo} disabled={!canUndo}>Undo</Button>
      <Button onClick={onRedo} disabled={!canRedo}>Redo</Button>
      <Button variant="danger" onClick={onClear}>Clear</Button>
      <Button variant="success" onClick={onSave} disabled={!hasCurrentDrawing || isSaving}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          {isSaving ? <Spinner size={14} /> : <span style={{ width: 14, height: 14, display: "inline-block" }} />}
          Save
        </span>
      </Button>
    </>
  );
}

