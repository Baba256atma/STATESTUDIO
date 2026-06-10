/**
 * MRP:9:5 — Legacy dashboard navigation findings for freeze audit.
 */

export const DASHBOARD_NAVIGATION_LEGACY_FINDINGS = Object.freeze({
  dashboardContextRouter: {
    path: "frontend/app/lib/dashboard/dashboardContextRouter.ts",
    behavior: "setDashboardContext bypasses launcher/recommendations/favorites/recents.",
    conflict: "Parallel mode authority without navigation layer.",
    status: "documented_bypass",
  },
  executiveOsShortcuts: {
    path: "frontend/app/lib/executive/useExecutiveOS.ts",
    behavior: "Direct war room / compare open from recommendations.",
    conflict: "Bypasses dashboard navigation layer.",
    status: "documented_bypass",
  },
  executiveQuickActions: {
    path: "frontend/app/lib/ui/executiveQuickActionsTypes.ts",
    behavior: "Command bar quick actions parallel to favorites/recents.",
    conflict: "Duplicate quick-return surface.",
    status: "documented_parallel",
  },
  simRskPanels: {
    path: "frontend/app/screens/HomeScreen.tsx",
    behavior: "SIM/RSK panel parallel execution contexts.",
    conflict: "Outside navigation layer entirely.",
    status: "documented_bypass",
  },
  assistantBridgeHardcodedMaps: {
    path: "frontend/app/lib/assistant-bridge/assistantDashboardBridgeContract.ts",
    behavior: "Hardcoded action maps vs full registry adoption.",
    conflict: "Pending registry integration.",
    status: "pending_adoption",
  },
  leftCommandAssistantChat: {
    path: "frontend/app/components/assistant/",
    behavior: "Chat/SIM paths bypass MRP navigation layer.",
    conflict: "Pre-MRP:7 parallel path.",
    status: "documented_bypass",
  },
  enterpriseRecommendationEngines: {
    path: "frontend/app/lib/recommendation/",
    behavior: "Strategic AI recommendation engines.",
    conflict: "Different domain from workspace navigation recommendations.",
    status: "decoupled",
  },
  legacyWorkspaceFreezeFindings: {
    path: "frontend/app/lib/dashboard/executiveWorkspaceRegistryLegacyFindings.ts",
    behavior: "MRP:8 legacy workspace findings.",
    conflict: "Documented; navigation layer inherits protections.",
    status: "inherited_documentation",
  },
});

export const DASHBOARD_NAVIGATION_FREEZE_ADOPTION_PLAN = Object.freeze([
  "Phase 1 (MRP:9:5): Navigation layer freeze certification — complete",
  "Phase 2: dashboardContextRouter adopts requestWorkspaceLaunch",
  "Phase 3: Executive OS routes through navigation layer",
  "Phase 4: Timeline actions integrate with recents return paths",
  "Phase 5: Assistant read-only sync of navigation summary fields",
]);
