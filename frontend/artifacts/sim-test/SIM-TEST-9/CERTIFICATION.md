# NPA-T SIM-TEST:9 — Multi-Thread Business / Project Management Simulation

## A. Status

**NOT CERTIFIED.** The phase stopped at the first deterministic genuine cross-thread S1, as required. No product repair or follow-up FIX was started.

Blocking evidence: after a Capacity Decision was approved, the manager switched to Delivery. Delivery became the canonical, L1, Stage, and Advisor subject. A Delivery commitment then correctly required clarification and created no Decision. The next utterance, `Start it.`, nevertheless created an Execution for the old Capacity Decision and replied `Execution has started.`

## B. Management population executed

The stop rule ended the population before the planned A–N matrix and scale target.

| Measure | Executed |
| --- | ---: |
| Journeys | 1 |
| RMS scenario families | 1 (`manufacturing-capacity-pressure`) |
| Manager profiles | 1 (`DECISION_ORIENTED_MANAGER`) |
| Behavior seeds | 1 (`11`) |
| Manager turns | 8 |
| Nexora turns | 8 |
| Long sessions | 0 |
| Adaptive events | 0 |
| Operator publications | 1 |
| Deterministic replays | 1 |
| Replay mismatches | 0 |

Seeds 29 and 47, the other three RMS families, the other nine profiles, long sessions, adaptive changes, and the remaining required journey families were not executed after the S1 stop. They are not claimed as coverage.

## C. Management multiplicity reached

| Object | Maximum / tested count |
| --- | ---: |
| Simultaneous Problems observed | 1 (Capacity Gap) |
| Risks exercised | 0 |
| Variables exercised | 0 |
| Scenario sets requested | 2 (Capacity, then Delivery) |
| Correctly scoped Scenario sets | 1 |
| Scenario options observed | 2 |
| Canonical Decisions created | 1 |
| Canonical Executions created | 1 |
| Outcomes observed | 0 |

The second Scenario request is itself material evidence: with Delivery active, `Options.` reused the Capacity Scenario set and answered about Capacity.

## D. Referent / identity

- Wrong Problem bindings: 0.
- Wrong Risk bindings: 0; not exercised.
- Scenario-set confusion: 1 (S2 precursor at T6).
- Wrong ordinal resolution: 0. The Delivery ordinal correctly clarified rather than writing a Decision.
- Wrong historical return: 0; not exercised.
- Cross-thread referent failures: 1 (S1 at T8).
- Invented subjects: 0.
- SIM-TEST:8-FIX1 reassessment recurrence: 0 in the executed journey; the focused FIX1 regression suite passed separately.

## E. Decision integrity

- Decisions created: 1.
- Duplicate Decisions: 0.
- Decision identity drift: 0.
- Silent replacement: 0.
- Wrong Scenario→Decision association: 0 writes. The attempted Delivery commitment clarified and kept the Decision count at 1.
- Ambiguous commitment writes: 0.
- Historical Decision mutation: 0.

Decision at T4: `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`, associated with Capacity. It remained the only canonical Decision through T8.

## F. Execution / Outcome integrity

- Executions: 1.
- Structurally invalid Decision→Execution links: 0; CC:11 linked the Execution to the Decision it was given.
- Wrong execution referents: 1. CC:5 supplied the Capacity Decision despite active Delivery context.
- Duplicate Executions: 0.
- Premature Executions: 1.
- Outcomes: 0.
- Wrong Execution→Outcome links: 0; not exercised.
- Outcome confusion: 0; not exercised.

Execution at T8: `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`.

## G. Cross-thread relationships

Tested cross-thread transitions: Capacity Decision → Delivery focus → Delivery options/commit attempt → execution request. Shared Variables, shared Evidence, causal claims, and identity merges were not reached before the stop. Material cross-thread contamination count: 2 manifestations from one context-scope root (stale Capacity Scenario set at T6, wrong Capacity execution referent at T8).

## H. Temporal / Ground Truth

- Unpublished asks: 0.
- Ground Truth leak hits: 0.
- Background changes: 0.
- Published changes: 1 initial publication.
- Stale evidence: 0 measured.
- Current state ignored: 0 temporal cases.
- Temporal confusion: 0.

The manager firewall remained closed. Data Reality was current at tick 0 from `ERP:v1`, `PRODUCTION:v1`, `INVENTORY:v1`, and `MAINTENANCE:v1`.

## I. NMI / Stage / Advisor

- Canonical subject mismatches: 0.
- L1/L2/L3 identity failures: 0 in the reached path.
- Stage identity failures: 0.
- Stage density failures: 0.
- Advisor divergence: 0 new and 0 known Delivery/Capacity instances in this journey.
- NPS label mismatches: 4 known-debt observations (T5–T8, Capacity Gap label while Delivery is active).

At the blocking turn, canonical subject, L1, Stage, and Advisor all agreed on `obj-delivery`. This makes the Capacity Execution a downstream action-binding error, not a Stage or Advisor identity error. The known Advisor Delivery/Capacity debt was not encountered or repaired. The known NPS label debt was encountered and kept separate.

## J. Raw vs product findings

| Finding | Raw | Product | Classification |
| --- | ---: | ---: | --- |
| S1 | 1 | 1 | `WRONG_EXECUTION_REFERENT` / `CROSS_THREAD_REFERENT` |
| S2 | 1 | 1 | `SCENARIO_SET_CONFUSION` |
| S3 | 4 | 4 | Known NPS Capacity Gap label under active Delivery, T5–T8 |
| Known debt | — | 4 | NPS label mismatch observations |
| Observer errors | — | 0 | None |
| Test expectation errors | — | 0 | None |
| Expected clarification | — | 1 | Delivery `Go with A.` made no write |

The existing journey Observer did not emit a row for either cross-thread defect; SIM-TEST:9 classified the recorded canonical ledger evidence. This is not a false green: product status is NOT CERTIFIED.

## K. Regression actually run

- SIM-TEST:6 / FIX18: `nexoraSimulationReferentRegressionFix18.test.ts` passed.
- SIM-TEST:7: full population not rerun.
- SIM-TEST:8 / FIX1 / RECERT: `nexoraSimulationReassessmentFix1.test.ts` passed; full adaptive/RECERT populations not rerun.
- Decision/Execution owning layer: `executiveDecisionCommitment.test.ts`, `executiveExecutionRuntimeAdapter.test.ts`, and `nexoraSimulationDecisionFix15.test.ts` passed.
- Existing lifecycle integration: `nexoraSimulationLifecycleJourney.test.ts` passed.
- Test Funnel Level 1 Focused: PASS, 0 failures, 0 required tasks running/uninspected.
- Test Funnel Level 2 Layer: PASS, 0 failures, 0 required tasks running/uninspected.
- Test Funnel Level 3 Integration: PASS, 0 failures, 0 required tasks running/uninspected.
- Level 4: not run. The certification had already stopped on product S1; no production repair was introduced.

## L. Architecture integrity

No duplicate authority, store, runtime, world, event engine, Operator, Manager, Observer, conversation engine, referent authority, NMI, Stage, Advisor, Decision, Execution, Outcome, Variable, Data Reality, or Ground Truth was introduced. Production changes: 0. The added test only schedules the existing RMS/CC:5/CC:10/CC:11 authorities and records read-only evidence.

## M. Repair recommendation (not implemented)

Root: CC:5 execution-request Decision binding in `conversationalExperienceOrchestrator.ts`. The execution copy path takes the first globally Approved Decision from `decisionRuntime.listDecisions()` and sends its ID to CC:11 without proving that it is the uniquely intended Decision for the active canonical subject.

Smallest proposed FIX scope: at the existing CC:5 execution handoff seam, resolve an explicit or context-valid canonical Decision; if active context has no unique matching approved Decision, clarify/refuse. Keep CC:11 and its canonical Decision→Execution integrity unchanged.

Same-root manifestations: stale cross-thread action selection after a valid subject switch. Downstream symptoms: wrong management-thread Execution and the false manager-facing statement `Execution has started.` The Capacity Scenario set persisting under Delivery is a separate earlier S2 candidate and should be diagnosed rather than folded into this S1 without further evidence.

Detailed machine-readable replay: `blocking-run.json`. Focused test: `nexoraSimulationMultiThreadCertification.test.ts`.

NPA-T SIM-TEST:9 — NOT CERTIFIED
