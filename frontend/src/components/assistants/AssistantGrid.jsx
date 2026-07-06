import { Bot } from "lucide-react";

import AssistantCard from "./AssistantCard";

function AssistantGrid({
  assistants,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}) {
  if (isLoading) {
    return (
      <div className="assistant-state">
        <div className="assistant-state__icon">
          <Bot size={24} />
        </div>

        <h2>Loading assistants</h2>

        <p>Fetching your assistant workspace.</p>
      </div>
    );
  }

  if (assistants.length === 0) {
    return (
      <div className="assistant-state">
        <div className="assistant-state__icon">
          <Bot size={24} />
        </div>

        <h2>No assistants found</h2>

        <p>Create your first assistant or try a different search.</p>
      </div>
    );
  }

  return (
    <div className="assistant-grid">
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
