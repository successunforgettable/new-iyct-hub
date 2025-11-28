// apps/backend/src/services/program.service.ts
// 📖 DOCUMENTATION REFERENCE: PROJECT_MASTER_PLAN_PART2.md, Section 11, Phase 2, Day 1-2
// 📋 SPEC: "Business logic for program operations, Enrollment validation, Access control (user can only see enrolled programs)"
// 🔧 IMPLEMENTATION: Complete program service with all CRUD operations
// ✅ VERIFICATION: Handles program listing, details, enrollment, user programs

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProgramService {
  /**
   * Get all published programs
   * 📖 REF: PROJECT_MASTER_PLAN.md, Section 6.1, GET /programs endpoint
   */
  async getAllPrograms() {
    const programs = await prisma.program.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        programType: true,
        language: true,
        durationWeeks: true,
        basePriceUsd: true,
        basePriceInr: true,
        basePriceAed: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return programs;
  }

  /**
   * Get program by ID with full details
   * 📖 REF: PROJECT_MASTER_PLAN.md, Section 6.1, GET /programs/:id endpoint
   */
  async getProgramById(programId: string) {
    const program = await prisma.program.findUnique({
      where: {
        id: programId,
      },
      include: {
        weeks: {
          orderBy: {
            weekNumber: 'asc',
          },
          include: {
            steps: {
              orderBy: {
                stepNumber: 'asc',
              },
            },
          },
        },
      },
    });

    if (!program) {
      throw new Error('Program not found');
    }

    if (!program.isPublished) {
      throw new Error('Program not available');
    }

    return program;
  }

  /**
   * Get program structure (weeks and steps)
   * 📖 REF: PROJECT_MASTER_PLAN.md, Section 6.1, GET /programs/:id/weeks endpoint
   */
  async getProgramWeeks(programId: string) {
    // First verify program exists
    const program = await prisma.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      throw new Error('Program not found');
    }

    const weeks = await prisma.programWeek.findMany({
      where: {
        programId: programId,
      },
      include: {
        steps: {
          orderBy: {
            stepNumber: 'asc',
          },
          select: {
            id: true,
            stepNumber: true,
            title: true,
            contentType: true,
            contentUrl: true,
            durationMinutes: true,
            isMandatory: true,
          },
        },
      },
      orderBy: {
        weekNumber: 'asc',
      },
    });

    return weeks;
  }

  /**
   * Enroll user in a program
   * 📖 REF: PROJECT_MASTER_PLAN.md, Section 6.1, POST /programs/:id/enroll endpoint
   * 📖 REF: PROJECT_MASTER_PLAN_PART2.md, Phase 2, "Enrollment validation"
   */
  async enrollUserInProgram(userId: string, programId: string) {
    // Check if program exists and is published
    const program = await prisma.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      throw new Error('Program not found');
    }

    if (!program.isPublished) {
      throw new Error('Program not available for enrollment');
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.userProgramEnrollment.findUnique({
      where: {
        userId_programId: {
          userId: userId,
          programId: programId,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error('Already enrolled in this program');
    }

    // Create enrollment
    const enrollment = await prisma.userProgramEnrollment.create({
      data: {
        userId: userId,
        programId: programId,
        enrollmentStatus: 'ACTIVE',
        paymentStatus: 'FREE', // Default to free, will be updated by payment flow
        accessGrantedAt: new Date(),
        currentWeek: 1,
        completionPercentage: 0,
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
            description: true,
            durationWeeks: true,
          },
        },
      },
    });

    return enrollment;
  }

  /**
   * Get user's enrolled programs
   * 📖 REF: PROJECT_MASTER_PLAN.md, Section 6.1, GET /users/me/programs endpoint
   */
  async getUserPrograms(userId: string) {
    const enrollments = await prisma.userProgramEnrollment.findMany({
      where: {
        userId: userId,
        enrollmentStatus: 'ACTIVE',
      },
      include: {
        program: {
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            programType: true,
            language: true,
            durationWeeks: true,
          },
        },
      },
      orderBy: {
        lastActivityAt: 'desc',
      },
    });

    return enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      program: enrollment.program,
      currentWeek: enrollment.currentWeek,
      completionPercentage: enrollment.completionPercentage,
      enrolledAt: enrollment.enrolledAt,
      lastActivityAt: enrollment.lastActivityAt,
      paymentStatus: enrollment.paymentStatus,
    }));
  }

  /**
   * Get user's enrollment for a specific program
   * Used for access control - checking if user can access program content
   * 📖 REF: PROJECT_MASTER_PLAN_PART2.md, Phase 2, "Access control"
   */
  async getUserEnrollment(userId: string, programId: string) {
    const enrollment = await prisma.userProgramEnrollment.findUnique({
      where: {
        userId_programId: {
          userId: userId,
          programId: programId,
        },
      },
      include: {
        program: true,
      },
    });

    return enrollment;
  }

  /**
   * Check if user has access to a program
   * 📖 REF: PROJECT_MASTER_PLAN_PART2.md, Phase 2, "Access control"
   */
  async hasAccess(userId: string, programId: string): Promise<boolean> {
    const enrollment = await this.getUserEnrollment(userId, programId);

    if (!enrollment) {
      return false;
    }

    // Check if enrollment is active
    if (enrollment.enrollmentStatus !== 'ACTIVE') {
      return false;
    }

    // Check if access has expired (if expiration date is set)
    if (enrollment.accessExpiresAt && enrollment.accessExpiresAt < new Date()) {
      return false;
    }

    return true;
  }
}

export const programService = new ProgramService();
