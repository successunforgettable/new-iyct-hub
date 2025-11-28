// apps/frontend/src/pages/auth/RegisterPage.tsx
// 📖 DOCUMENTATION REFERENCE: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md, Priority 1
// 📋 SPEC: Register page matching login design with validation
// 🔧 IMPLEMENTATION: Email, password, confirm password, fullName, userRole fields
// ✅ VERIFICATION: Form submits to POST /api/v1/auth/register, redirects to dashboard

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../api/client';
import { Button } from '../../components/common/Button';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userRole: 'COACH' as 'COACH' | 'CLIENT'
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    fullName?: string;
  }>({});

  // 📖 REF: PROJECT_MASTER_PLAN.md Section 6.3 - Input validation
  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    // Full name validation
    if (!formData.fullName) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }
    
    // Password validation - 📖 REF: auth.validator.ts Zod schema
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // 📖 REF: PROJECT_MASTER_PLAN.md Section 6.1 - POST /api/v1/auth/register
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        userRole: formData.userRole
      });
      
      // 📖 REF: authStore.ts - login action stores token and user
      login(response.data.token, response.data.user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // 📖 REF: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md - Exact login page design
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo - 📖 REF: LoginPage.tsx structure */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="text-white font-bold text-2xl">THE</div>
            <div className="text-white font-bold text-3xl">INCREDIBLE</div>
            <div className="text-red-500 font-bold text-3xl">YOU</div>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-[#1a2332] rounded-xl p-8 border border-[#2a3b52]">
          <h2 className="text-white text-2xl font-semibold mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm mb-6">Join the coaching community</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name - 📖 REF: Priority 1 requirements */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full bg-[#0a1628] text-white px-4 py-3 rounded-lg border ${
                  validationErrors.fullName 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-[#2a3b52] focus:border-[#5dade2]'
                } focus:outline-none transition-colors`}
                placeholder="Enter your full name"
              />
              {validationErrors.fullName && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full bg-[#0a1628] text-white px-4 py-3 rounded-lg border ${
                  validationErrors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-[#2a3b52] focus:border-[#5dade2]'
                } focus:outline-none transition-colors`}
                placeholder="Enter your email"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* User Role - 📖 REF: Priority 1 requirements */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                I am a
              </label>
              <select
                value={formData.userRole}
                onChange={(e) => handleInputChange('userRole', e.target.value as 'COACH' | 'CLIENT')}
                className="w-full bg-[#0a1628] text-white px-4 py-3 rounded-lg border border-[#2a3b52] focus:border-[#5dade2] focus:outline-none transition-colors"
              >
                <option value="COACH">Coach</option>
                <option value="CLIENT">Client</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full bg-[#0a1628] text-white px-4 py-3 rounded-lg border ${
                    validationErrors.password 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[#2a3b52] focus:border-[#5dade2]'
                  } focus:outline-none transition-colors pr-12`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Confirm Password - 📖 REF: Priority 1 requirements */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full bg-[#0a1628] text-white px-4 py-3 rounded-lg border ${
                    validationErrors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[#2a3b52] focus:border-[#5dade2]'
                  } focus:outline-none transition-colors pr-12`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button - 📖 REF: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md Button specs */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#5dade2] hover:text-[#7dc8f0] transition-colors font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          By creating an account, you agree to our Terms & Conditions and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
