# FIX-LINE-07 Object Position Lookup Cache Report

Required tags:

[FIX_LINE_07]
[OBJECT_POSITION_CACHE_READY]
[RELATIONSHIP_LOOKUP_OPTIMIZED]

## Problem

Relationship rendering previously resolved each line endpoint through `resolveRuntimeObjectPositionFromContext()`, which scanned the full scene object list for every source and target lookup. With many relationships, this created an `relationships × objects × scans` pattern that could freeze the page.

## Solution

Introduced a stable object position lookup cache built once per scene object signature. Relationship rendering now uses `positionLookup.get(objectId)` for O(1) endpoint resolution and falls back to the legacy resolver only on cache miss.

## Target Files

| File | Change |
|---|---|
| `frontend/app/lib/scene/runtimeObjectPosition.ts` | Cache build, signature, lookup helpers, cache-aware resolver |
| `frontend/app/lib/scene/relationshipPositionCacheDevLog.ts` | Dev diagnostics for cache lifecycle |
| `frontend/app/components/scene/sceneRenderUtils.tsx` | Cache-aware connection endpoint resolver |
| `frontend/app/components/scene/relationships/RelationshipRenderer.tsx` | Builds cache once per object signature |
| `frontend/app/components/scene/relationships/RelationshipLine.tsx` | Consumes shared cache for endpoint lookup |

## Cache Design

```text
Scene objects + layout context
  ↓
buildRuntimeObjectPositionLookupSignature()
  ↓
buildRuntimeObjectPositionLookupCache()   (once per signature)
  ↓
Map<objectId | stableObjectId | name | label | objectId alias, position result>
  ↓
RelationshipLine → positionLookup.get(sourceId)
                 → positionLookup.get(targetId)
  ↓
Fallback resolver only on cache miss
```

### Cache keys indexed per object

- `stableObjectId` (via `resolveStableObjectId`)
- `object.id`
- `object.name`
- `object.label`
- `object.objectId` (workspace pipeline alias)

Baseline demo object ids (`obj_inventory`, `obj_delivery`, `obj_risk_zone`) are also pre-indexed.

### Signature inputs

- Stable object identity fields
- Object position / transform payload
- Topology runtime layout map
- Layout engine position map

When any of these change, the signature changes and the cache rebuilds once in `RelationshipRenderer`.

## Diagnostics

Development-only diagnostics (scope: `relationshipPositionCache`):

- `[RelationshipPositionCache] Cache Built`
- `[RelationshipPositionCache] Cache Hit`
- `[RelationshipPositionCache] Cache Miss`
- `[RelationshipPositionCache] Fallback Used`

## Acceptance Criteria

| Criterion | Status |
|---|---|
| Relationship endpoint resolution no longer scans all objects per line | PASS |
| Scene still renders object relationships | PASS |
| Relationship lines connect correct objects | PASS |
| Workspace switching remains safe | PASS |
| No runtime errors | PASS |
| No hydration errors | PASS |
| Build passes | PASS |

## Verification

```bash
cd frontend
node --test app/lib/scene/runtimeObjectPosition.test.ts
node --test app/lib/relationships/relationshipSceneRegressionCertification.test.ts
npm run build
```

Observed: 7 position cache tests + relationship scene regression certification passed; production build succeeded.

## Notes

- Cache is scoped to `RelationshipRenderer` and passed to each `RelationshipLine`; it is not rebuilt per relationship.
- Other overlay paths (`OverlayFlowLines`, SVIE overlays) continue using the legacy resolver unless they opt into the cache API.
- Workspace switching remains safe because cache signature includes the current scene object set and layout context for the active render pass.

## Final Status

**[FIX_LINE_07] [OBJECT_POSITION_CACHE_READY] [RELATIONSHIP_LOOKUP_OPTIMIZED]**
