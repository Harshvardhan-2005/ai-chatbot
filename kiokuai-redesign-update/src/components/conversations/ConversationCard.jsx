import { MessageSquare, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function ConversationCard({ conversation, chatbotName, onOpen, onEdit, onDelete }) {
  const updatedAt = new Date(conversation.updated_at).toLocaleString();

  return (
    <Card className="transition-colors hover:border-primary/30">
      <CardContent className="flex items-start justify-between gap-2 p-5">
        <button
          type="button"
          className="flex flex-1 items-start gap-3 text-left"
          onClick={() => onOpen(conversation.id)}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquare size={17} strokeWidth={1.8} />
          </div>

          <div className="min-w-0 space-y-0.5">
            <h2 className="truncate text-sm font-semibold text-foreground">
              {conversation.title}
            </h2>

            <p className="truncate text-xs text-muted-foreground">
              {chatbotName || `Assistant #${conversation.chatbot_id}`}
            </p>

            <p className="text-[11px] text-muted-foreground">
              Updated {updatedAt}
            </p>
          </div>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Conversation actions"
            >
              <MoreHorizontal size={17} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => onEdit(conversation)}>
              <Pencil size={14} />
              Rename
            </DropdownMenuItem>

            <DropdownMenuItem destructive onSelect={() => onDelete(conversation)}>
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}

export default ConversationCard;
