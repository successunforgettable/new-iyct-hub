import { Router } from 'express';
import { getUsers, updateUser, deleteUser, getPrograms, getAnalytics } from '../controllers/admin.controller';

const router = Router();

router.get('/users', getUsers);
router.patch('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);
router.get('/programs', getPrograms);
router.get('/analytics', getAnalytics);

export default router;
