import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Error occurred:', {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: err.stack
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code
    });
  }

  // Prisma-specific errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    let message = 'Database error';
    let statusCode = 500;

    if (prismaError.code === 'P2002') {
      message = 'Unique constraint violation';
      statusCode = 409;
    } else if (prismaError.code === 'P2025') {
      message = 'Record not found';
      statusCode = 404;
    }

    return res.status(statusCode).json({
      success: false,
      message,
      code: prismaError.code
    });
  }

  // Default error response
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
}
