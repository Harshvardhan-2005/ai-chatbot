import { Bot } from "lucide-react";

import { Card } from "../ui/card";
import Skeleton from "../ui/skeleton";
import AssistantCard from "./AssistantCard";

function AssistantGrid({ assistants, isLoading, onEdit, onDelete, isDeleting }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-52 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (assistants.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot size={20} strokeWidth={1.8} />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            No assistants found
          </p>
          <p className="text-sm text-muted-foreground">
            Create your first assistant or try a different search.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assistants.map((assistant) => (
        <AssistantCard
          key={assistant.id}
          assistant={assistant}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}

export default AssistantGrid;
