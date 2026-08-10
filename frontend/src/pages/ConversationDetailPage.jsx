import { ArrowLeft, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

import {
  deleteConversation,
  getConversation,
  updateConversation,
} from "../api/conversationApi";

import { getMessages } from "../api/messageApi";
import { sendChatMessage } from "../api/chatApi";

import ChatInput from "../components/conversations/ChatInput";
import ConversationForm from "../components/conversations/ConversationForm";
import MessageBubble from "../components/conversations/MessageBubble";
import Spinner from "../components/ui/Spinner";

function ConversationDetailPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const messagesContainerRef = useRef(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  async function loadConversation() {
    try {
      setLoading(true);
      setError("");

      const [conversationData, messagesData] = await Promise.all([
        getConversation(conversationId),
        getMessages({
          conversation_id: conversationId,
          page: 1,
          limit: 100,
        }),
      ]);

      setConversation(conversationData);

      setMessages(
        messagesData.items || messagesData.data || messagesData || [],
      );
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.detail ||
          "Unable to load this conversation.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
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

      toast.error(
        requestError.response?.data?.detail || "Unable to send message.",
      );
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
      toast.error(
        requestError.response?.data?.detail || "Unable to rename conversation.",
      );
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${conversation.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteConversation(conversation.id);

      toast.success("Conversation deleted.");

      navigate("/conversations", {
        replace: true,
      });
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.detail || "Unable to delete conversation.",
      );
    }
  }

  if (loading) {
    return (
      <main className="conversation-detail-page">
        <div className="conversation-state">
          <Spinner />
          <p>Loading conversation...</p>
        </div>
      </main>
    );
  }

  if (error || !conversation) {
    return (
      <main className="conversation-detail-page">
        <div className="conversation-error">
          <strong>Unable to load conversation</strong>
          <p>{error || "Conversation not found."}</p>

          <button type="button" onClick={() => navigate("/conversations")}>
            Back to conversations
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="conversation-detail-page">
      <header className="conversation-detail__header">
        <button
          className="conversation-detail__back"
          type="button"
          onClick={() => navigate("/conversations")}
        >
          <ArrowLeft size={17} />
          Conversations
        </button>

        <div className="conversation-detail__title-row">
          <div>
            <h1>{conversation.title}</h1>
            <p>Assistant #{conversation.chatbot_id}</p>
          </div>

          <div className="conversation-detail__menu-wrapper">
            <button
              className="conversation-detail__menu-button"
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label="Conversation actions"
            >
              <MoreHorizontal size={19} />
            </button>

            {menuOpen && (
              <div className="conversation-detail__menu">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setEditOpen(true);
                  }}
                >
                  <Pencil size={15} />
                  Rename
                </button>

                <button
                  type="button"
                  className="conversation-detail__menu-danger"
                  onClick={() => {
                    setMenuOpen(false);
                    handleDelete();
                  }}
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="conversation-chat">
        <div className="conversation-chat__messages" ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <div className="conversation-chat__empty">
              <h2>Start the conversation</h2>
              <p>Send a message to your assistant below.</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {sending && (
            <div className="conversation-chat__typing">
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
    </main>
  );
}

export default ConversationDetailPage;
