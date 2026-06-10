/**
 * MRP:7:4 — Legacy conversation continuity findings.
 */

export const CONVERSATION_CONTINUITY_LEGACY_FINDINGS = Object.freeze({
  assistantRuntime: {
    path: "frontend/app/components/main-right-panel/MainRightPanelAssistantPlaceholder.tsx",
    behavior: "MRP Assistant tab shell — conversation host.",
    risk: "Must not recreate session on tab switch.",
    status: "session_preserved_via_hook",
  },
  contextSyncLayer: {
    path: "frontend/app/lib/assistant-bridge/assistantContextSyncContract.ts",
    behavior: "Dashboard publishes read-only sync summaries.",
    risk: "Continuity layer must consume copies only.",
    status: "upstream_transport",
  },
  conversationState: {
    path: "frontend/app/components/assistant/ExecutiveAssistantPanel.tsx",
    behavior: "Legacy left-command assistant messages — separate from MRP continuity.",
    risk: "Do not merge message history into sync contract.",
    status: "decoupled",
  },
  dashboardRuntime: {
    path: "frontend/app/lib/dashboard/dashboardModeRuntimeContract.ts",
    behavior: "Dashboard mode authority.",
    risk: "Assistant awareness must never write reducer.",
    status: "authority_preserved",
  },
  workspaceLifecycle: {
    path: "frontend/app/lib/assistant-bridge/assistantContextSyncContract.ts",
    behavior: "completionStatus maps to lifecycle phases.",
    risk: "Lifecycle is observational only in Assistant.",
    status: "read_only_mapping",
  },
  sessionContracts: {
    path: "frontend/app/lib/workspace/nexoraWorkspaceStateContract.ts",
    behavior: "MRP tab + dashboard mode in workspace reducer.",
    risk: "Tab change must not reset conversation sessionId.",
    status: "tab_decoupled_from_session",
  },
});
