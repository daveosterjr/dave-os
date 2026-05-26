# Contributing

Thanks for helping make Dave OS better.

This project is opinionated on purpose. Contributions are welcome when they make the starter more useful, more reliable, or easier to understand without watering down the core stack.

## Development

```bash
npm test
npm run verify
node bin/create-dave-app.mjs test-app --target-dir /tmp/test-app
node bin/create-dave-app.mjs --idea "Build a portal for teams to track renewals and trigger reminders" --target-dir /tmp/idea-app
```

`npm run verify` runs the factory tests, generates a temporary app, installs it, typechecks it, lints it, builds it, starts it, and checks the public health route.

## Project Rules

- Keep the generated app bootable.
- Keep route handlers thin.
- Put reusable behavior in `packages/*`.
- Prefer npm workspaces because the reference projects use npm.
- Do not add another framework or service unless it clearly belongs in Dave's default stack.
- Keep docs and template code in sync.
- Tests should catch template regressions, not only CLI regressions.
- Prompt-driven scaffolding should remain deterministic unless an explicit AI provider flag is added.

## Pull Request Checklist

- Explain why the change belongs in the default starter.
- Add or update tests when behavior changes.
- Update `README.md`, `docs/*`, or `CHANGELOG.md` when user-facing behavior changes.
- Run `npm run verify`.
- Include generated-app notes if you changed `templates/next-saas`.

## Good First Contributions

- Improve generated-app docs.
- Add focused template regression tests.
- Fill in package-level README files.
- Add examples for custom auth/settings components.
- Add typed events and sample Trigger tasks.
