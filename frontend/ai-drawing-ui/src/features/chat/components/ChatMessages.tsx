import { useEffect, useRef } from "react";
import { Spinner } from "../../../ui/Spinner";
import type { DrawingMessage } from "../../../types/models";
import { ChatBubble } from "./ChatBubble";

interface ChatMessagesProps {
  messages: DrawingMessage[];
  isLoading: boolean;
  isLoadingDrawing?: boolean;
}

export function ChatMessages({ messages, isLoading, isLoadingDrawing = false }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change or loading completes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isLoadingDrawing]);

  // Show spinner only on initial load (when no messages exist yet)
  const showSpinner = (isLoading || isLoadingDrawing) && messages.length === 0;

  return (
    <div className="chatList" ref={scrollRef}>
      {showSpinner ? (
        <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
          <Spinner label="Loading..." />
        </div>
      ) : (
        messages.map(m => (
          <ChatBubble key={m.id} message={m} />
        ))
      )}
    </div>
  );
}

