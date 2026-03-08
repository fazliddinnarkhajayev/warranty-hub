// API Client for warranty_bot backend using Axios

import axios from 'axios';

const API_BASE_URL = 'https://api.warranty-hub.com/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: attach Bearer token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('warranty_bot_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: unwrap envelope & handle auth errors
axiosClient.interceptors.response.use(
  (response) => {
    const data = response.data;
    // Unwrap backend envelope if present
    if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
      return { ...response, data: data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('warranty_bot_token');
      localStorage.removeItem('warranty_bot_user');
      // Redirect to login
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const res = await axiosClient.get<T>(endpoint);
    return res.data;
  },

  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const res = await axiosClient.post<T>(endpoint, data);
    return res.data;
  },

  put: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const res = await axiosClient.put<T>(endpoint, data);
    return res.data;
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const res = await axiosClient.delete<T>(endpoint);
    return res.data;
  },
};

export default api;
