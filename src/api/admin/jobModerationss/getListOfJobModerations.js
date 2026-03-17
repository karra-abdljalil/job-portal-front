import apiClient from '@/services/api'
const {useParams} = useRouter()

/**
 * Get a list of job moderations
 * @query {{status: string, search: string, page: number, limit: number}}
 * @returns {Promise} A promise that resolves to the list of job moderations
 */
const getListOfJobModerations = async () => {

  const {status ,search,page,limit}  =req.query
  
  const response = await apiClient.get('/api/admin/jobs/moderation',{
    params:{
      status,
      search,
      page,
      limit,
    }
  })
  return response.data
}

export default getListOfJobModerations