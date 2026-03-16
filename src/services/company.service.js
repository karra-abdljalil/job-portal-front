import axios from "axios";

export async function createCompany(payload) {
  const res = await axios.post(
    "http://localhost:5000/api/employer/company",
    payload,
    {
      withCredentials: true,
    }
  );
  return res.data;
}

export async function getMyCompany() {
  const res = await axios.get(
    "http://localhost:5000/api/employer/company/me",
    {
      withCredentials: true,
    }
  );
  return res.data;
}

export async function updateMyCompany(payload) {
  const res = await axios.put(
    "http://localhost:5000/api/employer/company/me",
    payload,
    {
      withCredentials: true,
    }
  );
  return res.data;
}