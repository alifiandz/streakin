# StreakIn training app — Sites edition

Preserves the friend's current interface and original source reference in ORIGINAL_SOURCE.txt.

Implemented training functions: device-local profiles with PBKDF2 password verifiers, persisted library, gated skill progression, actual reps/hold entry, validated complete sessions, timestamp-based timers, resumable set records, idempotent completion, local calendar-date streaks, separate rep totals, history, backup/restore, open-app reminders and calendar (.ics) export. Added a basic Legs template. Incorrect pose mappings have been removed or corrected; missing approved illustrations show neutral fallback labels.

## Verification
npm run build
npx tsc --noEmit
node tests/training.mjs

## Limits
Data and profile login are device-local, not server authentication. Local profile isolation is an app convenience, not a security boundary against someone with device/browser access. No email recovery, automatic cloud sync, background push delivery, or deployed Jagoan backend. Browser preview QA is blocked by unavailable relay/desktop automation. Some movements still need approved illustrations. This release is not claimed to be flawless or production-complete.

Production target: Jagoan Hosting + Webuzo, streakin.my.id. A real database/auth deployment and device browser verification remain required for production release.
