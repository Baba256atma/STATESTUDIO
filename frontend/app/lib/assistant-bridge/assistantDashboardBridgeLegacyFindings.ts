/**
 * MRP:7:1 — Legacy assistant / routing findings (documented, not duplicated).
 */

export const ASSISTANT_DASHBOARD_BRIDGE_LEGACY_FINDINGS = Object.freeze({
  dashboardRuntime: {
    path: "frontend/app/components/main-right-panel/DashboardRuntimePanel.tsx",
    behavior: "Sole authority for executive workspace modes and rendering.",
    risk: "None — bridge routes to setDashboardMode only.",
    status: "authority_preserved",
  },
  assistantPlaceholder: {
    path: "frontend/app/components/main-right-panel/MainRightPanelAssistantPlaceholder.tsx",
    behavior: "Isolated Assistant tab UI; no direct dashboard dispatch.",
    risk: "None — must call emitAssistantExecutiveActionRequest only.",
    status: "advisor_surface",
  },
  objectPanelActionRouter: {
    path: "frontend/app/lib/object-panel/objectPanelActionRouterRuntime.ts",
    behavior: "Shared dashboard mode execution path for Object Panel actions.",
    risk: "None — Assistant bridge reuses same consumer dispatch.",
    status: "shared_execution_path",
  },
  rightPanelHost: {
    path: "frontend/app/components/right-panel/RightPanelHost.tsx",
    behavior: "Legacy panel opens for chat-driven analyze and advice flows.",
    risk: "Assistant chat paths must not bypass bridge for workspace actions.",
    status: "isolated_fallback",
  },
  nexoraRequestObjectAnalyze: {
    path: "frontend/app/screens/HomeScreen.tsx",
    behavior: "nexora:request-object-analyze triggers sendText chat — separate from Dashboard Analyze route.",
    risk: "Dual analyze paths; bridge OPEN_ANALYZE is canonical for workspace handoff.",
    status: "decoupled_chat_path",
  },
  leftCommandAssistant: {
    path: "frontend/app/components/assistant/LeftCommandAssistant.tsx",
    behavior: "Legacy left command assistant with simulate/compare dispatch.",
    risk: "Must not bypass bridge when suggesting dashboard workspace actions.",
    status: "legacy_parallel_surface",
  },
  executiveAssistantPanel: {
    path: "frontend/app/components/assistant/ExecutiveAssistantPanel.tsx",
    behavior: "Separate executive assistant panel with enrichment merge.",
    risk: "Future integration must use bridge contract, not direct panel opens.",
    status: "future_integration_candidate",
  },
  decisionAssistant: {
    path: "frontend/app/lib/decision/decisionAssistant (runDecisionAssistant)",
    behavior: "Decision assistant output merges panel enrichment — not workspace routing.",
    risk: "Recommendation output must not auto-execute dashboard actions without bridge.",
    status: "enrichment_only",
  },
});
