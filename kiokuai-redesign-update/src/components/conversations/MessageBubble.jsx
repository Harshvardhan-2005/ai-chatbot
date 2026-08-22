import { cn } from "../../lib/utils";

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  const timestamp = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75ch] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-subtle sm:max-w-[65ch]",
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm border border-border bg-card text-card-foreground",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>

        <span
          className={cn(
            "mt-1 block text-[10px]",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {timestamp}
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;
