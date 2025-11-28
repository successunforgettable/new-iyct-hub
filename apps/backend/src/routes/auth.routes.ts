// Authentication Routes
// Reference: PROJECT_MASTER_PLAN.md Section 6.1 - "/auth endpoints"

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Register new user
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1
 */
router.post('/register', authController.register);

/**
 * POST /api/v1/auth/login
 * Login user (email/password)
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1
 */
router.post('/login', authController.login);

/**
 * POST /api/v1/auth/logout
 * Logout user
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1
 * Requires authentication
 */
router.post('/logout', authenticateJWT, authController.logout);

/**
 * GET /api/v1/users/me
 * Get current authenticated user
 * Reference: PROJECT_MASTER_PLAN.md Section 6.1
 * Requires authentication
 */
router.get('/users/me', authenticateJWT, authController.getCurrentUser);

export default router;
