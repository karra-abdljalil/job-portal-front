import apiClient from "./api";

export async function getShortlistedApplicantsByJob(jobId) {
  const res = await apiClient.get(`/api/employer/jobs/${jobId}/shortlist`);
  return res.data;
}