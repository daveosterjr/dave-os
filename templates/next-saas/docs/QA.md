# Browser QA

Use this for auth-gated UI, settings, onboarding, billing, and workflow changes.

## One-Time Setup

```bash
npm run codex:browser:install
```

Set either:

```bash
CLERK_TEST_USER_ID=user_...
```

or:

```bash
CLERK_TEST_EMAIL=qa@example.com
```

## Authenticated Check

```bash
npm run codex:browser:auth -- --base-url http://localhost:3000 --path /app
```

Optional video:

```bash
npm run codex:browser:auth -- --base-url http://localhost:3000 --path /settings --record-video
```

Storage state is written to `artifacts/codex-browser/storage-state.json`.

