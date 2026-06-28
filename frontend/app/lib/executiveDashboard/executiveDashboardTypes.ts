/**
 * PHASE-11 / EDI-1 — Executive Dashboard Intelligence types.
 * Presentation contract only — no rendering, calculation, or runtime behavior.
 */

import type {
  ExecutiveIntelligenceContext,
  ExecutiveIntelligenceResponse,
  ExecutiveIntelligenceSession,
} from "../executiveIntelligencePlatform/executiveIntelligencePlatformTypes.ts";

export type ExecutiveDashboardWorkspaceId = string;

export type ExecutiveDashboardSectionType =
  | "executive_summary"
  | "operational_overview"
  | "kpi_overview"
  | "risk_overview"
  | "scenario_overview"
  | "okr_overview"
  | "resource_overview"
  | "timeline_overview"
  | "custom";

export type ExecutiveDashboardWidgetType =
  | "summary_card"
  | "metric_card"
  | "comparison_card"
  | "trend_card"
  | "reference_list"
  | "custom";

export type ExecutiveDashboardContentSource =
  | "executive_summary"
  | "referenced_objects"
  | "referenced_relationships"
  | "referenced_kpis"
  | "referenced_risks"
  | "referenced_scenarios"
  | "referenced_okrs"
  | "metadata"
  | "timestamps";

export type ExecutiveDashboardLifecycleState =
  | "initialized"
  | "prepared"
  | "validated"
  | "available"
  | "deprecated"
  | "archived";

export type ExecutiveDashboardExtensionPoint = Readonly<{
  taxonomyOverride?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveDashboardMetadata = Readonly<{
  tags: readonly string[];
  domainHint: string | null;
  executiveCategoryHint: string | null;
  presentationHint: string | null;
  taxonomyOverride: string | null;
  extension: ExecutiveDashboardExtensionPoint;
}>;

export type ExecutiveDashboardPresentationState = Readonly<{
  selectedSection: ExecutiveDashboardSectionType | null;
  expandedPanels: readonly string[];
  widgetVisibility: Readonly<Record<string, boolean>>;
  filters: readonly string[];
  layoutPreferences: Readonly<Record<string, string>>;
}>;

export type ExecutiveDashboardWidgetDefinition = Readonly<{
  widgetId: string;
  widgetType: ExecutiveDashboardWidgetType;
  widgetTitle: string;
  contentSource: ExecutiveDashboardContentSource;
  referenceIds: readonly string[];
  displayHint: string | null;
  metadata: ExecutiveDashboardMetadata;
}>;

export type ExecutiveDashboardSectionDefinition = Readonly<{
  sectionId: string;
  sectionType: ExecutiveDashboardSectionType;
  sectionTitle: string;
  widgets: readonly ExecutiveDashboardWidgetDefinition[];
  metadata: ExecutiveDashboardMetadata;
}>;

export type ExecutiveDashboardSession = Readonly<{
  contractVersion: string;
  dashboardSessionId: string;
  workspaceId: ExecutiveDashboardWorkspaceId;
  executiveModelId: string;
  intelligenceSessionId: string;
  intelligenceResponseId: string;
  intelligenceRequestId: string;
  sectionTypes: readonly ExecutiveDashboardSectionType[];
  widgetCount: number;
  layoutSummary: string;
  metadata: ExecutiveDashboardMetadata;
  lifecycleState: ExecutiveDashboardLifecycleState;
  createdAt: string;
  updatedAt: string;
  source: "phase-11-executive-dashboard-intelligence";
}>;

export type ExecutiveDashboardRequest = Readonly<{
  contractVersion: string;
  requestId: string;
  dashboardSessionId: string;
  workspaceId: ExecutiveDashboardWorkspaceId;
  executiveModelId: string;
  intelligenceResponseId: string;
  requestedSections: readonly ExecutiveDashboardSectionType[];
  requestedWidgetTypes: readonly ExecutiveDashboardWidgetType[];
  metadata: ExecutiveDashboardMetadata;
  lifecycleState: ExecutiveDashboardLifecycleState;
  createdAt: string;
  updatedAt: string;
  source: "phase-11-executive-dashboard-intelligence";
}>;

export type ExecutiveDashboardResponse = Readonly<{
  contractVersion: string;
  responseId: string;
  requestId: string;
  dashboardSessionId: string;
  workspaceId: ExecutiveDashboardWorkspaceId;
  executiveModelId: string;
  intelligenceResponseId: string;
  sections: readonly ExecutiveDashboardSectionDefinition[];
  metadata: ExecutiveDashboardMetadata;
  lifecycleState: ExecutiveDashboardLifecycleState;
  createdAt: string;
  updatedAt: string;
  source: "phase-11-executive-dashboard-intelligence";
}>;

export type ExecutiveDashboardContext = Readonly<{
  contextId: string;
  dashboardSessionId: string;
  workspaceId: ExecutiveDashboardWorkspaceId;
  executiveModelId: string;
  intelligenceSessionId: string;
  intelligenceResponseId: string;
  activeSections: readonly ExecutiveDashboardSectionType[];
  presentationState: ExecutiveDashboardPresentationState;
  metadata: ExecutiveDashboardMetadata;
  createdAt: string;
  updatedAt: string;
  source: "phase-11-executive-dashboard-intelligence";
}>;

export type ExecutiveDashboardLayoutInput = Readonly<{
  intelligenceResponse: ExecutiveIntelligenceResponse;
  intelligenceSession: ExecutiveIntelligenceSession;
  intelligenceContext: ExecutiveIntelligenceContext;
  requestedSections?: readonly ExecutiveDashboardSectionType[];
  requestedWidgetTypes?: readonly ExecutiveDashboardWidgetType[];
  dashboardSessionId?: string;
}>;

export type ExecutiveDashboardOwnershipContract = Readonly<{
  dashboardSessionId: string;
  workspaceId: ExecutiveDashboardWorkspaceId;
  executiveModelId: string;
  intelligenceSessionId: string;
  intelligenceResponseId: string;
  isolationPolicy: "workspace-exclusive";
  upstreamAuthority: "phase-10-executive-intelligence-platform";
  mutationPolicy: "read-only-presentation-snapshot";
}>;

export type ExecutiveDashboardValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveDashboardValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveDashboardValidationIssue[];
}>;

export type ExecutiveDashboardLayoutResult = Readonly<{
  success: boolean;
  session: ExecutiveDashboardSession | null;
  request: ExecutiveDashboardRequest | null;
  response: ExecutiveDashboardResponse | null;
  context: ExecutiveDashboardContext | null;
  issues: readonly ExecutiveDashboardValidationIssue[];
  dashboardSessionId: string;
}>;

export type ExecutiveDashboardScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type ExecutiveDashboardScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveDashboardScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveDashboardCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveDashboardCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly ExecutiveDashboardCertificationCheck[];
  scoreReport: ExecutiveDashboardScoreReport;
  analysisScoreReport: ExecutiveDashboardAnalysisScoreReport | null;
  freezeReport: ExecutiveDashboardFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type ExecutiveDashboardAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  eipInputBoundaryIntegrity: number;
  presentationOnlyIntegrity: number;
  layoutIntegrity: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type ExecutiveDashboardAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveDashboardAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveDashboardFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  sectionTypesCount: number;
  widgetTypesCount: number;
  lifecycleStatesCount: number;
  presentationStagesCount: number;
  generatedAt: string;
}>;

export type ExecutiveDashboardDiagnosticEventType =
  | "DashboardSessionCreated"
  | "DashboardRequestAccepted"
  | "DashboardPrepared"
  | "SectionValidated"
  | "WidgetValidated"
  | "DashboardResponseReady"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type ExecutiveDashboardDiagnosticEvent = Readonly<{
  type: ExecutiveDashboardDiagnosticEventType;
  dashboardSessionId: string | null;
  workspaceId: ExecutiveDashboardWorkspaceId | null;
  requestId: string | null;
  responseId: string | null;
  timestamp: string;
}>;

export type ExecutiveDashboardDiagnosticLogEntry = Readonly<{
  dashboardSessionId: string | null;
  workspaceId: ExecutiveDashboardWorkspaceId | null;
  requestId: string | null;
  responseId: string | null;
  event: ExecutiveDashboardDiagnosticEventType;
  message: string;
  generatedAt: string;
}>;
