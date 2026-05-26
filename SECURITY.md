# Security Policy

## Supported Versions

Dave OS is pre-1.0. Security fixes will target the current `main` branch until release channels exist.

## Reporting A Vulnerability

Please do not open a public issue for a suspected vulnerability.

Email Dave Oster at `security@daveoster.com` or use a private GitHub security advisory once the repository is public.

Include:

- affected version or commit;
- reproduction steps;
- impact;
- any known workaround.

## Starter Security Goals

Generated apps should:

- never commit secrets;
- verify Clerk and Stripe webhooks;
- keep API keys hashed;
- scope all data by organization;
- use private Pusher channels for organization data;
- prefer idempotent webhook and job processing;
- document any placeholder security behavior clearly.

