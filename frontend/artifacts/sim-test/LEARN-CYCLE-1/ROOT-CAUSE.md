# LEARN-CYCLE:1 root cause (pre-implementation)

Traced Family L production path with no product repair.

## A. Canonical Learning read owner

CORE-OUT:2 `listSupportedGroundedLearningForSubject` (LEARN-REASSESS:1).

## B. ECA:12 reassessment output

`EcaExecutiveLearningClosureJudgment`: `consumedSupportedLearning`, `coreOut2LearningIds`, `learningStatement`.
`EcaLearningClosureSession` persists only `lastLearningNote` / `lastFingerprint` — not Learning identity.

## C. Where `coreOut2LearningIds` exist

Turn-local ECA:12 judgment only. Not on `NexoraExecutiveScenarioSession`. Not on Decision Runtime records.

## D. CC state after R1

`nextScenarioSession` = `retainActiveScenarioOptionCollection(scenarioResult?.nextSession, previousScenarioSession)`.
Reassessment is not a CC:9 turn, so the cycle-1 Scenario session is reused unchanged.

## E. Scenario-session owner

CC:9 `executiveScenarioResolver.ts` / `NexoraExecutiveScenarioSession`.

## F. Decision-context owner

CC:10 `executiveDecisionCommitmentResolver.ts` + Decision Runtime. Commitment already reads `scenarioSession` for scenarioId.

## G. What survives R1 → "Options."

Focused Capacity subject, cycle-1 Scenario candidates, ECA `lastLearningNote`. Not CORE-OUT:2 ids.

## H. What survives Options → "Go with A."

CC:9 session candidates → CC:10 commits D2 from that session’s intervention Scenario. Still no R1 Learning provenance.

## I. First lost point

**Reassessment → Scenario Context**

Exact contract: after LEARN-REASSESS attach in `conversationalExperienceOrchestrator.ts`, `nextScenarioSession` is emitted without reassessment provenance. `lastLearningNote` is Advisor residue, not management context.

## J. Smallest existing seam

Optional read-only `learningInformedReassessment` on existing `NexoraExecutiveScenarioSession`:

- stamp when ECA:12 consumed supported Learning for a resolved `obj-*` subject and the turn is not a clarification
- preserve through CC:9 session updates (spread)
- clear when CC:9 scopes to a different management subject
- Decision continuity is transitive via D2.scenarioId from that session

No Learning→Decision relationship. No cycle store. No CORE-OUT copy.
