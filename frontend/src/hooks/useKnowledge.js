import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBases,
  searchKnowledgeBases,
  updateKnowledgeBase,
} from "../api/knowledgeApi";

const KNOWLEDGE_QUERY_KEY = ["knowledge-bases"];

export function useKnowledge({
  assistantId,
  page = 1,
  size = 10,
  keyword = "",
} = {}) {
  const queryClient = useQueryClient();

  const normalizedKeyword = keyword.trim();

  const knowledgeQuery = useQuery({
    queryKey: [
      ...KNOWLEDGE_QUERY_KEY,
      {
        assistantId,
        page,
        size,
        keyword: normalizedKeyword,
      },
    ],
    queryFn: () => {
      if (normalizedKeyword) {
        return searchKnowledgeBases({
          chatbot_id: assistantId,
          keyword: normalizedKeyword,
        });
      }

      return getKnowledgeBases({
        chatbot_id: assistantId,
        page,
        size,
      });
    },
    enabled: Boolean(assistantId),
  });

  const createMutation = useMutation({
    mutationFn: createKnowledgeBase,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: KNOWLEDGE_QUERY_KEY,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ knowledgeBaseId, payload }) =>
      updateKnowledgeBase(knowledgeBaseId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: KNOWLEDGE_QUERY_KEY,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteKnowledgeBase,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: KNOWLEDGE_QUERY_KEY,
      });
    },
  });

  return {
    knowledgeBases: knowledgeQuery.data ?? [],
    isLoading: knowledgeQuery.isLoading,
    isFetching: knowledgeQuery.isFetching,
    error: knowledgeQuery.error,

    createKnowledge: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateKnowledge: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteKnowledge: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
