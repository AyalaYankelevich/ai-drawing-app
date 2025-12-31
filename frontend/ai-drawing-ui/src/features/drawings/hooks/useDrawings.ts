import { useCallback, useState } from "react";
import { drawingsApi } from "../../../api/drawings.api";
import type { Drawing } from "../../../types/models";

const USER_ID = "00000000-0000-0000-0000-000000000001";

export function useDrawings() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const current = drawings.find(d => d.id === currentId) ?? null;

  // Load drawings list on demand (lazy loading)
  const loadDrawings = useCallback(async (forceReload = false) => {
    if (hasLoaded && !forceReload) return; // Already loaded, skip unless forced

    setError(null);
    setIsLoading(true);
    try {
      const list = await drawingsApi.listByUser(USER_ID);
      setDrawings(list);
      setHasLoaded(true);
      // Don't auto-select - let user choose manually
    } catch (e: any) {
      setError(e?.message ?? "Failed to load drawings");
    } finally {
      setIsLoading(false);
    }
  }, [hasLoaded]);

  const createNewDrawing = useCallback(async () => {
    setError(null);
    try {
      // Always reload drawings list first to ensure we have the latest data
      // This prevents duplicate numbers and ensures accuracy
      const currentList = await drawingsApi.listByUser(USER_ID);
      setDrawings(currentList);
      setHasLoaded(true);
      
      // Calculate next number based on existing drawing numbers, not just count
      // Extract numbers from titles like "Drawing #1", "Drawing #2", etc.
      const existingNumbers = currentList
        .map(d => {
          const match = d.title.match(/^Drawing #(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(n => n > 0);
      
      const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
      const nextNumber = maxNumber + 1;
      
      const created = await drawingsApi.create({ title: `Drawing #${nextNumber}`, userId: USER_ID });
      
      // Reload drawings list again to include the newly created drawing
      const updatedList = await drawingsApi.listByUser(USER_ID);
      setDrawings(updatedList);
      setCurrentId(created.id);
      return created;
    } catch (e: any) {
      setError(e?.message ?? "Failed to create drawing");
      throw e;
    }
  }, []);

  const updateDrawing = useCallback(async (id: string, title: string, drawingJson: string) => {
    setError(null);
    try {
      const updated = await drawingsApi.update(id, { title, drawingJson });
      setDrawings(prev => prev.map(x => (x.id === updated.id ? updated : x)));
      return updated;
    } catch (e: any) {
      setError(e?.message ?? "Failed to save");
      throw e;
    }
  }, []);

  const loadDrawing = useCallback(async (id: string) => {
    setError(null);
    try {
      const d = await drawingsApi.getById(id);
      setDrawings(prev => prev.map(x => (x.id === d.id ? d : x)));
      return d;
    } catch (e: any) {
      setError(e?.message ?? "Failed to load drawing");
      throw e;
    }
  }, []);

  return {
    drawings,
    currentId,
    current,
    isLoading,
    error,
    hasLoaded,
    setCurrentId,
    loadDrawings,
    createNewDrawing,
    updateDrawing,
    loadDrawing,
  };
}

