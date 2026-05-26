# __APP_TITLE__

__APP_DESCRIPTION__

Generated with Dave OS.

## Stack

- Next.js App Router
- Tailwind CSS and shadcn-style local primitives
- Clerk auth and organizations
- Prisma/Postgres
- Stripe subscriptions and webhooks
- Trigger.dev jobs
- Pusher realtime
- Hono public API
- CLI and MCP surfaces

## Local Setup

```bash
cp .env.example .env.local
npm install
npm run db:start
npm run db:push
npm run dev
```

Use Stripe locally:

```bash
npm run dev:stripe
```

Run the QA auth helper after the app is started:

```bash
npm run codex:browser:install
npm run codex:browser:auth -- --base-url http://localhost:3000 --path /app
```

## Read Order

1. `AGENTS.md`
2. `SYSTEM.md`
3. `ARCHITECTURE.md`
4. `DESIGN.md`
5. `docs/DEVELOPMENT.md`
6. `docs/ENVIRONMENT.md`
7. `docs/TESTING.md`
8. `docs/API_CLI_MCP.md`
9. `docs/QA.md`

