import { Request, Response } from 'express';
import { Webhook } from 'svix';
import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

// Clerk Webhook Event Types
type WebhookEvent = 
  | { type: 'user.created'; data: Record<string, unknown> }
  | { type: 'user.updated'; data: Record<string, unknown> }
  | { type: 'user.deleted'; data: Record<string, unknown> };

/**
 * @desc    Handle Clerk Webhooks to sync users to PostgreSQL
 * @route   POST /api/webhooks/clerk
 * @access  Public (Verified by Svix signature)
 */
export const handleClerkWebhook = asyncHandler(async (req: Request, res: Response) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers and body
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new ApiError('Error occurred -- no svix headers', 400);
  }

  // req.body must be a Buffer for Svix verification
  const payload = req.body;
  const body = payload.toString('utf8');

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    throw new ApiError('Error occurred', 400);
  }

  const { id } = evt.data as { id: string };
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { first_name, last_name, email_addresses, public_metadata } = evt.data as {
      first_name: string | null;
      last_name: string | null;
      email_addresses: Array<{ email_address: string }>;
      public_metadata: { role?: string };
    };

    const name = [first_name, last_name].filter(Boolean).join(' ') || 'User';
    const email = email_addresses[0]?.email_address || '';
    const role = public_metadata?.role || 'cashier';

    await prisma.user.upsert({
      where: { clerkUserId: id },
      update: { name, email, role },
      create: { clerkUserId: id, name, email, role },
    });
    
    console.log(`✅ Synced Clerk user ${id} to database (${eventType})`);
  }

  if (eventType === 'user.deleted') {
    await prisma.user.delete({
      where: { clerkUserId: id },
    });
    console.log(`❌ Deleted Clerk user ${id} from database`);
  }

  res.status(200).json({ success: true, message: 'Webhook received' });
});
