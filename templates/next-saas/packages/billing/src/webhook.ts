import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@__APP_SCOPE__/db';
import { getStripe } from './stripe';

type ProcessStripeWebhookInput = {
  body: string;
  signature: string | null;
};

export async function processStripeWebhook(input: ProcessStripeWebhookInput) {
  const secret = getWebhookSecret();
  if (!secret || !input.signature) {
    return { ok: false, error: 'Missing Stripe webhook secret or signature' };
  }

  const stripe = getStripe();
  const event = stripe.webhooks.constructEvent(input.body, input.signature, secret);

  await prisma.stripeEventLog.upsert({
    where: { stripeEventId: event.id },
    update: {},
    create: {
      stripeEventId: event.id,
      eventType: event.type,
      payload: event as unknown as object
    }
  });

  // TODO: delegate event types to subscription/customer handlers.
  await prisma.stripeEventLog.update({
    where: { stripeEventId: event.id },
    data: {
      status: 'processed',
      processedAt: new Date()
    }
  });

  return { ok: true, id: event.id, type: event.type };
}

function getWebhookSecret() {
  const localSecretFile = path.resolve('.stripe/webhook-secret');
  if (fs.existsSync(localSecretFile)) {
    return fs.readFileSync(localSecretFile, 'utf8').trim();
  }
  return process.env.STRIPE_WEBHOOK_SECRET;
}
