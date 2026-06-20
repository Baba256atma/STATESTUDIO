# NW-B:7 Scene Creation from Approved Model Report

Required tags:

[NWB7_SCENE_CREATION]
[APPROVED_MODEL_SCENE_READY]
[WORKSPACE_SCENE_OBJECTS_CREATED]
[DEMO_OBJECTS_EXCLUDED]
[SCENE_CREATION_COMPLETE]
[NW_B7_COMPLETE]

## Summary

NW-B:7 converts approved workspace model objects into workspace-scoped scene objects. The implementation keeps topology, relationships, KPIs, risks, scenarios, data-source engines, routing, and demo scene behavior unchanged.

## Deliverables

- Scene Creation Contract: `workspaceSceneCreationContract.ts`
- Approved Model to Scene Object Adapter: `adaptApprovedObjectToSceneObject`
- Workspace Scene Object Store: workspace-scoped scene object and scene creation registries
- Safe Placement Strategy: simple circular placement with stable positions
- Scene Creation Diagnostics: development-only `[SceneCreation]` diagnostics
- Runtime Binding: `HomeScreen.tsx` now creates and reads workspace scene snapshots for approved non-demo workspaces
- MRP Awareness: Main Right Panel discovery strip shows `Scene Created` when B7 scene objects exist

## Behavior

- Approved workspace objects are promoted to scene objects with:
  - `objectId`
  - `workspaceId`
  - `modelId`
  - `objectName`
  - `objectType`
  - `source: ApprovedModel`
  - placeholder status
  - confidence
  - safe position
- Workspace scene JSON includes no generated relationships, KPIs, risks, scenarios, or loops.
- Demo workspace remains on the existing demo scene path.
- User workspaces with approved models use the workspace scene store instead of demo runtime scene content.
- Empty Workspace mode resolves to modeled after model approval and scene creation.

## Acceptance Status

PASS:

- Approved model creates visible scene objects.
- Scene objects are workspace-scoped.
- Empty workspace overlay is bypassed after model approval/scene creation.
- Demo objects are excluded from user workspace scene snapshots.
- Workspace switching resolves scene objects by workspace id.
- MRP shows scene-created status.
- No fake KPI/risk/scenario data is generated.

## Verification

Completed:

```bash
cd frontend
node --test app/lib/workspace/workspaceApprovedModelContract.test.ts app/lib/workspace/workspaceSceneCreationContract.test.ts
npm run build
```

Result:

- Workspace model and scene creation contract tests passed: 7/7.
- Production build passed.
- Existing warnings only:
  - stale `baseline-browser-mapping`
  - Node `MODULE_TYPELESS_PACKAGE_JSON` warning for direct TypeScript test execution

## Freeze Notes

NW-B:7 establishes only the first scene creation handoff from approved model objects. Advanced topology, relationship generation, KPI intelligence, risk intelligence, scenario intelligence, and data-source enhancement remain reserved for later phases.
