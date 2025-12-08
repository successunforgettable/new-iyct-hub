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
