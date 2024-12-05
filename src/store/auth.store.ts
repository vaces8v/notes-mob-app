import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { IUser } from '@/types/user.types';
import { login as loginService, getProfile } from '@/service/users';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const { token } = await loginService({ email, password });
      await SecureStore.setItemAsync('token', token);
      const profile = await getProfile();
      set({ token, user: profile, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ token: null, user: null });
  },
  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const profile = await getProfile();
        set({ token, user: profile });
      }
    } catch (error) {
      set({ token: null, user: null });
    }
  },
}));
