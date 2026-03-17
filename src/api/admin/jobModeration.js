import apiClient from '@/services/api';

/**
 * Delete a job moderation by ID
 * @param {string} id
 * @returns {Promise} deleted job moderation
 */
export const deleteJobModeration = async (id) => {
  const response = await apiClient.delete(`/api/admin/jobs/moderation/${id}`);
  return response.data;
};

/**
 * Get a job moderation by ID
 * @param {string} id
 * @returns {Promise} single job moderation
 */
export const getJobModerationById = async (id) => {
  const response = await apiClient.get(`/api/admin/jobs/moderation/${id}`);
  return response.data;
};

/**
 * Get list of job moderations with optional filters
 * @param {{status?: string, search?: string, page?: number, limit?: number}} params
 * @returns {Promise} list of job moderations
 */
export const getListOfJobModerations = async (params = {}) => {
  const response = await apiClient.get('/api/admin/jobs/moderation', {
    params
  });
  return response.data;
};

/**
 * Update the activity of a job moderation
 * @param {string} id
 * @param {boolean} isActive
 * @returns {Promise} updated job moderation
 */
export const updateJobActivity = async (id, isActive) => {
  const response = await apiClient.put(`/api/admin/jobs/moderation/${id}/activity`, { isActive });
  return response.data;
};

/**
 * Update the status of a job moderation
 * @param {string} id
 * @param {string} status - "approved" | "rejected"
 * @returns {Promise} updated job moderation
 */
export const updateJobStatus = async (id, status) => {
  const response = await apiClient.put(`/api/admin/jobs/moderation/${id}/status`, { status });
  return response.data;
};