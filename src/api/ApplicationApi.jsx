import apiClient from '@/services/api'
// get all apps for a jobseeker
export const getMyApplications_JobSeeker = async (
  search = "",
  page = 1,
  limit = 10
) => {
  const response = await apiClient.get(
    `api/applications/myApplications?search=${search}&page=${page}&limit=${limit}`
  );

  return response.data;
};
// decision of the offer
export const decideOffer = async (appId, decision) => {
  const response = await apiClient.post(
    `api/applications/${appId}/decision`,
    { decision }
  );

  return response.data;
};
