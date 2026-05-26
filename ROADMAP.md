# Roadmap

Dave OS should become a real, boringly useful app factory. The roadmap is organized by confidence rather than aspiration.

## Now

- Make generated apps install, typecheck, and boot locally.
- Harden the default `next-saas` template.
- Keep docs honest about what is complete and what is placeholder.
- Add tests that generate an app and verify install, typecheck, lint, build, and a served health route.
- Review and pin transitive dependencies so generated apps start from a cleaner `npm audit` baseline.
- Expand prompt-driven scaffolding into richer module and route generation.

## Next

- Port the full Clerk organization sync flow.
- Port the Stripe customer/subscription webhook flow with replay tests.
- Add generated app tests for auth, billing, realtime, jobs, API, CLI, and MCP.
- Add seed data and demo mode.
- Add a `--preset` flag for optional modules.
- Add optional `--ai` provider support for LLM-generated app specs while keeping the deterministic planner as fallback.
- Add upgrade scripts for existing generated apps.

## Later

- Publish `create-dave-app` to npm.
- Add shadcn registry support for Dave UI blocks.
- Add template variants: `agent-native`, `ops-pipeline`, and `marketing-app`.
- Add an MCP server that can create, inspect, and upgrade Dave OS apps.
- Add OpenSSF Scorecard-compatible project hardening.
