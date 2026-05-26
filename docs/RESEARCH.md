# Research Synthesis

## What Dave Keeps Rebuilding

Across `dealmachine-next`, `agentdoc`, `rnd`, `postcardai`, and `cerebro`, the repeated shape is clear:

- Docs are part of the product: `README.md`, `SYSTEM.md`, `ARCHITECTURE.md`, `AGENTS.md`, `DESIGN.md`, focused `docs/*` runbooks.
- Root Next app plus `packages/*` is the fastest personal-project shape, while larger projects sometimes split into more apps.
- Domain logic belongs in packages. Routes, CLI commands, MCP tools, and jobs should stay thin.
- API, CLI, and MCP should expose the same functions instead of drifting.
- Clerk is the preferred human auth layer, with organization membership required for real app work.
- Local DB shadow tables for users, orgs, memberships, API keys, Stripe customers, Stripe events, webhooks, and job state are worth scaffolding every time.
- Stripe should be boring: local `stripe listen`, event log dedupe, state-transition log, portal button, checkout helpers, org customer metadata.
- Pusher is the default realtime layer: typed events, private/presence org channels, HMAC-derived channel names, Clerk-backed auth.
- Trigger.dev owns asynchronous work. Webhooks should receive, verify, persist, then enqueue.
- Tests should be scaffolded early: package-scoped Vitest, mocks for Clerk/Stripe/Pusher/Prisma, Playwright browser QA for auth-gated UI.
- The best local dev loop is one command that starts Docker services, Next, Trigger, Stripe webhooks, and logs with labeled output.

## Project-Specific Takeaways

### dealmachine-next

- Best QA pattern: `codex:browser:auth` creates a Clerk sign-in-token session, saves Playwright storage state, captures console errors, and can record video evidence.
- Best Stripe local pattern: domain-specific listener scripts capture `whsec_*` into `.stripe/*-webhook-secret` and delete it on exit.
- Best Clerk/org pattern: webhooks plus idempotent fallback endpoint create Clerk org, DB org, Stripe customer, Clerk metadata, and default org.
- Best Pusher pattern: HMAC-derived private org/user channel names and a provider that handles invalidation, visibility, reconnects, and presence.

### rnd

- Cleanest modern baseline for this factory: npm workspaces, root Next app, `packages/auth`, `packages/billing`, `packages/db`, `packages/jobs`, `packages/realtime`, `packages/cli`, `packages/mcp`, `packages/types`.
- Vercel/Postgres/Prisma and Trigger.dev are documented as defaults.
- `DESIGN.md` is a living design contract, not just visual flavor.

### agentdoc

- Strongest API/CLI/MCP sharing story: Hono/OpenAPI public API, CLI mirrors API capabilities, MCP wraps the same client.
- Strongest LLM-native docs story: `llms.txt`, `skill.md`, `.well-known/agents.json`, raw markdown endpoints, and agent installation pages.
- Good webhook delivery pattern: signed payloads, SSRF-aware dispatch, timeout bounds, retry and disable-after-failures.

### postcardai

- Strong one-command local story: Docker DB plus Next plus Trigger plus Stripe.
- Strong workspace provider pattern: org switching, default org persistence, subscription, credits, feature gates, usage, realtime invalidation.
- Good Trigger pattern: async work is task-first, with locks, retries, bounded concurrency, and realtime events.

### cerebro

- Best non-SaaS operations pattern: plan, run, manifest, artifact, control-plane event.
- Strong LLM engineering style: schemas, prompt versions, dry-run packets, model-call/audit ledgers, deterministic guardrails after model output.
- Good migration discipline: forward-only migrations and explicit confirmation for non-local writes.

## External Landscape

No current starter covers this exact stack.

- [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) is the official Next.js baseline, but not a SaaS runtime.
- [Turborepo examples](https://turborepo.com/docs/getting-started/examples) are good monorepo primitives, not a product starter.
- [shadcn monorepo docs](https://ui.shadcn.com/docs/monorepo) are the best UI/workspace starting point.
- [create-t3-app](https://create.t3.gg/) is excellent, but its defaults do not match Dave's Clerk/Stripe/Trigger/Pusher stack.
- [Clerk organization docs](https://clerk.com/docs/nextjs/guides/organizations/getting-started) confirm the right org primitives and hooks.
- [Clerk hooks reference](https://clerk.com/docs/nextjs/reference/hooks/overview) supports custom auth/settings instead of prebuilt Clerk UI.
- [Stripe CLI docs](https://docs.stripe.com/stripe-cli/use-cli) support local webhook forwarding and `--load-from-webhooks-api`.
- [Stripe customer portal docs](https://docs.stripe.com/customer-management) cover subscription self-service.
- [Trigger.dev Next.js docs](https://trigger.dev/docs/guides/frameworks/nextjs) recommend a combined `dev` script for Next plus Trigger.
- [Pusher Channels docs](https://pusher.com/docs/channels/) and [private channel docs](https://pusher.com/docs/channels/using_channels/private-channels/) match the private/presence channel model.
- [Prisma Postgres on Vercel](https://www.prisma.io/docs/guides/postgres/vercel) documents the Vercel Marketplace/Postgres path.
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) is the right default for MCP servers.

## Decision

Build `create-dave-app` instead of adopting a starter wholesale.

Use external projects as references, but the differentiator is the glue: one coherent starter where auth, billing, realtime, jobs, docs, tests, API, CLI, MCP, and local dev all share the same contracts from day one.

