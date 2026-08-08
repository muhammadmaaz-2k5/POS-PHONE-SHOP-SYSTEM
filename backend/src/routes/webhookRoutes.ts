import { Router } from 'express';
import express from 'express';
import { handleClerkWebhook } from '../controllers/webhookController';

const router = Router();

// IMPORTANT: Webhook payload must be raw bytes for Svix signature verification.
// We apply express.raw() specifically to this route.
router.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  handleClerkWebhook
);

export default router;
