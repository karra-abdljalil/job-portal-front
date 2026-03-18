import apiClient from "@/services/api";
export const getDashboard = async () => {
  const response = await apiClient.get("/api/job-seeker/dashboard");
  return response.data;
};