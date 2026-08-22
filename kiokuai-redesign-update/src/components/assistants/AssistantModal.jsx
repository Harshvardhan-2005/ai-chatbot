import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogEyebrow,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import AssistantForm from "./AssistantForm";

function AssistantModal({ isOpen, assistant, onClose, onSubmit, isSubmitting }) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogEyebrow>{assistant ? "Edit assistant" : "New assistant"}</DialogEyebrow>

          <DialogTitle>
            {assistant ? "Update assistant" : "Create an assistant"}
          </DialogTitle>

          <DialogDescription>
            {assistant
              ? "Update your assistant configuration."
              : "Configure a focused AI assistant for your workspace."}
          </DialogDescription>
        </DialogHeader>

        <AssistantForm
          key={assistant?.id ?? "create"}
          assistant={assistant}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AssistantModal;
