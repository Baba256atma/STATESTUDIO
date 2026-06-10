/**
 * MRP:10:9 — Dashboard Home Runtime QA legacy findings.
 */

export const DASHBOARD_HOME_RUNTIME_LEGACY_FINDINGS = Object.freeze({
  executiveDashboardPanel: {
    path: "frontend/app/components/panels/ExecutiveDashboardPanel.tsx",
    status: "legacy_isolated",
    note: "Legacy panel may render via legacyHost — not canonical Dashboard Home hierarchy.",
  },
  rightPanelHost: {
    path: "frontend/app/components/right-panel/RightPanelHost.tsx",
    dashboardView: {
      status: "not_home_authority",
      note: "RightPanelHost dashboard view is legacy route — MRP uses MainRightPanelShell.",
    },
  },
  dashboardRuntimePanel: {
    path: "frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx",
    homeSurfaceGatedByOverview: {
      status: "approved",
      note: "ExecutiveDashboardHomeSurface only when runtime.mode === overview.",
    },
  },
  mainRightPanelShell: {
    path: "frontend/app/components/main-right-panel/MainRightPanelShell.tsx",
    tabSwitchStrategy: {
      status: "display_none_preserve_mount",
      note: "Dashboard tab uses display:none + hidden — preserves mount on Assistant switch.",
    },
  },
  executiveDashboardHomeSurface: {
    path: "frontend/app/components/dashboard/ExecutiveDashboardHomeSurface.tsx",
    zoneChildLayout: {
      status: "approved",
      note: "Four DashboardHomeLayoutZone wrappers with layoutVariant=zone-child sections.",
    },
  },
  useExecutiveOS: {
    status: "legacy_bypass",
    note: "Parallel shortcuts documented — not used by Dashboard Home surfaces.",
  },
});
