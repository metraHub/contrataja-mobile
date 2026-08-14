import { create } from 'zustand';
import { User } from '../../../types';
import { authApi } from '../../auth/services/authApi';

interface UserState {
  profile: User | null;
  isLoading: boolean;

  fetchProfile: () => Promise<void>;
  setProfile: (profile: User) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const data = await authApi.getMe();
      set({ profile: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
