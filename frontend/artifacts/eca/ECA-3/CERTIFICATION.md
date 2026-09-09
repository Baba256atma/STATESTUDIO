# NPA-T ECA:3 — Proactive Executive Guidance & Advisor Initiative

**Status: CERTIFIED**

Certification date: 2026-09-07
Runtime: `http://localhost:3018/executive` (isolated `?reset=1` journeys). Port 3017 from ECA:2 was left running; this phase started 3018 after a production build.

Prerequisite ECA:1 and ECA:2 remain certified. Neither was reopened or redesigned. ECA:4 was not started. ECA:3-FIX1 was not created.

## Verdict

**NPA-T ECA:3 — Proactive Executive Guidance & Advisor Initiative: CERTIFIED**

## Architecture questions

| Q | Required | Result |
| --- | --- | --- |
| Q1 Second initiative engine? | NO | PASS — NCA:5 remains conversational initiative; ECA:3 is judgment only |
| Q2 Mutate business state? | NO | PASS — frozen writer boundaries all false |
| Q3 Can choose silence? | YES | PASS |
| Q4 Dismissal suppresses repetition? | YES | PASS — session fingerprints, no durable memory |
| Q5 Material change can resurface? | YES | PASS |
| Q6 Weak evidence weaker guidance? | YES | PASS — TENTATIVE cannot WARN |
| Q7 Casual override of explicit intent? | NO | PASS — EXPLAIN/SHOW/COUNT/LOCATE/INSPECT suppress non-CRITICAL |
| Q8 Reuse ECA:2 for planning? | YES | PASS — ECA:1 → ECA:2 → ECA:3; plan referenced, not recomposed |
| Q9 Direct Decision/Execution commit? | NO | PASS |
| Q10 Diagnostics for speak/silence? | YES | PASS — `data-eca-3-*` and `suppressionReason` |

## Required certification matrix

| Gate | Result |
| --- | --- |
| Architecture reuse | PASS |
| NCA:5 boundary | PASS |
| Initiative judgment | PASS |
| Silence judgment | PASS |
| Significance handling | PASS |
| Urgency separation | PASS |
| Evidence confidence | PASS |
| Goal-at-risk initiative | PASS |
| Risk initiative | PASS |
| Contradictory evidence | PASS |
| Missing-information initiative | PASS |
| Decision review initiative | PASS |
| Execution initiative | PASS |
| Outcome/reassessment initiative | PASS |
| Duplicate suppression | PASS |
| Acknowledgement suppression | PASS |
| Dismissal suppression | PASS |
| Material-change resurfacing | PASS |
| Explicit-manager-intent priority | PASS |
| Stage separation | PASS |
| Data uncertainty preservation | PASS |
| ECA:2 reuse | PASS |
| Authority isolation | PASS |
| Live runtime | PASS |
| Regression gates | PASS |
| NXA funnel | PASS |
| TypeScript | PASS |
| ESLint | PASS |
| Production build | PASS |
| git diff --check | PASS |

## Dependency direction

ECA:1 (NOW) → ECA:2 (NEXT) → ECA:3 (whether to speak). ECA:3 does not call the ECA:2 planner. Conversational speech remains NCA:5 / NXA:4 / Advisor. ECA:3 does not overlay a second message.

Canonical module: `judgeEcaExecutiveInitiative` (`NPA-T ECA:3/ProactiveExecutiveGuidanceAdvisorInitiative`).

## Focused and multi-turn

A–T and sequences 1–5 pass in `ecaExecutiveInitiativeJudgment.test.ts`. Orchestrator runtime proofs pass in `ecaExecutiveInitiativeJudgment.runtime.test.ts`.

## Live `/executive` sequences

Evidence: `frontend/artifacts/eca/ECA-3/live-proofs.json`.

| Proof | Result |
| --- | --- |
| 1 Appropriate silence | PASS |
| 2 Goal risk | PASS |
| 3 Missing information | PASS |
| 4 Dismissal | PASS |
| 5 New evidence after dismissal | PASS |
| 6 Data uncertainty | PASS — no WARN / no authoritative capacity warning |
| 7 Decision/Execution boundary | PASS — no CC:10 commit, `writes=false` |

## Funnel and quality

| Gate | Result |
| --- | --- |
| NXA L1 | PASS |
| NXA L2 | PASS |
| NXA L3 | PASS |
| NXA L4 omnibus | PASS |
| NXA L4 DIR inventory | PASS |
| NXA L4 typecheck | PASS |
| NXA L4 eslint (PREP surface) | PASS (also ECA:3 files) |
| NXA L4 git diff --check PREP | PASS |
| Production build | PASS |
| Live smoke | PASS on 3018 |

Workspace `*.test.ts` files that import Vitest were not executed with `node --test`; that is the existing canonical-runner boundary, not an ECA:3 failure.

## Stop

ECA:4 was not started. ECA:3-FIX1 was not created. ECA:1 and ECA:2 were not redesigned.
