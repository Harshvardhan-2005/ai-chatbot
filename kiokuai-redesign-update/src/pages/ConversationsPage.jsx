import { MessageSquare, Plus, RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getChatbots } from "../api/chatbotApi";
import {
  createConversation,
  deleteConversation,
  getConversations,
  searchConversations,
  updateConversation,
} from "../api/conversationApi";

import ConversationCard from "../components/conversations/ConversationCard";
import ConversationForm from "../components/conversations/ConversationForm";
import PageHeader from "../components/layout/PageHeader";
import Alert from "../components/ui/alert";
import Button from "../components/ui/button";
import { Card } from "../components/ui/card";
import Skeleton from "../components/ui/skeleton";
import { getApiErrorMessage } from "../utils/apiError";

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
      const response = await getChatbots({ page: 1, limit: 100 });

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

      const params = { page, limit };

      const response = search.trim()
        ? await searchConversations({ ...params, keyword: search.trim() })
        : await getConversations(params);

      setConversations(response.items || response.data || response || []);
    } catch (requestError) {
      console.error(requestError);

      setError(getApiErrorMessage(requestError, "Unable to load conversations."));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  function openCreateModal() {
    if (!assistants.length) {
      toast.error("Create an assistant before starting a conversation.");
      return;
    }

    setModal({ mode: "create" });
  }

  function openEditModal(conversation) {
    setModal({ mode: "edit", conversation });
  }

  async function handleCreate(payload) {
    try {
      setSaving(true);

      const conversation = await createConversation(payload);

      toast.success("Conversation created.");
      setModal(null);

      navigate(`/conversations/${conversation.id}`);
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, "Unable to create conversation."));
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(payload) {
    if (!modal?.conversation) return;

    try {
      setSaving(true);

      await updateConversation(modal.conversation.id, payload);

      toast.success("Conversation renamed.");
      setModal(null);

      await loadConversations({ silent: true });
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, "Unable to update conversation."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(conversation) {
    const confirmed = window.confirm(
      `Delete "${conversation.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteConversation(conversation.id);

      toast.success("Conversation deleted.");

      await loadConversations({ silent: true });
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, "Unable to delete conversation."));
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Conversations"
        description="Continue your conversations with your AI assistants."
        actions={
          <Button type="button" onClick={openCreateModal}>
            <Plus size={17} />
            New conversation
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations..."
            aria-label="Search conversations"
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          />
        </div>

        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => loadConversations({ silent: true })}
          disabled={fetching}
        >
          <RefreshCw size={14} className={fetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Alert title="Unable to load conversations">{error}</Alert>
      ) : conversations.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageSquare size={20} strokeWidth={1.8} />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {search ? "No conversations found" : "No conversations yet"}
            </p>
            <p className="text-sm text-muted-foreground">
              {search
                ? "Try another search term."
                : "Start your first conversation with an assistant."}
            </p>
          </div>

          {!search && (
            <Button size="sm" type="button" onClick={openCreateModal}>
              <Plus size={16} />
              Start conversation
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {conversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                chatbotName={assistantMap[conversation.chatbot_id]}
                onOpen={(id) => navigate(`/conversations/${id}`)}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">Page {page}</span>

            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={conversations.length < limit}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {modal && (
        <ConversationForm
          mode={modal.mode}
          assistants={assistants}
          conversation={modal.conversation}
          onSubmit={modal.mode === "create" ? handleCreate : handleUpdate}
          onClose={() => setModal(null)}
          loading={saving}
        />
      )}
    </div>
  );
}

export default ConversationsPage;
