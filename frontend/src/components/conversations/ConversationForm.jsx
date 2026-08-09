import { X } from "lucide-react";
import { useEffect, useState } from "react";

function ConversationForm({
  mode = "create",
  assistants,
  conversation,
  onSubmit,
  onClose,
  loading,
}) {
  const [chatbotId, setChatbotId] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (mode === "edit" && conversation) {
      setTitle(conversation.title || "");
      setChatbotId(String(conversation.chatbot_id));
      return;
    }

    setTitle("");
    setChatbotId(assistants.length ? String(assistants[0].id) : "");
  }, [mode, conversation, assistants]);

  function handleSubmit(event) {
    event.preventDefault();

    if (mode === "create") {
      onSubmit({
        chatbot_id: Number(chatbotId),
        title: title.trim(),
      });

      return;
    }

    onSubmit({
      title: title.trim(),
    });
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="conversation-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="conversation-modal__header">
          <div>
            <p className="conversation-modal__eyebrow">
              {mode === "create" ? "New conversation" : "Conversation"}
            </p>

            <h2>
              {mode === "create"
                ? "Start a new conversation"
                : "Rename conversation"}
            </h2>

            <p>
              {mode === "create"
                ? "Choose an assistant and give your conversation a title."
                : "Update the title of this conversation."}
            </p>
          </div>

          <button
            className="conversation-modal__close"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </header>

        <form className="conversation-form" onSubmit={handleSubmit}>
          {mode === "create" && (
            <div className="conversation-form__field">
              <label htmlFor="conversation-assistant">Assistant</label>

              <select
                id="conversation-assistant"
                value={chatbotId}
                onChange={(event) => setChatbotId(event.target.value)}
                required
              >
                {assistants.map((assistant) => (
                  <option key={assistant.id} value={assistant.id}>
                    {assistant.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="conversation-form__field">
            <label htmlFor="conversation-title">Title</label>

            <input
              id="conversation-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Account login issue"
              minLength={1}
              maxLength={200}
              required
              autoFocus
            />
          </div>

          <div className="conversation-form__actions">
            <button
              className="conversation-form__cancel"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              className="conversation-form__submit"
              type="submit"
              disabled={loading || !title.trim() || (mode === "create" && !chatbotId)}
            >
              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Create conversation"
                  : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ConversationForm;
