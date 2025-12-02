// apps/frontend/src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  fullName: string;
  userRole: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        console.log('🔐 AuthStore.login called');
        console.log('  - Token:', token.substring(0, 20) + '...');
        console.log('  - User:', user);
        
        // Save to localStorage FIRST
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Then update store
        set({
          token,
          user,
          isAuthenticated: true,
        });
        
        console.log('✅ AuthStore updated successfully');
      },

      logout: () => {
        console.log('🚪 AuthStore.logout called');
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Clear store
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
        
        console.log('✅ Logged out successfully');
      },

      setUser: (user: User | null) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      // Only persist token and user, not isAuthenticated
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      // After rehydration, set isAuthenticated based on token
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.isAuthenticated = true;
          console.log('🔄 Auth rehydrated from storage');
        }
      },
    }
  )
);
