# FIX-LINE-12 Cached Relationship Adaptation Report

Required tags:

[FIX_LINE_12]
[RELATIONSHIP_ADAPTATION_CACHE]
[RELATIONSHIP_REFERENCE_STABLE]

## Problem

`getWorkspaceSceneJsonWithRelationships()` previously ran `relationships.map(adaptDiscoveredRelationshipToNexoraRelationship)` on every SceneJson build. That created new Nexora relationship objects and a new relationships array each time, so `scene.relationships` reference changed even when discovered relationships were unchanged.

## Solution

Added a workspace-scoped adaptation cache in `workspaceRelationshipDiscoveryContract.ts`. Adapted Nexora relationships are computed once per relationship version and reused via `getWorkspaceAdaptedNexoraRelationships()`.

## Cache Key

| Component | Source |
|---|---|
| `workspaceId` | Resolved workspace |
| Relationship version | `workspaceRelationshipVersion` |
| Relationship ids signature | Sorted discovered relationship ids |

## Behavior

```text
getWorkspaceAdaptedNexoraRelationships()
  ↓
Cache hit → return same readonly NexoraRelationship[] reference
Cache miss → map + freeze once, store, return
  ↓
getWorkspaceSceneJsonWithRelationships() reuses cached array in scene.scene.relationships
```

- Adapted relationship objects are frozen once during cache miss.
- Discovered relationship records are never mutated.
- Both adaptation and SceneJson caches clear in `resetWorkspaceRelationshipsForTests()`.

## Diagnostics

Development-only diagnostics (scope: `relationshipAdaptationCache`):

- `[RelationshipAdaptationCache] Cache Hit`
- `[RelationshipAdaptationCache] Cache Miss`
- `[RelationshipAdaptationCache] Relationships Adapted`

## Acceptance Criteria

| Criterion | Status |
|---|---|
| Same relationship set returns same adapted relationship array | PASS |
| Changed relationship set refreshes cache | PASS |
| Scene relationship references become stable | PASS |
| No stale relationships | PASS |
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
| `frontend/app/lib/workspace/workspaceRelationshipDiscoveryContract.ts` | Adaptation cache + `getWorkspaceAdaptedNexoraRelationships()` |
| `frontend/app/lib/scene/relationshipAdaptationCacheDevLog.ts` | Cache diagnostics |
| `frontend/app/lib/workspace/workspaceRelationshipDiscoveryContract.test.ts` | Adaptation reference stability tests |

## Final Status

**[FIX_LINE_12] [RELATIONSHIP_ADAPTATION_CACHE] [RELATIONSHIP_REFERENCE_STABLE]**
