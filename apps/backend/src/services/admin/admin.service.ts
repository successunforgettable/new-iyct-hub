import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const adminService = {
  async getUsers(options: { page?: number; limit?: number; search?: string; role?: string }) {
    const { page = 1, limit = 10, search, role } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (role && role !== 'all') {
      where.userRole = role;
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
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    const usersWithEnrollments = await Promise.all(
      users.map(async (user) => {
        const enrollmentCount = await prisma.userProgramEnrollment.count({
          where: { userId: user.id },
        });
        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          userRole: user.userRole,
          status: user.status || 'active',
          createdAt: user.createdAt,
          lastLogin: user.updatedAt,
          enrollmentCount,
        };
      })
    );

    return {
      data: usersWithEnrollments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async updateUser(userId: string, data: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        userRole: data.userRole,
      },
    });
    return user;
  },

  async deleteUser(userId: string) {
    await prisma.user.delete({
      where: { id: userId },
    });
    return { success: true };
  },

  async getPrograms() {
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const programsWithCounts = await Promise.all(
      programs.map(async (program) => {
        const [enrollmentCount, weekCount] = await Promise.all([
          prisma.userProgramEnrollment.count({
            where: { programId: program.id },
          }),
          prisma.programWeek.count({
            where: { programId: program.id },
          }),
        ]);

        const price = program.basePriceUsd ? Number(program.basePriceUsd) : 0;

        return {
          id: program.id,
          programId: program.slug,
          title: program.name,
          description: program.description,
          price: price,
          currency: 'USD',
          status: 'published',
          enrollmentCount,
          totalWeeks: weekCount,
          completionRate: 0,
          revenue: price * enrollmentCount,
          createdAt: program.createdAt,
        };
      })
    );

    return { data: programsWithCounts };
  },

  async getAnalytics() {
    const [totalUsers, totalEnrollments, programs] = await Promise.all([
      prisma.user.count(),
      prisma.userProgramEnrollment.count(),
      prisma.program.findMany(),
    ]);

    const programsWithEnrollments = await Promise.all(
      programs.map(async (p) => {
        const count = await prisma.userProgramEnrollment.count({
          where: { programId: p.id },
        });
        const price = p.basePriceUsd ? Number(p.basePriceUsd) : 0;
        return { price, count };
      })
    );

    const totalRevenue = programsWithEnrollments.reduce((sum, p) => {
      return sum + (p.price * p.count);
    }, 0);

    return {
      data: {
        totalUsers,
        totalEnrollments,
        totalRevenue,
        totalPrograms: programs.length,
        activeToday: Math.floor(totalUsers * 0.15),
        enrollmentTrends: [
          { month: 'Jan', enrollments: Math.floor(totalEnrollments * 0.1) },
          { month: 'Feb', enrollments: Math.floor(totalEnrollments * 0.12) },
          { month: 'Mar', enrollments: Math.floor(totalEnrollments * 0.15) },
          { month: 'Apr', enrollments: Math.floor(totalEnrollments * 0.18) },
          { month: 'May', enrollments: Math.floor(totalEnrollments * 0.22) },
          { month: 'Jun', enrollments: Math.floor(totalEnrollments * 0.23) },
        ],
      },
    };
  },
};
