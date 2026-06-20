# NW-B:6 Model Approval & Scene Handoff Report

Required Tags:

- [NWB6_MODEL_APPROVAL]
- [WORKSPACE_MODEL_READY]
- [OBJECT_PROMOTION_COMPLETE]
- [SCENE_HANDOFF_READY]
- [SCENE_CREATION_READY]
- [NW_B6_COMPLETE]

## Summary

NW-B:6 converts an approved draft model into a stable workspace-owned model. Draft objects are promoted into approved workspace objects, user edits are preserved, and a scene handoff contract is created for NW-B:7.

This phase prepares the scene but does not create topology, coordinates, relationships, scene nodes, edges, KPIs, risks, scenarios, dashboards, data-source connections, or DS engine activity.

## Delivered

- Workspace model contract.
- Workspace object registry.
- Model approval confirmation flow.
- Draft-to-workspace object promotion.
- User edit preservation through object `source`:
  - `SystemGenerated`
  - `UserModified`
- Draft freeze behavior after approval.
- Revision-ready approved model metadata.
- Scene handoff contract with `sceneReady = true`.
- MRP model awareness:
  - Approved object count
  - Model status
- Development diagnostics under `[ModelApproval]`.

## Architecture Notes

- `WorkspaceModel` stores `workspaceId`, `modelId`, `domainId`, `situationId`, `goalIds`, `approvedAt`, `modelVersion`, `status`, and `approvedObjects`.
- `WorkspaceObject` is the future engine target for topology, relationships, DS engines, risk, scenarios, assistant intelligence, and dashboard systems.
- `SceneHandoff` stores `workspaceId`, `modelId`, `approvedObjectIds`, and `sceneReady`.
- Draft models remain available after approval and are locked against further edit operations.
- Approved workspace model state is separate from scene rendering.
- The scene stays mounted with scene-content suppression until NW-B:7 creates the actual scene.

## Acceptance Criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| Draft Model can be approved | PASS | Model approval confirmation calls `approveWorkspaceModelFromDraft`. |
| Approved model contract created | PASS | `WorkspaceModel` contract exists. |
| Objects promoted to workspace objects | PASS | Draft objects become `WorkspaceObject` records. |
| User edits preserved | PASS | Renamed and added objects promote as `UserModified`. |
| Draft remains available | PASS | Draft model is retained and marked approved. |
| Workspace object registry exists | PASS | `getWorkspaceObjects(workspaceId)` returns approved objects. |
| Scene handoff contract exists | PASS | `SceneHandoff` contract is persisted with `sceneReady = true`. |
| MRP becomes model-aware | PASS | MRP displays approved object count and model status. |
| Scene remains stable | PASS | Approved-model pre-scene mode suppresses scene content until NW-B:7. |
| No topology generated | PASS | Scene handoff stores ids only; no coordinates, nodes, edges, or relationships. |
| No runtime errors | PASS | Focused and broader workspace tests pass. |
| No hydration errors | PASS | Production build completes. |
| Build passes | PASS | `npm run build` completes successfully. |

## Verification

- `node --test app/lib/workspace/workspaceApprovedModelContract.test.ts app/lib/workspace/workspaceDraftModelContract.test.ts app/lib/workspace/emptyWorkspaceContract.test.ts`
  - PASS: 14 tests
- `node --test app/lib/workspace/workspaceApprovedModelContract.test.ts app/lib/workspace/workspaceDraftModelContract.test.ts app/lib/workspace/workspaceGoalContract.test.ts app/lib/workspace/workspaceSituationContract.test.ts app/lib/workspace/workspaceDomainContract.test.ts app/lib/workspace/emptyWorkspaceContract.test.ts app/lib/workspace/workspaceRegistryStore.test.ts app/lib/workspace/workspaceSelectionBinding.test.ts app/lib/workspace/workspaceOwnershipContract.test.ts`
  - PASS: 43 tests
- `npm run build`
  - PASS

Known existing warnings:

- Node test runner reports `MODULE_TYPELESS_PACKAGE_JSON` for TypeScript ESM tests.
- Build reports stale `baseline-browser-mapping` data.

## Safety Review

- No topology was generated.
- No relationships were generated.
- No KPI models were generated.
- No risk models were generated.
- No scenario models were generated.
- No dashboards were generated.
- No data sources were connected.
- No DS engines were triggered.
- No scene nodes, coordinates, edges, camera changes, or object placements were created.

## Result

NW-B:6 is complete and ready for NW-B:7 Scene Creation.

