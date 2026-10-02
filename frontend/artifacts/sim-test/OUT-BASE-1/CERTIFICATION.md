# NPA-T OUT-BASE:1 — Pre-Action Data Reality Baseline

## A. Status

**OUT-BASE:1 = CERTIFIED**

## B. R3 gap

SIM-TEST:10-R3 had CORE-OUT:1 evaluations > 0 and supported Learning = 0 because comparisons were `comparison-incomplete` with `missingEvidence: ["baseline"]`. CORE-OUT:2 ran and correctly returned inconclusive / not-promotion-eligible. That was correct no-learning: no legitimate pre-action reference point reached CORE-OUT:1.

## C. First divergent layer

| Field | Value |
| --- | --- |
| Owner | MVP-OUT:1-R2 post-decision capture |
| File | `nexoraPostDecisionObservationCapture.ts` |
| Functions | `syncLiveExecutionCaptureContexts`, `ensureCaptureWindow`, `resolvePreExecutionBaseline` |
| Missing input | `openOutcomeObservationWindow({ baselineObservationId })` was always `null`; pre-E CSV was not ingested because `onCsvDataRealityPublish` requires an Execution context |

CORE-OUT:1 already requires `baseline` (`compareOutcomes` → `baseline-missing`). CORE-OUT:1A already projects `window.baselineObservationId` via `baselineFromObservation` (rejects `observedAt > window.openedAt`).

## D. Existing baseline architecture

No new store. Canonical path:

Published CSV / live Data Reality (already in `listAllCsvRealDataImports` / live journal)
→ capture unlinked CORE-OUT:1A observation (not an actual)
→ `window.baselineObservationId` frozen at window open
→ `projectOutcomeObservationCapture.baseline`
→ CORE-OUT:1 `resolvedBaseline`

Selection rule: among already-published KPIs matching **subject + expected Outcome dimension**, take the **latest `observedAt`**. CSV keeps one commit per `sourceContextId`, so later pre-E commits replace earlier ones in Data Reality; that latest remaining value is the baseline. CORE-OUT:1A already ignores a candidate whose `observedAt` is after the window boundary.

When Decision `committedAt` is earlier than the Data Reality clock, the comparison window `openedAt` is raised to the baseline measurement time so CORE-OUT:1A will accept it. Post-E actuals still require `observedAt > openedAt`.

No freshness thresholds were added.

## E. Production repair

| File | Change |
| --- | --- |
| `frontend/app/lib/nex-mvp/nexoraPostDecisionObservationCapture.ts` | Resolve and capture pre-E published KPIs; set `baselineObservationId` when opening the existing CORE-OUT:1A window |

## F. Baseline evidence (focused tests)

| Class | Result |
| --- | --- |
| Pre-E publications used | tick 0 (and tick 8 in T4) manufacturing CSV |
| Baselines resolved | T1, T4, T6, T8–T11, T15, Family A |
| Correctly missing | T2 (no pre-E), T3 (hidden GT), T5 (post-E only), T7 (unrelated ingest not in Data Reality) |
| Wrong-metric | Capacity baseline dimension = expected `capacity-utilization`, not shipping |
| Post-E as baseline | 0 |
| Hidden-state baseline | 0 |

## G. Baseline identity

Family A sample: subject `obj-capacity`, metric `capacity-utilization`, value ≈ 90.91, `measuredAt` `2026-09-16T00:00:00.000Z`, provenance = production CSV import ids. Window keeps that snapshot after later ticks.

## H. Comparison

After baseline + actual: `missingEvidence` no longer includes `baseline`. Status remains `comparison-incomplete` with `incompatibilityReason: incompatible-evidence-shape` because CORE-OUT:1 compares direction only when `actual.observedDirection` is set, or numeric target+comparator. `numericTarget` stays null. This is **outside OUT-BASE:1**.

## I. Example (Family A, not hard-coded)

| Field | Value |
| --- | --- |
| Baseline | ~90.91 capacity-utilization |
| Expected direction | maintain |
| numericTarget | null |
| Actual | 100 |
| Comparison | incomplete / incompatible-evidence-shape |

## J. Temporal integrity

Post-E-as-baseline errors = 0. Hidden-state baseline = 0. Historical rewrite of frozen window baseline = 0 (T10).

## K. Multi-thread

T9: Capacity E1 baseline remains on Capacity window; Delivery E2 does not reuse the Capacity window id.

## L. Causation

`establishesCausation` remains false. CORE-OUT:2 not modified.

## M–O. Regressions

COMMIT-LIVE T19: Go with B. → Start it. binds one Capacity Execution.  
OUT-LIVE T18: post-E publication still eligible actual.  
OUT-EVAL-LIVE suite: 18/0.

## P. CORE-OUT:2 observation (not certified)

Family A: candidates `inconclusive`, `not-promotion-eligible`, `createsLearning = false`.

## Q. R3 Family A replay

Previously: comparison-incomplete, missing baseline.  
After OUT-BASE:1: **baseline present**; still comparison-incomplete for **other** CORE-OUT:1 shape (no observedDirection / no numeric target).

## R. Regression

- OUT-BASE:1: **17 pass / 0 fail**
- Focused (OUT-EVAL-LIVE, OUT-LIVE, COMMIT-LIVE, CORE-OUT:1/1A/2, MVP-OUT:1 + R2 + R3, NPS:8 unit+runtime, ECA:11/12 unit+runtime, SIM-TEST:9-FIX1/FIX2, SIM-TEST:8-FIX1): **425 pass / 0 fail**
- SIM-TEST:10-R4 / Level 4: **not run**

## S. Production files changed

`frontend/app/lib/nex-mvp/nexoraPostDecisionObservationCapture.ts` only.

## T. Architecture integrity

New baseline authority = none  
New baseline store = none  
New Outcome authority = none  
New Learning authority = none  
New Data Reality = none

## U. Remaining boundary

CORE-OUT:1 `comparison-ready` still needs an existing comparable **shape** (numeric target+comparator, or expected direction **and** actual `observedDirection`). Do not invent targets or direction from baseline in OUT-BASE:1.

## V. Next action

Return to **NPA-T SIM-TEST:10-R4** from turn 1. Do not start OUT-BASE:2.
