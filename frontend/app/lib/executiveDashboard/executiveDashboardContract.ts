/**
 * PHASE-11 / EDI-1 — Executive Dashboard Intelligence contract.
 * Presentation vocabulary — EIP response input only.
 * Stage-2: deterministic layout composition, read-only and identity-based.
 */

import {
  EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE,
  resolveExecutiveIntelligenceContextExample,
  resolveExecutiveIntelligenceResponseExample,
  resolveExecutiveIntelligenceSessionExample,
  validateExecutiveIntelligenceContext,
  validateExecutiveIntelligenceResponse,
  validateExecutiveIntelligenceSession,
} from "../executiveIntelligencePlatform/executiveIntelligencePlatformContract.ts";
import type {
  ExecutiveIntelligenceContext,
  ExecutiveIntelligenceResponse,
  ExecutiveIntelligenceSession,
} from "../executiveIntelligencePlatform/executiveIntelligencePlatformTypes.ts";
import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  recordExecutiveDashboardDiagnostic,
  recordExecutiveDashboardDiagnosticEvent,
} from "./executiveDashboardDiagnostics.ts";
import type {
  ExecutiveDashboardContext,
  ExecutiveDashboardLayoutInput,
  ExecutiveDashboardLayoutResult,
  ExecutiveDashboardLifecycleState,
  ExecutiveDashboardMetadata,
  ExecutiveDashboardOwnershipContract,
  ExecutiveDashboardPresentationState,
  ExecutiveDashboardRequest,
  ExecutiveDashboardResponse,
  ExecutiveDashboardSectionDefinition,
  ExecutiveDashboardSectionType,
  ExecutiveDashboardSession,
  ExecutiveDashboardValidationIssue,
  ExecutiveDashboardValidationResult,
  ExecutiveDashboardWidgetDefinition,
  ExecutiveDashboardWidgetType,
  ExecutiveDashboardContentSource,
  ExecutiveDashboardScoreDimensions,
  ExecutiveDashboardAnalysisScoreDimensions,
} from "./executiveDashboardTypes.ts";

export const EXECUTIVE_DASHBOARD_VERSION = "PHASE-11/EDI-1" as const;
export const EXECUTIVE_DASHBOARD_SOURCE = "phase-11-executive-dashboard-intelligence" as const;
export const EXECUTIVE_DASHBOARD_LOG_PREFIX = "[NexoraExecutiveDashboard]" as const;
export const EXECUTIVE_DASHBOARD_MINIMUM_OVERALL_SCORE = 99 as const;

export const EXECUTIVE_DASHBOARD_TAGS = Object.freeze([
  "[EDI_EXECUTIVE_DASHBOARD]",
  "[DASHBOARD_INTELLIGENCE_DEFINED]",
  "[WORKSPACE_DASHBOARD_OWNED]",
  "[UI_ADAPTER_READY]",
] as const);

export const EXECUTIVE_DASHBOARD_FREEZE_TAGS = Object.freeze([
  "[EDI_1_CERTIFIED]",
  "[EXECUTIVE_DASHBOARD_INTELLIGENCE_FROZEN]",
  "[PHASE11_EDI_COMPLETE]",
] as const);

export const EXECUTIVE_DASHBOARD_SECTION_TYPES = Object.freeze([
  "executive_summary",
  "operational_overview",
  "kpi_overview",
  "risk_overview",
  "scenario_overview",
  "okr_overview",
  "resource_overview",
  "timeline_overview",
  "custom",
] as const satisfies readonly ExecutiveDashboardSectionType[]);

export const EXECUTIVE_DASHBOARD_WIDGET_TYPES = Object.freeze([
  "summary_card",
  "metric_card",
  "comparison_card",
  "trend_card",
  "reference_list",
  "custom",
] as const satisfies readonly ExecutiveDashboardWidgetType[]);

export const EXECUTIVE_DASHBOARD_LIFECYCLE_STATES = Object.freeze([
  "initialized",
  "prepared",
  "validated",
  "available",
  "deprecated",
  "archived",
] as const satisfies readonly ExecutiveDashboardLifecycleState[]);

export const EXECUTIVE_DASHBOARD_PRESENTATION_STAGES = Object.freeze([
  "accept",
  "prepare",
  "map",
  "compose",
  "validate",
  "respond",
] as const);

export const EXECUTIVE_DASHBOARD_CONTENT_SOURCES = Object.freeze([
  "executive_summary",
  "referenced_objects",
  "referenced_relationships",
  "referenced_kpis",
  "referenced_risks",
  "referenced_scenarios",
  "referenced_okrs",
  "metadata",
  "timestamps",
] as const satisfies readonly ExecutiveDashboardContentSource[]);

export const EXECUTIVE_DASHBOARD_SESSION_MANDATORY_FIELDS = Object.freeze([
  "dashboardSessionId",
  "workspaceId",
  "executiveModelId",
  "intelligenceSessionId",
  "intelligenceResponseId",
  "intelligenceRequestId",
  "sectionTypes",
  "widgetCount",
  "layoutSummary",
  "metadata",
  "lifecycleState",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_DASHBOARD_REQUEST_MANDATORY_FIELDS = Object.freeze([
  "requestId",
  "dashboardSessionId",
  "workspaceId",
  "executiveModelId",
  "intelligenceResponseId",
  "requestedSections",
  "requestedWidgetTypes",
  "metadata",
  "lifecycleState",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_DASHBOARD_RESPONSE_MANDATORY_FIELDS = Object.freeze([
  "responseId",
  "requestId",
  "dashboardSessionId",
  "workspaceId",
  "executiveModelId",
  "intelligenceResponseId",
  "sections",
  "metadata",
  "lifecycleState",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_DASHBOARD_CONTEXT_MANDATORY_FIELDS = Object.freeze([
  "contextId",
  "dashboardSessionId",
  "workspaceId",
  "executiveModelId",
  "intelligenceSessionId",
  "intelligenceResponseId",
  "activeSections",
  "presentationState",
  "metadata",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_DASHBOARD_MUST_NOT_OWN = Object.freeze([
  "kpi_calculations",
  "kpi_formula_execution",
  "kpi_value_tracking",
  "progress_calculation",
  "achievement_scoring",
  "risk_scoring",
  "risk_calculation",
  "probability_calculation",
  "scenario_simulation",
  "scenario_prediction",
  "scenario_optimization",
  "okr_progress",
  "okr_achievement",
  "strategy_optimization",
  "prediction_engine",
  "optimization_engine",
  "forecasting",
  "forecast_engine",
  "ai_reasoning",
  "intelligence_reasoning",
  "recommendation_engine",
  "recommendation_generation",
  "generated_advice",
  "llm_inference",
  "intelligence_orchestration",
  "registry_access",
  "registry_duplication",
  "registry_mutation",
  "registry_embedding",
  "registry_replacement",
  "registry_caching",
  "intelligence_cache",
  "business_entity_ownership",
  "dashboard_rendering",
  "ui_implementation",
  "assistant_logic",
  "persistence",
  "upload_execution",
  "parsing",
  "synchronization",
  "scene_sync",
  "workspace_mutation",
  "legacy_dashboard_modules",
  "legacy_dashboard_intelligence_duplication",
  "legacy_intelligence_modules",
  "ds1_direct_consumption",
  "emg_direct_consumption",
  "emg_model_record_consumption",
  "object_registry_direct_consumption",
  "relationship_registry_direct_consumption",
  "kpi_registry_direct_consumption",
  "risk_registry_direct_consumption",
  "scenario_registry_direct_consumption",
  "okr_registry_direct_consumption",
] as const);

export const EXECUTIVE_DASHBOARD_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "datasourceCertification/",
  "datasource/",
  "executiveModel/",
  "executiveModelPipeline/",
  "executiveModelRuntime/",
  "executiveObject/",
  "executiveRelationship/",
  "executiveKpi/",
  "executiveRisk/",
  "executiveScenario/",
  "executiveOkr/",
  "kpi-intelligence/",
  "risk-intelligence/",
  "scenario-intelligence/",
  "scenario-authoring/",
  "okr/workspaceOkr",
  "dashboardIntelligence/",
  "intelligence-integration/",
  "assistant/",
  "workspace/workspaceSceneSync",
  "workspace/workspaceRelationshipSceneSync",
  "scene/",
  "relationships/executive/",
  "ui/mrpWorkspace/",
  "components/",
  ".tsx",
] as const);

export const EXECUTIVE_DASHBOARD_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-11/EDI-1",
  title: "Executive Dashboard Intelligence",
  goal: "Library-only presentation layer consuming frozen EIP responses and producing dashboard layout definitions.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveDashboard/executiveDashboardTypes.ts",
    "frontend/app/lib/executiveDashboard/executiveDashboardContract.ts",
    "frontend/app/lib/executiveDashboard/executiveDashboardDiagnostics.ts",
    "frontend/app/lib/executiveDashboard/executiveDashboardCertification.ts",
    "frontend/app/lib/executiveDashboard/executiveDashboardCertification.test.ts",
    "docs/executive-dashboard-understanding-report.md",
    "docs/executive-dashboard-build-report.md",
    "docs/executive-dashboard-analysis-report.md",
    "docs/executive-dashboard-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_DASHBOARD_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["EIP-1", "STAGE-ARCH-3"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_DASHBOARD_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_DASHBOARD_MODULE_PATHS = Object.freeze(
  EXECUTIVE_DASHBOARD_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

export const EXAMPLE_DASHBOARD_SESSION_ID = "edi-session-example-001";

const SECTION_TITLES: Readonly<Record<ExecutiveDashboardSectionType, string>> = Object.freeze({
  executive_summary: "Executive Summary",
  operational_overview: "Operational Overview",
  kpi_overview: "KPI Overview",
  risk_overview: "Risk Overview",
  scenario_overview: "Scenario Overview",
  okr_overview: "OKR Overview",
  resource_overview: "Resource Overview",
  timeline_overview: "Timeline Overview",
  custom: "Custom",
});

function issue(code: string, message: string): ExecutiveDashboardValidationIssue {
  return Object.freeze({ code, message });
}

function nowIso(): string {
  return new Date().toISOString();
}

function isLifecycleState(value: string): value is ExecutiveDashboardLifecycleState {
  return (EXECUTIVE_DASHBOARD_LIFECYCLE_STATES as readonly string[]).includes(value);
}

function isSectionType(value: string): value is ExecutiveDashboardSectionType {
  return (EXECUTIVE_DASHBOARD_SECTION_TYPES as readonly string[]).includes(value);
}

function isWidgetType(value: string): value is ExecutiveDashboardWidgetType {
  return (EXECUTIVE_DASHBOARD_WIDGET_TYPES as readonly string[]).includes(value);
}

function isContentSource(value: string): value is ExecutiveDashboardContentSource {
  return (EXECUTIVE_DASHBOARD_CONTENT_SOURCES as readonly string[]).includes(value);
}

function cloneMetadata(tags: readonly string[] = []): ExecutiveDashboardMetadata {
  return Object.freeze({
    tags: Object.freeze([...tags]),
    domainHint: null,
    executiveCategoryHint: null,
    presentationHint: null,
    taxonomyOverride: null,
    extension: Object.freeze({
      taxonomyOverride: null,
      futureExtension: Object.freeze({}),
    }),
  });
}

function defaultPresentationState(): ExecutiveDashboardPresentationState {
  return Object.freeze({
    selectedSection: "executive_summary",
    expandedPanels: Object.freeze([] as const),
    widgetVisibility: Object.freeze({}),
    filters: Object.freeze([] as const),
    layoutPreferences: Object.freeze({}),
  });
}

function ensureMandatoryFields<T extends object>(
  input: Partial<T>,
  fields: readonly string[],
  issues: ExecutiveDashboardValidationIssue[],
  label: string
): void {
  for (const field of fields) {
    if (!(field in input) || input[field as keyof T] === undefined) {
      issues.push(issue(`missing_${field}`, `${label}.${field} is required.`));
    }
  }
}

export function computeExecutiveDashboardOverallScore(dimensions: ExecutiveDashboardScoreDimensions): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveDashboardMinimumScore(overall: number): boolean {
  return overall >= EXECUTIVE_DASHBOARD_MINIMUM_OVERALL_SCORE;
}

const ANALYSIS_SCORE_WEIGHTS = Object.freeze({
  architectureHealth: 0.12,
  maintainability: 0.1,
  scalability: 0.09,
  regressionSafety: 0.12,
  eipInputBoundaryIntegrity: 0.14,
  presentationOnlyIntegrity: 0.14,
  layoutIntegrity: 0.12,
  bugTraceability: 0.05,
  certificationReadiness: 0.12,
} as const);

export function computeExecutiveDashboardAnalysisScore(
  dimensions: ExecutiveDashboardAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.eipInputBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.eipInputBoundaryIntegrity +
    dimensions.presentationOnlyIntegrity * ANALYSIS_SCORE_WEIGHTS.presentationOnlyIntegrity +
    dimensions.layoutIntegrity * ANALYSIS_SCORE_WEIGHTS.layoutIntegrity +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function validateExecutiveDashboardMetadata(
  input: Partial<ExecutiveDashboardMetadata>
): ExecutiveDashboardValidationResult {
  const issues: ExecutiveDashboardValidationIssue[] = [];
  if (!input.tags || !Array.isArray(input.tags)) {
    issues.push(issue("missing_tags", "metadata.tags is required."));
  }
  if (!("domainHint" in input)) issues.push(issue("missing_domain_hint", "metadata.domainHint is required."));
  if (!("executiveCategoryHint" in input)) {
    issues.push(issue("missing_executive_category_hint", "metadata.executiveCategoryHint is required."));
  }
  if (!("presentationHint" in input)) {
    issues.push(issue("missing_presentation_hint", "metadata.presentationHint is required."));
  }
  if (!("taxonomyOverride" in input)) {
    issues.push(issue("missing_taxonomy_override", "metadata.taxonomyOverride is required."));
  }
  if (!input.extension || typeof input.extension !== "object") {
    issues.push(issue("missing_extension", "metadata.extension is required."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveDashboardPresentationState(
  input: Partial<ExecutiveDashboardPresentationState>
): ExecutiveDashboardValidationResult {
  const issues: ExecutiveDashboardValidationIssue[] = [];
  if (!("selectedSection" in input)) {
    issues.push(issue("missing_selected_section", "presentationState.selectedSection is required."));
  } else if (input.selectedSection !== null && typeof input.selectedSection === "string" && !isSectionType(input.selectedSection)) {
    issues.push(issue("invalid_selected_section", "presentationState.selectedSection is invalid."));
  }
  if (!input.expandedPanels || !Array.isArray(input.expandedPanels)) {
    issues.push(issue("missing_expanded_panels", "presentationState.expandedPanels is required."));
  }
  if (!input.widgetVisibility || typeof input.widgetVisibility !== "object") {
    issues.push(issue("missing_widget_visibility", "presentationState.widgetVisibility is required."));
  }
  if (!input.filters || !Array.isArray(input.filters)) {
    issues.push(issue("missing_filters", "presentationState.filters is required."));
  }
  if (!input.layoutPreferences || typeof input.layoutPreferences !== "object") {
    issues.push(issue("missing_layout_preferences", "presentationState.layoutPreferences is required."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveDashboardWidget(
  input: Partial<ExecutiveDashboardWidgetDefinition>
): ExecutiveDashboardValidationResult {
  const issues: ExecutiveDashboardValidationIssue[] = [];
  if (!input.widgetId?.trim()) issues.push(issue("missing_widget_id", "widgetId is required."));
  if (!input.widgetType || !isWidgetType(input.widgetType)) {
    issues.push(issue("invalid_widget_type", "widgetType must be a known widget type."));
  }
  if (!input.widgetTitle?.trim()) issues.push(issue("missing_widget_title", "widgetTitle is required."));
  if (!input.contentSource || !isContentSource(input.contentSource)) {
    issues.push(issue("invalid_content_source", "contentSource must be a known content source."));
  }
  if (!input.referenceIds || !Array.isArray(input.referenceIds)) {
    issues.push(issue("missing_reference_ids", "referenceIds is required."));
  }
  if (!("displayHint" in input)) issues.push(issue("missing_display_hint", "displayHint is required."));
  const metadataResult = validateExecutiveDashboardMetadata(input.metadata ?? {});
  issues.push(...metadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveDashboardSection(
  input: Partial<ExecutiveDashboardSectionDefinition>
): ExecutiveDashboardValidationResult {
  const issues: ExecutiveDashboardValidationIssue[] = [];
  if (!input.sectionId?.trim()) issues.push(issue("missing_section_id", "sectionId is required."));
  if (!input.sectionType || !isSectionType(input.sectionType)) {
    issues.push(issue("invalid_section_type", "sectionType must be a known section type."));
  }
  if (!input.sectionTitle?.trim()) issues.push(issue("missing_section_title", "sectionTitle is required."));
  if (!input.widgets || !Array.isArray(input.widgets)) {
    issues.push(issue("missing_widgets", "widgets is required."));
  } else {
    for (const widget of input.widgets) {
      const widgetResult = validateExecutiveDashboardWidget(widget);
      if (!widgetResult.valid) issues.push(...widgetResult.issues);
    }
  }
  const metadataResult = validateExecutiveDashboardMetadata(input.metadata ?? {});
  issues.push(...metadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveDashboardSession(
  input: Partial<ExecutiveDashboardSession>
): ExecutiveDashboardValidationResult {
  const issues: ExecutiveDashboardValidationIssue[] = [];
  ensureMandatoryFields(input, EXECUTIVE_DASHBOARD_SESSION_MANDATORY_FIELDS, issues, "session");
  if (input.contractVersion !== EXECUTIVE_DASHBOARD_VERSION) {
    issues.push(issue("invalid_contract_version", "session contractVersion must match PHASE-11/EDI-1."));
  }
  if (input.lifecycleState && !isLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "session lifecycleState is invalid."));
  }
  if (input.sectionTypes) {
    for (const sectionType of input.sectionTypes) {
      if (!isSectionType(sectionType)) issues.push(issue("invalid_section_type", `Invalid section type: ${sectionType}.`));
    }
  }
  if (typeof input.widgetCount !== "number" || input.widgetCount < 0) {
    issues.push(issue("invalid_widget_count", "widgetCount must be a non-negative number."));
  }
  const metadataResult = validateExecutiveDashboardMetadata(input.metadata ?? {});
  issues.push(...metadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveDashboardRequest(
  input: Partial<ExecutiveDashboardRequest>
): ExecutiveDashboardValidationResult {
  const issues: ExecutiveDashboardValidationIssue[] = [];
  ensureMandatoryFields(input, EXECUTIVE_DASHBOARD_REQUEST_MANDATORY_FIELDS, issues, "request");
  if (input.contractVersion !== EXECUTIVE_DASHBOARD_VERSION) {
    issues.push(issue("invalid_contract_version", "request contractVersion must match PHASE-11/EDI-1."));
  }
  if (input.lifecycleState && !isLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "request lifecycleState is invalid."));
  }
  if (input.requestedSections) {
    for (const sectionType of input.requestedSections) {
      if (!isSectionType(sectionType)) issues.push(issue("invalid_section_type", `Invalid section type: ${sectionType}.`));
    }
  }
  if (input.requestedWidgetTypes) {
    for (const widgetType of input.requestedWidgetTypes) {
      if (!isWidgetType(widgetType)) issues.push(issue("invalid_widget_type", `Invalid widget type: ${widgetType}.`));
    }
  }
  const metadataResult = validateExecutiveDashboardMetadata(input.metadata ?? {});
  issues.push(...metadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveDashboardResponse(
  input: Partial<ExecutiveDashboardResponse>
): ExecutiveDashboardValidationResult {
  const issues: ExecutiveDashboardValidationIssue[] = [];
  ensureMandatoryFields(input, EXECUTIVE_DASHBOARD_RESPONSE_MANDATORY_FIELDS, issues, "response");
  if (input.contractVersion !== EXECUTIVE_DASHBOARD_VERSION) {
    issues.push(issue("invalid_contract_version", "response contractVersion must match PHASE-11/EDI-1."));
  }
  if (input.lifecycleState && !isLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "response lifecycleState is invalid."));
  }
  if (input.sections) {
    for (const section of input.sections) {
      const sectionResult = validateExecutiveDashboardSection(section);
      if (!sectionResult.valid) issues.push(...sectionResult.issues);
    }
  }
  const metadataResult = validateExecutiveDashboardMetadata(input.metadata ?? {});
  issues.push(...metadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveDashboardContext(
  input: Partial<ExecutiveDashboardContext>
): ExecutiveDashboardValidationResult {
  const issues: ExecutiveDashboardValidationIssue[] = [];
  ensureMandatoryFields(input, EXECUTIVE_DASHBOARD_CONTEXT_MANDATORY_FIELDS, issues, "context");
  if (input.activeSections) {
    for (const sectionType of input.activeSections) {
      if (!isSectionType(sectionType)) issues.push(issue("invalid_section_type", `Invalid section type: ${sectionType}.`));
    }
  }
  const presentationResult = validateExecutiveDashboardPresentationState(input.presentationState ?? {});
  issues.push(...presentationResult.issues);
  const metadataResult = validateExecutiveDashboardMetadata(input.metadata ?? {});
  issues.push(...metadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function collectEipReferenceIds(response: ExecutiveIntelligenceResponse): Readonly<Set<string>> {
  const ids = new Set<string>();
  for (const entry of response.referencedObjects) ids.add(entry.executiveObjectId);
  for (const entry of response.referencedRelationships) ids.add(entry.executiveRelationshipId);
  for (const entry of response.referencedKpis) ids.add(entry.executiveKpiId);
  for (const entry of response.referencedRisks) ids.add(entry.executiveRiskId);
  for (const entry of response.referencedScenarios) ids.add(entry.executiveScenarioId);
  for (const entry of response.referencedOkrs) {
    if (entry.executiveObjectiveId) ids.add(entry.executiveObjectiveId);
    if (entry.executiveKeyResultId) ids.add(entry.executiveKeyResultId);
  }
  return ids;
}

export function validateWidgetReferenceProjection(input: {
  intelligenceResponse: ExecutiveIntelligenceResponse;
  widgets: readonly ExecutiveDashboardWidgetDefinition[];
}): ExecutiveDashboardValidationResult {
  const issues: ExecutiveDashboardValidationIssue[] = [];
  const allowedIds = collectEipReferenceIds(input.intelligenceResponse);
  allowedIds.add(input.intelligenceResponse.responseId);
  allowedIds.add(input.intelligenceResponse.requestId);
  allowedIds.add(input.intelligenceResponse.intelligenceSessionId);

  for (const widget of input.widgets) {
    for (const referenceId of widget.referenceIds) {
      if (widget.contentSource === "executive_summary" || widget.contentSource === "metadata" || widget.contentSource === "timestamps") {
        continue;
      }
      if (referenceId && !allowedIds.has(referenceId)) {
        issues.push(
          issue("unknown_reference_id", `Widget ${widget.widgetId} references unknown id ${referenceId}.`)
        );
      }
    }
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateEipIntelligenceInputCorrelation(input: {
  intelligenceResponse: ExecutiveIntelligenceResponse;
  intelligenceSession: ExecutiveIntelligenceSession;
  intelligenceContext: ExecutiveIntelligenceContext;
}): ExecutiveDashboardValidationResult {
  const issues: ExecutiveDashboardValidationIssue[] = [];
  const responseValidation = validateExecutiveIntelligenceResponse(input.intelligenceResponse);
  const sessionValidation = validateExecutiveIntelligenceSession(input.intelligenceSession);
  const contextValidation = validateExecutiveIntelligenceContext(input.intelligenceContext);
  issues.push(...responseValidation.issues, ...sessionValidation.issues, ...contextValidation.issues);

  if (input.intelligenceResponse.intelligenceSessionId !== input.intelligenceSession.intelligenceSessionId) {
    issues.push(issue("session_mismatch", "EIP response and session intelligenceSessionId must match."));
  }
  if (input.intelligenceContext.intelligenceSessionId !== input.intelligenceSession.intelligenceSessionId) {
    issues.push(issue("context_session_mismatch", "EIP context and session intelligenceSessionId must match."));
  }
  if (input.intelligenceResponse.workspaceId !== input.intelligenceSession.workspaceId) {
    issues.push(issue("workspace_mismatch", "EIP response and session workspaceId must match."));
  }
  if (input.intelligenceResponse.source !== EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE) {
    issues.push(issue("invalid_eip_source", "intelligenceResponse must originate from EIP."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateEdiEipInputBoundary(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("registry_access") &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("ds1_direct_consumption") &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("emg_direct_consumption") &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("object_registry_direct_consumption") &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("okr_registry_direct_consumption") &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("intelligence_orchestration") &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("intelligence_cache");
  return Object.freeze({
    valid,
    evidence: valid ? "EIP-only input boundary locked." : "EIP input boundary incomplete.",
  });
}

export function validateEdiNoRenderingIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("dashboard_rendering") &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("ui_implementation") &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("ai_reasoning") &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("recommendation_generation") &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("kpi_calculations");
  return Object.freeze({
    valid,
    evidence: valid ? "Presentation-only boundary locked." : "Rendering or calculation boundary incomplete.",
  });
}

export function validateEdiPresentationStateIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const sample = defaultPresentationState();
  const valid =
    validateExecutiveDashboardPresentationState(sample).valid &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("registry_caching") &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("intelligence_cache") &&
    EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("business_entity_ownership");
  return Object.freeze({
    valid,
    evidence: valid ? "Presentation state excludes registry and intelligence cache." : "Presentation state integrity incomplete.",
  });
}

function buildWidget(input: {
  widgetId: string;
  widgetType: ExecutiveDashboardWidgetType;
  widgetTitle: string;
  contentSource: ExecutiveDashboardContentSource;
  referenceIds: readonly string[];
  displayHint: string | null;
  tags?: readonly string[];
}): ExecutiveDashboardWidgetDefinition {
  return Object.freeze({
    widgetId: input.widgetId,
    widgetType: input.widgetType,
    widgetTitle: input.widgetTitle,
    contentSource: input.contentSource,
    referenceIds: Object.freeze([...input.referenceIds]),
    displayHint: input.displayHint,
    metadata: cloneMetadata(input.tags ?? ["edi-widget"]),
  });
}

function buildSection(input: {
  sectionId: string;
  sectionType: ExecutiveDashboardSectionType;
  widgets: readonly ExecutiveDashboardWidgetDefinition[];
  tags?: readonly string[];
}): ExecutiveDashboardSectionDefinition {
  return Object.freeze({
    sectionId: input.sectionId,
    sectionType: input.sectionType,
    sectionTitle: SECTION_TITLES[input.sectionType],
    widgets: Object.freeze([...input.widgets]),
    metadata: cloneMetadata(input.tags ?? ["edi-section", input.sectionType]),
  });
}

function composeSectionWidgets(input: {
  sectionType: ExecutiveDashboardSectionType;
  dashboardSessionId: string;
  intelligenceResponse: ExecutiveIntelligenceResponse;
  allowedWidgetTypes: readonly ExecutiveDashboardWidgetType[];
}): readonly ExecutiveDashboardWidgetDefinition[] {
  const { sectionType, dashboardSessionId, intelligenceResponse, allowedWidgetTypes } = input;
  const prefix = `${dashboardSessionId}-${sectionType}`;
  const widgets: ExecutiveDashboardWidgetDefinition[] = [];
  const allows = (type: ExecutiveDashboardWidgetType) => allowedWidgetTypes.includes(type);

  if (sectionType === "executive_summary" && allows("summary_card")) {
    widgets.push(
      buildWidget({
        widgetId: `${prefix}-summary`,
        widgetType: "summary_card",
        widgetTitle: "Executive Summary",
        contentSource: "executive_summary",
        referenceIds: Object.freeze([intelligenceResponse.responseId]),
        displayHint: "headline",
      })
    );
  }

  if (sectionType === "operational_overview") {
    if (allows("reference_list")) {
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-objects`,
          widgetType: "reference_list",
          widgetTitle: "Object References",
          contentSource: "referenced_objects",
          referenceIds: Object.freeze(intelligenceResponse.referencedObjects.map((entry) => entry.executiveObjectId)),
          displayHint: "list",
        })
      );
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-relationships`,
          widgetType: "reference_list",
          widgetTitle: "Relationship References",
          contentSource: "referenced_relationships",
          referenceIds: Object.freeze(
            intelligenceResponse.referencedRelationships.map((entry) => entry.executiveRelationshipId)
          ),
          displayHint: "list",
        })
      );
    }
    if (allows("summary_card")) {
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-overview`,
          widgetType: "summary_card",
          widgetTitle: "Operational Overview",
          contentSource: "executive_summary",
          referenceIds: Object.freeze([intelligenceResponse.responseId]),
          displayHint: "excerpt",
        })
      );
    }
  }

  if (sectionType === "kpi_overview") {
    if (allows("reference_list")) {
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-kpis`,
          widgetType: "reference_list",
          widgetTitle: "KPI References",
          contentSource: "referenced_kpis",
          referenceIds: Object.freeze(intelligenceResponse.referencedKpis.map((entry) => entry.executiveKpiId)),
          displayHint: "list",
        })
      );
    }
    if (allows("metric_card")) {
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-metric`,
          widgetType: "metric_card",
          widgetTitle: "KPI Metric Slot",
          contentSource: "referenced_kpis",
          referenceIds: Object.freeze(intelligenceResponse.referencedKpis.map((entry) => entry.executiveKpiId)),
          displayHint: "declarative-label",
        })
      );
    }
  }

  if (sectionType === "risk_overview") {
    if (allows("reference_list")) {
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-risks`,
          widgetType: "reference_list",
          widgetTitle: "Risk References",
          contentSource: "referenced_risks",
          referenceIds: Object.freeze(intelligenceResponse.referencedRisks.map((entry) => entry.executiveRiskId)),
          displayHint: "list",
        })
      );
    }
    if (allows("metric_card")) {
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-metric`,
          widgetType: "metric_card",
          widgetTitle: "Risk Metric Slot",
          contentSource: "referenced_risks",
          referenceIds: Object.freeze(intelligenceResponse.referencedRisks.map((entry) => entry.executiveRiskId)),
          displayHint: "declarative-label",
        })
      );
    }
  }

  if (sectionType === "scenario_overview") {
    if (allows("reference_list")) {
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-scenarios`,
          widgetType: "reference_list",
          widgetTitle: "Scenario References",
          contentSource: "referenced_scenarios",
          referenceIds: Object.freeze(intelligenceResponse.referencedScenarios.map((entry) => entry.executiveScenarioId)),
          displayHint: "list",
        })
      );
    }
    if (allows("summary_card")) {
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-summary`,
          widgetType: "summary_card",
          widgetTitle: "Scenario Overview",
          contentSource: "executive_summary",
          referenceIds: Object.freeze([intelligenceResponse.responseId]),
          displayHint: "excerpt",
        })
      );
    }
  }

  if (sectionType === "okr_overview") {
    const okrIds = intelligenceResponse.referencedOkrs.flatMap((entry) =>
      [entry.executiveObjectiveId, entry.executiveKeyResultId].filter((id): id is string => Boolean(id))
    );
    if (allows("reference_list")) {
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-okrs`,
          widgetType: "reference_list",
          widgetTitle: "OKR References",
          contentSource: "referenced_okrs",
          referenceIds: Object.freeze(okrIds),
          displayHint: "list",
        })
      );
    }
    if (allows("comparison_card") && okrIds.length >= 2) {
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-comparison`,
          widgetType: "comparison_card",
          widgetTitle: "OKR Comparison",
          contentSource: "referenced_okrs",
          referenceIds: Object.freeze(okrIds.slice(0, 2)),
          displayHint: "side-by-side",
        })
      );
    }
  }

  if (sectionType === "resource_overview" && allows("reference_list")) {
    widgets.push(
      buildWidget({
        widgetId: `${prefix}-resources`,
        widgetType: "reference_list",
        widgetTitle: "Resource References",
        contentSource: "referenced_objects",
        referenceIds: Object.freeze(intelligenceResponse.referencedObjects.map((entry) => entry.executiveObjectId)),
        displayHint: "resource-list",
      })
    );
  }

  if (sectionType === "timeline_overview") {
    if (allows("trend_card")) {
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-trend`,
          widgetType: "trend_card",
          widgetTitle: "Timeline Trend Slot",
          contentSource: "timestamps",
          referenceIds: Object.freeze([intelligenceResponse.createdAt, intelligenceResponse.updatedAt]),
          displayHint: "declarative-trend-label",
        })
      );
    }
    if (allows("summary_card")) {
      widgets.push(
        buildWidget({
          widgetId: `${prefix}-timeline`,
          widgetType: "summary_card",
          widgetTitle: "Timeline Overview",
          contentSource: "metadata",
          referenceIds: Object.freeze([intelligenceResponse.responseId]),
          displayHint: "timeline-excerpt",
        })
      );
    }
  }

  if (sectionType === "custom" && allows("custom")) {
    widgets.push(
      buildWidget({
        widgetId: `${prefix}-custom`,
        widgetType: "custom",
        widgetTitle: "Custom Widget",
        contentSource: "metadata",
        referenceIds: Object.freeze([intelligenceResponse.responseId]),
        displayHint: "custom-slot",
        tags: ["edi-custom-widget"],
      })
    );
  }

  return Object.freeze(widgets);
}

function composeLayoutSummary(sections: readonly ExecutiveDashboardSectionDefinition[]): string {
  const widgetCount = sections.reduce((total, section) => total + section.widgets.length, 0);
  const sectionNames = sections.map((section) => section.sectionType).join(", ");
  return `Dashboard layout with ${sections.length} section(s), ${widgetCount} widget(s): ${sectionNames}.`;
}

export function composeExecutiveDashboardFromIntelligence(
  input: ExecutiveDashboardLayoutInput
): ExecutiveDashboardLayoutResult {
  const dashboardSessionId = input.dashboardSessionId?.trim() || EXAMPLE_DASHBOARD_SESSION_ID;
  const requestId = `${dashboardSessionId}-request`;
  const responseId = `${dashboardSessionId}-response`;
  const contextId = `${dashboardSessionId}-context`;
  const timestamp = nowIso();
  const issues: ExecutiveDashboardValidationIssue[] = [];

  const correlationValidation = validateEipIntelligenceInputCorrelation({
    intelligenceResponse: input.intelligenceResponse,
    intelligenceSession: input.intelligenceSession,
    intelligenceContext: input.intelligenceContext,
  });
  if (!correlationValidation.valid) {
    return Object.freeze({
      success: false,
      session: null,
      request: null,
      response: null,
      context: null,
      issues: correlationValidation.issues,
      dashboardSessionId,
    });
  }

  const requestedSections = Object.freeze(
    input.requestedSections?.length
      ? [...input.requestedSections]
      : [...EXECUTIVE_DASHBOARD_SECTION_TYPES]
  );
  const requestedWidgetTypes = Object.freeze(
    input.requestedWidgetTypes?.length ? [...input.requestedWidgetTypes] : [...EXECUTIVE_DASHBOARD_WIDGET_TYPES]
  );
  const metadata = cloneMetadata(["edi-composed", input.intelligenceSession.requestType]);

  let session: ExecutiveDashboardSession = Object.freeze({
    contractVersion: EXECUTIVE_DASHBOARD_VERSION,
    dashboardSessionId,
    workspaceId: input.intelligenceResponse.workspaceId,
    executiveModelId: input.intelligenceResponse.executiveModelId,
    intelligenceSessionId: input.intelligenceResponse.intelligenceSessionId,
    intelligenceResponseId: input.intelligenceResponse.responseId,
    intelligenceRequestId: input.intelligenceResponse.requestId,
    sectionTypes: requestedSections,
    widgetCount: 0,
    layoutSummary: "",
    metadata,
    lifecycleState: "initialized",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: EXECUTIVE_DASHBOARD_SOURCE,
  });

  recordExecutiveDashboardDiagnosticEvent({
    type: "DashboardSessionCreated",
    dashboardSessionId,
    workspaceId: session.workspaceId,
    requestId,
  });
  recordExecutiveDashboardDiagnostic({
    type: "DashboardSessionCreated",
    dashboardSessionId,
    workspaceId: session.workspaceId,
    requestId,
    message: `Dashboard session ${dashboardSessionId} initialized.`,
  });

  let request: ExecutiveDashboardRequest = Object.freeze({
    contractVersion: EXECUTIVE_DASHBOARD_VERSION,
    requestId,
    dashboardSessionId,
    workspaceId: input.intelligenceResponse.workspaceId,
    executiveModelId: input.intelligenceResponse.executiveModelId,
    intelligenceResponseId: input.intelligenceResponse.responseId,
    requestedSections,
    requestedWidgetTypes,
    metadata,
    lifecycleState: "prepared",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: EXECUTIVE_DASHBOARD_SOURCE,
  });

  recordExecutiveDashboardDiagnosticEvent({
    type: "DashboardRequestAccepted",
    dashboardSessionId,
    workspaceId: session.workspaceId,
    requestId,
  });
  recordExecutiveDashboardDiagnostic({
    type: "DashboardRequestAccepted",
    dashboardSessionId,
    workspaceId: session.workspaceId,
    requestId,
    message: `Dashboard request ${requestId} accepted.`,
  });

  session = Object.freeze({ ...session, lifecycleState: "prepared", updatedAt: nowIso() });

  const context: ExecutiveDashboardContext = Object.freeze({
    contextId,
    dashboardSessionId,
    workspaceId: input.intelligenceResponse.workspaceId,
    executiveModelId: input.intelligenceResponse.executiveModelId,
    intelligenceSessionId: input.intelligenceResponse.intelligenceSessionId,
    intelligenceResponseId: input.intelligenceResponse.responseId,
    activeSections: requestedSections,
    presentationState: defaultPresentationState(),
    metadata,
    createdAt: timestamp,
    updatedAt: timestamp,
    source: EXECUTIVE_DASHBOARD_SOURCE,
  });

  recordExecutiveDashboardDiagnosticEvent({
    type: "DashboardPrepared",
    dashboardSessionId,
    workspaceId: session.workspaceId,
    requestId,
  });
  recordExecutiveDashboardDiagnostic({
    type: "DashboardPrepared",
    dashboardSessionId,
    workspaceId: session.workspaceId,
    requestId,
    message: `Dashboard context ${contextId} prepared.`,
  });

  const sections = Object.freeze(
    requestedSections.map((sectionType) =>
      buildSection({
        sectionId: `${dashboardSessionId}-section-${sectionType}`,
        sectionType,
        widgets: composeSectionWidgets({
          sectionType,
          dashboardSessionId,
          intelligenceResponse: input.intelligenceResponse,
          allowedWidgetTypes: requestedWidgetTypes,
        }),
      })
    )
  );

  for (const section of sections) {
    const sectionValidation = validateExecutiveDashboardSection(section);
    recordExecutiveDashboardDiagnosticEvent({
      type: "SectionValidated",
      dashboardSessionId,
      workspaceId: session.workspaceId,
      requestId,
    });
    recordExecutiveDashboardDiagnostic({
      type: "SectionValidated",
      dashboardSessionId,
      workspaceId: session.workspaceId,
      requestId,
      message: `Section ${section.sectionType} validated=${sectionValidation.valid}.`,
    });
    if (!sectionValidation.valid) issues.push(...sectionValidation.issues);
  }

  const allWidgets = sections.flatMap((section) => section.widgets);
  for (const widget of allWidgets) {
    const widgetValidation = validateExecutiveDashboardWidget(widget);
    recordExecutiveDashboardDiagnosticEvent({
      type: "WidgetValidated",
      dashboardSessionId,
      workspaceId: session.workspaceId,
      requestId,
    });
    recordExecutiveDashboardDiagnostic({
      type: "WidgetValidated",
      dashboardSessionId,
      workspaceId: session.workspaceId,
      requestId,
      message: `Widget ${widget.widgetId} validated=${widgetValidation.valid}.`,
    });
    if (!widgetValidation.valid) issues.push(...widgetValidation.issues);
  }

  const projectionValidation = validateWidgetReferenceProjection({
    intelligenceResponse: input.intelligenceResponse,
    widgets: allWidgets,
  });
  if (!projectionValidation.valid) issues.push(...projectionValidation.issues);

  const layoutSummary = composeLayoutSummary(sections);
  session = Object.freeze({
    ...session,
    widgetCount: allWidgets.length,
    layoutSummary,
    lifecycleState: "validated",
    updatedAt: nowIso(),
  });

  let response: ExecutiveDashboardResponse = Object.freeze({
    contractVersion: EXECUTIVE_DASHBOARD_VERSION,
    responseId,
    requestId,
    dashboardSessionId,
    workspaceId: input.intelligenceResponse.workspaceId,
    executiveModelId: input.intelligenceResponse.executiveModelId,
    intelligenceResponseId: input.intelligenceResponse.responseId,
    sections,
    metadata,
    lifecycleState: "validated",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: EXECUTIVE_DASHBOARD_SOURCE,
  });

  const sessionValidation = validateExecutiveDashboardSession(session);
  const requestValidation = validateExecutiveDashboardRequest(request);
  const responseValidation = validateExecutiveDashboardResponse(response);
  const contextValidation = validateExecutiveDashboardContext(context);
  issues.push(
    ...sessionValidation.issues,
    ...requestValidation.issues,
    ...responseValidation.issues,
    ...contextValidation.issues
  );

  if (issues.length > 0) {
    return Object.freeze({
      success: false,
      session,
      request,
      response: null,
      context,
      issues: Object.freeze(issues),
      dashboardSessionId,
    });
  }

  request = Object.freeze({ ...request, lifecycleState: "validated", updatedAt: nowIso() });
  session = Object.freeze({ ...session, lifecycleState: "available", updatedAt: nowIso() });
  response = Object.freeze({ ...response, lifecycleState: "available", updatedAt: nowIso() });

  recordExecutiveDashboardDiagnosticEvent({
    type: "DashboardResponseReady",
    dashboardSessionId,
    workspaceId: session.workspaceId,
    requestId,
    responseId,
  });
  recordExecutiveDashboardDiagnostic({
    type: "DashboardResponseReady",
    dashboardSessionId,
    workspaceId: session.workspaceId,
    requestId,
    responseId,
    message: `Dashboard response ${responseId} ready.`,
  });

  return Object.freeze({
    success: true,
    session,
    request,
    response,
    context,
    issues: Object.freeze([] as const),
    dashboardSessionId,
  });
}

export function buildExecutiveDashboardOwnershipContract(
  session: ExecutiveDashboardSession
): ExecutiveDashboardOwnershipContract {
  return Object.freeze({
    dashboardSessionId: session.dashboardSessionId,
    workspaceId: session.workspaceId,
    executiveModelId: session.executiveModelId,
    intelligenceSessionId: session.intelligenceSessionId,
    intelligenceResponseId: session.intelligenceResponseId,
    isolationPolicy: "workspace-exclusive",
    upstreamAuthority: "phase-10-executive-intelligence-platform",
    mutationPolicy: "read-only-presentation-snapshot",
  });
}

export function resolveExecutiveDashboardLayoutInputExample(): ExecutiveDashboardLayoutInput {
  return Object.freeze({
    intelligenceResponse: resolveExecutiveIntelligenceResponseExample(),
    intelligenceSession: resolveExecutiveIntelligenceSessionExample(),
    intelligenceContext: resolveExecutiveIntelligenceContextExample(),
    dashboardSessionId: EXAMPLE_DASHBOARD_SESSION_ID,
  });
}

export function resolveExecutiveDashboardLayoutResultExample(): ExecutiveDashboardLayoutResult {
  return composeExecutiveDashboardFromIntelligence(resolveExecutiveDashboardLayoutInputExample());
}

export function resolveExecutiveDashboardSessionExample(): ExecutiveDashboardSession {
  const result = resolveExecutiveDashboardLayoutResultExample();
  if (!result.session) throw new Error("Executive dashboard session example failed to build.");
  return result.session;
}

export function resolveExecutiveDashboardRequestExample(): ExecutiveDashboardRequest {
  const result = resolveExecutiveDashboardLayoutResultExample();
  if (!result.request) throw new Error("Executive dashboard request example failed to build.");
  return result.request;
}

export function resolveExecutiveDashboardResponseExample(): ExecutiveDashboardResponse {
  const result = resolveExecutiveDashboardLayoutResultExample();
  if (!result.response) throw new Error("Executive dashboard response example failed to build.");
  return result.response;
}

export function resolveExecutiveDashboardContextExample(): ExecutiveDashboardContext {
  const result = resolveExecutiveDashboardLayoutResultExample();
  if (!result.context) throw new Error("Executive dashboard context example failed to build.");
  return result.context;
}
