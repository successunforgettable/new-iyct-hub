// Authentication Service
// Reference: PROJECT_MASTER_PLAN.md Section 6.1 - "/auth endpoints"
// Reference: PROJECT_MASTER_PLAN_PART2.md Section 11, Phase 1

import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/password.util';
import { generateToken, generateRefreshToken } from '../utils/jwt.util';

const prisma = new PrismaClient();

export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
  userRole: UserRole;
  phone?: string;
  city?: string;
  country?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    userRole: UserRole;
  };
  token: string;
  refreshToken: string;
}

/**
 * Register new user
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1 - "POST /auth/register"
 */
export const registerUser = async (data: RegisterDTO): Promise<AuthResponse> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('EMAIL_EXISTS');
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user
  // Reference: PROJECT_MASTER_PLAN.md Section 5.2 - User model
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      userRole: data.userRole,
      phone: data.phone,
      city: data.city,
      country: data.country,
      status: UserStatus.ACTIVE,
      emailVerified: false, // Will be verified later
      consentGiven: true, // Assumed consent during registration
      consentTimestamp: new Date(),
    },
  });

  // Generate tokens
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.userRole,
  });

  const refreshToken = generateRefreshToken(user.id);

  // Create session
  // Reference: PROJECT_MASTER_PLAN.md Section 5.2 - UserSession model
  await prisma.userSession.create({
    data: {
      userId: user.id,
      jwtToken: token,
      refreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      userRole: user.userRole,
    },
    token,
    refreshToken,
  };
};

/**
 * Login user
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1 - "POST /auth/login"
 */
export const loginUser = async (data: LoginDTO): Promise<AuthResponse> => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.passwordHash) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // Check if user is active
  if (user.status !== UserStatus.ACTIVE) {
    throw new Error('ACCOUNT_INACTIVE');
  }

  // Verify password
  const isValidPassword = await verifyPassword(data.password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // Generate tokens
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.userRole,
  });

  const refreshToken = generateRefreshToken(user.id);

  // Create session
  await prisma.userSession.create({
    data: {
      userId: user.id,
      jwtToken: token,
      refreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      userRole: user.userRole,
    },
    token,
    refreshToken,
  };
};

/**
 * Logout user
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1 - "POST /auth/logout"
 */
export const logoutUser = async (token: string): Promise<void> => {
  // Delete session
  await prisma.userSession.deleteMany({
    where: { jwtToken: token },
  });

  // TODO: Add token to Redis blacklist
  // Reference: PROJECT_MASTER_PLAN.md Section 9.1
  // await redis.set(`blacklist:${token}`, '1', 'EX', 86400);
};

/**
 * Get user by ID
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1 - "GET /users/me"
 */
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      userRole: true,
      phone: true,
      city: true,
      country: true,
      timezone: true,
      language: true,
      currency: true,
      emailVerified: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  return user;
};
