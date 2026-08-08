import { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers to avoid try/catch boilerplate.
 */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
