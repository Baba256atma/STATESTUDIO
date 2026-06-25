/**
 * INT-2 — Assistant Intelligence Contract.
 * First Executive consumer of the Intelligence Platform — orchestration only.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type {
  DashboardIntelligencePanelId,
  DashboardIntelligenceNormalizedPayload,
} from "../dashboardIntelligence/dashboardIntelligenceContract.ts";
import type { BuildExecutiveTimeContextInput, ExecutiveTimeContext } from "../dashboardIntelligence/executiveTimeContextContract.ts";
import type { UnifiedIntelligenceContext } from "../dashboardIntelligence/intelligenceContextContract.ts";
import type { IntelligenceConsumerId } from "../dashboardIntelligence/singleIntelligenceSourceContract.ts";

export const ASSISTANT_INTELLIGENCE_VERSION = "INT-2" as const;

export const ASSISTANT_INTELLIGENCE_TAGS = Object.freeze([
  "[INT2_ASSISTANT]",
  "[ASSISTANT_RUNTIME]",
  "[ASSISTANT_ADAPTER]",
  "[ASSISTANT_CONTEXT]",
  "[ASSISTANT_RESPONSE]",
  "[NO_DIRECT_DS_ACCESS]",
  "[INT2_COMPLETE]",
] as const);

export const NEXORA_ASSISTANT_INTELLIGENCE_LOG_PREFIX = "[NexoraAssistantIntelligence]" as const;

export const ASSISTANT_INTELLIGENCE_SOURCE = "int-2-assistant-intelligence" as const;

export const ASSISTANT_INTELLIGENCE_CONSUMER = "assistant" as const satisfies IntelligenceConsumerId;

export type AssistantExecutiveRequestType =
  | "explain_object"
  | "explain_relationship"
  | "explain_kpi"
  | "explain_risk"
  | "explain_workspace"
  | "explain_scenario"
  | "explain_executive_summary"
  | "explain_data_source"
  | "general_executive_question";

export const ASSISTANT_EXECUTIVE_REQUEST_TYPES = Object.freeze([
  "explain_object",
  "explain_relationship",
  "explain_kpi",
  "explain_risk",
  "explain_workspace",
  "explain_scenario",
  "explain_executive_summary",
  "explain_data_source",
  "general_executive_question",
] as const satisfies readonly AssistantExecutiveRequestType[]);

export const ASSISTANT_REQUEST_PANEL_MAP: Readonly<
  Record<AssistantExecutiveRequestType, DashboardIntelligencePanelId>
> = Object.freeze({
  explain_object: "objects",
  explain_relationship: "relationships",
  explain_kpi: "kpis",
  explain_risk: "risk",
  explain_workspace: "workspace",
  explain_scenario: "scenario",
  explain_executive_summary: "executive_summary",
  explain_data_source: "data_sources",
  general_executive_question: "executive_summary",
});

export type AssistantIntelligenceSelection = Readonly<{
  objectId: string | null;
  relationshipId: string | null;
  kpiId: string | null;
  riskId: string | null;
  scenarioId: string | null;
  dataSourceId: string | null;
}>;

export type AssistantIntelligenceRequest = Readonly<{
  contractVersion: typeof ASSISTANT_INTELLIGENCE_VERSION;
  assistantRequestId: string;
  conversationId: string;
  requestId: string;
  requestType: AssistantExecutiveRequestType;
  managerPhrase: string | null;
  workspace: WorkspaceId | null;
  consumer: typeof ASSISTANT_INTELLIGENCE_CONSUMER;
  panel: DashboardIntelligencePanelId;
  selection: AssistantIntelligenceSelection;
  executiveTime: BuildExecutiveTimeContextInput;
  intelligenceContext: UnifiedIntelligenceContext | null;
  executiveTimeContext: ExecutiveTimeContext | null;
  timestamp: string;
  source: typeof ASSISTANT_INTELLIGENCE_SOURCE;
}>;

export type BuildAssistantIntelligenceInput = Readonly<{
  requestType: AssistantExecutiveRequestType;
  managerPhrase?: string | null;
  conversationId?: string | null;
  workspace?: WorkspaceId | null;
  panel?: DashboardIntelligencePanelId | null;
  selection?: Partial<AssistantIntelligenceSelection> | null;
  executiveTime?: BuildExecutiveTimeContextInput | null;
  filters?: Readonly<Record<string, string | null>> | null;
  useCurrentContext?: boolean | null;
}>;

export type AssistantIntelligenceSourceRef = Readonly<{
  source: string;
  engineId: string | null;
  panel: DashboardIntelligencePanelId;
}>;

export type AssistantIntelligenceResponse = Readonly<{
  contractVersion: typeof ASSISTANT_INTELLIGENCE_VERSION;
  assistantRequestId: string;
  requestType: AssistantExecutiveRequestType;
  success: boolean;
  summary: string;
  explanation: string;
  recommendations: readonly string[];
  warnings: readonly string[];
  confidence: number | null;
  sources: readonly AssistantIntelligenceSourceRef[];
  timeState: ExecutiveTimeContext["timeState"] | null;
  normalized: DashboardIntelligenceNormalizedPayload | null;
  reason: string;
  message: string;
  generatedAt: string;
  source: typeof ASSISTANT_INTELLIGENCE_SOURCE;
}>;

export type AssistantIntelligenceResult = Readonly<{
  request: AssistantIntelligenceRequest;
  response: AssistantIntelligenceResponse;
  gatewaySuccess: boolean;
}>;

export type AssistantRuntimeRegistryState = Readonly<{
  contractVersion: typeof ASSISTANT_INTELLIGENCE_VERSION;
  currentRequest: AssistantIntelligenceRequest | null;
  previousRequest: AssistantIntelligenceRequest | null;
  currentResponse: AssistantIntelligenceResponse | null;
  changeCounter: number;
  updatedAt: string;
}>;

export type AssistantIntelligenceEventType =
  | "AssistantRequestBuilt"
  | "AssistantContextAdapted"
  | "AssistantGatewayRequested"
  | "AssistantResponseBuilt"
  | "AssistantRequestRejected";

export type AssistantIntelligenceEvent = Readonly<{
  type: AssistantIntelligenceEventType;
  assistantRequestId: string | null;
  requestType: AssistantExecutiveRequestType | null;
  timeState: ExecutiveTimeContext["timeState"] | null;
  timestamp: string;
}>;

export type AssistantIntelligenceDiagnostics = Readonly<{
  assistantRequestId: string;
  conversationId: string;
  consumer: typeof ASSISTANT_INTELLIGENCE_CONSUMER;
  workspace: WorkspaceId | null;
  requestType: AssistantExecutiveRequestType;
  contextVersion: string | null;
  timeState: ExecutiveTimeContext["timeState"] | null;
  runtimeDurationMs: number;
  gatewayDurationMs: number;
  responseDurationMs: number;
  errorCode: string | null;
  generatedAt: string;
}>;

export type AssistantRequestBuildResult = Readonly<{
  success: boolean;
  request: AssistantIntelligenceRequest | null;
  reason: string;
  message: string;
}>;

export const ASSISTANT_FORBIDDEN_DS_IMPORT_PREFIXES = Object.freeze([
  "../kpi/workspaceKpi",
  "../risk/workspaceRisk",
  "../scenario/workspaceScenario",
  "../okr/workspaceOkr",
  "../executive/executiveIntelligenceRegistry",
] as const);
