import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import ApiError from '../utils/ApiError';

/**
 * Protects routes — verifies Clerk session on every request.
 * Must be used AFTER clerkMiddleware() is applied globally.
 */
export const protect = (req: Request, _res: Response, next: NextFunction): void => {
  const { userId } = getAuth(req);
  if (!userId) {
    return next(new ApiError('Not authorized to access this route', 401));
  }
  next();
};

/**
 * Restricts access by role stored in Clerk session claims.
 * @param roles - Allowed roles (e.g. 'admin', 'cashier')
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { sessionClaims } = getAuth(req);
    const role = (sessionClaims?.metadata as { role?: string })?.role ?? 'cashier';
    if (!roles.includes(role)) {
      return next(
        new ApiError(`Role '${role}' is not authorized to access this route`, 403)
      );
    }
    next();
  };
};
