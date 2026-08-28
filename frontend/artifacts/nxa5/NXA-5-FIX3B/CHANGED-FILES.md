# Changed-file inventory

## Production (FIX3B semantic owners)

- `app/lib/manager-object/nexoraNcaPost4CollectionComparison.ts` — `criterionAmbiguous` / MATERIAL_IMPORTANCE_AMBIGUITY
- `app/lib/manager-object/nexoraNca3QuestionIntelligence.ts` — `buildNca3ComparisonCriterionClarification` / subject clarification
- `app/lib/manager-object/nexoraNca2ConversationState.ts` — PRIORITY allowlist answers
- `app/lib/manager-object/nexoraNca2ConversationStateTypes.ts` — PRIORITY expected-information (existing enum extension)
- `app/lib/manager-object/nexoraNxa5ExecutiveJudgment.ts` — criterion-specific insufficiency + explicit-criterion continuation
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts` — NCA:3 handoff, skip NXA:5 ranking while clarifying, preserve Stage on comparison

## Tests

- `app/lib/manager-object/nexoraNxa5Fix3BAmbiguousImportanceClarification.test.ts` — B1–B10 + continuation + B7
- `app/lib/manager-object/nexoraNcaPost4CollectionComparison.test.ts`
- `app/lib/manager-object/nexoraNxa5ExecutiveJudgment.test.ts` (neighbor insufficiency copy)

## Artifacts

- `artifacts/nxa5/NXA-5-FIX3B/*`
- Type-only annotations on `artifacts/nxa5/NXA-5-FIX3B-DIAG2/reproduce-nxa5-fix3b-diag2.ts` so the TypeScript gate compiles (no DIAG2 semantic change)

Unrelated worktree files (FIX3A, DIR, NXA:1–5, DIAG2 reports, shell/view, etc.) were preserved and are not attributed as this Fix’s production inventory.
