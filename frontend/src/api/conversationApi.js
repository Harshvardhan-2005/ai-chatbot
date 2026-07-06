import apiClient from "./client";

export async function createConversation(payload) {
  const response = await apiClient.post("/conversations", payload);

  return response.data;
}

export async function getConversations(params = {}) {
  const response = await apiClient.get("/conversations", { params });

  return response.data;
}

export async function searchConversations(params = {}) {
  const response = await apiClient.get("/conversations/search", { params });

  return response.data;
}

export async function getConversation(conversationId) {
  const response = await apiClient.get(`/conversations/${conversationId}`);

  return response.data;
}

export async function updateConversation(conversationId, payload) {
  const response = await apiClient.put(
    `/conversations/${conversationId}`,
    payload,
  );

  return response.data;
}

export async function deleteConversation(conversationId) {
  const response = await apiClient.delete(`/conversations/${conversationId}`);

  return response.data;
}
