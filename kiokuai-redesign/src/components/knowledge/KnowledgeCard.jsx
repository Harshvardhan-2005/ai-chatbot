import { FileText, Globe, MoreHorizontal, Pencil, Trash2, Type } from "lucide-react";

import Badge from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function getSourceIcon(sourceType) {
  if (sourceType === "url") return <Globe size={17} />;
  if (sourceType === "file") return <FileText size={17} />;
  return <Type size={17} />;
}

function getSourceLabel(sourceType) {
  if (sourceType === "url") return "URL";
  if (sourceType === "file") return "File";
  return "Text";
}

function KnowledgeCard({ knowledge, onEdit, onDelete, isDeleting = false }) {
  return (
    <Card className="flex flex-col transition-colors hover:border-primary/30">
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {getSourceIcon(knowledge.source_type)}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">{getSourceLabel(knowledge.source_type)}</Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label={`Open actions for ${knowledge.title}`}
                >
                  <MoreHorizontal size={17} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => onEdit(knowledge)}>
                  <Pencil size={14} />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  destructive
                  disabled={isDeleting}
                  onSelect={() => onDelete(knowledge)}
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
            {knowledge.title}
          </h2>

          <p className="line-clamp-3 text-sm text-muted-foreground">
            {knowledge.content}
          </p>
        </div>
      </CardContent>

      <CardFooter className="justify-between border-t border-border p-3 text-xs text-muted-foreground">
        <span>Knowledge source</span>
        <span className="font-mono">#{knowledge.id}</span>
      </CardFooter>
    </Card>
  );
}

export default KnowledgeCard;
