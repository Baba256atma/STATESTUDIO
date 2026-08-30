# DTH:12 — Architecture inspection

## Smallest extension point

Project a read-only **Learning & Reassessment Theatre** from an existing DTH:11 Outcome observation. Scene intent **reuses DTH:5 `REVIEW_OUTCOME`**. No `REVIEW_LEARNING` intent was added.

Canonical flow:

Outcome observation (CORE-OUT:1A session) → Theatre interpretation using CORE-OUT:2 rules (outcome ≠ learning, no causality invention, writesMemory false) → DTH:12 overlay → Director → Stage.

DTH:12 does **not** call APP-4 persist or CORE-OUT:2 `promoteGroundedLearningToApp4`.

## Canonical Learning facts that actually exist

| Authority | Writer? | Durable? | Notes |
|---|---|---|---|
| CORE-OUT:2 | Interpretation only (`writesMemory: false`) | No | Status candidate/supported/inconclusive. Promotion to APP-4 is a separate explicit function Theatre does not call. |
| EI:6 | Adapter | No | `ownsLearningInterpretation: false`. Completion ≠ success. Does not infer causality. |
| APP-4 | Durable executive memory | Yes when explicitly persisted | Conversational/executive memory ≠ Theatre Learning. Not written by DTH:12. |
| NEX-EXP:10 | Entrance experience | Session overlay | Owns first-time workspace “What did we learn?”. Existing `/executive` stays Theatre. |
| CC:11 / CORE-OUT:1A | Execution / observation | **Session only** | DTH:11 certified durability debt. Learning cannot outrank this evidence. |

**There is no durable Learning writer on existing `/executive` Theatre.** Confirmed Learning is unused. `LEARNING_CONFIRMED` is never projected.

## Theatre interpretation

| Outcome | Learning state | Reassessment |
|---|---|---|
| none | no projection | — |
| `OUTCOME_PENDING` | `LEARNING_CANDIDATE`, insufficient | `NO_REASSESSMENT` |
| `OUTCOME_PARTIAL` / `OUTCOME_UNCERTAIN` | `LEARNING_UNCERTAIN` | available if below target |
| `OUTCOME_OBSERVED` | `LEARNING_SUPPORTED` (interpretation, not confirmation) | `REASSESSMENT_AVAILABLE` if below target |

Never `REASSESSMENT_REQUIRED`. Weakened ≠ false. No invented assumption records. Target-expectation may weaken when a stated goal exists.

## Handoff

DTH:11 overlay remains while evidence is insufficient. When an observation exists, the Learning overlay includes the Outcome (91% → 94%, goal 96%) so observation is not erased.

## Reload

Hard reload cannot reconstruct Learning without session Outcome. Honest absence.

## Not started

A further Theatre phase after DTH:12. No new Decision store, Learning store, or automatic loop.
