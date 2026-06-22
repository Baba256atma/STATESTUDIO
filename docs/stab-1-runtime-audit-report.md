# STAB-1A Post DS-1 Runtime Audit Report

**Project:** Nexora Type-C  
**Phase:** STAB-1A  
**Title:** Post DS-1 Runtime Audit  
**Date:** 2026-06-20  

**Tags:** `[STAB1_RUNTIME_AUDIT]` `[POST_DS1_AUDIT]` `[NO_RUNTIME_REGRESSION]` `[DS2_ENTRY_APPROVED]`

---

## Executive Summary

Static architecture audit of eight scoped runtime files after DS-1 certification (DS-1:1–DS-1:7). No runtime behavior was modified during this phase.

| Check | Title | Result |
|-------|-------|--------|
| A | Object Selection Pipeline | **PASS** |
| B | MRP Routing Isolation | **PASS** |
| C | Scene Sync Isolation | **PASS** |
| D | Relationship Runtime | **WARNING** |
| E | Object Position Runtime | **WARNING** |
| F | Scene Render Utilities | **WARNING** |
| G | Workspace Isolation | **WARNING** |
| H | Loop Protection | **PASS** |

**Overall:** No FAIL findings. Three WARNING items recorded for follow-up in a future stabilization phase. DS-1 integration did not introduce blocking loop, routing, or scene-sync regressions in the audited surface.

**Build verification:** `npm run build` — PASS (2026-06-20).

---

## Audit Scope

| File | Role |
|------|------|
| `frontend/app/screens/HomeScreen.tsx` | Shell orchestration, selection, scene apply wiring |
| `frontend/app/components/scene/relationships/RelationshipRenderer.tsx` | Relationship layer composition |
| `frontend/app/components/scene/relationships/RelationshipLine.tsx` | Per-relationship Three.js rendering |
| `frontend/app/lib/scene/runtimeObjectPosition.ts` | Unified object position resolver + lookup cache |
| `frontend/app/components/scene/sceneRenderUtils.tsx` | Scene render helpers (note: `.tsx`, not `.ts`) |
| `frontend/app/lib/workspace/workspaceRelationshipDiscoveryContract.ts` | Workspace relationship discovery + scene JSON enrichment |
| `frontend/app/lib/dashboard/dashboardContextBridge.ts` | Dashboard context routing bridge |
| `frontend/app/lib/selection/mrpSelectedObjectBridge.ts` | MRP object-click publish bridge |

---

## CHECK A — Object Selection Pipeline

**Result: PASS**

**Expected flow verified:**

```
Object Click → Selection (selectedObjectIdState) → Object Panel → Deselect
```

**Evidence:**

1. **Click commit path** — `commitObjectSelectionFromUserClick` deduplicates by `eventId`, applies user selection lock, calls `commitCanonicalObjectSelection`, then publishes MRP context read-only (`HomeScreen.tsx` ~12480–12768).

2. **Canonical selection writer** — `commitObjectSelection` enforces source guards (`shouldBlockNonCanonicalSelectionWrite`, user lock, bootstrap block), duplicate no-op (`shouldCommitSelectedObjectId`, `isObjectSelectionFullyApplied`), and ref+state sync without scene mutation (~4792–5040).

3. **Panel open** — deferred `requestPanelAuthorityOpen(buildObjectPanelSelectionOpenRequest(...))` after click commit (~14693–14698). Panel authority path includes stale-click guards and same-state skip for object_click (~6371–6487, ~6644–6670).

4. **Deselect** — `commitObjectSelection(null, source)` and `deselectPlacedObject()` paths clear selection with no-op when already empty (~4887–4937, ~5101).

5. **Scene context echo guard** — `syncSceneContextSelection` only sets `selectedSetterRef` with a microtask echo guard; does not call `setSceneJson` (~12471–12478).

6. **No recursive selection writes observed** — transaction refs, requestSeq stale guards, and panel dedup (`evaluateObjectClickPanelIntent`) prevent re-entrant panel/selection commits.

---

## CHECK B — MRP Routing Isolation

**Result: PASS**

**Verified:** Object click does **not** write scene, rebuild scene, or commit dashboard context recursively.

**Evidence:**

1. **`publishMrpSelectedObjectFromClick`** (`mrpSelectedObjectBridge.ts`) calls `resolveDashboardSurfaceForObjectSelection` (read-only route resolution) and `publishObjectClickSelectionContext` (in-memory cache). No `dispatch` call.

2. **`dashboardContextBridge.ts`** — `routeDashboardContextFromObjectSelection` explicitly voids dispatch and traces blocked commit (~122–134). `resolveDashboardSurfaceForObjectSelection` is documented read-only (~95–116).

3. **`HomeScreen.tsx`** — `commitDashboardContextUpdate` is skipped when `normalizedRequest.source === "object_click"` (~6748–6760). Object-click dashboard publish uses `shouldPublishMrpSelectedObjectContext` no-op when same object + `"sources"` context (~12701–12737).

4. **Scene write guard** — `useSceneApplyController.applySceneChangeSafe` invokes `evaluateObjectClickSceneWriteGuard` which blocks structural scene mutations from object-click sources (`objectClickSelectionReadOnlyGuard.ts` ~117–167; wired in `useSceneApplyController.ts` ~277–295).

---

## CHECK C — Scene Sync Isolation

**Result: PASS**

**Verified:** Workspace → Scene Objects is one-way in the audited surface. No reverse synchronization or recursive `setSceneJson` from relationship enrichment.

**Evidence:**

1. **`workspaceRelationshipDiscoveryContract.ts`** — `getWorkspaceSceneJsonWithRelationships` reads `getWorkspaceSceneJson`, adapts discovered relationships, and returns a cached enriched copy. No writes back to workspace object stores or DS-1 sync records (~486–531).

2. **`HomeScreen.tsx`** — `visibleSceneJson` derives from `getWorkspaceSceneJsonWithRelationships(activeRegistryWorkspaceId)` as a read path (~8903–8906, ~9469). Workspace hydration applies project state → scene via `applySceneChangeUpstreamDedup(..., "workspace")` (~13246–13249); no scene → workspace reverse sync in scoped files.

3. **DS-1 scene sync pipeline** (out of scope but cross-checked) — explicit one-way sync from `getWorkspaceCreatedObjects()` only; not invoked from object-click or selection paths in audited files.

4. **Dedupe** — `applySceneChangeSafe` skips identical JSON signatures (`duplicate_scene_write_skipped`, ~573–583).

---

## CHECK D — Relationship Runtime

**Result: WARNING**

**Verified (positive):**

- `readValidatedSceneRelationshipsForRender` validates contract fields and optional object-id membership before render (`relationshipRendererRuntime.ts` ~79–153).
- `RelationshipLine` returns `null` on invalid validation or invalid line points (~232–234).
- `PulsingExecutiveLine.useFrame` guards missing material and invalid points before opacity mutation (~84–97).
- `RelationshipRenderer` memoizes relationships, position lookup, and scene plan (~47–73).

**Finding (not fixed — audit only):**

| File | Function | Risk | Recommended Fix |
|------|----------|------|-----------------|
| `RelationshipLine.tsx` | render (`coneGeometry` JSX, ~327–345) | Direction-cue cones allocate new `coneGeometry` on every re-render when `showDirectionCue` is true; GPU buffer churn at scale | Memoize geometry args or extract a memoized `DirectionCueMesh` component keyed by emphasis tier |
| `RelationshipLine.tsx` | render (multiple `<Line>` instances, ~275–326) | Up to five line draw calls per relationship (glow, pulse, main, double variant, invisible hit target); acceptable for executive view but amplifies draw calls as relationship count grows | Consider consolidating hit target + visible line where profile allows; profile-gate glow/double variants |

No undefined-access or count-access violations found. No unguarded runtime exception paths identified.

---

## CHECK E — Object Position Runtime

**Result: WARNING**

**Verified (positive):**

- `buildRuntimeObjectPositionLookupCache` performs a single O(n) pass and aliases all object keys (~282–328).
- `RelationshipRenderer` memoizes lookup by `buildRuntimeObjectPositionLookupSignature` (~52–63); recomputation only when object/context signature changes.
- Resolution chain preserves topology → layout → scene JSON → fallback priority (~198–253, ~403–474).
- No per-frame position reconstruction in `runtimeObjectPosition.ts` itself.

**Finding (not fixed — audit only):**

| File | Function | Risk | Recommended Fix |
|------|----------|------|-----------------|
| `runtimeObjectPosition.ts` | `collectObjectAliasKeys`, `findSceneObjectIndex` (~80–107, ~159–171) | O(n) linear scan per cache-miss lookup when callers omit `positionLookup` | Ensure all hot render paths pass `positionLookup`; deprecate or guard direct `resolveRuntimeObjectPosition` in render loops |
| `runtimeObjectPosition.ts` | `buildRuntimeObjectPositionLookupSignature` (~256–279) | Full JSON.stringify per object on every signature rebuild; acceptable on object change but costly for large scenes | Consider stable id + position hash instead of full object JSON for signature |

No topology regressions observed in the resolution priority chain.

---

## CHECK F — Scene Render Utilities

**Result: WARNING**

**Verified (positive):**

- `resolveRuntimeConnectionEndpoints` prefers cached lookup and avoids redundant provider logging when `logProvider: false` (~485–531).
- Position helpers re-exported from `runtimeObjectPosition.ts`; cache build is externalized and memoized by consumers.
- No object-map recreation loops in utility functions themselves.

**Finding (not fixed — audit only):**

| File | Function | Risk | Recommended Fix |
|------|----------|------|-----------------|
| `sceneRenderUtils.tsx` | `geometryFor`, `geometryForExecutiveNormalized` (~73–116) | Return new JSX geometry elements on each call; if invoked inline in render without memoization, causes repeated Three.js buffer allocation | Document/memoize at call sites; consider shared geometry primitives or `@react-three/drei` instancing for repeated kinds |
| `sceneRenderUtils.tsx` | `getObjPos` (~534–563) | Legacy O(n) `objects.find` path still present; bypasses unified cache | Route remaining callers through `getRuntimeObjPos` + lookup cache; mark deprecated |

`RelationshipRenderer` does not call `geometryFor` directly; risk is latent for other scene object renderers.

---

## CHECK G — Workspace Isolation

**Result: WARNING**

**Verified (positive):**

- `workspaceRelationshipDiscoveryContract.ts` persists and reads all relationship data keyed by `workspaceId` (`Record<WorkspaceId, T>`, ~74–77, ~333–340).
- `HomeScreen.tsx` scopes workspace reads to `activeRegistryWorkspaceId` for scene JSON, objects, goals, model, and relationships (~8878–8909).
- `getWorkspaceDiscoveredRelationships`, `getWorkspaceSceneJsonWithRelationships`, and storage hydration all resolve explicit workspace IDs (~353–360, ~486–489).

**Finding (not fixed — audit only):**

| File | Function | Risk | Recommended Fix |
|------|----------|------|-----------------|
| `workspaceRelationshipDiscoveryContract.ts` | `resolveWorkspaceId` (~146–150) | Falls back to `getActiveWorkspace()` when caller omits `workspaceId`; mis-call could read active workspace instead of intended workspace | Require explicit `workspaceId` in post-DS-1 paths; log dev warning on fallback |
| `mrpSelectedObjectBridge.ts` → `objectClickSelectionContextCache.ts` | `publishObjectClickSelectionContext` | Single global selection context cache (not keyed by workspace); rapid workspace switch could surface stale `selectedWorkspaceId` until next click | Key cache by `workspaceId` or clear on workspace switch event |

No evidence of Workspace A data leaking into Workspace B storage maps in the audited contract file. DS-1 isolation is certified separately (DS-1:7 gates I–L); this warning covers runtime UI cache edges only.

---

## CHECK H — Loop Protection

**Result: PASS**

**Verified:**

| Loop vector | Protection |
|-------------|------------|
| Recursive `setSceneJson` | `applySceneChangeSafe` early return on `next === prev`; JSON signature dedupe; stable write signature check |
| Recursive `dispatch` | Object-click path avoids `commitDashboardContextUpdate`; deprecated route voids dispatch |
| Recursive MRP write | `shouldPublishMrpSelectedObjectContext` no-op; panel same-state skip; `traceNexoraLoopGuard` diagnostics |
| Recursive selection write | Duplicate no-op in `commitObjectSelection`; eventId dedup in `commitObjectSelectionFromUserClick`; stale requestSeq guards |
| Recursive scene sync | No scene-sync write APIs in audited files; enrichment cache is read-only |

Key implementations: `useSceneApplyController.ts` (~268–625), `objectClickSelectionReadOnlyGuard.ts` (~117–188), `HomeScreen.tsx` loop guards (~12707–12728, ~6736–6746).

---

## Safety Compliance

- No new features introduced.
- No architectural refactoring performed.
- No runtime behavior modified.
- All issues recorded as File / Function / Risk / Recommended Fix only.

---

## DS-2 Entry Recommendation

**Approved for DS-2 entry** with the three WARNING items tracked as non-blocking stabilization follow-ups:

1. Memoize relationship direction-cue geometry (`RelationshipLine.tsx`).
2. Enforce position lookup cache on all render-hot paths (`runtimeObjectPosition.ts` consumers).
3. Workspace-key object-click selection context cache (`objectClickSelectionContextCache.ts`).

No FAIL findings block progression.

---

## Required Tags

`[STAB1_RUNTIME_AUDIT]` `[POST_DS1_AUDIT]` `[NO_RUNTIME_REGRESSION]` `[DS2_ENTRY_APPROVED]`
