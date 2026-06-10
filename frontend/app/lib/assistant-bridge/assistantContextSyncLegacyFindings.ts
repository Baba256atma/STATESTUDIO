/**
 * MRP:7:3 — Legacy context sync findings.
 */

export const ASSISTANT_CONTEXT_SYNC_LEGACY_FINDINGS = Object.freeze({
  dashboardRuntime: {
    path: "frontend/app/lib/dashboard/dashboardModeRuntimeContract.ts",
    behavior: "Canonical dashboard mode authority.",
    risk: "None — publisher reads workspace state only.",
    status: "authority_preserved",
  },
  assistantBridge: {
    path: "frontend/app/lib/assistant-bridge/assistantDashboardBridgeContract.ts",
    behavior: "Assistant → Dashboard action transport.",
    risk: "Sync must publish after bridge execution, not during emit.",
    status: "downstream_publisher",
  },
  assistantActionCards: {
    path: "frontend/app/lib/assistant-bridge/assistantActionCardContract.ts",
    behavior: "Card launch surfaces — read-only action card context.",
    risk: "Card context is subset of sync summary; do not duplicate as authority.",
    status: "read_only_subset",
  },
  nexoraWorkspaceState: {
    path: "frontend/app/lib/workspace/nexoraWorkspaceStateContract.ts",
    behavior: "dashboardMode, dashboardRouteObjectId, activeMRPTab.",
    risk: "Assistant must never write workspace reducer.",
    status: "dashboard_authority",
  },
  sessionState: {
    path: "frontend/app/lib/scene/warroom/executiveWarRoomStore.ts",
    behavior: "Scene-layer session store — separate from MRP context sync.",
    risk: "Must not merge into assistant sync without explicit future contract.",
    status: "decoupled",
  },
});
