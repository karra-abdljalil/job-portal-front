
import apiClient from '@/services/api'

/**
 * Delete a job moderation by its ID
 * @param {string} id - The ID of the job moderation
 * @returns {Promise} A promise that resolves to the deleted job moderation
 */
const deleteJobModeration = async (id) => {
  const response = await apiClient.delete(`/api/admin/jobs/moderation/${id}`)
  return response.data
}

export default deleteJobModeration
