import { http } from "./client";
import type { DrawingMessage } from "../types/models";

export type CreateMessageRequest = { role: string; messageText: string };

export const messagesApi = {
  list: (drawingId: string) =>
    http.get<DrawingMessage[]>(`/api/drawings/${drawingId}/messages`),

  add: (drawingId: string, req: CreateMessageRequest) =>
    http.post<DrawingMessage>(`/api/drawings/${drawingId}/messages`, req),
};
