// 📖 DOCUMENTATION REFERENCE:
// - PROJECT_MASTER_PLAN.md, Section 7 (Frontend Architecture)
// - SESSION2_COMPLETE_HANDOFF.md (Original LoginPage)
// 📋 SPEC: Login page with email/password authentication
// 🔧 FIX: Updated to use new authAPI from client.ts and proper navigation

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/api/client';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Attempting login...');
      
      // Call login API
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      console.log('✅ Login response:', response.data);

      // Extract data from response
      const { user, token } = response.data.data;

      // Save to auth store
      login(token, user);

      console.log('✅ Auth store updated, navigating to dashboard...');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Login error:', err);
      
      // Extract error message
      const errorMessage =
        err.response?.data?.error?.message ||
        err.message ||
        'Login failed. Please try again.';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-white font-bold text-2xl">THE</div>
          <div className="text-white font-bold text-3xl">INCREDIBLE</div>
          <div className="text-red-500 font-bold text-3xl mb-2">YOU</div>
          <p className="text-gray-400 text-sm">Coaching Training Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1a2332] rounded-xl p-8 border border-[#2a3b52]">
          <h2 className="text-white text-2xl font-semibold mb-6">Welcome Back</h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-[#0a1628] border border-[#2a3b52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#5dade2] transition-colors"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-[#0a1628] border border-[#2a3b52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#5dade2] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5dade2] text-white py-3 rounded-lg font-medium hover:bg-[#7dc8f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#5dade2] hover:text-[#7dc8f0]">
                Register here
              </Link>
            </p>
          </div>

          {/* Test Account Info */}
          <div className="mt-6 pt-6 border-t border-[#2a3b52]">
            <p className="text-gray-500 text-xs text-center">
              Test Account: arfeen@iyct.com / Arfeen123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
