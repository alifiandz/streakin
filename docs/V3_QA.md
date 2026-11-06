# V3 verification report

## Passed

- `npm run typecheck`: TypeScript, including all V3 pages, product state, catalogue and server store.
- `npm run build`: production Vite bundle.
- `npm test`: the four suites below.

### Existing account/data regressions
Registration/login with PBKDF2 verifiers, wrong-password handling, separate profiles, Library persistence, stage bounds, validated full-set completion, completion idempotency, local dates, failed storage writes, backup/restore and logout. V3 no longer seeds fabricated demo activity and does not delete existing personal records.

### V3 local API policy
All five L-Sit and Handstand stages remain Free; Free saves one routine and can edit it; a forged plan field does not permit a second routine; Pro test mode creates more routines. Specialized starts are denied in Free, and an admitted Pro session finishes after downgrade. Completion retries remain idempotent. Cross-profile routine IDs are rejected. Backup v2 preserves routines/preferences without importing privileges or quota state; backup import cannot bypass Free count limits. A valid AI request returns unavailable without consuming quota, and a 31-second clip is rejected.

### Independent server SQLite policy
Real SQLite transactions verify authoritative tiers, denied unauthorized membership changes, per-user routine ownership, count limits, workout grants, immutable session snapshots, user-scoped logs and idempotent completion after downgrade. AI admission enforces one Free/five total Pro reservations, idempotency, no rollover into the next month, 30-second maximum, supported type validation, release after failed jobs and zero usage while the service is disabled. Tests do not constitute a deployed authenticated API or a concurrent load test.

### Actual compiled JavaScript in JSDOM
- Real registration and login forms, deep-link preservation through onboarding and return to the selected workout.
- Three-step onboarding and explicit skip; preferences persist.
- Free roadmap discovery, fifth-stage preview without Pro gating, review/start, logging a complete nine-set L-Sit session and saving results.
- Rest countdown actually decreases over elapsed time; hold stopwatch advances, pauses and checkpoints; starting a hold stops rest; reset clears elapsed hold. These tests exercise real timer intervals inside JSDOM, not a screenshot or device browser.
- Refresh preserves the unfinished workout, typed result and elapsed hold; restored sessions open paused. Entered actual results remain authoritative.
- Completion clears the checkpoint only after saving; actual records and achievements appear in Progress.
- Free routine builder/count gate; Pro test selection; Front Lever access; pause keyboard focus trapping.
- A Pro workout interrupted by navigation and a Free switch resumes without an active-workout paywall and finishes successfully.
- Pro custom routine reorder, sets/hold/rest configuration (including zero rest), session completion and advanced analytics.
- History search, reset, expandable details that stay closed, browser back, legacy Library redirect and refresh persistence.
- AI coming-soon state, five-total Pro allocation, no fabricated results; local Orange Dude image paths and valid internal link structure.

## Explicit verification limits

Cloud browser access returned “Browser Use could not read requirements.” No live browser screenshots, visual comparisons, real mobile viewport overflow checks, device haptics/audio checks or end-to-end real video uploads/analysis were performed. Responsive CSS, DOM checks and keyboard focus tests are not a substitute for those checks.

No billing transaction, real subscription, Google sign-in, multi-device cloud sync or AI model call is implemented or claimed as tested. The hosted V2 remains unchanged; the independent server adapter is not wired to the static prototype.

## Known issues / dependencies

- Production authentication, API routing and persistent user storage must be connected before local test entitlements become production security. The browser-local adapter is intentionally editable by someone controlling their device.
- Exact Orange Dude art is missing for L-Sit stage 4, Handstand stages 1/4, all five Elbow Lever stages, and Front Lever stage 4. Missing figures are labelled and never replaced with a different exercise or a stock photo.
- The original SI logo PNG has not reached the execution workspace, so the prior brand mark remains.
- New Front Lever instructional content needs coach review before being described as validated training content.
- Future specialized tracks and advanced challenges are explicitly unavailable. Automatic report delivery and push notifications are not configured.
- Browser storage failure/corruption or device loss still requires an exported backup; the prototype does not provide cloud recovery. Raw records and old sample data are retained in backup storage, while old seeded sample IDs are excluded from actual-activity metrics.
