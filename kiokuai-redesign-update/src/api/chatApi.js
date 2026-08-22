import apiClient from "./client";

export async function sendChatMessage(payload) {
  const response = await apiClient.post("/chat", payload);

  return response.data;
}
