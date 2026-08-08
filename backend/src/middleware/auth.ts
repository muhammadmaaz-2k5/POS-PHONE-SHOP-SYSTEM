import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import prisma from '../config/prisma';

export const mockAuthMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const role = (req.headers['x-mock-role'] as string) || 'admin';
  const clerkUserId = `mock_clerk_${role}`;
  
  (req as any).auth = {
    userId: clerkUserId,
    sessionClaims: { metadata: { role } }
  };

  try {
    const mockEmail = `mock_${role}@example.com`;
    let user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: mockEmail,
          name: `Mock ${role}`,
          role: role,
          clerkUserId,
        }
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const protect = (req: Request, _res: Response, next: NextFunction): void => {
  const auth = (req as any).auth;
  if (!auth || !auth.userId) {
    return next(new ApiError('Not authorized to access this route', 401));
  }
  next();
};

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const auth = (req as any).auth;
    const role = auth?.sessionClaims?.metadata?.role ?? 'cashier';
    if (!roles.includes(role)) {
      return next(
        new ApiError(`Role '${role}' is not authorized to access this route`, 403)
      );
    }
    next();
  };
};
