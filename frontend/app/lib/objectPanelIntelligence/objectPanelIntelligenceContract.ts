/**
 * INT-4 — Object Panel Intelligence Contract.
 * Pure consumer of the Executive Intelligence Platform — object selection presentation only.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type {
  DashboardIntelligenceMode,
  DashboardIntelligenceNormalizedPayload,
  DashboardIntelligencePanelId,
  DashboardIntelligenceStatus,
} from "../dashboardIntelligence/dashboardIntelligenceContract.ts";
import type {
  BuildExecutiveTimeContextInput,
  ExecutiveTimeContext,
} from "../dashboardIntelligence/executiveTimeContextContract.ts";
import type { UnifiedIntelligenceContext } from "../dashboardIntelligence/intelligenceContextContract.ts";
import type { IntelligenceConsumerId } from "../dashboardIntelligence/singleIntelligenceSourceContract.ts";

export const OBJECT_PANEL_INTELLIGENCE_VERSION = "INT-4" as const;

export const OBJECT_PANEL_INTELLIGENCE_TAGS = Object.freeze([
  "[INT4_OBJECT_PANEL]",
  "[OBJECT_PANEL_RUNTIME]",
  "[OBJECT_PANEL_ADAPTER]",
  "[OBJECT_PANEL_CONTEXT]",
  "[OBJECT_PANEL_RESPONSE]",
  "[OBJECT_SELECTION_PIPELINE]",
  "[NO_DIRECT_DS_ACCESS]",
  "[INT4_COMPLETE]",
] as const);

export const NEXORA_OBJECT_PANEL_LOG_PREFIX = "[NexoraObjectPanelIntelligence]" as const;

export const OBJECT_PANEL_INTELLIGENCE_SOURCE = "int-4-object-panel-intelligence" as const;

export const OBJECT_PANEL_CONSUMER = "object_panel" as const satisfies IntelligenceConsumerId;

export const OBJECT_PANEL_DEFAULT_PANEL = "objects" as const satisfies DashboardIntelligencePanelId;

export const OBJECT_PANEL_DEFAULT_MODE = "objects" as const satisfies DashboardIntelligenceMode;

export type ObjectPanelSectionId =
  | "executive_overview"
  | "object_status"
  | "business_purpose"
  | "relationships"
  | "dependencies"
  | "kpis"
  | "risks"
  | "scenarios"
  | "recommendations"
  | "confidence"
  | "last_updated";

export const OBJECT_PANEL_SECTIONS = Object.freeze([
  "executive_overview",
  "object_status",
  "business_purpose",
  "relationships",
  "dependencies",
  "kpis",
  "risks",
  "scenarios",
  "recommendations",
  "confidence",
  "last_updated",
] as const satisfies readonly ObjectPanelSectionId[]);

export const OBJECT_PANEL_SECTION_TITLES: Readonly<Record<ObjectPanelSectionId, string>> =
  Object.freeze({
    executive_overview: "Executive Overview",
    object_status: "Object Status",
    business_purpose: "Business Purpose",
    relationships: "Relationships",
    dependencies: "Dependencies",
    kpis: "KPIs",
    risks: "Risks",
    scenarios: "Scenarios",
    recommendations: "Recommendations",
    confidence: "Confidence",
    last_updated: "Last Updated",
  });

export type ObjectPanelSelection = Readonly<{
  objectId: string | null;
  relationshipId: string | null;
  kpiId: string | null;
  riskId: string | null;
  scenarioId: string | null;
  dataSourceId: string | null;
}>;

export type ObjectPanelIntelligenceRequest = Readonly<{
  contractVersion: typeof OBJECT_PANEL_INTELLIGENCE_VERSION;
  objectPanelRequestId: string;
  requestId: string;
  workspace: WorkspaceId | null;
  selectedObjectId: string | null;
  consumer: typeof OBJECT_PANEL_CONSUMER;
  panel: DashboardIntelligencePanelId;
  dashboardMode: DashboardIntelligenceMode;
  selection: ObjectPanelSelection;
  executiveTime: BuildExecutiveTimeContextInput;
  intelligenceContext: UnifiedIntelligenceContext | null;
  executiveTimeContext: ExecutiveTimeContext | null;
  timestamp: string;
  source: typeof OBJECT_PANEL_INTELLIGENCE_SOURCE;
}>;

export type BuildObjectPanelIntelligenceInput = Readonly<{
  workspace?: WorkspaceId | null;
  selectedObjectId?: string | null;
  panel?: DashboardIntelligencePanelId | null;
  dashboardMode?: DashboardIntelligenceMode | null;
  selection?: Partial<ObjectPanelSelection> | null;
  executiveTime?: BuildExecutiveTimeContextInput | null;
  filters?: Readonly<Record<string, string | null>> | null;
  useCurrentContext?: boolean | null;
}>;

export type ObjectPanelSection = Readonly<{
  sectionId: ObjectPanelSectionId;
  title: string;
  content: string;
  highlights: readonly string[];
}>;

export type ObjectPanelIntelligenceResponse = Readonly<{
  contractVersion: typeof OBJECT_PANEL_INTELLIGENCE_VERSION;
  objectPanelRequestId: string;
  selectedObjectId: string | null;
  success: boolean;
  headline: string;
  status: DashboardIntelligenceStatus;
  summary: string;
  confidence: number | null;
  warnings: readonly string[];
  recommendations: readonly string[];
  highlights: readonly string[];
  sections: readonly ObjectPanelSection[];
  timeState: ExecutiveTimeContext["timeState"] | null;
  lastUpdated: string;
  normalized: DashboardIntelligenceNormalizedPayload | null;
  reason: string;
  message: string;
  generatedAt: string;
  source: typeof OBJECT_PANEL_INTELLIGENCE_SOURCE;
}>;

export type ObjectPanelIntelligenceResult = Readonly<{
  request: ObjectPanelIntelligenceRequest;
  response: ObjectPanelIntelligenceResponse;
  gatewaySuccess: boolean;
  selectionChanged: boolean;
}>;

export type ObjectPanelRegistryState = Readonly<{
  contractVersion: typeof OBJECT_PANEL_INTELLIGENCE_VERSION;
  currentRequest: ObjectPanelIntelligenceRequest | null;
  previousRequest: ObjectPanelIntelligenceRequest | null;
  currentResponse: ObjectPanelIntelligenceResponse | null;
  currentSelectedObjectId: string | null;
  previousSelectedObjectId: string | null;
  changeCounter: number;
  selectionChangeCounter: number;
  updatedAt: string;
}>;

export type ObjectPanelIntelligenceEventType =
  | "ObjectPanelRequestBuilt"
  | "ObjectPanelContextAdapted"
  | "ObjectPanelSelectionChanged"
  | "ObjectPanelGatewayRequested"
  | "ObjectPanelResponseBuilt"
  | "ObjectPanelRequestRejected";

export type ObjectPanelIntelligenceEvent = Readonly<{
  type: ObjectPanelIntelligenceEventType;
  objectPanelRequestId: string | null;
  selectedObjectId: string | null;
  timeState: ExecutiveTimeContext["timeState"] | null;
  timestamp: string;
}>;

export type ObjectPanelIntelligenceDiagnostics = Readonly<{
  objectPanelRequestId: string;
  selectedObjectId: string | null;
  consumer: typeof OBJECT_PANEL_CONSUMER;
  workspace: WorkspaceId | null;
  contextVersion: string | null;
  timeState: ExecutiveTimeContext["timeState"] | null;
  runtimeDurationMs: number;
  gatewayDurationMs: number;
  responseDurationMs: number;
  selectionChanged: boolean;
  errorCode: string | null;
  generatedAt: string;
}>;

export type ObjectPanelRequestBuildResult = Readonly<{
  success: boolean;
  request: ObjectPanelIntelligenceRequest | null;
  reason: string;
  message: string;
}>;

export const OBJECT_PANEL_FORBIDDEN_DS_IMPORT_PREFIXES = Object.freeze([
  "../kpi/workspaceKpi",
  "../risk/workspaceRisk",
  "../scenario/workspaceScenario",
  "../okr/workspaceOkr",
  "../executive/executiveIntelligenceRegistry",
  "../workspace/workspaceObjectIntelligenceContract",
] as const);
