import apiClient from "./api";

export async function getEmployerJobs() {
  const res = await apiClient.get("/api/employer/jobs");
  return res.data;
}

export async function getEmployerJobById(jobId) {
  const res = await apiClient.get(`/api/employer/jobs/${jobId}`);
  return res.data;
}

export async function createEmployerJob(payload) {
  const res = await apiClient.post("/api/employer/jobs", payload);
  return res.data;
}

export async function updateEmployerJob(jobId, payload) {
  const res = await apiClient.put(`/api/employer/jobs/${jobId}`, payload);
  return res.data;
}

export async function updateEmployerJobStatus(jobId, isActive) {
  const res = await apiClient.patch(`/api/employer/jobs/${jobId}/status`, {
    is_active: isActive,
  });
  return res.data;
}

export async function deleteEmployerJob(jobId) {
  const res = await apiClient.delete(`/api/employer/jobs/${jobId}`);
  return res.data;
}