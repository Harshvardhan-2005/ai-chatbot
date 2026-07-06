import { X } from "lucide-react";

import AssistantForm from "./AssistantForm";

function AssistantModal({
  isOpen,
  assistant,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="assistant-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assistant-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="assistant-modal__header">
          <div>
            <p className="assistant-modal__eyebrow">
              {assistant ? "Edit assistant" : "New assistant"}
            </p>

            <h2 id="assistant-modal-title">
              {assistant ? "Update assistant" : "Create an assistant"}
            </h2>

            <p>
              {assistant
                ? "Update your assistant configuration."
                : "Configure a focused AI assistant for your workspace."}
            </p>
          </div>

          <button
            type="button"
            className="assistant-modal__close"
            onClick={onClose}
            aria-label="Close assistant form"
          >
            <X size={20} />
          </button>
        </header>

        <AssistantForm
          assistant={assistant}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </section>
    </div>
  );
}

export default AssistantModal;
