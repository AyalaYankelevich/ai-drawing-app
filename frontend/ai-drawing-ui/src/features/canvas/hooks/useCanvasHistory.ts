import { useCallback, useState } from "react";
import { initHistory, push, redo, undo, type HistoryState } from "../../../utils/history";
import type { Shape } from "../../../types/models";

export function useCanvasHistory(initialShapes: Shape[] = []) {
  const [history, setHistory] = useState<HistoryState<Shape[]>>(initHistory(initialShapes));

  const setShapes = useCallback((shapes: Shape[]) => {
    setHistory(h => push(h, shapes));
  }, []);

  const appendShapes = useCallback((newShapes: Shape[]) => {
    setHistory(h => push(h, [...h.present, ...newShapes]));
  }, []);

  const clearShapes = useCallback(() => {
    setHistory(h => push(h, []));
  }, []);

  const undoHistory = useCallback(() => {
    setHistory(h => undo(h));
  }, []);

  const redoHistory = useCallback(() => {
    setHistory(h => redo(h));
  }, []);

  const resetHistory = useCallback((shapes: Shape[]) => {
    setHistory(initHistory(shapes));
  }, []);

  return {
    shapes: history.present,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    setShapes,
    appendShapes,
    clearShapes,
    undoHistory,
    redoHistory,
    resetHistory,
  };
}

