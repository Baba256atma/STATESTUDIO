# NPA-T OUT-LIVE:1 — Live Data Reality → CORE-OUT Observation Capture

## A. Status

**CERTIFIED.** This phase wires live RMS / conversation Data Reality publication into existing CORE-OUT:1A capture. It does not certify Outcome evaluation, causal attribution, durable Learning, or SIM-TEST:10.

## B. Root Cause

First missing live seam: **MVP-OUT:1 listened only to the live Data Reality journal**, while RMS Operator publication commits **CSV Data Reality** (`commitPreparedCsvRealDataImport`). CC:5 already **read** `listCapturedObservations()` for ECA/DTH/NPS but did **not** register execution capture context on the RMS conversation path.

EXI still calls `registerPostDecisionCaptureContext` via `nexoraOutcomeLearningRuntimeIntegration`; that is why the certified EXI path worked and RMS conversation captures stayed at 0.

A second mechanical gap: `resetCsvRealDataImportStoreForTests()` cleared CSV listeners, dropping the MVP-OUT CSV subscriber for later commits. Capture now re-subscribes from `resetPostDecisionCaptureForTests()`.

Owner: **MVP-OUT:1** (CSV ingest + multi-execution context map) with a narrow **CC:5** forward of existing CC:11 Execution records. CORE-OUT:1A remains the capture writer.

## C. Existing Authority Reused

- MVP-OUT:1-R2 `nexoraPostDecisionObservationCapture.ts`
- CORE-OUT:1A `captureOutcomeObservation` / `openOutcomeObservationWindow`
- Data Reality CSV store + existing RDI:2 Gate (`ingestSimulationCsvFile` / `commitPreparedCsvRealDataImport`)
- Live journal subscriber (unchanged EXI path)
- CC:5 `syncLiveExecutionCaptureContexts` after CC:11 executions exist
- CC:11 Execution identity unchanged
- NPS:8 `writesOutcome: false`
- ECA:11 reads mapped captured observations

New authority: **none**.

## D. Production Repair

| File | Function | Responsibility |
| --- | --- | --- |
| `frontend/app/lib/nex-mvp/nexoraPostDecisionObservationCapture.ts` | `syncLiveExecutionCaptureContexts`, `onCsvDataRealityPublish`, `ingestCsvCommitted`, `contextsForKpi` | Register one capture context per Execution; ingest latest CSV commit into CORE-OUT:1A; match by existing object identity map; skip pre-window observations; skip unmatched object identity |
| `frontend/app/lib/data-reality/csvRealDataImportStore.ts` | `listAllCsvRealDataImports` | Existing store listing for CSV capture (no second journal) |
| `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts` | `finalize` → `syncLiveExecutionCaptureContexts` | Forward CC:11 executions + CC:10 decisions + scenario source subject; does not evaluate or write Outcome |

Capture-context lifecycle: starts when an Execution is listed and a management subject can be resolved (`sourceSubjectId`, decision `obj-*` id, `subjectIds`, or focused `obj-*`). Keyed by `executionId` (not recency). Survives later turns and subject switches. Not replayed on register (temporal guard). Duplicate Execution registration is skipped. Window `openedAt` is the latest CSV `committedAt` at first register, or null if none.

Temporal guard: `isPostBoundaryObservation(observedAt, window.openedAt)` when a window exists; historical CSV is not ingested on register.

## E. Focused Tests

| ID | Result |
| --- | --- |
| T1 live capture | pass |
| T2 unpublished / hidden | pass |
| T3 pre-publication ask | pass |
| T4 post-publication ask | pass |
| T5 two Executions / E1 publication | pass |
| T6 E2 publication distinct | pass |
| T7 subject switch | pass |
| T8 duplicate publication | pass |
| T9 irrelevant publication | pass |
| T10 historical publication | pass |
| T11 delayed publication | pass |
| T12 Ground Truth firewall | pass |
| T13 Decision/Execution identity | pass |
| T14 FIX1 blocker | pass |
| T15 FIX2 isolation | pass |
| T16 reassessment | pass |
| T17 NPS read-only | pass |
| T18 Learning boundary | pass |

`nexoraOutLive1.test.ts`: **17 passed, 0 failed**.

## F. Live Capture Evidence

Replay signature (T1 helper): CC:5 `Start Capacity Decision D1.` after approved `d-capacity` / `execution-d-capacity`, then RMS Operator CSV at tick 15 (`manufacturing-capacity-pressure`).

- Executions: 1 (`execution-d-capacity`)
- Eligible publication: PRODUCTION CSV (`objectKey: production` → Capacity)
- Captures: **1** (not 0)
- Observation ID: `obs:sim-test-2:manufacturing-capacity-pressure:ev:production:rdi2:dataset:ev:PRODUCTION:15:import:kpi.production.capacity-utilization:2026-10-01T00:00:00.000Z`
- Binding: `executionId=execution-d-capacity`, `decisionId=d-capacity`
- Subject/metric: `nexora.executive-operations.object.production` / `kpi.production.capacity-utilization`

Publication is captured observation evidence. It is **not** Outcome = SUCCESS.

## G. Multi-Execution Evidence

Unit T5/T6: E1 production observation and E2 shipping observation are distinct (`d1`/`e1` vs `d2`/`e2`). Live multi-execution: Capacity production captures stay on E1; E2 does not receive production/capacity observations.

Cross-bindings: **0** in focused tests.

## H. Temporal Evidence

- Hidden world step with no Operator CSV: captures = 0
- Pre-Execution CSV then later Execution registration (no replay): captures = 0
- Delayed CSV after Execution: captures > 0
- Pre-window KPI (`observedAt` before `openedAt`): not captured

Incorrect captures in focused tests: **0**

## I. Ground Truth

Ground Truth leak hits: **0**

Unpublished Ground Truth is never the capture source. Capture uses committed CSV Data Reality only.

## J. Duplicate Safety

Same CSV commit identity (`sourceContextId:committedAt:datasetId`) is ingested once. CORE-OUT:1A `observationIdentity` returns `duplicateOf` without a second store entry. Live T8: observation count unchanged on replay at the same tick.

## K. Downstream Outcome Visibility

CC:5 / ECA:11 / NPS:8 can **read** `listCapturedObservations()` after live capture. Post-publication “Did it work?” is no longer blocked by an empty capture store.

This does **not** certify CORE-OUT:1 expected-vs-observed evaluation.

## L. Learning Boundary

CORE-OUT:2 / NPS learning after capture: `learningDurable: false`, NPS `writesLearning: false`. Classified as **expected / downstream**: evaluation has not established a durable lesson. Not repaired in OUT-LIVE:1.

## M. Regression

Rerun:

- `app/lib/sim-test/nexoraOutLive1.test.ts` (17/17)
- `nexoraLiveOutcomeObservationCapture.test.ts` (CORE-OUT:1A)
- `mvpOut1R2LiveExpectedObservation.test.ts` (MVP-OUT:1-R2)
- `npsOutcomeLearning.test.ts` (NPS:8)
- `ecaExecutiveOutcome.test.ts` (ECA:11)
- OUT-LIVE T14 (SIM-TEST:9-FIX1 blocker) and T15 (FIX2 isolation) and T16 (SIM-TEST:8-FIX1 short recovery)

Full `nexoraSimulationMultiThreadFix1.test.ts` / `Fix2.test.ts` files still contain failures in this working tree for `Start it.` without a current executive subject and some Scenario-set journeys. Those are **not** capture-store failures; OUT-LIVE T14/T15 gates passed. Not absorbed as OUT-LIVE:1 defects.

## N. Remaining Findings

- Downstream CORE-OUT:1 evaluation / expected-vs-observed: not certified
- Downstream CORE-OUT:2 durable Learning: absent; classified downstream
- SIM-TEST:10 recertification: not started
- B T5 Advisor/L1 lag: known independent debt
- NPS S3 labels: unchanged
- NCA ordinal debt: unchanged
- Full FIX1/FIX2 file failures above: independent of this capture seam

## O. Production Integrity

Production files changed:

- `frontend/app/lib/nex-mvp/nexoraPostDecisionObservationCapture.ts`
- `frontend/app/lib/data-reality/csvRealDataImportStore.ts` (`listAllCsvRealDataImports`)
- `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts` (import + `syncLiveExecutionCaptureContexts` in `finalize`)

Test-only: `nexoraSimulationTestHarness.ts` (reset capture contexts), `nexoraOutLive1.test.ts`.

No broad architecture rewrite.

## P. Architecture Integrity

No second Data Reality, journal, capture registry, Outcome store, Learning store, Decision/Execution authority, conversation authority, RMS world, Operator, NMI, Stage, Advisor, or NPS writer.

## Q. Next Action

Return to **SIM-TEST:10 full recertification from the beginning**. Do not start OUT-LIVE:2 automatically.

NPA-T OUT-LIVE:1 — CERTIFIED
