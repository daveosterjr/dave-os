# __APP_TITLE__ Agent Guide

This repo is built around one rule: domain logic lives in packages; routes and tools stay thin.

## Defaults

- Use npm workspaces.
- Use TypeScript everywhere.
- Use Tailwind and local shadcn-style primitives.
- Use custom Clerk UI and settings components. Do not drop in default Clerk sign-in, sign-up, profile, or organization management components.
- Use Prisma/Postgres for product state.
- Use Trigger.dev for background jobs.
- Use Pusher for realtime UI events.
- Use Stripe webhooks with event logging and idempotency.

## Validation

For most changes:

```bash
npm run typecheck
npm test
```

For UI/auth/settings/billing changes:

```bash
npm run codex:browser:auth -- --base-url http://localhost:3000 --path /target-path
```

Add focused tests near the package or route you change.

