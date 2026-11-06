# STREAKIN V3 — Complete Redesign, UX Overhaul & Freemium Implementation

**Current prototype:** https://streakin-prototype-v2.smalhi2025.chatgpt.site/#/

You are acting as a senior product designer, UI/UX specialist, and full-stack engineer.

Your mission is to transform the existing Streakin prototype into a polished, modern, functional calisthenics training platform.

**This is not a minor redesign.** The current prototype is not yet at the quality level we want. Critically evaluate the existing implementation, retain what genuinely works, and significantly improve everything else.

Do not simply add features on top of a weak interface.

## PHASE 1 — Audit the Existing Prototype

Before making changes:

1. Inspect the complete existing codebase and deployed prototype, where accessible.
2. Explore every page, navigation element, button, workout, skill roadmap, timer, and progress feature.
3. Identify poor UI/UX decisions, inconsistent styling, confusing interactions, broken functionality, and unnecessary complexity.
4. Trace the complete user journey from first visit to completing a workout and tracking progress.
5. Determine which existing features are functional, partially functional, or merely visual.
6. Preserve useful functionality and existing user data.

Do not assume a feature works simply because it appears in the interface.

## PHASE 2 — Redesign the Entire Experience

Streakin should feel like a real, premium-quality fitness application, not a generic AI-generated dashboard.

### Visual direction

- Brand: Streakin
- Identity: Orange Dude mascot
- Primary colors: energetic orange, near-black, white, and subtle neutral surfaces
- Style: modern, athletic, confident, minimal, and youthful
- Excellent typography, spacing, hierarchy, and visual consistency
- High-quality exercise imagery and movement demonstrations
- Subtle microinteractions and purposeful animation
- Fully responsive mobile and desktop layouts

Avoid:

- Excessive gradients and glowing effects
- Generic dashboard cards everywhere
- Random decorative elements
- Overcrowded screens
- Unnecessary emojis
- Fake statistics and meaningless progress indicators
- Huge empty sections
- Inconsistent buttons, typography, and spacing

The app should look intentionally designed, not assembled from generic components.

### Navigation

Create a simple, intuitive information architecture.

Suggested main destinations:

1. Home
2. Skills
3. Workouts
4. Progress
5. Profile

Use an appropriate mobile bottom navigation and desktop navigation.

Only add secondary destinations if they genuinely improve usability.

## PHASE 3 — Implement the Freemium System

Streakin has two membership tiers:

**STREAKIN FREE — Learn, Train, Stay Consistent.**

**STREAKIN PRO — Master Advanced Skills, Train Smarter.**

Implement a consistent entitlement system throughout the application.

### Free features

- Foundational skill roadmaps, including L-Sit and Handstand Foundations
- All stages within the available foundational tracks
- Essential exercise tutorials
- 3 preset workout programs
- Unlimited workout sessions
- Unlimited workout timers
- 1 saved custom workout routine
- Basic workout history with unlimited logs
- Manual skill progress tracking
- Daily streaks
- Basic achievements
- Manual workout scheduling
- Basic progress dashboard
- 1 AI Form Check analysis per calendar month, once the feature is genuinely operational
- Account and progress synchronization, where supported

### Pro features

Everything in Free, plus:

- Specialized skill roadmaps such as Front Lever
- Future specialized tracks: Planche, Muscle-Up, and Advanced Handstand
- Detailed advanced technique tutorials
- Unlimited custom workout routines
- Personalized workout plans
- Adaptive workout recommendations
- Smart skill progression suggestions
- Advanced workout analytics
- Detailed consistency and performance trends
- Weekly progress reports
- Personalized training schedules
- Advanced challenges
- 5 total AI Form Check analyses per calendar month, once operational

### Important freemium rules

1. Never lock essential workout functionality behind Pro.
2. Basic skill tracks must be fully usable without payment.
3. Specialized skills should be discoverable by Free users, with previews and clearly identified premium content.
4. Show premium prompts only when contextually relevant.
5. Never interrupt an active workout with a paywall.
6. Free users can save one custom routine; Pro users have no routine-count limit.
7. AI usage resets monthly, does not roll over, and Pro has 5 total analyses, not 5 additional ones.
8. AI Form Check accepts a maximum 30-second video when implemented.
9. Subscription pricing has not been decided. Do not invent prices.
10. Never simulate payment success, subscriptions, or AI analysis results as if they are real.

Build a polished membership comparison and upgrade experience. If actual billing is not configured, clearly separate the preview/entitlement testing system from real subscriptions.

## PHASE 4 — Rebuild the Core Product Experience

### A. Home Dashboard

Create a personalized training home that immediately answers:

- What should I train today?
- What skill am I currently working toward?
- How consistent have I been?
- What should I do next?

Include meaningful features such as today's workout, current skill, streak, recent activity, and a clear primary action.

Avoid a cluttered collection of unrelated statistics.

### B. Skill Roadmaps

Make progression the central experience.

Every skill should clearly display:

- Skill description
- Difficulty
- Prerequisites
- Progression stages
- Exercise demonstrations
- Training instructions
- Completion requirements
- Current progress
- Next recommended action

Use a visually engaging progression system that communicates advancement clearly.

Ensure workout content always corresponds to the selected stage.

Free and Pro restrictions must be consistent across skill pages and workouts.

### C. Workout Experience

Redesign the entire training flow.

Users should be able to:

1. Choose a workout.
2. Review exercises and requirements.
3. Start a session.
4. Follow exercise instructions.
5. Use hold and rest timers.
6. Mark sets as completed.
7. Pause, resume, or exit.
8. Finish the session.
9. Review their results.
10. Save progress automatically.

The workout player should be one of the most polished parts of Streakin.

### D. Custom Workout Builder

Allow users to select exercises, arrange their order, and configure sets, repetitions, hold durations, and rest periods.

Enforce Free/Pro saved-routine limits correctly.

### E. Progress and Streaks

Build a meaningful progression system with:

- Workout history
- Skill progression
- Training streaks
- Personal records
- Workout consistency
- Achievement milestones

For Pro, add advanced analytics and useful performance insights.

Statistics must be derived from actual completed activity, not hardcoded or fabricated.

### F. AI Form Check

Design the complete user experience:

- Upload video
- Select exercise
- Review requirements
- Check remaining monthly allowance
- Submit for analysis
- Review technique feedback
- View analysis history

Only provide real AI analysis when a working, validated analysis service exists.

If no working service is available, implement the interface and quota architecture, clearly label the feature as coming soon, and explain what integration remains necessary.

Never display invented technique scores or feedback.

## PHASE 5 — Improve Onboarding

Create a short onboarding flow that gathers:

- Current fitness experience
- Training goals
- Skills of interest
- Available equipment
- Preferred training frequency

Use this information to personalize the initial experience where possible.

Allow users to skip onboarding and edit preferences later.

Do not overwhelm new users with unnecessary questions.

## PHASE 6 — Technical Reliability

Ensure that:

- Every visible button has a meaningful working action.
- Every navigation destination works.
- User progress persists across refreshes.
- Workout sessions are not accidentally lost.
- Timers function reliably.
- Free/Pro entitlements are applied consistently.
- Usage limits cannot be bypassed simply by changing the frontend.
- User-specific data is properly isolated where authentication and storage exist.
- Mobile layouts have no overflow or broken interactions.
- Loading, error, and empty states are handled.
- Accessibility, contrast, and touch targets are appropriate.
- Animations respect reduced-motion preferences.
- Existing user data and working features are preserved wherever possible.

Use the existing technology stack where practical. Avoid unnecessary dependencies or architectural complexity.

## PHASE 7 — Testing and Quality Assurance

Test the application as a real user.

**Free user journey:**
Onboarding → Home → Free Skill → Workout → Completion → Progress → Streak → Attempt Pro Feature → Upgrade Explanation.

**Pro user journey:**
Pro Access → Specialized Skill → Custom Workout → Completion → Advanced Analytics.

Also test:

- Refresh persistence
- Navigation and browser back behavior
- Workout interruption and recovery
- Locked premium features
- Routine limits
- Monthly AI usage limits
- Empty accounts
- Mobile and desktop responsiveness
- Broken links and nonfunctional controls

Use browser automation and screenshots when supported.

Do not claim a flow was tested if it was not.

## PHASE 8 — Execution and Deliverables

Do not stop after producing recommendations. Implement the improvements in the available project.

Work in this order:

1. Audit existing implementation.
2. Establish a coherent design system.
3. Rebuild navigation and key screens.
4. Repair existing workout and progression functionality.
5. Implement Free/Pro entitlement logic and relevant UI.
6. Improve account persistence and progress tracking.
7. Add advanced features that are feasible with the current infrastructure.
8. Test and refine the final experience.

Prioritize completing a coherent, genuinely functional application over implementing many unfinished features.

For features that require external services, paid infrastructure, or API credentials, implement only what can be supported responsibly and document the missing integration.

**Final deliverables:**

- Updated functioning Streakin prototype
- Summary of design and UX improvements
- Completed Free/Pro feature matrix
- List of implemented features
- List of unfinished or integration-dependent features
- Testing results and known issues
- Preview or deployment link if available

Do not overwrite the live version without confirming the intended deployment workflow.

**Final quality standard:** Streakin should feel like an engaging, trustworthy calisthenics companion that users would genuinely want to return to every day.

The priority is not to make Streakin look more complicated.

**Make it feel better, work better, and give users a clear reason to keep training.**