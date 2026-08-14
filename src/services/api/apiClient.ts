import axios from 'axios';
import { storageService } from '../storage/storageService';
import { useAuthStore } from '../../features/auth/store/authStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  // ngrok's free-tier interstitial intercepts requests that look
  // browser-originated, returning its HTML warning page instead of the
  // real API response. This header (any value) makes ngrok skip it — a
  // no-op against a non-ngrok API_URL.
  headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await storageService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storageService.clear();
      // Força logout no estado global para redirecionar ao login
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
