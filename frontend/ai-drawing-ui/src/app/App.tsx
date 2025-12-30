import { DrawingPicker } from "../features/drawings/DrawingPicker";
import { ChatPanel } from "../features/chat/ChatPanel";
import { CanvasBoard } from "../features/canvas/CanvasBoard";
import { Button } from "../ui/Button";

export default function App() {
  return (
    <div className="page">
      <header className="topbar">
        <div className="left">
          <DrawingPicker />
          <Button variant="primary">+ New Drawing</Button>
        </div>

        <div className="right">
          <Button>Undo</Button>
          <Button>Redo</Button>
          <Button variant="danger">Clear</Button>
          <Button variant="success">Save</Button>
        </div>
      </header>

      <main className="layout">
        <section className="panel chat">
          <ChatPanel />
        </section>

        <section className="panel canvas">
          <CanvasBoard />
        </section>
      </main>
    </div>
  );
}
