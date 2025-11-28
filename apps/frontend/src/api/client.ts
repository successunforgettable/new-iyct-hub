import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Only logout on 401, not on other errors
    if (error.response?.status === 401) {
      console.log('🔐 Unauthorized - logging out');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // ✅ FIX: Handle both ways of calling - unwrap if needed
  login: (emailOrData: string | { email: string; password: string }, password?: string) => {
    let email: string;
    let pass: string;

    // Check if called with separate params or object
    if (typeof emailOrData === 'string' && password) {
      // Called as: login(email, password)
      email = emailOrData;
      pass = password;
    } else if (typeof emailOrData === 'object') {
      // Called as: login({ email, password })
      email = emailOrData.email;
      pass = emailOrData.password;
    } else {
      throw new Error('Invalid login parameters');
    }

    console.log('📧 Login request:', { email, password: '***' });
    
    // Always send clean data to backend
    return axiosInstance.post('/auth/login', { email, password: pass });
  },

  register: (data: {
    email: string;
    password: string;
    fullName: string;
    userRole: string;
  }) => axiosInstance.post('/auth/register', data),

  logout: () => axiosInstance.post('/auth/logout'),
};

// Programs API
export const programsAPI = {
  // Get all programs
  getAllPrograms: () => axiosInstance.get('/programs'),

  // Get single program
  getProgramById: (programId: string) => axiosInstance.get(`/programs/${programId}`),

  // Get program with weeks and steps
  getProgramWeeks: (programId: string) =>
    axiosInstance.get(`/programs/${programId}/weeks`),

  // Get user's enrolled programs
  getEnrolledPrograms: () => axiosInstance.get('/programs/user/enrolled'),

  // Enroll in program
  enrollInProgram: (programId: string) =>
    axiosInstance.post(`/programs/${programId}/enroll`),
};

export default axiosInstance;
