import { useChat } from "../hooks/useChat";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import type { Shape } from "../../../types/models";

interface ChatPanelProps {
  drawingId: string | null;
  currentShapes: Shape[];
  onShapesAppend: (shapes: Shape[]) => void;
  isLoadingDrawing?: boolean;
}

export function ChatPanel({ drawingId, currentShapes, onShapesAppend, isLoadingDrawing = false }: ChatPanelProps) {
  const { messages, prompt, setPrompt, isLoading, isSending, error, send } = useChat(
    drawingId,
    currentShapes,
    onShapesAppend
  );

  return (
    <div className="chatWrap">
      <div className="chatTitle">Chat</div>

      {error ? (
        <div style={{ padding: 12, color: "crimson", whiteSpace: "pre-wrap" }}>{error}</div>
      ) : null}

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        isLoadingDrawing={isLoadingDrawing}
      />

      <ChatInput
        prompt={prompt}
        onPromptChange={setPrompt}
        onSend={send}
        isSending={isSending}
        isDisabled={!drawingId}
      />
    </div>
  );
}

