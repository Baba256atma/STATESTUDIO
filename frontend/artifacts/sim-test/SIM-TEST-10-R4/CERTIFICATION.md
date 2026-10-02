# NPA-T SIM-TEST:10-R4

Certification-only recertification after COMMIT-LIVE:1, OUT-LIVE:1, OUT-EVAL-LIVE:1, and OUT-BASE:1. Production changes during R4 = 0.

## A. Status

SIM-TEST:10-R4 = **NOT CERTIFIED**  
SIM-TEST:10 = **NOT CERTIFIED**

## B. Population

| Item | Count |
| --- | --- |
| Journeys | 33 (14 A–N + variants + 5 SIM-TEST:5) |
| A–N families | 14 / 14 |
| RMS scenarios | manufacturing, project, logistics, service |
| Profiles | 12 |
| Seeds | 11 / 29 / 47 |
| Manager / Nexora turns | 356 / 356 |
| Long sessions | 6 |
| RMS events | 39 |
| Publications | 68 |
| Unpublished advances | 28 |
| Pre-publication Outcome asks | 13 |
| Post-publication Outcome asks | 50 |
| Learning asks | 11 |
| Reassessment asks | 5 |
| Loop-reentry attempts | 4 |
| Harness failures | 0 |

## C. Boundary matrix

| Boundary | Result |
| --- | --- |
| Scenario → Decision | PASS |
| Decision → Execution | PASS |
| Execution → Publication | PASS |
| Pre-E Data Reality → Baseline | PASS |
| Post-E Data Reality → Observation | PASS |
| Observation → Evaluation | PASS |
| Baseline + Expected + Actual → Comparison | EXPECTED INCOMPLETE |
| Comparison → Learning | NOT EXERCISED |
| Learning → Reassessment | NOT EXERCISED |
| Reassessment → Next Cycle | NOT EXERCISED |

## D. Multiplicity

| State | Distinct | Max coexisting |
| --- | --- | --- |
| Problems / Risks | 2 | 2 |
| Scenario sets | 4 | 4 |
| Decisions | 3 | 2 |
| Executions | 2 | 2 |
| Baselines (inspections with value) | 25 | — |
| Observations | 50 | — |
| CORE-OUT:1 evaluations | 40 | 2 |
| Comparison-ready | 0 | 0 |
| Durable supported Learning | 0 | 0 |
| Family L Decision cycles | 2 | 2 |

## E. Upstream integrity

COMMIT-LIVE: Go with B. Capacity do-nothing present; wrong-thread Execution = 0. FIX2 stale Scenario = 0.

## F. Baseline

OUT-BASE preserved. Family A: `capacity-utilization` ≈ 90.91 at `2026-09-16T00:00:00.000Z`. `baseline-missing` comparison reason = 0 on evaluated Capacity chains. Post-E-as-baseline not observed. Hidden GT baseline = 0.

## G. Actual observation

Eligible post-E actuals present. Wrong Execution bindings = 0. Family A actual = 100 at tick-15 production import.

## H. Evidence shape inventory

| Shape | Count |
| --- | --- |
| baseline + actual + expected direction | 25 |
| missing actual | 15 |
| baseline + actual + numeric target | 0 |
| baseline + actual + observedDirection | 0 |
| baseline + actual + direction + observedDirection | 0 |

## I. observedDirection

- Field exists on CORE-OUT:1 `ExecutiveOutcomeObservation`.
- Live management writer: CORE-OUT:1A `toEvaluatorObservation` **always sets `observedDirection: null`**.
- Other owner: NEX-ENT `nexoraOutcomeMonitoringResolution` maps entrance `observation.state` → direction. **Not** the CC:5 / RMS SIM-TEST:10 path.
- Live R4 CORE-OUT occurrences of non-null `observedDirection`: **0**.
- Not presentation-only on CORE-OUT:1 (the evaluator consumes it); it is simply never populated on this path.

## J. Numeric target / comparator

Legitimate `numericTarget != null`: **0**. Comparator: **0**. Not synthesized from baseline.

## K. CORE-OUT:1 comparison

Evaluations 40. Comparison-incomplete 25. Comparison-ready 0. `incompatible-evidence-shape` 25. `baseline-missing` 0. `missingEvidence` empty once baseline+actual+expected exist.

Family A (unchanged from OUT-BASE): direction `maintain`, target null, baseline ≈ 90.91, actual 100, `observedDirection` null, comparable false.

## L–N. Temporal, trade-off, causation

GT leaks = 0. Premature success claims = 0. Causal overreach = 0. `establishesCausation` = false. Harness `actual > baseline` is **not** counted as product `observedDirection`.

## O. CORE-OUT:2

Invoked on incomplete evaluations → `inconclusive` / `not-promotion-eligible` / `createsLearning = false`. Correct no-learning. `outcomeReady` = false. Supported Learning = 0. Not a CORE-OUT:2 defect.

## P–R. Durability, reassessment, loop

Learning durability not exercised. Family J: “Which item do you mean?” after capture — Outcome-present, not Learning-informed. Family L: D2 after Options./Go with A. without Learning linkage.

## S. Multi-thread

Capacity vs Delivery: no cross-Learning. Delivery often missing actual.

## T. Known debt

B T5 / Advisor; J clarification; NPS S3 / Observer identity-drift (raw S1 141); NCA; DTH. Separate.

## U. Raw vs product

Raw S0/S1/S2/S3 = 0/141/0/1. Product S1 = 0. Classification: **correct incomplete comparison**; **insufficient numeric-target evidence**; **live `observedDirection` unpopulated** at CORE-OUT:1A (consumer exists, live writer zeros it). Not a CORE-OUT:1 rejection defect.

## V. Replays

8 material journeys matched. Family A comparison state matches OUT-BASE:1.

## W. Regression

SIM-TEST:10-R4 population: 1/0. Focused (OUT-BASE:1, OUT-EVAL-LIVE, OUT-LIVE, COMMIT-LIVE, CORE-OUT:1/1A/2, MVP-OUT:1+R2+R3, NPS:8, ECA:11/12, SIM-TEST:9-FIX1/FIX2, SIM-TEST:8-FIX1): **442 pass / 0 fail**. Level 4 **not run**.

## X. Production integrity

Production changes during R4 = **0**  
Digest: `2a122c26bbb5f8e3e2cf76153869ee14741647adecf31e87226d56913b2ce950` (12704 files)

## Y. Architecture

New baseline / comparison / Outcome / Learning authority = none. New store = none. New NPS writer = none.

## Z. First divergent boundary

**Baseline + Expected + Actual → Comparison**

| Available | Missing |
| --- | --- |
| B1, expected direction `maintain`, A1 numeric, no GT leak | `actual.observedDirection`; `numericTarget` + comparator |

CORE-OUT:1 correctly returns `incompatible-evidence-shape`.

**observedDirection:** exists on CORE-OUT:1; live CORE-OUT:1A does not forward it; NEX-ENT can map `state` on a different path.  
**numericTarget:** does not exist in this RMS/Scenario population.

Classification: not Case 3 (CORE-OUT defect). Concurrent **Case 2** (live 1A never projects `observedDirection`) and **Case 1** (no numeric targets in the population).

Downstream: comparison-ready = 0 → supported Learning cannot be gated.

## AA. Next action

Do not start SIM-TEST:10-FIX1, OUT-BASE:2, OUT-EVAL-LIVE:2, OUT-LIVE:2, or COMMIT-LIVE:2.

Smallest next phase: a **live CORE-OUT:1A evidence-shape** investigation at `toEvaluatorObservation` — only if a **canonical published qualitative/direction** already exists to forward. Do not invent direction from baseline vs actual inside CORE-OUT:1, and do not fabricate Scenario numeric targets, in that phase either. Do not implement it in R4.
