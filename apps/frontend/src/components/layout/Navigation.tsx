// 📖 DOCUMENTATION REFERENCE: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md, Lines 182-224
// 📋 SPEC: Main navigation bar matching design exactly
// 🔧 FIX: Added proper spacing between logo and nav items (gap-12 instead of direct flex)

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'All Programs', path: '/programs' },
    { label: 'Treasures', path: '/treasures' },
    { label: 'My Bonuses', path: '/bonuses' },
    { label: 'Practice Tool', path: '/practice' },
    { label: 'Marketing Hub', path: '/marketing' },
    { label: 'Corporate Programs', path: '/corporate' },
  ];

  return (
    <nav className="bg-[#0a1628] border-b border-[#2a3b52]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex flex-col cursor-pointer mr-12">
            <div className="text-white font-bold text-base leading-tight">THE</div>
            <div className="text-white font-bold text-xl leading-tight">INCREDIBLE</div>
            <div className="text-red-500 font-bold text-xl leading-tight">YOU</div>
          </Link>

          {/* Nav Items - Flex 1 to push user profile to right */}
          <div className="flex-1 flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  text-base font-medium transition-colors py-2
                  ${
                    location.pathname === item.path
                      ? 'text-white border-b-2 border-[#5dade2]'
                      : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Profile */}
          <div className="relative ml-auto">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-[#5dade2] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0) || 'A'}
                </span>
              </div>
              <span className="text-white font-medium">{user?.fullName || 'User'}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1a2332] border border-[#2a3b52] rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-300 hover:bg-[#2a3b52] hover:text-white transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-300 hover:bg-[#2a3b52] hover:text-white transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Settings
                </Link>
                <hr className="my-2 border-[#2a3b52]" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-400 hover:bg-[#2a3b52] hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
