# Testing

## Commands

```bash
npm test
npm run typecheck
npm run verify
```

## Test Strategy

- Package logic: Vitest near the package.
- Route handlers: small request/response tests with mocked packages.
- Webhooks: verify signature, idempotency, event persistence, and retry behavior.
- UI flows: Playwright browser QA for authenticated routes.

## Mock Defaults

Add shared mocks for:

- Prisma
- Clerk
- Stripe
- Pusher
- Trigger tasks

