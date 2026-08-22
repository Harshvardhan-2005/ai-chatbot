import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import KnowledgeGrid from "../components/knowledge/KnowledgeGrid";
import KnowledgeModal from "../components/knowledge/KnowledgeModal";
import KnowledgeSearch from "../components/knowledge/KnowledgeSearch";
import PageHeader from "../components/layout/PageHeader";
import Alert from "../components/ui/alert";
import Button from "../components/ui/button";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useKnowledge } from "../hooks/useKnowledge";
import { getApiErrorMessage } from "../utils/apiError";

function KnowledgePage() {
  const navigate = useNavigate();

  const { assistantId } = useParams();

  const [keyword, setKeyword] = useState("");

  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedKnowledge, setSelectedKnowledge] = useState(null);

  const debouncedKeyword = useDebouncedValue(keyword, 400);

  const {
    knowledgeBases,
    isLoading,
    isFetching,
    error,
    createKnowledge,
    isCreating,
    updateKnowledge,
    isUpdating,
    deleteKnowledge,
    isDeleting,
  } = useKnowledge({
    assistantId,
    page,
    size: 10,
    keyword: debouncedKeyword,
  });

  const openCreateModal = () => {
    setSelectedKnowledge(null);
    setIsModalOpen(true);
  };

  const openEditModal = (knowledge) => {
    setSelectedKnowledge(knowledge);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isCreating || isUpdating) {
      return;
    }

    setIsModalOpen(false);
    setSelectedKnowledge(null);
  };

  const handleSearchChange = (value) => {
    setKeyword(value);
    setPage(1);
  };

  const handleSubmit = async (payload) => {
    try {
      if (selectedKnowledge) {
        await updateKnowledge({
          knowledgeBaseId: selectedKnowledge.id,
          payload,
        });

        toast.success("Knowledge updated successfully");
      } else {
        await createKnowledge({
          chatbot_id: Number(assistantId),
          ...payload,
        });

        toast.success("Knowledge added successfully");
      }

      setIsModalOpen(false);
      setSelectedKnowledge(null);
    } catch (submitError) {
      toast.error(
        getApiErrorMessage(
          submitError,
          selectedKnowledge
            ? "Unable to update knowledge."
            : "Unable to add knowledge.",
        ),
      );
    }
  };

  const handleDelete = async (knowledge) => {
    const shouldDelete = window.confirm(
      `Delete "${knowledge.title}"? This action cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteKnowledge(knowledge.id);

      toast.success("Knowledge deleted successfully");
    } catch (deleteError) {
      toast.error(
        getApiErrorMessage(deleteError, "Unable to delete knowledge."),
      );
    }
  };

  return (
    <div>
      <button
        type="button"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => navigate("/assistants")}
      >
        <ArrowLeft size={16} />
        Back to assistants
      </button>

      <PageHeader
        eyebrow={`Assistant ${assistantId}`}
        title="Knowledge"
        description="Manage the knowledge sources used to ground this assistant."
        actions={
          <Button onClick={openCreateModal}>
            <Plus size={18} />
            Add knowledge
          </Button>
        }
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <KnowledgeSearch value={keyword} onChange={handleSearchChange} />

          <p className="text-xs text-muted-foreground">
            {isFetching && !isLoading
              ? "Refreshing..."
              : `${knowledgeBases.length} source${
                  knowledgeBases.length === 1 ? "" : "s"
                }`}
          </p>
        </div>

        {error ? (
          <Alert title="Unable to load knowledge">
            {getApiErrorMessage(
              error,
              "The knowledge sources could not be loaded.",
            )}
          </Alert>
        ) : (
          <KnowledgeGrid
            knowledgeBases={knowledgeBases}
            isLoading={isLoading}
            onEdit={openEditModal}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        )}

        {!debouncedKeyword && !isLoading && !error ? (
          <nav
            className="flex items-center justify-center gap-3 pt-2"
            aria-label="Knowledge pagination"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setPage((currentPage) => Math.max(1, currentPage - 1))
              }
              disabled={page === 1 || isFetching}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">Page {page}</span>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((currentPage) => currentPage + 1)}
              disabled={knowledgeBases.length < 10 || isFetching}
            >
              Next
            </Button>
          </nav>
        ) : null}
      </section>

      <KnowledgeModal
        isOpen={isModalOpen}
        knowledge={selectedKnowledge}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}

export default KnowledgePage;
