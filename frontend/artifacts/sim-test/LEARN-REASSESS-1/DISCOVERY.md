# LEARN-REASSESS:1 — T1 root discovery (before production change)

## Path

manager utterance
→ CC:1 `resolveNexoraConversationalIntent`
→ deictic reassessment (`isCurrentSubjectReassessmentUtterance`)
→ CC:2 canonical subject
→ action-invocation clarification **or** Advisor assembly
→ `synchronizeLiveCc5OutcomeEvaluation` (MVP-OUT:1 → CORE-OUT:1/2)
→ `judgeEcaExecutiveLearningClosure` (ECA:12)
→ Advisor `applyEcaLearningClosureToPresentedResponse`

## A. Where supported Learning is stored/exposed

CORE-OUT:2 `nexoraGroundedLearningIntelligence` in-memory `byFamily` / `byId`. Written by `projectGroundedLearningIntelligence` during MVP-OUT:1 `integrateNexoraOutcomeLearningRuntime`.

## B. Existing Learning read/query API

- `groundedLearningHistory(family)` — family versions
- `presentGroundedLearning(intelligence)`
- `retrieveHistoricalGroundedLearning` — APP-4 durable memory, **not** live CORE-OUT:2
- Live CC path: `synchronizeLiveExecutionOutcomeEvaluation` → `answers.learning`

## C. Learning identity fields

`learningId`, `learningType`, `status`, `promotionEligibility`, `subjectId`, `decisionRefs`, `executionRefs`, `outcomeAssessmentRefs`, `observationRefs`, `statement`

## D. Subject identity

Runtime `focusedSubject.id` (`obj-capacity`). Conversation `currentSubject` may be a Scenario id after Options/Outcome.

## E. Outcome provenance

Learning fingerprints CORE-OUT:1 status/result + expected id + actual observation id.

## F. Reassessment intent owner

CC deictic reassessment + ECA:2 `REASSESS` (`reassess|reconsider`). ECA:12 `classifyIntent` only treats a narrower “should we reconsider” set as REASSESS. “Is this still a problem?” is deictic CC reassessment, often **not** ECA:12 REASSESS.

## G. Canonical subject owner

CC:2 / NCA active subject / runtime focusedSubject. Not Stage.

## H. Advisor context assembly

`finish()` Advisor path: ECA:12 judgment → `applyEcaLearningClosureToPresentedResponse`. Clarification can return earlier (`Which item do you mean?`) and never reach ECA:12.

## I. First missing seam

`conversationalExperienceOrchestrator.ts`: `synchronizeLiveCc5OutcomeEvaluation` is invoked and **discarded**. `judgeEcaExecutiveLearningClosure` is not given CORE-OUT:2 candidates. Reassessment therefore cannot consume supported Learning even when it exists.

EXI early-return (`classifyNexoraExiUtterance === "learning"`) covers “What did we learn?”, not “Is this still a problem?”.

## J. Smallest repair seam

1. CORE-OUT:2 read helper: list **supported + promotion-eligible** latest-per-family records for a resolved `obj-*` subject (not global-latest).
2. CC: after live sync, if this turn is a legitimate reassessment **and** an object subject is resolved, pass a **read-only** projection into ECA:12.
3. ECA:12 already claims to project CORE-OUT:2; use that as Advisor evidence/context. Do not write Learning.

## Family roots

| Family | Classification |
| --- | --- |
| J | **Correct clarification** when subject is ambiguous. Same missing seam if subject later resolves. Do not guess Learning. |
| K | **Same-root** once “reconsider” reaches Advisor: CORE-OUT:2 not attached. Independent DTH copy for “What should we reconsider?” must not become Learning authority. |
| L | **Same-root** on reassessment turn. Later D2 remains temporal-only. |

Do not create a Learning→Decision link.
