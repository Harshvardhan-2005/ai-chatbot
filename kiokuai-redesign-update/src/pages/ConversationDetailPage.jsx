import { ArrowLeft, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { sendChatMessage } from "../api/chatApi";
import {
  deleteConversation,
  getConversation,
  updateConversation,
} from "../api/conversationApi";
import { getMessages } from "../api/messageApi";

import ChatInput from "../components/conversations/ChatInput";
import ConversationForm from "../components/conversations/ConversationForm";
import MessageBubble from "../components/conversations/MessageBubble";
import Alert from "../components/ui/alert";
import Button from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import Spinner from "../components/ui/spinner";
import { getApiErrorMessage } from "../utils/apiError";

function ConversationDetailPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const messagesContainerRef = useRef(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);

  async function loadConversation() {
    try {
      setLoading(true);
      setError("");

      const [conversationData, messagesData] = await Promise.all([
        getConversation(conversationId),
        getMessages({ conversation_id: conversationId, page: 1, limit: 100 }),
      ]);

      setConversation(conversationData);
      setMessages(messagesData.items || messagesData.data || messagesData || []);
    } catch (requestError) {
      console.error(requestError);

      setError(getApiErrorMessage(requestError, "Unable to load this conversation."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    });
  }, [messages, sending]);

  async function handleSend(content) {
    try {
      setSending(true);

      const response = await sendChatMessage({
        conversation_id: Number(conversationId),
        message: content,
      });

      const now = new Date().toISOString();

      if (response.user_message) {
        setMessages((current) => [
          ...current,
          {
            id: `user-${Date.now()}`,
            role: "user",
            content: response.user_message,
            created_at: now,
          },
        ]);
      }

      if (response.assistant_message) {
        setMessages((current) => [
          ...current,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: response.assistant_message,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (requestError) {
      console.error(requestError);

      toast.error(getApiErrorMessage(requestError, "Unable to send message."));
    } finally {
      setSending(false);
    }
  }

  async function handleRename(payload) {
    try {
      const updated = await updateConversation(conversation.id, payload);

      setConversation(updated);
      setEditOpen(false);

      toast.success("Conversation renamed.");
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, "Unable to rename conversation."));
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${conversation.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteConversation(conversation.id);

      toast.success("Conversation deleted.");

      navigate("/conversations", { replace: true });
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, "Unable to delete conversation."));
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <Spinner size={22} />
        <p className="text-sm text-muted-foreground">Loading conversation...</p>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <Alert title="Unable to load conversation">
          {error || "Conversation not found."}
        </Alert>

        <Button variant="secondary" onClick={() => navigate("/conversations")}>
          Back to conversations
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col md:h-[calc(100vh-6rem)]">
      <header className="mb-4 shrink-0">
        <button
          type="button"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => navigate("/conversations")}
        >
          <ArrowLeft size={16} />
          Conversations
        </button>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
              {conversation.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              Assistant #{conversation.chatbot_id}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Conversation actions"
              >
                <MoreHorizontal size={19} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Pencil size={14} />
                Rename
              </DropdownMenuItem>

              <DropdownMenuItem destructive onSelect={handleDelete}>
                <Trash2 size={14} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <section className="flex min-h-0 flex-1 flex-col gap-3 rounded-xl border border-border bg-muted/30 p-3 sm:p-4">
        <div
          className="flex-1 space-y-3 overflow-y-auto pr-1"
          ref={messagesContainerRef}
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
              <h2 className="text-sm font-medium text-foreground">
                Start the conversation
              </h2>
              <p className="text-sm text-muted-foreground">
                Send a message to your assistant below.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {sending && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Spinner size={13} />
              Assistant is thinking...
            </div>
          )}
        </div>

        <ChatInput onSend={handleSend} loading={sending} />
      </section>

      {editOpen && (
        <ConversationForm
          mode="edit"
          assistants={[]}
          conversation={conversation}
          onSubmit={handleRename}
          onClose={() => setEditOpen(false)}
          loading={false}
        />
      )}
    </div>
  );
}

export default ConversationDetailPage;
