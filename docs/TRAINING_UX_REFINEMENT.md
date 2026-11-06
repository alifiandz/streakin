# Training-first UX refinement

Applied to the current StreakIn project after the V3 review, preserving accounts, raw training records, custom routines, entitlement rules and the storage schema.

## What changed

- **Home:** one recommended-session workspace with real exercise order/targets, goal, difficulty, equipment and selection reason. Beginner actions show actual onboarding/session/schedule status. The active skill panel shows its own exact stage, target, recorded attempts and next milestone. Empty recent-history lists are omitted rather than repeated. Real weekly consistency and Pro discovery remain secondary.
- **Skills:** two-column progression panels replace large catalogue covers. Five named, clickable milestones show passed/current/future stages without invented mastery percentages. Milestones deep-link to the selected stage; previewing does not mutate progress. A goal illustration is explicitly labelled as the final goal rather than the current stage.
- **Elbow Lever:** the current 87-asset Orange Dude catalogue was checked and contains no elbow-lever pose. The unrelated presenter illustration has been removed from the skill panel and stage placeholder. A clear artwork-status note and actual technique-reference link replace it; no wrong exercise is shown as a substitute. Exact approved artwork is still required.
- **Workouts:** a separate session-card structure highlights training purpose, difficulty, time, set/exercise counts, equipment and exercise previews. Filters work by goal and available equipment and include a reset state. Custom edit/delete/preview actions and interruption handling are retained.
- **Recommendation reliability:** required equipment is the union of all exercises, not an either/or test that could omit elevated support. Home recommendations respect the declared equipment even for saved sessions. A floor-based Free session is the fallback. Manual session selection remains available with explicit missing-equipment information in the review.
- **Consistency:** interface headings, tier explanations, previews and navigation-adjacent labels use Indonesian. Established exercise names and Free/Pro product names are retained. Spacing, type scale, mobile stacking, focus/hover states and reduced-motion behavior remain consistent.
- **Freemium:** foundational tracks stay Free. Front Lever previews and contextual Pro explanations are discoverable in the journey and Home. Free keeps one saved routine and unlimited sessions; Pro testing keeps unlimited saved routines. AI allocation remains 1 Free / 5 total Pro per month, with analysis unavailable until integrated.

## Verification

Type checking and production build pass. `npm test` includes existing account/backup/workout regressions, local entitlement tests, independent SQLite policy tests, actual compiled-app DOM journeys and the equipment metadata regression suite. New assertions cover Home session previews/beginner actions, distinct workout cards, goal/equipment filters/reset, milestone deep links/browser back, no progress mutation from previews, and removal of incorrect Elbow Lever artwork. The existing timer, refresh recovery, custom builder, Free/Pro, active-workout downgrade and completion/history flows remain tested.

Visual mobile/desktop browser QA is still unverified because browser automation previously failed in this environment. Responsive layout rules and DOM tests do not prove visual rendering.

## Still needed

Exact approved Orange Dude art for Elbow Lever and other missing stages; the original SI logo file; real billing, Google sign-in, cloud synchronization and AI analysis integrations. The hosted app remains a device-local prototype with explicit Pro test access. None of those services is simulated as operational.
