import apiClient from "./client";

export async function createMessage(payload) {
  const response = await apiClient.post("/messages", payload);

  return response.data;
}

export async function getMessages(params = {}) {
  const response = await apiClient.get("/messages", { params });

  return response.data;
}

export async function searchMessages(params = {}) {
  const response = await apiClient.get("/messages/search", { params });

  return response.data;
}

export async function getMessage(messageId) {
  const response = await apiClient.get(`/messages/${messageId}`);

  return response.data;
}

export async function updateMessage(messageId, payload) {
  const response = await apiClient.put(`/messages/${messageId}`, payload);

  return response.data;
}

export async function deleteMessage(messageId) {
  const response = await apiClient.delete(`/messages/${messageId}`);

  return response.data;
}
