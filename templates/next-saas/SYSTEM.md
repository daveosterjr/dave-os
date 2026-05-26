# __APP_TITLE__ System

## What This App Is

__APP_DESCRIPTION__

## Operating Principles

- Organization-first SaaS.
- Users authenticate through Clerk.
- The local database stores app users, organizations, memberships, billing state, API keys, webhooks, and job state.
- API, CLI, MCP, jobs, and web routes share package contracts.
- Agent-facing docs are part of the product surface.

## Core Workflows

1. User signs up with a custom Clerk flow.
2. App ensures the user belongs to an organization.
3. Organization gets a local DB row and Stripe customer.
4. Billing and entitlement state syncs from Stripe webhooks.
5. Product workflows enqueue Trigger.dev tasks.
6. Trigger tasks emit typed Pusher events.
7. Public API, CLI, and MCP expose the same capabilities.

