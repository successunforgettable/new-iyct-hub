// apps/frontend/src/api/client.ts
// Complete API client: Auth, Programs, Progress, Files, Analytics, Admin

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Types
export interface User {
  userId: string;
  email: string;
  fullName: string;
  userRole: 'coach' | 'client' | 'admin' | 'superadmin';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: { user: User; token: string; refreshToken?: string };
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  userRole?: 'coach' | 'client';
}

export interface Program {
  programId: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProgramWeek {
  weekId: string;
  programId: string;
  weekNumber: number;
  title: string;
  steps: ProgramStep[];
}

export interface ProgramStep {
  stepId: string;
  weekId: string;
  stepNumber: number;
  title: string;
  stepType: 'VIDEO' | 'READING' | 'ASSIGNMENT' | 'QUIZ' | 'ACTIVITY';
  isRequired: boolean;
}

export interface Enrollment {
  enrollmentId: string;
  userId: string;
  programId: string;
  currentWeek: number;
  completionPercentage: number;
  enrolledAt: string;
  program?: Program;
}

export interface StepProgress {
  id: string;
  enrollmentId: string;
  stepId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SUBMITTED';
  startedAt?: string;
  completedAt?: string;
}

export interface DashboardData {
  stats: any;
  programProgress: any[];
  weeklyProgress: any[];
  recentActivity: any[];
  quickActions: any[];
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Axios Instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods
export const api = {
  auth: {
    login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, refreshToken } = response.data.data;
      localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      return response.data;
    },
    register: async (data: RegisterData): Promise<AuthResponse> => {
      const response = await apiClient.post('/auth/register', data);
      const { token, refreshToken } = response.data.data;
      localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      return response.data;
    },
    logout: async (): Promise<void> => {
      try { await apiClient.post('/auth/logout'); } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    },
    getCurrentUser: async (): Promise<User> => {
      const response = await apiClient.get('/users/me');
      return response.data.data;
    },
  },

  programs: {
    getAll: async (): Promise<Program[]> => {
      const response = await apiClient.get('/programs');
      return response.data.data;
    },
    getById: async (programId: string): Promise<Program> => {
      const response = await apiClient.get(`/programs/${programId}`);
      return response.data.data;
    },
    getWeeks: async (programId: string): Promise<ProgramWeek[]> => {
      const response = await apiClient.get(`/programs/${programId}/weeks`);
      return response.data.data;
    },
    getEnrolled: async (): Promise<Enrollment[]> => {
      const response = await apiClient.get('/programs/user/enrolled');
      return response.data.data;
    },
    enroll: async (programId: string, batchId?: string): Promise<Enrollment> => {
      const response = await apiClient.post(`/programs/${programId}/enroll`, { batchId });
      return response.data.data;
    },
  },

  progress: {
    getEnrollmentProgress: async (enrollmentId: string) => {
      const response = await apiClient.get(`/progress/enrollment/${enrollmentId}`);
      return response.data.data;
    },
    getStepProgress: async (stepId: string) => {
      const response = await apiClient.get(`/progress/step/${stepId}`);
      return response.data.data;
    },
    startStep: async (stepId: string, enrollmentId: string) => {
      const response = await apiClient.post(`/progress/step/${stepId}/start`, { enrollmentId });
      return response.data.data;
    },
    completeStep: async (stepId: string, enrollmentId: string) => {
      const response = await apiClient.post(`/progress/step/${stepId}/complete`, { enrollmentId });
      return response.data.data;
    },
    submitAssignment: async (stepId: string, enrollmentId: string, data: { submissionText?: string; submissionFileUrl?: string }) => {
      const response = await apiClient.post(`/progress/step/${stepId}/submit`, { enrollmentId, ...data });
      return response.data.data;
    },
  },

  files: {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data.data;
    },
  },

  analytics: {
    getDashboard: async (): Promise<DashboardData> => {
      const response = await apiClient.get('/analytics/dashboard');
      return response.data.data;
    },
  },

  admin: {
    getUsers: async (params: { page?: number; limit?: number; search?: string; role?: string }): Promise<PaginatedResponse<AdminUser>> => {
      const response = await apiClient.get('/admin/users', { params });
      return { data: response.data.data, pagination: response.data.pagination };
    },
    updateUser: async (userId: string, data: { fullName?: string; userRole?: string; status?: string }) => {
      const response = await apiClient.patch(`/admin/users/${userId}`, data);
      return response.data.data;
    },
    deleteUser: async (userId: string) => {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    },
    updateProgram: async (programId: string, data: { isPublished?: boolean }) => {
      const response = await apiClient.patch(`/admin/programs/${programId}`, data);
      return response.data.data;
    },
    getPrograms: async () => {
      const response = await apiClient.get('/admin/programs');
      return response.data.data;
    },
    getAnalytics: async () => {
      const response = await apiClient.get('/admin/analytics');
      return response.data.data;
    },
  },

  // Inner DNA Assessment
  innerDna: {
    startAssessment: async () => {
      const response = await apiClient.post('/inner-dna/start');
      return response.data;
    },
    getAssessment: async () => {
      const response = await apiClient.get('/inner-dna/assessment');
      return response.data;
    },
    getAllQuestions: async () => {
      const response = await apiClient.get('/inner-dna/rheti/questions');
      return response.data;
    },
    submitAnswer: async (assessmentId: string, questionNumber: number, selectedOption: 'A' | 'B') => {
      const response = await apiClient.post('/inner-dna/rheti/answer', {
        assessmentId,
        questionNumber,
        selectedOption,
      });
      return response.data;
    },
    getNextHeroScenario: async () => {
      const response = await apiClient.get("/inner-dna/hero/scenario");
      return response.data;
    },
    submitHeroAnswer: async (assessmentId: string, scenarioId: string, selectedOptionId: string, selectedType: number, optionConfidence: number) => {
      const response = await apiClient.post("/inner-dna/hero/answer", { assessmentId, scenarioId, selectedOptionId, selectedType, optionConfidence });
      return response.data;
    },
    getHeroProgress: async () => {
      const response = await apiClient.get("/inner-dna/hero/progress");
      return response.data;
    },
  },
};

// Legacy exports
export const authAPI = api.auth;
export const programsAPI = api.programs;
export const progressAPI = api.progress;
export const filesAPI = api.files;
export const analyticsAPI = api.analytics;
export const adminAPI = api.admin;
export const innerDnaAPI = api.innerDna;

export { apiClient };
export default api;

