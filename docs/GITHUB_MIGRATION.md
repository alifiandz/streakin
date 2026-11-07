# StreakIn GitHub migration

This repository contains StreakIn only. Kept is a separate project.

## Source provenance

Imported from the current StreakIn Sites source repository, main commit
`324172922c19d6861dc942e0265ea6f795a03920` (landing redesign).
The older October `streakin-site/source` Next.js snapshot is not the active app.
The active app is React + Vite, booted by `prototype/main.tsx`, with `v3/` screens.

## Verify and build

Use Node 24, then `npm ci --ignore-scripts`, `npm run typecheck`,
`npm run build`, and `npm test`. Static hosting files are generated in `dist/`.
GitHub Actions runs these checks and retains a static build artifact.

## Deployment boundary

Production is https://streakin.my.id on Jagoan Hosting / Webuzo.
The existing process uploads release ZIPs to `/home/streakinweb/streakin-release`.
GitHub does not currently deploy to Webuzo. CI produces a downloadable build;
no production credentials, DNS changes, or automatic production deployment
are configured by this migration. Preserve server-side auth-config.json when
applying partial frontend updates. Review the generated config before a full
release; do not overwrite live settings with test or placeholder values.

The `.openai/hosting.json` identity belongs to the existing Sites prototype.
Keeping it does not establish GitHub-to-Sites automatic deployment.

## Credentials

Environment files, private keys and local artifacts are ignored. The tracked
browser authentication configuration contains only the public service URL and
publishable key; these are sent to browsers by design. Never add Google client
secrets, service-role keys, SSH keys, Webuzo passwords or personal access tokens.
Test-only rejected secret strings in auth tests are fixtures, not credentials.

Local verification on 2026-11-07 passed type checking, production build and the
full existing test suite. Live OAuth consent and a Webuzo release were not
performed as part of this source migration.
