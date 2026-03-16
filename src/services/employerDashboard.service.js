import apiClient from "./api";

export async function getEmployerDashboard() {
  const res = await apiClient.get("/api/employer/dashboard");
  return res.data;
}