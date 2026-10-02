# NPA-T LEARN-CYCLE:1

Learning-informed reassessment → existing Scenario / Decision context handoff.

Starting evidence: SIM-TEST:10-R6 = NOT CERTIFIED. First divergence was Reassessment → Next Management Cycle (EXISTING-SEAM INTEGRATION GAP). Family L D2 was temporal-only. LEARN-REASSESS:1 remains CERTIFIED.

## A. Status

NPA-T LEARN-CYCLE:1 = **CERTIFIED**

SIM-TEST:10 is **not** certified by this phase.

## B. Starting evidence

R6: 33 journeys, Learning → Reassessment PASS, Reassessment → Next Management Cycle FAIL. Family L consumed L1 then Options / Go with A. / D2 with only temporal linkage.

## C. Root cause

ECA:12 judgment holds `coreOut2LearningIds`. `nextScenarioSession` retained the cycle-1 CC:9 session without that provenance. `lastLearningNote` is Advisor residue, not Scenario/Decision context.

Exact contract: `conversationalExperienceOrchestrator.ts` `nextScenarioSession` emit after LEARN-REASSESS.

## D. Existing authorities reused

- CORE-OUT:2 read (LEARN-REASSESS:1)
- ECA:12 consumption
- CC:9 `NexoraExecutiveScenarioSession`
- CC:10 Decision commitment from Scenario session
- NMI subject identity
- Decision / Execution runtimes unchanged

## E. First missing seam

**Reassessment → Scenario Context** (not Scenario → Decision).

## F. Production repair

- `executiveScenarioResolver.ts`: optional `learningInformedReassessment`; `withLearningInformedReassessmentProvenance`; clear on CC:9 subject-scope mismatch.
- `conversationalExperienceOrchestrator.ts`: `nextScenarioSessionWithLearningHandoff` stamps when ECA:12 consumed supported Learning for resolved `obj-*`.
- `conversational-control/index.ts`: export.

No Decision Runtime field for Learning IDs.

## G. Context contract

Read-only `{ subjectId, coreOut2LearningIds, source: "eca-12-reassessment" }` on the existing Scenario session. Snapshot of ids consumed by R1. Not a CORE-OUT:2 copy.

## H. No direct Learning→Decision edge

Confirmed. D2 records do not contain `learn:` ids. Continuity is L1 → R1 → Scenario session → D2.scenarioId.

## I. Family A

Upstream comparison-ready / not-met / maintain vs increase / supported Learning / no causation remains valid.

## J. Family J

“Which item do you mean?” preserved. No forced continuation.

## K. Family K

Learning-aware reassessment, then stop. No forced Options/Decision.

## L. Family L

- L1: CORE-OUT:2 Capacity supported Learning ids consumed on R1
- R1 subject: `obj-capacity`, `consumedSupportedLearning=true`
- R1 provenance: Scenario session `learningInformedReassessment`
- Options: same ids on session
- D2 via existing CC:10 from that session
- Classification: **LEARNING-INFORMED NEXT CYCLE**

Replay signature matched for Family L harness run.

## M. Strong continuity proof

Same CORE-OUT:2 ids on R1 ECA judgment, Options session, and Go with A. session, plus D2.scenarioId from that session — not same-subject + later time alone.

## N. Temporal-only / broken context

Capacity R1 → Delivery Options: Capacity provenance = false. Return to Capacity does not restore the stamp.

## O. Subject isolation

Wrong-subject continuity = 0 in focused tests.

## P. Multi-thread

SIM-TEST:9-FIX1/FIX2 regression passed. Capacity stamp does not ride Delivery Options.

## Q. No-learning / unsupported

Delivery reassessment without supported Learning: no stamp. ECA still consumes only supported CORE-OUT:2 (LEARN-REASSESS:1).

## R. Context lifetime

Session-scoped. Cleared when focused `obj-*` differs from stamped subject. Not a global latest Learning pointer.

## S. Ground Truth firewall

GT leaks = 0.

## T. Causation

Unsupported causal claims = 0.

## U. Historical integrity

R1 snapshot of Learning ids is copied read-only. CORE-OUT:2 records are not rewritten. D1 remains a separate Decision.

## V. Decision/Execution safety

R1: new Decision = 0, new Execution = 0. Options: new Execution = 0. Go with A. uses existing commitment policy.

## W. Determinism

Family L harness replay matched. Live Options replay from the same R1 state matched Learning ids.

## X. Idempotence

Repeated Go with A. does not duplicate Decisions.

## Y. Regression

LEARN-CYCLE:1: **12 pass / 0 fail**

Focused owner suites (LEARN-CYCLE:1, LEARN-REASSESS:1, OUT-DIR:1/R2, RDI-DIR:1, OUT-BASE/LIVE/EVAL, COMMIT-LIVE:1, CORE-OUT:1/1A/2, ECA:11/12, NPS:8 unit, CC:9/10, NMI live, SIM-TEST:8-FIX1, SIM-TEST:9-FIX1/FIX2): **542 pass / 0 fail**

Not run: SIM-TEST:10 recertification / R7; Level 4; LEARN-CYCLE:2; OUT-DIR:2; full repository.

## Z. Production integrity

Changed functions/files:

- `withLearningInformedReassessmentProvenance`, `scopeScenarioSessionToManagementContext` — `executiveScenarioResolver.ts` (`dab4d17a…acea`)
- `nextScenarioSessionWithLearningHandoff` — `conversationalExperienceOrchestrator.ts` (`eb9021df…770f`)
- export — `index.ts` (`a84c535c…ce8e4`)

Harness/contract only record the session field.

## AA. Architecture integrity

New Learning authority = none  
New Learning store = none  
New Outcome authority = none  
New reassessment authority = none  
New management-cycle authority = none  
New Scenario authority = none  
New Decision authority = none  
New Execution authority = none  
New direct Learning→Decision relationship = none  

## AB. Remaining boundary

At focused repair level: **Reassessment → Next Management Cycle = PASS**.

Do not treat this as SIM-TEST:10 CERTIFIED.

## AC. Next action

Preserve LEARN-CYCLE:1. The next authorized step is a full SIM-TEST:10 recertification from turn 1. Do not start LEARN-CYCLE:2 from this phase.

---

NPA-T LEARN-CYCLE:1 — CERTIFIED
