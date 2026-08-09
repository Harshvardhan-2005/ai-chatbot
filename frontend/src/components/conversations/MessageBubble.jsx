function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`message-bubble-row ${
        isUser ? "message-bubble-row--user" : "message-bubble-row--assistant"
      }`}
    >
      <div
        className={`message-bubble ${
          isUser ? "message-bubble--user" : "message-bubble--assistant"
        }`}
      >
        <p>{message.content}</p>

        <span>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;
