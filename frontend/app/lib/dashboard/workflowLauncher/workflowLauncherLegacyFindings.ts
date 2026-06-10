/**
 * MRP:10:3 — Workflow Launcher legacy route isolation findings.
 */

export const WORKFLOW_LAUNCHER_LEGACY_ISOLATION = Object.freeze({
  approvedRoutingPath: {
    workspaceActions: "onWorkspaceLaunch → requestWorkspaceLaunch → executeApprovedWorkspaceLaunch → setDashboardMode",
    returnAction: "onRecentReturn → requestExecutiveWorkspaceBackNavigation / requestWorkspaceLaunch",
    focusAction: "scrollIntoView on recommendations section — no routing",
    status: "approved",
  },
  dashboardContextRouter: {
    path: "frontend/app/lib/dashboard/dashboardContextRouter.ts",
    status: "not_used_by_workflow_launcher",
    note: "Workflow launcher never calls setDashboardContext.",
  },
  rightPanelRouter: {
    path: "frontend/app/lib/ui/right-panel/rightPanelRouter.ts",
    status: "not_used_by_workflow_launcher",
    note: "No direct right-panel view mutations from launcher.",
  },
  executiveOsShortcuts: {
    path: "frontend/app/lib/executive/useExecutiveOS.ts",
    status: "legacy_bypass",
    note: "Parallel path — workflow launcher uses canonical dashboard chain only.",
  },
  legacyCanonicalRoutes: {
    status: "isolated",
    note: "Launcher targets registry workspace IDs mapped to dashboard modes only.",
  },
});

export const WORKFLOW_LAUNCHER_APPROVED_DESTINATIONS = Object.freeze([
  "analyze",
  "compare",
  "scenario",
  "war_room",
  "dashboard_home_recommendations_section",
] as const);
