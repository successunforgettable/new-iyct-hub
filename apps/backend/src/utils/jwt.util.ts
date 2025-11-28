// JWT Utilities
// Reference: PROJECT_MASTER_PLAN.md Section 9.1 - "JWT Implementation"

import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

// JWT payload interface matching Section 6.3 specification
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT token
 * Reference: PROJECT_MASTER_PLAN.md Section 9.1
 * Spec: 24h expiration, includes userId, email, role
 */
export const generateToken = (payload: {
  userId: string;
  email: string;
  role: UserRole;
}): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    },
    secret,
    {
      expiresIn: '24h', // Per spec: 24h expiration
      issuer: 'iyct-api',
      audience: 'iyct-app',
    }
  );
};

/**
 * Verify JWT token
 * Reference: PROJECT_MASTER_PLAN.md Section 9.1
 */
export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'iyct-api',
      audience: 'iyct-app',
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Generate refresh token
 * Reference: PROJECT_MASTER_PLAN.md Section 9.1
 */
export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { userId },
    secret,
    {
      expiresIn: '7d', // 7 days for refresh token
      issuer: 'iyct-api',
    }
  );
};

/**
 * Verify refresh token
 * Reference: PROJECT_MASTER_PLAN.md Section 9.1
 */
export const verifyRefreshToken = (token: string): { userId: string } => {
  const secret = process.env.JWT_REFRESH_SECRET;
  
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'iyct-api',
    }) as { userId: string };

    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
