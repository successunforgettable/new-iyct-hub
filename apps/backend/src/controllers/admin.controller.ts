// apps/backend/src/controllers/admin.controller.ts
// Master Plan: Week 4 Day 6-7 - Admin Panel Basic

import { Request, Response } from 'express';
import { adminService } from '../services/admin/admin.service';

export const adminController = {
  // GET /admin/users
  async getUsers(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const role = (user?.role || user?.userRole || '').toUpperCase();

      if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
        res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Admin access required' },
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const roleFilter = req.query.role as string;
      const status = req.query.status as string;

      const result = await adminService.getUsers({ page, limit, search, role: roleFilter, status });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (error) {
      console.error('Admin getUsers error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch users' },
      });
    }
  },

  // GET /admin/programs
  async getPrograms(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const role = (user?.role || user?.userRole || '').toUpperCase();

      if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
        res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Admin access required' },
        });
        return;
      }

      const programs = await adminService.getPrograms();

      res.json({
        success: true,
        data: programs,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (error) {
      console.error('Admin getPrograms error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch programs' },
      });
    }
  },

  // GET /admin/analytics
  async getAnalytics(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const role = (user?.role || user?.userRole || '').toUpperCase();

      if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
        res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Admin access required' },
        });
        return;
      }

      const analytics = await adminService.getAnalytics();

      res.json({
        success: true,
        data: analytics,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (error) {
      console.error('Admin getAnalytics error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch analytics' },
      });
    }
  },

  // PATCH /admin/users/:id
  async updateUser(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const role = (user?.role || user?.userRole || '').toUpperCase();

      if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
        res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Admin access required' },
        });
        return;
      }

      const { id } = req.params;
      const { fullName, userRole, status } = req.body;

      const updatedUser = await adminService.updateUser(id, { fullName, userRole, status });

      res.json({
        success: true,
        data: updatedUser,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (error) {
      console.error('Admin updateUser error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to update user' },
      });
    }
  },

  // DELETE /admin/users/:id
  async deleteUser(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const role = (user?.role || user?.userRole || '').toUpperCase();

      if (role !== 'SUPERADMIN') {
        res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Superadmin access required' },
        });
        return;
      }

      const { id } = req.params;
      await adminService.deleteUser(id);

      res.json({
        success: true,
        message: 'User deleted successfully',
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (error) {
      console.error('Admin deleteUser error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to delete user' },
      });
    }
  },
};
