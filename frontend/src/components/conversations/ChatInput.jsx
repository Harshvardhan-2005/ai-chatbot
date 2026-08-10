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
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type your message..."
        rows={1}
        disabled={loading}
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
      >
        <Send size={17} />
      </button>
    </form>
  );
}

export default ChatInput;
