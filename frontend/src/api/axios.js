import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally (skip redirect on auth login/register attempts)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRequest =
      err.config?.url?.includes('/auth/login') ||
      err.config?.url?.includes('/auth/register');
    if (err.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
