import { Input } from "../../../ui/Input";
import { Button } from "../../../ui/Button";
import { Spinner } from "../../../ui/Spinner";

interface ChatInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
  isDisabled: boolean;
  placeholder?: string;
}

export function ChatInput({
  prompt,
  onPromptChange,
  onSend,
  isSending,
  isDisabled,
  placeholder = "כתוב הוראה...",
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSending && !isDisabled && prompt.trim()) {
      onSend();
    }
  };

  return (
    <div className="chatInputRow">
      <Input
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
      />
      <Button variant="primary" onClick={onSend} disabled={isSending || isDisabled}>
        {isSending ? <Spinner size={14} /> : null} Send
      </Button>
    </div>
  );
}

