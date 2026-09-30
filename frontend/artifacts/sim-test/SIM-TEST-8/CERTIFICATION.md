# NPA-T SIM-TEST:8 — Adaptive Real Manager Simulation

**Verdict: CERTIFIED**

**NPA-T SIM-TEST:8 — CERTIFIED**

Baselines consumed: SIM-TEST:6 post-FIX18 FINAL and SIM-TEST:7, both CERTIFIED. This phase did not change Nexora conversation, Stage, Advisor, Decision, Execution, Ground Truth, Data Reality, or Operator behavior.

## A. Status

CERTIFIED. Raw observer labels included 25 S1 rows and 0 S0 rows. After classification, product S1 is 0. One new product S2 cluster is documented. One S3 row is the pre-existing NPS label debt. No repair was made. SIM-TEST:8-FIX1 was not started.

## B. Adaptive coverage

| Measure | Count |
| --- | --- |
| Journeys | 56 |
| Adaptive families A–J | 10, all executed |
| RMS scenario families | 4 |
| Manager profiles | 10 (SIM-TEST:7 profiles) |
| Seeds | 11, 29, 47 |
| Manager turns | 266 |
| Nexora turns | 266 |
| World advances without publication | 12 |
| Operator / Data Reality publications | 116 |
| RMS event traces | 85 |
| Unpublished manager asks | 22 |
| Recovery journeys | 6 |
| Hidden-change journeys | 6 |
| Delayed-observation journeys | 6 |
| Decision-change journeys | 6 |
| Execution-change journeys | 6 |
| Long adaptive sessions | 10, manufacturing |
| Short / medium / long | 40 / 6 / 10 |
| Harness failures | 0 |
| Replay mismatches | 0 of 25 raw-S0/S1 journeys |

Families executed: CHANGE_BEFORE_QUESTION, CHANGE_BETWEEN_TURNS, CHANGE_DURING_INVESTIGATION, CHANGE_DURING_SCENARIO, CHANGE_AFTER_DECISION, CHANGE_DURING_EXECUTION, RECOVERY, HIDDEN_CHANGE, DELAYED_OBSERVATION, COMPETING_CHANGES.

World ticks used the certified RMS:6 scheduler (`stepRmsEventSchedule`). Hidden and delayed families call `ADVANCE_WORLD` without Operator publication. Recovery on manufacturing composes the existing `RMS_NORTHSTAR_MACHINE_RECOVERY` fixture onto the certified manufacturing schedule and publishes through Operator → CSV → RDI → Data Reality. No second event engine was added.

## C. Product findings

Raw: S0 0, S1 25, S2 0, S3 1.

Product after classification: S1 0, S2 1 cluster (6 raw Advisor rows), S3 1 (NPS).

| Product | Root | Rows | Class |
| --- | --- | --- | --- |
| S1 | none | 0 | — |
| S2 | ST8-S2-REASSESS | 6 | New SIM-TEST:8 finding. “Is this still a problem?” is read as a named object “Is This Still A”. Canonical subject stayed Capacity |
| S3 | NPS label mismatch | 1 | Pre-existing SIM-TEST:6/7 debt |

Raw S1 dispositions are in `FINDINGS.md`. None is a Ground Truth leak, silent decision rewrite, stale evidence presented as current, or wrong object acted upon.

## D. Temporal integrity

Hidden Ground Truth (demand at tick 10, project/logistics/service events at 4–5) was applied without publication. Nexora answered from existing Capacity context and uncertainty. It did not name sealed keys or unpublished numbers. Leak scan on all 22 unpublished replies: 0 hits.

After later Operator publication, `CURRENT_STATE_IGNORED`, `STALE_EVIDENCE`, and `TEMPORAL_CONFUSION` did not fire. Numeric claims were not restated from the previous CSV version as if they were still current.

“Has anything changed?” after a hidden tick did not report the unpublished disturbance as a measured change. That is the correct no-knowledge boundary, not a failure to see Ground Truth.

The product still does not own a dedicated historical timeline. When it cannot interpret a recovery phrase, it asks or says there is no match, rather than inventing a before/after fact.

## E. Ground Truth firewall

Manager firewall `groundTruthAccess` was false on 56/56 runs. Behavior selection still cannot read sealed or Observer knowledge. Nexora responses in unpublished turns did not contain `availableCapacity`, `machineAvailability`, `confirmedCausal`, `evt:machine`, or “Ground Truth”. Observer event traces remain `hiddenFromNexora` and `hiddenFromManager`.

The six `OPERATOR_ERROR/OBSERVATION_GAP` rows are the Observer measuring that Ground Truth moved before Operator publication. That is the lag gate, not a Nexora leak.

## F. Decision / Execution integrity

| Check | Count |
| --- | --- |
| Duplicate decisions | 0 |
| Decision identity drift | 0 |
| Silent decision replacement | 0 |
| Premature execution | 0 |
| Duplicate execution | 0 |
| Wrong execution referent | 0 |
| Raw `MISSING_DECISION` | 12 |

All 12 missing-decision rows are `Let's go with the first option.` → `Which option do you want to commit to?`. No decision id was written, and later world ticks therefore had no historical Decision to rewrite. That is the same clarification boundary recorded in SIM-TEST:7, not a world-change rewrite.

## G. Regression status

No SIM-TEST:6 / FIX18 or SIM-TEST:7 certified behavior was reproduced here as a new product S1.

This phase did not re-run the full SIM-TEST:6 or SIM-TEST:7 suites. Owning-layer checks that did run: RMS:4 conversation verify, SIM-TEST:7 contract (certified utterances and no second runtime), and SIM-TEST:8 adaptive population 2/2.

## H. Architecture integrity

No second simulation world, event engine, Operator, Manager runtime, Observer, Ground Truth, Data Reality, conversation authority, management roadmap, Decision authority, Execution authority, Stage, Advisor, or Object authority was introduced.

`ADVANCE_WORLD` is a harness step over `stepRmsEventSchedule`. `classifyAdaptiveJourney` is read-only. `MACHINE_RECOVERY` reuses `RMS_NORTHSTAR_MACHINE_RECOVERY`.

## I. Repair recommendation

Do not start a FIX for Observer observation-gap, missing-decision clarification, or NPS S3.

Optional later phase, not started:

**NPA-T SIM-TEST:8-FIX1** — owning seam FINAL:6.1 / CC:1 referent recovery. Treat “Is this still a problem?”, “Do I still need to act?”, and “Does this decision still make sense?” as reassessment of the current canonical subject, not as a new named object. Same-root: six Advisor divergence rows plus the one repeated-clarification on the same phrase. Downstream: Advisor name mismatch while L1/Stage stayed on Capacity.

## Gates

| Gate | Result |
| --- | --- |
| G1 Adaptive world | PASS. RMS:6 ticks during manager journeys |
| G2 Publication boundary | PASS. Hidden advances do not publish. Delayed family publishes later through Operator/CSV |
| G3 No Ground Truth leak | PASS. S0 0. Unpublished leak scan 0 |
| G4 Temporal integrity | PASS. No stale-evidence or current-state-ignored rows |
| G5 Referent integrity | PASS. No WRONG_REFERENT. Canonical Capacity held on recovery asks |
| G6 Decision integrity | PASS. No drift, duplicate, or silent replacement |
| G7 Execution integrity | PASS. No premature, duplicate, or wrong-referent execution |
| G8 Recovery | PASS with documented S2. Subject identity was not replaced by an obsolete problem; the recovery phrase was not understood |
| G9 Observer integrity | PASS. Read-only. Raw S1 classified |
| G10 Replay | PASS. 25/25 signatures matched |
| G11 Architecture integrity | PASS |
| G12 Honest product severity | PASS. No unresolved product S1 |

## Final statement

NPA-T SIM-TEST:8 — CERTIFIED.

Blocking product evidence: none. Product S1 is 0. Documented S2 is ST8-S2-REASSESS. Documented S3 is the existing NPS label debt.
