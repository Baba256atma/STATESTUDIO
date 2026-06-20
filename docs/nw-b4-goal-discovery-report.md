# NW-B:4 Goal Discovery Report

Required Tags:

- [NWB4_GOAL_DISCOVERY]
- [WORKSPACE_GOALS_READY]
- [GOAL_CONTEXT_SAVED]
- [INTENT_CAPTURE_COMPLETE]
- [DRAFT_MODEL_GENERATION_READY]
- [NW_B4_COMPLETE]

## Summary

NW-B:4 adds Goal Discovery after Situation Discovery. The user can now clarify managerial intent by selecting multiple domain-aware goals and adding custom goals. Goals are saved as workspace-owned intent context and the flow advances to a Draft Model Generation placeholder for NW-B:5.

This phase captures intent only. It does not generate objects, relationships, topology, KPIs, risks, scenarios, draft models, or data source connections.

## Delivered

- Goal Discovery overlay in the centralized workspace modal host.
- Workspace-scoped goal contract and persistence layer.
- Domain-aware goal suggestions for Manufacturing, Finance, Project Management, Supply Chain, Operations, Sales, Human Resources, Technology, and Custom.
- Multi-select goal model.
- Custom goal entry.
- Workspace-owned goal persistence keyed by `workspaceId`.
- Draft Model Generation placeholder handoff for NW-B:5.
- MRP goal awareness:
  - `Goals Defined`
  - `No Goals Selected`
- Development diagnostics under `[GoalDiscovery]`.

## Architecture Notes

- `WorkspaceGoal` stores `workspaceId`, `goalId`, `goalName`, `goalType`, `selectedAt`, and `source`.
- Suggested and custom goals share the same canonical contract.
- Goal state is independent from object, relationship, topology, KPI, risk, scenario, draft model, and data source state.
- Workspace switching resolves goals through the active workspace id.
- Scene and topology runtime remain mounted and unchanged.
- MRP receives read-only goal status only.

## Acceptance Criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| Goal Discovery opens after Situation Discovery | PASS | Situation `Continue` transitions to `goalDiscovery` in `WorkspaceModalHost`. |
| Domain-aware goal suggestions work | PASS | `getGoalSuggestionsForDomain(domainId)` resolves per selected domain. |
| Multiple goal selection works | PASS | Goal dialog stores an array of selected goals. |
| Custom goal creation works | PASS | `createCustomGoal` creates workspace-owned custom goals. |
| Goals saved to workspace | PASS | `saveWorkspaceGoals` persists goals by `workspaceId`. |
| Workspace switching preserves goals | PASS | Runtime resolves with `getWorkspaceGoals(activeRegistryWorkspaceId)`. |
| MRP becomes goal-aware | PASS | MRP displays `Goals Defined` or `No Goals Selected`. |
| Scene remains stable | PASS | No scene rendering or topology path changed. |
| No model generation occurs | PASS | Goal Discovery writes only goal context. |
| No runtime errors | PASS | Focused and broader workspace tests pass. |
| No hydration errors | PASS | Production build completes. |
| Build passes | PASS | `npm run build` completes successfully. |

## Verification

- `node --test app/lib/workspace/workspaceGoalContract.test.ts app/lib/workspace/workspaceSituationContract.test.ts app/lib/workspace/workspaceDomainContract.test.ts`
  - PASS: 14 tests
- `node --test app/lib/workspace/workspaceGoalContract.test.ts app/lib/workspace/workspaceSituationContract.test.ts app/lib/workspace/workspaceDomainContract.test.ts app/lib/workspace/emptyWorkspaceContract.test.ts app/lib/workspace/workspaceRegistryStore.test.ts app/lib/workspace/workspaceSelectionBinding.test.ts app/lib/workspace/workspaceOwnershipContract.test.ts`
  - PASS: 34 tests
- `npm run build`
  - PASS

Known existing warnings:

- Node test runner reports `MODULE_TYPELESS_PACKAGE_JSON` for TypeScript ESM tests.
- Build reports stale `baseline-browser-mapping` data.

## Safety Review

- No object generation was introduced.
- No relationship generation was introduced.
- No topology generation was introduced.
- No KPI generation was introduced.
- No risk generation was introduced.
- No scenario generation was introduced.
- No draft model generation was introduced.
- No data source connection was introduced.
- Workspace registry, lifecycle, ownership, scene, MRP, assistant, routing, and topology contracts remain intact.

## Result

NW-B:4 is complete and ready for NW-B:5 Draft Model Generation.

