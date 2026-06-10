# MRP:9:5-FIX-2 — Favorites getSnapshot Purity Fix Report

**Date:** 2026-06-07  
**Scope:** Remove registry initialization from `getWorkspaceFavoritesSnapshot` so `useSyncExternalStore` getSnapshot is pure and read-only. No new features.

---

## Verdict: **FIXED**

| Check | Result |
|-------|--------|
| getSnapshot pure (no init) | **PASS** |
| Unsafe registry initialization brake removed | **PASS** |
| Snapshot referential stability | **PASS** |
| Subscribe hydrates client after init | **PASS** |
| SSR / server snapshot stable | **PASS** |
| Favorites tests | **15/15 PASS** |
| Navigation freeze tests | **22/22 PASS** |
| Build | **PASS** |

---

## 1. Root Cause

After MRP:9:5-FIX, the infinite loop was resolved via cached snapshots, but `getWorkspaceFavoritesSnapshot` still called `ensureRegistryInitialized()` when `registryInitialized === false`, logging:

```
[FavoritesRegistry][Brake] { message: "Unsafe registry initialization.", context: "getSnapshot" }
```

**Why this happened:** React `useSyncExternalStore` calls `getSnapshot` during render **before** `subscribe` runs (subscribe is registered in an effect after the first render). On the first client render, getSnapshot ran while the registry was still uninitialized, triggering the guarded init path.

This violated the required architecture:
- getSnapshot must be pure and read-only
- Initialization must not occur during render

---

## 2. What Initialization Was Moved

| Before | After |
|--------|-------|
| `getSnapshot` → `ensureRegistryInitialized()` + localStorage load | `getSnapshot` → return stable `WORKSPACE_FAVORITES_INITIAL_SNAPSHOT` |
| Init on first getSnapshot call | Init only in `subscribeWorkspaceFavorites()` |
| Server snapshot separate empty object | Server + pre-init share `WORKSPACE_FAVORITES_INITIAL_SNAPSHOT` |
| No post-subscribe re-render trigger | `subscribe` calls `listener()` once after first init to hydrate UI |

**Initialization remains in (allowed paths):**
- `subscribeWorkspaceFavorites()` — primary client bootstrap (React effect)
- `initializeWorkspaceFavoritesRegistry()` — explicit API for actions/tests
- All mutation APIs (`pinWorkspaceAction`, `restoreDefaultWorkspaceFavorites`, etc.)

---

## 3. How getSnapshot Became Pure

```typescript
export const WORKSPACE_FAVORITES_INITIAL_SNAPSHOT = Object.freeze({ items: Object.freeze([]), ... });
export const WORKSPACE_FAVORITES_SERVER_SNAPSHOT = WORKSPACE_FAVORITES_INITIAL_SNAPSHOT;

export function getWorkspaceFavoritesSnapshot(): WorkspaceFavoritesStateView {
  if (!registryInitialized) {
    return WORKSPACE_FAVORITES_INITIAL_SNAPSHOT; // stable ref, no side effects
  }
  return syncCachedSnapshot(); // cached ref when revision unchanged
}

export function subscribeWorkspaceFavorites(listener: () => void): () => void {
  const needsClientHydrationSync = !registryInitialized;
  ensureRegistryInitialized(); // localStorage load happens here only
  listeners.add(listener);
  if (needsClientHydrationSync) {
    listener(); // re-render with hydrated favorites
  }
  return () => listeners.delete(listener);
}
```

**Properties enforced:**
- No registry init in getSnapshot
- No localStorage access in getSnapshot
- No mutation in getSnapshot
- Same reference when state unchanged (`storeRevision` cache)
- Brake logs only for real corruption (invalid snapshot shape, duplicate pin, etc.)

---

## 4. SSR / Client Safety Validation

| Scenario | Behavior |
|----------|----------|
| SSR render | `getWorkspaceFavoritesServerSnapshot()` → stable empty snapshot |
| First client render (pre-subscribe) | `getSnapshot()` → same stable empty snapshot (matches server) |
| After subscribe effect | Registry loads from localStorage; listener triggers re-render |
| Hydrated client render | `getSnapshot()` → cached snapshot with persisted favorites |
| No localStorage during SSR | ✅ Persistence adapter returns null when `localStorage` undefined |
| No render-time mutation | ✅ Init only in subscribe effect path |

**ExecutiveFavoritesSurface** unchanged — still uses:

```typescript
useSyncExternalStore(
  subscribeWorkspaceFavorites,
  getWorkspaceFavoritesSnapshot,
  getWorkspaceFavoritesServerSnapshot
);
```

---

## 5. Console Validation Result

### Expected console (browser `/type-c`)

| Message | Status |
|---------|--------|
| getSnapshot infinite loop error | **Absent** |
| `Unsafe registry initialization` / `context: getSnapshot` | **Absent** |
| Maximum update depth exceeded | **Absent** |

### Automated

```
node --test workspaceFavoritesRegistry.test.ts          → 15/15 PASS
node --test executiveDashboardNavigationFreezeQaValidation.test.ts → 22/22 PASS
npm run build                                           → PASS
```

New tests:
- `getSnapshot before init is pure and does not load persistence`
- `subscribe initializes registry and hydrates snapshot`

---

## 6. Remaining Warnings

| Warning | Status | Notes |
|---------|--------|-------|
| Legacy navigation bypasses (MRP:9:5) | Pre-existing | Unrelated |
| MRP-HUD:1 zoning | Pre-existing | No HUD changes |
| `baseline-browser-mapping` age | Build tooling | Non-blocking |
| Brief empty favorites flash on first paint | Acceptable | Resolves after subscribe hydrates (one frame) |

No new warnings introduced.

---

## Files Changed

| File | Change |
|------|--------|
| `frontend/app/lib/workspaces/workspaceFavoritesRegistry.ts` | Pure getSnapshot; init in subscribe only; shared initial/server snapshot |
| `frontend/app/lib/workspaces/workspaceFavoritesRegistry.test.ts` | Purity + subscribe hydration tests |

---

## Definition of Done

- [x] getSnapshot is pure
- [x] No initialization inside getSnapshot
- [x] No unsafe registry initialization warning
- [x] Favorites still work (pin/unpin/launch/reorder)
- [x] Build passes
- [x] No runtime errors / regressions (37 related tests pass)
