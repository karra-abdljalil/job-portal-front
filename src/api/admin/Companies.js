import ApiClient from '@/services/api'
/**
 * a function that fetch all companies 
 * @return  { Promise}
 */ 
const fetchAllCompanies = async()=>
  {
    const response = await ApiClient.get("/api/admin/companies")
      return response.data
  }
/**
 * a function that get company by id 
 * @params {id}
 * @return {Promise} 
 */ 
  const getCompanyById = async (id)=>{
    const response = await ApiClient.get(`/api/admin/companies/${id}`)
    
    return response.data
  }
/**
 * a function that consume admin s' update company 
 * @params {id}
 * @params {data}
 * @return { Promise} 
 */ 
const updateCompanyById = async (id,data)=>
{
  const response = await ApiClient.patch(`/api/admin/companies/${id}`,data)
  return response.data
}

export  {
fetchAllCompanies,
getCompanyById,
updateCompanyById
}