/**
 * MRP:4:1 — Legacy comparison routing findings (documented, not duplicated).
 */

export const COMPARE_MODE_LEGACY_FINDINGS = Object.freeze({
  dashboardRuntime: {
    path: "frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx",
    behavior: "Mode switch authority; dedicated modes hide legacy host.",
    risk: "None when Compare uses dedicated shell path.",
    status: "authority_preserved",
  },
  focusRuntime: {
    path: "frontend/app/lib/dashboard/focus/focusModeContract.ts",
    behavior: "Shared object ID resolution via resolveFocusObjectId.",
    risk: "None — Compare reuses same context input contract.",
    status: "shared_context_source",
  },
  analyzeRuntime: {
    path: "frontend/app/lib/dashboard/analyze/analyzeModeContract.ts",
    behavior: "Parallel workspace shell pattern for executive modes.",
    risk: "None — Compare follows same presentation-only model.",
    status: "pattern_reference",
  },
  rightPanelHost: {
    path: "frontend/app/components/right-panel/RightPanelHost.tsx",
    behavior: "Legacy compare view opened via requestPanelAuthorityOpen('compare').",
    risk: "Competing destination if Compare reopens legacy SIM panel.",
    status: "isolated_fallback_only",
  },
  buildComparePanelModel: {
    path: "frontend/app/lib/decision/recommendation/buildComparePanelModel.ts",
    behavior: "Legacy recommendation comparison model builder.",
    risk: "Future Compare modules must not bypass Dashboard workspace.",
    status: "future_integration_candidate",
  },
  compareClient: {
    path: "frontend/app/lib/compare/compareClient.ts",
    behavior: "Standalone compare client/types — not wired to Dashboard Compare mode.",
    risk: "Duplicate comparison authority if wired without workspace contract.",
    status: "legacy_engine_candidate",
  },
  scenarioCompareTypes: {
    path: "frontend/app/lib/scenario/scenarioCompareTypes.ts",
    behavior: "Scenario score comparison types for simulation layer.",
    risk: "Name overlap with Scenario Comparison module slot.",
    status: "future_module_host",
  },
  decisionComparePanel: {
    path: "frontend/app/components/executive/DecisionComparePanel.tsx",
    behavior: "Legacy executive compare UI component.",
    risk: "Visual duplication if mounted alongside Compare workspace.",
    status: "not_mounted_in_mrp",
  },
});
