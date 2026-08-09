import { MessageSquare, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

function ConversationCard({
  conversation,
  chatbotName,
  onOpen,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const updatedAt = new Date(conversation.updated_at).toLocaleString();

  return (
    <article className="conversation-card">
      <div className="conversation-card__header">
        <div className="conversation-card__icon">
          <MessageSquare size={19} strokeWidth={1.8} />
        </div>

        <div className="conversation-card__menu-wrapper">
          <button
            className="conversation-card__menu-button"
            type="button"
            aria-label="Conversation actions"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((current) => !current);
            }}
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <div className="conversation-card__menu">
              <button
                className="conversation-card__menu-item"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setMenuOpen(false);
                  onEdit(conversation);
                }}
              >
                <Pencil size={15} />
                <span>Rename</span>
              </button>

              <button
                className="conversation-card__menu-item conversation-card__menu-item--danger"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setMenuOpen(false);
                  onDelete(conversation);
                }}
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        className="conversation-card__body"
        type="button"
        onClick={() => onOpen(conversation.id)}
      >
        <h2>{conversation.title}</h2>

        <p>{chatbotName || `Assistant #${conversation.chatbot_id}`}</p>

        <span>Updated {updatedAt}</span>
      </button>
    </article>
  );
}

export default ConversationCard;
