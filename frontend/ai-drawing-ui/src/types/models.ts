export type Shape =
  | { type: "circle"; x: number; y: number; r: number; color?: string }
  | { type: "rect"; x: number; y: number; w: number; h: number; color?: string }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number; color?: string; width?: number };

export type Drawing = {
  id: string;
  userId: string;
  title: string;
  drawingJson: string;
  createdAt: string;
  updatedAt?: string | null;
};

export type DrawingMessage = {
  id: string;
  drawingId: string;
  role: "user" | "assistant" | string;
  messageText: string;
  createdAt: string;
};
