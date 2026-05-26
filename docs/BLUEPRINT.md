# Blueprint

## Product

`create-dave-app` creates a new Dave-style SaaS project with the integrations and operating conventions already in place.

The generated app should feel like a real product on day one:

- Auth-gated app shell.
- Custom sign-in and sign-up forms.
- Custom profile and organization settings.
- Clerk org requirement and local user/org sync points.
- Stripe checkout, portal, webhook, and entitlement skeletons.
- Trigger.dev jobs.
- Pusher realtime channels.
- Prisma/Postgres schema.
- Public API, CLI, and MCP surfaces that share contracts.
- Agent docs and browser QA workflow.

## Default Repo Shape

```text
.
├── app/
├── components/
├── context/
├── docs/
├── lib/
├── packages/
│   ├── api/
│   ├── auth/
│   ├── billing/
│   ├── cli/
│   ├── db/
│   ├── jobs/
│   ├── mcp/
│   ├── realtime/
│   ├── shared/
│   └── types/
├── prisma/
├── scripts/
├── tests/
├── trigger/
├── package.json
└── turbo.json
```

This deliberately uses a root Next app instead of `apps/web` for the default preset. Dave can add additional apps later, but the root app is faster for personal projects.

## Core Rule

Implement capabilities once in packages, then expose them through thin transports:

```text
domain service
  -> Next route
  -> public API route
  -> CLI command
  -> MCP tool
  -> Trigger task
```

## Packages

- `@scope/types`: shared TypeScript types.
- `@scope/shared`: Zod contracts, scopes, utilities, public constants.
- `@scope/db`: Prisma client and query helpers.
- `@scope/auth`: Clerk org helpers, bearer auth, API key validation, permissions.
- `@scope/billing`: Stripe plans, checkout, portal, webhook processing, entitlements.
- `@scope/realtime`: Pusher server/client helpers and typed events.
- `@scope/jobs`: Trigger task payloads, idempotency helpers, run manifests.
- `@scope/api`: Hono/OpenAPI public API.
- `@scope/cli`: Commander CLI over the same public API/contracts.
- `@scope/mcp`: MCP tools over the same service/client layer.

## Local Dev Contract

`npm run dev` should be the daily command.

It starts:

- Postgres, Redis, Mailpit through Docker Compose.
- Next dev server.
- Trigger.dev dev server.
- Stripe listener when requested.
- Optional API/CLI/MCP dev surfaces.

Generated apps also include:

- `npm run dev:next`
- `npm run dev:stripe`
- `npm run trigger:dev`
- `npm run stripe:listen`
- `npm run db:start`
- `npm run db:wait`
- `npm run db:push`
- `npm run db:migrate`
- `npm run verify`

## QA Contract

For UI, auth-gated routes, settings, billing, onboarding, and workflows:

1. Run targeted tests.
2. Run typecheck/lint when warranted.
3. Start the app locally.
4. Run `npm run codex:browser:auth -- --base-url http://localhost:3000 --path /target`.
5. Use `--record-video` when evidence helps a PR or ticket.

## Design Contract

Every generated app starts with a `DESIGN.md`.

The template does not force one visual identity. It forces a process:

- define audience and mood;
- define type, spacing, surfaces, and interaction defaults;
- keep Tailwind tokens semantic;
- use shadcn-style primitives;
- build custom auth/settings UI rather than raw Clerk defaults.

