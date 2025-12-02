// apps/frontend/src/components/auth/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function ProtectedRoute() {
  // Check BOTH localStorage and Zustand store
  const token = localStorage.getItem('token');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  console.log('🛡️ ProtectedRoute check:');
  console.log('  - localStorage token:', token ? 'EXISTS' : 'MISSING');
  console.log('  - Zustand isAuthenticated:', isAuthenticated);

  // If no token in localStorage, redirect to login
  if (!token) {
    console.log('❌ No token found - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Token found - allowing access');
  return <Outlet />;
}
