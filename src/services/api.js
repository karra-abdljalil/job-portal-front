import axios from "axios";

const config = {
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

const apiClient = axios.create(config);

// This instance is used ONLY for refreshing tokens to avoid interceptor loops
const refreshClient = axios.create(config);

// 2. Request Interceptor (Simplifying your Throttler)
let PENDING_REQUESTS = 0;
const MAX_REQUESTS_COUNT = 5;

apiClient.interceptors.request.use(async (config) => {
  // If you must throttle, use a simple check rather than an interval loop
  // Most apps don't need this unless you have a very specific API limit
  if (PENDING_REQUESTS >= MAX_REQUESTS_COUNT) {
    return Promise.reject(new Error("Too many concurrent requests"));
  }
  
  PENDING_REQUESTS++;
  return config;
}, (error) => Promise.reject(error));

// 3. Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return response;
  },
  async (error) => {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use the refreshClient so this call doesn't trigger the interceptor again
        await refreshClient.get("/api/auth/refresh");
        
        // Retry the original request with the new cookie/token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed (Session truly expired)
        // Don't redirect here! Let the React Context handle the state change.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;