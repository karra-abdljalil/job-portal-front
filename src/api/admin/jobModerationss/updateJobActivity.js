import apiClient from '@/services/api'

/**
 * Update the activity of a job moderation
 * @param {string} id - The ID of the job moderation
 * @param {string} activity - The new activity of the job moderation
 * @returns {Promise} A promise that resolves to the updated job moderation
 */
const updateJobActivity = async (id, isActive) => {
  const response = await apiClient.put(`/api/admin/jobs/moderation/${id}/activity`, { isActive })
  return response.data
}