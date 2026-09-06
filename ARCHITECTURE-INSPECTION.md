# NPA-T ECA:1 Architecture Inspection

Inspection date: 2026-09-06.

## Existing authorities

| Concern | Existing authority | ECA relationship |
| --- | --- | --- |
| Manager meaning, speech act, object references, ambiguity | NCA:1-7 and NCA-POST, especially `canonicalManagerMeaningInterpreter.ts`, `nexoraNca2ConversationState.ts`, and NCA-POST:2/3 | ECA consumes the result. It does not create a second NLU or overwrite meaning. |
| Conversation context and dialogue state | `NexoraConversationState` in `manager-object/nexoraNca2ConversationState.ts` | Canonical conversation/session input. ECA projects a read-oriented working view from it. |
| Turn/purpose progression | NEX-CONV:1 `resolveConversationalMove` and `nexoraConversationWorkingContext.ts` | ECA consumes coverage, pending offers, clarifications, and last decisions. |
| Conversation thread/objective | NEX-CONV:2 `projectConversationThread` and `resolveThreadIntelligence` | ECA consumes the existing thread projection; it does not add another progression ladder. |
| Stage focus, collection, visible objects | NXA:5-FIX4 `projectAuthoritativeStageContext` in `nexoraNxa5Fix4StageContextIntelligence.ts` | ECA reads focus, collection, and visible members separately from the conversational subject. |
| Manager-object identity and domain relation projection | MO:1 `managerObjectCatalog.ts` and `collectManagerObjectContext` | ECA uses registered subjects and object context as business references, never as a new store. |
| Semantic presentation and Stage mutation | DIR:1 plus NEX-MVP Stage/runtime authorities | ECA may propose presentation; it must not write Stage state. |
| Scene intent/script and Decision Theatre | DTH:1/DTH:5 `nexoraDecisionTheatreSceneIntent.ts` and `nexoraDecisionTheatreSceneScript.ts` | ECA records scene references and limitations; Theatre remains the presentation authority. |
| Advisor content and proactive attention | NXA advisor/runtime and P1:3-P1:5 Data Reality advisory chain | ECA may surface a bounded advisory proposal. It does not create causal claims, Problems, Risks, Decisions, or Execution. |
| Data source, evidence, field meaning | RDI/Data Reality, DATA-ADV, and workspace data-source registries | ECA retains source/field identity and semantic-confirmation status as supplied. It does not parse raw data or certify meaning. |
| Goal, Problem, Risk, Scenario | Manager-object/domain contracts and canonical runtime authorities | ECA stores references only. Domain lifecycle remains authoritative elsewhere. |
| Decision | CC:10/CC:10R canonical decision runtime | ECA can retain comparison/decision context but cannot approve or create a Decision. |
| Execution | CC:11 canonical execution runtime | ECA can retain execution context but cannot start or modify execution. |
| Outcome and Learning | CC:12, CORE-OUT, EI:6, and APP-4 durable memory authority | ECA consumes references/signals only. It does not create learning or durable memory. |
| Durable memory | APP-4 executive memory storage engine | ECA:1 does not persist working context. Existing entrance/conversation continuity is session-scoped and refresh behavior remains unchanged. |
| Manager-confirmed writes | Existing Manager-Object, Stage consent, CC:10, CC:11, and workspace object-approval writers | ECA may return a proposed change requiring explicit confirmation. It never calls or duplicates a writer. |

## Current focus and reference boundary

NCA and Manager-Object own conversational reference recovery (`activeSubject`, recent subjects, topic threads, and canonical object references). NXA:5-FIX4 owns the authoritative Stage read model. A Stage focus is therefore not automatically the conversational subject. ECA resolves an explicit manager reference first, then the existing conversation subject, then a valid recent reference. Stage focus is only supplied as Stage context or as a candidate for clarification.

## ECA forbidden writers

ECA must not duplicate or replace:

- NCA meaning, reference recovery, pending-question, or collection-query writers.
- NEX-CONV coverage, thread, suggested-action, or lesson-progression writers.
- Stage/runtime, Director, Scene Intent, or Decision Theatre writers.
- Data Reality, evidence, KPI, dataset, or semantic-confirmation writers.
- Goal/Problem/Risk/Scenario/Decision/Execution/Outcome/Learning lifecycle writers.
- APP-4 durable-memory persistence or retrieval writers.
- Existing manager-confirmation and object-approval writers.

## Refresh and session boundary

The existing NCA/NEX-CONV working state is carried through the existing entrance/conversation session. NEX-CONV:2 explicitly has no new durable thread persistence; hard refresh follows existing entrance continuity. ECA:1 therefore exposes a projection that can be recomposed from authoritative inputs, but does not add storage or claim that the projection survives refresh independently.

## Implementation decision

ECA:1 is implemented as a deterministic, immutable read projection in `frontend/app/lib/nexora-conversation/ecaWorkingConversationContext.ts`. It consumes canonical meaning, existing conversation state, NEX-CONV working context, Stage read context, registered subjects, and optional domain/data snapshots. It preserves unknowns, records provenance and confidence, distinguishes conversational subject from Stage focus, and returns an unexecuted mutation proposal when the manager asks to change business state.