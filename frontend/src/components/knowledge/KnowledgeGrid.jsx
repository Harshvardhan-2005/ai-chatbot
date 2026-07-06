import { Database } from "lucide-react";

import KnowledgeCard from "./KnowledgeCard";

function KnowledgeGrid({
  knowledgeBases,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}) {
  if (isLoading) {
    return (
      <div className="knowledge-state">
        <div className="knowledge-state__icon">
          <Database size={24} />
        </div>

        <h2>Loading knowledge</h2>

        <p>Fetching this assistant's knowledge sources.</p>
      </div>
    );
  }

  if (knowledgeBases.length === 0) {
    return (
      <div className="knowledge-state">
        <div className="knowledge-state__icon">
          <Database size={24} />
        </div>

        <h2>No knowledge sources found</h2>

        <p>Add knowledge or try a different search.</p>
      </div>
    );
  }

  return (
    <div className="knowledge-grid">
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
