import { X } from "lucide-react";

import KnowledgeForm from "./KnowledgeForm";

function KnowledgeModal({
  isOpen,
  knowledge,
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
        className="knowledge-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="knowledge-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="knowledge-modal__header">
          <div>
            <p className="knowledge-modal__eyebrow">
              {knowledge ? "Edit knowledge" : "New knowledge"}
            </p>

            <h2 id="knowledge-modal-title">
              {knowledge ? "Update knowledge source" : "Add knowledge source"}
            </h2>

            <p>
              {knowledge
                ? "Update the source used to ground this assistant."
                : "Give this assistant focused information and context."}
            </p>
          </div>

          <button
            type="button"
            className="knowledge-modal__close"
            onClick={onClose}
            aria-label="Close knowledge form"
          >
            <X size={20} />
          </button>
        </header>

        <KnowledgeForm
          key={knowledge?.id ?? "create"}
          knowledge={knowledge}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </section>
    </div>
  );
}

export default KnowledgeModal;
