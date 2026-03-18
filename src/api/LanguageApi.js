import apiClient from "@/services/api";

const BASE = "/api/job-seeker/languages";

export const getLanguages = async () => {
  const response = await apiClient.get(BASE);
  return response.data;
};

export const addLanguage = async (payload) => {
  const response = await apiClient.post(BASE, payload);
  return response.data;
};

export const updateLanguage = async (id, payload) => {
  const response = await apiClient.put(`${BASE}/${id}`, payload);
  return response.data;
};

export const deleteLanguage = async (id) => {
  const response = await apiClient.delete(`${BASE}/${id}`);
  return response.data;
};