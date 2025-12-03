// apps/backend/src/routes/coach.routes.ts
// Master Plan Reference: PROJECT_MASTER_PLAN_PART2.md Section 11 Week 4 Day 4-5

import { Router } from 'express';
import { coachController } from '../controllers/coach.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// GET /api/v1/coach/dashboard - Coach dashboard data
router.get('/dashboard', authenticateJWT, coachController.getDashboard);

// GET /api/v1/coach/clients/:clientId - Get specific client details
router.get('/clients/:clientId', authenticateJWT, coachController.getClientDetails);

export default router;
