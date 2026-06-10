/**
 * MRP:9:3 — Legacy favorites/shortcuts findings.
 */

export const WORKSPACE_FAVORITES_LEGACY_FINDINGS = Object.freeze({
  executiveQuickActions: {
    path: "frontend/app/lib/ui/executiveQuickActionsTypes.ts",
    behavior: "Legacy executive quick action model in command bar.",
    conflict: "Parallel quick action surface outside dashboard favorites.",
    migration: "Map recurring actions to pinned favorites where appropriate.",
    status: "documented_parallel",
  },
  executiveCommandBar: {
    path: "frontend/app/lib/ui/buildExecutiveCommandBarModel.ts",
    behavior: "Command bar action shortcuts.",
    conflict: "Scene-level shortcuts bypass workspace favorites registry.",
    status: "documented_parallel",
  },
  workspaceLauncher: {
    path: "frontend/app/lib/dashboard/workspaceLauncher/",
    behavior: "Full workspace catalog launcher (MRP:9:1).",
    conflict: "None — complementary; launcher lists all, favorites pin subset.",
    status: "complementary",
  },
  workspaceRecommendations: {
    path: "frontend/app/lib/workspaces/workspaceRecommendationEngine.ts",
    behavior: "Dynamic context-aware recommendations (MRP:9:2).",
    conflict: "None — recommendations are dynamic; favorites are executive-owned.",
    status: "complementary",
  },
  executiveOsShortcuts: {
    path: "frontend/app/lib/executive/useExecutiveOS.ts",
    behavior: "Direct war room / compare shortcuts from recommendations.",
    conflict: "Bypasses favorites registry and launcher authority chain.",
    status: "documented_bypass",
  },
  assistantActionCards: {
    path: "frontend/app/lib/assistant-bridge/assistantActionCardContract.ts",
    behavior: "Assistant-initiated workspace launch cards.",
    conflict: "Assistant may reference favorites read-only; cannot mutate.",
    status: "read_only_compatible",
  },
});
