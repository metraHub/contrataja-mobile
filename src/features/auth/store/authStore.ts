import { create } from 'zustand';
import { User, UserType, RegisterData, LoginData } from '../../../types';
import { authApi } from '../services/authApi';
import { storageService } from '../../../services/storage/storageService';
import { socketService } from '../../../services/socket/socketService';
import { registerPushToken } from '../../../services/notifications/pushService';

interface AuthState {
  token: string | null;
  user: { id: string; email: string; type: UserType } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  clearError: () => void;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(data);
      await storageService.saveToken(response.access_token);
      await storageService.saveUser(response.user);
      set({
        token: response.access_token,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      registerPushToken().catch(() => {});
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Erro ao fazer login',
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(data);
      await storageService.saveToken(response.access_token);
      await storageService.saveUser(response.user);
      set({
        token: response.access_token,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Erro ao cadastrar',
      });
      throw error;
    }
  },

  logout: async () => {
    await storageService.clear();
    socketService.disconnectAll();
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadStoredAuth: async () => {
    set({ isLoading: true });

    try {
      const token = await storageService.getToken();
      const user = await storageService.getUser();

      if (token && user) {
        set({
          token,
          user,
          isAuthenticated: true,
        });
        registerPushToken().catch(() => {});
      }
    } catch (error) {
      console.log('Erro ao carregar auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  deleteAccount: async () => {
    await authApi.deleteAccount();
    await storageService.clear();
    socketService.disconnectAll();
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
