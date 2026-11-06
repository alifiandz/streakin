# Streakin V3

A redesigned calisthenics prototype built on the existing React/Vite application. The active V3 branch is `streakin-v3`. The user selected the existing Site for publication, so V3 and subsequent refinements use the current StreakIn URL and preserve its access policy.

## Run and verify

Use Node 24 (or Node 22.13+ for the independent SQLite tests):

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npm test
```

`npm test` runs existing account/data regressions, V3 product API tests, real SQLite server-policy tests, and actual compiled-bundle DOM journeys. Legacy V2-only navigation/baseline scripts are historical and no longer define the V3 UI contract.

## Active architecture

`prototype/main.tsx` boots the application, V3 catalogue and local API adapter. `v3/` contains the new screens, shared product state, centralized tier policy and UI system. `context/WorkoutContext.tsx` retains the existing completed-workout data flow. The original player is enhanced with preparation, admission checks, pause, timer/input checkpoints and recovery. Old duplicate `src/legacy_pages` and inactive Next API files are retained as source history, not used by the Vite runtime.

Five primary destinations: Home, Skills, Workouts, Progress and Profile. History logs, membership comparison, onboarding, reminders and Form Check are secondary destinations. Legacy `/library`, skill and workout links remain supported.

## Honest service boundaries

- The functioning review build uses browser-local profiles and records. Local plan switching is explicitly entitlement testing, not a paid subscription. Local storage is not a secure production billing boundary.
- `v3/server/EntitlementStore.ts` is an independently tested server-side implementation for authoritative tiers, user ownership, atomic routine/quota limits and workout grants. It is not connected to the hosted frontend. See its README before production integration.
- Billing/pricing, Google sign-in, cloud synchronization, private video uploads and a validated AI analysis service are not configured. No checkout success, AI score, technique feedback or commercial entitlement is fabricated.
- AI preview validates supported video types and a maximum 30-second clip locally. Service admission remains disabled. Calendar-month quota design is 1 Free / 5 total Pro, Asia/Jakarta, with no rollover; server tests use transactional reservations.

## Data preservation

V2's `streakin_training_v2` store is preserved and extended additively with product state. No existing profiles/logs are deleted. Old seeded demo logs remain in backups but are excluded from actual-activity metrics. New V3 accounts, including the demo account, start without fabricated sessions.

New exports use `streakin-backup-v2` with routines/preferences/schedules. V1 backups still restore. Use V3 to restore V3 backups. Plans, usage counters and active grants are not imported from a backup. Free limits also apply to import, while already-owned grandfathered routines are preserved after downgrade.

## Imagery

Only the user's Orange Dude assets are displayed. No new stock or real-person photos are included. Existing Front Lever images were compared with the user's corrected catalogue. Missing exact poses are explicitly labelled; the presentation mascot is never claimed to demonstrate a different exercise. The exact new SI logo file remains unavailable in the execution workspace, so it has not been approximated.

## Delivery notes

- `docs/V3_AUDIT.md`: baseline findings and what was retained.
- `docs/V3_DESIGN.md`: design and UX changes.
- `docs/V3_FEATURE_MATRIX.md`: complete Free/Pro matrix and integration dependencies.
- `docs/V3_QA.md`: tested flows and verification limits.
- `docs/V3_DEPLOYMENT.md`: confirmation required before replacing V2 or creating a separate private preview.

Final hosting remains Jagoan Hosting/Webuzo at streakin.my.id. No DNS or production hosting changes have been made.

## Latest training-first refinement
Home now previews actual exercise targets, recommendation reasons, required equipment, beginner actions and the active skill milestone. Skills use compact progression panels with clickable stage previews rather than catalogue covers. Workout cards use purpose, difficulty, duration, sets, equipment and exercise-order previews, with goal/equipment filtering. Equipment is derived from every exercise; recommended sessions no longer assume an unlisted support is available. Exact Elbow Lever art is still absent from the supplied library; misleading presenter/other-pose images are not used for that skill.

The current interface uses Indonesian labels while retaining established exercise and tier names. See docs/TRAINING_UX_REFINEMENT.md for implementation and testing notes.
