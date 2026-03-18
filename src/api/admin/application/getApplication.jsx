import apiClient from '../apiClient'

const getApplication = async () => {
  const response = await apiClient.get('/api/applications/AllAplications')
  return response.data
}

export default getApplication
