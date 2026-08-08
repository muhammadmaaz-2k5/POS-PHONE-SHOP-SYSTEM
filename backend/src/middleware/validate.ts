import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError';

/**
 * Validates express-validator results.
 * Place this middleware AFTER your validation chain.
 */
const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg as string)
      .join(', ');
    return next(new ApiError(message, 422));
  }
  next();
};

export default validate;
