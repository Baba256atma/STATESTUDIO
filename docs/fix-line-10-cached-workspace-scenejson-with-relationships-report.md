# FIX-LINE-10 Cached Workspace SceneJson With Relationships Report

Required tags:

[FIX_LINE_10]
[SCENEJSON_RELATIONSHIP_CACHE]
[SCENE_REFERENCE_STABLE]

## Problem

`getWorkspaceSceneJsonWithRelationships()` previously constructed a new frozen `SceneJson` on every call, even when the base scene and discovered relationships were unchanged. Downstream React and scene consumers treated each call as new data, causing unnecessary rerenders and possible render loops.

## Solution

Added a workspace-scoped SceneJson cache in `workspaceRelationshipDiscoveryContract.ts`. Repeated calls with the same inputs return the **same cached `SceneJson` reference**. When relationships or base scene inputs change, the cache key changes, a new `SceneJson` is built, and the cache entry is updated.

## Cache Key

The cache key includes:

| Component | Source |
|---|---|
| `workspaceId` | Resolved workspace |
| Base scene version | `getWorkspaceSceneVersionSnapshot()` |
| Base scene identity | Workspace/meta phase, model id, object count, object ids |
| Relationship version | `workspaceRelationshipVersion` |
| Relationship ids signature | Sorted discovered relationship ids |
| `modelId` | Discovery record or approved model |

## Behavior

```text
getWorkspaceSceneJsonWithRelationships()
  ↓
Build cache key from base scene + relationships
  ↓
Cache hit → return same SceneJson reference
Cache miss → build new SceneJson, store, return
```

- Base scene is never mutated (spread into new frozen object only on cache miss).
- Relationship records are adapted into new frozen Nexora relationships only on cache miss.
- Cache clears in `resetWorkspaceRelationshipsForTests()`.

## Diagnostics

Development-only diagnostics (scope: `relationshipSceneJsonCache`):

- `[RelationshipSceneJsonCache] Cache Hit`
- `[RelationshipSceneJsonCache] Cache Miss`
- `[RelationshipSceneJsonCache] Cache Updated`

## Acceptance Criteria

| Criterion | Status |
|---|---|
| Same inputs return same SceneJson reference | PASS |
| Changed relationships return new SceneJson | PASS |
| Scene still updates when needed | PASS |
| No stale relationship view | PASS |
| Build passes | PASS |

## Verification

```bash
cd frontend
node --test app/lib/workspace/workspaceRelationshipDiscoveryContract.test.ts
node --test app/lib/relationships/relationshipSceneRegressionCertification.test.ts
npm run build
```

## Files Changed

| File | Change |
|---|---|
| `frontend/app/lib/workspace/workspaceRelationshipDiscoveryContract.ts` | SceneJson cache, cache key builder, stable getter |
| `frontend/app/lib/scene/relationshipSceneJsonCacheDevLog.ts` | Cache diagnostics |
| `frontend/app/lib/workspace/workspaceRelationshipDiscoveryContract.test.ts` | Reference stability tests |

## Final Status

**[FIX_LINE_10] [SCENEJSON_RELATIONSHIP_CACHE] [SCENE_REFERENCE_STABLE]**
