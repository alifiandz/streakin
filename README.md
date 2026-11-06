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


## Illustrated library revision
Landing page now has an illustrated hero, skill exploration, technique narrative, interactive timer preview, smooth section navigation and final signup action. Library opens on skill posters; stage instructions appear only after opening a skill. Foundation programmes have their own detail pages. Library and roadmap browsing are public within the existing Sites access policy. Authenticated training state is unchanged.

New route-tree tests exercise actual React links and buttons across the library, all skill roadmaps, foundation programmes, home, complete nine-set workout, summary, history, reminder settings and public signup journey. These are component interaction tests, not a claim of completed browser visual/device QA. Browser input remains unavailable in this environment.

Art: original Orange Guy library plus a newly generated eight-pose atlas. Atlas support poses are mapped explicitly by skill and stage. Image failure state now resets when the source changes. Route-level errors retain navigation instead of trapping the entire app behind the root fallback.
