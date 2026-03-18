import apiClient from '@/services/api'

/**
 * Update the status of a job moderation
 * @param {string} id - The ID of the job moderation
 * @param {string} status - The new status of the job moderation 
 * example: status : {approved | rejected}
 * @returns {Promise} A promise that resolves to the updated job moderation
 */
const updateJobStatus = async (id, status) => {
  const response = await apiClient.put(`/api/admin/jobs/moderation/${id}/status`, { status })
  return response.data
}