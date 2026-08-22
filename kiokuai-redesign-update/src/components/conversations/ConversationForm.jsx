import { useEffect, useState } from "react";

import Button from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogEyebrow,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Field from "../ui/input";
import Select from "../ui/select";

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
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogEyebrow>
            {mode === "create" ? "New conversation" : "Conversation"}
          </DialogEyebrow>

          <DialogTitle>
            {mode === "create"
              ? "Start a new conversation"
              : "Rename conversation"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Choose an assistant and give your conversation a title."
              : "Update the title of this conversation."}
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4 p-5" onSubmit={handleSubmit}>
          {mode === "create" && (
            <Select
              label="Assistant"
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
            </Select>
          )}

          <Field
            label="Title"
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

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={loading}
              disabled={!title.trim() || (mode === "create" && !chatbotId)}
            >
              {mode === "create" ? "Create conversation" : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ConversationForm;
