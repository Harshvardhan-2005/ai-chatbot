import { Database } from "lucide-react";

import { Card } from "../ui/card";
import Skeleton from "../ui/skeleton";
import KnowledgeCard from "./KnowledgeCard";

function KnowledgeGrid({ knowledgeBases, isLoading, onEdit, onDelete, isDeleting }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-44 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (knowledgeBases.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Database size={20} strokeWidth={1.8} />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            No knowledge sources found
          </p>
          <p className="text-sm text-muted-foreground">
            Add knowledge or try a different search.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {knowledgeBases.map((knowledge) => (
        <KnowledgeCard
          key={knowledge.id}
          knowledge={knowledge}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}

export default KnowledgeGrid;
