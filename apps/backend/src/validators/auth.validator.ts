// Authentication Validation Schemas
// Reference: PROJECT_MASTER_PLAN.md Section 6.3 - "Input Validation"

import { z } from 'zod';
import { UserRole } from '@prisma/client';

/**
 * Register validation schema
 * Reference: PROJECT_MASTER_PLAN.md Section 6.3
 * 
 * Password requirements:
 * - Minimum 8 characters
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one digit
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  userRole: z.nativeEnum(UserRole),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

/**
 * Login validation schema
 * Reference: PROJECT_MASTER_PLAN.md Section 6.3
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Update profile validation schema
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1 - "PATCH /users/me"
 */
export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
