/**
 * MRP:8:4 — Legacy navigation history findings.
 */

export const EXECUTIVE_WORKSPACE_NAVIGATION_LEGACY_FINDINGS = Object.freeze({
  contextSyncLastWorkspace: {
    path: "frontend/app/lib/assistant-bridge/assistantContextSyncContract.ts",
    behavior: "lastWorkspaceType in sync summary — partial path signal only.",
    gap: "No formal back stack or ordered navigation path.",
    migration: "Extend sync with navigationRecentPath read-only fields.",
    status: "partial_integration",
  },
  transitionControllerOnly: {
    path: "frontend/app/lib/dashboard/executiveWorkspaceTransitionControllerRuntime.ts",
    behavior: "Tracks transitionSourceId during request — not persisted as history.",
    gap: "No durable navigation sequence before MRP:8:4.",
    migration: "Record history on commit via navigation history runtime.",
    status: "adopted",
  },
  dashboardModeDirectSwitch: {
    path: "frontend/app/lib/workspace/nexoraWorkspaceStateContract.ts",
    behavior: "setDashboardMode changes mode without history record if bypassed.",
    gap: "Direct reducer commits outside transition path lack history.",
    migration: "All workspace opens must flow through transition controller + history record.",
    status: "guarded_by_router",
  },
  legacyContextRouter: {
    path: "frontend/app/lib/dashboard/dashboardContextRouter.ts",
    behavior: "Legacy setDashboardContext navigation without history.",
    gap: "Bypasses back stack entirely.",
    migration: "Route through transition controller when migrated.",
    status: "documented_bypass",
  },
  conversationContinuityPath: {
    path: "frontend/app/lib/assistant-bridge/conversationContinuityContract.ts",
    behavior: "Awareness of last workspace — observational subset of history.",
    gap: "Not ordered path; must consume navigation summary read-only.",
    status: "read_only_observer",
  },
});
