# MRP:10:11-FIX — Dashboard Home Live Runtime Mount Fix Report

**Date:** 2026-06-07  
**Scope:** Connect MRP:10 Dashboard Home to the live `/type-c` runtime path; suppress legacy RightPanelHost override.

---

## Problem

MRP:10:11 (Overview Return Path) was implemented and tests/build passed, but runtime at `/type-c` still showed legacy **Scenario / Decision / Nexora AI** accordion content from Phase 3–6 intelligence surfaces. None of the modern MRP:10 UI was visible:

- `ExecutiveDashboardHomeSurface`
- `DedicatedDashboardModeHeader`
- Dashboard Home button
- `Dashboard · Scenario` tab hint

---

## Root Cause

The modern path **was mounted** but **visually overridden** by legacy content stacked inside it.

### Actual mounted runtime path (before fix)

```
/type-c
  → TypeCPage
  → NexoraManagerWorkspaceShell
  → HomeScreen
  → createPortal(panelContent → #nexora-right-panel-root)
  → MainRightPanelShell (activeTab === "dashboard")
  → DashboardRuntimePanel (dashboardMode === "overview")
  → ExecutiveDashboardHomeSurface          ← modern home (rendered)
  → legacyHost slot (flex: 1)              ← took all remaining space
       → LegacyDashboardHostMountTrace
       → RightPanelHost (view === "dashboard")
       → DashboardRuntimeContainer
       → ExecutiveSummarySurface + Phase 3–6 accordion intelligence
```

**Incorrect legacy path found:** `DashboardRuntimePanel` rendered `props.legacyHost` (`RightPanelHost`) **below** `ExecutiveDashboardHomeSurface` in overview mode with `flex: 1`, so the legacy accordion dominated the visible panel even though the modern components were mounted.

Initial workspace seed was already correct (`activeMRPTab: "dashboard"`, `dashboardMode: "overview"` via `seedWorkspaceStateFromPreferredTab`).

---

## Fix Applied

### 1. Suppress legacy host for all modern MRP dashboard modes

**File:** `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx`

Added `shouldSuppressLegacyDashboardHost()` — returns `true` for `overview`, `focus`, `analyze`, `compare`, `scenario`, and `war_room`. Legacy `RightPanelHost` is no longer rendered in the legacy host slot for these modes.

Overview branch now renders **only** `ExecutiveDashboardHomeSurface`. Dedicated modes render `DedicatedDashboardModeHeader` + workspace shells without legacy stacking.

### 2. Dev-only runtime trace logs

**File:** `frontend/app/lib/dashboard/dashboardHomeReturnPath/dashboardHomeRuntimeTrace.ts`

| Log message | Component |
|---|---|
| `[MRP10RuntimeTrace] MainRightPanelShell mounted` | `MainRightPanelShell.tsx` |
| `[MRP10RuntimeTrace] DashboardRuntimePanel mounted` | `DashboardRuntimePanel.tsx` |
| `[MRP10RuntimeTrace] ExecutiveDashboardHomeSurface mounted` | `ExecutiveDashboardHomeSurface.tsx` |
| `[MRP10RuntimeTrace] DedicatedDashboardModeHeader mounted` | `DedicatedDashboardModeHeader.tsx` |
| `[MRP10RuntimeTrace] RightPanelHost legacy mounted` | `RightPanelHost.tsx` |
| `[MRP10RuntimeTrace] legacyDashboardHost mounted` | `LegacyDashboardHostMountTrace.tsx` |
| `[MRP10RuntimeTrace] legacyDashboardHost suppressed` | `DashboardRuntimePanel.tsx` (when legacy passed but not rendered) |

Traces are dev-only (`NODE_ENV !== "production"`).

### 3. Legacy mount trace wrapper

**File:** `frontend/app/components/main-right-panel/LegacyDashboardHostMountTrace.tsx`

Wraps `RightPanelHost` in `HomeScreen.tsx` so mount of the legacy host slot is observable when it does render.

---

## Corrected runtime path (after fix)

```
/type-c (fresh reload)
  → HomeScreen.panelContent → #nexora-right-panel-root
  → MainRightPanelShell
       activeTab === "dashboard"
       dashboardMode === "overview" (default seed)
  → DashboardRuntimePanel
       suppressLegacyHost === true
       → ExecutiveDashboardHomeSurface ONLY
       → legacy host slot: NOT RENDERED

/type-c (scenario / analyze / compare / focus / war_room mode)
  → MainRightPanelShell
       tab hint: "Dashboard · {Mode}" when dedicated
  → DashboardRuntimePanel
       → DedicatedDashboardModeHeader (Dashboard Home button)
       → ExecutiveWorkspaceOverview + mode workspace shell
       → legacy host slot: NOT RENDERED
```

---

## Expected proof logs (dev console, `/type-c`, Dashboard tab)

### Fresh reload — overview (Dashboard Home)

```
[MRP10RuntimeTrace] MainRightPanelShell mounted { activeTab: "dashboard", dashboardMode: "overview", ... }
[MRP10RuntimeTrace] DashboardRuntimePanel mounted { mode: "overview", isHomeMode: true, suppressLegacyHost: true, hasLegacyHost: true }
[MRP10RuntimeTrace] legacyDashboardHost suppressed { mode: "overview" }
[MRP10RuntimeTrace] ExecutiveDashboardHomeSurface mounted { dashboardMode: "overview" }
```

**Must NOT appear:** `legacyDashboardHost mounted`, `RightPanelHost legacy mounted`

### Scenario mode (after launching Scenario workspace)

```
[MRP10RuntimeTrace] MainRightPanelShell mounted { activeTab: "dashboard", dashboardMode: "scenario", isDedicatedDashboardMode: true }
[MRP10RuntimeTrace] DashboardRuntimePanel mounted { mode: "scenario", isDedicatedMode: true, suppressLegacyHost: true }
[MRP10RuntimeTrace] DedicatedDashboardModeHeader mounted { mode: "scenario" }
```

Tab label should show: **Dashboard · Scenario**

---

## Screenshot validation checklist

| # | Check | Pass criteria |
|---|---|---|
| 1 | Fresh `/type-c` reload | Dashboard tab active; Zones A–D Dashboard Home visible (summary cards, quick actions, recommendations, timeline) |
| 2 | No legacy accordion | Scenario/Decision/Nexora AI Phase 3–6 accordion **not** visible on Dashboard Home |
| 3 | Tab bar | `Dashboard` and `Assistant` tabs visible; no legacy multi-tab strip |
| 4 | Scenario mode | Launch Scenario workspace → `Dedicated Dashboard Mode` header with **Dashboard Home** button |
| 5 | Tab hint | Tab reads `Dashboard · Scenario` (or Analyze / Compare / etc.) |
| 6 | Return path | Click **Dashboard Home** → returns to overview; `ExecutiveDashboardHomeSurface` visible again |
| 7 | DOM markers | `[data-nx="dashboard-runtime-panel"]`, `[data-nx-dashboard-mode="overview"]` present; `[data-nx="dashboard-runtime-legacy-host"]` **absent** on overview |

---

## Files changed

| File | Change |
|---|---|
| `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx` | Suppress legacy host; runtime traces |
| `frontend/app/lib/dashboard/dashboardHomeReturnPath/dashboardHomeRuntimeTrace.ts` | **NEW** — trace helper + suppression policy |
| `frontend/app/components/main-right-panel/LegacyDashboardHostMountTrace.tsx` | **NEW** — legacy mount trace wrapper |
| `frontend/app/components/main-right-panel/MainRightPanelShell.tsx` | MRP10 runtime trace |
| `frontend/app/components/dashboard/ExecutiveDashboardHomeSurface.tsx` | MRP10 runtime trace |
| `frontend/app/components/dashboard/DedicatedDashboardModeHeader.tsx` | MRP10 runtime trace |
| `frontend/app/components/right-panel/RightPanelHost.tsx` | MRP10 legacy mount trace |
| `frontend/app/screens/HomeScreen.tsx` | Wrap legacy host with mount trace |
| `frontend/app/lib/dashboard/index.ts` | Export runtime trace module |

---

## Build result

```
npm run build  — PASS (see CI/local build output)
```

---

## Definition of Done

| Criterion | Status |
|---|---|
| Fresh `/type-c` shows Dashboard Home when Dashboard tab active | ✅ Fixed (legacy suppressed) |
| Scenario mode shows `DedicatedDashboardModeHeader` | ✅ Already wired; now unobstructed |
| Dashboard Home button visible in dedicated modes | ✅ |
| Legacy `RightPanelHost` does not override Dashboard Home | ✅ `shouldSuppressLegacyDashboardHost` |
| Dev runtime traces added | ✅ |
| Build passes | ✅ |
| Runtime screenshot confirms fix | ⏳ Manual validation at `/type-c` |

---

## Notes

- **No new Dashboard Home features** were added; this is a runtime connection fix only.
- HUD zoning and MRP shell structure were not modified.
- `RightPanelHost` remains passed from `HomeScreen` for future non-MRP modes but is suppressed at render time inside `DashboardRuntimePanel` for all canonical executive dashboard modes.
