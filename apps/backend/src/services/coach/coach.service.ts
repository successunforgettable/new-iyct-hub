import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CoachDashboardData {
  stats: {
    totalClients: number;
    activeClients: number;
    averageClientProgress: number;
    certificationsEarned: number;
    pendingCertifications: number;
  };
  clients: any[];
  clientProgress: any[];
  certifications: any[];
  recentClientActivity: any[];
}

class CoachService {
  async getCoachDashboard(_coachId: string): Promise<CoachDashboardData> {
    // Get all client users
    const clients = await prisma.user.findMany({
      where: { userRole: 'CLIENT' },
      take: 50,
    });

    // Get enrollments for these clients
    const clientIds = clients.map((c: any) => c.id);
    
    const enrollments = await prisma.userProgramEnrollment.findMany({
      where: { userId: { in: clientIds } },
      include: { program: true },
    });

    // Get recent step progress
    const recentProgress = await prisma.userStepProgress.findMany({
      where: { 
        status: { in: ['COMPLETED', 'completed'] },
      },
      include: {
        step: true,
        enrollment: {
          include: {
            user: true,
            program: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    // Build client list
    const clientList = clients.map((client: any) => {
      const clientEnrollments = enrollments.filter((e: any) => e.userId === client.id);
      const avgProgress = clientEnrollments.length > 0
        ? Math.round(clientEnrollments.reduce((sum: number, e: any) => sum + (e.completionPercentage || 0), 0) / clientEnrollments.length)
        : 0;

      return {
        id: client.id,
        fullName: client.fullName,
        email: client.email,
        enrolledPrograms: clientEnrollments.length,
        overallProgress: avgProgress,
        lastActive: client.updatedAt?.toISOString() || null,
        status: avgProgress >= 100 ? 'completed' : avgProgress > 0 ? 'active' : 'inactive',
      };
    });

    // Build client progress
    const clientProgress = enrollments.slice(0, 15).map((e: any) => ({
      clientId: e.userId,
      clientName: clients.find((c: any) => c.id === e.userId)?.fullName || 'Unknown',
      programName: e.program?.name || 'Unknown',
      progress: e.completionPercentage || 0,
      currentWeek: e.currentWeek || 1,
      totalWeeks: 12,
      lastActivity: e.updatedAt?.toISOString() || null,
    }));

    // Build recent activity
    const recentClientActivity = recentProgress.map((sp: any) => ({
      clientName: sp.enrollment?.user?.fullName || 'Unknown',
      action: `Completed: ${sp.step?.title || 'Step'}`,
      programName: sp.enrollment?.program?.name || 'Program',
      timestamp: sp.completedAt?.toISOString() || new Date().toISOString(),
    }));

    const activeClients = clientList.filter((c: any) => c.status === 'active').length;

    return {
      stats: {
        totalClients: clients.length,
        activeClients,
        averageClientProgress: clientList.length > 0
          ? Math.round(clientList.reduce((sum: number, c: any) => sum + c.overallProgress, 0) / clientList.length)
          : 0,
        certificationsEarned: 0,
        pendingCertifications: 0,
      },
      clients: clientList.slice(0, 20),
      clientProgress,
      certifications: [],
      recentClientActivity,
    };
  }

  async getClientDetails(_coachId: string, clientId: string) {
    const client = await prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!client) throw new Error('Client not found');

    const enrollments = await prisma.userProgramEnrollment.findMany({
      where: { userId: clientId },
      include: { program: true },
    });

    const stepProgress = await prisma.userStepProgress.findMany({
      where: { enrollment: { userId: clientId } },
      include: { step: true },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    return {
      client: {
        id: client.id,
        fullName: client.fullName,
        email: client.email,
        joinedAt: client.createdAt?.toISOString(),
      },
      enrollments: enrollments.map((e: any) => ({
        enrollmentId: e.enrollmentId,
        programName: e.program?.name,
        progress: e.completionPercentage || 0,
        currentWeek: e.currentWeek || 1,
        enrolledAt: e.enrolledAt?.toISOString(),
      })),
      recentActivity: stepProgress.map((sp: any) => ({
        stepTitle: sp.step?.title || 'Step',
        status: sp.status,
        completedAt: sp.completedAt?.toISOString(),
      })),
    };
  }
}

export const coachService = new CoachService();
