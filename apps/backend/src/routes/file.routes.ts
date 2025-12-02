// Implementation of Priority 8: Assignment Submission - File Routes
// Reference: PROJECT_MASTER_PLAN_PART2.md, Section 11, Week 3, Day 5-7, Line 370

import { Router } from 'express';
import { uploadFile, handleFileUpload } from '../controllers/file.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// File upload endpoint
// POST /api/v1/files/upload
router.post('/upload', authenticateJWT, uploadFile, handleFileUpload);

export default router;
