import express, { Request, Response, ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes';
import programRoutes from './routes/program.routes';
import progressRoutes from './routes/progress.routes';
import fileRoutes from './routes/file.routes';
import analyticsRoutes from './routes/analytics.routes';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'IYCT API is running', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/programs', programRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/files', fileRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('Error:', err);
  if (err.name === 'PrismaClientKnownRequestError') {
    res.status(400).json({ success: false, error: { code: 'DATABASE_ERROR', message: 'Database operation failed' } });
    return;
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Authentication failed' } });
    return;
  }
  res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
};
app.use(errorHandler);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`👨‍🏫 Coach API: http://localhost:${PORT}/api/v1/coach`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });

startServer();
export default app;
