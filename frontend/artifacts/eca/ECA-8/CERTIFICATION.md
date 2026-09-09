# NPA-T ECA:8 — Executive Commitment Dialogue & Pre-Decision Challenge

**Status: CERTIFIED**

Certification date: 2026-09-08
Runtime: `http://localhost:3023/executive` (isolated `?reset=1` journeys). Production `next start` on 3023 after `NODE_OPTIONS=--max-old-space-size=8192 npm run build`. Ports 3018–3022 from earlier ECA phases were not reused.

Prerequisite ECA:1–7 remain certified. None were reopened or redesigned. ECA:9 was not started. ECA:8-FIX1 was not created.

## Verdict

**NPA-T ECA:8 — Executive Commitment Dialogue & Pre-Decision Challenge: CERTIFIED**

## Architecture questions

| Q | Required | Result |
| --- | --- | --- |
| Q1 Second Decision writer? | NO | PASS — no `ecaCommitDecision`, no ECA Decision store |
| Q2 Replace DTH:8? | NO | PASS — `replacesDth8: false`; Theatre commit control unchanged |
| Q3 Replace CC:10 / CC:10R? | NO | PASS — `canonicalAuthority: "CC:10 Decision Commitment"`; `transitionDecision` not called from ECA:8 |
| Q4 Preference distinct from commitment? | YES | PASS — `I prefer` → `PREFERENCE`; writes false |
| Q5 Generic Yes non-mutating without pending confirmation? | YES | PASS — `canonicalHandoffAllowed: false`; `staleYesMutation: false` |
| Q6 Ambiguous target clarification? | YES | PASS — `Choose it` with two candidates → `AMBIGUOUS` |
| Q7 Material pre-Decision challenge? | YES | PASS — blocked/NOT_READY and ECA:5 conflict surface one challenge |
| Q8 Acknowledge non-blocking uncertainty and proceed? | YES | PASS — no repeated same challenge after `I understand` |
| Q9 Avoid repeating acknowledged challenge? | YES | PASS — `duplicateChallenge: false` |
| Q10 Manager may reject recommendation? | YES | PASS — choosing B while A was recommended is allowed |
| Q11 Decision confirmation separate from Execution? | YES | PASS — `startsExecution: false`; stage execution count unchanged |
| Q12 Direct business writes? | NO | PASS — all ECA:8 writer flags false |

## Required certification matrix

| Gate | Result |
| --- | --- |
| Architecture reuse | PASS |
| DTH:8 preservation | PASS |
| CC:10 / CC:10R preservation | PASS |
| No second Decision writer | PASS |
| No second confirmation engine | PASS |
| Preference recognition | PASS |
| Preference/commitment separation | PASS |
| Explicit commitment recognition | PASS |
| Recommendation-acceptance separation | PASS |
| Commitment target binding | PASS |
| Ambiguous target clarification | PASS |
| Target drift prevention | PASS |
| Generic Yes safety | PASS |
| Valid confirmation | PASS |
| Stale confirmation safety | PASS |
| Confirmation cancel | PASS |
| Pre-confirmation target change | PASS |
| Decision dedupe | PASS |
| Decision readiness reuse | PASS |
| Pre-decision challenge | PASS |
| Critical unknown challenge | PASS |
| Conflict challenge | PASS |
| Risk challenge | PASS — conversational acknowledgement only; Risk writer unused |
| Stale recommendation challenge | PASS |
| Criteria-change challenge | PASS |
| Acknowledged uncertainty | PASS |
| No repeat challenge | PASS |
| Manager override of recommendation | PASS |
| Decision review | PASS |
| What-am-I-approving | PASS |
| What-happens-if-confirmed | PASS |
| Decision/Execution separation | PASS |
| Decision/Outcome separation | PASS |
| Stage separation | PASS |
| Data semantic safety | PASS |
| No false commitments | PASS |
| No unnecessary blockers | PASS |
| No duplicate Decisions | PASS |
| ECA:1 regression | PASS |
| ECA:2 regression | PASS |
| ECA:3 regression | PASS |
| ECA:4 regression | PASS |
| ECA:5 regression | PASS |
| ECA:6 regression | PASS |
| ECA:7 regression | PASS |
| NCA regression | PASS |
| NXA regression | PASS |
| DTH regression | PASS |
| CC Decision regression | PASS |
| Live runtime | PASS |
| NXA funnel | PASS |
| TypeScript | PASS |
| ESLint | PASS |
| Production build | PASS |
| git diff --check | PASS |

## Dependency direction

ECA:1 → ECA:2 → ECA:3 → ECA:4 → ECA:5 → ECA:6 → ECA:7 → **ECA:8**.

ECA:8 consumes ECA:7 readiness, ECA:4 needs, ECA:5 conflict, and CC:10 status. It does not call those judges recursively. Canonical Decision mutation remains CC:10R `transitionDecision` only. DTH:8 remains the commitment experience.

Canonical module: `judgeEcaExecutiveCommitment` (`NPA-T ECA:8/ExecutiveCommitmentDialoguePreDecisionChallenge`).

Pending conversational confirmation is session-only (`ecaCommitmentSession` on Manager–Object). Hard refresh empties it; later generic Yes cannot commit through ECA:8.

## Focused and multi-turn

A–T and sequences 1–8 pass in `ecaExecutiveCommitment.test.ts`. Orchestrator runtime proofs pass in `ecaExecutiveCommitment.runtime.test.ts`.

| Metric | Count |
| --- | --- |
| False commitments | 0 |
| Stale Yes Decision mutations | 0 |
| Ambiguous-target Decision mutations | 0 |
| Commitment target drift | 0 |
| Duplicate Decisions from ECA:8 | 0 |
| Automatic Execution starts | 0 |
| Unnecessary commitment blockers | 0 |
| Duplicate unchanged challenges | 0 |
| Direct ECA:8 business writes | 0 |
| Second Decision writer | 0 |
| Second confirmation engine | 0 |

## Live `/executive` sequences

Evidence: `frontend/artifacts/eca/ECA-8/live-proofs.json`.

| Proof | Result |
| --- | --- |
| 1 Preference safety | PASS — `PREFERENCE`; Decision count unchanged; writes=false |
| 2 Explicit commitment | PASS — `EXPLICIT_COMMITMENT`; CC:10 handoff action; ECA:8 does not write |
| 3 Critical / conditional challenge | PASS — READY_WITH_CONDITIONS visible; writes=false; no silent commit |
| 4 Acknowledge and proceed | PASS — no challenge loop / blocker warning |
| 5 Ambiguous `it` | PASS — `AMBIGUOUS`; handoff=false |
| 6 Stale Yes | PASS — handoff=false; Decision count unchanged |
| 7 Decision → Execution boundary | PASS — `startsExecution=false`; execution count unchanged |

Live Runtime 1–7: **7/7 PASS**. Page errors: 0.

Refresh behavior: pending overlay is session-only. After hard reset (`?reset=1`) or empty session, Yes does not hand off.

## Funnel and quality

| Gate | Result |
| --- | --- |
| NXA L1 | PASS |
| NXA L2 | PASS |
| NXA L3 | PASS |
| NXA L4 required tasks | **7/7 PASS** |
| TypeScript | PASS |
| ESLint (ECA:8 surface) | PASS (0 errors; pre-existing shell `csvImportStoreVersion` hook warning unchanged) |
| Production build | PASS |
| git diff --check (ECA:8 sources) | PASS |
| Blocking product failures | 0 |

## Stop

ECA:9 was not started. ECA:8-FIX1 was not created. ECA:1–7 were not redesigned. No second Decision writer, confirmation UI, DTH:8 experience, CC:10 authority, NCA intent engine, ECA:2 planner, or business writer was added.
