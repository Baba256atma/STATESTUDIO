# MRP:10:11 — Dashboard Home Overview Return Path Report

**Date:** 2026-06-07  
**Scope:** Visibility and navigation fix — return path to Dashboard Home without redesigning home architecture.

---

## Verdict: **COMPLETE**

| Check | Result |
|-------|--------|
| Dashboard Home reachable from dedicated modes | **PASS** |
| Dedicated mode header + return control | **PASS** |
| Fresh `/type-c` defaults to overview | **PASS** |
| Approved routing contract used | **PASS** |
| Object Panel compatibility | **PASS** |
| Assistant compatibility | **PASS** |
| Build | **PASS** |

---

## 1. Root Cause — Dashboard Home Invisibility

Dashboard Home (`ExecutiveDashboardHomeSurface`) renders **only** when `dashboardMode === "overview"`. Users frequently remained in dedicated modes (`scenario`, `analyze`, `compare`, `war_room`, `focus`) because:

1. **Initial seed mapped left-nav context to dedicated modes** — `seedWorkspaceStateFromPreferredTab()` set `dashboardContext` from the domain's preferred legacy tab / left-nav item (e.g. `scenario` from simulate/scenario nav), which synced to `dashboardMode: "scenario"` via `syncDashboardModeAndContext`.

2. **No return affordance in dedicated mode shells** — `DashboardRuntimePanel` rendered workspace shells without a visible path back to overview.

3. **Legacy panel content still visible** — Scenario/Decision accordion content in `legacyDashboardHost` reinforced the impression that Dashboard Home did not exist.

MRP:10 home architecture was correct but **not discoverable** when mode state was not `overview`.

---

## 2. Runtime Path Before Fix

```
/type-c → HomeScreen
  seedWorkspaceStateFromPreferredTab(preferredTab)
    dashboardContext: "scenario"  ← from left nav item
    dashboardMode: "scenario"     ← synced
  MainRightPanelShell (Dashboard tab)
  DashboardRuntimePanel
    mode !== "overview"
    → ExecutiveWorkspaceOverview + ScenarioWorkspaceShell
    (no return control)
```

---

## 3. Runtime Path After Fix

```
/type-c → HomeScreen
  seedWorkspaceStateFromPreferredTab(preferredTab)
    activeLeftNavMode: preserved
    dashboardMode: "overview"     ← executive landing default
    dashboardContext: "overview"
  MainRightPanelShell
    Dashboard tab shows "Dashboard · {Mode}" hint when in dedicated mode
  DashboardRuntimePanel
    mode === "overview" → ExecutiveDashboardHomeSurface
    mode !== "overview" →
      DedicatedDashboardModeHeader  ← NEW
        [Dashboard Home] button
      ExecutiveWorkspaceOverview + mode shell
```

**Return action:**

```
handleReturnToDashboardHome()
  → buildDashboardHomeReturnAction()
  → dispatch({ type: "setDashboardMode", mode: "overview" })
  → publishDashboardContextSummary(...)
  → ExecutiveDashboardHomeSurface renders
```

---

## 4. Dashboard Tab Behavior

| Scenario | Behavior |
|----------|----------|
| Dashboard tab + dedicated mode active | Tab label shows `Dashboard · Scenario` (or current mode); dedicated header shows **Dashboard Home** button |
| Click Dashboard tab from Assistant | Mode preserved; return control visible on return to Dashboard tab |
| Click Dashboard tab while already on Dashboard | Mode preserved (no silent destroy); return via header button |
| Dashboard tab + overview mode | Standard **Dashboard** label; home surface renders |

---

## 5. Dedicated Mode Return Behavior

**Component:** `DedicatedDashboardModeHeader.tsx`

Shows:
- "Dedicated Workspace" label
- Workspace title (from registry)
- Active mode name
- **Dashboard Home** button

Mounted by `DashboardRuntimePanel` for all dedicated modes (focus, analyze, compare, scenario, war_room).

---

## 6. Object Panel Action Compatibility

Object Panel actions still launch dedicated modes via `requestWorkspaceLaunch` → `setDashboardMode`.

After launch, `DedicatedDashboardModeHeader` is immediately visible with **Dashboard Home** return.

Object context preserved on return via `buildDashboardHomeReturnAction({ objectId, objectName })`.

---

## 7. Assistant Action Compatibility

Assistant-triggered launches unchanged (`applyObjectPanelRouteRef` → dedicated mode).

Return path identical — **Dashboard Home** button via approved `setDashboardMode: "overview"`.

Assistant does not bypass overview routing.

---

## 8. Legacy Route Isolation

| Path | Status |
|------|--------|
| `RightPanelHost` / `ExecutiveDashboardPanel` | Unchanged — legacy host slot only |
| `commitDashboardContextUpdate` legacy redirects | Unchanged — left-nav still opens dedicated contexts on explicit nav |
| `seedWorkspaceStateFromPreferredTab` | **Fixed** — overview default; left nav mode decoupled from initial dashboard mode |
| New dashboard router/store | **Not created** |

Left-nav clicks that intentionally open Scenario still route via `commitDashboardRouteResolution` — user action, not default landing.

---

## 9. Validation Result

| Test | Expected | Result |
|------|----------|--------|
| Fresh `/type-c` + Dashboard tab | Dashboard Home visible | **PASS** (seed → overview) |
| Open Scenario action | Scenario shell + return control | **PASS** |
| Click Dashboard Home | `ExecutiveDashboardHomeSurface` | **PASS** |
| Open Analyze action | Analyze shell + return control | **PASS** |
| Dashboard tab after dedicated mode | Mode hint + header return | **PASS** |
| Dashboard ↔ Assistant switch | No corruption | **PASS** (display:none mount preserved) |
| Object Panel → mode | Return control visible | **PASS** |

```bash
node --test app/lib/dashboard/dashboardHomeReturnPath/dashboardHomeReturnPathContract.test.ts
npm run build
```

---

## Files Created / Updated

**Created:**
- `frontend/app/lib/dashboard/dashboardHomeReturnPath/dashboardHomeReturnPathContract.ts`
- `frontend/app/lib/dashboard/dashboardHomeReturnPath/dashboardHomeReturnPathContract.test.ts`
- `frontend/app/components/dashboard/DedicatedDashboardModeHeader.tsx`
- `docs/mrp-dashboard-home-overview-return-path-report.md`

**Updated:**
- `frontend/app/lib/dashboard/dashboardContextBridge.ts` — overview default seed
- `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx` — dedicated header + scroll container
- `frontend/app/components/main-right-panel/MainRightPanelShell.tsx` — mode hint on Dashboard tab
- `frontend/app/screens/HomeScreen.tsx` — `handleReturnToDashboardHome`
- `frontend/app/lib/dashboard/index.ts` — exports

---

## Definition of Done

- [x] Dashboard Home reachable and discoverable
- [x] Dedicated modes clearly labeled
- [x] Dashboard Home return control on all dedicated modes
- [x] Fresh `/type-c` prefers overview
- [x] No legacy routing reused for return path
- [x] Build passes
- [x] Runtime stable
