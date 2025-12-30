import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

export function ChatPanel() {
  return (
    <div className="chatWrap">
      <div className="chatTitle">Chat</div>

      <div className="chatList">
        <div className="bubble user">draw sun and grass with tree</div>
        <div className="bubble assistant">now add person</div>
      </div>

      <div className="chatInputRow">
        <Input placeholder="כתוב הוראה..." />
        <Button variant="primary">Send</Button>
      </div>
    </div>
  );
}
