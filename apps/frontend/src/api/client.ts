import axios, { AxiosInstance } from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API client with new pattern
export const api = {
  // Authentication
  auth: {
    login: async (data: { email: string; password: string }) => {
      const response = await axiosInstance.post('/auth/login', data);
      return response.data;
    },

    register: async (data: {
      email: string;
      password: string;
      fullName: string;
      userRole: string;
    }) => {
      const response = await axiosInstance.post('/auth/register', data);
      return response.data;
    },

    logout: async () => {
      const response = await axiosInstance.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data;
    },

    getCurrentUser: async () => {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    },
  },

  // Programs
  programs: {
    getAll: async () => {
      const response = await axiosInstance.get('/programs');
      return response.data;
    },

    getById: async (id: string) => {
      const response = await axiosInstance.get(`/programs/${id}`);
      return response.data;
    },

    getWeeks: async (programId: string) => {
      const response = await axiosInstance.get(`/programs/${programId}/weeks`);
      return response.data;
    },

    getEnrolled: async () => {
      const response = await axiosInstance.get('/programs/user/enrolled');
      return response.data;
    },

    enroll: async (programId: string, batchId?: string) => {
      const response = await axiosInstance.post(`/programs/${programId}/enroll`, { batchId });
      return response.data;
    },
  },

  // Progress Tracking (Priority 7)
  progress: {
    startStep: async (stepId: string, enrollmentId: string) => {
      const response = await axiosInstance.post(`/progress/step/${stepId}/start`, {
        enrollmentId,
      });
      return response.data;
    },

    completeStep: async (stepId: string, enrollmentId: string) => {
      const response = await axiosInstance.post(`/progress/step/${stepId}/complete`, {
        enrollmentId,
      });
      return response.data;
    },

    getEnrollmentProgress: async (enrollmentId: string) => {
      const response = await axiosInstance.get(`/progress/enrollment/${enrollmentId}`);
      return response.data;
    },

    updateStepTime: async (stepId: string, timeSpentSeconds: number) => {
      const response = await axiosInstance.patch(`/progress/step/${stepId}/time`, {
        timeSpentSeconds,
      });
      return response.data;
    },

    getStepProgress: async (stepId: string) => {
      const response = await axiosInstance.get(`/progress/step/${stepId}`);
      return response.data;
    },

    resetEnrollmentProgress: async (enrollmentId: string) => {
      const response = await axiosInstance.delete(`/progress/enrollment/${enrollmentId}/reset`);
      return response.data;
    },

    // Priority 8: Assignment Submission
    submitAssignment: async (
      stepId: string,
      data: {
        enrollmentId: string;
        submissionText?: string;
        submissionFileUrl?: string;
      }
    ) => {
      const response = await axiosInstance.post(`/progress/step/${stepId}/submit`, data);
      return response.data;
    },
  },

  // Files (Priority 8)
  files: {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  },
};

// Legacy compatibility exports for existing code
// This allows existing components to continue using:
// import { authAPI, programsAPI } from '@/api/client'
export const authAPI = api.auth;
export const programsAPI = api.programs;
export const progressAPI = api.progress;
export const filesAPI = api.files;

// Default export
export default api;
