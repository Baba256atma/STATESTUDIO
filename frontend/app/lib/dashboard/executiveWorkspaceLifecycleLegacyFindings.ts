/**
 * MRP:8:2 — Legacy lifecycle findings.
 */

export const EXECUTIVE_WORKSPACE_LIFECYCLE_LEGACY_FINDINGS = Object.freeze({
  contextSyncCompletionStatus: {
    path: "frontend/app/lib/assistant-bridge/assistantContextSyncContract.ts",
    behavior: "WorkspaceCompletionStatus (opened/active/returned_passive/completed) — parallel lifecycle signal.",
    gap: "Not formal lifecycle states; mapped to paused via passive return.",
    migration: "Extend sync summary with lifecycleState read-only fields from lifecycle manager.",
    status: "partial_integration",
  },
  dashboardModeOnly: {
    path: "frontend/app/lib/workspace/nexoraWorkspaceStateContract.ts",
    behavior: "setDashboardMode commits mode without lifecycle validation before MRP:8:2.",
    gap: "Direct mode transitions without lifecycle tracking.",
    migration: "applyObjectPanelRouteRef validates lifecycle before dispatch.",
    status: "adopted_in_router",
  },
  hiddenSimPanelState: {
    path: "frontend/app/screens/HomeScreen.tsx",
    behavior: "SIM/RSK panel authority opens parallel workspace-like views.",
    gap: "Outside lifecycle manager entirely.",
    migration: "Register and route through lifecycle when migrated to dashboard workspaces.",
    status: "documented_bypass",
  },
  registryAvailability: {
    path: "frontend/app/lib/dashboard/executiveWorkspaceRegistryContract.ts",
    behavior: "Catalog availability (available/future/deprecated) seeds initial lifecycle state.",
    gap: "Registry availability ≠ runtime lifecycle state after transitions.",
    migration: "Registry seeds once; lifecycle manager owns subsequent transitions.",
    status: "decoupled_correctly",
  },
  conversationContinuity: {
    path: "frontend/app/lib/assistant-bridge/conversationContinuityContract.ts",
    behavior: "Maps completionStatus to lifecyclePhase (open/active/exit/complete).",
    gap: "Observational subset — not authoritative lifecycle.",
    migration: "Consume lifecycle snapshot from sync; never write lifecycle state.",
    status: "read_only_observer",
  },
});
