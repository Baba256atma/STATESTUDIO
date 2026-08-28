# NXA:3-FIX1 — Legacy & Adjacent Regression Reconciliation

## 1–2. Original command and baseline

Command:

`npx tsx --test app/lib/manager-object/*.test.ts app/lib/conversational-control/*.test.ts app/lib/nexora-entrance/*.test.ts app/lib/director/nexoraSemanticPresentationDirector.test.ts`

**NXA:3-FIX1 BASELINE:** 933 tests; 887 passed; 46 failed; 0 skipped; 44 suites. TAP evidence was captured at `/private/tmp/nxa3-fix1-baseline.tap`.

## 3–5. Baseline failure ledger, classification, and root cause

| ID | Failure | Owner | Class | Root cause | Action | Status |
|---|---|---|---|---|---|---|
| REG-001 | Explicit Project workspace | CC:6 | B | Semantic presentation replaced capability-owned response | Restore capability precedence | FIXED |
| REG-002 | Implicit meeting context | CC:6 | B | Same response-owner inversion | Restore capability precedence | FIXED |
| REG-003 | Unknown/unavailable experience | CC:6 | B | Product reply replaced CC:6 failure | Restore capability precedence | FIXED |
| REG-004 | Explicit Scenario commitment | CC:10 | B | Clarification preempted canonical Decision intent | Canonical intent bypass | FIXED |
| REG-005 | Ambiguous commitment | CC:10 | B | Same gate inversion | Canonical intent bypass | FIXED |
| REG-006 | Confirmation/yes/cancel | CC:10 | B | Same gate inversion | Canonical intent bypass | FIXED |
| REG-007 | Stale confirmation | CC:10 | B | Same gate inversion | Canonical intent bypass | FIXED |
| REG-008 | Unsupported Scenario | CC:10 | B | Same gate inversion | Canonical intent bypass | FIXED |
| REG-009 | Partial Scenario uncertainty | CC:10 | B | Same gate inversion | Canonical intent bypass | FIXED |
| REG-010 | Duplicate commitment | CC:10 | B | Same gate inversion | Canonical intent bypass | FIXED |
| REG-011 | Illegal/locked transition | CC:10R | B | Decision result never reached | Canonical intent bypass | FIXED |
| REG-012 | Scenario preference handoff | CC:10 | B | Clarification preemption | Canonical intent bypass | FIXED |
| REG-013 | Approve current Scenario | CC:10 | B | Clarification preemption | Canonical intent bypass | FIXED |
| REG-014 | Workspace-scope yes | CC:10 | B | Clarification preemption | Canonical intent bypass | FIXED |
| REG-015 | Provenance preservation | CC:10 | B | Clarification preemption | Canonical intent bypass | FIXED |
| REG-016 | Compound execution deferral | CC:10/11 | B | Clarification preemption | Canonical intent bypass | FIXED |
| REG-017 | Canonical Runtime truth | CC:10R | B | Missing Decision caused null projection | Canonical intent bypass | FIXED |
| REG-018 | Choose Scenario B routing | CC:9/10 | B | Clarification preemption | Canonical intent bypass | FIXED |
| REG-019 | Ambiguous What-If context | CC:1/2 | B | Contextual overlay invented an explicit hint | Protect canonical Scenario intents | FIXED |
| REG-020 | Named Scenario explanation | CC:9 | B | General semantic reply replaced Scenario response | Restore Scenario owner | FIXED |
| REG-021 | Ambiguous prior Scenarios | CC:1/2 | B | Same deictic overlay defect | Protect canonical Scenario intents | FIXED |
| REG-022 | Scenario confidence follow-up | CC:9 | B | Generic intelligence response displaced Scenario answer | Restore Scenario owner | FIXED |
| REG-023 | Unknown adjective grammar | CC:1/6.2 | B | Context overlay upgraded rejected grammar | Preserve unknown hypothetical | FIXED |
| REG-024 | Scenario impact follow-ups | CC:9 | B | Collection/presentation reply displaced Scenario | Scenario/collection precedence | FIXED |
| REG-025 | Unknown adjective fallback | CC:1/6.2 | B | Same rejected-grammar upgrade | Preserve unknown hypothetical | FIXED |
| REG-026 | Explain Scenario fidelity | CC:9 | B | Scenario safety language dropped | Restore Scenario response + safety | FIXED |
| REG-027 | What-is Scenario fidelity | CC:9 | B | Same | Same | FIXED |
| REG-028 | Describe Scenario fidelity | CC:9 | B | Same | Same | FIXED |
| REG-029 | Tell-me Scenario fidelity | CC:9 | B | Same | Same | FIXED |
| REG-030 | Explicit Scenario over Delivery | CC:9 | B | Specific Scenario owner lost | Restore owner precedence | FIXED |
| REG-031 | Epistemic Scenario follow-up | CC:9 | B | Generic answer displaced confidence | Restore owner precedence | FIXED |
| REG-032 | Purple Dragon not-found | CC:2/5 | B | Generic MO response hid explicit miss | Honest catalog-bounded not-found | FIXED |
| REG-033 | Weak-evidence Scenario | CC:9 | B | Projection/causal caveat omitted | Add generic epistemic caveat | FIXED |
| REG-034 | MO:3 next-path wording/path | MO:3/NXA:2 | C | Legacy test required old fixed Problem wording | Preserve direct guidance; migrate flow assertion | MIGRATED |
| REG-035 | MO:4 Goal continuity | MO:4/NXA:3 | B | Generic presentation displaced Goal-aware answer | Narrow response ownership | FIXED |
| REG-036 | Delivery alias source branch | NCA-POST:1 | D | Generic resolver contract conflicted with per-object alias branches | Move aliases to catalog-bounded data map | CONTRACT-RESOLVED |
| REG-037 | “Show Scenario object” ambiguity | FINAL:3/NXA:1 | B | Interface word “object” misclassified explicit navigation as product education | Navigation scope precedence | FIXED |
| REG-038 | Risk investigation comparison | NCA-POST:4/CC:9 | D | One-member stale collection displaced current Scenario comparison | Scenario comparison precedence; migrate singular Risk copy | CONTRACT-RESOLVED |
| REG-039 | Bare `Delivery?` corpus | FINAL:6.1/NXA:1 | D | Legacy FOCUS conflicted with knowledge≠navigation | Interrogative becomes EXPLAIN; migrate corpus | CONTRACT-RESOLVED |
| REG-040 | Delivery mutation corpus | FINAL:6.1/NXA:1 | D | Same | Migrate operation allowance | CONTRACT-RESOLVED |
| REG-041 | Continuity corpus `DELIVERY?` | FINAL:6.2/NXA:1 | D | Same | Migrate corpus through NLU authority | CONTRACT-RESOLVED |
| REG-042 | Execution-plan response | NEX-EXP:8 | B | NXA KNOW copy displaced entrance-owned plan | Entrance response precedence | FIXED |
| REG-043 | Unsupported pause wording | CC:11 | C | Newer CC:11 copy names supported cancel path | Migrate semantically equivalent assertion | MIGRATED |
| REG-044 | Empty Risk discovery wording | NEX-EXP:4 | B | General semantic response displaced entrance response | Entrance response precedence | FIXED |
| REG-045 | Learning/memory response | NEX-EXP:10 | B | General semantic response displaced learning owner | Entrance response precedence | FIXED |
| REG-046 | One-member Goal presentation | NCA-POST/DIR | D | Legacy focus expectation conflicted with certified collection preservation | Assert canonical Goal collection | CONTRACT-RESOLVED |

All 46 baseline IDs have a terminal reconciliation status.

## 6–7. Contract conflicts and precedence decisions

- Named interrogatives are knowledge/EXPLAIN, not implicit Stage navigation: NXA:1 outranks the old fragment-as-FOCUS expectation.
- Canonical Decision/Scenario/workspace intents outrank clarification presentation; clarification cannot intercept an already-owned operation.
- Specific CC/NEX-EXP capability responses outrank general semantic/NXA presentation.
- An active canonical Scenario comparison outranks a stale one-member collection comparison.
- Explicit alias data is allowed, but per-object resolver branches are not.
- A one-member collection remains a collection under NCA-POST/DIR; it does not silently become focus.

## 8–10. Files changed

Production reconciliation touched:

- `conversationalExperienceOrchestrator.ts`
- `conversationalSubjectRegistry.ts`
- `nexoraMvpFinal62ConversationContinuity.ts`
- `nexoraNca1ConversationArchitecture.ts`
- `nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts`

Migrated tests/corpus:

- `managerObjectExplorationEngine.test.ts`
- `nexoraMvpFinal4InvestigationContinuity.test.ts`
- `nexoraMvpFinal61NaturalLanguageUnderstanding.test.ts`
- `nexoraMvpFinal61NluCorpus.ts`
- `nexoraExecutionPlanning.test.ts`
- `nexoraMvpFinalCertification.test.ts`

No harness/environment production file required modification.

## 11–12. Test migrations and production defects

Migrations were limited to explicitly superseded semantics: interrogative knowledge vs navigation, current direct GUIDE wording, singular collection presentation, supported CC:11 pause/cancel wording, and one-member Goal collection semantics. Production fixes corrected clarification ownership, response precedence, Scenario ambiguity/fidelity, unsupported hypothetical promotion, product-vs-navigation scope, stale comparison precedence, and alias registration structure.

## 13–14. Shared state and import side effects

Every failing file was run alone; all failed deterministically. No ordering-only failure, singleton contamination, NXA:3 import mutation, registration side effect, or situation-snapshot leakage was found. Two subsequent full clean processes produced identical green totals.

## 15–18. Protected regressions and focused matrix

- NXA:1: green.
- NXA:2: green.
- NXA:3: green.
- Focused NXA/NCA/MO/NEX-E2E/DIR matrix: **130/130 passed; 0 failed; 0 skipped** (original count preserved).

## 19–21. Full omnibus, clean process, repeatability

- Final run 1: **933/933 passed; 0 failed; 0 skipped**.
- Final run 2, new process: **933/933 passed; 0 failed; 0 skipped**.
- No ordering or nondeterministic divergence remained.

## 22. Live `/executive`

`node scripts/nxa-3-executive-situation-certify.mjs` passed with all proofs and no page errors. Goal awareness, investigation continuity, known-value reuse, recommendation invalidation, override, conflict, topic shift, recovery, and generic objects remained green. Decision/Execution/Outcome transitions remain covered by NEX-E2E.

## 23–26. Safety proofs

- Decision/Execution: the 933-test omnibus and NEX-E2E retain CC:10/10R/11 confirmation gates; no NXA auto-commit/start.
- Evidence/causality: NXA challenge and Scenario projection tests retain association-vs-causality and predicted-vs-observed distinctions.
- Knowledge/navigation: `What is Capacity Gap?` answers without Stage mutation; `Show Capacity Gap.` still navigates.
- Read-only situation: boundary tests retain no Goal/KPI/Decision/Execution/Outcome/Stage writes from composition.

## 27. Production validation

`NODE_OPTIONS=--max-old-space-size=8192 npm run build` passed optimized compilation, TypeScript, page-data collection, and 13/13 static pages. The intermediate build caught and prompted removal of one impossible `PROBLEM` path comparison; the final build is green.

## 28. Diff audit

`git diff --check` passed. No `.skip`, `.only`, deleted test, swallowed failure, debug log, duplicate authority, test-only production branch, or new TODO/FIXME was introduced. Existing unrelated dirty-worktree changes were preserved.

## 29. Remaining failures

None.

## 30. Final verdict

**NXA:3-FIX1 = CERTIFIED**

**NXA:3 = CERTIFIED**

NXA:4 was not started.
