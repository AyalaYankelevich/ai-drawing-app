import { useCallback, useEffect, useState } from "react";
import { useDrawings } from "../../features/drawings";
import { useCanvasHistory } from "../../features/canvas";
import type { Shape } from "../../types/models";

function safeParseShapes(json: string) {
  try {
    const arr = JSON.parse(json);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

export function useDrawingWorkspace() {
  const {
    drawings,
    currentId,
    current,
    isLoading: isLoadingDrawings,
    hasLoaded,
    setCurrentId,
    loadDrawings,
    createNewDrawing,
    updateDrawing,
    loadDrawing,
  } = useDrawings();

  const [isLoadingDrawing, setIsLoadingDrawing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    shapes,
    canUndo,
    canRedo,
    appendShapes,
    clearShapes,
    undoHistory,
    redoHistory,
    resetHistory,
  } = useCanvasHistory([]);

  // Load drawing data ONLY when currentId changes (user selects a drawing)
  useEffect(() => {
    if (!currentId) {
      // Clear canvas and chat when no drawing selected
      resetHistory([]);
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoadingDrawing(true);
      try {
        // Load the specific drawing's data
        const d = await loadDrawing(currentId);
        if (!cancelled) {
          const shapes = safeParseShapes(d.drawingJson || "[]");
          // Reset history with loaded shapes - this will trigger chat to load messages
          resetHistory(shapes);
        }
      } catch (e) {
        if (!cancelled) {
          resetHistory([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingDrawing(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentId, loadDrawing, resetHistory]);

  const handleNewDrawing = useCallback(async () => {
    try {
      await createNewDrawing();
      resetHistory([]);
    } catch (e) {
      // Error already handled in useDrawings
    }
  }, [createNewDrawing, resetHistory]);

  const handleSave = useCallback(async () => {
    if (!current) return;
    setIsSaving(true);
    try {
      await updateDrawing(current.id, current.title, JSON.stringify(shapes));
      // Success - drawing saved! (error handling is in useDrawings)
    } catch (e) {
      // Error already handled in useDrawings
    } finally {
      setIsSaving(false);
    }
  }, [current, shapes, updateDrawing]);

  // Stable reference for appendShapes to prevent re-renders and ensure shapes persist
  const handleShapesAppend = useCallback((newShapes: Shape[]) => {
    // CRITICAL: Append shapes immediately without any delays
    // This ensures shapes are added to the canvas and persist
    appendShapes(newShapes);
  }, [appendShapes]);

  return {
    // Drawings
    drawings,
    currentId,
    current,
    isLoadingDrawings,
    hasLoaded,
    setCurrentId,
    loadDrawings,
    handleNewDrawing,
    handleSave,
    // Canvas
    shapes,
    canUndo,
    canRedo,
    undoHistory,
    redoHistory,
    clearShapes,
    appendShapes: handleShapesAppend, // Use stable wrapper
    // Loading states
    isLoadingDrawing,
    isSaving,
  };
}

