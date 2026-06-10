/**
 * MRP:8:3 — Legacy transition findings.
 */

export const EXECUTIVE_WORKSPACE_TRANSITION_LEGACY_FINDINGS = Object.freeze({
  directLifecyclePrepare: {
    path: "frontend/app/lib/object-panel/objectPanelActionRouterRuntime.ts",
    behavior: "Pre-MRP:8:3: prepareWorkspaceLifecycleOpen called directly from router.",
    bypass: "Skipped transition controller coordination.",
    migration: "Route through requestExecutiveWorkspaceTransition.",
    status: "adopted",
  },
  directLifecycleCommit: {
    path: "frontend/app/screens/HomeScreen.tsx",
    behavior: "Pre-MRP:8:3: commitWorkspaceLifecycleOpen after setDashboardMode.",
    bypass: "Skipped transition commit validation.",
    migration: "Route through commitExecutiveWorkspaceTransition.",
    status: "adopted",
  },
  lifecycleDuplicateActiveBrake: {
    path: "frontend/app/lib/dashboard/executiveWorkspaceLifecycleRuntime.ts",
    behavior: "Lifecycle logs duplicate active but previously allowed overlap window.",
    gap: "No controller-level concurrent transition guard.",
    migration: "Controller enforces before and after lifecycle transitions.",
    status: "superseded_by_controller",
  },
  assistantBridgeDirectPath: {
    path: "frontend/app/lib/assistant-bridge/assistantDashboardBridgeRuntime.ts",
    behavior: "Bridge routes to object panel — inherits controller when router adopted.",
    bypass: "None when router uses controller.",
    status: "inherited_protection",
  },
  legacySimPanelActivation: {
    path: "frontend/app/screens/HomeScreen.tsx",
    behavior: "SIM/RSK panel opens parallel execution contexts.",
    bypass: "Outside single-active enforcement entirely.",
    migration: "Register workspaces; route through controller.",
    status: "documented_bypass",
  },
});
