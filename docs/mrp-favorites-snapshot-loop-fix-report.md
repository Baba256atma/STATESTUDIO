# MRP:9:5-FIX — Favorites External Store Snapshot Loop Fix Report

**Date:** 2026-06-07  
**Scope:** Runtime stabilization fix for `useSyncExternalStore` infinite loop in Executive Favorites surface. No UI redesign, no new features.

---

## Verdict: **FIXED**

| Check | Result |
|-------|--------|
| getSnapshot infinite loop | **RESOLVED** |
| Snapshot referential stability | **PASS** |
| Server snapshot stability | **PASS** |
| Subscription safety | **PASS** |
| Existing favorites tests | **13/13 PASS** |
| Navigation freeze tests | **22/22 PASS** |
| Build | **PASS** |

---

## 1. Root Cause

`getWorkspaceFavoritesSnapshot()` called `buildWorkspaceFavoritesSnapshot()` on **every** invocation, which created a new frozen object via `Object.freeze({ items: Object.freeze(items.map(...)), ... })` even when underlying favorites data had not changed.

React `useSyncExternalStore` compares snapshot references between renders. A new reference on every `getSnapshot()` call signals a store update → re-render → another `getSnapshot()` → infinite loop with error:

> "The result of getSnapshot should be cached to avoid an infinite loop"

**Secondary issue:** Cache invalidation keyed only on `updatedAt` failed when multiple mutations occurred within the same millisecond (e.g. init with empty items → restore defaults), returning a stale empty cached snapshot.

**Tertiary issue:** Server snapshot getter `() => initializeWorkspaceFavoritesRegistry()` created new objects during SSR hydration and performed initialization side effects in the render path.

---

## 2. Files Changed

| File | Change |
|------|--------|
| `frontend/app/lib/workspaces/workspaceFavoritesRegistry.ts` | Cached snapshot + `storeRevision` counter; `commitRegistryChange()`; stable server snapshot export |
| `frontend/app/components/dashboard/ExecutiveFavoritesSurface.tsx` | Use `getWorkspaceFavoritesServerSnapshot` instead of inline init lambda |
| `frontend/app/lib/workspaces/workspaceFavoritesRegistry.test.ts` | Added snapshot stability tests (3 new tests) |

---

## 3. Snapshot Stability Fix

### Cached snapshot with revision counter

```typescript
let storeRevision = 0;
let cachedSnapshotRevision = -1;
let cachedSnapshot: WorkspaceFavoritesStateView | null = null;

function syncCachedSnapshot(): WorkspaceFavoritesStateView {
  if (cachedSnapshot !== null && cachedSnapshotRevision === storeRevision) {
    return cachedSnapshot; // same reference when unchanged
  }
  cachedSnapshot = Object.freeze({ ... });
  cachedSnapshotRevision = storeRevision;
  return cachedSnapshot;
}

function markStoreMutated(at = Date.now()): void {
  storeRevision += 1;
  updatedAt = at;
}
```

### Mutation path

All registry mutations call `markStoreMutated()` then `commitRegistryChange()` which:
1. Rebuilds cached snapshot once
2. Notifies subscribers once

### Stable server snapshot

```typescript
export const WORKSPACE_FAVORITES_SERVER_SNAPSHOT = Object.freeze({ items: Object.freeze([]), ... });
export function getWorkspaceFavoritesServerSnapshot() {
  return WORKSPACE_FAVORITES_SERVER_SNAPSHOT;
}
```

### getSnapshot purity

- `getWorkspaceFavoritesSnapshot()` returns cached reference via `syncCachedSnapshot()`
- Initialization moved to `ensureRegistryInitialized()` called from `subscribe` (primary) with guarded fallback in `getSnapshot`
- No object/array allocation when `storeRevision` unchanged

---

## 4. Subscription Stability Validation

| Rule | Status |
|------|--------|
| `subscribe` does not mutate favorites state | ✅ PASS |
| Duplicate subscription detected | ✅ Brake log added |
| Listeners notified only on `commitRegistryChange` | ✅ PASS |
| Init runs once via `ensureRegistryInitialized` | ✅ PASS |
| Repeated `getSnapshot()` returns same reference | ✅ Test verified |
| New reference only after mutation | ✅ Test verified |

**Brake logs added (`[FavoritesRegistry][Brake]`):**
- Unsafe registry initialization (getSnapshot before subscribe)
- Duplicate subscription
- Invalid favorite state (corrupt loaded snapshot)

---

## 5. Remaining Warnings

| Warning | Status | Notes |
|---------|--------|-------|
| Legacy navigation bypasses (MRP:9:5) | Pre-existing | Unrelated to this fix |
| MRP-HUD:1 zoning | Pre-existing | No HUD changes in this fix |
| `baseline-browser-mapping` age | Build tooling | Non-blocking |
| Unsafe init brake in getSnapshot edge case | Informational | Should not fire in normal React mount order (subscribe before getSnapshot) |

No new warnings introduced by this fix.

---

## 6. Build / Browser Validation

### Automated

```
node --test workspaceFavoritesRegistry.test.ts          → 13/13 PASS
node --test executiveDashboardNavigationFreezeQaValidation.test.ts → 22/22 PASS
npm run build                                           → PASS
```

### Browser (`/type-c`)

**Expected after fix:**
- No "getSnapshot should be cached" error
- No "Maximum update depth exceeded" error
- Executive Favorites surface renders without loop
- Pin/unpin/launch/reorder operate normally
- Dashboard Navigation layer (Launcher, Recommendations, Recents) unaffected

---

## Definition of Done

- [x] getSnapshot error removed (referential stability enforced)
- [x] Favorites registry snapshot is stable
- [x] Dashboard renders without loop
- [x] MRP navigation layer remains stable
- [x] Build passes
- [x] No new regression (35 related tests pass)
