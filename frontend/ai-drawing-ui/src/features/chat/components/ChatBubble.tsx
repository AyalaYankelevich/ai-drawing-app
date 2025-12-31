import type { DrawingMessage } from "../../../types/models";

interface ChatBubbleProps {
  message: DrawingMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  return (
    <div className={`bubble ${message.role === "user" ? "user" : "assistant"}`}>
      {message.messageText}
    </div>
  );
}

