# DS-1:6 — Workspace Scene Sync Report

Freeze Tags: `[DS16_SCENE_SYNC]`, `[WORKSPACE_OBJECTS_VISIBLE]`, `[SCENE_SYNC_TRACEABILITY]`, `[SCENE_SYNC_LOOP_PROTECTED]`, `[DS17_READY]`, `[DS_1_6_COMPLETE]`

Diagnostic Prefix: `[NexoraSceneSync]`

Prerequisites: DS-1:1 through DS-1:5 = PASS

## Objective

Synchronize created workspace objects into the Nexora Scene. This is the first phase where DS-created objects become visible in the scene. Sync is explicit only — no automatic sync during creation, approval, or workspace load.

## Flow

```
Approved Candidates
       ↓
Workspace Objects
       ↓
Scene Sync
       ↓
Visible Scene Objects
```

## Input

Scene sync reads **only** from DS-1:5:

```typescript
getWorkspaceCreatedObjects(workspaceId)
```

No candidates, schema, CSV, or rediscovery.

## Modules

| Module | Responsibility |
|--------|----------------|
| `workspaceSceneSyncContract.ts` | DS-1:6 contract, sync records, placement grid, tags |
| `workspaceSceneSyncPipeline.ts` | Explicit sync runtime, persistence, duplicate protection |
| `workspaceSceneSyncLegacyBridge.ts` | Legacy scene object bridge for facade and scene JSON |
| `workspaceSceneSync.ts` | Thin facade for downstream compatibility |
| `WorkspaceObjectApprovalPanel.tsx` | **Sync Objects To Scene** explicit action |

## Scene Sync Record

Each sync stores:

- `workspaceId`
- `objectId` (workspace object)
- `sceneObjectId`
- `originCandidateId`
- `syncStatus` (`synced` | `skipped` | `duplicate`)
- `syncedAt`
- `syncSource` (`workspace_scene_sync`)

Persistence keys:

- `nexora.workspaceSceneSyncRecords.v2`
- `nexora.workspaceSceneSyncObjects.v2`
- `nexora.workspaceSceneSyncState.v2`

## Scene Object Mapping

| Workspace Object | Scene Object |
|------------------|--------------|
| `objectId` | `originWorkspaceObjectId` |
| `objectName` | `label` |
| `objectType` | `objectType` |
| `originCandidateId` | `originCandidateId` |
| — | `sceneObjectId` (`scene_obj_*`) |

## Placement

Temporary deterministic placement via **DS Scene Placement Grid**:

| Index | Position |
|-------|----------|
| 1 | center `[0, 0, 0]` |
| 2 | right `[3, 0, 0]` |
| 3 | left `[-3, 0, 0]` |
| 4 | top `[0, 0, -3]` |
| 5 | bottom `[0, 0, 3]` |

No physics, topology, clustering, or force layout.

## Traceability Chain

```
Scene Object → Workspace Object → Approved Candidate
```

Preserved fields: `sceneObjectId`, `originWorkspaceObjectId`, `originCandidateId`.

## Safety Rules

DS-1:6 does **not**:

- create relationships, topology, KPIs, or risks
- create assistant memory or dashboard cards
- modify approval, creation, or discovery pipelines
- modify scene camera, object selection, click routing, or MRP routing
- trigger `setSceneJson` recursively or scene rebuild loops

One-way sync only: Workspace Objects → Scene Objects.

## Workspace Isolation

Workspace A scene objects never appear in Workspace B. Active workspace switching reads scene objects scoped to the current workspace only.

## Diagnostics

Prefix: `[NexoraSceneSync]`

Logged fields:

- `workspaceId`
- `objectId`
- `sceneObjectId`
- `action` (`created` | `skipped` | `duplicate`)

## Tests

| Test | Result |
|------|--------|
| Sync Customer | 1 scene object |
| Sync Supplier | 1 scene object |
| Sync multiple objects | All appear |
| Duplicate sync | Skip |
| Workspace switching | Correct workspace scene |
| Traceability | Full chain preserved |
| No topology/relationships | Empty relationships array |
| No auto-sync on create | 0 scene objects until explicit sync |

Test files:

- `workspaceSceneSyncPipeline.test.ts`
- `workspaceSceneSync.test.ts`

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Workspace objects appear in Scene | PASS |
| Duplicate sync blocked | PASS |
| Workspace isolation preserved | PASS |
| Traceability preserved | PASS |
| No topology created | PASS |
| No relationships created | PASS |
| No scene loops | PASS |
| Build passes | PASS |

## Required Tags

- `[DS16_SCENE_SYNC]`
- `[WORKSPACE_OBJECTS_VISIBLE]`
- `[SCENE_SYNC_TRACEABILITY]`
- `[SCENE_SYNC_LOOP_PROTECTED]`
- `[DS17_READY]`
- `[DS_1_6_COMPLETE]`

## Next Phase

DS-1:7 — End-to-end certification across the DS-1 pipeline.
