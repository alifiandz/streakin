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
Only the user’s local Orange Guy artwork may be displayed. External photos have been removed from all routes. Elbow Lever uses the labelled presentation mascot as its cover; it is not passed off as an elbow lever pose. Stages without matching media link to actual demonstration references from GMB Fitness or Hybrid Calisthenics. They are labelled as references, not represented as exact custom stage artwork. Missing poses are not generated or substituted with unrelated movements.

## Final hosting target
Jagoan Hosting + Webuzo, streakin.my.id. No production hosting or DNS changes have been made.

Google sign-in preparation: [setup and acceptance checks](GOOGLE_SIGN_IN_SETUP.md). This is a final-hosting integration plan; Google login is not enabled in the device-local prototype.

## Refinement coverage
- Landing: original centered text hero restored; lower sections use Orange Guy skill previews, a visual training path, a working 10/15/20-minute session preview, a clearly labelled sample activity tracker, FAQs, and final registration action.
- Beranda: actual saved-session and completed-workout totals, current streak, last seven days, recent sessions, reminders, skill selection before setup and the existing daily training view afterward.
- Library: skill boxes first; all five stages remain inside each skill. Searchable movement cards include technique details; supporting sessions retain duration/focus filtering and selection. Saving a skill adds only its active stage.
- Media gaps still unresolved: L-Sit straddle; Handstand wall walk and kick-up; all Elbow Lever stages. These show a demonstration source rather than a fabricated pose. Complete custom stage imagery is not claimed.
- Google: setup specification prepared, no OAuth client or working provider yet. Production data remains device-local until a backend is implemented.

## Brand and imagery policy
Use only the user's Orange Guy images for all app illustrations. Do not add photos, stock art, alternate characters or generated substitute poses. The uploaded StreakIn SI logo is the approved brand replacement; at this revision its image bytes have not reached the execution workspace, so the existing brand mark is retained pending the actual file. Do not trace or approximate it.

Lower-section references: the user-supplied Claud composition (playful stickers and character-led sections), https://en.duolingo.com/ (mascot-led explanations), and https://www.headspace.com/app (clear product sections and focused actions). Reference graphics and claims are not reused.

## Dashboard and history refinements
The original landing badge is content-width and centered. Ambient shapes and Orange Guy presentation poses move gently; prefers-reduced-motion disables the animations.

Beranda places the next session first, followed by four training metrics, a seven-day minutes chart, current skill stages, recent sessions and saved workouts. Riwayat adds a 28-day activity calendar, focus distribution, date-range and text filters, and native expandable per-set records.

Only the explicit Rizky demo account (`usr_demo_1`) receives illustrative sample data: 12 sessions spanning 25 days, a populated Library and sample skill progress. A version marker prevents repeated seeding. Existing demo logs/library/progress are preserved when present; personal profiles never receive samples. Both screens label demo content clearly. These are device-local prototype records.

Verified through type checking, production build, account/API tests, route interaction tests and compiled-bundle DOM tests, including existing-empty-demo migration, no duplicate seeding, personal-account isolation, history filters and accordion closing. Live browser visual QA remains unavailable in this environment.
