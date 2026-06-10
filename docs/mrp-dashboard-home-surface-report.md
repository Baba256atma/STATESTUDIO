# MRP:10:1 — Executive Dashboard Home Surface Report

**Date:** 2026-06-07  
**Scope:** Default Dashboard landing view (overview mode) with unified workspace intelligence overview. No HUD changes. No new navigation systems.

---

## Verdict: **COMPLETE**

| Check | Result |
|-------|--------|
| Dashboard Home renders by default (overview mode) | **PASS** |
| MRP:9 surfaces reused | **PASS** |
| No duplicate navigation state | **PASS** |
| Missing-object console noise reduced | **PASS** |
| Build | **PASS** |
| Automated tests | **60/60 PASS** (navigation + home + favorites + recents + recommendations) |

---

## 1. Home Surface Architecture

Dashboard Home is the **`overview`** dashboard mode — the existing `DEFAULT_DASHBOARD_MODE`. It is rendered inside `DashboardRuntimePanel` via `ExecutiveDashboardHomeSurface`, not a separate panel or legacy route.

```
DashboardRuntimePanel (mode === "overview")
  └── ExecutiveDashboardHomeSurface
        ├── Dashboard Status Header (active workspace, lifecycle, navigation, object)
        ├── Safe Empty State (no object selected)
        ├── Executive Workspace Overview
        │     ├── DashboardWorkspaceLauncher (MRP:9:1)
        │     ├── ExecutiveWorkspaceRecommendations (MRP:9:2)
        │     ├── ExecutiveFavoritesSurface (MRP:9:3)
        │     └── ExecutiveWorkspaceRecentsSurface (MRP:9:4)
        ├── Workspace Intelligence Summary (placeholder cards)
        └── legacyHost slot (accordion runtime, when provided)

Dedicated workspace modes (analyze, compare, etc.)
  ├── ExecutiveWorkspaceOverview (same MRP:9 surfaces)
  └── Workspace shell (AnalyzeWorkspaceShell, etc.)
```

**Runtime module:** `dashboardHomeSurfaceRuntime.ts` aggregates registry, lifecycle, and history metadata read-only. No launches, no mutations.

**Contract:** `dashboardHomeSurfaceContract.ts`

---

## 2. Surfaces Reused from MRP:9

| Surface | Component | Duplicated Logic |
|---------|-----------|------------------|
| Launcher | `DashboardWorkspaceLauncher` | No |
| Recommendations | `ExecutiveWorkspaceRecommendations` | No |
| Favorites | `ExecutiveFavoritesSurface` | No |
| Recents | `ExecutiveWorkspaceRecentsSurface` | No |

Extracted wrapper: `ExecutiveWorkspaceOverview.tsx` — shared by Home and dedicated workspace modes.

---

## 3. State Ownership Map

| Concern | Owner | Home Surface Role |
|---------|-------|-------------------|
| Dashboard mode dispatch | `NexoraWorkspaceState.dashboardMode` | Reads `overview` |
| Workspace metadata | Workspace Registry | Read via `getExecutiveWorkspaceEntry` |
| Lifecycle state | Lifecycle Manager | Read via `getActiveWorkspaceLifecycleState` |
| Navigation trail | History runtime | Read via `getWorkspaceNavigationSummary` |
| Launch execution | HomeScreen handlers → Transition Controller | Delegates via props |
| Recommendations | Recommendation engine | Advisory read only |
| Favorites | Favorites registry | Subscribe + preview |
| Recents | Recents registry | Read-only projection |
| Assistant | Read-only observer | Unchanged |

Home surface creates **no duplicate state**. All navigation props flow from `HomeScreen` → `MainRightPanelShell` → `DashboardRuntimePanel`.

---

## 4. Empty State Handling

When no scene object is selected, Dashboard Home shows:

> No active object selected. Select a scene object to unlock object-scoped workspace launches.

The intelligence summary card for selected object shows **"No active object selected"** as placeholder text. Launcher disables object-scoped launch buttons via existing `objectRequired` UI logic — no brake logs on render.

---

## 5. Console-Noise Reduction for Missing-Object Brakes

Brakes now fire only on **action attempts**, not normal dashboard home render.

| Area | Change |
|------|--------|
| **HomeScreen** | `resolveFocus/Analyze/Compare/Scenario/WarRoomModeContext` only runs when that mode is active — overview no longer triggers 5× "Missing object" brakes |
| **Recommendations** | Removed `Missing object for launchable recommendation` brake during evaluation; cards render with `launchable: false` |
| **Favorites** | Added `previewPinnedActionLaunch()` for UI; `validatePinnedActionLaunch()` with brakes only on Launch click |
| **Recents** | Added `previewRecentReturnPath()` for UI; `validateRecentReturnPath()` with brakes only on Return click |
| **Launcher** | Unchanged — brakes only in `requestWorkspaceLaunch()` on user launch attempt |

Real issues (invalid workspace, corrupt favorites, registry rejection on action) still log brakes.

---

## 6. Known Remaining Blocker: MRP-HUD:1

**HUDZoneBrake overlap warning** remains a pre-existing blocker documented for final MRP Freeze. This prompt did **not** modify:

- Scene HUD layout
- Object Panel placement
- Timeline Panel placement
- MRP shell zoning

MRP-HUD:1 repair pass is still required before final freeze.

Other non-blocking diagnostics (SceneHydration allowed diagnostics) unchanged.

---

## Files Created / Updated

| File | Action |
|------|--------|
| `frontend/app/lib/dashboard/dashboardHomeSurfaceContract.ts` | Created |
| `frontend/app/lib/dashboard/dashboardHomeSurfaceRuntime.ts` | Created |
| `frontend/app/lib/dashboard/dashboardHomeSurfaceRuntime.test.ts` | Created |
| `frontend/app/components/dashboard/ExecutiveDashboardHomeSurface.tsx` | Created |
| `frontend/app/components/dashboard/ExecutiveWorkspaceOverview.tsx` | Created |
| `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx` | Updated |
| `frontend/app/screens/HomeScreen.tsx` | Mode-gated context resolution |
| `frontend/app/lib/workspaces/workspaceRecommendationEngine.ts` | Quiet empty-object evaluation |
| `frontend/app/lib/workspaces/workspaceFavoritesRegistry.ts` | Preview vs validate split |
| `frontend/app/lib/workspaces/workspaceRecentsRegistry.ts` | Preview vs validate split |
| `frontend/app/components/dashboard/ExecutiveFavoritesSurface.tsx` | Preview on render |
| `frontend/app/components/dashboard/ExecutiveWorkspaceRecentsSurface.tsx` | Preview on render |
| `frontend/app/lib/dashboard/index.ts` | Exports |

---

## Definition of Done

- [x] Dashboard Home renders by default
- [x] Launcher / Recommendations / Favorites / Recents reused
- [x] No duplicate navigation state
- [x] Missing-object warnings reduced for normal empty state
- [x] Build passes
- [x] No runtime errors introduced
- [x] HUDZoneBrake documented, not hidden

---

## Executive Questions Answered (Home Surface)

| Question | Home Section |
|----------|--------------|
| What is active now? | Status Header |
| What workspace is available? | Launcher |
| What needs attention? | Recommendations |
| What was recently used? | Recents |
| What can the executive launch next? | Favorites + Launcher + Recommendations |

Dashboard remains sole navigation authority.
