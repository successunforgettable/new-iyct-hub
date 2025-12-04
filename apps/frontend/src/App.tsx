// App.tsx
// Location: apps/frontend/src/App.tsx
// Updated to use TopNavigation (horizontal) instead of sidebar

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import TopNavigation from './components/layout/TopNavigation';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProgramDetailPage from './pages/programs/ProgramDetailPage';

// Placeholder for Admin (will be built later)
const AdminPlaceholder: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-[#5dade2] mb-4">Admin Dashboard</h1>
    <p className="text-gray-400">Admin panel coming soon...</p>
  </div>
);

// Layout wrapper for authenticated pages with TopNavigation
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#0a1628]">
    <TopNavigation />
    {/* Main content with top padding for fixed nav */}
    <main className="pt-20">
      {children}
    </main>
  </div>
);

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#5dade2] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

// Public Route (redirect to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5dade2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Admin Route (requires admin role)
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5dade2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/programs/:programId"
          element={
            <ProtectedRoute>
              <ProgramDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Placeholder routes for program-context nav items */}
        <Route
          path="/treasures"
          element={
            <ProtectedRoute>
              <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-[#5dade2] mb-4">Treasures</h1>
                <p className="text-gray-400">Coming soon...</p>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bonuses"
          element={
            <ProtectedRoute>
              <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-[#5dade2] mb-4">My Bonuses</h1>
                <p className="text-gray-400">Coming soon...</p>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-[#5dade2] mb-4">Practice Tool</h1>
                <p className="text-gray-400">Coming soon...</p>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing"
          element={
            <ProtectedRoute>
              <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-[#5dade2] mb-4">Marketing Hub</h1>
                <p className="text-gray-400">Coming soon...</p>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/corporate"
          element={
            <ProtectedRoute>
              <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-[#5dade2] mb-4">Corporate Programs</h1>
                <p className="text-gray-400">Coming soon...</p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPlaceholder />
            </AdminRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
