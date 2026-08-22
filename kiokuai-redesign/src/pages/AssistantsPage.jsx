import { Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import AssistantGrid from "../components/assistants/AssistantGrid";
import AssistantModal from "../components/assistants/AssistantModal";
import AssistantSearch from "../components/assistants/AssistantSearch";
import PageHeader from "../components/layout/PageHeader";
import Alert from "../components/ui/alert";
import Button from "../components/ui/button";

import { useChatbots } from "../hooks/useChatbots";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { getApiErrorMessage } from "../utils/apiError";

const PAGE_SIZE = 10;

function AssistantsPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);

  const debouncedKeyword = useDebouncedValue(keyword, 400);

  const {
    chatbots,
    isLoading,
    isFetching,
    error,
    createAssistant,
    isCreating,
    updateAssistant,
    isUpdating,
    deleteAssistant,
    isDeleting,
  } = useChatbots({
    page,
    size: PAGE_SIZE,
    keyword: debouncedKeyword,
  });

  const isSubmitting = isCreating || isUpdating;

  function handleSearchChange(value) {
    setKeyword(value);
    setPage(1);
  }

  function handleCreate() {
    setSelectedAssistant(null);
    setIsModalOpen(true);
  }

  function handleEdit(assistant) {
    setSelectedAssistant(assistant);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    setSelectedAssistant(null);
  }

  async function handleSubmit(payload) {
    try {
      if (selectedAssistant) {
        await updateAssistant({
          chatbotId: selectedAssistant.id,
          payload,
        });

        toast.success("Assistant updated successfully.");
      } else {
        await createAssistant(payload);

        toast.success("Assistant created successfully.");
      }

      setIsModalOpen(false);
      setSelectedAssistant(null);
    } catch (submitError) {
      toast.error(
        getApiErrorMessage(
          submitError,
          selectedAssistant
            ? "Unable to update assistant."
            : "Unable to create assistant.",
        ),
      );
    }
  }

  async function handleDelete(assistant) {
    const shouldDelete = window.confirm(
      `Delete "${assistant.name}"? This action cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteAssistant(assistant.id);

      toast.success("Assistant deleted successfully.");
    } catch (deleteError) {
      toast.error(
        getApiErrorMessage(deleteError, "Unable to delete assistant."),
      );
    }
  }

  function handlePreviousPage() {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }

  function handleNextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Assistants"
        description="Create, configure, and manage your AI assistants."
        actions={
          <Button onClick={handleCreate}>
            <Plus size={18} />
            Create assistant
          </Button>
        }
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AssistantSearch value={keyword} onChange={handleSearchChange} />

          {isFetching && !isLoading ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <RefreshCw size={13} className="animate-spin" />
              <span>Refreshing</span>
            </div>
          ) : null}
        </div>

        {error ? (
          <Alert title="Unable to load assistants">
            {getApiErrorMessage(error, "The assistant workspace could not be loaded.")}
          </Alert>
        ) : (
          <AssistantGrid
            assistants={chatbots}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        )}

        {!debouncedKeyword && !isLoading && !error ? (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page === 1 || isFetching}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">Page {page}</span>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleNextPage}
              disabled={chatbots.length < PAGE_SIZE || isFetching}
            >
              Next
            </Button>
          </div>
        ) : null}
      </section>

      <AssistantModal
        isOpen={isModalOpen}
        assistant={selectedAssistant}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default AssistantsPage;
