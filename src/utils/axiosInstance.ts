import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
