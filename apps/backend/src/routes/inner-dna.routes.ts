import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import {
  startAssessment,
  getQuestion,
  getAllQuestions,
  submitAnswer,
  getAssessment,
  resetAssessment,
} from '../controllers/inner-dna.controller';

const router = Router();

// All routes require authentication
router.use(authenticateJWT);

// Start or resume assessment
router.post('/start', startAssessment);

// Get assessment status
router.get('/assessment', getAssessment);

// Get all RHETI questions
router.get('/rheti/questions', getAllQuestions);

// Get specific question
router.get('/rheti/question/:questionNumber', getQuestion);

// Submit answer
router.post('/rheti/answer', submitAnswer);

// Reset assessment (for testing)
router.delete("/reset", resetAssessment);

export default router;
