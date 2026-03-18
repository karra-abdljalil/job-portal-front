
import ApiClient from '@/services/api'
export const updateJobStatus = async (jobId, status) => {
  const response = await ApiClient.updateJobStatus(`/api/admin/jobs/${jobId}/status`, { status })
  return response.data
}