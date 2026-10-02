# NPA-T SIM-TEST:10-R7

Final full-loop recertification from turn 1 after LEARN-REASSESS:1 and LEARN-CYCLE:1.

Historical SIM-TEST:10-R5 and SIM-TEST:10-R6 remain **NOT CERTIFIED**. They were not rewritten.

## A. Final status

NPA-T SIM-TEST:10-R7 = **CERTIFIED**  
NPA-T SIM-TEST:10 = **CERTIFIED + SEALED**  
SEALED = **YES**

## B. Certification integrity

Started from turn 1: yes  
Production changes during R7: **0**  
Certification-only preserved: yes  
Digest before = after = `a90494e12bbb07bb76d1ab18c42b1ef0a794582a4731ce618fab7d55489d8361` (12705 files)

## C. Population

| Item | Count |
| --- | --- |
| Journeys | 33 |
| A–N families | 14 / 14 |
| RMS scenarios | 4 |
| Manager profiles | 12 |
| Seeds | 11 / 29 / 47 |
| Manager / Nexora turns | 356 / 356 |
| Long sessions | 6 |
| Events | 39 |
| Publications | 68 |
| Unpublished advances | 28 |
| Pre-publication Outcome asks | 13 |
| Post-publication Outcome asks | 50 |
| Learning asks | 11 |
| Reassessments | 5 |
| Loop-reentry attempts | 4 |
| Harness failures | 0 |

## D. Boundary ledger

| Boundary | Result |
| --- | --- |
| Scenario → Decision | PASS |
| Decision → Execution | PASS |
| Execution → Publication | PASS |
| Publication → Data Reality | PASS |
| Pre-action Data → Baseline | PASS |
| Data Reality → Observation | PASS |
| Observation → Evaluation | PASS |
| RDI History → Observed Direction | PASS |
| Observed Direction → CORE-OUT | PASS |
| Evaluation → Comparison-ready | PASS |
| Comparison-ready → Supported Learning | PASS |
| Learning → Durable Learning | OBSERVED |
| Learning → Reassessment | PASS |
| Reassessment → CC:9 Scenario Context | PASS |
| Scenario Context → Next Management Work | PASS |
| Scenario Context → Decision Commitment | PASS |
| Reassessment → Next Management Cycle | PASS |

## E. Family A

baseline ≈ 90.91, actual 100, RDI increase, expectedDirection maintain, comparison-ready, not-met, establishesCausation false, supported Learning. No reassessment (control).

## F. Family J

Clarification “Which item do you mean?” remains. Learning is consumed on resolved Capacity mapping. No forced Options/Decision.

## G. Family K

Supported Learning, reassessment consumes it, laterIntents empty. **CORRECT INCOMPLETE LOOP**.

## H–I. Family L

Classification: **LEARNING-INFORMED NEXT CYCLE**

- L1 subject: `obj-capacity`
- L1 / R1 ids: `learn:nexora-mvp:obj-capacity:outcome-learning:…:sim10r7-sim-test-10-l_loop_reentry:…`
- R1: `Is this still a problem?`, focused `obj-capacity`, `consumedSupportedLearning=true`
- Handoff source: `eca-12-reassessment`, subjectId `obj-capacity`, same ids
- Options turn 8 preserves handoff
- Go with A. turn 9, `decisionCount=2`, session still carries the same ids
- `canonicalLearningToDecisionLinkage=false` (no Learning→Decision edge)
- Replay `fnv1a32:f7b102e9`

## J. Outcome

50 observations, 25 eligible, 40 CORE-OUT:1, 25 comparison-ready, 0 incomplete, 15 not-observed, 0 met, 25 not-met, causation true 0 / false on evaluations.

## K. Direction

RDI 26 increase / 0 decrease / 0 stable / 7 null. CORE-OUT 25 increase / 15 null. Wrong projections 0.

## L. Learning

25 CORE-OUT:2 candidate inspections, 25 promotion-eligible supported unique ids, 0 inconclusive, 0 unsupported, 0 wrong-thread.

## M. Reassessment

5 asks, 5 consumedSupportedLearning=true, 5 coreOut2LearningIds, 4 clarifications, 0 wrong-subject consumption.

## N. LEARN-CYCLE handoff

5 CC:9 stamps on consumed reassessments. Wrong-subject handoffs 0.

## O. Next cycle

1 Learning-informed next-cycle (Family L). Temporal-only later actions in this population 0. Unproven 0. Wrong-thread 0.

## P. Full positive loop

Family L: S1→D1→E1→O1→EV1→L1→R1→CC:9 S2→CC:10 D2.

## Q. Correct incomplete loop

Family K; Family A (no reassessment).

## R–S. Isolation

Wrong-subject consumption 0, wrong-subject handoff 0, cross-thread Learning 0.

## T–V. Identity

FIX2 stale Capacity under Delivery/Revenue = false. FIX1 wrong-thread Capacity executions = 0. Wrong Execution bindings 0.

## W–Z. Integrity

Historical Observer labels unchanged (not product S1). Pre-pub 13, unpublished 28, future-knowledge 0. GT leaks 0. Unsupported causal claims 0.

## AA. Long sessions

6 long sessions. No material cycle-provenance drift beyond known Observer debt.

## AB. Profiles

12 profiles including Ambiguous, Distracted, Nonlinear, Impatient, Decision-oriented, Investigative, Skeptical, Data-challenging. Full-loop proof is Family L (decision-oriented). Ambiguous Family J still clarifies.

## AC. Raw findings

S0 0 / S1 141 / S2 0 / S3 1 (Observer taxonomy).

## AD. Product findings

Product S1 = 0. Material S2 = 0. S3 = Advisor/NPS wording.

## AE. Deterministic replays

Material mismatches = 0. Signatures: e `9fe2fc7d`, h `370f8c3b`, j `a4658e32`, k `60c24149`, l `f7b102e9`, a `db148607`, g `fca710db`, f `bdb530be`, c `ed667a7b`.

## AF. Regression

R7 population **1 pass / 0 fail**. Focused seams **502 pass / 0 fail**.

Not run: Level 4, full repository, SIM-TEST:10-R8, LEARN-CYCLE:2, OUT-DIR:2.

## AG. Production integrity

Changes during R7 = 0.

## AH. Architecture

New stores/authorities = 0. New Learning→Decision relationship = 0.

## AI. First divergent boundary

complete

## AJ. Classification

**FULL LOOP PROVEN**

## AK. Final decision

SIM-TEST:10 = **CERTIFIED + SEALED**

## AL. Next action

SIM-TEST:10 is closed. Do not start R8 or another SIM-TEST:10 repair. Return to the Nexora roadmap for the next real manager/product requirement.

---

NPA-T SIM-TEST:10-R7 — CERTIFIED  
NPA-T SIM-TEST:10 — CERTIFIED + SEALED
