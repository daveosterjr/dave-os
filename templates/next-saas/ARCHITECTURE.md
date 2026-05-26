# __APP_TITLE__ Architecture

## Shape

```text
app/                 Next.js app routes
components/          Local UI, auth, and settings components
context/             Client providers
lib/                 App-local utilities
packages/auth        Clerk, bearer auth, permissions
packages/billing     Stripe plans, checkout, portal, webhooks
packages/db          Prisma client and query helpers
packages/realtime    Pusher channels and typed events
packages/jobs        Trigger payloads and run helpers
packages/api         Hono public API
packages/cli         CLI over API/contracts
packages/mcp         MCP tools over API/contracts
packages/shared      Zod contracts and shared utilities
packages/types       Shared TypeScript types
trigger/             Trigger.dev task entrypoints
```

## Transport Rule

Every important capability should have a service function first. Then expose it through whichever transport is needed:

- Next route handler
- Hono public API
- CLI command
- MCP tool
- Trigger task

Do not reimplement business logic in a route.

