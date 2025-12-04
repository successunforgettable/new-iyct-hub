// apps/frontend/src/pages/auth/LoginPage.tsx
// IYCT Login Page - Matches design system

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

// Design System Colors
const colors = {
  background: '#0a1628',
  card: '#1a2332',
  border: '#2a3b52',
  accent: '#5dade2',
  accentHover: '#7dc8f0',
  success: '#34c38f',
  error: '#dc3545',
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textMuted: '#a0a0a0',
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.auth.login({ email, password });
      
      if (response.success && response.data) {
        const { token, refreshToken, user } = response.data;
        
        // Save to store (also persists to localStorage)
        setAuth(token, refreshToken || null, {
          userId: user.userId,
          email: user.email,
          fullName: user.fullName,
          userRole: user.userRole,
          avatarUrl: user.avatarUrl,
        });
        
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.background }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <span className="block text-white font-bold text-2xl">THE</span>
            <span className="block text-white font-bold text-3xl">INCREDIBLE</span>
            <span className="block font-bold text-3xl" style={{ color: '#ff0000' }}>YOU</span>
          </div>
          <p className="mt-4" style={{ color: colors.textMuted }}>Coach Training Hub</p>
        </div>

        {/* Login Form */}
        <div className="p-8 rounded-xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <h2 className="text-xl font-semibold mb-6 text-center" style={{ color: colors.textPrimary }}>
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(220, 53, 69, 0.2)', color: colors.error }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.accentHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.accent)}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: colors.textMuted }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: colors.accent }} className="hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs" style={{ color: colors.textMuted }}>
          © 2025 Incredible You Management Training LLC
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
