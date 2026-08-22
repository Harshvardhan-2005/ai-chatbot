import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createChatbot,
  deleteChatbot,
  getChatbots,
  searchChatbots,
  updateChatbot,
} from "../api/chatbotApi";

const CHATBOTS_QUERY_KEY = ["chatbots"];

export function useChatbots({ page = 1, size = 10, keyword = "" } = {}) {
  const queryClient = useQueryClient();

  const normalizedKeyword = keyword.trim();

  const chatbotsQuery = useQuery({
    queryKey: [
      ...CHATBOTS_QUERY_KEY,
      {
        page,
        size,
        keyword: normalizedKeyword,
      },
    ],
    queryFn: () => {
      if (normalizedKeyword) {
        return searchChatbots({
          keyword: normalizedKeyword,
        });
      }

      return getChatbots({
        page,
        size,
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: createChatbot,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CHATBOTS_QUERY_KEY,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ chatbotId, payload }) => updateChatbot(chatbotId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CHATBOTS_QUERY_KEY,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteChatbot,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CHATBOTS_QUERY_KEY,
      });
    },
  });

  return {
    chatbots: chatbotsQuery.data ?? [],
    isLoading: chatbotsQuery.isLoading,
    isFetching: chatbotsQuery.isFetching,
    error: chatbotsQuery.error,

    createAssistant: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateAssistant: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteAssistant: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
