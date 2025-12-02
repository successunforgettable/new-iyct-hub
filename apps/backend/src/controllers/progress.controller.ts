// Implementation of Priority 7 + Priority 8: Progress Controller
// Reference: PROJECT_MASTER_PLAN_PART2.md, Section 11, Week 3, Day 5-7
// Priority 7: Complete progress tracking endpoints
// Priority 8: Assignment submission endpoint (NEW)

import { Request, Response } from 'express';
import { progressService } from '../services/progress/progress.service';

// Priority 7: Start a step
export const startStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stepId } = req.params;
    const { enrollmentId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
      return;
    }

    const progress = await progressService.startStep({
      userId,
      stepId,
      enrollmentId,
    });

    res.json({ success: true, data: progress });
  } catch (error: any) {
    console.error('❌ Error starting step:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Priority 7: Complete a step
export const completeStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stepId } = req.params;
    const { enrollmentId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
      return;
    }

    // Extract enrollmentId from object if needed (defensive programming)
    const actualEnrollmentId = typeof enrollmentId === 'object' 
      ? enrollmentId.enrollmentId || enrollmentId.id
      : enrollmentId;

    console.log('📝 Complete step request:', {
      stepId,
      userId,
      enrollmentId: actualEnrollmentId,
    });

    const result = await progressService.completeStep({
      userId,
      stepId,
      enrollmentId: actualEnrollmentId,
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('❌ Error completing step:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Priority 8: Submit assignment (NEW)
export const submitAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stepId } = req.params;
    const { enrollmentId, submissionText, submissionFileUrl } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
      return;
    }

    console.log('📝 Assignment submission request:', {
      stepId,
      userId,
      enrollmentId,
      hasText: !!submissionText,
      hasFile: !!submissionFileUrl,
    });

    const progress = await progressService.submitAssignment({
      userId,
      stepId,
      enrollmentId,
      submissionText,
      submissionFileUrl,
    });

    res.json({ success: true, data: progress });
  } catch (error: any) {
    console.error('❌ Error submitting assignment:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Priority 7: Get enrollment progress
export const getEnrollmentProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentId } = req.params;

    const progress = await progressService.getEnrollmentProgress(enrollmentId);

    res.json({ success: true, data: progress });
  } catch (error: any) {
    console.error('❌ Error fetching progress:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Priority 7: Update time spent on step
export const updateStepTime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stepId } = req.params;
    const { timeSpentSeconds } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
      return;
    }

    const progress = await progressService.updateStepTime({
      userId,
      stepId,
      timeSpentSeconds,
    });

    res.json({ success: true, data: progress });
  } catch (error: any) {
    console.error('❌ Error updating time:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Alias for backward compatibility
export const updateTimeSpent = updateStepTime;

// Priority 7: Get step progress
export const getStepProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stepId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
      return;
    }

    const progress = await progressService.getStepProgress(userId, stepId);

    res.json({ success: true, data: progress });
  } catch (error: any) {
    console.error('❌ Error fetching step progress:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Priority 7: Reset enrollment progress (admin)
export const resetEnrollmentProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentId } = req.params;

    const result = await progressService.resetEnrollmentProgress(enrollmentId);

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('❌ Error resetting progress:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Export controller class for compatibility
export class ProgressController {
  startStep = startStep;
  completeStep = completeStep;
  submitAssignment = submitAssignment;
  getEnrollmentProgress = getEnrollmentProgress;
  updateStepTime = updateStepTime;
  updateTimeSpent = updateTimeSpent;
  getStepProgress = getStepProgress;
  resetEnrollmentProgress = resetEnrollmentProgress;
}

export const progressController = new ProgressController();
