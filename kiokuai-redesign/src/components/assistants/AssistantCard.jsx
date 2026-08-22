import {
  Bot,
  Database,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Badge from "../ui/badge";
import Button from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function AssistantCard({ assistant, onEdit, onDelete, isDeleting = false }) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col transition-colors hover:border-primary/30">
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bot size={18} strokeWidth={1.8} />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={assistant.is_active ? "success" : "secondary"}>
              {assistant.is_active ? "Active" : "Inactive"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label={`Open actions for ${assistant.name}`}
                >
                  <MoreHorizontal size={17} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => onEdit(assistant)}>
                  <Pencil size={14} />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  destructive
                  disabled={isDeleting}
                  onSelect={() => onDelete(assistant)}
                >
                  <Trash2 size={14} />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="truncate text-sm font-semibold text-foreground">
            {assistant.name}
          </h2>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {assistant.description}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Model</span>
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
            {assistant.model_name}
          </span>
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/assistants/${assistant.id}/knowledge`)}
        >
          <Database size={15} />
          Knowledge
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/assistants/${assistant.id}/playground`)}
        >
          <MessageSquare size={15} />
          Playground
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AssistantCard;
