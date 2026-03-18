import apiClient from "@/services/api";

const BASE = "/api/job-seeker/skills";

export const getMySkills = async () => {
  const response = await apiClient.get(`${BASE}/mySkills`);
  return response.data;
};

export const getAllSkills = async () => {
  const response = await apiClient.get(BASE);
  return response.data;
};

export const addSkillToProfile = async (skillId) => {
  const response = await apiClient.post(`${BASE}/add`, { skillId });
  return response.data;
};

export const removeSkillFromProfile = async (skillId) => {
  const response = await apiClient.delete(`${BASE}/remove`, { data: { skillId } });
  return response.data;
};

export const createSkill = async (payload) => {
  const response = await apiClient.post("/api/job-seeker/skills", payload);
  return response.data;
};