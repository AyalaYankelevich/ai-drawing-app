import { useEffect, useState } from "react";
import { messagesApi } from "../../../api/messages.api";
import { aiApi } from "../../../api/ai.api";
import type { DrawingMessage, Shape } from "../../../types/models";

function safeParseShapes(json: string): Shape[] {
  try {
    const arr = JSON.parse(json);
    if (Array.isArray(arr)) return arr as Shape[];
    return [];
  } catch {
    return [];
  }
}

export function useChat(drawingId: string | null, currentShapes: Shape[], onShapesAppend: (shapes: Shape[]) => void) {
  const [messages, setMessages] = useState<DrawingMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages when drawingId changes - but don't reload if already loaded for this drawing
  useEffect(() => {
    if (!drawingId) {
      setMessages([]);
      setPrompt("");
      setError(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setError(null);
      setIsLoading(true);
      try {
        const msgs = await messagesApi.list(drawingId);
        if (!cancelled) {
          setMessages(msgs);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Failed to load messages");
          setMessages([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [drawingId]);

  async function send() {
    if (!drawingId) return;
    const text = prompt.trim();
    if (!text) return;

    setError(null);
    setIsSending(true);

    try {
      // 1) save user message
      const userMsg = await messagesApi.add(drawingId, { role: "user", messageText: text });
      setMessages(prev => [...prev, userMsg]);
      setPrompt("");

      // 2) call AI - use current shapes at the moment of sending (capture current state)
      const currentShapesJson = JSON.stringify(currentShapes);
      const aiRes = await aiApi.generate({
        drawingId,
        prompt: text,
        currentDrawingJson: currentShapesJson,
      });

      const shapesJson = aiRes.shapesJson ?? aiRes.responseJson ?? "[]";
      const shapes = safeParseShapes(shapesJson);
      if (shapes.length === 0) {
        const errorMsg = await messagesApi.add(drawingId, { role: "assistant", messageText: "לא הצלחתי להוסיף לציור. נסי ניסוח אחר." });
        setMessages(prev => [...prev, errorMsg]);
        return;
      }

      // 3) update canvas - CRITICAL: Append shapes immediately and synchronously
      // Use a function to ensure we get the latest state
      onShapesAppend(shapes);

      // 4) save assistant message
      const assistantMsg = await messagesApi.add(drawingId, {
        role: "assistant",
        messageText: "בוצע ✅",
      });
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: any) {
      setError(e?.message ?? "Failed to send");
      const errorMsg = await messagesApi.add(drawingId, {
        role: "assistant",
        messageText: `שגיאה: ${e?.message ?? "נכשל בשליחה"}`,
      }).catch(() => null);
      if (errorMsg) {
        setMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      setIsSending(false);
    }
  }

  return {
    messages,
    prompt,
    setPrompt,
    isLoading,
    isSending,
    error,
    send,
  };
}

