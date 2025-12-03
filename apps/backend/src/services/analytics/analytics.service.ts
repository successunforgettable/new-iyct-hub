import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DashboardStats {
  enrolledPrograms: number;
  completedPrograms: number;
  totalStepsCompleted: number;
  overallProgress: number;
  currentStreak: number;
  lastActivity: string | null;
}

export interface ProgramProgress {
  programId: string;
  programName: string;
  completionPercentage: number;
  currentWeek: number;
  totalWeeks: number;
  stepsCompleted: number;
  totalSteps: number;
  lastUpdated: string;
}

export interface WeeklyProgress {
  week: string;
  stepsCompleted: number;
}

export interface RecentActivity {
  id: string;
  type: 'step_completed' | 'assignment_submitted' | 'week_completed' | 'program_started' | 'achievement_unlocked';
  title: string;
  description: string;
  programName?: string;
  timestamp: string;
  icon: string;
}

export interface QuickAction {
  id: string;
  type: 'continue_program' | 'submit_assignment' | 'start_new' | 'view_certificate';
  title: string;
  subtitle: string;
  link: string;
  priority: number;
  programId?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  programProgress: ProgramProgress[];
  weeklyProgress: WeeklyProgress[];
  recentActivity: RecentActivity[];
  quickActions: QuickAction[];
}

class AnalyticsService {
  async getDashboardData(userId: string): Promise<DashboardData> {
    const enrollments = await prisma.userProgramEnrollment.findMany({
      where: { userId },
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

    const stepProgress = await prisma.userStepProgress.findMany({
      where: {
        enrollment: { userId },
      },
      include: {
        step: true,
        enrollment: {
          include: { program: true },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    const stats = this.calculateStats(enrollments, stepProgress);
    const programProgress = this.buildProgramProgress(enrollments, stepProgress);
    const weeklyProgress = this.buildWeeklyProgress(stepProgress);
    const recentActivity = this.buildRecentActivity(stepProgress, enrollments);
    const quickActions = this.buildQuickActions(enrollments);

    return { stats, programProgress, weeklyProgress, recentActivity, quickActions };
  }

  private calculateStats(enrollments: any[], stepProgress: any[]): DashboardStats {
    const completedSteps = stepProgress.filter(
      (sp: any) => sp.status === 'COMPLETED' || sp.status === 'completed'
    );

    const currentStreak = this.calculateStreak(completedSteps);

    return {
      enrolledPrograms: enrollments.length,
      completedPrograms: enrollments.filter((e: any) => e.completionPercentage >= 100).length,
      totalStepsCompleted: completedSteps.length,
      overallProgress: enrollments.length > 0
        ? Math.round(enrollments.reduce((sum: number, e: any) => sum + (e.completionPercentage || 0), 0) / enrollments.length)
        : 0,
      currentStreak,
      lastActivity: completedSteps.length > 0 && completedSteps[0].completedAt
        ? completedSteps[0].completedAt.toISOString()
        : null,
    };
  }

  private calculateStreak(completedSteps: any[]): number {
    if (completedSteps.length === 0) return 0;

    const activityDates = new Set<string>();
    completedSteps.forEach((step: any) => {
      if (step.completedAt) {
        const date = new Date(step.completedAt);
        activityDates.add(date.toISOString().split('T')[0]);
      }
    });

    const sortedDates = Array.from(activityDates).sort().reverse();
    let streak = 0;
    const checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  private buildProgramProgress(enrollments: any[], stepProgress: any[]): ProgramProgress[] {
    return enrollments.map((enrollment: any) => {
      const program = enrollment.program;
      const totalSteps = program.weeks.reduce((sum: number, week: any) => sum + week.steps.length, 0);
      const completedStepsForProgram = stepProgress.filter(
        (sp: any) => sp.enrollmentId === enrollment.enrollmentId &&
          (sp.status === 'COMPLETED' || sp.status === 'completed')
      ).length;

      return {
        programId: program.programId,
        programName: program.name,
        completionPercentage: enrollment.completionPercentage || 0,
        currentWeek: enrollment.currentWeek || 1,
        totalWeeks: program.weeks.length,
        stepsCompleted: completedStepsForProgram,
        totalSteps,
        lastUpdated: enrollment.updatedAt?.toISOString() || new Date().toISOString(),
      };
    });
  }

  private buildWeeklyProgress(stepProgress: any[]): WeeklyProgress[] {
    const weeks: WeeklyProgress[] = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const stepsInWeek = stepProgress.filter((sp: any) => {
        if (!sp.completedAt) return false;
        const completedDate = new Date(sp.completedAt);
        return completedDate >= weekStart && completedDate < weekEnd &&
          (sp.status === 'COMPLETED' || sp.status === 'completed');
      }).length;

      weeks.push({
        week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        stepsCompleted: stepsInWeek,
      });
    }
    return weeks;
  }

  private buildRecentActivity(stepProgress: any[], enrollments: any[]): RecentActivity[] {
    const activities: RecentActivity[] = [];

    stepProgress
      .filter((sp: any) => sp.status === 'COMPLETED' || sp.status === 'completed')
      .slice(0, 10)
      .forEach((sp: any) => {
        activities.push({
          id: sp.id,
          type: 'step_completed',
          title: `Completed: ${sp.step?.title || 'Step'}`,
          description: sp.enrollment?.program?.name || 'Program',
          programName: sp.enrollment?.program?.name,
          timestamp: sp.completedAt?.toISOString() || new Date().toISOString(),
          icon: 'check-circle',
        });
      });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    enrollments
      .filter((e: any) => new Date(e.createdAt || e.enrolledAt) > weekAgo)
      .forEach((e: any) => {
        activities.push({
          id: `enroll-${e.enrollmentId}`,
          type: 'program_started',
          title: `Started: ${e.program.name}`,
          description: 'New program enrollment',
          programName: e.program.name,
          timestamp: e.createdAt?.toISOString() || new Date().toISOString(),
          icon: 'play-circle',
        });
      });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }

  private buildQuickActions(enrollments: any[]): QuickAction[] {
    const actions: QuickAction[] = [];

    const inProgress = enrollments.filter((e: any) => e.completionPercentage > 0 && e.completionPercentage < 100);
    inProgress.slice(0, 2).forEach((e: any, index: number) => {
      actions.push({
        id: `continue-${e.enrollmentId}`,
        type: 'continue_program',
        title: 'Continue Learning',
        subtitle: e.program.name,
        link: `/programs/${e.programId}`,
        priority: 1 + index,
        programId: e.programId,
      });
    });

    if (inProgress.length === 0) {
      const notStarted = enrollments.find((e: any) => e.completionPercentage === 0);
      if (notStarted) {
        actions.push({
          id: `start-${notStarted.enrollmentId}`,
          type: 'start_new',
          title: 'Start Your Journey',
          subtitle: notStarted.program.name,
          link: `/programs/${notStarted.programId}`,
          priority: 1,
          programId: notStarted.programId,
        });
      }
    }

    enrollments
      .filter((e: any) => e.completionPercentage >= 100)
      .slice(0, 1)
      .forEach((e: any) => {
        actions.push({
          id: `cert-${e.enrollmentId}`,
          type: 'view_certificate',
          title: 'View Certificate',
          subtitle: e.program.name,
          link: `/certificates/${e.enrollmentId}`,
          priority: 3,
          programId: e.programId,
        });
      });

    return actions.sort((a, b) => a.priority - b.priority).slice(0, 4);
  }
}

export const analyticsService = new AnalyticsService();
