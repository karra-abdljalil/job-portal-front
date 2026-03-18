import ApiClient from '@/services/api'

export const blockUser = async (userId, isBlocked) => {
  const response = await ApiClient.patch(`/api/admin/users/${userId}/block`,{
    is_blocked: !isBlocked,
  })
  return response.data
}