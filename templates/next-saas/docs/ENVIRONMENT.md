# Environment

Copy `.env.example` to `.env.local`.

## Required For Local App Boot

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`

## Required For Billing

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Local Stripe listeners write a fresh secret to `.stripe/webhook-secret`. The webhook route should prefer that local file when present.

## Required For Realtime

- `PUSHER_APP_ID`
- `NEXT_PUBLIC_PUSHER_KEY`
- `PUSHER_SECRET`
- `NEXT_PUBLIC_PUSHER_CLUSTER`
- `PUSHER_CHANNEL_SECRET`

## Required For Trigger.dev

- `TRIGGER_SECRET_KEY`

