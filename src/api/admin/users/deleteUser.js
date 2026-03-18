import ApiClient from '@/services/api'


export const deleteUser = async(userId) =>
  {
    const response =  await ApiClient.delete(`/api/admin/users/${userId}`)
    return response.data;
    
}