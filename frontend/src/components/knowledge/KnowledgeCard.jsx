import {
  FileText,
  Globe,
  MoreHorizontal,
  Pencil,
  Trash2,
  Type,
} from "lucide-react";
import { useState } from "react";

function getSourceIcon(sourceType) {
  if (sourceType === "url") {
    return <Globe size={20} />;
  }

  if (sourceType === "file") {
    return <FileText size={20} />;
  }

  return <Type size={20} />;
}

function getSourceLabel(sourceType) {
  if (sourceType === "url") {
    return "URL";
  }

  if (sourceType === "file") {
    return "File";
  }

  return "Text";
}

function KnowledgeCard({ knowledge, onEdit, onDelete, isDeleting = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit(knowledge);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDelete(knowledge);
  };

  return (
    <article className="knowledge-card">
      <div className="knowledge-card__header">
        <div className="knowledge-card__icon">
          {getSourceIcon(knowledge.source_type)}
        </div>

        <div className="knowledge-card__menu-wrapper">
          <button
            type="button"
            className="knowledge-card__menu-button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={`Open actions for ${knowledge.title}`}
          >
            <MoreHorizontal size={19} />
          </button>

          {isMenuOpen ? (
            <div className="knowledge-card__menu">
              <button
                type="button"
                className="knowledge-card__menu-item"
                onClick={handleEdit}
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                type="button"
                className="knowledge-card__menu-item knowledge-card__menu-item--danger"
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

      <div className="knowledge-card__content">
        <div className="knowledge-card__title-row">
          <h2 className="knowledge-card__title">{knowledge.title}</h2>

          <span className="knowledge-source">
            {getSourceLabel(knowledge.source_type)}
          </span>
        </div>

        <p className="knowledge-card__content-preview">{knowledge.content}</p>
      </div>

      <footer className="knowledge-card__footer">
        <span>Knowledge source</span>

        <strong>#{knowledge.id}</strong>
      </footer>
    </article>
  );
}

export default KnowledgeCard;
