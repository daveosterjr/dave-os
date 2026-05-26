# Release Process

Dave OS is published as the npm package `create-dave-app` so users can run:

```bash
npm create dave-app@latest my-new-app
```

## Before A Release

1. Run the fast checks:

   ```bash
   npm test
   ```

2. Run the full local generated-app check:

   ```bash
   npm run verify
   ```

3. Run the `Generated App Smoke` workflow from GitHub Actions when the template or package lockfile changed.
4. Update `CHANGELOG.md`.
5. Bump `package.json` with the intended semver version.

## Publishing

The package is designed for npm provenance-compatible publishing. Until the GitHub publish workflow is added, publish manually from a clean `main` checkout:

```bash
npm login
npm publish --provenance
```

## Versioning

- Patch: docs, generator fixes, template bug fixes that do not change the public starter shape.
- Minor: new template capabilities, CLI flags, generated app surfaces, or additive defaults.
- Major: breaking CLI flags, renamed packages, or starter architecture changes that require migration notes.

## Post-Release

After publishing, verify the create command from a temporary directory:

```bash
npm create dave-app@latest smoke-app -- --dry-run
```

Then open a GitHub release with the changelog notes.
