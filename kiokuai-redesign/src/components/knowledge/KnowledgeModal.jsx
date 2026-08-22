import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogEyebrow,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import KnowledgeForm from "./KnowledgeForm";

function KnowledgeModal({ isOpen, knowledge, onClose, onSubmit, isSubmitting }) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogEyebrow>{knowledge ? "Edit knowledge" : "New knowledge"}</DialogEyebrow>

          <DialogTitle>
            {knowledge ? "Update knowledge source" : "Add knowledge source"}
          </DialogTitle>

          <DialogDescription>
            {knowledge
              ? "Update the source used to ground this assistant."
              : "Give this assistant focused information and context."}
          </DialogDescription>
        </DialogHeader>

        <KnowledgeForm
          key={knowledge?.id ?? "create"}
          knowledge={knowledge}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

export default KnowledgeModal;
