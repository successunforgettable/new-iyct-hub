// Implementation of Priority 7 + Priority 8: Progress Routes
// Reference: PROJECT_MASTER_PLAN_PART2.md, Section 11, Week 3, Day 5-7
// Priority 7: Complete progress tracking routes
// Priority 8: Assignment submission route (NEW)

import { Router } from 'express';
import {
  startStep,
  completeStep,
  submitAssignment,
  getEnrollmentProgress,
  updateStepTime,
  getStepProgress,
  resetEnrollmentProgress,
} from '../controllers/progress.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Priority 7: Progress tracking routes
router.post('/step/:stepId/start', authenticateJWT, startStep);
router.post('/step/:stepId/complete', authenticateJWT, completeStep);
router.get('/enrollment/:enrollmentId', authenticateJWT, getEnrollmentProgress);
router.patch('/step/:stepId/time', authenticateJWT, updateStepTime);
router.get('/step/:stepId', authenticateJWT, getStepProgress);
router.delete('/enrollment/:enrollmentId/reset', authenticateJWT, resetEnrollmentProgress);

// Priority 8: Assignment submission route (NEW)
router.post('/step/:stepId/submit', authenticateJWT, submitAssignment);

export default router;
