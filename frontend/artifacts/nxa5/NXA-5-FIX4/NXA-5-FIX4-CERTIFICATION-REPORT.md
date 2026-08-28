# NXA:5-FIX4 Certification Report

Advisor↔Stage Context Intelligence, Scene Awareness & Presentation Consent

## 1. Root cause

Advisor answered collection-grounded turns without a read-only semantic model of the authoritative Stage. Three independent defects composed:

1. Stage-grounded comparison (`which one is more important for business?`) was owned by the scenario-advice engine and/or mapped `business` to `OVERALL_SIGNIFICANCE`, so NCA-POST:4 never asked a criterion and never kept a pending PRIORITY question.
2. Collection confirmation (`I am talking about Scenarios`) was treated as a missing business-outcome question (NCA:1) rather than confirmation of the already-presented collection.
3. Criterion tokens (`risk`, `capacity`) were resolved as object/collection navigation (Focus Risk / show-risks / Focus Capacity) because pending comparison completion was not classified before standalone navigation.

No second Stage store existed; the failure was missing Stage *read* participation in turn resolution.

## 2. First semantic divergence

Mandatory sequence, first wrong meaning:

- After `show me scenarios` the Stage was correct (Scenarios: Capacity Expansion Plan, Demand Surge, Pricing Response).
- `which one is more important for business?` diverged: comparison criterion was treated as overall-significance / generic advice instead of an unresolved importance criterion while the Scenario collection remained presented.

Conversation then lost the collection as the comparison subject (`I am talking about Scenarios` → “which business outcome…”). Presentation often stayed on Scenarios; the Advisor context did not.

## 3. Existing Stage authority reused

- Runtime `NexoraMVPObjectInteractionState` (focus, `collectionContext`, workspace)
- DIR `directNexoraPresentation` / `applyDirectorPlanToStage`
- Queue labels `EXECUTIVE_QUEUE_CATEGORY_LABELS`
- NCA-POST:2 collection query
- NCA-POST:3 workspace/scene replies for Overview (no collection/focus)
- NCA-POST:4 comparison meaning and candidate set
- CC:5 orchestrator + CC:4 runtime apply
- NCA:2 session fields only as *last authorized presentation* / *pending consent* metadata, not collection truth

## 4. Files inspected

- `frontend/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts`
- `frontend/app/lib/nex-mvp/nexoraMVPConversationalRuntimeBridge.ts`
- `frontend/app/lib/director/nexoraSemanticPresentationDirector.ts`
- `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `frontend/app/lib/manager-object/nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts`
- `frontend/app/lib/manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts`
- `frontend/app/lib/manager-object/nexoraNcaPost4CollectionComparison.ts`
- `frontend/app/lib/manager-object/nexoraNca1ConversationArchitecture.ts`
- `frontend/app/lib/manager-object/nexoraMvpFinal63ClarificationGate.ts`
- `frontend/app/executive/nex-mvp/NexoraExecutiveShell.tsx` (authority path; not rewritten)

## 5. Files changed

- `frontend/app/lib/manager-object/nexoraNxa5Fix4StageContextIntelligence.ts` (new read model)
- `frontend/app/lib/manager-object/nexoraNxa5Fix4StageContextIntelligence.test.ts`
- `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `frontend/app/lib/manager-object/nexoraNcaPost4CollectionComparison.ts`
- `frontend/app/lib/manager-object/nexoraNcaPost4CollectionComparison.test.ts`
- `frontend/app/lib/manager-object/nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts`
- `frontend/app/lib/manager-object/nexoraMvpFinal63ClarificationGate.ts`
- `frontend/app/lib/manager-object/nexoraNca2ConversationStateTypes.ts`
- `frontend/app/lib/manager-object/nexoraNca2ConversationState.ts`
- `frontend/artifacts/nxa5/NXA-5-FIX4/` (this report, executor + live transcripts)

## 6. Stage Context read-model design

`projectAuthoritativeStageContext({ runtimeState, catalog, lastAuthorizedPresentation, goalLabel })` is a **read model**. It projects:

- `presentationType`: OVERVIEW | FOCUS | COLLECTION | UNKNOWN
- `focus`, `collection` (kind, label, member ids/names)
- `visibleMembers`
- `goalContext`
- `presentationReason` (from last DIR act when present; otherwise a proven current-state sentence)
- `snapshot` compatible with POST:3 `StageSemanticSnapshot`

It does not write Stage, copy members into NCA as truth, or reconstruct Stage from chat history.

## 7. Request↔Stage relationship model

`classifyRequestStageRelationship`:

- `EXPLICIT_PRESENTATION` — show/open/focus/go/bring-up verbs (utterance), not overlay-only `show-*` on confirmation language
- `STAGE_META` — scene/stage questions
- `STAGE_GROUNDED` — deictic comparison/reference, collection confirmation, pending criterion tokens
- `STAGE_COMPATIBLE` — knowledge/explain that can keep Stage; consent replies
- `STAGE_INDEPENDENT` / `AMBIGUOUS` — no safe Stage dependency

Consent yes/no is classified as compatible continuation of pending presentation consent, not as a new collection command.

## 8. Stage-meta / Scene Awareness rule

When Stage has a collection or focus, STAGE_META answers from the read model (`composeStageSceneExplanation` / `composePresentationReasonReply`). Overview with no collection/focus keeps POST:3 workspace copy (“visual workspace”). Scene questions do not write observations, Goals, Problems, evidence, Decisions, or Executions.

DIR reason codes are humanized; kebab-case codes are never spoken.

## 9. Contextual-reference rule

Deictic `which one` / `them` / `these` / `they` resolve against **current Stage collection members**, not stale `lastCollection` when Stage presents a collection. Singular `this`/`it` keep existing focus/scene precedence. Stale NCA context does not override a newer Stage presentation.

## 10. Conversation vs Presentation rule

Bare/off-stage knowledge (`what is Capacity?` while Scenarios are presented) explains without Focus. Visible member names (`Demand Surge`) may still focus (FIX3A). Explicit `show Capacity` / `focus on` / `go back to <collection>` still mutate through DIR.

Conversational subject ≠ presentation command.

## 11. Presentation Consent rule

Consent is offered only when Stage has meaningful collection context, the request is not an explicit presentation command, and Advisor discussed an off-stage object. `yes` applies DIR FOCUS; `no` keeps Stage. No consent on `show`/`focus`/`go to`/`go back to`.

## 12. Pending clarification interaction rule

Pending PRIORITY (comparison criterion) outranks standalone object/collection navigation for criterion tokens (`risk`, `urgency`, `capacity`, …) via POST:4 `isExecutiveComparisonCriterionAnswer` and skip of keep-current auto-focus.

Collection confirmation preserves the pending PRIORITY question.

Explicit complete collection commands still escape pending state (FIX3B-DIAG2R).

`that one` / `that option` continue advisory/comparison context; they do not become missing-subject Stage questions.

## 13. Stage mutation rule

Mutate only when DIR requires it: explicit presentation, consent-yes, or certified workflow presentation. STAGE_META, STAGE_COMPATIBLE, collection confirmation, and active comparison preserve incoming Stage. `shouldCommitRuntime` follows that decision.

## 14. Stage safety / no-hallucination rule

If runtime Stage is unavailable, Advisor says it cannot determine the current presentation. Reasons are only humanized DIR/runtime facts. Visual co-presence is “presented because / included in / related to”, not “causes”, unless evidence already establishes causality.

## 15. Automated test results

- FIX4 suite: pass
- POST:4: pass (including criterion-token vs focus, `important for business` remains ambiguous)
- FIX3A, FIX3B, FIX3B-DIAG2R: pass
- NCA:1–7, NCA-POST:1–4, NXA:1–5, FIX2, CC experience/intent: 317 tests pass in the combined regression batch
- 6.3 smart clarification: pass after assertion/deictic skips that were eating NCA:4/NCA:7

## 16. TypeScript results

`NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck` — **pass** (exit 0).

## 17. Production build results

`npm run build` (Next.js 16.0.10) — **pass** (exit 0), `/executive` present. Rebuilt after scene-copy humanize.

## 18. Live /executive adversarial transcript results

Rebuilt runtime: `next start -p 3001` (PID 92618, stopped after proof). Existing `:3000` listener PID 62339 was not killed.

Sequence (Advisor + Stage each turn; 0 page errors):

| Turn | Stage after | Mutation |
|---|---|---|
| show me scenarios | Scenarios ×3, no focus | yes |
| what is on stage? | unchanged | no |
| why are they here? | unchanged | no |
| which one is more important for business? | unchanged; criterion ask | no |
| I am talking about scenarios | unchanged; confirmation + criterion restated | no |
| risk | unchanged; risk comparison, not Focus Risk | no |
| explain Demand Surge | Scenarios remain | no |
| what is on stage now? | Scenarios remain | no |
| what is Capacity? | Scenarios remain; consent offer | no |
| what is on stage now? | Scenarios remain | no |
| show Capacity | Capacity focus | yes |
| what is on stage now? | Capacity focus; humanized reason | no |
| go back to scenarios | Scenarios ×3 | yes |
| compare them | Scenarios remain | no |

Artifacts: `live-stage.json`, `executor-adversarial.json`, `turn-*.png`, `live-adversarial.png`.

## 19. Regression results

- Funnel L1 Focused: pass
- Funnel L2 Layer: pass
- Funnel L3 Integration: pass
- Funnel L4 not run (funnel policy: not after every edit). Typecheck + production build run as FIX4 gates.
- DIAG2R pending escape, FIX3A visible-member Demand Surge, collection show Problems/Scenarios, Explain it after Demand Surge: protected by retests.

## 20. Remaining debt

- `what is Capacity?` still uses the existing Explain/attention composition rather than a dedicated ontology blurb; Stage preservation and consent are satisfied.
- Internal `intent.kind` for a completed `risk` criterion can still read as `focus` even though Stage is not mutated; POST:4 owns the answer.
- `lastAuthorizedPresentation` on NCA:2 is last DIR metadata, not a parallel Stage.
- Funnel L4 omnibus was not executed in this stop.

None of these are known semantic, Stage-awareness, unauthorized-mutation, or pending-state failures on the mandatory sequence.

## 21. Final status

NXA:5-FIX4 = CERTIFIED
