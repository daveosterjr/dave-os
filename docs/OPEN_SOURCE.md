# Open-Source Operating Model

Dave OS should be open-source in the practical sense: easy to inspect, easy to run, easy to fork, and clear about what is finished.

## Positioning

This is an opinionated app factory, not a neutral framework.

Default stack:

- Next.js
- npm workspaces
- Tailwind and shadcn-style components
- Clerk organizations
- Stripe
- Prisma/Postgres
- Trigger.dev
- Pusher
- Hono API
- CLI
- MCP

Alternatives can be documented, but the default template should stay focused.

## Release Standard

A release should satisfy:

- `npm run verify` passes.
- A generated app can run `npm install`.
- The changelog explains what changed.
- Template placeholders are documented.
- New public flags or template features have examples.

## Contribution Labels

Suggested GitHub labels:

- `bug`: broken behavior in the factory or generated app.
- `docs`: documentation-only changes.
- `template`: changes to generated app files.
- `integration`: Clerk, Stripe, Prisma, Trigger, Pusher, API, CLI, or MCP work.
- `good first issue`: constrained, low-risk work.
- `needs decision`: maintainers need to choose a direction.
- `security`: security-relevant hardening.

## Maintainer Biases

- Favor boring reliability over clever scaffolding.
- Favor generated code people can read and edit.
- Favor one strong default over many half-supported options.
- Favor source docs over hidden generator magic.

