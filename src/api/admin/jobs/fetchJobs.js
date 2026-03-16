import ApiClient from '@/services/api'

export const fetchJobs = async () => {
  
  const response = await ApiClient.get("/api/admin/jobs/")
  
  return response.data
}