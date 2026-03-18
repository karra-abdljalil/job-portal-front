import apiClient from "@/services/api";

const BASE = "/api/job-seeker/certifications";

export const getCertifications = async () => {
  const response = await apiClient.get(BASE);
  return response.data;
};

export const createCertification = async (formData) => {
  const response = await apiClient.post(BASE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateCertification = async (id, payload) => {
  const response = await apiClient.put(`${BASE}/${id}`, payload);
  return response.data;
};

export const deleteCertification = async (id) => {
  const response = await apiClient.delete(`${BASE}/${id}`);
  return response.data;
};