// Authentication Controller
// Reference: PROJECT_MASTER_PLAN.md Section 6.1 - "Controllers (Thin - routing only)"
// Reference: PROJECT_MASTER_PLAN.md Section 6.2 - "API Response Format"

import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';

/**
 * Register new user
 * POST /api/v1/auth/register
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);

    // Register user
    const result = await authService.registerUser(validatedData);

    // Success response format per Section 6.2
    res.status(201).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Error response format per Section 6.2
    if (error instanceof Error) {
      const statusCode = error.message === 'EMAIL_EXISTS' ? 400 : 500;

      res.status(statusCode).json({
        success: false,
        error: {
          code: error.message === 'EMAIL_EXISTS' ? 'EMAIL_EXISTS' : 'REGISTRATION_FAILED',
          message:
            error.message === 'EMAIL_EXISTS'
              ? 'Email already registered'
              : 'Failed to register user',
          details: error.message,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }
  }
};

/**
 * Login user
 * POST /api/v1/auth/login
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);

    // Login user
    const result = await authService.loginUser(validatedData);

    // Success response format per Section 6.2
    res.status(200).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Error response format per Section 6.2
    if (error instanceof Error) {
      const statusCode =
        error.message === 'INVALID_CREDENTIALS' || error.message === 'ACCOUNT_INACTIVE' ? 401 : 500;

      res.status(statusCode).json({
        success: false,
        error: {
          code: error.message === 'INVALID_CREDENTIALS' ? 'INVALID_CREDENTIALS' : 'LOGIN_FAILED',
          message:
            error.message === 'INVALID_CREDENTIALS'
              ? 'Invalid email or password'
              : error.message === 'ACCOUNT_INACTIVE'
              ? 'Account is inactive'
              : 'Failed to login',
          details: error.message,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }
  }
};

/**
 * Logout user
 * POST /api/v1/auth/logout
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      await authService.logoutUser(token);
    }

    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGOUT_FAILED',
        message: 'Failed to logout',
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  }
};

/**
 * Get current user
 * GET /api/v1/users/me
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'User not authenticated',
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    const user = await authService.getUserById(req.user.userId);

    res.status(200).json({
      success: true,
      data: user,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_USER_FAILED',
        message: 'Failed to fetch user',
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  }
};
