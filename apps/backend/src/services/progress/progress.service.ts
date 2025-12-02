// Implementation of Priority 7 + Priority 8: Progress Tracking Service
// Reference: PROJECT_MASTER_PLAN_PART2.md, Section 11, Week 3, Day 5-7
// Priority 7: Complete progress tracking
// Priority 8: Assignment submission (NEW)

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProgressService {
  // Priority 7: Start a step
  async startStep(data: { userId: string; stepId: string; enrollmentId: string }) {
    console.log('🚀 Starting step:', data);

    // Verify enrollment exists
    const enrollment = await prisma.userProgramEnrollment.findFirst({
      where: { id: data.enrollmentId, userId: data.userId },
    });

    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    // Create or update step progress
    const progress = await prisma.userStepProgress.upsert({
      where: {
        userId_stepId: {
          userId: data.userId,
          stepId: data.stepId,
        },
      },
      update: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId: data.userId,
        stepId: data.stepId,
        enrollmentId: data.enrollmentId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    console.log('✅ Step started successfully');
    return progress;
  }

  // Priority 7: Complete a step
  async completeStep(data: { userId: string; stepId: string; enrollmentId: string }) {
    console.log('✅ Completing step:', data);

    // Verify enrollment
    const enrollment = await prisma.userProgramEnrollment.findFirst({
      where: { id: data.enrollmentId, userId: data.userId },
      include: {
        program: {
          include: {
            weeks: {
              include: {
                steps: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    // Mark step as complete
    const progress = await prisma.userStepProgress.upsert({
      where: {
        userId_stepId: {
          userId: data.userId,
          stepId: data.stepId,
        },
      },
      update: {
        status: 'COMPLETED',
        completedAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId: data.userId,
        stepId: data.stepId,
        enrollmentId: data.enrollmentId,
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Calculate overall program progress
    const totalSteps = enrollment.program.weeks.reduce(
      (sum, week) => sum + week.steps.length,
      0
    );
    const completedSteps = await prisma.userStepProgress.count({
      where: {
        enrollmentId: data.enrollmentId,
        status: 'COMPLETED',
      },
    });

    const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

    // Update enrollment with new progress
    await prisma.userProgramEnrollment.update({
      where: { id: data.enrollmentId },
      data: {
        completionPercentage,
      },
    });

    console.log(`✅ Step completed. Progress: ${completionPercentage}% (${completedSteps}/${totalSteps})`);
    
    return { progress, completionPercentage, completedSteps, totalSteps };
  }

  // Priority 8: Submit assignment (NEW)
  async submitAssignment(data: {
    userId: string;
    stepId: string;
    enrollmentId: string;
    submissionText?: string;
    submissionFileUrl?: string;
  }) {
    console.log('📝 Submitting assignment:', {
      userId: data.userId,
      stepId: data.stepId,
      hasText: !!data.submissionText,
      hasFile: !!data.submissionFileUrl
    });

    // Verify enrollment
    const enrollment = await prisma.userProgramEnrollment.findFirst({
      where: { id: data.enrollmentId, userId: data.userId },
    });

    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    // Update or create step progress with submission
    const progress = await prisma.userStepProgress.upsert({
      where: {
        userId_stepId: {
          userId: data.userId,
          stepId: data.stepId,
        },
      },
      update: {
        submissionText: data.submissionText,
        submissionFileUrl: data.submissionFileUrl,
        status: 'SUBMITTED', // Different from COMPLETED
        updatedAt: new Date(),
      },
      create: {
        userId: data.userId,
        stepId: data.stepId,
        enrollmentId: data.enrollmentId,
        submissionText: data.submissionText,
        submissionFileUrl: data.submissionFileUrl,
        status: 'SUBMITTED',
      },
    });

    console.log('✅ Assignment submitted successfully');
    return progress;
  }

  // Priority 7: Get enrollment progress
  async getEnrollmentProgress(enrollmentId: string) {
    console.log('📊 Fetching enrollment progress:', enrollmentId);

    const enrollment = await prisma.userProgramEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        program: {
          include: {
            weeks: {
              include: {
                steps: true,
              },
            },
          },
        },
        stepProgress: {
          include: {
            step: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    console.log('✅ Progress fetched:', {
      completionPercentage: enrollment.completionPercentage,
      completedSteps: enrollment.stepProgress.filter(p => p.status === 'COMPLETED').length,
    });

    return enrollment;
  }

  // Priority 7: Update time spent on step
  async updateStepTime(data: { userId: string; stepId: string; timeSpentSeconds: number }) {
    console.log('⏱️ Updating time spent:', data);

    const progress = await prisma.userStepProgress.updateMany({
      where: {
        userId: data.userId,
        stepId: data.stepId,
      },
      data: {
        timeSpentSeconds: {
          increment: data.timeSpentSeconds,
        },
        updatedAt: new Date(),
      },
    });

    console.log('✅ Time updated');
    return progress;
  }

  // Alias for backward compatibility
  async updateTimeSpent(data: { userId: string; stepId: string; timeSpentSeconds: number }) {
    return this.updateStepTime(data);
  }

  // Priority 7: Get step progress
  async getStepProgress(userId: string, stepId: string) {
    console.log('🔍 Fetching step progress:', { userId, stepId });

    const progress = await prisma.userStepProgress.findUnique({
      where: {
        userId_stepId: {
          userId,
          stepId,
        },
      },
      include: {
        step: true,
      },
    });

    console.log('✅ Step progress fetched:', progress?.status);
    return progress;
  }

  // Priority 7: Reset enrollment progress (admin)
  async resetEnrollmentProgress(enrollmentId: string) {
    console.log('🔄 Resetting enrollment progress:', enrollmentId);

    await prisma.userStepProgress.deleteMany({
      where: { enrollmentId },
    });

    await prisma.userProgramEnrollment.update({
      where: { id: enrollmentId },
      data: {
        completionPercentage: 0,
      },
    });

    console.log('✅ Progress reset');
    return { success: true };
  }
}

// Export instance for use in controllers
export const progressService = new ProgressService();
