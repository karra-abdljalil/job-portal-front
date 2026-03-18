import apiClient from "@/services/api";

export const UploadCv = async (formData) => {
  try {
    return apiClient.post(`/api/cvs/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getCv_JobSeeker = async () => {
  try {
    const response = await apiClient.get(`/api/cvs/my-Cvs`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const view_cv = async (cvId) => {
  try {
    const res = await apiClient.get(`/api/cvs/view/${cvId}`, {
      responseType: 'blob'
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const download_cv = async (cvId) => {
  try {
    const res = await apiClient.get(`/api/cvs/download/${cvId}`, {
      responseType: 'blob'
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const set_default_cv = async (id) => {
  try {
    const res = await apiClient.patch(`/api/cvs/set-default/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};