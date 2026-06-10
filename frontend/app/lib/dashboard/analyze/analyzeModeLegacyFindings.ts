/**
 * MRP:3:1 — Legacy analysis routing findings (documented, not duplicated).
 */

export const ANALYZE_MODE_LEGACY_FINDINGS = Object.freeze({
  dashboardRuntime: {
    path: "frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx",
    behavior: "Mode switch authority; Focus and Analyze surfaces render by dashboardMode.",
    risk: "None when legacy host hidden in Analyze mode.",
    status: "authority_preserved",
  },
  focusRuntime: {
    path: "frontend/app/lib/dashboard/focus/focusModeContract.ts",
    behavior: "Shared object ID resolution via resolveFocusObjectId.",
    risk: "None — Analyze reuses same context input contract.",
    status: "shared_context_source",
  },
  executiveObjectPanelData: {
    path: "frontend/app/lib/panels/executiveObjectPanelData.ts",
    behavior: "Read-only builder for object context from scene/response/risk/recommendation.",
    risk: "None — reused via dashboardFocusObjectData memo in HomeScreen.",
    status: "canonical_builder_reused",
  },
  rightPanelHost: {
    path: "frontend/app/components/right-panel/RightPanelHost.tsx",
    behavior: "Legacy risk_flow, advice, object views opened by old executive-object-action paths.",
    risk: "Competing destination if Analyze reopens legacy SIM/RSK panels.",
    status: "isolated_fallback_only",
  },
  riskIntelligenceRuntime: {
    path: "frontend/app/lib/dashboard/riskIntelligence/riskIntelligenceRuntime.ts",
    behavior: "Phase 4 intelligence module — not wired to Analyze workspace shell yet.",
    risk: "Future integration must slot into ANALYZE_WORKSPACE_MODULES, not bypass Dashboard.",
    status: "future_module_host",
  },
  scenarioIntelligence: {
    path: "frontend/app/lib/dashboard/scenarioIntelligence/scenarioIntelligenceContract.ts",
    behavior: "Scenario intelligence contract exists separately from Dashboard Analyze mode.",
    risk: "Name overlap with Scenario Analysis module slot.",
    status: "future_module_host",
  },
  homeScreenAnalyzeListener: {
    path: "frontend/app/screens/HomeScreen.tsx",
    behavior: "nexora:request-object-analyze still triggers chat sendText — separate from Dashboard Analyze route.",
    risk: "Dual analyze paths; Dashboard route is canonical for Object Panel [Analyze].",
    status: "decoupled_chat_path",
  },
});
