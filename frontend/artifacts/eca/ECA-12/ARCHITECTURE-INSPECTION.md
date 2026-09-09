# NPA-T ECA:12 — Architecture Inspection

Date: 2026-09-08

## Current repository state

ECA:1–11 are certified. ECA:11 is `judgeEcaExecutiveOutcome`, wired after ECA:10, session overlay only. This phase continues that wiring: ECA:12 is a further late-stage read-only overlay. ECA:13 is not started.

Known ECA:11 runtime nuance preserved: CC:11 completion remains confirmation-required. Manager-reported Outcomes may remain CORE-OUT:1A session captures (`OUTCOME_PARTIAL` / `PARTIALLY_OBSERVED`).

## Who owns what

| Question | Authority |
| --- | --- |
| Learning interpretation | CORE-OUT:2 `projectGroundedLearningIntelligence` |
| Durable Learning / APP-4 | APP-4 `ExecutiveMemoryStorageEngine` only via explicit CORE-OUT:2 promotion handoff. DTH:12 / CORE-OUT:2 `writesMemory: false` by default. |
| Reassessment Theatre | DTH:12 presentation; CORE-OUT:2 eligibility |
| Decision mutation | CC:10 / CC:10R |
| Goal mutation | existing Goal authority |
| Conversation objective lifecycle | CONV:2 thread + ECA:6 strategy overlay |
| Who may mark an objective complete | CONV:2 / ECA:6. ECA:12 judges READY_TO_CLOSE; it does not write a second lifecycle store. |
| DTH:12 already does | Outcome → Learning & Reassessment Theatre presentation (`strengthened` / `weakened`, reassessment states). No APP-4 write. |
| CORE-OUT:2 already does | Bounded Learning candidates (`candidate` / `supported` / `inconclusive` / `contradicted` / `conflicting`), promotion eligibility, `establishesCausation: false`. |
| ECA:6 already does | Multi-turn objective type/lifecycle (ACTIVE/PAUSED/RESUMED/COMPLETED/…), side-question continuity, CONV:2 reuse. |
| ECA:12 uniquely adds | Conversational Learning/reassessment framing + objective **closure judgment** consumed later by ECA:6/CONV:2 session overlay. |
| ECA:12 must NOT duplicate | CORE-OUT:2 engine, DTH:12 Theatre, ECA:6/CONV:2 store, APP-4 writer, ECA:11 Outcome semantics. |

## Completion / reuse matrix

| Concept | Authority | ECA:12 |
| --- | --- | --- |
| Outcome interpretation | ECA:11 | Consume only |
| Outcome capture | CORE-OUT:1A session | Consume |
| Learning interpretation | CORE-OUT:2 | Conversational frame; no second engine |
| Learning Theatre | DTH:12 | Explain; never replace |
| Assumption effect vocabulary | DTH:12 `strengthened` / `weakened` / `unchanged` / `unresolved` | Reuse |
| Objective lifecycle | ECA:6 / CONV:2 | Closure judgment only |
| Initiative | ECA:3 | No second engine |
| Questions | ECA:4 | Gap identification only |
| Intake / correction | ECA:5 | Consume |
| Durable memory | APP-4 | Writes 0 |
| Decision / Execution / Goal | CC:10, CC:11, Goal | Writes 0 |

## Acyclic wiring

Certified order remains:

ECA:1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → **12**

ECA:12 is appended. It does **not** feed same-turn ECA:6. Closure judgment is session overlay (`ecaLearningClosureSession`) for subsequent canonical reconciliation. This avoids an ECA:6 → ECA:12 → ECA:6 cycle.

When ECA:12 `speak` is true, the ECA:11 overlay is skipped so Outcome recap does not drown a Learning/closure answer.

## Outcome → Learning gate

If ECA:11 observation is `NOT_YET_OBSERVED`, `UNKNOWN`, `STALE`, or `CONFLICTED`, ECA:12 Learning is `NONE` or `INCONCLUSIVE`. Execution complete ≠ Learning. ECA:11 `attribution: NOT_ESTABLISHED` forbids causal Learning.

## Durable memory

CORE-OUT:2 `GROUNDED_LEARNING_BOUNDARY.writesMemory` is false. Promotion to APP-4 is a separate explicit path. ECA:12 never calls APP-4.

## Session / refresh

Session overlay: last Learning fingerprint, accepted cause-unknown, explicit close/keep-open, last closed objective type. Not a Learning store. Hard reload: overlay empty; do not reconstruct durable lessons.
