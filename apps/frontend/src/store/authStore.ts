// apps/frontend/src/store/authStore.ts
// Zustand store for authentication state

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  userId: string;
  email: string;
  fullName: string;
  userRole: string;
  avatarUrl?: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (token: string, refreshToken: string | null, user: User) => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, refreshToken, user) => {
        localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
        });
      },

      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token, isAuthenticated: true });
      },

      setUser: (user) => {
        set({ user });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
