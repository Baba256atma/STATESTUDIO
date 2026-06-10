/**
 * MRP:10:6 — Executive Recovery legacy isolation findings.
 */

export const EXECUTIVE_RECOVERY_LEGACY_ISOLATION = Object.freeze({
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
  separation: {
    activityTimeline: {
      status: "isolated",
      note: "Recovery = resumable contexts. Timeline = historical events. Not merged.",
    },
    favorites: {
      status: "isolated",
      note: "Recovery ≠ Favorites. Favorites are user-prioritized pins.",
    },
    recommendations: {
      status: "isolated",
      note: "Recovery entries are not system recommendations.",
    },
  },
  deprecatedSystems: {
    executiveOsShortcuts: {
      status: "legacy_isolated",
      note: "Parallel bypass — recovery uses canonical return/launch chain only.",
    },
    legacySessionStores: {
      status: "not_created",
      note: "No new session stores introduced.",
    },
  },
  routing: {
    resume: "onRecoveryResume → onRecentReturn / onWorkspaceLaunch via previewRecentReturnPath",
    status: "approved",
  },
});

export const EXECUTIVE_RECOVERY_APPROVED_DESTINATIONS = Object.freeze([
  "analyze",
  "compare",
  "scenario",
  "war_room",
  "focus",
] as const);
