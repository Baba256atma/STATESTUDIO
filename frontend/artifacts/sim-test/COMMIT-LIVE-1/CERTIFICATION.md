# NPA-T COMMIT-LIVE:1

## A. Status

COMMIT-LIVE:1 = CERTIFIED

## B. Original Regression

SIM-TEST:10-R1 produced Decision = 0 and Execution = 0 because CC:5 threw on the live path before command mapping.

OUT-LIVE:1 added `syncLiveExecutionCaptureContexts` by **replacing** the existing `answerNexoraExiUtterance` import. Every turn that reached the EXI intercept (`conversationalExperienceOrchestrator.ts` `executeNexoraConversationalExperience`) raised `ReferenceError: answerNexoraExiUtterance is not defined`. The orchestrator catch converted that into `status: failed`, `commandResult: null`, `currentSubject` preserved as null. Options. never stored a presented CC:9 collection. Go with B. never reached CC:10. Start it. never reached CC:11.

## C. First Divergent Layer

Owner: CC:5 `executeNexoraConversationalExperience`  
Function: EXI intercept call to `answerNexoraExiUtterance`  
File: `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts`

Not CC:10 refusal, not FIX1 over-rejection, not missing Scenario candidates as a first cause. Candidates and commitment were downstream of the thrown turn.

## D. Production Repair

Restored the existing EXI import **alongside** the OUT-LIVE capture import.

- File: `conversationalExperienceOrchestrator.ts`
- Functions: none changed; `answerNexoraExiUtterance` is callable again
- Semantic responsibility: keep EXI intercept on the certified CC:5 path without dropping CORE-OUT capture wiring

No Scenario/Decision/Execution authority was added. FIX1/FIX2 selectors were not weakened.

## E. Scenario Commitment

| Measure | Result |
| --- | --- |
| Commitment attempts (T1, T3, T5–T8, T12, funnels) | exercised |
| Valid commitments | Capacity Go with B. → 1 Decision; Delivery Go with A./B. on a fresh set → 1 Decision |
| Expected clarifications | T5 no collection; T6 stale ordinal after Delivery switch without Delivery Options |
| Unexpected missing Decisions | 0 on the repaired path |
| Wrong Scenario commitments | 0 (ordinals scoped to presented collection) |

## F. Decision Evidence

- Distinct Decisions in multi-thread: 2 (Capacity do-nothing B + Delivery Investigate A)
- Max coexisting: 2
- Bindings: Decision.scenarioId = presented B/A; titles carry Capacity/Delivery
- Duplicates: T12 repeat Go with B. → still 1 Decision
- Silent replacement: T14 switch subjects → D1 title/scenarioId preserved

Known existing identity: `subjectIds[0]` on the do-nothing Decision can be `obj-budget` from Scenario intervention subjects. Identity is taken from Scenario ID + title, not a new metadata field.

## G. Execution Evidence

| Measure | Result |
| --- | --- |
| Start attempts | T2, T4, T9–T13, T17, funnels |
| Valid starts | current/explicit Decision → Execution |
| Expected clarifications | T10 Delivery Start it. with only Capacity D1 |
| Unexpected missing Executions | 0 on legitimate current/explicit starts |
| Wrong Decision bindings | 0 |
| Wrong-thread Executions | 0 |
| Duplicates | T13 repeat Start it. → 1 Execution |

## H. Multi-Thread Evidence

- D1 (Capacity B) → E1
- D2 (Delivery A) → E2 via current Start it.
- Explicit `Start ${D1.title}.` starts E1 without rewriting D2
- Cross-bindings = 0

Independent Delivery Go with B. uses the shared do-nothing Scenario ID string (`cc9:scenario:do-nothing:do-nothing:v1`). Isolated runtimes still produce a Delivery-titled Decision. Coexistence on one runtime uses Delivery A vs Capacity B, matching certified FIX1.

## I. FIX1 Evidence

`nexoraSimulationMultiThreadFix1.test.ts` pass 18 / fail 0.

Wrong-thread: Capacity D1 → Delivery. Details. → Start it. → Capacity Execution = 0, clarification. Signature remains context-safe selector + CC:11, not first Approved Decision.

## J. FIX2 Evidence

`nexoraSimulationMultiThreadFix2.test.ts` pass (suite included in 117 focused run, fail 0).

Capacity Options → Delivery Options: stale Capacity names = 0.

## K. Subject Integrity

Before repair: subject null after Capacity. Details. (failed throw).  
After repair: currentSubject = `obj-capacity` after Capacity. Details.; remains set through Options. and commitment.

Classification: subject-null was **same-root** as the missing EXI import, not a second subject store.

## L. Reassessment Regression

`nexoraSimulationReassessmentFix1.test.ts` pass. T15: Is this still a problem? → no invented title, Decision 0, Execution 0, Capacity referent held.

## M. OUT-LIVE Regression Guard

Valid E1 → Operator CSV publication → CORE-OUT captures > 0, bound to that Execution. No Outcome verdict claimed.

`nexoraOutLive1.test.ts` pass.

## N. Ground Truth

T18: RMS hidden Ground Truth inspected independently; Decision/Execution target remained conversation Scenario/Decision identity. Ground Truth target-selection hits = 0.

## O. Regression

| Suite | Pass | Fail | Classification |
| --- | --- | --- | --- |
| COMMIT-LIVE:1 T1–T18 + funnels + R1 sample | 20 | 0 | repaired by COMMIT-LIVE root |
| FIX15 (`nexoraSimulationDecisionFix15.test.ts`) | 11 | 0 | same-root repaired |
| SIM-TEST:9-FIX1 | 18 | 0 | preserved |
| SIM-TEST:9-FIX2 | included in 117 | 0 | preserved |
| SIM-TEST:8-FIX1 | included in 117 | 0 | preserved |
| CC:10 `executiveDecisionCommitment.test.ts` | included in 117 | 0 | preserved |
| CC:11 `executiveExecutionFollowUp.test.ts` | included in 117 | 0 | preserved |
| OUT-LIVE:1 | included in 117 | 0 | preserved |

Focused combined regression (FIX15+FIX1+FIX2+8-FIX1+CC:10+CC:11+OUT-LIVE): 117 pass / 0 fail.

## P. Production Integrity

COMMIT-LIVE production delta: restore `answerNexoraExiUtterance` import in `conversationalExperienceOrchestrator.ts`.

Workspace still contains prior uncommitted OUT-LIVE / FIX2 files (capture, scenario session scoping, CSV list). Those are not a second Decision/Execution authority.

No broad conversation redesign.

## Q. Architecture Integrity

- New Scenario authority = none
- New Decision authority = none
- New Execution authority = none
- New store = none

## R. Remaining Findings

- Outcome / Learning: still open (SIM-TEST:10, SIM-TEST:10-R1 not certified by this phase)
- Shared do-nothing Scenario ID across subjects: existing duplicate/idempotency; Delivery B after Capacity B does not mint a second Decision
- Decision `subjectIds` may list related objects (e.g. obj-budget) from Scenario interventions — existing, not a new identity map
- B T5, Advisor, NPS S3, NCA ordinal debt: untouched / known independent

## S. Next Action

Return to **NPA-T SIM-TEST:10-R2 — Full Outcome & Management Learning Recertification** from turn 1.

Do not start COMMIT-LIVE:2. Do not auto-start R2 in this phase.

NPA-T COMMIT-LIVE:1 — CERTIFIED
