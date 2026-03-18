import ApiClient from '@/services/api'
export const deleteJob = async (jobId) => {
  const response = await ApiClient.delete(`/api/admin/jobs/${jobId}`)
  return response.data
}
