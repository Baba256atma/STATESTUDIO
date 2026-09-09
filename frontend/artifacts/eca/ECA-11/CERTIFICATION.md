# NPA-T ECA:11 — Outcome Dialogue & Executive Result Interpretation

**Status: CERTIFIED**

Certification date: 2026-09-08
Runtime: `http://localhost:3026/executive` (isolated `?reset=1` journeys). Production `next start` on 3026 after `NODE_OPTIONS=--max-old-space-size=8192 npm run build`. Port 3026 was verified free before this phase. The 3026 server started for this phase was stopped after Level 4.

Prerequisite ECA:1–10 remain certified. None were reopened or redesigned. ECA:12 was not started. ECA:11-FIX1 was not created.

## Verdict

**NPA-T ECA:11 — Outcome Dialogue & Executive Result Interpretation: CERTIFIED**

## Architecture questions

| Q | Required | Result |
| --- | --- | --- |
| Q1 Second Outcome writer? | NO | PASS — no `EcaOutcomeStore`, `saveEcaOutcome()`, or `commitOutcomeInterpretation()` |
| Q2 Replace DTH:11? | NO | PASS — `replacesDth11: false`; Theatre `data-theatre-outcome-observation-state` remains |
| Q3 Second Learning engine? | NO | PASS — `createsLearningEngine: false`; `writesLearning: false` |
| Q4 Execution complete ≠ Outcome observed? | YES | PASS — complete without observation → `NOT_YET_OBSERVED`; no success/failure |
| Q5 Observation without baseline improvement claim? | YES | PASS — missing baseline → no IMPROVED/DETERIORATED |
| Q6 Improvement without Goal-achievement claim? | YES | PASS — missing target → `targetComparison: UNKNOWN` |
| Q7 Improved-from-baseline distinct from target-met? | YES | PASS — 91→94 vs Goal 96 is IMPROVED + NOT_MET |
| Q8 Mixed Outcomes preserved? | YES | PASS — Delivery up / Cost up (inverted) → MIXED |
| Q9 Favorable Outcome ≠ Decision quality? | YES | PASS — `successInflation: false` |
| Q10 Unfavorable Outcome ≠ bad Decision? | YES | PASS — deterioration does not grade the Decision |
| Q11 Temporal sequence insufficient for causality? | YES | PASS — attribution always `NOT_ESTABLISHED`; `infersCausality: false` |
| Q12 ECA:3 remains initiative authority? | YES | PASS — `createsSecondInitiativeEngine: false` |
| Q13 ECA:4 remains information-acquisition authority? | YES | PASS — ECA:11 identifies gaps only |
| Q14 ECA:5 remains trusted-intake authority? | YES | PASS — estimates/conflicts consumed, not reclassified |
| Q15 ECA:6 remains objective-continuity authority? | YES | PASS — side questions do not overlay; `ASSESS_OUTCOME` continuity |
| Q16 DTH:12 remains Learning/Reassessment Theatre? | YES | PASS — `replacesDth12: false`; reassessment suggested only |
| Q17 Direct business mutation? | NO | PASS — all writer flags false |

Canonical module: `judgeEcaExecutiveOutcome` (`NPA-T ECA:11/OutcomeDialogueExecutiveResultInterpretation`).

CORE-OUT:1 remains evaluation. CORE-OUT:1A remains session capture (`storageLifetime: "session"`). DTH:11 remains Outcome Observation Theatre. Percentage-point arithmetic reuses `formatOutcomePercentagePointDelta`.

## Required certification matrix

| Gate | Result |
| --- | --- |
| Architecture inspection | PASS |
| Current-state continuation | PASS |
| Canonical reuse | PASS |
| CORE-OUT preservation | PASS |
| DTH:11 preservation | PASS |
| DTH:12 preservation | PASS |
| No second Outcome writer | PASS |
| No second Outcome Theatre | PASS |
| No Learning engine | PASS |
| Outcome mode gate | PASS — live Execution without observation stays ECA:10 |
| Execution/Outcome separation | PASS |
| Outcome binding | PASS — Decision-linked CC:11 Execution + CORE-OUT:1A captures |
| Multiple Outcome safety | PASS — primary + secondary dimensions |
| Observation recognition | PASS |
| Partial observation | PASS — live Execution + reported result |
| Missing observation | PASS |
| Stale observation | PASS |
| Conflicted observation | PASS |
| Baseline recognition | PASS — capture provenance `baseline:N` |
| Missing baseline safety | PASS |
| Target recognition | PASS — capture provenance `target:96` |
| Missing target safety | PASS |
| Baseline comparison | PASS |
| Target comparison | PASS |
| Numerical accuracy | PASS — 91→94 = +3 pp; Goal 96 = 2 points below |
| Improvement interpretation | PASS |
| Deterioration interpretation | PASS |
| Goal-met interpretation | PASS |
| Goal-missed interpretation | PASS |
| Mixed Outcome | PASS |
| Success inflation barrier | PASS |
| Decision-quality separation | PASS |
| Causality safety | PASS |
| Attribution safety | PASS |
| Counterfactual safety | PASS |
| Manager-estimate safety | PASS — reported/estimated preserved |
| Data provenance | PASS |
| Evidence conflict | PASS |
| Temporal validity | PASS — stale/pre-Execution not treated as post-Execution Outcome |
| CAP_AV safety | PASS |
| Primary executive result | PASS |
| Unknown/inconclusive support | PASS |
| Duplicate suppression | PASS — acknowledgement fingerprint |
| ECA:3 initiative preservation | PASS |
| ECA:4 information-acquisition preservation | PASS |
| ECA:5 intake preservation | PASS |
| ECA:6 objective preservation | PASS |
| ECA:10 live-execution preservation | PASS — overlay skipped only when ECA:11 `speak` |
| Outcome/Learning separation | PASS |
| Outcome/Reassessment separation | PASS |
| Outcome/Decision separation | PASS |
| Outcome/Goal mutation isolation | PASS |
| Refresh behavior | PASS — session overlay only |
| Stale-judgment prevention | PASS |
| Target-drift prevention | PASS |
| Focused A–T | PASS |
| Sequences 1–8 | PASS |
| Live Runtime 1–7 | PASS |
| ECA:1–10 regression | PASS |
| NCA regression | PASS — L4 omnibus |
| NXA regression | PASS |
| DTH regression | PASS — DTH:10/11/12 |
| CORE-OUT regression | PASS — CORE-OUT:1 / 1A / 2 |
| CC regression | PASS — CC:11 follow-up |
| Data regression | PASS |
| Goal/KPI regression | PASS — no Goal writer |
| Outcome regression | PASS |
| Learning regression | PASS |
| NXA funnel | PASS |
| TypeScript | PASS |
| ESLint | PASS — 0 errors; pre-existing `csvImportStoreVersion` warning untouched |
| Production build | PASS |
| git diff --check | PASS |

## Dependency direction

Certified orchestrator order is unchanged:

ECA:1 → ECA:2 → ECA:3 → ECA:4 → ECA:5 → ECA:6 → ECA:7 → ECA:8 → ECA:9 → ECA:10 → **ECA:11**

ECA:11 is late-stage read-only. It consumes ECA:1–10, CORE-OUT:1/1A, and DTH:11 mapped observations. It does not absorb those authorities.

When ECA:11 `speak` is true, the ECA:10 overlay is skipped so live “too early to judge Outcome” cannot contradict a valid observation while Execution remains `in-progress`.

## Focused and multi-turn

A–T and sequences 1–8 pass in `ecaExecutiveOutcome.test.ts`. Orchestrator runtime proofs pass in `ecaExecutiveOutcome.runtime.test.ts`.

| Metric | Count |
| --- | --- |
| False Outcome observations | 0 |
| False improvement claims | 0 |
| False deterioration claims | 0 |
| False Goal-met claims | 0 |
| False Goal-missed claims | 0 |
| Execution completion → Outcome | 0 |
| Improvement → automatic success | 0 |
| Goal miss → automatic failure | 0 |
| Favorable Outcome → good Decision | 0 |
| Unfavorable Outcome → bad Decision | 0 |
| Temporal sequence → causality | 0 |
| Unsupported causal claims | 0 |
| Counterfactual inventions | 0 |
| Manager estimate → confirmed Outcome | 0 |
| Stale evidence → current Outcome | 0 |
| CAP_AV semantic promotion | 0 |
| Outcome → Goal mutation | 0 |
| Outcome → Decision mutation | 0 |
| Outcome → Execution mutation | 0 |
| Outcome → Learning write | 0 |
| Direct ECA:11 business writes | 0 |
| Second Outcome writer | 0 |
| Second Outcome Theatre | 0 |
| Learning engine | 0 |
| Second initiative engine | 0 |

## Live `/executive` sequences

Evidence: `frontend/artifacts/eca/ECA-11/live-proofs.json`.

Canonical commit/start used the existing DTH:10 theatre path (`show scenarios` → `Compare them.` → Approve Demand Surge → Start it.). CC:11 complete remains confirmation-required (orchestrator does not pass `confirmed` on generic Yes). Live Runtime 1 therefore proves **no Outcome success/failure claim while Execution is still ACTIVE**, not a fabricated terminal completion.

Manager delivery reports are CORE-OUT:1A session captures. DTH:11 shows `OUTCOME_PARTIAL` while Execution is `in-progress`. ECA:11 interprets that as `PARTIALLY_OBSERVED`. Catalog KPI 91% is not treated as the Outcome object.

| Proof | Result |
| --- | --- |
| 1 Completion without Outcome | PASS — `NOT_YET_OBSERVED`; writes=false; learning=false; no success/failure claim. Execution remains ACTIVE because complete is confirmation-required |
| 2 Baseline comparison | PASS — IMPROVED; +3 percentage points; reported 94% not promoted as validated actual |
| 3 Goal comparison | PASS — NOT_MET; 2 percentage points below 96%; generic command-failure apology replaced |
| 4 Causality | PASS — attribution `NOT_ESTABLISHED`; sequence language only |
| 5 Conflict | PASS — `CONFLICTED`; manager 96% vs accepted 91%/94% not silently resolved |
| 6 CAP_AV | PASS — no “capacity caused”; attribution `NOT_ESTABLISHED` |
| 7 Reassessment boundary | PASS — result interpreted; reassessment may be considered; Learning write false; no ECA:12 |

## Funnel

| Level | Result |
| --- | --- |
| NXA L1 | PASS |
| NXA L2 | PASS |
| NXA L3 | PASS |
| NXA L4 | 7/7 PASS |

L4 live smoke: `http://localhost:3026/executive`.

## Stop

ECA:12 was not started. ECA:11-FIX1 was not created. Certified ECA:1–10 were not reopened.
