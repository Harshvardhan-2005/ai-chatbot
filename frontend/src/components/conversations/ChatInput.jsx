import { Send } from "lucide-react";
import { useState } from "react";

function ChatInput({ onSend, loading }) {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const content = message.trim();

    if (!content || loading) {
      return;
    }

    onSend(content);
    setMessage("");
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
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
