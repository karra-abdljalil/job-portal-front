import apiClient from "@/services/api";

const BASE = "/api/job-seeker/jobs";

export const getJobs = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.set(k, v);
  });
  const response = await apiClient.get(query.toString() ? `${BASE}?${query}` : BASE);
  return response.data;
};

export const getJobById = async (id) => {
  const response = await apiClient.get(`${BASE}/${id}`);
  return response.data;
};

export const saveJob = async (jobId) => {
  const response = await apiClient.post(`${BASE}/${jobId}/save`);
  return response.data;
};

export const unsaveJob = async (jobId) => {
  const response = await apiClient.delete(`${BASE}/${jobId}/save`);
  return response.data;
};

export const getSavedJobs = async () => {
  const response = await apiClient.get(`${BASE}/saved`);
  return response.data;
};