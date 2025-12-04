// apps/frontend/src/components/layout/MainLayout.tsx
// IYCT Platform Main Layout - Navigation + Content wrapper

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Design System Colors
const colors = {
  background: '#0a1628',
  card: '#1a2332',
  cardHover: '#1f2940',
  border: '#2a3b52',
  accent: '#5dade2',
  accentHover: '#7dc8f0',
  success: '#34c38f',
  warning: '#f0ad4e',
  error: '#dc3545',
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textMuted: '#a0a0a0',
};

// Icons
const Icons = {
  Home: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Book: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
};

// Logo Component
const Logo: React.FC = () => (
  <div className="flex flex-col leading-tight">
    <span className="text-white font-bold text-lg">THE</span>
    <span className="text-white font-bold text-xl">INCREDIBLE</span>
    <span className="font-bold text-xl" style={{ color: '#ff0000' }}>YOU</span>
  </div>
);

// Navigation Item
const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
    style={{
      backgroundColor: active ? colors.accent : 'transparent',
      color: active ? colors.textPrimary : colors.textMuted,
    }}
    onMouseEnter={(e) => {
      if (!active) e.currentTarget.style.backgroundColor = colors.cardHover;
    }}
    onMouseLeave={(e) => {
      if (!active) e.currentTarget.style.backgroundColor = 'transparent';
    }}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  // Get user info from store or localStorage
  const userName = user?.fullName || 'User';
  const userRole = user?.userRole || 'COACH';
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  const navItems = [
    { to: '/dashboard', icon: <Icons.Home />, label: 'Dashboard' },
    { to: '/programs', icon: <Icons.Book />, label: 'Programs' },
    ...(isAdmin ? [{ to: '/admin', icon: <Icons.Shield />, label: 'Admin' }] : []),
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.background }}>
      {/* Sidebar - Desktop */}
      <aside
        className="hidden lg:flex flex-col w-64 fixed h-full"
        style={{ backgroundColor: colors.card, borderRight: `1px solid ${colors.border}` }}
      >
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <Link to="/dashboard">
            <Logo />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to || location.pathname.startsWith(item.to + '/')}
            />
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4" style={{ borderTop: `1px solid ${colors.border}` }}>
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors"
              style={{ backgroundColor: colors.background }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.cardHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.background)}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: colors.accent }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{userName}</p>
                <p className="text-xs" style={{ color: colors.textMuted }}>{userRole}</p>
              </div>
              <Icons.ChevronDown />
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <div
                className="absolute bottom-full left-0 w-full mb-2 rounded-lg shadow-lg overflow-hidden"
                style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ color: colors.error }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.cardHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Icons.Logout />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: colors.card, borderBottom: `1px solid ${colors.border}` }}
      >
        <Link to="/dashboard">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">THE INCREDIBLE</span>
            <span className="font-bold" style={{ color: '#ff0000' }}>YOU</span>
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ color: colors.textPrimary }}
        >
          {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 pt-16"
          style={{ backgroundColor: colors.card }}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.to}
              />
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ color: colors.error }}
            >
              <Icons.Logout />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
