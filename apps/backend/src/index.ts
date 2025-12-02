// Implementation: Backend Server with Priority 8 File Upload Support
// Reference: PROJECT_MASTER_PLAN_PART2.md, Section 11, Week 3-4
// Includes: Authentication, Programs, Progress Tracking, File Upload

import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.routes';
import programRoutes from './routes/program.routes';
import progressRoutes from './routes/progress.routes';
import fileRoutes from './routes/file.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (Priority 8)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'IYCT Platform API is running' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/programs', programRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/files', fileRoutes); // Priority 8: File upload

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/v1/auth`);
  console.log(`📚 Programs API: http://localhost:${PORT}/api/v1/programs`);
  console.log(`📊 Progress API: http://localhost:${PORT}/api/v1/progress`);
  console.log(`📤 Files API: http://localhost:${PORT}/api/v1/files`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
});

export default app;
