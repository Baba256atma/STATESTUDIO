# NPA-T SIM-TEST:6-FIX14-R8 — Root Cause

## Stop Condition

- All 10 known typecheck errors are causally clustered and repaired at their owning contracts with type-safe changes.
- The established L4 typecheck (`NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck`) reports 0 errors, with no suppression, exclusion, tsconfig change or `any`.
- Touched owners stay behaviorally green, the L4 omnibus stays absolute green, the remaining L4 commands run in order, and SIM-TEST keeps its exact known 156/158 state.

## Baseline (current worktree, exit 2)

| # | File | Line | TS | Message | Prod/Test | Root |
|---|---|---|---|---|---|---|
| 1 | `app/lib/manager-object/conversationContinuityResolver.ts` | 417 | TS2322 | spread object with optional `subjectId` not assignable to `ContextualReferentCandidate` | Production | A |
| 2 | `app/lib/sim-test/nexoraSimulationFix14Dump.ts` | 24 | TS2339 | `owner` does not exist on `NexoraSimulationTestFinding` | Diagnostic | B |
| 3 | same | 25 | TS2339 | `observed` does not exist | Diagnostic | B |
| 4 | same | 26 | TS2339 | `expected` does not exist | Diagnostic | B |
| 5 | same | 27 | TS2339 | `subjectId` does not exist | Diagnostic | B |
| 6 | `app/lib/sim-test/nexoraSimulationScenarioRuntimeFix14R3.test.ts` | 45 | TS18049 | `result.directorPlan` possibly null/undefined | Test | C |
| 7 | same | 46 | TS18049 | same | Test | C |
| 8 | same | 56 | TS18049 | same | Test | C |
| 9 | same | 57 | TS18049 | same | Test | C |
| 10 | `app/lib/sim-test/nexoraSimulationScenarioWhyFix14R4.test.ts` | 50 | TS18049 | `described.directorPlan` possibly null/undefined | Test | C |

## Clusters

### Cluster A — lost aliased narrowing (1 error, production)

- **First wrong contract:** in the named-historical-return branch, `visitedNamedExplicit = Boolean(explicit && …)`. Wrapping the condition in a `Boolean()` call stops TypeScript's aliased-condition narrowing, so inside `if (visitedNamedExplicit …)` the variable `explicit` is still `ContextualReferentCandidate | null`. Spreading it makes `subjectId` optional.
- **Runtime:** there is no unsafe state. `visitedNamedExplicit === true` already implies `explicit` is non-null.
- **Owner:** FINAL:6.2 `conversationContinuityResolver.ts`.
- **Attribution:** uncommitted named-historical-return extension from the FIX11–R2 window.

### Cluster B — diagnostic reads non-canonical field names (4 errors, test/support)

- **First wrong contract:** `nexoraSimulationFix14Dump.ts` reads `owner`, `observed`, `expected` and `subjectId`. The canonical `NexoraSimulationTestFinding` fields are `likelyOwner`, `observedBehavior`, `expectedInvariant` and `activeCanonicalSubjectId`; the harness summary already maps `owner: item.likelyOwner`.
- The contract did not evolve. The dump was written against wrong names, so those four values printed as `undefined`.
- **Owner:** SIM-TEST diagnostic utility.
- **Attribution:** FIX14 authoring.

### Cluster C — nullable result field dereferenced without narrowing (5 errors, test-only)

- **First wrong contract:** `ConversationalExperienceResult.directorPlan` is declared `NexoraDirectorPlan | null` and optional. The R3 and R4 tests dereference it directly.
- The production contract did not change, and the fixtures are not stale.
- **Owner:** R3 and R4 test files.
- **Attribution:** test-only evolution from R3/R4 authoring.

The clusters are independent. None cascades into another.
