# NPA-T ECA:11 — Architecture Inspection

Date: 2026-09-08

## Current repository state

ECA:1–10 are certified. ECA:10 is `judgeEcaLiveExecution`, wired after ECA:9, session overlay only. This phase continues that wiring: ECA:11 is a further late-stage read-only overlay. ECA:12 is not started.

## Completion / reuse matrix

| Concept | Authority | ECA:11 |
| --- | --- | --- |
| Outcome capture | CORE-OUT:1A `captureOutcomeObservation` / `listCapturedObservations` (session) | Consume |
| Outcome evaluation | CORE-OUT:1 `projectLiveOutcomeIntelligence` (`establishesCausation: false`) | Consume comparison rules; do not duplicate a second evaluator |
| Outcome Theatre | DTH:11 | Explain; never replace |
| Percentage-point arithmetic | DTH:11 `formatOutcomePercentagePointDelta` | Reuse |
| Delivery utterance parse | DTH:11 `parseDeliveryOutcomeUtterance` | Already used by orchestrator capture |
| Learning / reassessment Theatre | DTH:12 / CORE-OUT:2 | Suggest only; no Learning write |
| Execution mutation | CC:11 | No writes |
| Decision mutation | CC:10 / CC:10R | No writes |
| Goal / KPI | existing Goal/KPI + catalog Delivery target 96 in capture provenance `target:96` | Read; no Goal mutation |
| Live execution dialogue | ECA:10 | Remains primary while Execution is live and no result evidence |
| Initiative | ECA:3 | No second engine |
| Questions | ECA:4 | Gap identification only |
| Intake | ECA:5 | Estimate/conflict consumed |
| Objective | ECA:6 `ASSESS_OUTCOME` | Consume |
| Durable Outcome writer | **None** on `/executive` | Do not invent |

## Exact authorities

1. **Outcome interpretation:** CORE-OUT:1 evaluation + ECA:11 conversational projection.
2. **Outcome write:** CORE-OUT:1A session capture only. No durable writer. ECA:11 writes 0.
3. **DTH:11:** Outcome Observation Theatre presentation.
4. **DTH:12:** Learning/Reassessment Theatre. ECA:11 may mention reassessment; does not write Learning or reopen Decision.
5. **Durability:** CORE-OUT:1A `storageLifetime: "session"`. Refresh clears overlay; do not reconstruct fake history.
6. **Baseline:** capture provenance `baseline:N` or CORE-OUT:1 baseline. Unknown → no improvement claim.
7. **Goal:** existing Goal objects; live Demand Surge capture reuses Delivery target `96` as provenance, not a new Goal writer.
8. **KPI:** Data Reality / catalog KPI. KPI ≠ Outcome object.
9. **Observed value:** CORE-OUT:1A capture and Data Reality. Manager report is partial, typically not `eligibleAsActualOutcome`.
10. **Expected result:** CORE-OUT:1 expectation (PREDICTION), not Goal automatically.
11. **Provenance:** capture `provenanceRefs`, validation/freshness on CORE-OUT:1A records.
12. **Causality:** CORE-OUT:1 `establishesCausation: false`. CORE-INT:3 remains causal constraint authority. ECA:11 never infers cause from sequence.
13. **What ECA:11 adds:** conversational result interpretation (baseline vs observed vs target, mixed results, missing evidence, attribution humility, one primary result) without a second Theatre or store.
14. **Must reuse:** CORE-OUT:1/1A, DTH:11 helper/parse/Theatre, ECA:1–10, CC:11, DTH:12 boundary.

## Outcome mode gate

ECA:11 speaks when:

- a linked CORE-OUT:1A / DTH:11 observation exists, or
- canonical Execution is `completed` and the manager asks a result question (pending Outcome).

If Execution is still live and no observation exists, ECA:10 remains primary (`speak: false` on ECA:11).

When ECA:11 speaks, the ECA:10 overlay is skipped so “too early to judge Outcome” cannot contradict an observed result during active Execution (DTH:11 allows partial observation while `in-progress`).

Generic CC/command failure (`couldn’t complete that request`) is not Outcome truth. If ECA:11 has a manager-facing interpretation, it replaces that apology rather than concatenating.

## Binding

Decision-linked CC:11 Execution → CORE-OUT:1A captures with that `executionId` → DTH:11 mapped observation. No arbitrary aggregate.

## Numerical contract

Reuse `formatOutcomePercentagePointDelta`. 91 → 94 is **+3 percentage points**. 94 vs Goal 96 is **2 points below**, not a failure score.

## CAP_AV / Data

Unconfirmed CAP_AV cannot cause Outcome. Stale/pre-Execution KPI is not post-Execution Outcome. ECA:5 conflicts are surfaced, not silently resolved.

## Session / refresh

Session overlay: last outcome fingerprint, acknowledged result. Not a truth store. Hard reload: CORE-OUT:1A empty; ECA:11 recomputes UNKNOWN/NOT_YET.
