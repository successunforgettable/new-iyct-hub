// Shared TypeScript Types
// Reference: PROJECT_MASTER_PLAN.md Section 6.2 - API Response Format

// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  userRole: 'SUPERADMIN' | 'ADMIN' | 'COACH' | 'CLIENT';
  phone?: string;
  city?: string;
  country?: string;
  timezone?: string;
  language?: string;
  currency?: string;
  emailVerified: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  createdAt: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    requestId?: string;
  };
}

// Auth responses
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    userRole: string;
  };
  token: string;
  refreshToken: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
