import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware.
 */
const errorHandler = (
  err: Error & { statusCode?: number; code?: number; keyValue?: Record<string, string>; name?: string },
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let statusCode = err.statusCode ?? 500;
  let message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error('💥 Error:', err);
  }

  // Prisma not found
  if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Prisma unique constraint violation (P2002)
  if ((err as { code?: string }).code === 'P2002') {
    const prismaErr = err as { meta?: { target?: string[] } };
    const field = prismaErr.meta?.target?.[0] ?? 'field';
    statusCode = 400;
    message = `A record with that ${field} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired'; }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
