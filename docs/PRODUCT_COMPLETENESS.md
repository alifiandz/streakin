# Product completeness audit and delivery

Audit date: 7 November 2026 (Asia/Jakarta). Baseline: `151a82fe4a80f4054233124a4ec7286eb466311c` (published version 10). This inventory is grounded in the conversation available in this task, the uploaded V3 brief (`docs/V3_BRIEF.md`), feature matrix, earlier audit/delivery documents, and active application code. It does not claim access to conversations outside this thread. This document supersedes older “awaiting deployment confirmation” notes: the user selected the current site and authorized ongoing implementation/publication.

## Decisions versus ideas

Confirmed: orange/black identity; Orange Dude only; no substitute poses; Free L-Sit, Handstand and retained Elbow Lever foundations (all stages); unlimited core training/timers/history; one saved Free custom routine, no Pro routine-count limit; Pro specialized tracks and advanced analytics/planning; AI 1/month Free, 5 total/month Pro, no rollover, 30-second clips once operational; no invented prices, payments, feedback or cloud synchronization; preserve existing user data. Google sign-in setup requested, but no OAuth client supplied. Final hosting intent: Jagoan Hosting + Webuzo and `streakin.my.id`; current review deployment remains Sites.

Planche, Muscle-Up and advanced Handstand are confirmed future directions, not defined, available tracks. Video analysis, community/social motivation and advanced coaching are future ideas explicitly outside immediate implementation approval. Challenge rules/rewards, pricing, billing provider, production identity/database deployment and recovery-day streak semantics are not settled implementation details. MyWay was a dashboard reference, not a request to build another product. No fake demo activity is added, even though an earlier message requested samples: later requirements explicitly demand real activity only.

## Complete inventory

Status refers to the running browser-local prototype, not production infrastructure. “Working” requires behavior in active code/tests; inactive Next API files and the independently tested SQLite service do not constitute a deployed backend.

| Feature | Decision | Before this pass | Delivered / remaining |
|---|---|---|---|
| Experience level | Confirmed | Working preference | Retained, part of recommendation eligibility |
| Initial fitness assessment | Newly confirmed in latest request | Missing | Optional plank/push-up self-report; unknown allowed; persisted, editable, validated; no automated technique claim |
| Goals and preferred skills | Confirmed | Working | Retained; used in shared recommendation ranking |
| Equipment | Confirmed | Working; earlier union bug fixed | Full per-exercise union used; custom saved sessions now checked by actual contents too |
| Available time | Confirmed | Not a personalized input | 10/15/20/30/45/60-minute preference; recommendation eligibility respects it |
| Weekly frequency and manual schedule | Confirmed | Working | Retained; schedule editor, time and calendar export available |
| Skip onboarding / edit later | Confirmed | Working | Retained; skipped/legacy profiles receive unknown assessment and 15-minute defaults |
| New/returning Home | Confirmed | Working from real activity | Retained; beginner checklist disappears after actual first completion |
| Personalized starting session | Confirmed | Partial: rotation ignored time/ability | Shared rule engine now checks time, equipment, active stage, experience and self-report; explains choice; no-match explicit |
| L-Sit roadmap | Confirmed Free | 5 stages, criteria, manual advancement, sessions | Retained; final completion now recordable with evidence and self-confirmation |
| Handstand roadmap | Confirmed Free | Same | Same; missing exact stage 1/4 art remains |
| Elbow Lever roadmap | Confirmed Free | 5 stages/text/sessions; no exact artwork | Completion supported; accurate Orange Dude art remains missing for all stages; never substitute another exercise |
| Front Lever | Confirmed Pro specialization | Preview/gate, 5 stages/sessions/text | Retained; original alias `ex6` now gated consistently; content still needs qualified coach review |
| Planche / Muscle-Up / advanced Handstand | Future tracks | Discovery labels only | Not implemented; no fake available lessons |
| Prerequisites and milestones | Confirmed | Working qualitative requirements and named stages | Retained; no automatic stage skipping from assessment or workout numbers |
| Exercise-specific visual demonstration | Confirmed | Partial exact Orange Dude images + external skill references | Existing art retained; missing L-Sit4, Handstand1/4, Elbow1–5, FrontLever4 remain explicit gaps; static image is not a motion demonstration |
| Dedicated exercise library | Confirmed | Missing (builder-only search) | Added `/exercises` and `/exercises/:id`; name/area search, area/type/equipment filters, empty reset |
| Exercise tutorials | Confirmed | Seed instructions, mistakes, variations inside other flows | Dedicated detail pages expose this content; matching sessions and builder handoff connect learning to training |
| Free essential workouts | Confirmed | 3 presets | Retained unchanged; manual training stays available even if recommendations have no match |
| Personalized Pro weekly plan | Confirmed | Rule rotation with duplicated eligibility logic | Shares Home engine; time and self-report now applied; weekly frequency/day suggestions retained |
| Adaptive Pro recommendations | Confirmed | Partial: rotation based on last session | Repeats most recent selected session if logged targets unmet; otherwise offers rotation; does not prescribe load increases, assess fatigue or evaluate form |
| Adaptive periodization / recovery coaching | Planned Pro capability | Missing | P1: requires session effort/recovery feedback and reviewed load policy; current heuristics are not complete adaptive coaching |
| Custom builder | Confirmed | Working order, edit, sets, reps/hold, rest, save/delete | Retained; exercise tutorial can prefill one unsaved item; Free limit still enforced |
| Hold/rest timers, pause | Confirmed | Working wall-clock implementation | Retained and regression tested |
| Session interruption/recovery | Confirmed | Working checkpoint, typed results, paused restore | Retained; active sessions take precedence over new recommendations |
| Completion-to-history/records | Confirmed | Working, idempotent completion | Retained; summary now links directly back to trained skill or Progress |
| Final skill completion | Confirmed latest request | Missing: stage5 remained active forever | Added evidence-backed user confirmation, timestamp, all milestone states, Home/Skills/Progress, reopening and backup persistence |
| Historical activity / records | Confirmed | Working actual per-set metrics, search/period/accordion | Retained; seeded demo records excluded, raw backups preserved |
| Daily streak | Confirmed | Working consecutive completed-day streak | Retained; recovery-day-aware behavior is still missing, not represented as solved |
| Recovery-day streak | Confirmed latest request | Missing | P1: snapshot schedules prospectively, distinguish recovery from activity; never fabricate workouts or rewrite old logs |
| Basic achievements | Confirmed | Working first/10 sessions, active days and streak | Retained, actual data only |
| Advanced challenges | Planned Pro | Missing | P1 after objective/rules/reset/rewards are specified; not fake challenge cards |
| Basic/Pro statistics | Confirmed | Working records, active days, weekly comparisons/per-exercise trend table | Retained; reporting is in-app, not automatically delivered |
| Reminders | Confirmed | In-app reminder and calendar export | Background push/email delivery still not connected; schedule does not imply delivery |
| Free/Pro routine limits | Confirmed | Working local API + independent transactional server tests | Retained, including editing after downgrade; no browser-only enforcement claim for production |
| Upgrade experience | Confirmed | Working comparison/contextual prompts | Retained; no price/checkout invented |
| Real paid Pro | Required production dependency | Missing | P0/P1 launch integration: verified auth + provider/webhooks + server entitlements; test tier remains explicitly local |
| AI quota policy | Confirmed future service | Local architecture + independent server reservations | Unchanged: Free1/Pro5 total/month Asia/Jakarta; no debit while service disabled |
| Video form check | Future, not immediate implementation | Local clip preview/validation only | Planned; no uploads, feedback, scores or fake history |
| Device-local accounts | Prototype implementation | Working registration/login, hashed verifier, separated profiles | Retained, honestly labelled device-local |
| Real authentication / Google | Confirmed requirement | Missing; setup document only | P0 launch blocker: verified identity/session adapter, OAuth client/config, recovery/account management |
| Reliable browser persistence | Confirmed | LocalStorage + checkpoints + backup/restore | Retained; new preferences/completion migrate additively; storage failures tested |
| Cross-device data | Confirmed where supported | Missing | P0 launch blocker: authenticated owner-scoped persistent API, migration/import and conflict handling |
| Production enforcement | Confirmed | SQLite guard implementation tested independently | Not wired to static frontend. Must replace fetch interception/test-tier route, not deploy it as production security |
| Account profile/password/email recovery/delete | Confirmed account management intent; details unspecified | Partial profile/logout/local backup | Production flows still missing; require real identity and data-retention integration |
| Mobile/desktop/accessibility | Confirmed | Responsive CSS; semantic controls/reduced motion; DOM-tested focus trap | New library responsive CSS; full live browser/mobile visual QA blocked by preview environment |
| Logo replacement | Earlier confirmed request | Original source file unavailable in workspace | Still outstanding; no approximation claimed |
| Community/social/coaching | Future brainstorm | Not implemented | P2 only, no implementation in this pass |
| Final domain/hosting | Confirmed destination | Sites prototype only | Webuzo runtime/DB/auth/DNS/SSL deployment still separate; no changes to `streakin.my.id` |

## Broken functionality versus incomplete features

Confirmed defect fixed this pass: older `ex6` Tuck Front Lever entry bypassed the specialization check that only recognized `fl_*` IDs. `isProExercise` now governs the builder, library tutorials, local routine API and workout admission. Existing saved routines are preserved, but a Free user cannot newly start a routine containing a Pro-only movement. Admitted active training remains resumable after downgrade.

Confirmed incomplete journey fixed: no final completed state existed for a five-stage skill. A five-stage label alone never meant completion. Confirmation now requires an actual stage-five record meeting the primary target and explicit technique self-confirmation, then persists without treating it as coach certification.

Confirmed recommendation defects fixed: Home and Pro plan could diverge due separate selection code; available time/ability were absent; custom equipment could be treated as floor-only via seed-ID lookup. One content-based selector now handles all three. If no candidate meets constraints, the UI gives an explicit preference/library action rather than claiming a mismatched session is personalized.

No reproduced crash or broken navigation in affected DOM journeys. This is not evidence that every possible device/browser combination is flawless. Production security/auth/sync are missing capabilities, not disguised functional backend endpoints.

## Prioritized implementation roadmap

| Priority | Connected increment | Dependencies | Acceptance criteria / status |
|---|---|---|---|
| P0-A | Assessment → recommendation → tutorial → session → completion → progress → return | Existing catalogue, local profile API and workout player | Delivered in this pass; tests include actual forms, full final-stage workout, progress and refresh |
| P0-B | Real account and durable training data | Selected identity provider + persistent runtime/DB supported by chosen Webuzo plan; secrets/OAuth configuration | Replace browser fetch shim, verify sessions server-side, owner-scope all records, migrate existing browser data explicitly, backup/restore/conflict handling, test two devices/accounts; NOT connected yet |
| P0-C | Production policy and reliability | P0-B, transactional shared store adapter | Server-owned memberships, routine limits, workout grants/snapshots and completion; disable test tier in production; verify user isolation and failures. Independent SQLite policies already tested, actual hosted API missing |
| P0-D | Content/asset correctness before public training launch | Qualified content review and exact Orange Dude poses | Review foundations/specialization instructions; complete missing poses and original logo; browser/mobile visual and screen-reader QA. Existing art is not fabricated |
| P1-A | Recovery-aware consistency + actionable schedule | Prospective schedule history, timezone policy, optional recovery feedback | Recovery protects rhythm without generating activity/logs; missed scheduled day behaves predictably; schedule changes cannot retroactively mint streaks |
| P1-B | More adaptive training and challenges | P0-A/B, session effort/recovery inputs, reviewed progression/rules | Transparent adjust/repeat/rotate choices, no automatic technique certification or unsafe load escalation; opt-in measurable challenge rules |
| P1-C | Operational commercial Pro | P0-B/C, pricing/provider decision + verified billing webhooks | No frontend tier authority, no paywall mid-admitted-session, downgrade retains data; real provider purchase/cancel/reconcile tests |
| P1-D | Reminder/report delivery | P0-B, notification permission/provider and timezone jobs | Opt-in scheduling, delivery failure/retry/unsubscribe; calendar export remains available |
| P1-E | Specialty expansion | Reviewed per-stage content/prerequisites and precise art | Complete Planche/Muscle-Up/advanced-Handstand journey individually; labels are not working tracks |
| P2-A | Video technique feedback | Separate approval, validated service, private uploads/consent/deletion/media probing, async failure recovery | Real feedback only; server atomic monthly1/5 allowance; no rollover; max30s; failed job quota release |
| P2-B | Community and coaching | Separate approval, P0 identity/data, consent/moderation/privacy and program rules | Define useful social/coaching behavior before implementation; no fake members, scores or activity |

P0-A is intentionally a complete local learning/training journey. It does not remove P0-B/C/D launch blockers. No payment, synchronization, AI or specialty availability is fabricated to make the checklist look complete.

## Verification

Run `npm run typecheck`, `npm run build`, `npm test`, `git diff --check`.

Added tests: migration/validation of optional assessment/time; time + gear + ability eligibility; Pro repeat after unmet actual targets; explicit no-match; legacy Pro alias denial; final-stage evidence/confirmation/idempotency/reopen; backup/restore; assessment forms → Home recommendation → library search/type reset → tutorial → builder handoff; full nine-set final-stage workout → completion → confirmation → Progress → return refresh. Existing Free/Pro workout, timers, checkpoint/recovery, downgrade, routine limits, auth forms, isolation and data failure tests remain.

Test fixtures are isolated in test storage, never seeded into the application. A compiled-bundle DOM harness tests actual event handlers but is not a real rendering browser. Managed browser preview attempt failed with `listen EPERM 127.0.0.1:4173`; preview status stopped. Per Sites guidance, no sandbox/network bypass or substitute browser is used. Mobile/desktop screenshots and visual layout remain unverified.

## Dashboard time selector follow-up

Beranda now exposes “Aku punya … menit” immediately above its recommendation: 5, 10, 15, 20, 30, 45 and 60 minutes. The time-only API updates just this preference, preserving onboarding status, assessment and other settings. Choice persists across refresh and is shared with Profile and Pro planning. An admitted active workout is never replaced by a new time selection.

Five minutes now selects the Free `Core Singkat 5` session: two sets each of Dead Bug and a short Plank, with rest and review guidance for warm-up, cooldown and easier variation. It uses the existing player, draft recovery, real completion logs and statistics. The original three preset programs are retained. Tests cover the selector, 5-minute admission/completion, changing time during a draft, return persistence and invalid durations. Durations remain estimates, not deadlines.
