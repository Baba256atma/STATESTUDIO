/**
 * MRP:8:1 — Legacy workspace routing findings for registry adoption.
 */

export const EXECUTIVE_WORKSPACE_REGISTRY_LEGACY_FINDINGS = Object.freeze({
  objectPanelRouter: {
    path: "frontend/app/lib/object-panel/objectPanelActionRouterRuntime.ts",
    behavior: "Hardcoded OBJECT_PANEL_ACTION_TO_MODE map (5 entries).",
    duplicate: "Registry objectPanelAction → dashboardMode",
    migration: "Resolve mode via discoverExecutiveWorkspace({ by: objectPanelAction }).",
    status: "pending_adoption",
  },
  assistantBridge: {
    path: "frontend/app/lib/assistant-bridge/assistantDashboardBridgeContract.ts",
    behavior: "Hardcoded ASSISTANT_ACTION_TO_MODE + ASSISTANT_ACTION_TO_OBJECT_PANEL maps.",
    duplicate: "Registry assistantAction → dashboardMode + objectPanelAction",
    migration: "Resolve via registry; keep bridge validation layer.",
    status: "pending_adoption",
  },
  dashboardModeContract: {
    path: "frontend/app/lib/dashboard/dashboardModeRuntimeContract.ts",
    behavior: "DASHBOARD_MODES array + dashboardModeLabel switch.",
    duplicate: "Registry name/label metadata",
    migration: "Derive DASHBOARD_MODES from registry available entries; labels from registry name.",
    status: "documented_parallel",
  },
  dashboardRuntimePanel: {
    path: "frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx",
    behavior: "Hardcoded isFocusMode/isAnalyzeMode/.../isDedicatedMode conditionals.",
    duplicate: "Registry shellComponent + isDedicatedExecutiveWorkspaceMode",
    migration: "Use registry for dedicated mode detection; shell map remains until dynamic render.",
    status: "partial_adoption",
  },
  dashboardSurfaceRegistry: {
    path: "frontend/app/lib/dashboard/dashboardSurfaceRegistry.ts",
    behavior: "Intelligence surface catalog (operational, risk, scenario, etc.).",
    duplicate: "Different domain — intelligence surfaces vs executive workspaces",
    migration: "Keep separate; cross-reference via futureCapabilityFlags when surfaces align.",
    status: "decoupled",
  },
  legacyDashboardContextRouter: {
    path: "frontend/app/lib/dashboard/dashboardContextRouter.ts",
    behavior: "setDashboardContext commits without route object.",
    duplicate: "Parallel mode authority without registry validation",
    migration: "Route through registry validateExecutiveWorkspaceOpenRequest before commit.",
    status: "pending_adoption",
  },
  simPanelBypass: {
    path: "frontend/app/screens/HomeScreen.tsx",
    behavior: "Legacy SIM/RSK panel opens for non-dashboard executive actions.",
    duplicate: "Bypasses registry entirely",
    migration: "Register future workspaces; route through dashboard authority.",
    status: "documented_bypass",
  },
});

export const EXECUTIVE_WORKSPACE_REGISTRY_ADOPTION_PLAN = Object.freeze([
  "Phase 1 (MRP:8:1): Registry contract + catalog + validation — complete",
  "Phase 2: Object panel router resolves modes from registry",
  "Phase 3: Assistant bridge resolves actions from registry",
  "Phase 4: DashboardRuntimePanel dedicated mode detection from registry",
  "Phase 5: Legacy dashboardContextRouter adopts registry validation",
  "Phase 6: Future workspace UI shells register in catalog only",
]);
