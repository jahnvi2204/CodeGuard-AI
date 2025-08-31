import axios from 'axios';
import { API_BASE_URL } from '../utils/Constants';

console.log('API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - please try again';
    } else if (error.response?.status === 503) {
      error.message = 'Service temporarily unavailable';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error - please try again later';
    } else if (!error.response) {
      error.message = 'Network error - check your connection';
    }
    
    return Promise.reject(error);
  }
);

export default api;
