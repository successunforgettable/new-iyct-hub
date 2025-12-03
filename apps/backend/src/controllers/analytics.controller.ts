// apps/backend/src/controllers/analytics.controller.ts
import { Request, Response } from 'express';
import { analyticsService } from '../services/analytics/analytics.service';

export const analyticsController = {
  async getDashboard(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const userId = user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      const dashboardData = await analyticsService.getDashboardData(userId);

      res.json({
        success: true,
        data: dashboardData,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Analytics dashboard error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch dashboard data',
        },
      });
    }
  },
};
