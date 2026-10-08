import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, ApiUser } from '@/lib/api';

export type User = ApiUser;

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await api.auth.login(email, password);
          if (res.token) {
            localStorage.setItem('token', res.token);
          }
          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await api.auth.register(data);
          if (res.token) {
            localStorage.setItem('token', res.token);
          }
          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateProfile: async (data) => {
        try {
          const res = await api.auth.updateProfile(data);
          set((state) => ({
            user: state.user ? { ...state.user, ...(res.user || data) } : null,
          }));
        } catch (error) {
          // If offline, still update local state
          set((state) => ({
            user: state.user ? { ...state.user, ...data } : null,
          }));
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        await api.auth.forgotPassword(email);
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ user: null, token: null, isAuthenticated: false });
          return;
        }

        try {
          const currentUser = await api.auth.getMe();
          set({ user: currentUser, token, isAuthenticated: true });
        } catch (error) {
          console.warn('Session expired or invalid, logging out.');
          get().logout();
        }
      },
    }),
    {
      name: 'aquapure-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
