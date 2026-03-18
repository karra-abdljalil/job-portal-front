import apiClient from "@/services/api";

const BASE = "/api/job-seeker/experiences";

export const getExperiences = async () => {
  const response = await apiClient.get(BASE);
  return response.data;
};

export const addExperience = async (payload) => {
  const response = await apiClient.post(BASE, payload);
  return response.data;
};

export const updateExperience = async (id, payload) => {
  const { id: _, user_id, createdAt, updatedAt, ...cleanPayload } = payload;
  const response = await apiClient.put(`${BASE}/${id}`, cleanPayload);
  return response.data;
};

export const deleteExperience = async (id) => {
  const response = await apiClient.delete(`${BASE}/${id}`);
  return response.data;
};