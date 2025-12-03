// apps/backend/src/routes/analytics.routes.ts
// Master Plan Reference: PROJECT_MASTER_PLAN_PART2.md Section 11 Week 4 Day 1-3
// GET /analytics/dashboard endpoint

import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Get user dashboard analytics data
 * @access  Private (requires authentication)
 */
router.get('/dashboard', authenticateJWT, analyticsController.getDashboard);

export default router;
