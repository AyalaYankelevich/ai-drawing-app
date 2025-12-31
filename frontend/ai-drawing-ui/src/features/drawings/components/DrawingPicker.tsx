import { Select } from "../../../ui/Select";
import { Button } from "../../../ui/Button";
import { Spinner } from "../../../ui/Spinner";
import type { Drawing } from "../../../types/models";

interface DrawingPickerProps {
  drawings: Drawing[];
  currentId: string | null;
  isLoading: boolean;
  hasLoaded: boolean;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  onLoadDrawings: () => void;
}

export function DrawingPicker({ 
  drawings, 
  currentId, 
  isLoading, 
  hasLoaded,
  onSelect, 
  onCreateNew,
  onLoadDrawings 
}: DrawingPickerProps) {
  const handleSelectFocus = () => {
    // Load drawings list ONLY when user clicks on select (not automatically)
    if (!hasLoaded && !isLoading) {
      onLoadDrawings();
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    // Only select if user chose an actual drawing (not the default option)
    if (selectedId && selectedId !== "" && selectedId !== currentId) {
      // User selected a specific drawing - this will trigger loading that drawing's data
      onSelect(selectedId);
    }
    // If selectedId is "", user chose "Select a drawing" - do nothing
  };

  return (
    <>
      {isLoading ? (
        <Spinner label="Loading drawings..." />
      ) : (
        <Select
          value={currentId ?? ""}
          onChange={handleSelectChange}
          onFocus={handleSelectFocus}
          onClick={handleSelectFocus}
        >
          {drawings.length === 0 && !hasLoaded ? (
            <option value="">Click to load drawings...</option>
          ) : (
            <>
              <option value="">-- Select a drawing --</option>
              {drawings.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </>
          )}
        </Select>
      )}

      <Button variant="primary" onClick={onCreateNew}>+ New Drawing</Button>
    </>
  );
}

