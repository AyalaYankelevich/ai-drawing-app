import { http } from "./client";

export type AiGenerateRequest = { drawingId: string; prompt: string };

// אצלך זה כנראה { shapesJson: "..." }
export type AiGenerateResponse = { shapesJson?: string; responseJson?: string };

export const aiApi = {
  generate: (req: AiGenerateRequest) =>
    http.post<AiGenerateResponse>(`/api/ai/generate`, req),
};
