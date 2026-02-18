import apiClient from "@/services/api";

export const UploadCv = async (formatDate, id) => {
  return apiClient.post(`api/cv/upload`, formatDate, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCv_JobSeeker = async (id) => {
  try {
    const response = apiClient.get(`api/cv/my-Cvs`);
    return response;
  } catch (error) {
    throw error.message;
  }
};
