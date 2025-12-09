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

  async getActiveAssessment(userId: string) {
    return prisma.innerDnaAssessment.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
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
    const topTypes = assessment.topTypes || []; const heroScores = (assessment.heroScores as Record<string, number>) || this.initializeHeroScores(topTypes);

    // Check if we have reached confidence threshold
    const topType = this.getTopTypeFromScores(heroScores, topTypes);
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
    const rawScenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)]; const filteredOptions = rawScenario.options.filter((o: any) => topTypes.includes(o.personalityType)); const nextScenario = { ...rawScenario, options: filteredOptions };
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
  initializeHeroScores(topTypes: number[], rhetiScores?: Record<string, number>): Record<string, number> {
    const scores: Record<string, number> = {};
    if (rhetiScores && topTypes.length === 3) {
      // Use RHETI scores as Bayesian prior
      const t1 = rhetiScores[`type${topTypes[0]}`] || 0;
      const t2 = rhetiScores[`type${topTypes[1]}`] || 0;
      const t3 = rhetiScores[`type${topTypes[2]}`] || 0;
      const total = t1 + t2 + t3;
      scores[`type${topTypes[0]}`] = t1 / total;
      scores[`type${topTypes[1]}`] = t2 / total;
      scores[`type${topTypes[2]}`] = t3 / total;
    } else {
      topTypes.forEach(t => scores[`type${t}`] = 0.333);
    }
    return scores;
  }

  // Get top type from scores
  getTopTypeFromScores(scores: Record<string, number>, topTypes?: number[]): { type: number; confidence: number } {
    let maxType = 1;
    let maxScore = 0;
    const typesToCheck = topTypes && topTypes.length > 0 ? topTypes : [1,2,3,4,5,6,7,8,9]; for (const i of typesToCheck) {
      const score = scores[`type${i}`] || 0;
      if (score > maxScore) { maxScore = score; maxType = i; }
    }
    return { type: maxType, confidence: maxScore };
  }

  // Save hero moment response and update Bayesian scores
  async saveHeroResponse(assessmentId: string, scenarioId: string, selectedOptionId: string, selectedType: number, optionConfidence: number) {
    const assessment = await prisma.innerDnaAssessment.findUnique({ 
      where: { id: assessmentId }, 
      include: { heroResponses: true } 
    });
    if (!assessment) throw new Error("Assessment not found");

    const topTypes = assessment.topTypes || [];
    const rhetiScores = assessment.rhetiScores as Record<string, number> || {};

    // Save response first
    await prisma.heroMomentResponse.create({
      data: { assessmentId, scenarioId, selectedOption: selectedOptionId, selectedType, confidence: optionConfidence },
    });

    // Get all responses including this one
    const allResponses = [...assessment.heroResponses, { selectedType }];
    const scenarioCount = allResponses.length;

    // Count picks per type
    const typeCounts: Record<number, number> = {};
    allResponses.forEach(r => { typeCounts[r.selectedType] = (typeCounts[r.selectedType] || 0) + 1; });

    // Find dominant type
    const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    const heroDominant = parseInt(sortedTypes[0][0]);
    const heroDominantCount = sortedTypes[0][1];
    const heroSecondCount = sortedTypes[1] ? sortedTypes[1][1] : 0;
    const heroGap = heroDominantCount - heroSecondCount;

    // Calculate RHETI clarity
    const rhetiTop3Scores = topTypes.map(t => rhetiScores[`type${t}`] || 0);
    const rhetiGap = rhetiTop3Scores[0] - rhetiTop3Scores[1];
    const isRhetiClear = rhetiGap >= 3;
    const rhetiLeader = topTypes[0];
    const heroMatchesRheti = heroDominant === rhetiLeader;

    // SMART COMPLETION - pick counting based
    let isComplete = false;
    let finalConfidence = 0;

    if (isRhetiClear && heroMatchesRheti && heroDominantCount >= 2) {
      isComplete = true;
      finalConfidence = 0.92;
    } else if (heroDominantCount >= 3 && heroGap >= 2) {
      isComplete = true;
      finalConfidence = 0.93;
    } else if (heroDominantCount >= 3 && heroGap >= 1) {
      isComplete = true;
      finalConfidence = 0.91;
    } else if (scenarioCount >= 5 && heroGap >= 2) {
      isComplete = true;
      finalConfidence = 0.90;
    } else if (scenarioCount >= 8) {
      isComplete = true;
      finalConfidence = 0.85;
    }

    // Build heroScores from pick counts
    const heroScores: Record<string, number> = {};
    if (isComplete) {
      heroScores[`type${heroDominant}`] = finalConfidence;
      const remaining = 1 - finalConfidence;
      const otherTypes = topTypes.filter(t => t !== heroDominant);
      otherTypes.forEach(t => { heroScores[`type${t}`] = remaining / otherTypes.length; });
    } else {
      topTypes.forEach(t => { heroScores[`type${t}`] = (typeCounts[t] || 0) / scenarioCount; });
    }

    await prisma.innerDnaAssessment.update({
      where: { id: assessmentId },
      data: {
        heroScores,
        ...(isComplete ? { finalType: heroDominant, status: "HERO_COMPLETE" } : {}),
      },
    });

    return { heroScores, topType: { type: heroDominant, confidence: isComplete ? finalConfidence : heroScores[`type${heroDominant}`] || 0 }, isComplete, scenarioCount };
  }

  // ========== BUILDING BLOCKS (Stage 3) ==========

  async getBuildingBlockQuestions(assessmentId: string) {
    const assessment = await prisma.innerDnaAssessment.findUnique({ where: { id: assessmentId } });
    if (!assessment) throw new Error("Assessment not found");
    if (assessment.status !== "HERO_COMPLETE") throw new Error("Complete Hero Moments first");
    if (!assessment.finalType) throw new Error("No final type determined");

    const { getWingQuestionsForType } = await import("../../data/building-blocks-questions");
    const wingSet = getWingQuestionsForType(assessment.finalType);
    if (!wingSet) throw new Error("No wing questions for type " + assessment.finalType);

    return {
      questions: wingSet.questions.map((q: any) => ({
        id: q.id,
        optionA: q.optionA,
        optionB: q.optionB
      })),
      totalQuestions: wingSet.questions.length
    };
  }

  async saveBuildingBlockAnswers(assessmentId: string, answers: { questionId: string; selected: "A" | "B" }[]) {
    const assessment = await prisma.innerDnaAssessment.findUnique({ where: { id: assessmentId } });
    if (!assessment) throw new Error("Assessment not found");
    if (!assessment.finalType) throw new Error("No final type determined");

    const { getWingQuestionsForType, determineWing } = await import("../../data/building-blocks-questions");
    const wingSet = getWingQuestionsForType(assessment.finalType);
    if (!wingSet) throw new Error("No wing questions for type");

    let wingAPicks = 0;
    let wingBPicks = 0;
    answers.forEach(a => {
      if (a.selected === "A") wingAPicks++;
      else wingBPicks++;
    });

    const wing = determineWing(assessment.finalType, wingAPicks, wingBPicks);

    await prisma.innerDnaAssessment.update({
      where: { id: assessmentId },
      data: { buildingBlock: String(wing.wing), status: "BUILDING_COMPLETE" }
    });

    return { wing, wingAPicks, wingBPicks, status: "BUILDING_COMPLETE" };
  }

}

export const innerDnaService = new InnerDnaService();
