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
  const loadDrawings = useCallback(async () => {
    if (hasLoaded) return; // Already loaded, skip

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
      // If drawings haven't been loaded yet, load them first to get the count
      if (!hasLoaded) {
        await loadDrawings();
      }
      
      const nextNumber = drawings.length + 1;
      const created = await drawingsApi.create({ title: `Drawing #${nextNumber}`, userId: USER_ID });
      setDrawings(prev => [created, ...prev]);
      setCurrentId(created.id);
      return created;
    } catch (e: any) {
      setError(e?.message ?? "Failed to create drawing");
      throw e;
    }
  }, [hasLoaded, drawings.length, loadDrawings]);

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

