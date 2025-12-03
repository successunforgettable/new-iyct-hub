import { Request, Response } from 'express';
import { coachService } from '../services/coach/coach.service';

export const coachController = {
  async getDashboard(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const userId = user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
        });
        return;
      }

      // Check role - handle both 'role' and 'userRole' properties, case-insensitive
      const role = (user.role || user.userRole || '').toUpperCase();
      const allowedRoles = ['COACH', 'ADMIN', 'SUPERADMIN'];
      
      if (!allowedRoles.includes(role)) {
        // Log for debugging
        console.log('User role check failed:', { userId, role: user.role, userRole: user.userRole });
        res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: `Access denied. Coach role required. Your role: ${role || 'none'}` },
        });
        return;
      }

      const dashboardData = await coachService.getCoachDashboard(userId);

      res.json({
        success: true,
        data: dashboardData,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (error) {
      console.error('Coach dashboard error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch coach dashboard' },
      });
    }
  },

  async getClientDetails(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const userId = user?.userId;
      const { clientId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
        });
        return;
      }

      const role = (user.role || user.userRole || '').toUpperCase();
      const allowedRoles = ['COACH', 'ADMIN', 'SUPERADMIN'];
      
      if (!allowedRoles.includes(role)) {
        res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Access denied. Coach role required.' },
        });
        return;
      }

      const clientDetails = await coachService.getClientDetails(userId, clientId);

      res.json({
        success: true,
        data: clientDetails,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (error) {
      console.error('Client details error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch client details' },
      });
    }
  },
};
