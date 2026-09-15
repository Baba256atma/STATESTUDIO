# NPA-T ECA:12 — Architecture Inspection

**Phase:** Learning & Reassessment Dialogue
**Date:** 2026-09-14
**Stop condition:** Inspect + reuse; certify ECA:12 only. Do not create ECA:13 / durable Learning.

## Existing ownership (reuse)

| Concept | Authority | Role for ECA:12 |
| --- | --- | --- |
| Outcome assessment | ECA:11 / CORE-OUT:1 / DTH:11 | Required input; not recalculated |
| Learning Theatre | DTH:12 / CORE-OUT:2 | Consumed; not replaced; not durable by default |
| Dialogue objective | ECA:6 | Closure overlay may inform; ECA:12 is not second objective store |
| Recommendation | ECA:7 | Repeat questions do not create second scorer |
| Causal safety | ECA:11 attribution + CORE-INT | No causal inflation |
| Decision / Goal / Risk / Scenario | Canonical writers | Advisory reassessment only |
| Data semantics | DATA-ADV | CAP_AV unconfirmed preserved |
| Durable memory | APP-4 | Not repurposed; writesApp4 = false |

## ECA:12 module

- `frontend/app/lib/nexora-conversation/ecaExecutiveLearningClosure.ts`
- Entry: `judgeEcaExecutiveLearningClosure`
- Session: ephemeral `EcaLearningClosureSession`
- Overlay: `applyEcaLearningClosureToPresentedResponse`
- Scope fixed: `learningScope: "case-specific"`
- `durableWrite: false` always

## Models (existing terms)

**Learning:** `NONE` | `UNKNOWN` | `TENTATIVE` | `SUPPORTED` | `WEAK` | `CONTRADICTED` | `INCONCLUSIVE`

Maps: NO_RELIABLE_LEARNING ≈ `NONE`; HYPOTHESIS_ONLY ≈ `WEAK` / strengthened-but-unproven; TENTATIVE_LEARNING ≈ `TENTATIVE`; SUPPORTED_LEARNING ≈ `SUPPORTED` (Goal met + improved, still case-specific).

**Closure / reassessment:** `CONTINUE` | `READY_TO_CLOSE` | `READY_TO_REASSESS` | `WAIT_FOR_EVIDENCE` | `PAUSE` | `BLOCKED`

**Reassessment targets:** `ASSUMPTION` | `EVIDENCE` | `SCENARIO` | `DECISION` | `EXECUTION_APPROACH` | `GOAL` | `UNKNOWN`

## Boundaries (hard)

- Outcome ≠ Learning ≠ proven causality ≠ durable truth
- Learning writes = 0; APP-4 writes = 0
- Reassessment advisory only; Decision history unchanged
- No second Learning / causal / reassessment / recommendation / objective store
- Do not create ECA:13

## Minimal extension this phase

- `SUPPORTED` when OBSERVED + IMPROVED + Goal MET/EXCEEDED (still case-specific; no causal proof)
- Intent recognition for remember / change next time / change the decision / consider before retry
