// apps/frontend/src/api/client.ts
// Complete API client with all endpoints: Auth, Programs, Progress, Files, Analytics, Coach

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface User {
  userId: string;
  email: string;
  fullName: string;
  userRole: 'coach' | 'client' | 'admin' | 'superadmin';
  avatarUrl?: string;
  phoneNumber?: string;
  countryCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken?: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  userRole?: 'coach' | 'client';
  phoneNumber?: string;
  countryCode?: string;
}

export interface Program {
  programId: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramWeek {
  weekId: string;
  programId: string;
  weekNumber: number;
  title: string;
  description?: string;
  steps: ProgramStep[];
}

export interface ProgramStep {
  stepId: string;
  weekId: string;
  stepNumber: number;
  title: string;
  description?: string;
  stepType: 'VIDEO' | 'READING' | 'ASSIGNMENT' | 'QUIZ' | 'ACTIVITY';
  contentUrl?: string;
  duration?: number;
  isRequired: boolean;
}

export interface Enrollment {
  enrollmentId: string;
  userId: string;
  programId: string;
  batchId?: string;
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
  timeSpentSeconds?: number;
  submissionText?: string;
  submissionFileUrl?: string;
  submittedAt?: string;
  grade?: number;
  feedback?: string;
}

export interface EnrollmentProgress {
  enrollmentId: string;
  completionPercentage: number;
  currentWeek: number;
  stepProgress: StepProgress[];
}

export interface FileUploadResponse {
  success: boolean;
  data: {
    url: string;
    filename: string;
    originalName: string;
    size: number;
  };
}

export interface DashboardStats {
  enrolledPrograms: number;
  completedPrograms: number;
  totalStepsCompleted: number;
  overallProgress: number;
  currentStreak: number;
  lastActivity: string | null;
}

export interface ProgramProgress {
  programId: string;
  programName: string;
  completionPercentage: number;
  currentWeek: number;
  totalWeeks: number;
  stepsCompleted: number;
  totalSteps: number;
  lastUpdated: string;
}

export interface WeeklyProgress {
  week: string;
  stepsCompleted: number;
}

export interface RecentActivity {
  id: string;
  type: 'step_completed' | 'assignment_submitted' | 'week_completed' | 'program_started' | 'achievement_unlocked';
  title: string;
  description: string;
  programName?: string;
  timestamp: string;
  icon: string;
}

export interface QuickAction {
  id: string;
  type: 'continue_program' | 'submit_assignment' | 'start_new' | 'view_certificate';
  title: string;
  subtitle: string;
  link: string;
  priority: number;
  programId?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  programProgress: ProgramProgress[];
  weeklyProgress: WeeklyProgress[];
  recentActivity: RecentActivity[];
  quickActions: QuickAction[];
}

// Coach Types
export interface CoachClient {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  enrolledPrograms: number;
  overallProgress: number;
  lastActive: string | null;
  status: 'active' | 'inactive' | 'completed';
}

export interface CoachStats {
  totalClients: number;
  activeClients: number;
  averageClientProgress: number;
  certificationsEarned: number;
  pendingCertifications: number;
}

export interface CoachDashboardData {
  stats: CoachStats;
  clients: CoachClient[];
  clientProgress: any[];
  certifications: any[];
  recentClientActivity: any[];
}

// ============================================
// AXIOS INSTANCE
// ============================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { token } = response.data.data;
          localStorage.setItem('token', token);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } else {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// API METHODS
// ============================================

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
      try {
        await apiClient.post('/auth/logout');
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    },

    getCurrentUser: async (): Promise<User> => {
      const response = await apiClient.get('/users/me');
      return response.data.data;
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
      const response = await apiClient.patch('/users/me', data);
      return response.data.data;
    },

    forgotPassword: async (email: string): Promise<void> => {
      await apiClient.post('/auth/forgot-password', { email });
    },

    resetPassword: async (token: string, password: string): Promise<void> => {
      await apiClient.post('/auth/reset-password', { token, password });
    },

    refreshToken: async (): Promise<string> => {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await apiClient.post('/auth/refresh', { refreshToken });
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      return token;
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
    getEnrollmentProgress: async (enrollmentId: string): Promise<EnrollmentProgress> => {
      const response = await apiClient.get(`/progress/enrollment/${enrollmentId}`);
      return response.data.data;
    },

    getStepProgress: async (stepId: string): Promise<StepProgress> => {
      const response = await apiClient.get(`/progress/step/${stepId}`);
      return response.data.data;
    },

    startStep: async (stepId: string, enrollmentId: string): Promise<StepProgress> => {
      const response = await apiClient.post(`/progress/step/${stepId}/start`, { enrollmentId });
      return response.data.data;
    },

    completeStep: async (stepId: string, enrollmentId: string): Promise<StepProgress> => {
      const response = await apiClient.post(`/progress/step/${stepId}/complete`, { enrollmentId });
      return response.data.data;
    },

    updateTimeSpent: async (stepId: string, timeSpentSeconds: number): Promise<StepProgress> => {
      const response = await apiClient.patch(`/progress/step/${stepId}/time`, { timeSpentSeconds });
      return response.data.data;
    },

    submitAssignment: async (
      stepId: string,
      enrollmentId: string,
      data: { submissionText?: string; submissionFileUrl?: string }
    ): Promise<StepProgress> => {
      const response = await apiClient.post(`/progress/step/${stepId}/submit`, { enrollmentId, ...data });
      return response.data.data;
    },

    resetEnrollment: async (enrollmentId: string): Promise<void> => {
      await apiClient.delete(`/progress/enrollment/${enrollmentId}/reset`);
    },
  },

  files: {
    upload: async (file: File): Promise<FileUploadResponse['data']> => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    },
  },

  analytics: {
    getDashboard: async (): Promise<DashboardData> => {
      const response = await apiClient.get('/analytics/dashboard');
      return response.data.data;
    },
  },

  coach: {
    getDashboard: async (): Promise<CoachDashboardData> => {
      const response = await apiClient.get('/coach/dashboard');
      return response.data.data;
    },

    getClientDetails: async (clientId: string): Promise<any> => {
      const response = await apiClient.get(`/coach/clients/${clientId}`);
      return response.data.data;
    },
  },
};

// ============================================
// LEGACY EXPORTS (backward compatibility)
// ============================================

export const authAPI = {
  login: api.auth.login,
  register: api.auth.register,
  logout: api.auth.logout,
  getCurrentUser: api.auth.getCurrentUser,
  updateProfile: api.auth.updateProfile,
  forgotPassword: api.auth.forgotPassword,
  resetPassword: api.auth.resetPassword,
  refreshToken: api.auth.refreshToken,
};

export const programsAPI = {
  getAll: api.programs.getAll,
  getById: api.programs.getById,
  getWeeks: api.programs.getWeeks,
  getEnrolled: api.programs.getEnrolled,
  enroll: api.programs.enroll,
};

export const progressAPI = {
  getEnrollmentProgress: api.progress.getEnrollmentProgress,
  getStepProgress: api.progress.getStepProgress,
  startStep: api.progress.startStep,
  completeStep: api.progress.completeStep,
  updateTimeSpent: api.progress.updateTimeSpent,
  submitAssignment: api.progress.submitAssignment,
  resetEnrollment: api.progress.resetEnrollment,
};

export const filesAPI = {
  upload: api.files.upload,
};

export const analyticsAPI = {
  getDashboard: api.analytics.getDashboard,
};

export const coachAPI = {
  getDashboard: api.coach.getDashboard,
  getClientDetails: api.coach.getClientDetails,
};

export { apiClient };
export default api;
