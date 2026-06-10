/**
 * MRP:7:2 — Legacy assistant action card findings.
 */

export const ASSISTANT_ACTION_CARD_LEGACY_FINDINGS = Object.freeze({
  assistantPlaceholder: {
    path: "frontend/app/components/main-right-panel/MainRightPanelAssistantPlaceholder.tsx",
    behavior: "Assistant tab shell — action cards added additively in MRP:7:2.",
    risk: "None if cards only call launchAssistantActionCard.",
    status: "additive_integration",
  },
  bridgeContract: {
    path: "frontend/app/lib/assistant-bridge/assistantDashboardBridgeContract.ts",
    behavior: "Single emit path for assistant executive actions.",
    risk: "None — cards must not bypass bridge.",
    status: "canonical_transport",
  },
  chatBubbleRenderer: {
    path: "frontend/app/screens/HomeScreen.tsx (chat pipeline)",
    behavior: "Separate chat message rendering — not used for action cards.",
    risk: "Future chat-suggested cards must reuse same card contract.",
    status: "parallel_surface",
  },
  leftCommandAssistant: {
    path: "frontend/app/components/assistant/LeftCommandAssistant.tsx",
    behavior: "Legacy command assistant with direct simulate/compare actions.",
    risk: "Competing launch surface if not migrated to cards + bridge.",
    status: "legacy_parallel",
  },
  executiveAssistantPanel: {
    path: "frontend/app/components/assistant/ExecutiveAssistantPanel.tsx",
    behavior: "Enrichment-oriented assistant panel.",
    risk: "Must not open dashboard workspaces directly.",
    status: "future_card_host_candidate",
  },
});
