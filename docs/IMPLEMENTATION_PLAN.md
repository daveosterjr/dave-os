# Implementation Plan

## Phase 0 - Factory MVP

Status: current pass.

- `create-dave-app` CLI copies `templates/next-saas`.
- Token replacement for app name, slug, npm scope, and title.
- Prompt-driven scaffolding creates a product brief, build plan, LLM handoff prompt, and `.dave-os/brief.json`.
- Dry-run mode and overwrite protection.
- Starter repo has docs, package boundaries, local scripts, schema, and custom UI skeletons.

## Phase 1 - Runtime Hardening

- Run a generated app through `npm install`, `npm run typecheck`, `npm test`.
- Review `npm audit` output from the generated app and pin or replace dependencies where practical.
- Fix package references until the starter boots.
- Add seed script for demo user/org/API key records.
- Add real Stripe checkout and portal routes.
- Add real Clerk webhook sync tests.
- Add real Pusher channel auth tests.
- Add real Trigger sample task and status event.

## Phase 2 - Golden Systems

- Port the DealMachine browser QA script completely.
- Port the Stripe listener secret-file pattern and event replay scripts.
- Port org provisioning: Clerk org, DB org, Stripe customer, Clerk metadata, default org.
- Port API key/device auth/OAuth patterns from AgentDoc and RND.
- Add Hono OpenAPI generation and CLI type generation.
- Add MCP stdio and HTTP modes.

## Phase 3 - Template Variants

- `next-saas`: default product starter.
- `agent-native`: heavier API/CLI/MCP/docs starter.
- `ops-pipeline`: Cerebro-style plan/run/manifest starter.
- `marketing-app`: product site plus app shell.
- `prompt-first`: richer natural-language planning with optional model-provider integration.

## Phase 4 - Distribution

- Publish as private npm package or GitHub template.
- Add `npm create dave-app@latest` workflow.
- Add a shadcn registry for Dave UI blocks.
- Add an MCP tool that can generate or upgrade apps.
