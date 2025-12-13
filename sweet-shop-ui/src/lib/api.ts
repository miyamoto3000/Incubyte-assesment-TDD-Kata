import axios from 'axios';
import Cookies from 'js-cookie';

// Ensure this matches your Spring Boot port
const API_URL = 'http://localhost:8085/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      // Optional: Redirect to login if needed
    }
    return Promise.reject(error);
  }
);