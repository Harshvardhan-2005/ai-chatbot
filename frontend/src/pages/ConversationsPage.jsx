import {
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  createConversation,
  deleteConversation,
  getConversations,
  searchConversations,
  updateConversation,
} from "../api/conversationApi";

import { getChatbots } from "../api/chatbotApi";

import ConversationCard from "../components/conversations/ConversationCard";
import ConversationForm from "../components/conversations/ConversationForm";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";

function ConversationsPage() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [assistants, setAssistants] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const limit = 6;

  const assistantMap = useMemo(
    () =>
      Object.fromEntries(
        assistants.map((assistant) => [assistant.id, assistant.name]),
      ),
    [assistants],
  );

  async function loadAssistants() {
    try {
      const response = await getChatbots({
        page: 1,
        limit: 100,
      });

      setAssistants(response.items || response.data || response || []);
    } catch (requestError) {
      console.error(requestError);
    }
  }

  async function loadConversations({ silent = false } = {}) {
    try {
      setError("");

      if (silent) {
        setFetching(true);
      } else {
        setLoading(true);
      }

      const params = {
        page,
        limit,
      };

      const response = search.trim()
        ? await searchConversations({
            ...params,
            keyword: search.trim(),
          })
        : await getConversations(params);

      setConversations(
        response.items || response.data || response || [],
      );
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.detail ||
          "Unable to load conversations.",
      );
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }

  useEffect(() => {
    loadAssistants();
  }, []);

  useEffect(() => {
    loadConversations();
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  function openCreateModal() {
    if (!assistants.length) {
      toast.error("Create an assistant before starting a conversation.");
      return;
    }

    setModal({
      mode: "create",
    });
  }

  function openEditModal(conversation) {
    setModal({
      mode: "edit",
      conversation,
    });
  }

  async function handleCreate(payload) {
    try {
      setSaving(true);

      const conversation = await createConversation(payload);

      toast.success("Conversation created.");

      setModal(null);

      navigate(`/conversations/${conversation.id}`);
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.detail ||
          "Unable to create conversation.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(payload) {
    if (!modal?.conversation) {
      return;
    }

    try {
      setSaving(true);

      await updateConversation(modal.conversation.id, payload);

      toast.success("Conversation renamed.");

      setModal(null);

      await loadConversations({ silent: true });
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.detail ||
          "Unable to update conversation.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(conversation) {
    const confirmed = window.confirm(
      `Delete "${conversation.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteConversation(conversation.id);

      toast.success("Conversation deleted.");

      await loadConversations({ silent: true });
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.detail ||
          "Unable to delete conversation.",
      );
    }
  }

  return (
    <main className="conversations-page">
      <div className="conversations-page__header">
        <div>
          <p className="conversations-page__eyebrow">
            Workspace
          </p>

          <h1>Conversations</h1>

          <p>
            Continue your conversations with your AI assistants.
          </p>
        </div>

        <Button type="button" onClick={openCreateModal}>
          <Plus size={17} />
          New conversation
        </Button>
      </div>

      <div className="conversations-toolbar">
        <div className="conversation-search">
          <Search
            size={17}
            className="conversation-search__icon"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations..."
            aria-label="Search conversations"
          />
        </div>

        <button
          className="conversation-refresh"
          type="button"
          onClick={() => loadConversations({ silent: true })}
          disabled={fetching}
        >
          <RefreshCw
            size={16}
            className={
              fetching ? "conversation-refresh--spinning" : ""
            }
          />

          Refresh
        </button>
      </div>

      {loading ? (
        <div className="conversation-state">
          <Spinner />
          <p>Loading conversations...</p>
        </div>
      ) : error ? (
        <div className="conversation-error">
          <strong>Unable to load conversations</strong>
          <p>{error}</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="conversation-state">
          <div className="conversation-state__icon">
            <MessageSquare size={23} />
          </div>

          <h2>
            {search
              ? "No conversations found"
              : "No conversations yet"}
          </h2>

          <p>
            {search
              ? "Try another search term."
              : "Start your first conversation with an assistant."}
          </p>

          {!search && (
            <Button type="button" onClick={openCreateModal}>
              <Plus size={17} />
              Start conversation
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="conversation-grid">
            {conversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                chatbotName={
                  assistantMap[conversation.chatbot_id]
                }
                onOpen={(id) =>
                  navigate(`/conversations/${id}`)
                }
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <div className="conversation-pagination">
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage((current) => current - 1)
              }
            >
              Previous
            </button>

            <span>Page {page}</span>

            <button
              type="button"
              disabled={conversations.length < limit}
              onClick={() =>
                setPage((current) => current + 1)
              }
            >
              Next
            </button>
          </div>
        </>
      )}

      {modal && (
        <ConversationForm
          mode={modal.mode}
          assistants={assistants}
          conversation={modal.conversation}
          onSubmit={
            modal.mode === "create"
              ? handleCreate
              : handleUpdate
          }
          onClose={() => setModal(null)}
          loading={saving}
        />
      )}
    </main>
  );
}

export default ConversationsPage;
