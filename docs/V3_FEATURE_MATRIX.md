# Streakin V3 feature matrix

“Implemented” below means the functioning local prototype, not an activated commercial service. Free/Pro selection in Profile is explicitly test access. The real SQLite service is implemented and tested independently; authenticated API routing and production hosting are not connected. The existing Sites prototype has been updated with user authorization. See [current product audit and roadmap](PRODUCT_COMPLETENESS.md) for the latest implementation status.

| Capability | Free | Pro | V3 status |
|---|---|---|---|
| L-Sit foundation | All 5 stages | Same | Implemented; previews, manual advancement and evidence-backed final self-confirmation |
| Handstand Foundations | All 5 stages | Same | Implemented; no paid stage gates |
| Elbow Lever | All 5 stages retained | Same | Track retained; generated full-pose image added, earlier-stage exact art still missing |
| Front Lever specialization | Discoverable stage preview | Instructions, sessions and progression | Implemented, gated in routes and local API; server grant policy tested |
| Planche, Muscle-Up, Advanced Handstand | Future discovery labels | Future tracks | Not yet available; explicitly labelled |
| Essential tutorials | Included | Included | Technique details, requirements, easier/harder variations |
| Preset workouts | 9 | Same | Nine goal-specific programs, all with review, player and completion |
| Workout sessions / hold & rest timers | Unlimited | Unlimited | Existing wall-clock timers retained; review/start, pause, checkpoints, typed results and acknowledged completion |
| Saved custom routines | 1 | No routine-count limit | Builder, order, sets, reps/seconds, rest, edit, delete and completion implemented; practical per-routine validation bounds apply |
| Existing routines after downgrade | Kept and editable | — | No destructive deletion; new Free routine creation blocked at limit |
| History logs | Unlimited | Unlimited | Owner-local, search and period filters; expandable per-set detail |
| Skill progress | Manual | Manual + suggestions | Suggestions use actual logged targets; do not claim technique assessment |
| Streaks | Included | Included | Derived from completed training dates; recovery-aware streaks still outstanding |
| Basic achievements | Included | Included | First session, 10 sessions, 3 active days/week, current 7-day streak; actual activity only |
| Manual schedule | Included | Included | Selected days/time, editable Profile, existing calendar export/reminder retained |
| Personal schedule suggestions | — | Included | Based on chosen weekly frequency; editable; not background notifications |
| Basic progress dashboard | Included | Included | Training days, actual sets/minutes, records per exercise, weekly activity and history |
| Advanced analytics | Preview/explanation | Included | Current/prior week comparisons and per-session per-exercise performance tables; no mixed hold/reps totals |
| Weekly progress report | — | Included in-app | Derived from actual activity; automatic delivery not configured |
| Personalized workout plan | — | Included, rule-based | Shared Home/plan policy: time, equipment, self-report, experience, selected skill/current stage, frequency and last session |
| Adaptive recommendations | — | Rule-based rotation | Repeats latest eligible session with unmet targets; otherwise ranks/rotates. No load escalation or technique assessment. |
| Advanced challenges | — | Future | Not implemented; no fake challenge milestones |
| AI Form Check | Planned 1/calendar month | Planned 5 total/calendar month | Local video preview + validation and quota architecture; analysis disabled, no upload, feedback or quota debit |
| AI max clip duration | 30 seconds | 30 seconds | Browser validation and independent server admission validation; server probe/storage/provider integration remains required |
| Monthly reset / no rollover | 1 total | 5 total, not 6 | Asia/Jakarta calendar periods; real SQLite transactional reservations tested independently |
| Membership comparison | Included | Included | No invented prices, checkout, payment success or subscription activation |
| Paid billing | — | Required for real Pro | Not configured; no commercial entitlements are issued |
| Account/progress synchronization | Where supported | Same | Not connected; local profile isolation and export/restore work; server account adapter is outstanding |
| Google sign-in | — | — | Setup document retained; OAuth client and backend still required |
| Onboarding | Included | Included | 3 skippable steps; editable experience, self-reported plank/push-up baseline, goals, skills, equipment, time and frequency |
| Data migration | Included | Included | V2 storage key retained; old logs remain in backups; seed demo records excluded from actual activity statistics |

| Exercise library | Search, filters, foundation tutorials | Same + specialization tutorials | Dedicated library/detail routes, matching sessions and builder handoff |

## Integration-dependent work

1. Wire verified server authentication, owner-scoped APIs and the selected persistent database to the frontend. Disable browser fetch interception and the local test-tier endpoint in production. The tested server store is not a deployed API.
2. Select billing and pricing; verify provider webhooks server-side before granting real Pro. Neither is invented in V3.
3. Integrate validated video analysis, private upload storage, consent/deletion policy, server media probing, quota admission, asynchronous failure handling and a real feedback history.
4. Add the future specialty tracks and advanced challenges only when their content is ready.
5. Supply missing exact Orange Dude stage poses, and the original SI logo file. No stock photos or substitute exercise art are used.
6. Complete live browser/mobile visual QA when the browser environment works. Responsive CSS and DOM behavior checks do not prove visual layout.
7. Coach review of the new Front Lever content is still recommended before presenting it as validated instruction.
