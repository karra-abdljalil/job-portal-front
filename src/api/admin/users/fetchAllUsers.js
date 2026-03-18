import ApiClient from '@/services/api'

export const fetchAllUsers = async (params) => {
  const response = await ApiClient.get('/api/admin/users', { params })
  return response.data
}