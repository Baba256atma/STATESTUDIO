# NW-B:1 Empty Workspace Experience Report

Required tags:
[NWB1_EMPTY_WORKSPACE]
[EMPTY_WORKSPACE_DETECTOR]
[WORKSPACE_ONBOARDING_READY]
[MODEL_CREATION_ENTRYPOINT_READY]
[NW_B1_COMPLETE]

## Certification Result

Overall status: PASS

Nexora now recognizes newly created non-demo workspaces as unmodeled workspace opportunities. Empty workspace mode is workspace-scoped, keeps the scene mounted, suppresses inherited demo business content, and presents a centered modeling entrypoint without implementing Domain, Situation, Goal, Draft Model Generation, Auto Object Creation, or Data Source Upload.

## Implementation Summary

- Created the Empty Workspace contract and detector in `frontend/app/lib/workspace/emptyWorkspaceContract.ts`.
- Detection checks user-owned objects, relationships, data sources, and approved-model metadata; it does not rely only on object count.
- Added `EmptyWorkspaceOverlay` as a centered scene onboarding layer with:
  - `Welcome to Nexora`
  - `Let's build your first model.`
  - `Start Modeling`
  - `Dismiss`
  - Reopen entrypoint after dismiss
- Added a placeholder Start Modeling route state: `Domain Discovery Pending`.
- Bound empty-state behavior to the active NW-A workspace registry.
- Kept the Three.js scene canvas mounted and passed an empty workspace scene snapshot while empty mode is active.
- Prevented demo scene fallback from reintroducing demo objects for an empty active workspace.
- Added MRP safe empty-state messaging for Insight and Assistant surfaces.

## Workspace Scope

Empty workspace state is derived from the active workspace registry entry. Demo Workspace remains modeled through its demo migration metadata. Newly created non-demo workspaces resolve to empty until future owned resources or approved-model metadata are attached.

Switching workspaces updates the active empty-state experience through the existing registry subscription and active workspace pointer.

## Scene Behavior

- Scene canvas remains mounted.
- Existing visual environment and camera system remain intact.
- Empty workspaces receive a no-object scene snapshot.
- Demo objects, demo topology, demo business graph, and demo executive relationships are not used as workspace content while empty mode is active.

## MRP Behavior

MRP remains mounted. When empty workspace mode is active, Insight and Assistant render safe empty-state messaging instead of fake executive summaries, risks, opportunities, or assistant context.

## Diagnostics

Development diagnostics added:

- `[EmptyWorkspace]`
- `Workspace: workspaceId`
- `State: empty`
- `[EmptyWorkspace] StartModelingOpened`
- `[EmptyWorkspace] StartModelingDismissed`

## Verification

Focused test command:

`node --test app/lib/workspace/emptyWorkspaceContract.test.ts app/lib/workspace/workspaceManagementCertification.test.ts app/lib/workspace/workspaceRegistryStore.test.ts app/lib/workspace/workspaceSelectionBinding.test.ts app/lib/workspace/workspaceOwnershipContract.test.ts`

Result:

- 21 tests passed
- 0 failed

Focused detector retest:

`node --test app/lib/workspace/emptyWorkspaceContract.test.ts`

Result:

- 5 tests passed
- 0 failed

Production build command:

`npm run build`

Result:

- TypeScript passed
- Next production build passed
- Static routes generated successfully

Note: The existing `baseline-browser-mapping` package age warning still appears during build. Direct Node TypeScript tests still emit the existing module type warning. No new NW-B:1 runtime or build warning was introduced.

## Safety Summary

No changes were made to:

- Domain Discovery
- Situation Discovery
- Goal Discovery
- Draft Model Generation
- Auto Object Creation
- Data Source Upload
- Workspace Management lifecycle logic
- MRP architecture
- Scene architecture
- Topology engine
- Existing routing contracts

NW-B:1 is ready for the next NW-B modeling wizard phase.
