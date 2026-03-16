import apiClient from '@/services/api'
const fetchDashboardStats = async () => {
 
 try {
  
  const response  = await apiClient.get('/api/admin/dashboard/stats')
  return response.data
 }
 catch(error)
 {
   throw new Error(error.message)
 }
}

export { fetchDashboardStats}