import apiClient from "./client";

export async function createChatbot(payload) {
  const response = await apiClient.post("/chatbots", payload);

  return response.data;
}

export async function getChatbots(params = {}) {
  const response = await apiClient.get("/chatbots", { params });

  return response.data;
}

export async function searchChatbots(params = {}) {
  const response = await apiClient.get("/chatbots/search", { params });

  return response.data;
}

export async function getChatbot(chatbotId) {
  const response = await apiClient.get(`/chatbots/${chatbotId}`);

  return response.data;
}

export async function updateChatbot(chatbotId, payload) {
  const response = await apiClient.put(`/chatbots/${chatbotId}`, payload);

  return response.data;
}

export async function deleteChatbot(chatbotId) {
  const response = await apiClient.delete(`/chatbots/${chatbotId}`);

  return response.data;
}
