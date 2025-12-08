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

  // ============ HERO MOMENTS METHODS ============

  // Get next hero moment scenario
  async getNextHeroScenario(assessmentId: string) {
    const assessment = await prisma.innerDnaAssessment.findUnique({
      where: { id: assessmentId },
      include: { heroResponses: true },
    });
    if (!assessment) throw new Error("Assessment not found");

    const { GENERAL_SCENARIOS, TARGETED_SCENARIOS, CONFIDENCE_THRESHOLDS, SCENARIO_LIMITS } = require("../../data/hero-moments-scenarios");
    const answeredIds = assessment.heroResponses.map(r => r.scenarioId);
    const heroScores = (assessment.heroScores as Record<string, number>) || this.initializeHeroScores();

    // Check if we have reached confidence threshold
    const topType = this.getTopTypeFromScores(heroScores);
    if (topType.confidence >= CONFIDENCE_THRESHOLDS.MIN_CONFIDENCE && answeredIds.length >= SCENARIO_LIMITS.MIN_SCENARIOS) {
      return { completed: true, finalType: topType.type, confidence: topType.confidence, heroScores };
    }

    // Check max scenarios limit
    if (answeredIds.length >= SCENARIO_LIMITS.MAX_SCENARIOS) {
      return { completed: true, finalType: topType.type, confidence: topType.confidence, heroScores, maxReached: true };
    }

    // Get available scenarios
    let availableScenarios = GENERAL_SCENARIOS.filter((s: any) => !answeredIds.includes(s.id));

    // If in adaptive phase, prioritize targeted scenarios
    if (topType.confidence >= CONFIDENCE_THRESHOLDS.ADAPTIVE_THRESHOLD && assessment.topTypes?.length) {
      const targetedAvailable = TARGETED_SCENARIOS.filter((s: any) => 
        !answeredIds.includes(s.id) && s.targetTypes?.some((t: number) => assessment.topTypes.includes(t))
      );
      if (targetedAvailable.length > 0) availableScenarios = targetedAvailable;
    }

    if (availableScenarios.length === 0) {
      return { completed: true, finalType: topType.type, confidence: topType.confidence, heroScores, noMoreScenarios: true };
    }

    // Shuffle and pick next scenario
    const nextScenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
    return {
      completed: false,
      scenario: nextScenario,
      scenarioNumber: answeredIds.length + 1,
      currentConfidence: topType.confidence,
      leadingType: topType.type,
      heroScores,
    };
  }

  // Initialize hero scores for all 9 types
  initializeHeroScores(): Record<string, number> {
    return { type1: 0.111, type2: 0.111, type3: 0.111, type4: 0.111, type5: 0.111, type6: 0.111, type7: 0.111, type8: 0.111, type9: 0.111 };
  }

  // Get top type from scores
  getTopTypeFromScores(scores: Record<string, number>): { type: number; confidence: number } {
    let maxType = 1;
    let maxScore = 0;
    for (let i = 1; i <= 9; i++) {
      const score = scores[`type${i}`] || 0;
      if (score > maxScore) { maxScore = score; maxType = i; }
    }
    return { type: maxType, confidence: maxScore };
  }

  // Save hero moment response and update Bayesian scores
  async saveHeroResponse(assessmentId: string, scenarioId: string, selectedOptionId: string, selectedType: number, optionConfidence: number) {
    const { ALGORITHM_CONSTANTS } = require("../../data/hero-moments-scenarios");
    const assessment = await prisma.innerDnaAssessment.findUnique({ where: { id: assessmentId } });
    if (!assessment) throw new Error("Assessment not found");

    let heroScores = (assessment.heroScores as Record<string, number>) || this.initializeHeroScores();

    // Apply Bayesian update
    const weight = ALGORITHM_CONSTANTS.BASE_RESPONSE_WEIGHT * optionConfidence;
    heroScores[`type${selectedType}`] = Math.min(0.99, (heroScores[`type${selectedType}`] || 0.111) + weight);

    // Decay other types slightly
    for (let i = 1; i <= 9; i++) {
      if (i !== selectedType) {
        heroScores[`type${i}`] = Math.max(0.01, (heroScores[`type${i}`] || 0.111) * ALGORITHM_CONSTANTS.CONFIDENCE_DECAY_FACTOR);
      }
    }

    // Normalize scores to sum to 1
    const total = Object.values(heroScores).reduce((a, b) => a + b, 0);
    for (const key of Object.keys(heroScores)) {
      heroScores[key] = heroScores[key] / total;
    }

    // Save response
    await prisma.heroMomentResponse.create({
      data: { assessmentId, scenarioId, selectedOption: selectedOptionId, selectedType, confidence: optionConfidence },
    });

    // Update assessment
    const topType = this.getTopTypeFromScores(heroScores);
    await prisma.innerDnaAssessment.update({
      where: { id: assessmentId },
      data: {
        heroScores,
        ...(topType.confidence >= 0.9 ? { finalType: topType.type, status: "HERO_COMPLETE" } : {}),
      },
    });

    return { heroScores, topType };
  }

}

export const innerDnaService = new InnerDnaService();
