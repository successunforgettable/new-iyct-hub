// TopNavigation.tsx
// Location: apps/frontend/src/components/layout/TopNavigation.tsx
// Context-aware: Shows 2 nav items on dashboard, expands to 6 when in a program

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Logo Component - ARFEEN KHAN HUB with shield
const Logo: React.FC = () => (
  <Link to="/dashboard" className="flex items-center gap-3 group">
    <div className="relative w-12 h-14 sm:w-14 sm:h-16">
      <svg viewBox="0 0 56 64" fill="none" className="w-full h-full">
        <path
          d="M28 2L4 14V30C4 46 28 62 28 62C28 62 52 46 52 30V14L28 2Z"
          fill="#0d1829"
          stroke="#5dade2"
          strokeWidth="2"
        />
        <path
          d="M28 8L10 18V30C10 42 28 54 28 54C28 54 46 42 46 30V18L28 8Z"
          fill="#1a2332"
        />
        <path d="M28 20L24 28L28 26L32 28L28 20Z" fill="#5dade2" />
        <circle cx="28" cy="34" r="4" fill="#5dade2" />
        <path d="M22 42L28 38L34 42" stroke="#5dade2" strokeWidth="2" fill="none" />
        <circle cx="16" cy="24" r="1.5" fill="#f4d03f" />
        <circle cx="40" cy="24" r="1.5" fill="#f4d03f" />
        <circle cx="20" cy="18" r="1" fill="#f4d03f" />
        <circle cx="36" cy="18" r="1" fill="#f4d03f" />
        <circle cx="28" cy="14" r="1" fill="#f4d03f" />
      </svg>
    </div>
    <div className="hidden sm:block">
      <div className="text-white font-bold text-sm tracking-wide">ARFEEN KHAN</div>
      <div className="text-[#5dade2] font-bold text-xs tracking-widest">HUB</div>
    </div>
  </Link>
);

// Navigation items - some only show when inside a program
interface NavItem {
  label: string;
  path: string;
  programOnly: boolean; // If true, only shows when viewing a program
}

const navItems: NavItem[] = [
  { label: 'All Programs', path: '/dashboard', programOnly: false },
  { label: 'Treasures', path: '/treasures', programOnly: true },
  { label: 'My Bonuses', path: '/bonuses', programOnly: true },
  { label: 'Practice Tool', path: '/practice', programOnly: true },
  { label: 'Marketing Hub', path: '/marketing', programOnly: true },
  { label: 'Corporate Programs', path: '/corporate', programOnly: false },
];

// NavItem Component
const NavItemComponent: React.FC<{ item: NavItem; isActive: boolean }> = ({ item, isActive }) => (
  <Link
    to={item.path}
    className={`
      relative px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap
      ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}
    `}
  >
    {item.label}
    {isActive && (
      <span className="absolute bottom-0 left-3 right-3 lg:left-4 lg:right-4 h-0.5 bg-[#5dade2]" />
    )}
  </Link>
);

// User Profile Dropdown
const UserProfile: React.FC<{ name: string; onLogout: () => void }> = ({ name, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium text-sm">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block text-sm font-medium">{name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-[#1a2332] rounded-lg shadow-xl border border-[#2a3b52] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              to="/profile"
              className="block px-4 py-3 text-sm text-gray-300 hover:bg-[#2a3b52] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              My Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-3 text-sm text-gray-300 hover:bg-[#2a3b52] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            <hr className="border-[#2a3b52]" />
            <button
              onClick={() => { setIsOpen(false); onLogout(); }}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#2a3b52] hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Mobile Menu
const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  currentPath: string;
  userName: string;
  onLogout: () => void;
}> = ({ isOpen, onClose, items, currentPath, userName, onLogout }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 w-72 h-full bg-[#0d1829] z-50 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b border-[#2a3b52] flex justify-between items-center">
          <span className="text-white font-medium">Menu</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`
                block px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${currentPath === item.path || (item.path === '/dashboard' && currentPath === '/')
                  ? 'bg-[#5dade2]/10 text-[#5dade2]'
                  : 'text-gray-300 hover:bg-[#1a2332] hover:text-white'}
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2a3b52]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-white font-medium">{userName}</span>
          </div>
          <button
            onClick={() => { onClose(); onLogout(); }}
            className="w-full px-4 py-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

// Main TopNavigation Component
const TopNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if we're inside a program (shows expanded 6-item nav)
  const isInProgram = location.pathname.startsWith('/programs/') && 
                      !location.pathname.endsWith('/programs') &&
                      location.pathname !== '/programs';

  // Filter nav items based on context
  const visibleNavItems = isInProgram 
    ? navItems // Show all 6 items when in a program
    : navItems.filter(item => !item.programOnly); // Show only 2 items on dashboard

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userName = user?.firstName || user?.email?.split('@')[0] || 'User';
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname === path;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1829] border-b border-[#1a2332]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation - centered */}
            <div className="hidden lg:flex items-center gap-1">
              {visibleNavItems.map((item) => (
                <NavItemComponent
                  key={item.path}
                  item={item}
                  isActive={isActive(item.path)}
                />
              ))}
            </div>

            {/* User Profile (Desktop) */}
            <div className="hidden lg:block">
              <UserProfile name={userName} onLogout={handleLogout} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={visibleNavItems}
        currentPath={location.pathname}
        userName={userName}
        onLogout={handleLogout}
      />
    </>
  );
};

export default TopNavigation;
