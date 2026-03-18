import apiClient from '@/services/api'
const {useParams} = useRouter()



export const searchJobs = async ()=>{
  let params = useParams();
    params.keyword;
    params.status;
    params.page;
    
    let limit = params.limit || 10;
    let page = params.page || 1;  
    let status = params.status || '';
    let keyword = params.keyword || '';
    
    const response = await apiClient.get("/api/admin/jobs/", {
      params: {
        limit,
        page,
        status,
        keyword,
      },
    })
    
    return response.data;
    
    
}