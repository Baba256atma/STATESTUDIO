# ECA:1 Closure Failure Inventory

Inventory date: 2026-09-06.

| ID | Area | Test/suite | Current result | Classification/status |
| --- | --- | --- | --- | --- |
| C1 | Conversation | `nexoraNca4AdvisoryIntelligence.test.ts` / `M. Unsupported strong action is challenged` | FAIL: comparison clarification returned instead of unsupported-action caution | PRE_EXISTING, unrelated to ECA stack; blocking under zero-failure rule until resolved/classified in final gate |
| C2 | Conversation | `nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.test.ts` / `answers product capability honestly` | Previously FAIL: ECA broad ADD recognition returned mutation proposal; now targeted rerun PASS | FIXED; ECA_INTRODUCED and repaired by requiring target semantics |
| CTX1-CTX9 | Director/context | Director-1:1 through Director-1:9 certification files | 284/293; nine path-resolution/`readdirSync` failures | PRE_EXISTING/ENVIRONMENT; no ECA import/stack path observed; still a repository gate failure |
| DATA1-DATA9 | Data/workspace | Nine workspace presentation/orientation/readiness/mode tests | 1,373/1,382; nine failures | PRE_EXISTING/REAL_UNRELATED_REGRESSION; no ECA import/stack path observed; still a repository gate failure |
| DTH1 | Theatre | `nexoraDecisionTheatreDecisionComparison.test.ts` / `K: later selected candidate is the Advisor investigation anchor` | FAIL: expected Demand Surge anchor, got generic insufficient-evidence copy | PRE_EXISTING, unrelated to ECA stack; DTH focused sub-gate not rerun in this closure |
| DIFF1 | Repository | `git diff --check` | FAIL: trailing whitespace/new blank line at `frontend/app/lib/nexora-certification/nxaTestFunnel.ts` line 107 | PRE_EXISTING repository hygiene; harmless and outside ECA files; requires cleanup before certification |
| RT-D | Runtime | `/executive` Stage separation | Not completed: shared page became stale during interaction | BLOCKING unproven runtime gate |
| RT-E | Runtime | `/executive` ambiguity resolution | Not completed | BLOCKING unproven runtime gate |
| RT-H | Runtime | `/executive` CSV/Data context | Not completed | BLOCKING unproven runtime gate |

## Reproduction evidence

- Focused ECA/FIX2 slice: 34 passed / 0 failed.
- Conversation group after the C2 repair: 362 passed / 2 failed of 364; C1 plus the previously fixed C2 was observed in the aggregate run, with C2 passing in its targeted rerun.
- BCA/Stage/Director/context group: 284 passed / 9 failed of 293.
- Data/workspace group: 1,373 passed / 9 failed of 1,382.
- Theatre/lifecycle group: 345 passed / 1 failed of 346.
- NXA funnel level 1: passed / 0 failed.

No implementation edit was made to resolve these remaining unrelated suites before this inventory was created.