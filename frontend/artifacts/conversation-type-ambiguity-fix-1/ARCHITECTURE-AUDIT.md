# CONVERSATION-TYPE-AMBIGUITY-FIX:1 Architecture Audit

Date: 2026-10-11  
Production repair status at audit time: **not started**

## Measurable stop condition

T49 must be traced to the first incorrect conversational transition and classified as `LEGITIMATE_AMBIGUITY`, `FALSE_AMBIGUITY`, or `STALE_AMBIGUITY`. Any repair must remain in the existing CC:1 / FINAL:6.3 authority chain, preserve canonical Decision/Execution ownership, make the focused simulation and historical suites zero-failure, and then pass the parent gates in order. Stop on any unresolved relevant failure, Timeline change, new authority, broad redesign, or test-specific production branch.

## Exact owner chain

1. **Manager input / CC:1 intent**
   - File: `app/lib/conversational-control/conversationalIntentResolver.ts`
   - Symbols: `resolveNexoraConversationalIntent`, `resolveMatch`, `matchExecutiveQuestion`
   - State: `NexoraConversationalIntentResolution.intent.kind`, trace reasons and target hints.
2. **Canonical language meaning**
   - File: `app/lib/manager-object/nexoraMvpFinal61NaturalLanguageUnderstanding.ts`
   - Symbol: `interpretManagerTurnMeaning`
   - State: `requestedOperation`, `objectReference`, `ambiguity`, `communicativeIntent`.
3. **Referent / continuity projection**
   - File: `app/lib/manager-object/nexoraMvpFinal62ConversationContinuity.ts`
   - Symbol: `interpretContextualManagerTurn`
   - State: `ContextualManagerMeaning`, including continuity candidates and active subject.
4. **Ambiguity classification / pending creation**
   - Files: `nexoraMvpFinal63ClarificationGate.ts`, `nexoraMvpFinal63ClarificationResolver.ts`
   - Symbols: `evaluateClarificationGate`, `uniqueCandidates`, `composeClarificationQuestion`, `interpretClarificationTurn`, `ask`
   - State: `PendingClarification.reason`, `originalUtterance`, `requestedOperation`, `candidates`, `expectedAnswer`, `consequence`, `originalIntentKind`.
5. **Answer consumption / suspended-intent resumption**
   - Files: `nexoraMvpFinal63ClarificationResolver.ts`, `nexoraMvpFinal63SmartClarification.ts`
   - Symbols: `matchCandidate`, `interpretClarificationTurn`, `applyResumedMeaningToIntent`
   - State: `ClarificationTurnResult.action/resumeOperation/resumeReference/resumeIntentKind`; consumed pending becomes `null`.
6. **CC:5 ordering / session write**
   - File: `app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
   - Symbol: `executeNexoraConversationalExperience` and its `finish`/`finalize` path
   - Order: CC:1 intent -> FINAL:6.1 -> FINAL:6.2 -> FINAL:6.3 -> optional resumption -> existing response/action routing -> frozen manager session.
7. **Canonical Decision boundary**
   - Files: `executiveDecisionRuntimeAdapter.ts`, `executiveDecisionCommitmentResolver.ts`, Decision Theatre projection
   - Owners: CC:10 runtime/commitment for writes; `listDecisions()` and Decision Theatre commitment projection for reads.
   - A `decision-status` inquiry is read-only and does not invoke a commitment transition.
8. **Canonical Execution boundary**
   - File: `executiveExecutionRuntimeAdapter.ts` and existing execution follow-up path
   - Owner: CC:11. FINAL:6.3 declares `commitsDecision: false` and `startsExecution: false`.

## Pre-repair reproduction

Smallest selected test:

`npx tsx --test --test-name-pattern='focused T42' app/lib/sim-test/nexoraSimulationClarificationFix1.test.ts`

Result: **0/1**, assertion expected T49 `clarificationRequired !== true`, actual `true`.

Direct CC:1/NLU probe for `This decision — is it still the active one?`:

- normalized: `this decision is it still the active one`
- CC:1 intent: `unknown`, confidence `0.2`
- CC:1 reason: `unknown-utterance-no-safe-mapping`
- FINAL:6.1 operation: `NONE`
- FINAL:6.1 object reference: `null`
- FINAL:6.1 ambiguity: unresolved `false`

Journey state from the bounded trace:

- T47 `That risk — what is driving it?`: new Margin problem/KPI ambiguity.
- T48 `Return to the capacity pressure we started with.`: applied focus to `obj-capacity`; pending clarification cleared.
- T49 `This decision — is it still the active one?`: `intentKind=unknown`; FINAL:6.2 continuity supplies mixed recent candidates; FINAL:6.3 creates a new `TYPE_AMBIGUITY`; response asks problem versus KPI.
- T49 active subject/referent: `obj-capacity` / `obj-capacity`.
- T49 candidate ids: `ctx-problem-capacity` (problem), `obj-capacity` (object/KPI), `ctx-problem-margin` (problem), `obj-budget` (object/KPI).
- Canonical state: one Decision, zero Executions; neither is mutated by the failed inquiry.

## First divergence and classification

Last correct state: T48 has Capacity active, no pending clarification, and the existing canonical Decision remains available.

First incorrect transition: CC:1 `matchExecutiveQuestion` does not recognize the explicit Decision-status semantics and returns `unknown`. Because FINAL:6.1 likewise has no operation/reference, continuity candidates from unrelated problem/KPI history are allowed to determine FINAL:6.3 ambiguity.

The ambiguity is **FALSE_AMBIGUITY**. The utterance explicitly supplies the entity type (`decision`) and asks whether it remains active. The four admitted problem/KPI candidates are eligible only as generic continuity candidates; they are ineligible to reinterpret this explicit Decision-status request.

## Ambiguity classes already owned

FINAL:6.3 already distinguishes reference, object, type, operation, comparison, correction-target, missing-subject, missing-operation, and unsafe-commitment ambiguity. Historical time ambiguity is separately bounded by the historical query adapter. T49 is not a legitimate request to collapse these classes or globally prefer Decision.

## Expected repair location

The earliest owner is CC:1 `matchExecutiveQuestion`. The bounded semantic repair is to recognize explicit Decision active/current/status inquiries as `decision-status`, after which the existing orchestrator's `clarificationOwnedByCanonicalIntent` rule lets FINAL:6.3 proceed and the existing Decision read projection answers from canonical CC:10 state. No Timeline, Historical Truth, CMSI, CC:10, or CC:11 production change is indicated.
