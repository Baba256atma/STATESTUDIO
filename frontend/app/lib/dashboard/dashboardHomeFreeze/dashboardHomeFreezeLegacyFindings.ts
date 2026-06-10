/**
 * MRP:10:10 — Dashboard Home freeze legacy deprecation registry.
 */

export const DASHBOARD_HOME_FREEZE_DEPRECATED = Object.freeze({
  legacyRightRailDashboards: Object.freeze([
    {
      path: "frontend/app/components/panels/ExecutiveDashboardPanel.tsx",
      status: "deprecated",
      note: "Legacy right-rail dashboard — not Dashboard Home authority.",
    },
    {
      path: "frontend/app/components/right-panel/RightPanelHost.tsx",
      status: "deprecated_for_home",
      note: "Legacy route host — MRP uses MainRightPanelShell.",
    },
  ]),
  obsoleteDashboardShells: Object.freeze([
    {
      path: "frontend/app/components/dashboard/ExecutiveRecentWorkflowSurface.tsx",
      status: "removed_from_home",
      note: "Overlapped continuity zone — not in frozen hierarchy.",
    },
  ]),
  historicalRoutingPaths: Object.freeze([
    {
      id: "useExecutiveOS_shortcuts",
      status: "legacy_bypass",
      note: "Parallel shortcuts — must not become Dashboard Home authority.",
    },
    {
      id: "legacy_mrp_tab_routes",
      status: "compatibility_input_only",
      note: "Legacy panel routes normalize to dashboard context — not home mount.",
    },
  ]),
  unusedContainers: Object.freeze([
    {
      path: "frontend/app/components/dashboard/surfaces/",
      status: "phase_3_6_accordion_surfaces",
      note: "Intelligence accordion surfaces — separate mount path, not Dashboard Home.",
    },
  ]),
  reusePolicy:
    "Reuse of deprecated Dashboard Home paths requires explicit architecture migration review.",
});
