# NPA-T ECA:7 — Executive Recommendation Framing & Decision Readiness

**Status: CERTIFIED**

Certification date: 2026-09-08
Runtime: `http://localhost:3022/executive` (isolated `?reset=1` journeys). Production `next start` on 3022 after `NODE_OPTIONS=--max-old-space-size=8192 npm run build`.

Prerequisite ECA:1–6 remain certified. None were reopened or redesigned. ECA:8 was not started. ECA:7-FIX1 was not created.

## Verdict

**NPA-T ECA:7 — Executive Recommendation Framing & Decision Readiness: CERTIFIED**

## Architecture questions

| Q | Required | Result |
| --- | --- | --- |
| Q1 Second Decision engine? | NO | PASS |
| Q2 Replace NCA:4? | NO | PASS — consumes `evaluateNca4AdvisoryStrategy` |
| Q3 Replace DTH:7 comparison? | NO | PASS |
| Q4 Defer when evidence insufficient? | YES | PASS |
| Q5 Conditional recommendation? | YES | PASS — estimates / CAP_AV stay TENTATIVE |
| Q6 No clear preference? | YES | PASS |
| Q7 Material trade-offs preserved? | YES | PASS |
| Q8 Uncertainty and counter-evidence preserved? | YES | PASS |
| Q9 Manager criteria change the recommendation? | YES | PASS — consumes NXA:5 re-preference |
| Q10 Decision readiness separate from commitment? | YES | PASS |
| Q11 Reassess when evidence changes? | YES | PASS |
| Q12 Direct business writes? | NO | PASS |

## Required certification matrix

| Gate | Result |
| --- | --- |
| Architecture reuse | PASS |
| NCA:4 authority preservation | PASS |
| DTH:7 comparison preservation | PASS |
| No second Decision engine | PASS |
| Recommendation-request recognition | PASS |
| Recommendation readiness | PASS |
| Decision readiness | PASS |
| Supported recommendation | PASS |
| Conditional recommendation | PASS |
| Preliminary recommendation | PASS |
| No-clear-preference | PASS |
| Deferred recommendation | PASS |
| Critical-unknown handling | PASS |
| Non-blocking uncertainty handling | PASS |
| Criteria awareness | PASS |
| Criteria-source preservation | PASS |
| Criteria-change reassessment | PASS |
| Goal alignment | PASS |
| Trade-off preservation | PASS |
| Counter-evidence preservation | PASS |
| Recommendation strength | PASS |
| Decision-sensitive conditions | PASS |
| Reversibility handling | PASS |
| Urgency/readiness separation | PASS |
| Importance/readiness separation | PASS |
| Estimate preservation | PASS |
| Opinion preservation | PASS |
| Hypothesis/causality safety | PASS |
| CAP_AV semantic safety | PASS |
| Why explanation | PASS |
| Why-not explanation | PASS |
| Confidence explanation | PASS |
| Recommendation reassessment | PASS |
| Stale recommendation prevention | PASS |
| Recommendation/Decision separation | PASS |
| Readiness/Decision separation | PASS |
| Decision/Execution separation | PASS |
| Post-Decision behavior | PASS |
| Stage separation | PASS |
| No recommendation store duplication | PASS |
| ECA:1 regression | PASS |
| ECA:2 regression | PASS |
| ECA:3 regression | PASS |
| ECA:4 regression | PASS |
| ECA:5 regression | PASS |
| ECA:6 regression | PASS |
| NCA regression | PASS |
| DTH regression | PASS |
| Live runtime | PASS |
| NXA funnel | PASS |
| TypeScript | PASS |
| ESLint | PASS |
| Production build | PASS |
| git diff --check | PASS |

## Dependency direction

ECA:1 → ECA:2 → ECA:3 → ECA:4 → ECA:5 → ECA:6 → **ECA:7**. ECA:7 does not call those judges. Preference is consumed from NXA:5 / NCA:4; ECA:7 does not re-rank.

Canonical module: `judgeEcaExecutiveRecommendation` (`NPA-T ECA:7/ExecutiveRecommendationFramingDecisionReadiness`).

## Focused and multi-turn

A–T and sequences 1–8 pass in `ecaExecutiveRecommendation.test.ts`. Orchestrator runtime proofs pass in `ecaExecutiveRecommendation.runtime.test.ts`.

| Metric | Count |
| --- | --- |
| Unsupported recommendations | 0 |
| Stale recommendations | 0 |
| Hidden material trade-offs | 0 |
| Lost uncertainty | 0 |
| Trust inflation | 0 |
| Unconfirmed semantic promotions | 0 |
| Recommendation → Decision mutations | 0 |
| Readiness → Decision mutations | 0 |
| Direct ECA:7 business writes | 0 |
| Second Decision / comparison / recommendation store | 0 |

## Live `/executive` sequences

Evidence: `frontend/artifacts/eca/ECA-7/live-proofs.json`.

| Proof | Result |
| --- | --- |
| 1 Supported recommendation | PASS — requested, writes=false, no Decision intent |
| 2 Too early | PASS — no fabricated winner |
| 3 Critical gap | PASS — writes=false; defer/no-clear/conditional/prefer only from existing authorities |
| 4 Estimate | PASS — not STRONG; Data writes=false |
| 5 Criterion shift | PASS — reassessment, no second Decision engine |
| 6 CAP_AV | PASS — strength not STRONG |
| 7 Recommendation → Decision boundary | PASS — ECA:7 writes=false; commit only via CC:10 handoff |

Live Runtime 1–7: **7/7 PASS**. Page errors: 0.

## Funnel and quality

| Gate | Result |
| --- | --- |
| NXA L1 | PASS |
| NXA L2 | PASS |
| NXA L3 | PASS |
| NXA L4 required tasks | **7/7 PASS** |
| TypeScript | PASS |
| ESLint (ECA:7 surface) | PASS (0 errors; pre-existing shell `csvImportStoreVersion` hook warning unchanged) |
| Production build | PASS |
| git diff --check (ECA:7 sources) | PASS |
| Blocking product failures | 0 |

## Stop

ECA:8 was not started. ECA:7-FIX1 was not created. ECA:1–6 were not redesigned. No second NCA advisory engine, comparison engine, Decision engine, recommendation store, planner, writer, scoring/optimization, RAG, or automated commitment was added.
