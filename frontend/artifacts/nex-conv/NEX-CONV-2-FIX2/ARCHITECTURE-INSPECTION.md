# NEX-CONV:2-FIX2 — Architecture inspection

Inspection date: 2026-09-06.

## 1. Exact observed transcript (defect)

Manager: Continue (after Stage focus is demonstrated)  
Nexora: Now that you know the Stage… A Goal represents… Improve delivery.

Manager: What is this?  
Nexora: That’s a Goal — something you want to achieve or improve.

Manager: Why is it on Stage?  
Nexora: It’s on Stage because it matters to the example situation…

Manager: What's the difference?  
Nexora: A KPI helps us see how something important is performing. A Goal is the direction; a KPI is how we observe performance.

Manager: Show me the next one  
Nexora (defect): **the same Goal/KPI COMPARE copy** (`KPI_COPY`)  
Stage: KPI is focused (`obj-nex-ent3-kpi`)  
Next “What is this?”: That’s a KPI — how we observe performance.

The Goal → KPI **lesson transition succeeded**. KPI IDENTIFY on the **following** turn succeeded. Same-turn Advisor copy was stale.

## 2. Exact stale response source

`KPI_COPY` in `nexoraObjectEducationExperience.ts`.

`copyForState("KPI")` returns `KPI_COPY`.

`differenceFor(goal|kpi)` also returns `KPI_COPY`.

So the NEXT turn looked like a COMPARE replay even when ENT had already advanced.

## 3. Exact old/new subject state (failing turn)

| Authority | Pre-action | Post-action (before fix, same turn) |
| --- | --- | --- |
| ENT:3 lesson | `GOAL` | `KPI` |
| Stage focus | `obj-nex-ent3-goal` | `obj-nex-ent3-kpi` |
| CONV thread primary | Goal | often still Goal / COMPARE |
| Advisor copy | COMPARE `KPI_COPY` | still `KPI_COPY` via `copyForState` |
| Suggested actions | Goal coverage (next/skip emerging) | eventually KPI after later turns |

## 4. Exact lesson transition function

`resolveNexoraObjectEducationTurn` → `classifyObjectEducationMove` (`NEXT` before pending-offer COMPARE) → `presentStep` → `nextState("GOAL") === "KPI"` → `selectNexoraMVPInteractionSubject(..., "obj-nex-ent3-kpi")`.

ENT remains lesson owner. CONV does not set KPI lesson state.

## 5. Exact action-result contract

Reused/extended canonical result: `NexoraConversationActionResult` in `nexoraConversationActionResult.ts`.

Identity: `NEX-CONV:2-FIX2/PresentedActionResult`.

Fields: `requestedCapability`, `status` (`SUCCEEDED | FAILED | UNAVAILABLE`), `previousSubjectId`, `resultingSubjectId`, `owner`, `lessonBefore`, `lessonAfter`.

Does not execute ENT/Stage. Does not write business truth. Not `ConversationActionResultV2`.

## 6. Exact composition timing (old)

1. NCA / object-education classifier (pre-action Goal context understands “next one”).
2. `presentStep` mutates ENT + Stage.
3. Response = `copyForState(newState)` immediately, **without** CONV reconcile of resulting subject.
4. Suggested actions from object-education question list / prior coverage, not from post-action thread.
5. CONV `lastDecision` stayed on Goal COMPARE until the **next** question.

Composer saw COMPARE purpose / Goal subject. `KPI_COPY` won because it is both KPI lesson copy and COMPARE copy.

## 7. Exact suggested-action timing (old)

Chips were composed in `freezeTurn` from the education helper **after** Stage changed, but using pre-action CONV coverage (Goal COMPARE saturated). They lagged the presented subject until later IDENTIFY/WHY/COMPARE on KPI.

## 8. Proven root cause

**Response composed from pre-action CONV purpose / `copyForState(KPI)` which is identical to COMPARE copy, after ENT/Stage already advanced, without an authoritative ActionResult driving post-action reconcile.**

Not: lesson-transition failure. Not: KPI understanding failure. Not: React render order. Not: animation timeout.

Secondary bug found while repairing: `answerWithKernel` referenced `coverageOf` / `coverageThreadOf` without importing them. Guided ownership threw; orchestrator `try/catch` (lines ~1237–2724) then `finalize` `STAGE_META` overwrote with NXA:5-FIX4 Stage scene copy. Import restore is required for object-education questions to own the turn.

## 9. Old ordering

Understand request (pre-action) → execute ENT/Stage → **compose from `copyForState` / stale COMPARE** → chips from old coverage → CONV catches up on a later turn.

## 10. Corrected ordering

Understand request (pre-action Goal/lesson)  
→ execute through ENT:3 `presentStep` / Director-Stage focus  
→ `freezeConversationActionResult`  
→ on failure/unavailable: keep subject, compose unavailability, chips of current subject  
→ on success: `reconcileConversationAfterAction` (pending offer cleared, KPI thread `UNDERSTAND_SUBJECT`)  
→ `composeObjectProgressionCopy` from **resulting** kind/purpose/move  
→ `suggestedActionsForObjectProgression` from **resulting** covered purposes  

Result first. Response second.

## 11. Authority matrix

| Concern | Authority |
| --- | --- |
| Manager meaning | NCA (`interpretCanonicalManagerMeaning`) |
| Pre-action subject | ENT:3 `objectEducation` + CONV working thread |
| Turn move | CONV:1 `resolveConversationalMove` |
| Thread objective | CONV:2 `resolveThreadIntelligence` |
| Educational progression | ENT:3 `nextState` / `presentStep` |
| Requested presentation | Guided entrance / object-education handoff |
| Presentation | Director + Stage (`selectNexoraMVPInteractionSubject`) |
| Action result | `NexoraConversationActionResult` (observation of ENT/Stage) |
| Resulting subject reconciliation | `reconcileConversationAfterAction` (CONV working only) |
| Response content | Educational composer `composeObjectProgressionCopy` / ENT copy |
| Response composition | same composer after reconcile |
| Suggested actions | `suggestedActionsForObjectProgression` (existing) |
| Decision | CC:10/10R / NEX-EXP:7 |
| Execution | CC:11 / NEX-EXP:8 |
| Data semantics | DATA-ADV / Data Reality |

## 12. Duplicate-action audit

One semantic NEXT path: chip label utterance `Show me the next one` and free-text both hit `classifyObjectEducationMove` → `resolveNexoraObjectEducationTurn`. No second NEXT engine. Conversation education (ENT:4) may own **later** Continue/NEXT after Object REVIEW; that is curriculum handoff, not a parallel Goal→KPI path.

## 13. Duplicate-result audit

Single presented-action result type stored on `working.lastActionResult`. Developer diagnostics on the executive shell (`data-nex-conv-action-*`, `data-nex-conv-parity`) are read-only projections. No second result store.

## 14. Continue: What appears here? → Continue

During Stage education, `What appears here?` is answered by ENT:2 object-list copy. `Continue` while `!focusDemonstrated` is the **Focus demonstration** step (`resolveStageEducationTurn`). Classification: **expected curriculum**, not stale NEXT parity.

Repeated Continue after focus follows current lesson state (object education NEXT), not replay of Focus copy.

On existing `/executive`, Continue does not commit Decision or start Execution.

## 15. Coverage rule (explicit)

- First Goal opening (`HANDOFF` + `OBJECT_INTRO` + `GOAL_COPY`): `establishIdentifyCoverage: false`. First `What is this?` remains CONV:1 ANSWER (“That’s a Goal…”).
- Successful **later** NEXT introductions: `establishIdentifyCoverage: true` once (`NONE` → `INTRODUCTORY` with `materialContextChanged`). Same-turn copy is `explainKind` (KPI identity), **not** `KPI_COPY`.
- Following `What is this?` is DEEPEN (“In practice…”), not a second INTRODUCTORY and not a skip to SATURATED.
- REVIEW/COMPLETED overview uses `copyForState` and does **not** re-advance Goal IDENTIFY.

## 16. Pending offers

Successful ActionResult clears `pendingOffer` / `pendingClarification`. Explicit NEXT outranks stale COMPARE offer. Goal COMPARE coverage remains on the Goal thread for relationship questions (`What's the difference?` after KPI still uses Goal/KPI educational compare copy).

## 17. Failed / unavailable NEXT

`nextState(state) === state` (COMPLETED) or presentation focus mismatch → `UNAVAILABLE` / `FAILED`. Subject, thread, and chips stay on the prior educational object. No optimistic KPI. After REVIEW, live Continue may hand off to ENT:4 conversation education; ENT:3 unavailable is proven by calling `resolveNexoraObjectEducationTurn` on COMPLETED.

## 18. Business safety boundary

Goal → KPI (and Object education generally) writes Goal/KPI/Decision/Execution/Outcome/Learning/Data confirmation/BCA: **0**. Conversation ActionResult is not a business Outcome. Educational KPI is not a manager KPI write.

## 19. Presentation failure

If `selectNexoraMVPInteractionSubject` does not focus the intended actor, status is `FAILED`, lesson stays `lessonBefore`, response is unavailability copy. No silent success.

## 20. No CONV:3

No new NLU, Advisor, Stage, chip engine, LLM hop, RAG, or memory. No phrase patch `if (text === "Show me the next one")`. No Goal→KPI-only router.
