# API, CLI, And MCP

The app exposes automation through three surfaces:

- Public API under `/api/v1`.
- CLI in `packages/cli`.
- MCP server in `packages/mcp`.

All three should share:

- Zod contracts from `packages/shared`.
- Types from `packages/types`.
- Auth/scopes from `packages/auth`.
- Service functions from domain packages.

## Rule

If you add a public capability, add it once to the service/contract layer first. Then wire the transports.

