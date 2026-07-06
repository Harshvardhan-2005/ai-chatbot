import apiClient from "./client";

export async function createKnowledgeBase(payload) {
  const response = await apiClient.post("/knowledge-bases", payload);

  return response.data;
}

export async function getKnowledgeBases(params = {}) {
  const response = await apiClient.get("/knowledge-bases", { params });

  return response.data;
}

export async function searchKnowledgeBases(params = {}) {
  const response = await apiClient.get("/knowledge-bases/search", { params });

  return response.data;
}

export async function getKnowledgeBase(knowledgeBaseId) {
  const response = await apiClient.get(`/knowledge-bases/${knowledgeBaseId}`);

  return response.data;
}

export async function updateKnowledgeBase(knowledgeBaseId, payload) {
  const response = await apiClient.put(
    `/knowledge-bases/${knowledgeBaseId}`,
    payload,
  );

  return response.data;
}

export async function deleteKnowledgeBase(knowledgeBaseId) {
  const response = await apiClient.delete(
    `/knowledge-bases/${knowledgeBaseId}`,
  );

  return response.data;
}
