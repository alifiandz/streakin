# StreakIn — Vercel interface baseline

The friend's repository at the commit in ORIGINAL_SOURCE.txt is the visual baseline. The original header, colors, typography, global styles and card classes are retained. Targeted refinements add a landing-page hero and skill previews, an always-visible dashboard overview, and a skill-first Library with movement search and supporting sessions. No generated pose atlas is used.

## Verification
- npm run build
- npx tsc --noEmit
- node tests/training.mjs
- node tests/production-dom.mjs
- node tests/production-dom.mjs corrupt blocked-scroll
- node tests/ui.mjs navigation
- node tests/vercel-baseline.mjs (requires the original checkout used during authoring)

Production DOM tests run the actual compiled JavaScript with DOM navigation and click events, save a library, complete nine logged sets, check the completion screen and persisted history. Malformed saved progress and unavailable scroll APIs are regression cases. This is not a claim of completed live-browser visual testing.

## Data and scope
Profiles and training records are device-local. Password verifiers use PBKDF2; no email password recovery or cloud sync. Backup/restore and calendar export are available in reminder settings. Local profile separation is not a security boundary against someone with device access.

## Movement media
Matching Orange Guy images are displayed alongside real, source-linked Hybrid Calisthenics photos for straddle and full elbow lever. The external photos remain hosted by their source and may become unavailable. Stages without matching media link to actual demonstration references from GMB Fitness or Hybrid Calisthenics. They are labelled as references, not represented as exact custom stage artwork. Missing poses are not generated or substituted with unrelated movements.

## Final hosting target
Jagoan Hosting + Webuzo, streakin.my.id. No production hosting or DNS changes have been made.

Google sign-in preparation: [setup and acceptance checks](GOOGLE_SIGN_IN_SETUP.md). This is a final-hosting integration plan; Google login is not enabled in the device-local prototype.

## Refinement coverage
- Landing: hero, browse-to-skill scroll, three skill previews, explanatory training flow, existing feature/session sections.
- Beranda: actual saved-session and completed-workout totals, current streak, last seven days, recent sessions, reminders, skill selection before setup and the existing daily training view afterward.
- Library: skill boxes first; all five stages remain inside each skill. Searchable movement cards include technique details; supporting sessions retain duration/focus filtering and selection. Saving a skill adds only its active stage.
- Media gaps still unresolved: L-Sit straddle; Handstand wall walk and kick-up; Elbow Lever stages 1–3. These show a demonstration source rather than a fabricated pose. Complete custom stage imagery is not claimed.
- Google: setup specification prepared, no OAuth client or working provider yet. Production data remains device-local until a backend is implemented.
