// Authentication Middleware
// Reference: PROJECT_MASTER_PLAN.md Section 9.1 - "Verify JWT middleware"

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { verifyToken, JWTPayload } from '../utils/jwt.util';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Authenticate JWT Middleware
 * Reference: PROJECT_MASTER_PLAN.md Section 9.1
 * 
 * Verifies JWT token from Authorization header
 * Attaches user payload to request
 */
export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'No authentication token provided',
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_AUTH_HEADER',
          message: 'Invalid authorization header format',
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    // TODO: Check if token is blacklisted (from Redis)
    // Per PROJECT_MASTER_PLAN.md Section 9.1:
    // const isBlacklisted = await redis.get(`blacklist:${token}`);
    // if (isBlacklisted) { return 401; }

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';

    res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_FAILED',
        message: errorMessage,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  }
};

/**
 * Require Role Middleware
 * Reference: PROJECT_MASTER_PLAN.md Section 9.1 - "Role-Based Access Control"
 * 
 * Checks if user has required role(s)
 * Usage: requireRole('ADMIN', 'SUPERADMIN')
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'You do not have permission to access this resource',
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    next();
  };
};
