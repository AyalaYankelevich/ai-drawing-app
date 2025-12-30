import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import type { Shape } from "../../types/models";
import { useChatStore } from "./chat.store";

export function ChatPanel(props: {
  drawingId: string | null;
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
}) {
  const { prompt, setPrompt, isLoading, messages, send } = useChatStore({
    drawingId: props.drawingId,
    shapes: props.shapes,
    setShapes: props.setShapes,
  });

  return (
    <div className="chatWrap">
      <div className="chatTitle">Chat</div>

      <div className="chatList">
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.role === "user" ? "user" : "assistant"}`}>
            {m.messageText}
          </div>
        ))}
        {isLoading && <div className="bubble assistant">חושב...</div>}
      </div>

      <div className="chatInputRow">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="כתוב הוראה..."
          disabled={isLoading}
        />
        <Button variant="primary" onClick={send} disabled={isLoading}>
          Send
        </Button>
      </div>
    </div>
  );
}
