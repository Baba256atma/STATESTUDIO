/**
 * INT-3 — Executive Summary Intelligence Contract.
 * Pure consumer of the Executive Intelligence Platform — presentation only.
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

export const EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION = "INT-3" as const;

export const EXECUTIVE_SUMMARY_INTELLIGENCE_TAGS = Object.freeze([
  "[INT3_EXECUTIVE_SUMMARY]",
  "[EXEC_SUMMARY_RUNTIME]",
  "[EXEC_SUMMARY_ADAPTER]",
  "[EXEC_SUMMARY_RESPONSE]",
  "[EXEC_SUMMARY_CONTEXT]",
  "[NO_DIRECT_DS_ACCESS]",
  "[INT3_COMPLETE]",
] as const);

export const NEXORA_EXECUTIVE_SUMMARY_LOG_PREFIX = "[NexoraExecutiveSummaryIntelligence]" as const;

export const EXECUTIVE_SUMMARY_INTELLIGENCE_SOURCE = "int-3-executive-summary-intelligence" as const;

export const EXECUTIVE_SUMMARY_CONSUMER = "executive_summary" as const satisfies IntelligenceConsumerId;

export const EXECUTIVE_SUMMARY_DEFAULT_PANEL = "executive_summary" as const satisfies DashboardIntelligencePanelId;

export const EXECUTIVE_SUMMARY_DEFAULT_MODE = "executive_summary" as const satisfies DashboardIntelligenceMode;

export type ExecutiveSummarySectionId =
  | "business_health"
  | "executive_overview"
  | "key_kpis"
  | "key_risks"
  | "top_opportunities"
  | "critical_warnings"
  | "strategic_recommendations"
  | "confidence"
  | "last_updated";

export const EXECUTIVE_SUMMARY_SECTIONS = Object.freeze([
  "business_health",
  "executive_overview",
  "key_kpis",
  "key_risks",
  "top_opportunities",
  "critical_warnings",
  "strategic_recommendations",
  "confidence",
  "last_updated",
] as const satisfies readonly ExecutiveSummarySectionId[]);

export const EXECUTIVE_SUMMARY_SECTION_TITLES: Readonly<Record<ExecutiveSummarySectionId, string>> =
  Object.freeze({
    business_health: "Business Health",
    executive_overview: "Executive Overview",
    key_kpis: "Key KPIs",
    key_risks: "Key Risks",
    top_opportunities: "Top Opportunities",
    critical_warnings: "Critical Warnings",
    strategic_recommendations: "Strategic Recommendations",
    confidence: "Confidence",
    last_updated: "Last Updated",
  });

export type ExecutiveSummarySelection = Readonly<{
  objectId: string | null;
  relationshipId: string | null;
  kpiId: string | null;
  riskId: string | null;
  scenarioId: string | null;
  dataSourceId: string | null;
}>;

export type ExecutiveSummaryIntelligenceRequest = Readonly<{
  contractVersion: typeof EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION;
  summaryRequestId: string;
  requestId: string;
  workspace: WorkspaceId | null;
  consumer: typeof EXECUTIVE_SUMMARY_CONSUMER;
  panel: DashboardIntelligencePanelId;
  dashboardMode: DashboardIntelligenceMode;
  selection: ExecutiveSummarySelection;
  executiveTime: BuildExecutiveTimeContextInput;
  intelligenceContext: UnifiedIntelligenceContext | null;
  executiveTimeContext: ExecutiveTimeContext | null;
  timestamp: string;
  source: typeof EXECUTIVE_SUMMARY_INTELLIGENCE_SOURCE;
}>;

export type BuildExecutiveSummaryIntelligenceInput = Readonly<{
  workspace?: WorkspaceId | null;
  panel?: DashboardIntelligencePanelId | null;
  dashboardMode?: DashboardIntelligenceMode | null;
  selection?: Partial<ExecutiveSummarySelection> | null;
  executiveTime?: BuildExecutiveTimeContextInput | null;
  filters?: Readonly<Record<string, string | null>> | null;
  useCurrentContext?: boolean | null;
}>;

export type ExecutiveSummarySection = Readonly<{
  sectionId: ExecutiveSummarySectionId;
  title: string;
  content: string;
  highlights: readonly string[];
}>;

export type ExecutiveSummaryIntelligenceResponse = Readonly<{
  contractVersion: typeof EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION;
  summaryRequestId: string;
  success: boolean;
  headline: string;
  status: DashboardIntelligenceStatus;
  summary: string;
  confidence: number | null;
  warnings: readonly string[];
  recommendations: readonly string[];
  highlights: readonly string[];
  sections: readonly ExecutiveSummarySection[];
  timeState: ExecutiveTimeContext["timeState"] | null;
  lastUpdated: string;
  normalized: DashboardIntelligenceNormalizedPayload | null;
  reason: string;
  message: string;
  generatedAt: string;
  source: typeof EXECUTIVE_SUMMARY_INTELLIGENCE_SOURCE;
}>;

export type ExecutiveSummaryIntelligenceResult = Readonly<{
  request: ExecutiveSummaryIntelligenceRequest;
  response: ExecutiveSummaryIntelligenceResponse;
  gatewaySuccess: boolean;
}>;

export type ExecutiveSummaryRegistryState = Readonly<{
  contractVersion: typeof EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION;
  currentRequest: ExecutiveSummaryIntelligenceRequest | null;
  previousRequest: ExecutiveSummaryIntelligenceRequest | null;
  currentResponse: ExecutiveSummaryIntelligenceResponse | null;
  changeCounter: number;
  updatedAt: string;
}>;

export type ExecutiveSummaryIntelligenceEventType =
  | "ExecutiveSummaryRequestBuilt"
  | "ExecutiveSummaryContextAdapted"
  | "ExecutiveSummaryGatewayRequested"
  | "ExecutiveSummaryResponseBuilt"
  | "ExecutiveSummaryRequestRejected";

export type ExecutiveSummaryIntelligenceEvent = Readonly<{
  type: ExecutiveSummaryIntelligenceEventType;
  summaryRequestId: string | null;
  timeState: ExecutiveTimeContext["timeState"] | null;
  timestamp: string;
}>;

export type ExecutiveSummaryIntelligenceDiagnostics = Readonly<{
  summaryRequestId: string;
  consumer: typeof EXECUTIVE_SUMMARY_CONSUMER;
  workspace: WorkspaceId | null;
  contextVersion: string | null;
  timeState: ExecutiveTimeContext["timeState"] | null;
  runtimeDurationMs: number;
  gatewayDurationMs: number;
  summaryGenerationDurationMs: number;
  errorCode: string | null;
  generatedAt: string;
}>;

export type ExecutiveSummaryRequestBuildResult = Readonly<{
  success: boolean;
  request: ExecutiveSummaryIntelligenceRequest | null;
  reason: string;
  message: string;
}>;

export const EXECUTIVE_SUMMARY_FORBIDDEN_DS_IMPORT_PREFIXES = Object.freeze([
  "../kpi/workspaceKpi",
  "../risk/workspaceRisk",
  "../scenario/workspaceScenario",
  "../okr/workspaceOkr",
  "../executive/executiveIntelligenceRegistry",
] as const);
