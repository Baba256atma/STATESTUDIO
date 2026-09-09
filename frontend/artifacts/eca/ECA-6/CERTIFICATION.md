# NPA-T ECA:6 — Executive Dialogue Strategy & Multi-Turn Objective Control

**Status: CERTIFIED**

Certification date: 2026-09-08
Runtime: `http://localhost:3021/executive` (isolated `?reset=1` journeys). Production `next start` on 3021 after `NODE_OPTIONS=--max-old-space-size=8192 npm run build`. Ports 3018–3020 from earlier ECA phases were not reused.

Prerequisite ECA:1–5 remain certified. None were reopened or redesigned. ECA:7 was not started. ECA:6-FIX1 was not created.

## Verdict

**NPA-T ECA:6 — Executive Dialogue Strategy & Multi-Turn Objective Control: CERTIFIED**

## Architecture questions

| Q | Required | Result |
| --- | --- | --- |
| Q1 Second conversation-objective store? | NO | PASS — session overlay only; CONV:2 remains thread/objective authority |
| Q2 Replace CONV:2? | NO | PASS — `replacesConv2: false`; consumes `threadId` / CONV objective when present |
| Q3 One objective span multiple manager turns? | YES | PASS — investigation and comparison sequences keep one primary type |
| Q4 Side question without destroying primary? | YES | PASS — `SIDE_QUESTION` keeps `COMPARE_OPTIONS` |
| Q5 Explicit switch? | YES | PASS — forget/move-on is `SWITCH` |
| Q6 Pause/resume in session? | YES | PASS — `PAUSED` then `RESUMED`; empty session is not reconstructed from Stage |
| Q7 Judge objective completion? | YES | PASS — comparison complete on bounded outcome; incomplete when a blocking need remains |
| Q8 Dialogue completion mutates business state? | NO | PASS — all ECA:6 writers false |
| Q9 Recommendation equal Decision? | NO | PASS — `recommendationEqualsDecision: false`; no commit |
| Q10 Decision preparation equal commitment? | NO | PASS — `PREPARE_DECISION` / `DECISION_INTENT` hand off; ECA:6 does not commit |
| Q11 Where-are-we / what’s-next? | YES | PASS — natural-language notes; one strategic milestone |
| Q12 Explicit manager intent override? | YES | PASS — Show Executions is answered; investigation not forced |

## Required certification matrix

| Gate | Result |
| --- | --- |
| Architecture reuse | PASS |
| CONV:2 authority preservation | PASS |
| No second objective store | PASS |
| Objective detection | PASS |
| Objective continuation | PASS |
| Objective progress | PASS |
| Objective milestone | PASS |
| Side-question handling | PASS |
| Objective switch | PASS |
| Pause handling | PASS |
| Resume handling | PASS |
| Completion judgment | PASS |
| Abandon/supersede handling | PASS |
| Explicit manager-intent priority | PASS |
| Strategic next milestone | PASS |
| Where-are-we support | PASS |
| What's-next support | PASS |
| Are-we-done support | PASS |
| Information-gap reuse | PASS |
| Trusted-answer reuse | PASS |
| Initiative reuse | PASS |
| Turn-plan reuse | PASS |
| Recommendation/Decision separation | PASS |
| Decision/Execution separation | PASS |
| Outcome/Learning separation | PASS |
| Stage separation | PASS |
| No forced workflow | PASS |
| No objective explosion | PASS |
| No stale objective stickiness | PASS |
| Refresh/session safety | PASS |
| ECA:1 regression | PASS |
| ECA:2 regression | PASS |
| ECA:3 regression | PASS |
| ECA:4 regression | PASS |
| ECA:5 regression | PASS |
| CONV regression | PASS |
| Live runtime | PASS |
| NXA funnel | PASS |
| TypeScript | PASS |
| ESLint | PASS |
| Production build | PASS |
| git diff --check | PASS |

## Dependency direction

ECA:1 → ECA:2 → ECA:3 → ECA:4 → ECA:5 → **ECA:6**. ECA:6 does not call ECA:2 to re-plan. Later turns recompute through existing orchestration.

Canonical module: `judgeEcaExecutiveDialogueStrategy` (`NPA-T ECA:6/ExecutiveDialogueStrategyMultiTurnObjectiveControl`).

## Focused and multi-turn

A–T and sequences 1–8 pass in `ecaExecutiveDialogueStrategy.test.ts`. Orchestrator runtime proofs pass in `ecaExecutiveDialogueStrategy.runtime.test.ts`.

| Metric | Count |
| --- | --- |
| Unnecessary objective creation (focused coverage) | 0 |
| Lost active objectives (required scenarios) | 0 |
| Sticky stale objectives (required scenarios) | 0 |
| False objective completion | 0 |
| Duplicate CONV:2 / ECA:6 objective authorities | 0 |
| Direct ECA:6 business writers | 0 |

## Live `/executive` sequences

Evidence: `frontend/artifacts/eca/ECA-6/live-proofs.json`.

| Proof | Result |
| --- | --- |
| 1 Investigation continuity | PASS — same `INVESTIGATE_ISSUE` across three turns |
| 2 Side question | PASS — `SIDE_QUESTION`, primary `COMPARE_OPTIONS` preserved |
| 3 Return | PASS — objective remains after CAP_AV |
| 4 Explicit switch | PASS — `SWITCH`, no forced return |
| 5 Comparison → recommendation | PASS — `PREPARE_RECOMMENDATION`, no Decision commit |
| 6 Information-gap progress | PASS — estimate does not write Data truth |
| 7 Decision/Execution boundary | PASS — ECA:2 may hand off `COMMIT_DECISION`; ECA:6 writes=false and does not complete until canonical commitment |

Live Runtime 1–7: **7/7 PASS**. Page errors: 0.

## Funnel and quality

| Gate | Result |
| --- | --- |
| NXA L1 | PASS |
| NXA L2 | PASS |
| NXA L3 | PASS |
| NXA L4 required tasks | **7/7 PASS** |
| TypeScript | PASS |
| ESLint (ECA:6 surface) | PASS (0 errors; pre-existing shell `csvImportStoreVersion` hook warning unchanged) |
| Production build | PASS |
| git diff --check (ECA:6 sources) | PASS |
| Blocking product failures | 0 |

## Stop

ECA:7 was not started. ECA:6-FIX1 was not created. ECA:1–5 were not redesigned. No second conversation-objective store, dialogue-state engine, NCA engine, ECA:2 planner, ECA:3–5 engines, Stage/Data/Risk/Goal/Decision/Execution/Outcome/Learning writers, workflow automation, project tasks, employee messaging, Mini Nexora, RAG, or background agents were added.
