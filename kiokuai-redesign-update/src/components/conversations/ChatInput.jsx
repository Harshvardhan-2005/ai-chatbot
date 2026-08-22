import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function ChatInput({ onSend, loading }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  // Automatically focus the input when the conversation opens
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Allow typing anywhere on the page
  useEffect(() => {
    function handleGlobalKeyDown(event) {
      // Don't interfere with inputs, textareas, buttons, links, etc.
      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLButtonElement ||
        target instanceof HTMLSelectElement ||
        target.isContentEditable
      ) {
        return;
      }

      // Don't interfere with browser/OS shortcuts
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      // Only capture normal printable characters
      if (event.key.length !== 1 || loading) {
        return;
      }

      event.preventDefault();

      textareaRef.current?.focus();

      // Capture the first character that triggered the focus
      setMessage((current) => current + event.key);
    }

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [loading]);

  function handleSubmit(event) {
    event.preventDefault();

    const content = message.trim();

    if (!content || loading) {
      return;
    }

    onSend(content);
    setMessage("");

    // Keep the input ready for the next message
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }

  return (
    <form
      className="flex items-end gap-2 rounded-xl border border-input bg-background p-2 shadow-subtle focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 focus-within:ring-offset-background"
      onSubmit={handleSubmit}
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Ask your assistant..."
        rows={1}
        disabled={loading}
        className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
      />

      <button
        type="submit"
        disabled={loading || !message.trim()}
        aria-label="Send message"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send size={15} />
      </button>
    </form>
  );
}

export default ChatInput;
