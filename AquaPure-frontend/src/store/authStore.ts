import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const user: User = {
          id: '1',
          name: 'John Doe',
          email: email,
          phone: '+91 9876543210',
        };
        
        set({ user, isAuthenticated: true });
      },

      register: async (data) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user: User = {
          id: Date.now().toString(),
          name: data.name,
          email: data.email,
        };
        
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      resetPassword: async (email: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Password reset email sent to:', email);
      },

      // Social login methods (to be implemented with actual OAuth)
      loginWithGoogle: async () => {
        // TODO: Implement Google OAuth
        console.log('Google login not yet implemented');
      },

      loginWithFacebook: async () => {
        // TODO: Implement Facebook OAuth
        console.log('Facebook login not yet implemented');
      },
    }),
    {
      name: 'aquapure-auth',
    }
  )
);
