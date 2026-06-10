/**
 * MRP:9:1 — Legacy workspace launch entry point findings.
 */

export const WORKSPACE_LAUNCHER_LEGACY_FINDINGS = Object.freeze({
  objectPanelDirectRoute: {
    path: "frontend/app/lib/object-panel/objectPanelActionRouterRuntime.ts",
    behavior: "Pre-MRP:9:1: inline transition request inside router.",
    bypass: "Parallel launch path outside requestWorkspaceLaunch.",
    migration: "Route through requestWorkspaceLaunch.",
    status: "adopted",
  },
  assistantBridgeObjectPanelChain: {
    path: "frontend/app/lib/assistant-bridge/assistantDashboardBridgeRuntime.ts",
    behavior: "Assistant validates then HomeScreen calls object panel route.",
    bypass: "Indirect — inherits requestWorkspaceLaunch via object panel.",
    migration: "Optional direct requestWorkspaceLaunch with source assistant_bridge.",
    status: "inherited_protection",
  },
  homeScreenDirectDispatch: {
    path: "frontend/app/screens/HomeScreen.tsx",
    behavior: "setDashboardMode dispatch after route validation.",
    bypass: "None when launch flows through requestWorkspaceLaunch + commit.",
    migration: "Consolidate via applyWorkspaceLaunchRef.",
    status: "adopted",
  },
  legacySimPanel: {
    path: "frontend/app/screens/HomeScreen.tsx",
    behavior: "SIM/RSK panel opens parallel execution contexts.",
    bypass: "Outside launcher and transition controller.",
    migration: "Register simulation workspace; route through launcher.",
    status: "documented_bypass",
  },
  dashboardContextRouter: {
    path: "frontend/app/lib/dashboard/dashboardContextRouter.ts",
    behavior: "setDashboardContext without launcher or transition.",
    bypass: "Direct mode authority.",
    migration: "Route through requestWorkspaceLaunch when migrated.",
    status: "documented_bypass",
  },
  timelineInteractions: {
    path: "frontend/app/components/right-panel/RightPanelHost.tsx",
    behavior: "Timeline panel actions may open legacy views.",
    bypass: "Not yet wired to workspace launcher.",
    migration: "Emit requestWorkspaceLaunch with source timeline.",
    status: "pending_adoption",
  },
  executiveOsWarRoom: {
    path: "frontend/app/lib/executive/useExecutiveOS.ts",
    behavior: "Legacy war room open via warRoom controller.",
    bypass: "Outside dashboard workspace launcher.",
    migration: "Route executive recommendations through launcher.",
    status: "documented_bypass",
  },
  hardcodedDashboardModes: {
    path: "frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx",
    behavior: "Mode conditionals for dedicated shells.",
    duplicate: "Registry shellComponent metadata.",
    migration: "Registry-driven shell resolution (future).",
    status: "documented_parallel",
  },
});

export const WORKSPACE_LAUNCHER_CONSOLIDATION_PLAN = Object.freeze([
  "Phase 1 (MRP:9:1): requestWorkspaceLaunch + DashboardWorkspaceLauncher — complete",
  "Phase 2: Timeline actions route through launcher",
  "Phase 3: Legacy SIM/RSK panel migrate to registered workspaces",
  "Phase 4: dashboardContextRouter adopts launcher",
  "Phase 5: Executive OS recommendations route through launcher",
]);
