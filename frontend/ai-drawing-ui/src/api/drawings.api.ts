import { http } from "./client";
import type { Drawing } from "../types/models";

export type CreateDrawingRequest = { title: string; userId: string };
export type UpdateDrawingRequest = { title: string; drawingJson: string };

export const drawingsApi = {
  listByUser: (userId: string) =>
    http.get<Drawing[]>(`/api/Drawings?userId=${encodeURIComponent(userId)}`),

  getById: (id: string) => http.get<Drawing>(`/api/Drawings/${id}`),

  create: (req: CreateDrawingRequest) => http.post<Drawing>(`/api/Drawings`, req),

  update: (id: string, req: UpdateDrawingRequest) => http.put<Drawing>(`/api/Drawings/${id}`, req),
};
