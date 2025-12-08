import { Request, Response } from 'express';
import { adminService } from '../services/admin/admin.service';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, search, role } = req.query;
    
    const result = await adminService.getUsers({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
      search: search as string,
      role: role as string,
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const data = req.body;
    
    const user = await adminService.updateUser(userId, data);
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    await adminService.deleteUser(userId);
    
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
    });
  }
};

export const getPrograms = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await adminService.getPrograms();
    
    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch programs',
    });
  }
};

export const getAnalytics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await adminService.getAnalytics();
    
    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
};

export const updateProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const { programId } = req.params;
    const { isPublished } = req.body;
    
    const program = await adminService.updateProgram(programId, { isPublished });
    
    res.json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error('Update program error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update program',
    });
  }
};
