import axios from 'axios';
import { API_URL } from './api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add token to every request automatically (except login/register)
axiosInstance.interceptors.request.use(
  (config) => {
    // Don't add token to authentication endpoints
    const publicEndpoints = ['/auth/admin/login', '/auth/login', '/auth/company/register', '/auth/student/register'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    // Only add token if it's NOT a public endpoint
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;