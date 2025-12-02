// apps/backend/src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import programRoutes from './program.routes';
import progressRoutes from './progress.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/programs', programRoutes);
router.use('/progress', progressRoutes);

export default router;
