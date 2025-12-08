import { PrismaClient } from '@prisma/client';
import { COLUMN_TO_TYPE, RHETI_QUESTIONS, TYPE_NAMES } from '../../data/rheti-questions';

const prisma = new PrismaClient();

export class InnerDnaService {
  // Start or get existing assessment
  async startAssessment(userId: string) {
    // Check for existing incomplete assessment
    const existing = await prisma.innerDnaAssessment.findFirst({
      where: {
        userId,
        status: { not: 'FINISHED' },
      },
      include: {
        rhetiResponses: true,
      },
    });

    if (existing) {
      return {
        assessment: existing,
        currentQuestion: existing.rhetiResponses.length + 1,
        totalQuestions: 36,
        isResuming: true,
      };
    }

    // Create new assessment
    const assessment = await prisma.innerDnaAssessment.create({
      data: {
        userId,
        status: 'STARTED',
        topTypes: [],
      },
      include: {
        rhetiResponses: true,
      },
    });

    return {
      assessment,
      currentQuestion: 1,
      totalQuestions: 36,
      isResuming: false,
    };
  }

  // Get RHETI question by number
  getQuestion(questionNumber: number) {
    const question = RHETI_QUESTIONS.find((q) => q.id === questionNumber);
    if (!question) {
      throw new Error(`Question ${questionNumber} not found`);
    }
    return question;
  }

  // Save RHETI response
  async saveRhetiResponse(
    assessmentId: string,
    questionNumber: number,
    selectedOption: 'A' | 'B'
  ) {
    const question = this.getQuestion(questionNumber);
    const selectedColumn = selectedOption === 'A' ? question.columnA : question.columnB;

    // Upsert response (allows changing answer)
    await prisma.rhetiResponse.upsert({
      where: {
        assessmentId_questionNumber: {
          assessmentId,
          questionNumber,
        },
      },
      update: {
        selectedOption,
        selectedColumn,
      },
      create: {
        assessmentId,
        questionNumber,
        selectedOption,
        selectedColumn,
      },
    });

    // Check if all 36 questions answered
    const responseCount = await prisma.rhetiResponse.count({
      where: { assessmentId },
    });

    if (responseCount >= 36) {
      // Calculate scores and update assessment
      return this.calculateRhetiScores(assessmentId);
    }

    return {
      completed: false,
      nextQuestion: questionNumber + 1,
      answeredCount: responseCount,
    };
  }

  // Calculate RHETI scores from responses
  async calculateRhetiScores(assessmentId: string) {
    const responses = await prisma.rhetiResponse.findMany({
      where: { assessmentId },
    });

    // Count by column
    const columnCounts: Record<string, number> = {
      A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0,
    };

    responses.forEach((r) => {
      columnCounts[r.selectedColumn]++;
    });

    // Convert to type scores
    const typeScores: Record<string, number> = {};
    for (let type = 1; type <= 9; type++) {
      typeScores[`type${type}`] = 0;
    }

    Object.entries(columnCounts).forEach(([column, count]) => {
      const type = COLUMN_TO_TYPE[column];
      typeScores[`type${type}`] = count;
    });

    // Find top 3 types
    const sortedTypes = Object.entries(typeScores)
      .map(([key, score]) => ({
        type: parseInt(key.replace('type', '')),
        score,
      }))
      .sort((a, b) => b.score - a.score);

    const topTypes = sortedTypes.slice(0, 3).map((t) => t.type);

    // Update assessment
    await prisma.innerDnaAssessment.update({
      where: { id: assessmentId },
      data: {
        rhetiScores: typeScores,
        topTypes,
        status: 'RHETI_COMPLETE',
      },
    });

    return {
      completed: true,
      rhetiScores: typeScores,
      topTypes,
      topTypesWithNames: topTypes.map((t) => ({
        type: t,
        name: TYPE_NAMES[t],
        score: typeScores[`type${t}`],
      })),
      nextStage: 'HERO_MOMENTS',
    };
  }

  // Get assessment status
  async getAssessment(assessmentId: string) {
    return prisma.innerDnaAssessment.findUnique({
      where: { id: assessmentId },
      include: {
        rhetiResponses: true,
        heroResponses: true,
      },
    });
  }

  // Get user's latest assessment
  async getUserAssessment(userId: string) {
    return prisma.innerDnaAssessment.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        rhetiResponses: true,
        heroResponses: true,
      },
    });
  }

  // Reset assessment for testing
  async resetAssessment(userId: string) {
    await prisma.rhetiResponse.deleteMany({ where: { assessment: { userId } } });
    await prisma.heroMomentResponse.deleteMany({ where: { assessment: { userId } } });
    return prisma.innerDnaAssessment.deleteMany({ where: { userId } });
  }
}

export const innerDnaService = new InnerDnaService();
