import apiClient from "@/services/api";

//################################################### Upload cv
export const UploadCv = async (formatDate) => {
  try {
    return apiClient.post(`api/cv/upload`, formatDate, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  } catch (error) {
    throw error.response?.data?.message
  }
};

//################################################### all Cvs as jobseeker
export const getCv_JobSeeker = async () => {
  try {
    const response = await apiClient.get(`api/cv/my-Cvs`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message

  }
};

//################################################### view one cv
export const view_cv = async(cvId)=>{
    try {
        const res = await apiClient.get(`api/cv/view/${cvId}`,{
            responseType:'blob'
        })
        return res.data
    } catch (error) {
    throw error.response?.data?.message
        
    }

}

//################################################### download Cv
export const download_cv = async(cvId)=>{
    try {
        const res = await apiClient.get(`api/cv/download/${cvId}`,{
            responseType:'blob'
        })
        return res.data
    } catch (error) {
    throw error.response?.data?.message
        
    }
}


//################################################### set cv as default
export const set_default_cv = async(id)=>{
    try {
        const res = await apiClient.patch(`api/cv/set-default/${id}`)
        return res.data
    } catch (error) {
    throw error.response?.data?.message
        
    }

}