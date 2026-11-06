# StreakIn — Vercel interface baseline

The friend's repository at the commit in ORIGINAL_SOURCE.txt is the visual baseline. Landing, dashboard, skill catalogue, header and global styles are copied exactly. Other changes are limited to runtime/data fixes and reference media links. No editorial redesign or generated pose atlas is used.

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
Only existing matching Orange Guy images are displayed. Unmatched stages link to actual demonstration references from GMB Fitness or Hybrid Calisthenics. They are labelled as references, not represented as exact custom stage artwork. Missing poses are not generated or substituted with unrelated movements.

## Final hosting target
Jagoan Hosting + Webuzo, streakin.my.id. No production hosting or DNS changes have been made.
