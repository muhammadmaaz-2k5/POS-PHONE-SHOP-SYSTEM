import { Response } from 'express';

/**
 * Standard API response helper.
 */
const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: unknown = null
): Response => {
  const response: Record<string, unknown> = { success, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

export default sendResponse;
