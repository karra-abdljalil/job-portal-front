import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api/cv";

export const UploadCv = async (formatDate, id) => {
  return axios.post(`${API_BASE_URL}/upload/${id}`, formatDate, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCv_JobSeeker = async (id) => {
  try {
    const response = axios.get(`${API_BASE_URL}/my-Cvs/${id}`);
    return response;
  } catch (error) {
    throw error.message;
  }
};
