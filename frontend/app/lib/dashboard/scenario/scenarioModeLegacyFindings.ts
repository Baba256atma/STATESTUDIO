/**
 * MRP:5:1 — Legacy scenario routing findings (documented, not duplicated).
 */

export const SCENARIO_MODE_LEGACY_FINDINGS = Object.freeze({
  dashboardRuntime: {
    path: "frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx",
    behavior: "Mode switch authority; dedicated modes hide legacy host.",
    risk: "None when Scenario uses dedicated shell path.",
    status: "authority_preserved",
  },
  focusAnalyzeCompareRuntime: {
    path: "frontend/app/lib/dashboard/focus|analyze|compare/*ModeContract.ts",
    behavior: "Shared object context input via FocusModeContextInput and resolveFocusObjectId.",
    risk: "None — Scenario reuses same read-only context pattern.",
    status: "shared_context_source",
  },
  rightPanelHost: {
    path: "frontend/app/components/right-panel/RightPanelHost.tsx",
    behavior: "Legacy simulate/compare views opened via requestPanelAuthorityOpen.",
    risk: "Competing destination if Scenario reopens legacy SIM panel or run_scenario.",
    status: "isolated_fallback_only",
  },
  scenarioIntelligence: {
    path: "frontend/app/lib/dashboard/scenarioIntelligence/scenarioIntelligenceContract.ts",
    behavior: "Phase 4 intelligence module — separate from Dashboard Scenario workspace shell.",
    risk: "Future wiring must use SCENARIO_WORKSPACE_MODULES slots, not bypass Dashboard.",
    status: "future_module_host",
  },
  executiveScenarioComparisonEngine: {
    path: "frontend/app/lib/simulation/comparison/executiveScenarioComparisonEngine.ts",
    behavior: "Simulation-layer scenario comparison engine.",
    risk: "Must not execute from workspace shell in MRP:5:1; no background processing.",
    status: "legacy_engine_not_wired",
  },
  scenarioActionClient: {
    path: "frontend/app/lib/simulation/scenarioActionClient.ts",
    behavior: "Scenario action client for simulation execution.",
    risk: "Accidental invocation would violate no-simulation rule for this prompt.",
    status: "not_invoked",
  },
  executiveMultiScenarioUniverse: {
    path: "frontend/app/lib/scene/scenario/executiveMultiScenarioUniverseRuntime.ts",
    behavior: "Scene-layer multi-scenario universe playback.",
    risk: "Separate from Dashboard Scenario mode; must not trigger on workspace mount.",
    status: "decoupled",
  },
  hudZoningBlocker: {
    path: "frontend/app/lib/scene/sceneHudZoneContract.ts",
    behavior: "HUD overlap diagnostics may still report Object Panel ↔ MRP collisions.",
    risk: "MRP-HUD:1 repair pass required before MRP Freeze.",
    status: "known_blocker_documented",
  },
});
