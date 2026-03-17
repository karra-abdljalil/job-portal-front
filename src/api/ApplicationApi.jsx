import apiClient from '@/services/api'

//################################################### Apply for a job
export const applyJob = async ({ jobId, cvId }) => {
  try {
    const response = await apiClient.post(
      `/api/applications/apply`,
      { jobId, cvId }
    );

    return response.data;
  } catch (error) {
    console.error("Apply Job Error:", error.response?.data || error.message);
    throw error;
  }
};
//################################################### get all apps for a jobseeker
export const getMyApplications_JobSeeker = async (
  search = "",
  page = 1,
  limit = 10
) => {
  try {
    const response = await apiClient.get(
    `/api/applications/myApplications?search=${search}&page=${page}&limit=${limit}`
  );

  return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
};
//################################################### decision of the offer
export const decideOffer = async (appId, decision) => {
  try {
    const response = await apiClient.post(
    `/api/applications/${appId}/decision`,
    { decision }
  );

  return response.data;
  } catch (error) {
    console.error(" Error:", error.response?.data || error.message);
    throw error;
  }
};
