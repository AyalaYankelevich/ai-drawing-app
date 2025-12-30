import { useEffect, useMemo, useState } from "react";
import type { Drawing, DrawingMessage, Shape } from "../types/models";
import { drawingsApi } from "../api/drawings.api";
import { messagesApi } from "../api/messages.api";
import { aiApi } from "../api/ai.api";
import { CanvasBoard } from "../features/canvas/CanvasBoard";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Spinner } from "../ui/Spinner";
import { initHistory, push, redo, undo, type HistoryState } from "../utils/history";

const USER_ID = "00000000-0000-0000-0000-000000000001";

function safeParseShapes(json: string): Shape[] {
  try {
    const arr = JSON.parse(json);
    if (Array.isArray(arr)) return arr as Shape[];
    return [];
  } catch {
    return [];
  }
}

export default function App() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const current = useMemo(() => drawings.find(d => d.id === currentId) ?? null, [drawings, currentId]);

  const [messages, setMessages] = useState<DrawingMessage[]>([]);
  const [prompt, setPrompt] = useState("");

  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDrawing, setIsLoadingDrawing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryState<Shape[]>>(initHistory<Shape[]>([]));

  // Load drawings list on mount
  useEffect(() => {
    (async () => {
      setError(null);
      setIsLoadingList(true);
      try {
        const list = await drawingsApi.listByUser(USER_ID);
        setDrawings(list);

        if (list.length > 0) {
          setCurrentId(list[0].id);
        } else {
          // create first drawing
          const created = await drawingsApi.create({ title: "Drawing #1", userId: USER_ID });
          setDrawings([created]);
          setCurrentId(created.id);
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to load drawings");
      } finally {
        setIsLoadingList(false);
      }
    })();
  }, []);

  // Load drawing + messages when currentId changes
  useEffect(() => {
    if (!currentId) return;

    (async () => {
      setError(null);
      setIsLoadingDrawing(true);
      try {
        const d = await drawingsApi.getById(currentId);
        // update current in list
        setDrawings(prev => prev.map(x => (x.id === d.id ? d : x)));

        const shapes = safeParseShapes(d.drawingJson || "[]");
        setHistory(initHistory(shapes));

        const msgs = await messagesApi.list(currentId);
        setMessages(msgs);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load drawing");
      } finally {
        setIsLoadingDrawing(false);
      }
    })();
  }, [currentId]);

  async function onNewDrawing() {
    setError(null);
    try {
      const nextNumber = drawings.length + 1;
      const created = await drawingsApi.create({ title: `Drawing #${nextNumber}`, userId: USER_ID });
      setDrawings(prev => [created, ...prev]);
      setCurrentId(created.id);
      setMessages([]);
      setHistory(initHistory([]));
    } catch (e: any) {
      setError(e?.message ?? "Failed to create drawing");
    }
  }

  async function onSave() {
    if (!current) return;
    setError(null);
    setIsSaving(true);
    try {
      const drawingJson = JSON.stringify(history.present);
      const updated = await drawingsApi.update(current.id, {
        title: current.title,
        drawingJson,
      });
      setDrawings(prev => prev.map(x => (x.id === updated.id ? updated : x)));
    } catch (e: any) {
      setError(e?.message ?? "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }

  function onClear() {
    setHistory(h => push(h, []));
  }

  function onUndo() {
    setHistory(h => undo(h));
  }

  function onRedo() {
    setHistory(h => redo(h));
  }

  async function onSend() {
    if (!currentId) return;
    const text = prompt.trim();
    if (!text) return;

    setError(null);
    setIsSending(true);

    try {
      // 1) save user message
      const userMsg = await messagesApi.add(currentId, { role: "user", messageText: text });
      setMessages(prev => [...prev, userMsg]);
      setPrompt("");

      // 2) call AI
      const aiRes = await aiApi.generate({ drawingId: currentId, prompt: text });
      const shapesJson = aiRes.shapesJson ?? aiRes.responseJson ?? "[]";
      const shapes = safeParseShapes(shapesJson);

      // 3) update canvas
      setHistory(h => push(h, shapes));

      // 4) save assistant message (optional, but matches figma)
      const assistantMsg = await messagesApi.add(currentId, {
        role: "assistant",
        messageText: "בוצע ✅",
      });
      setMessages(prev => [...prev, assistantMsg]);

      // 5) auto-save drawing after AI (optional but feels great)
      const d = await drawingsApi.getById(currentId);
      await drawingsApi.update(currentId, {
        title: d.title,
        drawingJson: JSON.stringify(shapes),
      });
    } catch (e: any) {
      setError(e?.message ?? "Failed to send");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="left">
          {isLoadingList ? (
            <Spinner label="Loading drawings..." />
          ) : (
            <Select
              value={currentId ?? ""}
              onChange={(e) => setCurrentId(e.target.value)}
            >
              {drawings.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </Select>
          )}

          <Button variant="primary" onClick={onNewDrawing}>+ New Drawing</Button>
        </div>

        <div className="right">
          <Button onClick={onUndo} disabled={history.past.length === 0}>Undo</Button>
          <Button onClick={onRedo} disabled={history.future.length === 0}>Redo</Button>
          <Button variant="danger" onClick={onClear}>Clear</Button>
          <Button variant="success" onClick={onSave} disabled={!current || isSaving}>
            {isSaving ? <Spinner size={14} /> : null} Save
          </Button>
        </div>
      </header>

      <main className="layout">
        <section className="panel chat">
          <div className="chatWrap">
            <div className="chatTitle">Chat</div>

            {error ? (
              <div style={{ padding: 12, color: "crimson", whiteSpace: "pre-wrap" }}>{error}</div>
            ) : null}

            <div className="chatList">
              {isLoadingDrawing ? <Spinner label="Loading..." /> : null}
              {messages.map(m => (
                <div key={m.id} className={`bubble ${m.role === "user" ? "user" : "assistant"}`}>
                  {m.messageText}
                </div>
              ))}
            </div>

            <div className="chatInputRow">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="כתוב הוראה..."
              />
              <Button variant="primary" onClick={onSend} disabled={isSending || !currentId}>
                {isSending ? <Spinner size={14} /> : null} Send
              </Button>
            </div>
          </div>
        </section>

        <section className="panel canvas">
          <CanvasBoard shapes={history.present} />
        </section>
      </main>
    </div>
  );
}
