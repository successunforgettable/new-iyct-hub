import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import TopNavigation from './components/layout/TopNavigation';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProgramListPage from './pages/programs/ProgramListPage';
import ProgramDetailPage from './pages/programs/ProgramDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a1628' }}>
      <TopNavigation />
      <main className="pt-16">{children}</main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/programs"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProgramListPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/programs/:programId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProgramDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
