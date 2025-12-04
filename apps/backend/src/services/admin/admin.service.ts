// apps/backend/src/services/admin/admin.service.ts
// Master Plan: Week 4 Day 6-7 - Admin Panel Basic

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalCoaches: number;
  totalClients: number;
  totalPrograms: number;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  recentSignups: number;
}

export interface UserGrowthData {
  month: string;
  users: number;
}

export interface EnrollmentsByProgram {
  programName: string;
  enrollments: number;
}

class AdminService {
  // Get users with pagination
  async getUsers(params: PaginationParams): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10, search, role, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role && role !== 'all') {
      where.userRole = role.toUpperCase();
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          userRole: true,
          status: true,
          phone: true,
          city: true,
          country: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map((u: any) => ({
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        role: u.userRole,
        status: u.status,
        phone: u.phone,
        location: [u.city, u.country].filter(Boolean).join(', ') || null,
        createdAt: u.createdAt?.toISOString(),
        updatedAt: u.updatedAt?.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Get all programs
  async getPrograms(): Promise<any[]> {
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { enrollments: true, weeks: true },
        },
      },
    });

    return programs.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      programType: p.programType,
      language: p.language,
      isActive: p.isActive,
      enrollmentCount: p._count.enrollments,
      weekCount: p._count.weeks,
      createdAt: p.createdAt?.toISOString(),
    }));
  }

  // Get admin analytics
  async getAnalytics(): Promise<{
    stats: AdminStats;
    userGrowth: UserGrowthData[];
    enrollmentsByProgram: EnrollmentsByProgram[];
    recentActivity: any[];
  }> {
    // Get counts
    const [
      totalUsers,
      totalCoaches,
      totalClients,
      totalPrograms,
      totalEnrollments,
      completedEnrollments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { userRole: 'COACH' } }),
      prisma.user.count({ where: { userRole: 'CLIENT' } }),
      prisma.program.count(),
      prisma.userProgramEnrollment.count(),
      prisma.userProgramEnrollment.count({ where: { completionPercentage: { gte: 100 } } }),
    ]);

    // Recent signups (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentSignups = await prisma.user.count({
      where: { createdAt: { gte: weekAgo } },
    });

    const stats: AdminStats = {
      totalUsers,
      totalCoaches,
      totalClients,
      totalPrograms,
      totalEnrollments,
      activeEnrollments: totalEnrollments - completedEnrollments,
      completedEnrollments,
      recentSignups,
    };

    // User growth (last 6 months)
    const userGrowth = await this.getUserGrowth();

    // Enrollments by program
    const enrollmentsByProgram = await this.getEnrollmentsByProgram();

    // Recent activity
    const recentActivity = await this.getRecentActivity();

    return {
      stats,
      userGrowth,
      enrollmentsByProgram,
      recentActivity,
    };
  }

  private async getUserGrowth(): Promise<UserGrowthData[]> {
    const months: UserGrowthData[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      months.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        users: count,
      });
    }

    return months;
  }

  private async getEnrollmentsByProgram(): Promise<EnrollmentsByProgram[]> {
    const programs = await prisma.program.findMany({
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: {
        enrollments: { _count: 'desc' },
      },
      take: 5,
    });

    return programs.map((p: any) => ({
      programName: p.name.length > 25 ? p.name.substring(0, 25) + '...' : p.name,
      enrollments: p._count.enrollments,
    }));
  }

  private async getRecentActivity(): Promise<any[]> {
    const [recentUsers, recentEnrollments] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { fullName: true, email: true, userRole: true, createdAt: true },
      }),
      prisma.userProgramEnrollment.findMany({
        orderBy: { enrolledAt: 'desc' },
        take: 5,
        include: {
          user: { select: { fullName: true } },
          program: { select: { name: true } },
        },
      }),
    ]);

    const activities: any[] = [];

    recentUsers.forEach((u: any) => {
      activities.push({
        type: 'user_signup',
        description: `${u.fullName} signed up as ${u.userRole}`,
        timestamp: u.createdAt?.toISOString(),
      });
    });

    recentEnrollments.forEach((e: any) => {
      activities.push({
        type: 'enrollment',
        description: `${e.user?.fullName} enrolled in ${e.program?.name}`,
        timestamp: e.enrolledAt?.toISOString(),
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }

  // Update user
  async updateUser(userId: string, data: { fullName?: string; userRole?: string; status?: string }) {
    const updateData: any = {};
    if (data.fullName) updateData.fullName = data.fullName;
    if (data.userRole) updateData.userRole = data.userRole.toUpperCase();
    if (data.status) updateData.status = data.status.toUpperCase();

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  // Delete user
  async deleteUser(userId: string) {
    return prisma.user.delete({
      where: { id: userId },
    });
  }
}

export const adminService = new AdminService();
