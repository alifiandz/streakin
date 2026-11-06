# V3 audit, before implementation

Baseline: ef305a7c77fccf4ff4cfe9e42fe84deb42981d41 (live V2, version 8).
Scope inspected: all active routes, both contexts, fetch interception and data sanitizer, workout player, timers, summaries, image fallbacks, seeds, backup/restore, reminder/calendar exports, navigation and test harnesses. The unused `src/legacy_pages`, duplicate src contexts and inactive Next API files do not run in the Vite build.

| Area | Verified state | V3 action |
|---|---|---|
| Local accounts | Functional PBKDF2 verifiers and separated local profiles; not cloud authentication | Keep existing records, state local-only limits clearly |
| Navigation | Functional, but Library mixes skill browsing and workout selection; no Profile | Five destinations: Home, Skills, Workouts, Progress, Profile; preserve legacy URLs |
| Skills | 3 tracks, 5 stages each, working selection and manual advancement; several exact poses missing | Foundation tracks remain fully Free; add genuine Front Lever specialization with consistent previews/gates |
| Workouts | Nine-set journey saves only after acknowledgment; deduplicates completion | Add review screen, custom routines, entitlement-aware session resolution |
| Timer | Wall-clock hold/rest timing and pause work in source; timer checkpoint not restored on reload | Persist timer/draft checkpoints and retain interrupted sessions |
| History | Functional search, period filters, detail accordion and actual set grouping | Integrate meaningful records/achievements and weekly report without mixing reps and hold seconds |
| Demo | Historical samples are explicitly labelled but contaminate aggregate metrics | Stop automatic seeding; exclude archived seed samples from progress metrics; preserve raw backups |
| Free/Pro | Missing | Central policy, routine-count limits, specialized-track access, explicit local test tiers |
| Billing | No processor or pricing configured | Comparison + explanation only; no fake checkout or subscription success |
| AI Form Check | No validated analysis service | Disabled-service workflow, 30-second validation, calendar-month quota architecture; no fake results or quota consumption |
| Onboarding/preferences | Missing | Short skippable flow, equipment/goals/frequency, editable Profile |
| Cloud/security | Static site intercepts /api in the browser; original Next API files are inactive | Prototype limits must be labelled. Provide server-side entitlement/quota guard implementation and tests; hosting/auth/database integration remains required |
| Branding | Orange Guy images only; supplied SI logo bytes still unavailable | Retain image policy and existing mark rather than invent logo artwork |

Baseline checks: account/data API tests, complete compiled-bundle DOM navigation → skill → save Library → nine logged sets → finish → persisted history, all 15 stage panels, demo isolation, history filtering and accordion behavior passed before changes. Source audit confirmed every active route; timer timestamps inspected in source. No live screenshot or mobile visual claims: cloud browser returned “Browser Use could not read requirements.” Native Sites logs contained no recent worker errors. Static-host logs cannot reveal browser exceptions.

Deployment constraint: user explicitly requires confirmation of the intended workflow before overwriting live V2. Work is on `streakin-v3`; no live replacement is authorized by this brief alone.
