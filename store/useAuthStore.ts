import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User } from '../types/auth';
import api from '../lib/api';
import axios from 'axios';


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user } = response.data;

          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false, 
            error: null 
          });
        } catch (err: any) {
          const errorMessage = err.response?.data?.error || err.message || 'Login failed';
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      register: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          // 1. Register user
          await api.post('/auth/register', {
            email: formData.email.trim(),
            password: formData.password.trim(),
            fullName: formData.fullName,
            mobile: formData.mobile,
          });

          // 2. Automatically login after registration
          const loginResponse = await api.post('/auth/login', {
            email: formData.email.trim(),
            password: formData.password.trim(),
          });

          const { user } = loginResponse.data;

          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false, 
            error: null 
          });
        } catch (err: any) {
          const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      logout: async (router?: any) => {
        // 1. Clear local state IMMEDIATELY for UI
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');

        // 2. Redirect IMMEDIATELY to feel fast
        if (router) {
          router.push('/login?logout=true');
        } else if (typeof window !== 'undefined') {
          window.location.replace('/login?logout=true');
        }

        // 3. Clear Cookies on Backend in the background
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout background error:', error);
        }
      },




      setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),

      fetchProfile: async () => {
        try {
          const response = await api.get('/users/profile');
          set({ user: response.data, isAuthenticated: true });
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      },

      clearError: () => set({ error: null }),

    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
