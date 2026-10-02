# NPA-T OUT-EVAL-LIVE:1 — Live Observation → CORE-OUT Outcome Evaluation

## A. Status

**OUT-EVAL-LIVE:1 = CERTIFIED**

This phase wires existing CORE-OUT:1A captures into existing CORE-OUT:1 evaluation. It does **not** certify CORE-OUT:2 Learning, Outcome-informed reassessment, loop re-entry, or SIM-TEST:10.

## B. R2 Failure

SIM-TEST:10-R2 captured 25 observations with `eligibleAsActualOutcome = false` (`missing-outcome-link`, `current-kpi-unlinked`) and never invoked `projectLiveOutcomeIntelligence` on the live CC:5 path.

Capture existed. Evaluation did not.

## C. First Divergent Layer

| Field | Value |
| --- | --- |
| Owner | MVP-OUT:1-R2 post-decision capture + MVP-OUT:1 runtime integration |
| File | `nexoraPostDecisionObservationCapture.ts` then `nexoraOutcomeLearningRuntimeIntegration.ts` |
| Function | `syncLiveExecutionCaptureContexts` (missing expected/binding); CC:5 did not host `integrateNexoraOutcomeLearningRuntime` |
| Missing | Decision/Scenario expected Outcome forwarded into capture; CORE-OUT:1 invoked on the live Execution path |

`missing-outcome-link`: capture registered Execution context with `expected = null`, `binding = null`, `linkBasis = null`, so CORE-OUT:1A never built an Outcome link.

`current-kpi-unlinked`: the published KPI id `kpi.production.capacity-utilization` was stored as the comparison dimension while any expected metric used a short id; even after expected existed, incomplete observation windows from MVP-OUT integrate (`timing-incomplete`) blocked eligibility.

## D. Existing Outcome Architecture

```
CC:10 Decision + CC:9 Scenario evaluation impacts
  → MVP-OUT:1-R2 resolveLiveSubjectExpectedOutcome
      (Scenario direction + unique Data Reality KPI for the subject)
  → resolveDecisionExpectedOutcomeBinding (measurable, no invented numeric target)
  → CORE-OUT:1A captureOutcomeObservation (metric-binding when dimensions match)
  → MVP-OUT:1 integrateNexoraOutcomeLearningRuntime
  → CORE-OUT:1 projectLiveOutcomeIntelligence
```

CC:5 only forwards Execution/Decision/Scenario context and consumes EXI presentation of CORE-OUT:1. It does not decide SUCCESS/FAILURE.

## E. Production Repair

| File | Functions | Why |
| --- | --- | --- |
| `nexoraDecisionExpectedOutcomeBinding.ts` | `resolveLiveSubjectExpectedOutcome` | Existing Scenario impact direction + unique Data Reality KPI (unit from KPI definition). No 80% target from presentation fixtures. |
| `nexoraPostDecisionObservationCapture.ts` | `syncLiveExecutionCaptureContexts`, `ensureCaptureWindow`, `captureKpiForContext`, `bindLinkedObservations` | Forward expected/binding; slug KPI dimension; bind subject to `obj-*`; replace `timing-incomplete` windows with the first legitimate publication timestamp; do not link unrelated KPIs. |
| `nexoraOutcomeLearningRuntimeIntegration.ts` | `synchronizeLiveExecutionOutcomeEvaluation` | Existing host for CORE-OUT:1 on live Execution contexts with a complete window. |
| `conversationalExperienceOrchestrator.ts` | `synchronizeLiveCc5OutcomeEvaluation` | CC:5 orchestration: sync on every finish; on Outcome asks, consume CORE-OUT/EXI:5 statements. |
| `nexoraLiveOutcomeObservationCapture.ts` | `outcomeComparisonDimension`, stored `dimension` | Identity normalization of `kpi.*.slug`. |
| `nexoraLiveOutcomeIntelligence.ts` | comparison dimension slug | Expected vs observed still compared only when the same measure. |

`nexoraDecisionOutcomeCommitment.ts` was inspected; `isPostBoundaryObservation` remains strict `>`.

## F. Outcome Linkage

From OUT-EVAL-LIVE focused tests:

| Class | Count / result |
| --- | --- |
| Observations tested | live Capacity publications + unrelated shipping + missing-expectation ingest + duplicates |
| Legitimately eligible | Capacity utilization after E1 + publication (T1, T3, T7, T8, T9, R2 family A) |
| Correctly ineligible | Unrelated shipping (T5); missing expectation (T11); pre-E publication (T6); hidden ticks (T2) |
| False eligible | 0 |
| Missed eligible | 0 in the live Capacity funnel once window is complete |

Not every R2 observation must become eligible. Do-nothing Capacity commitments expect utilization to **hold** (`maintain`). Investigation scenarios with `direction: unknown` remain unbound.

## G. Evaluation

CORE-OUT:1 runs via `projectLiveOutcomeIntelligence` / `integrateNexoraOutcomeLearningRuntime`.

Typical live Capacity result after publication:

- `actualOutcome` present, `outcomeLinked: true`
- `establishesCausation: false`
- `createsLearning: false`
- Comparison often `comparison-incomplete` (no numeric target; no `observedDirection`; baseline may be missing)

That is existing CORE-OUT:1 semantics, not fabricated SUCCESS/FAILURE.

## H. Temporal Integrity

- Pre-Execution CSV: not captured as E1 Outcome (T6)
- Hidden RMS ticks: no new evaluation (T2/T20)
- Delayed publication: evaluation only after Obs1 (T3/T7)
- Ground Truth evaluation leaks: 0

## I. Expected vs Observed

- Expected is Scenario-direction + Data Reality KPI identity, stored as PREDICTION.
- Observed remains FACT from CORE-OUT:1A.
- Numeric targets are not invented. Presentation fixture `target: 80%` is not used (`usesCurrentKpiTargetAsDecisionExpectation` stays false).
- T11: no Scenario impact/KPI pairing → no fabricated expectation.

## J. Multi-Execution

Live Capacity `D1 → E1 → Obs1 → Eval1` (do-nothing Capacity / utilization).

Delivery `D2 → E2`: shipping KPI is not forced onto E1 (T5/T9). If Delivery has no measurable expected (unknown investigation impact), Obs2 may remain observation-only. Cross-bindings observed: 0.

## K. Historical Integrity

T13: Decision id/title and Execution id/decisionId unchanged after evaluation.

## L. COMMIT-LIVE Regression

`nexoraCommitLive1.test.ts`: **pass** (T1–T18 + funnels + R1 micro). Scenario → Decision → Execution remains context-safe.

## M. OUT-LIVE Regression

`nexoraOutLive1.test.ts`: **17/0**. Execution → publication → observation remains live.

## N. NPS / ECA Boundary

NPS:8 `writesOutcome = false`, `writesLearning = false` (T18 + NPS:8 suite).

ECA:11 Outcome-read tests: **pass**. Conversation does not write Outcome.

## O. Learning Boundary

CORE-OUT:1 `createsLearning = false`. T19: evaluation present; Learning not repaired. Durable Learning remains uncertified (SIM-TEST:10-R3).

## P. R2 Replay

Original `missing-outcome-link` / `current-kpi-unlinked` on Capacity utilization after a bound Execution:

- **now legitimately eligible** when Scenario impact direction exists, the subject has a unique Data Reality KPI, and the observation window is complete.
- **correctly still ineligible** when expected is missing, KPI is unrelated, publication is pre-Execution, or window/timing is incomplete.
- Family A micro-journey: eligible evaluation present.

## Q. Regression

| Suite | Result |
| --- | --- |
| OUT-EVAL-LIVE:1 (`nexoraOutEvalLive1.test.ts`) | 18/0 |
| OUT-LIVE:1 | 17/0 |
| COMMIT-LIVE:1 | pass |
| CORE-OUT:1 | pass |
| CORE-OUT:1A | pass |
| MVP-OUT:1 / R1 / R2 / R3 | pass |
| NPS:8 | pass |
| ECA:11 Outcome | pass |
| SIM-TEST:9-FIX1 | pass |
| SIM-TEST:9-FIX2 | pass |
| SIM-TEST:8-FIX1 | pass |
| Level 4 / full repository | **not run** |

## R. Production Integrity

Changed for this phase:

- `conversationalExperienceOrchestrator.ts`
- `nexoraPostDecisionObservationCapture.ts`
- `nexoraOutcomeLearningRuntimeIntegration.ts`
- `nexoraDecisionExpectedOutcomeBinding.ts`
- `nexoraLiveOutcomeObservationCapture.ts`
- `nexoraLiveOutcomeIntelligence.ts`

Test-only: `nexoraOutEvalLive1.test.ts`.

## S. Architecture Integrity

- New Outcome authority = none
- New Outcome store = none
- New Learning authority = none
- New observation registry = none

## T. Remaining Findings

Separately classified:

- CORE-OUT:2 live Learning
- Outcome-informed reassessment
- Loop re-entry
- Do-nothing vs intervention Scenario (Go with B. may be No Action on Capacity)
- Known Advisor/NPS/NCA/B T5 debt
- Delivery may lack a measurable expected if Scenario impact is `unknown`

## U. Next Action

Return to **NPA-T SIM-TEST:10-R3** from turn 1. Do not start OUT-EVAL-LIVE:2.
