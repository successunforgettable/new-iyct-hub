// apps/backend/src/controllers/program.controller.ts
// 📖 DOCUMENTATION REFERENCE: PROJECT_MASTER_PLAN.md, Section 6.1 (API endpoints), Section 6.2 (Response format)
// 📋 SPEC: "Thin HTTP handlers, Use standardized response format, Handle errors properly"
// 🔧 IMPLEMENTATION: Controllers for all 5 program endpoints
// ✅ VERIFICATION: Returns consistent API responses matching documentation format

import { Request, Response } from 'express';
import { programService } from '../services/program.service';

/**
 * Get all published programs
 * 📖 REF: PROJECT_MASTER_PLAN.md, Section 6.1, GET /programs
 * Route: GET /api/v1/programs
 */
export const getAllPrograms = async (_req: Request, res: Response) => {
  try {
    const programs = await programService.getAllPrograms();

    // 📖 REF: PROJECT_MASTER_PLAN.md, Section 6.2, Success Response format
    return res.json({
      success: true,
      data: programs,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: _req.headers['x-request-id'] || 'N/A',
      },
    });
  } catch (error) {
    // 📖 REF: PROJECT_MASTER_PLAN.md, Section 6.2, Error Response format
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch programs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: _req.headers['x-request-id'] || 'N/A',
      },
    });
  }
};

/**
 * Get program details by ID
 * 📖 REF: PROJECT_MASTER_PLAN.md, Section 6.1, GET /programs/:id
 * Route: GET /api/v1/programs/:id
 */
export const getProgramById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const program = await programService.getProgramById(id);

    return res.json({
      success: true,
      data: program,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'N/A',
      },
    });
  } catch (error) {
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 404 ? 'NOT_FOUND' : 'SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch program',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'N/A',
      },
    });
  }
};

/**
 * Get program structure (weeks and steps)
 * 📖 REF: PROJECT_MASTER_PLAN.md, Section 6.1, GET /programs/:id/weeks
 * Route: GET /api/v1/programs/:id/weeks
 */
export const getProgramWeeks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const weeks = await programService.getProgramWeeks(id);

    return res.json({
      success: true,
      data: weeks,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'N/A',
      },
    });
  } catch (error) {
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 404 ? 'NOT_FOUND' : 'SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch program weeks',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'N/A',
      },
    });
  }
};

/**
 * Enroll user in a program
 * 📖 REF: PROJECT_MASTER_PLAN.md, Section 6.1, POST /programs/:id/enroll
 * Route: POST /api/v1/programs/:id/enroll
 * Requires authentication
 */
export const enrollInProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] || 'N/A',
        },
      });
    }

    const enrollment = await programService.enrollUserInProgram(userId, id);

    return res.status(201).json({
      success: true,
      data: enrollment,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'N/A',
      },
    });
  } catch (error) {
    let statusCode = 500;
    let errorCode = 'SERVER_ERROR';

    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('not available')) {
        statusCode = 404;
        errorCode = 'NOT_FOUND';
      } else if (error.message.includes('Already enrolled')) {
        statusCode = 400;
        errorCode = 'ALREADY_ENROLLED';
      }
    }

    return res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message: error instanceof Error ? error.message : 'Failed to enroll in program',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'N/A',
      },
    });
  }
};

/**
 * Get user's enrolled programs
 * 📖 REF: PROJECT_MASTER_PLAN.md, Section 6.1, GET /users/me/programs
 * Route: GET /api/v1/users/me/programs
 * Requires authentication
 */
export const getUserPrograms = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] || 'N/A',
        },
      });
    }

    const programs = await programService.getUserPrograms(userId);

    return res.json({
      success: true,
      data: programs,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'N/A',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch user programs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'N/A',
      },
    });
  }
};
