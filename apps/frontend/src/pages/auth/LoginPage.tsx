import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '@/api/client';
import { useAuthStore } from '@/store/authStore';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: loginStore } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Attempting login...');

      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      console.log('✅ Login response:', response);

      // ✅ FIXED: Correct destructuring - response.data not response.data.data
      const { user, token } = response.data;

      console.log('✅ User:', user);
      console.log('✅ Token:', token);

      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      loginStore(token, user);

      console.log('✅ Auth store updated, navigating to dashboard...');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.response?.data?.error?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] to-[#0f1419] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1e2936] rounded-lg shadow-xl p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              THE<br />
              INCREDIBLE<br />
              <span className="text-[#e74c3c]">YOU</span>
            </h1>
            <p className="text-gray-400 text-sm">Coaching Training Platform</p>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Welcome Back</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#2a3b52] border border-[#3d4f6a] rounded text-white focus:outline-none focus:border-[#5dade2]"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-300 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#2a3b52] border border-[#3d4f6a] rounded text-white focus:outline-none focus:border-[#5dade2]"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#5dade2] hover:bg-[#7dc8f0] text-white font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
