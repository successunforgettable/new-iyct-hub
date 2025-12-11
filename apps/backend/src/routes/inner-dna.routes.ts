import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import {
  startAssessment,
  getQuestion,
  getAllQuestions,
  submitAnswer,
  getAssessment,
  resetAssessment,
  getNextHeroScenario,
  submitHeroAnswer,
  getHeroProgress,
  getBuildingBlockQuestions,
  submitBuildingBlockAnswers,
  saveSubtypeTokens,
  saveColorStates,
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

// Hero Moments routes
router.get("/hero/scenario", getNextHeroScenario);
router.post("/hero/answer", submitHeroAnswer);
router.get("/hero/progress", getHeroProgress);

// Building Blocks routes
router.get("/building-blocks/questions", getBuildingBlockQuestions);
router.post("/building-blocks/answer", submitBuildingBlockAnswers);

// Color States routes
router.post("/color-states/save", saveColorStates);

// Subtype Tokens routes
router.post("/subtype-tokens/save", saveSubtypeTokens);

export default router;
