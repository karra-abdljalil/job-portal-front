import apiClient from '@/services/api'
const {useParams} = useRouter()

/**
 * Get a job moderation by its ID
 * @param {string} id - The ID of the job moderation
 * @returns {Promise} A promise that resolves to the job moderation
 */
const getJobModerationById = async (id) => {
  const response = await apiClient.get(`/api/admin/jobs/moderation/${id}`)
  return response.data
}

export default getJobModerationById