import {
  Bot,
  Database,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AssistantCard({ assistant, onEdit, onDelete, isDeleting = false }) {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit(assistant);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDelete(assistant);
  };

  return (
    <article className="assistant-card">
      <div className="assistant-card__header">
        <div className="assistant-card__icon">
          <Bot size={21} />
        </div>

        <div className="assistant-card__menu-wrapper">
          <button
            type="button"
            className="assistant-card__menu-button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={`Open actions for ${assistant.name}`}
          >
            <MoreHorizontal size={19} />
          </button>

          {isMenuOpen ? (
            <div className="assistant-card__menu">
              <button
                type="button"
                className="assistant-card__menu-item"
                onClick={handleEdit}
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                type="button"
                className="assistant-card__menu-item assistant-card__menu-item--danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="assistant-card__content">
        <div className="assistant-card__title-row">
          <h2 className="assistant-card__title">{assistant.name}</h2>

          <span
            className={
              assistant.is_active
                ? "assistant-status assistant-status--active"
                : "assistant-status assistant-status--inactive"
            }
          >
            {assistant.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="assistant-card__description">{assistant.description}</p>

        <div className="assistant-card__model">
          <span>Model</span>

          <strong>{assistant.model_name}</strong>
        </div>
      </div>

      <div className="assistant-card__actions">
        <button
          type="button"
          className="assistant-card__action"
          onClick={() => navigate(`/assistants/${assistant.id}/knowledge`)}
        >
          <Database size={17} />
          Knowledge
        </button>

        <button
          type="button"
          className="assistant-card__action"
          onClick={() => navigate(`/assistants/${assistant.id}/playground`)}
        >
          <MessageSquare size={17} />
          Playground
        </button>
      </div>
    </article>
  );
}

export default AssistantCard;
