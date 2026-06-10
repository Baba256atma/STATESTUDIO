/**
 * MRP:9:4 — Legacy recents/history findings.
 */

export const WORKSPACE_RECENTS_LEGACY_FINDINGS = Object.freeze({
  navigationHistoryRuntime: {
    path: "frontend/app/lib/dashboard/executiveWorkspaceNavigationHistoryRuntime.ts",
    behavior: "Authoritative navigation history and back stack (MRP:8:4).",
    conflict: "None — recents registry reads history read-only.",
    status: "authoritative_source",
  },
  assistantContextSyncPath: {
    path: "frontend/app/lib/assistant-bridge/assistantContextSyncContract.ts",
    behavior: "navigationRecentPath partial path signal.",
    conflict: "Recents surface provides richer activity projection for dashboard.",
    status: "complementary",
  },
  executiveQuickActions: {
    path: "frontend/app/lib/ui/executiveQuickActionsTypes.ts",
    behavior: "Legacy quick return actions in command bar.",
    conflict: "Parallel quick-return outside recents surface.",
    status: "documented_parallel",
  },
  executiveOsReview: {
    path: "frontend/app/lib/executive/useExecutiveOS.ts",
    behavior: "reviewRecord / openWarRoom shortcuts.",
    conflict: "Bypasses recents and controlled return paths.",
    status: "documented_bypass",
  },
});
