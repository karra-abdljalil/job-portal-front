import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/applications";

// get app as job seeker
export const getMyApplications_JobSeeker = async (
  userId,
  search = "",
  page = 1,
  limit = 10,
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/myApplications/${userId}?search=${search}&page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// send the decision
export const decideOffer = async (appId, decision) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/${appId}/decision`,
      { decision },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return res;
  } catch (err) {
    throw err.res || err.message;
  }
};
