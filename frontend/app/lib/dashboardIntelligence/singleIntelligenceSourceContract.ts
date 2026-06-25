/**
 * INT-1.1 — Single Intelligence Source Contract.
 * Permanent platform contract: one gateway for all presentation intelligence.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type {
  DashboardIntelligenceMode,
  DashboardIntelligencePanelId,
  DashboardIntelligenceRefreshTrigger,
  DashboardIntelligenceResponse,
} from "./dashboardIntelligenceContract.ts";

export const SINGLE_INTELLIGENCE_SOURCE_VERSION = "INT-1.1" as const;

export const SINGLE_INTELLIGENCE_SOURCE_TAGS = Object.freeze([
  "[INT11_SINGLE_SOURCE]",
  "[INTELLIGENCE_GATEWAY]",
  "[CONSUMER_REGISTRY]",
  "[RUNTIME_ACCESS_POLICY]",
  "[NO_DIRECT_DS_ACCESS]",
  "[PLATFORM_ARCHITECTURE_LOCK]",
  "[INT11_COMPLETE]",
] as const);

export const NEXORA_SINGLE_INTELLIGENCE_SOURCE_LOG_PREFIX =
  "[NexoraSingleIntelligenceSource]" as const;

export const SINGLE_INTELLIGENCE_GATEWAY_SOURCE = "int-1-1-single-intelligence-gateway" as const;

export type IntelligenceConsumerId =
  | "dashboard"
  | "assistant"
  | "object_panel"
  | "executive_summary"
  | "reports"
  | "war_room"
  | "timeline"
  | "executive_cards"
  | "decision_center"
  | "future_ai_panels";

export type IntelligenceConsumerLifecycle = "active" | "prepared" | "reserved";

export const ACTIVE_INTELLIGENCE_CONSUMER_IDS = Object.freeze([
  "dashboard",
  "assistant",
  "object_panel",
  "executive_summary",
] as const satisfies readonly IntelligenceConsumerId[]);

export const RESERVED_INTELLIGENCE_CONSUMER_IDS = Object.freeze([
  "reports",
  "war_room",
  "timeline",
  "executive_cards",
  "decision_center",
  "future_ai_panels",
] as const satisfies readonly IntelligenceConsumerId[]);

export type IntelligenceConsumerRegistration = Readonly<{
  contractVersion: typeof SINGLE_INTELLIGENCE_SOURCE_VERSION;
  consumerId: IntelligenceConsumerId;
  title: string;
  description: string;
  lifecycle: IntelligenceConsumerLifecycle;
  allowedModes: readonly DashboardIntelligenceMode[];
  allowedPanels: readonly DashboardIntelligencePanelId[];
  registeredAt: string;
  source: typeof SINGLE_INTELLIGENCE_GATEWAY_SOURCE;
}>;

export type IntelligenceGatewayContext = Readonly<{
  selectionLabel: string | null;
  contextLabel: string | null;
  metadata: Readonly<Record<string, string | null>>;
}>;

export type IntelligenceGatewayRequest = Readonly<{
  requestId: string;
  consumer: IntelligenceConsumerId;
  workspaceId: WorkspaceId | null;
  panel: DashboardIntelligencePanelId;
  mode: DashboardIntelligenceMode;
  context: IntelligenceGatewayContext;
  selection: Readonly<{
    objectId: string | null;
    scenarioId: string | null;
    relationshipId: string | null;
    dataSourceId: string | null;
  }>;
  timestamp: string;
  bypassCache?: boolean;
  refreshTrigger?: DashboardIntelligenceRefreshTrigger | null;
}>;

export type IntelligenceGatewayResponse = Readonly<{
  contractVersion: typeof SINGLE_INTELLIGENCE_SOURCE_VERSION;
  requestId: string;
  consumer: IntelligenceConsumerId;
  gatewaySource: typeof SINGLE_INTELLIGENCE_GATEWAY_SOURCE;
  runtimeResponse: DashboardIntelligenceResponse;
  generatedAt: string;
  tags: typeof SINGLE_INTELLIGENCE_SOURCE_TAGS;
}>;

export type IntelligenceConsumerDiagnostics = Readonly<{
  requestId: string;
  consumer: IntelligenceConsumerId;
  requestedMode: DashboardIntelligenceMode;
  requestedPanel: DashboardIntelligencePanelId;
  runtimeSelected: string | null;
  normalizationCompleted: boolean;
  executionTimeMs: number;
  refreshTrigger: DashboardIntelligenceRefreshTrigger | null;
  errorCode: string | null;
  rejectedDirectAccess: boolean;
  generatedAt: string;
}>;

export type IntelligenceGatewayRejection = Readonly<{
  success: false;
  requestId: string;
  consumer: IntelligenceConsumerId | null;
  reason:
    | "unregistered_consumer"
    | "consumer_not_prepared"
    | "mode_not_allowed"
    | "panel_not_allowed"
    | "direct_access_forbidden";
  message: string;
  generatedAt: string;
}>;

export type IntelligenceGatewayResult =
  | IntelligenceGatewayResponse
  | IntelligenceGatewayRejection;

export const INTELLIGENCE_CONSUMER_TITLES: Readonly<Record<IntelligenceConsumerId, string>> =
  Object.freeze({
    dashboard: "Dashboard",
    assistant: "Assistant",
    object_panel: "Object Panel",
    executive_summary: "Executive Summary",
    reports: "Reports",
    war_room: "War Room",
    timeline: "Timeline",
    executive_cards: "Executive Cards",
    decision_center: "Decision Center",
    future_ai_panels: "Future AI Panels",
  });
