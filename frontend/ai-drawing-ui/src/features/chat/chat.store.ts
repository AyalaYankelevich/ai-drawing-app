import { useMemo, useState } from "react";
import { aiApi } from "../../api/ai.api";
import type { DrawingMessage, Shape } from "../../types/models";

const USER_ID = "00000000-0000-0000-0000-000000000001";

export function useChatStore(opts: {
  drawingId: string | null;
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
}) {
  const { drawingId, setShapes } = opts;

  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<DrawingMessage[]>([]);

  const send = useMemo(() => {
    return async () => {
      const text = prompt.trim();
      if (!text) return;

      if (!drawingId) {
        alert("בחרי ציור קודם לפני שליחה");
        return;
      }

      // user bubble
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          drawingId,
          role: "user",
          messageText: text,
          createdAt: new Date().toISOString(),
        },
      ]);

      setIsLoading(true);
      setPrompt("");

      try {
        const res = await aiApi.generate({ drawingId, prompt: text });

        const newShapes: Shape[] = JSON.parse(res.shapesJson ?? "[]");

        // ✅ append
        setShapes((prev) => [...prev, ...newShapes]);

        // assistant bubble
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            drawingId,
            role: "assistant",
            messageText: "בוצע ✅",
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch (e) {
        console.error(e);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            drawingId,
            role: "assistant",
            messageText: "שגיאה בקריאה ל-AI",
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
  }, [prompt, drawingId, setShapes]);

  return { USER_ID, prompt, setPrompt, isLoading, messages, send };
}
