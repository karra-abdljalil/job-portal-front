import apiClient from "@/services/api";

const PROFILE_BASE = "/api/job-seeker/profile";

export const getProfile = async () => {
  const response = await apiClient.get(PROFILE_BASE);
  return response.data;
};

export const updateProfile = async (payload) => {
  const response = await apiClient.put(PROFILE_BASE, { full_name: payload.full_name });
  return response.data;
};

export const updatePassword = async (payload) => {
  const response = await apiClient.put(`${PROFILE_BASE}/password`, payload);
  return response.data;
};

export const deleteProfile = async () => {
  const response = await apiClient.delete(PROFILE_BASE);
  return response.data;
};

export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append("profile_picture", file);
  const response = await apiClient.post(`${PROFILE_BASE}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getProfilePicture = async () => {
  const response = await apiClient.get(`${PROFILE_BASE}/profile-picture`, {
    responseType: "blob",
  });
  return URL.createObjectURL(response.data);
};