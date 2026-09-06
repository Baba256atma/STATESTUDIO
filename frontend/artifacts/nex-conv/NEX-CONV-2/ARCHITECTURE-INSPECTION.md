# NEX-CONV:2 — Architecture inspection

Inspection date: 2026-09-05.

## CONV:1 current authority

NEX-CONV:1 remains canonical for **turn/purpose progression**.

- `resolveConversationalMove` selects a Conversational Move for `(subjectId, purpose)`.
- Coverage `NONE → INTRODUCTORY → DEEPENED → PRACTICAL → SATURATED` lives on `working.threads`.
- Object education IDENTIFY / WHY_PRESENT (and now COMPARE) consume that policy.
- FIX1/FIX2 named depths remain projections of the same coverage vocabulary.

NEX-CONV:2 does not duplicate that ladder.

## Suggested-action authority

Canonical composer remains entrance continuity:

- `suggestedActionsForObjectProgression(move, coveredPurposes)`
- Filters `NEXORA_OBJECT_EDUCATION_QUESTION_ACTIONS`
- No `goalActionsAfterWhy` / per-object action tables
- No second suggested-action engine

## Dialogue-state authority

Pending clarification and pending offer remain on CONV:1 working context (`pendingOffer`, `pendingClarification`). Thread Intelligence **projects** them. NCA dialogue remains meaning/clarification authority. ENT:10 / Skip / subject change clear or supersede offers.

## Observed clarification-loop root cause

CONV:1 scopes coverage per `(subject, purpose)`. After IDENTIFY saturates, another “What is this?” is correctly `CLARIFY` **for IDENTIFY**. The manager can still cover WHY_PRESENT and COMPARE as separate purposes. Returning to IDENTIFY therefore replayed generic clarification even though the **thread** already had useful coverage. That is not a CONV:1 defect; it is missing thread-level policy.

## Thread architecture

Bounded `ConversationThread` projected from CONV:1 `working.threads`:

- `threadId` = `objective:primarySubject` (deterministic, no UUID store)
- `objective`, `primarySubject`, `relatedSubjects`
- `coveredPurposes` / `openPurposes`
- `status`: `ACTIVE | SUFFICIENTLY_COVERED | WAITING_FOR_MANAGER | SUPERSEDED`

Not a transcript. Not IndexedDB. Not long-term memory. Session-scoped via existing entrance continuity. Hard refresh follows existing continuity (no new durable thread persistence).

## Conversation Objective

Canonical objectives (small set):

`UNDERSTAND_SUBJECT | UNDERSTAND_RELATIONSHIP | INVESTIGATE_SUBJECT | COMPARE_SUBJECTS | UNDERSTAND_STAGE | LEARN_CAPABILITY | RESOLVE_UNCERTAINTY`

Derived from purpose + previous thread objective (`objectiveFromPurpose`). This is **not** a business Goal, **not** NCA intent, **not** ENT lesson state, **not** authorization.

## Coverage projection

`projectConversationThread` filters CONV:1 threads for the primary subject. Failed `SHOW` (`lastMove === SHOW` and result ≠ `SUCCEEDED`) is not treated as covered. No second coverage store.

## Productive progression policy

`resolveConversationThreadMove` / `resolveThreadIntelligence`:

1. Explicit repeat → CONV:1 `REPEAT`
2. Genuine ambiguity (“not what I mean”) → `CLARIFY`
3. Valid pending offer accepted → CONV:1 move
4. Explicit revisit (relate/again/important for) → CONV:1 move
5. “I still don’t understand” → different productive direction
6. Current purpose not yet covered and turn is not CLARIFY → CONV:1 move
7. CONV:1 `CLARIFY` **and** ≥2 covered purposes → `SUMMARIZE` (≥3) or `OFFER_NEXT`/`CONNECT`
8. Else CONV:1 stands

Deterministic. No LLM. Manager remains in control (offers, never auto-advance lessons or business actions).

## Pending offer integration

Offers are recorded from the **resolved** thread move (`CONNECT` / `OFFER_NEXT` / `SUMMARIZE`). Acceptance requires matching `subjectId`. Subject change, Skip, DATA redirect, and ENT:10 supersede. No timers.

## Suggested-action integration

Covered purposes hide the corresponding chips (`what-is-this`, `why-here`, `difference`). Skip and next remain when available. Free text can still revisit covered purposes.

## Experience transition

- Skip: inactive continuity (FIX1/CONV:1 preserved)
- ENT:10: educational thread marked `SUPERSEDED`, pending offer cleared, handoff actions replace object-education chips
- FIX3 `GUIDED_ENTRANCE | EXECUTIVE_WORKSPACE` is read-only; thread does not write it

## Advisor boundary

Advisor/EI still own supported advisory content. Thread Intelligence does not answer Capacity Gap, invent cause, or rank collections. Normal `/executive` proof uses existing Advisor. Collection ranking remains NCA-POST.

## LLM boundary

No extra LLM/network hop for thread progression. Future language models may compose copy; thread `objective / coverage / resolvedMove / reason` stay inspectable.

## Duplicate-authority audit

| Concern | Authority |
| Meaning | NCA |
| Subject/reference | NCA / NXA / MO |
| Purpose progression / Conversational Move | NEX-CONV:1 |
| Conversation objective / thread progression | NEX-CONV:2 |
| Thread coverage | NEX-CONV:2 projection over CONV:1 |
| Clarification | NCA dialogue + CONV:1 CLARIFY; CONV:2 only overrides generic saturation-after-coverage |
| Suggested actions | Existing composer consuming thread coverage |
| Business semantics | MO / EI / domain |
| Advisor content | Advisor / EI / NCA |
| Presentation | Director / Stage |
| Decision | CC:10 / 10R |
| Execution | CC:11 |
| Data semantics | DATA-ADV / Data Reality |
| Lesson pacing | NEX-ENT |

No `goalLessonThreadTracker`. No `ThreadSuggestedActionsV2`. No second NLU, Advisor, Stage, or CONV:1 ladder.

## Classified, not CONV:2-owned

NCA:4 test M still hits NCA-POST multi-entity clarification (“Capacity and Delivery”) on a default `/executive` utterance. Unchanged. Not owned by thread intelligence.
