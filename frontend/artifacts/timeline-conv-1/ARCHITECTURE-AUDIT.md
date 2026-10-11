# NPA-T TIMELINE-CONV:1 — pre-implementation architecture audit

Audit completed before production modification on 2026-10-11.

## Reproduction and first divergent layer

`historicalTruthManagerJourney.test.ts` records the certified pre-phase behavior:

- `executiveAdvisoryPurposeOf("what happened with capacity?") === null`
- `executiveAdvisoryPurposeOf("show me capacity history") === null`

The first divergence is therefore CC:1 purpose classification. Historical Truth and Historical Presentation already contain the required Capacity facts and are not the divergent layer.

Expected: the two utterances select a bounded canonical-history query. Actual: no executive advisory purpose is selected.

## Existing owners and exact call path

1. Manager utterance intake and live response rendering
   - File: `frontend/app/executive/nex-mvp/NexoraExecutiveShell.tsx`
   - Symbol: `onSubmitConversationalUtterance`
   - It accepts the Ask Nexora turn, creates the manager message, supplies registered conversational subjects, invokes CC:5, applies the existing governed LLM presentation completion, and appends `presented.nexoraMessage`.
   - Component: `frontend/app/executive/nex-mvp/NexoraConversationalInput.tsx` / `NexoraConversationalInput`.
2. Intent and advisory-purpose classification
   - File: `frontend/app/lib/conversational-control/conversationalIntentResolver.ts`
   - Symbols: `resolveNexoraConversationalIntent`, `executiveAdvisoryPurposeOf`, `matchExecutiveQuestion`.
   - Existing `historical-review` means returning to an earlier issue/problem thread. It is not a canonical Historical Truth query and must remain separate.
3. Subject resolution and language aliases
   - File: `frontend/app/lib/manager-object/managerObjectCatalog.ts`
   - Symbol: `projectManagerObjectConversationalSubjects`.
   - File: `frontend/app/lib/manager-object/nexoraMvpFinal61NaturalLanguageUnderstanding.ts`
   - Symbol: `interpretManagerTurnMeaning`.
   - These consume the registered conversational subject catalog; CMSI is not a language resolver.
4. Referent continuity
   - File: `frontend/app/lib/manager-object/nexoraMvpFinal62ConversationContinuity.ts`
   - Symbols: `interpretContextualManagerTurn`, `updateConversationContinuity`.
   - File: `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
   - Symbol: `finalize`, which applies those authorities and writes the existing session continuity.
5. Clarification
   - File: `frontend/app/lib/manager-object/nexoraMvpFinal63ClarificationResolver.ts`
   - Symbol: `interpretClarificationTurn`.
6. Temporal boundaries
   - File: `frontend/app/lib/executive-time/executiveTimeContextResolver.ts`
   - Symbol: `resolveContextWindow`.
   - It owns deterministic calendar boundaries for `today`, `this_week`, `last_week`, `this_month`, `last_month`, and `this_year`, plus caller-supplied `custom_range` boundaries.
7. Canonical history read and Timeline/Activity presentation
   - File: `frontend/app/lib/historical-truth/historicalTruthPresentation.ts`
   - Symbols: `readCanonicalHistoricalPresentation`, `projectHistoricalPresentation`, `historicalActivityEntry`.
   - `readCanonicalHistoricalPresentation` delegates fact selection to `projectHistoricalTruth`; Timeline and Activity are projections of its returned membership.
   - The live shell already reads this seam in its `managerHistory` memo.
8. Deterministic Advisor response composition
   - File: `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
   - Symbol: `finalize` and its existing `explicitAdvisoryPurpose` branches.
9. Optional LLM participant and bounded-output governance
   - Files: `nexoraLlmConversationParticipant.ts`, `nexoraLlmGovernedOutput.ts`, `nexoraLlmManagerPresentation.ts`.
   - Symbols: `invokeNexoraLlmConversationParticipant`, `governNexoraLlmOutput`, `completeNexoraLlmManagerPresentation`.
   - The deterministic response remains the fallback when no participant is present or the provider fails.

Live call path:

`NexoraConversationalInput` → `onSubmitConversationalUtterance` → `executeNexoraConversationalExperience` → `resolveNexoraConversationalIntent` / canonical manager meaning → contextual referent + clarification → `finalize` deterministic response → governed optional LLM presentation → `presented.nexoraMessage`.

Historical visual call path:

Data Reality snapshot → `collectLiveHistoricalObservations` → `readCanonicalHistoricalPresentation` → `projectHistoricalTruth` → the same `managerHistory.timeline` / `managerHistory.activity` membership.

## Bounded implementation seam

Add a semantically distinct `historical-query` advisory purpose to the existing classifier. Pass a read-only canonical historical reader into the existing CC:5 input from the live shell. In `finalize`, after the existing language and continuity authorities resolve the subject, parse only the requested operation/time expression, obtain boundaries from Executive Time, invoke the supplied canonical reader, and format a deterministic response from that bounded result.

This seam creates no second router, subject resolver, truth projector, presenter, persistence layer, or production clock. It preserves `historical-review` unchanged.
