/**
 * Why it exists: Configures a global Axios instance for making API calls to the FastAPI backend.
 * Why this implementation is scalable: Global interceptors allow us to handle Authentication headers and global Error logging (like triggering a 401 redirect) in one place.
 */
import axios from 'axios';

// Ensure this matches the FastAPI default port
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for responses to uniformly extract data and catch errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can add Toast notification triggers here for global 500 errors
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
