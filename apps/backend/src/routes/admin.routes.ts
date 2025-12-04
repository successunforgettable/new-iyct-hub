// apps/backend/src/routes/admin.routes.ts
// Master Plan: Week 4 Day 6-7 - Admin Panel Basic

import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require authentication
router.use(authenticateJWT);

// GET /api/v1/admin/users - List users with pagination
router.get('/users', adminController.getUsers);

// PATCH /api/v1/admin/users/:id - Update user
router.patch('/users/:id', adminController.updateUser);

// DELETE /api/v1/admin/users/:id - Delete user (superadmin only)
router.delete('/users/:id', adminController.deleteUser);

// GET /api/v1/admin/programs - List all programs
router.get('/programs', adminController.getPrograms);

// GET /api/v1/admin/analytics - Dashboard analytics
router.get('/analytics', adminController.getAnalytics);

export default router;
