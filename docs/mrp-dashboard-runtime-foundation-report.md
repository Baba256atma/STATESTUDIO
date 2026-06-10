# MRP:1:2 — Dashboard Runtime Foundation Report

## 1. Dashboard runtime contract

**Primary module:** `frontend/app/lib/dashboard/dashboardModeRuntimeContract.ts`

| Field / API | Purpose |
|-------------|---------|
| `DashboardMode` | Canonical mode union |
| `DASHBOARD_MODES` | Allowed values |
| `DEFAULT_DASHBOARD_MODE` | `"overview"` |
| `normalizeDashboardMode()` | Invalid mode → overview + `[DashboardRuntime][Brake]` |
| `resolveDashboardRuntimeState()` | Read authoritative runtime snapshot |
| `resolveDashboardModeRoute()` | Future routing entry (stub) with redirect detection |
| `dashboardModeLabel()` | UI labels |

**Bridge module:** `frontend/app/lib/dashboard/dashboardModeLegacyBridge.ts` — maps legacy `DashboardContext` / routes ↔ runtime modes without duplicating write paths.

**UI module:** `frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx` — Dashboard header, current mode indicator, safe placeholder body, legacy host slot.

## 2. Allowed modes

| Mode | Default | Legacy context mirror |
|------|---------|------------------------|
| `overview` | yes | `overview` |
| `focus` | | `overview` |
| `analyze` | | `risk` |
| `compare` | | `scenario` |
| `scenario` | | `scenario` |
| `war_room` | | `war_room` |

Modes are **not implemented** yet — placeholder UI only.

## 3. State authority owner

**Canonical owner:** `NexoraWorkspaceState.dashboardMode`

**Legacy mirror (compatibility only):** `NexoraWorkspaceState.dashboardContext` — synced on every dashboard write via `syncDashboardModeAndContext()`.

**Reducer actions:**
- `setDashboardMode` — preferred write path (MRP:2+)
- `setDashboardContext` — legacy path; maps to mode then syncs context
- `setMRPTab` — does **not** mutate dashboard mode (Assistant isolated)

**Assistant tab** does not own dashboard state.

## 4. Legacy routing findings

| Asset | Status |
|-------|--------|
| `rightPanelRouter.ts` | Legacy compatibility; views redirect to dashboard runtime |
| `RightPanelHost.tsx` | Legacy renderer mounted in Dashboard legacy host slot |
| `dashboardContextRouter.ts` | Commits `setDashboardContext`; reducer syncs `dashboardMode` |
| `dashboardContextBridge.ts` | Object/left-nav commits; future sources should prefer `setDashboardMode` |
| `executiveNavigationBridge.ts` | **Not found** |
| `executivePlaneNavigationResolver.ts` | **Not found** |

Documented in `dashboardModeLegacyRoutingFindings.ts`.

## 5. Risks discovered

1. **Dual field sync** — `dashboardMode` + `dashboardContext` coexist; writes must go through reducer sync to avoid drift. Direct state mutation would bypass brakes.
2. **Legacy RightPanelHost still visible** — Dashboard tab shows runtime header/placeholder plus legacy host below; may feel redundant until MRP:2 mode implementations replace legacy surfaces.
3. **Timeline activation** — `setTimelineState(activateContext: true)` maps to `overview` mode (timeline remains scene-native); legacy context may still read `timeline` briefly before sync — verify if any consumer reads context mid-frame.
4. **Router not yet migrated** — `dashboardContextRouter` still emits `setDashboardContext`; acceptable for MRP:1:2 but should gain `setDashboardMode` emission in MRP:2.

## 6. Follow-up work (MRP:2 phase)

1. Wire Object Panel actions → `setDashboardMode` (Analyze, Compare, Scenario, War Room, Focus)
2. Wire Scene Panel / Timeline / Executive Command Dock through `resolveDashboardModeRoute()`
3. Migrate `dashboardContextRouter` commits to `setDashboardMode` first
4. Implement mode surfaces behind `DashboardRuntimePanel` (replace placeholder body per mode)
5. Collapse or hide legacy `RightPanelHost` once mode runtimes reach parity
6. Add integration tests for route dedupe / no ping-pong between tab switch and mode switch

## Verification

- `npx vitest run app/lib/dashboard/dashboardModeRuntimeContract.test.ts app/lib/ui/mainRightPanelStateContract.test.ts`
- `npm run build`
- Manual `/type-c`: Dashboard tab shows **Current Mode: Overview**; Assistant tab switch preserves mode; Object Panel unaffected
