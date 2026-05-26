# Dave OS

[![CI](https://github.com/daveosterjr/dave-os/actions/workflows/ci.yml/badge.svg)](https://github.com/daveosterjr/dave-os/actions/workflows/ci.yml)

Open-source app factory for Dave-style SaaS projects.

Dave OS is a `create-react-app`-style wrapper for the modern app stack Dave keeps rebuilding. The goal is not another generic SaaS boilerplate. The goal is one opinionated, inspectable, forkable starter where auth, billing, realtime, jobs, docs, tests, API, CLI, MCP, and local dev all start with the same shape.

- Next.js App Router, Tailwind, shadcn-style components
- npm workspaces plus Turbo
- Clerk auth with organizations, local shadow users/orgs, and custom auth/settings UI
- Stripe subscriptions, customer portal, idempotent webhooks, and local Stripe CLI forwarding
- Prisma/Postgres, Vercel-friendly deploy posture, Docker local services
- Trigger.dev for background work
- Pusher for org-scoped realtime
- Public API, CLI, and MCP sharing one service/contract layer
- Agent-first docs, QA scripts, tests, and repeatable local dev

## Try The Factory

```bash
npm test
npm run verify
npm run factory:dry
node bin/create-dave-app.mjs my-new-app --target-dir /tmp/my-new-app --git
```

The first implementation is intentionally an MVP generator. It creates the right project shape and stubs the recurring systems so we can harden each subsystem once, then reuse it everywhere.

By default, generated apps get `.env.local` copied from `.env.example`. Add `--install` to run `npm install`, `--git` to initialize a git repo on `main`, or `--no-env` when you want to create the env file yourself.

## Prompt-Driven Scaffolding

You can also start from a product idea:

```bash
node bin/create-dave-app.mjs --idea "Build a B2B app for property managers to import maintenance requests, classify urgent work with AI, notify vendors in realtime, and bill teams monthly."
```

That command infers the project identity, generates the app, and writes:

- `PROJECT_BRIEF.md`
- `docs/BUILD_PLAN.md`
- `docs/LLM_SCAFFOLD_PROMPT.md`
- `.dave-os/brief.json`

For a named app:

```bash
node bin/create-dave-app.mjs VendorDesk --idea "A vendor operations portal with Stripe billing, Trigger jobs, and MCP tools."
```

For a long prompt file:

```bash
node bin/create-dave-app.mjs --prompt-file ./idea.md
```

## Install

For local development:

```bash
git clone https://github.com/daveosterjr/dave-os.git
cd dave-os
npm test
```

Once published:

```bash
npm create dave-app@latest my-new-app
npm create dave-app@latest my-new-app -- --idea "A vendor portal with realtime job status and Stripe billing" --git --install
```

Until then, run the checked-in CLI directly:

```bash
node bin/create-dave-app.mjs my-new-app
node bin/create-dave-app.mjs my-new-app --idea "A customer portal with subscriptions, MCP tools, and background sync jobs" --git
```

## Docs

- [Research synthesis](./docs/RESEARCH.md)
- [Blueprint](./docs/BLUEPRINT.md)
- [Implementation plan](./docs/IMPLEMENTATION_PLAN.md)
- [Open-source operating model](./docs/OPEN_SOURCE.md)
- [Release process](./docs/RELEASES.md)
- [Roadmap](./ROADMAP.md)
- [Changelog](./CHANGELOG.md)

## Current Template

`templates/next-saas` is the default starter. It favors the pattern that showed up most cleanly in `rnd`, `agentdoc`, `postcardai`, and `dealmachine-next`:

- Root Next app for speed.
- `packages/*` for real domain boundaries.
- Hono API, CLI, MCP, Trigger jobs, Pusher, Stripe, Clerk, Prisma all wired as first-class package surfaces.

## Contributing

Dave OS is meant to be built in public. Start with [CONTRIBUTING.md](./CONTRIBUTING.md), then pick an issue labeled `good first issue`, `template`, `docs`, or `integration`.

Please keep contributions aligned with the core rule: implement capabilities once in shared package code, then expose them through thin app/API/CLI/MCP/job surfaces.

Default CI runs the fast generator test suite. The heavier generated-app smoke workflow is available in GitHub Actions as `Generated App Smoke` and runs `npm run test:generated`.

## License

MIT. See [LICENSE](./LICENSE).
