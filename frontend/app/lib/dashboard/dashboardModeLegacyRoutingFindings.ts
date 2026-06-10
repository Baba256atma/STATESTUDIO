/**
 * MRP:1:2 — Legacy routing inventory (documented, not reused blindly).
 */

export const LEGACY_DASHBOARD_ROUTING_FINDINGS = Object.freeze({
  rightPanelRouter: {
    path: "frontend/app/lib/ui/right-panel/rightPanelRouter.ts",
    status: "legacy_compatibility",
    note: "Canonical right-panel views map to shell sections; MRP runtime redirects to dashboard.",
  },
  rightPanelHost: {
    path: "frontend/app/components/right-panel/RightPanelHost.tsx",
    status: "legacy_compatibility",
    note: "Renders dashboard runtime behind MainRightPanelShell legacyDashboardHost slot.",
  },
  dashboardContextRouter: {
    path: "frontend/app/lib/dashboard/dashboardContextRouter.ts",
    status: "legacy_bridge",
    note: "Commits setDashboardContext; reducer syncs dashboardMode via dashboardModeLegacyBridge.",
  },
  dashboardContextBridge: {
    path: "frontend/app/lib/dashboard/dashboardContextBridge.ts",
    status: "legacy_bridge",
    note: "Object/left-nav commits flow through router; future sources should use setDashboardMode.",
  },
  executiveNavigationBridge: {
    path: null,
    status: "not_found",
    note: "No file named executiveNavigationBridge.ts in repository.",
  },
  executivePlaneNavigationResolver: {
    path: null,
    status: "not_found",
    note: "No file named executivePlaneNavigationResolver.ts in repository.",
  },
});

export const FUTURE_DASHBOARD_ROUTE_SOURCES = Object.freeze([
  "object_panel",
  "scene_panel",
  "timeline",
  "assistant",
  "executive_command_dock",
] as const);
