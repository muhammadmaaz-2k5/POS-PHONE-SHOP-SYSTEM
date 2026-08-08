import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import asyncHandler from '../utils/asyncHandler';
import sendResponse from '../utils/sendResponse';
import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';

/**
 * @desc    Get current logged in user details from DB
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const { userId: clerkUserId } = getAuth(req);
  
  if (!clerkUserId) {
    throw new ApiError('Not authenticated', 401);
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: {
      id: true,
      clerkUserId: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  if (!user) {
    // If webhook hasn't synced yet, this will be null
    throw new ApiError('User not found in local database', 404);
  }

  sendResponse(res, 200, true, 'User details fetched', user);
});
