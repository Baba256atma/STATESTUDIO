# NPA-T SIM-TEST:10-R2

Measurement only. Production changes during R2 = 0.

## A. Status

SIM-TEST:10-R2 = NOT CERTIFIED  
SIM-TEST:10 = NOT CERTIFIED

## B. Population

| Item | Count |
| --- | --- |
| Journeys | 33 (14 A–N core + profile/seed/RMS variants + 5 SIM-TEST:5 compatibility) |
| A–N families | 14 (all present) |
| RMS scenarios | manufacturing-capacity-pressure, project-delivery-pressure, logistics-delivery-pressure, service-capacity-pressure |
| Profiles | 12 (DECISION_ORIENTED through STANDARD_MANAGER) |
| Seeds | 11, 29, 47 |
| Manager / Nexora turns | 356 / 356 |
| Long sessions | 6 |
| RMS adaptive events | 39 |
| Operator publications | 68 |
| Unpublished advances | 28 |
| Unpublished Outcome/Learning asks | 13 |
| Post-publication Outcome asks | 50 |
| Learning asks | 11 |
| Harness failures | 0 |

## C. End-to-end boundary matrix

| Boundary | Result |
| --- | --- |
| Scenario → Decision | PASS |
| Decision → Execution | PASS |
| Execution → Publication | PASS |
| Publication → Data Reality | PASS |
| Data Reality → Observation | PASS |
| Observation → Evaluation | FAIL |
| Evaluation → Learning | NOT EXERCISED |
| Learning → Reassessment | NOT EXERCISED |
| Reassessment → Next Cycle | NOT EXERCISED |

Upstream COMMIT-LIVE / OUT-LIVE path holds. CORE-OUT:1A captures 25 observations. None are `eligibleAsActualOutcome` (`isOutcome` = 0). Rejections: `missing-outcome-link`, `current-kpi-unlinked`. `projectLiveOutcomeIntelligence` is not invoked from CC:5 (`integrationSeam`: MVP-OUT:1 / EXI, not CC:5).

NPS:8 / ECA:11 may project PARTIAL/BOUNDED from a numeric KPI. That is not CORE-OUT:1 evaluation of an eligible observation.

## D. Multiplicity

| Object | Distinct | Max coexisting |
| --- | --- | --- |
| Problems / Risks | 2 | — |
| Scenario IDs | 4 | — |
| Decisions | 3 | 2 |
| Executions | 2 | 2 |
| Observations | 25 | 1 per journey |
| CORE-OUT eligible Outcomes | 0 | 0 |
| Durable Learning | 0 | 0 |

## E. Decision / Execution

COMMIT-LIVE replay: Options. → Go with B. → Decision ≥ 1; Start it. from Delivery after Delivery A → Execution ≥ 1. Wrong-thread Capacity Execution = 0. Stale Capacity under Delivery Options = 0.

Population distinct Decisions = 3, Executions = 2. Duplicate/identity raw Observer labels exist (see P); they did not restore Decision = 0.

## F. Observation capture

Eligible publications produced CORE-OUT:1A captures on 25 journeys. Missed CORE-OUT Outcome linkage = 25 (`eligibleAsActualOutcome` false). Wrong Execution bindings vs journey ledger = 0. H-family captures bind only the Capacity do-nothing Execution when present; project/logistics H journeys captured 0.

## G. Outcome evaluation

CORE-OUT:1 live evaluations of eligible observations = 0.  
NPS established PARTIAL rows = 33 (read-only projection; `writesOutcome` = false).  
Post-publication asks with capture: many remain UNKNOWN (Family E: captured 1, NPS UNKNOWN, no baseline/target).  
Expected vs observed as CORE-OUT comparison-ready states = 0.

## H. Temporal integrity

Unpublished asks = 13. Premature success/failure claims = 0. Hidden captures = 0. Ground Truth leak rows = 0.

Family E: T5 unpublished-style early asks stay too-early; T8 after publication still cannot evaluate (no confirmed baseline/target, observation not Outcome-linked).

## I. Trade-offs

CORE-OUT mixed/negative/partial evaluation objects were not established. ECA:11 unit tests still encode mixed/trade-off dialogue. Live population cannot certify trade-off fidelity at CORE-OUT:1.

## J. Attribution

Causal overreach after honest filter = 0. Family F ASK_CAUSE replies preserve “does not by itself prove.” Competing H executions: two Executions can coexist; observation context does not isolate E2.

## K. Learning

CORE-OUT:2 live establishment = 0. Durable Learning = 0. NPS BOUNDED rows exist as read-only projection (`writesLearning` = false). Learning asks after capture often remain `NONE` (Family L turn 6).

## L. Reassessment

Family J after capture answers “Which item do you mean?” — not Outcome-consuming reassessment. Count of turns with capture + REASSESS intent = 5; product consumption of CORE-OUT Outcome = 0.

## M. Loop closure

Family L: after reassessment, Options. + Go with A. created a second Decision (max Decisions = 2). Prior D1/E1 remain. This is a next-cycle attempt **without** CORE-OUT evaluation/Learning. Not certified as management-learning loop closure.

## N. Multi-thread

D1 → E1 exists. D2 → E2 exists on H journeys. Obs1 (when present) binds Capacity do-nothing Execution only. O1/O2 CORE-OUT Outcome objects = none. Learning1/Learning2 = none. Cross-bindings of observations onto the wrong Execution ledger = 0.

## O. Known debt

Kept separate: B T5 canonical/L1 lag; Advisor/NPS S3 SUBJECT_LOSS (1 raw); NCA ordinal; Observer JOURNEY/DECISION_IDENTITY_DRIFT volume.

## P. Raw vs product

Raw Observer: S0=0, S1=141, S2=0, S3=1 (OPERATOR_ERROR/OBSERVATION_GAP, PREMATURE_OUTCOME, DUPLICATE_*, IDENTITY_DRIFT, etc.).

Product S1 (GT leak, wrong Execution, causal action, history rewrite): 0.

Product S2 (central path): CORE-OUT:1 live evaluation of captured observations = 0.

Capability gap: Observation → CORE-OUT:1 evaluation on the live CC:5 population.

NPS PARTIAL/BOUNDED = expected read-only projection, not a substitute for CORE-OUT:1/2.

Causal regex false positive was a test-classifier issue; corrected; product causal S1 = 0.

## Q. Replays

8 material journeys, 8/8 signature matches.

## R. Regression

| Suite | Pass | Fail |
| --- | --- | --- |
| SIM-TEST:10-R2 population measurement | 1 | 0 |
| COMMIT-LIVE:1 + OUT-LIVE:1 + FIX1 + FIX2 + 8-FIX1 + CORE-OUT:1A/1/2 + NPS:8 | 207 | 0 |
| MVP-OUT:1-R2 + R3 + ECA:11 + ECA:12 | 170 | 0 |

Level 4 / full repository: **not run**.

## S. Production integrity

Before digest = after digest (`7cba7e58d916e6ef…`). Production changes during R2 = 0.

## T. Architecture integrity

New authority = none. New store = none. New Outcome engine = none. New Learning engine = none.

## U. First divergent boundary

**Observation → Evaluation (CORE-OUT:1 live)**

- Upstream: Scenario → Decision → Execution → publication → CORE-OUT:1A capture (25 observations).
- Expected: CORE-OUT:1 consumes legitimate captured evidence (`eligibleAsActualOutcome`, expected vs observed).
- Actual: every capture rejected (`missing-outcome-link`, `current-kpi-unlinked`); `isOutcome` = 0; CC:5 does not call `projectLiveOutcomeIntelligence`.
- Owner: CORE-OUT:1 via existing MVP-OUT:1 integration (`nexoraOutcomeLearningRuntimeIntegration`), not a new engine.
- Class: capability gap on the live CC:5 RMS path (focused MVP-OUT/CORE-OUT unit suites still pass).
- Downstream: Learning, Outcome-informed reassessment, and certified next-cycle learning are not exercised.

## V. Next action

Do not start SIM-TEST:10-FIX1, OUT-LIVE:2, or COMMIT-LIVE:2 automatically.

Smallest owner-specific product phase: make the **existing** MVP-OUT:1 / CORE-OUT:1 evaluation seam consume post-Execution CORE-OUT:1A captures on the live CC:5 path (outcome-link / expected binding), without a second Outcome authority.

Do not implement it in R2.

NPA-T SIM-TEST:10-R2 — NOT CERTIFIED

NPA-T SIM-TEST:10 — NOT CERTIFIED
