/**
 * MRP:10:5 — Executive Continuity legacy isolation findings.
 */

export const EXECUTIVE_CONTINUITY_LEGACY_ISOLATION = Object.freeze({
  approvedSources: {
    navigationHistory: {
      path: "frontend/app/lib/dashboard/executiveWorkspaceNavigationHistoryRuntime.ts",
      status: "approved",
    },
    workspaceRecents: {
      path: "frontend/app/lib/workspaces/workspaceRecentsRegistry.ts",
      status: "approved",
    },
    workspaceLifecycle: {
      path: "frontend/app/lib/dashboard/executiveWorkspaceLifecycleRuntime.ts",
      status: "read_only_snapshot",
    },
  },
  sceneTimeline: {
    status: "isolated",
    note: "Dashboard Home Timeline ≠ Scene Timeline. Scene operational timeline never consumed.",
  },
  deprecatedActivitySystems: {
    executiveDashboardPanel: {
      status: "legacy_isolated",
      note: "Legacy panel activity — not reconnected.",
    },
    auditTrailFeeds: {
      status: "legacy_isolated",
      note: "Developer audit styling and dense event feeds excluded.",
    },
  },
  routing: {
    reopen: "onRecentReturn → requestExecutiveWorkspaceBackNavigation / requestWorkspaceLaunch",
    continue: "onRecentReturn or onWorkspaceLaunch via previewRecentReturnPath",
    status: "approved",
  },
});

export const EXECUTIVE_CONTINUITY_APPROVED_DESTINATIONS = Object.freeze([
  "analyze",
  "compare",
  "scenario",
  "war_room",
  "focus",
  "overview",
] as const);
