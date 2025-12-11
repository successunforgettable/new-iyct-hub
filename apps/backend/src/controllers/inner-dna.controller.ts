import { Request, Response } from 'express';
import { innerDnaService } from '../services/inner-dna/inner-dna.service';
import { RHETI_QUESTIONS } from '../data/rheti-questions';

// Start or resume assessment
export const startAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const result = await innerDnaService.startAssessment(userId);
    
    // Include first question if starting fresh
    const firstQuestion = result.currentQuestion <= 36 
      ? innerDnaService.getQuestion(result.currentQuestion)
      : null;

    res.json({
      success: true,
      data: {
        ...result,
        question: firstQuestion,
      },
    });
  } catch (error) {
    console.error('Start assessment error:', error);
    res.status(500).json({ success: false, error: 'Failed to start assessment' });
  }
};

// Get specific RHETI question
export const getQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const questionNumber = parseInt(req.params.questionNumber);
    
    if (questionNumber < 1 || questionNumber > 36) {
      res.status(400).json({ success: false, error: 'Invalid question number' });
      return;
    }

    const question = innerDnaService.getQuestion(questionNumber);
    
    res.json({
      success: true,
      data: {
        question,
        questionNumber,
        totalQuestions: 36,
        progress: Math.round((questionNumber / 36) * 100),
      },
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ success: false, error: 'Failed to get question' });
  }
};

// Get all RHETI questions (for frontend to cache)
export const getAllQuestions = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      data: {
        questions: RHETI_QUESTIONS,
        totalQuestions: 36,
      },
    });
  } catch (error) {
    console.error('Get all questions error:', error);
    res.status(500).json({ success: false, error: 'Failed to get questions' });
  }
};

// Submit RHETI answer
export const submitAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { assessmentId, questionNumber, selectedOption } = req.body;

    if (!assessmentId || !questionNumber || !selectedOption) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: assessmentId, questionNumber, selectedOption' 
      });
      return;
    }

    if (!['A', 'B'].includes(selectedOption)) {
      res.status(400).json({ success: false, error: 'selectedOption must be A or B' });
      return;
    }

    const result = await innerDnaService.saveRhetiResponse(
      assessmentId,
      questionNumber,
      selectedOption
    );

    // If not completed, include next question
    let nextQuestion = null;
    if (!result.completed && 'nextQuestion' in result && result.nextQuestion <= 36) {
      nextQuestion = innerDnaService.getQuestion(result.nextQuestion);
    }

    res.json({
      success: true,
      data: {
        ...result,
        question: nextQuestion,
      },
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit answer' });
  }
};

// Get assessment status
export const getAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const assessment = await innerDnaService.getUserAssessment(userId);
    
    if (!assessment) {
      res.json({
        success: true,
        data: null,
        message: 'No assessment found',
      });
      return;
    }

    res.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ success: false, error: 'Failed to get assessment' });
  }
};

// Reset assessment (for testing)
export const resetAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const result = await innerDnaService.resetAssessment(userId);
    res.json({ success: true, data: result, message: 'Assessment reset' });
  } catch (error) {
    console.error('Reset assessment error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset assessment' });
  }
};

// Get next hero moment scenario
export const getNextHeroScenario = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const assessment = await innerDnaService.getUserAssessment(userId);
    if (!assessment) {
      res.status(404).json({ success: false, error: 'No assessment found. Start RHETI first.' });
      return;
    }

    if (assessment.status === 'STARTED') {
      res.status(400).json({ success: false, error: 'Complete RHETI assessment first.' });
      return;
    }

    const result = await innerDnaService.getNextHeroScenario(assessment.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Get hero scenario error:', error);
    res.status(500).json({ success: false, error: 'Failed to get scenario' });
  }
};

// Submit hero moment answer
export const submitHeroAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { assessmentId, scenarioId, selectedOptionId, selectedType, optionConfidence } = req.body;

    if (!assessmentId || !scenarioId || !selectedOptionId || !selectedType) {
      res.status(400).json({ success: false, error: 'Missing required fields' });
      return;
    }

    const { heroScores, topType } = await innerDnaService.saveHeroResponse(
      assessmentId,
      scenarioId,
      selectedOptionId,
      selectedType,
      optionConfidence || 0.85
    );

    // Get next scenario
    const next = await innerDnaService.getNextHeroScenario(assessmentId);

    res.json({
      success: true,
      data: {
        
        
        ...next,
        currentLeader: topType,
        heroScores,
        
        
      },
    });
  } catch (error) {
    console.error('Submit hero answer error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit answer' });
  }
};

// Get hero moments progress
export const getHeroProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const assessment = await innerDnaService.getUserAssessment(userId);
    if (!assessment) {
      res.status(404).json({ success: false, error: 'No assessment found' });
      return;
    }

    const { TYPE_NAMES } = require('../data/hero-moments-scenarios');
    const heroScores = (assessment.heroScores as Record<string, number>) || {};
    
    const scoresWithNames = Object.entries(heroScores)
      .map(([key, score]) => ({
        type: parseInt(key.replace('type', '')),
        name: TYPE_NAMES[parseInt(key.replace('type', ''))] || 'Unknown',
        confidence: Math.round((score as number) * 100),
      }))
      .sort((a, b) => b.confidence - a.confidence);

    res.json({
      success: true,
      data: {
        status: assessment.status,
        scenariosCompleted: assessment.heroResponses?.length || 0,
        heroScores: scoresWithNames,
        finalType: assessment.finalType,
        finalTypeName: assessment.finalType ? TYPE_NAMES[assessment.finalType] : null,
      },
    });
  } catch (error) {
    console.error('Get hero progress error:', error);
    res.status(500).json({ success: false, error: 'Failed to get progress' });
  }
};

// ========== BUILDING BLOCKS (Stage 3) ==========

export const getBuildingBlockQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }

    const assessment = await innerDnaService.getActiveAssessment(userId);
    if (!assessment) { res.status(404).json({ success: false, error: 'No assessment found' }); return; }

    const result = await innerDnaService.getBuildingBlockQuestions(assessment.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Get building block questions error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const submitBuildingBlockAnswers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }

    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      res.status(400).json({ success: false, error: 'Answers array required' }); return;
    }

    const assessment = await innerDnaService.getActiveAssessment(userId);
    if (!assessment) { res.status(404).json({ success: false, error: 'No assessment found' }); return; }

    const result = await innerDnaService.saveBuildingBlockAnswers(assessment.id, answers);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Submit building block answers error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};


export const saveSubtypeTokens = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    
    const { tokens, order, dnaCode } = req.body;
    
    const result = await innerDnaService.saveSubtypeTokens(userId, tokens, order);
    
    res.json({ success: true, data: { ...result, dnaCode } });
  } catch (error) {
    console.error('Save subtype tokens error:', error);
    res.status(500).json({ success: false, error: 'Failed to save subtype tokens' });
  }
};

export const saveColorStates = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    
    const { primaryState, primaryStatePct, secondaryState, secondaryStatePct } = req.body;
    
    const result = await innerDnaService.saveColorStates(userId, primaryState, primaryStatePct, secondaryState, secondaryStatePct);
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Save color states error:', error);
    res.status(500).json({ success: false, error: 'Failed to save color states' });
  }
};
