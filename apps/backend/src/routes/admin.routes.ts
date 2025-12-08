import { Router } from 'express';
import { getUsers, updateUser, deleteUser, getPrograms, getAnalytics, updateProgram } from '../controllers/admin.controller';

const router = Router();

router.get('/users', getUsers);
router.patch('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);
router.get('/programs', getPrograms);
router.patch('/programs/:programId', updateProgram);
router.get('/analytics', getAnalytics);

export default router;
