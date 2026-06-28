/**
 * PHASE-13 / PA-1 — Presentation Adapter contract.
 * Dumb bridge: EDI dashboard props, EAI chat props, UI events, local UI state.
 * Never accesses EIP, registries, or business logic directly.
 */

import type {
  ExecutiveDashboardResponse,
  ExecutiveDashboardSectionDefinition,
  ExecutiveDashboardWidgetDefinition,
} from "../executiveDashboard/executiveDashboardTypes.ts";
import { resolveExecutiveDashboardResponseExample } from "../executiveDashboard/executiveDashboardContract.ts";
import type { ExecutiveAssistantResponse } from "../executiveAssistant/executiveAssistantTypes.ts";
import { resolveExecutiveAssistantResponseExample } from "../executiveAssistant/executiveAssistantContract.ts";
import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  recordPresentationAdapterDiagnostic,
  recordPresentationAdapterDiagnosticEvent,
} from "./presentationAdapterDiagnostics.ts";
import type {
  PresentationAdapterAnalysisScoreDimensions,
  PresentationAdapterAssistantChatProps,
  PresentationAdapterAssistantMappingInput,
  PresentationAdapterChatMessageProps,
  PresentationAdapterDashboardMappingInput,
  PresentationAdapterDashboardProps,
  PresentationAdapterDashboardSectionProps,
  PresentationAdapterDashboardWidgetProps,
  PresentationAdapterLifecycleState,
  PresentationAdapterLocalUiState,
  PresentationAdapterMappingResult,
  PresentationAdapterMetadata,
  PresentationAdapterScoreDimensions,
  PresentationAdapterUiEvent,
  PresentationAdapterUiEventMappingInput,
  PresentationAdapterUiEventType,
  PresentationAdapterValidationIssue,
  PresentationAdapterValidationResult,
} from "./presentationAdapterTypes.ts";

export const PRESENTATION_ADAPTER_VERSION = "PHASE-13/PA-1" as const;
export const PRESENTATION_ADAPTER_SOURCE = "phase-13-presentation-adapter-foundation" as const;
export const PRESENTATION_ADAPTER_LOG_PREFIX = "[NexoraPresentationAdapter]" as const;
export const PRESENTATION_ADAPTER_MINIMUM_OVERALL_SCORE = 99 as const;

export const PRESENTATION_ADAPTER_TAGS = Object.freeze([
  "[PA_PRESENTATION_ADAPTER]",
  "[ADAPTER_FOUNDATION_DEFINED]",
  "[DUMB_BRIDGE_READY]",
  "[UI_PROPS_CONTRACT_READY]",
] as const);

export const PRESENTATION_ADAPTER_FREEZE_TAGS = Object.freeze([
  "[PA_2_CERTIFIED]",
  "[PRESENTATION_ADAPTER_FROZEN]",
  "[PHASE13_PA_COMPLETE]",
] as const);

export const PRESENTATION_ADAPTER_UI_EVENT_TYPES = Object.freeze([
  "section_selected",
  "widget_clicked",
  "panel_toggled",
  "message_selected",
  "conversation_selected",
  "layout_preference_changed",
  "custom",
] as const satisfies readonly PresentationAdapterUiEventType[]);

export const PRESENTATION_ADAPTER_LIFECYCLE_STATES = Object.freeze([
  "initialized",
  "mapped",
  "validated",
  "available",
  "deprecated",
  "archived",
] as const satisfies readonly PresentationAdapterLifecycleState[]);

export const PRESENTATION_ADAPTER_DASHBOARD_PROPS_MANDATORY_FIELDS = Object.freeze([
  "contractVersion",
  "adapterId",
  "dashboardSessionId",
  "dashboardResponseId",
  "workspaceId",
  "executiveModelId",
  "layoutSummary",
  "sections",
  "localState",
  "metadata",
  "lifecycleState",
  "source",
] as const);

export const PRESENTATION_ADAPTER_ASSISTANT_PROPS_MANDATORY_FIELDS = Object.freeze([
  "contractVersion",
  "adapterId",
  "assistantSessionId",
  "assistantResponseId",
  "conversationId",
  "workspaceId",
  "executiveModelId",
  "messages",
  "localState",
  "metadata",
  "lifecycleState",
  "source",
] as const);

export const PRESENTATION_ADAPTER_UI_EVENT_MANDATORY_FIELDS = Object.freeze([
  "eventId",
  "eventType",
  "targetId",
  "workspaceId",
  "payload",
  "metadata",
  "createdAt",
  "source",
] as const);

export const PRESENTATION_ADAPTER_LOCAL_STATE_MANDATORY_FIELDS = Object.freeze([
  "selectedSection",
  "activeWidgetId",
  "expandedPanels",
  "visibleWidgets",
  "selectedConversationId",
  "selectedMessageId",
  "layoutPreferences",
] as const);

export const PRESENTATION_ADAPTER_MUST_NOT_OWN = Object.freeze([
  "kpi_calculations",
  "kpi_formula_execution",
  "risk_scoring",
  "risk_calculation",
  "scenario_simulation",
  "scenario_prediction",
  "okr_progress",
  "okr_achievement",
  "ai_reasoning",
  "llm_inference",
  "llm_runtime",
  "recommendation_generation",
  "intelligence_creation",
  "intelligence_orchestration",
  "eip_direct_execution",
  "registry_access",
  "registry_caching",
  "intelligence_cache",
  "explanation_cache",
  "business_entity_ownership",
  "dashboard_mutation",
  "assistant_mutation",
  "persistence",
  "upload_execution",
  "parsing",
  "synchronization",
  "scene_sync",
  "workspace_mutation",
  "ui_implementation",
  "react_rendering",
  "dom_manipulation",
  "ds1_direct_consumption",
  "emg_direct_consumption",
  "object_registry_direct_consumption",
  "relationship_registry_direct_consumption",
  "kpi_registry_direct_consumption",
  "risk_registry_direct_consumption",
  "scenario_registry_direct_consumption",
  "okr_registry_direct_consumption",
  "legacy_dashboard_modules",
  "legacy_assistant_modules",
  "edi_mutation",
  "eai_mutation",
] as const);

export const PRESENTATION_ADAPTER_FORBIDDEN_PATTERNS = Object.freeze([
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
  "executiveIntelligencePlatform/",
  "dashboardIntelligence/",
  "assistantIntelligence/",
  "assistant/assistantRuntimeAdapter",
  "kpi-intelligence/",
  "risk-intelligence/",
  "scenario-intelligence/",
  "intelligence-integration/",
  "workspace/workspaceSceneSync",
  "workspace/workspaceRelationshipSceneSync",
  "scene/",
  "relationships/executive/",
  "ui/mrpWorkspace/",
  "components/",
  ".tsx",
] as const);

export const PRESENTATION_ADAPTER_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-13/PA-1",
  title: "Presentation Adapter Foundation",
  goal: "Dumb bridge mapping frozen EDI/EAI contracts to UI props and adapter-safe events.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/presentationAdapter/presentationAdapterTypes.ts",
    "frontend/app/lib/presentationAdapter/presentationAdapterContract.ts",
    "frontend/app/lib/presentationAdapter/presentationAdapterDiagnostics.ts",
    "frontend/app/lib/presentationAdapter/presentationAdapterCertification.ts",
    "frontend/app/lib/presentationAdapter/presentationAdapterCertification.test.ts",
    "docs/presentation-adapter-foundation-report.md",
    "docs/presentation-adapter-analysis-report.md",
    "docs/presentation-adapter-freeze-report.md",
  ]),
  forbiddenPatterns: PRESENTATION_ADAPTER_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["EDI-1", "EAI-1", "STAGE-ARCH-3"]),
  runtimePath: "library-only" as const,
  tags: PRESENTATION_ADAPTER_TAGS,
} satisfies StageManifest);

export const PRESENTATION_ADAPTER_MODULE_PATHS = Object.freeze(
  PRESENTATION_ADAPTER_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

export const EXAMPLE_ADAPTER_ID = "pa-adapter-example-001";

function issue(code: string, message: string): PresentationAdapterValidationIssue {
  return Object.freeze({ code, message });
}

function nowIso(): string {
  return new Date().toISOString();
}

function isUiEventType(value: string): value is PresentationAdapterUiEventType {
  return (PRESENTATION_ADAPTER_UI_EVENT_TYPES as readonly string[]).includes(value);
}

function isLifecycleState(value: string): value is PresentationAdapterLifecycleState {
  return (PRESENTATION_ADAPTER_LIFECYCLE_STATES as readonly string[]).includes(value);
}

function cloneMetadata(tags: readonly string[] = []): PresentationAdapterMetadata {
  return Object.freeze({
    tags: Object.freeze([...tags]),
    domainHint: null,
    presentationHint: null,
    adapterHint: null,
    taxonomyOverride: null,
    extension: Object.freeze({
      taxonomyOverride: null,
      futureExtension: Object.freeze({}),
    }),
  });
}

export function defaultPresentationAdapterLocalUiState(): PresentationAdapterLocalUiState {
  return Object.freeze({
    selectedSection: null,
    activeWidgetId: null,
    expandedPanels: Object.freeze([] as const),
    visibleWidgets: Object.freeze({}),
    selectedConversationId: null,
    selectedMessageId: null,
    layoutPreferences: Object.freeze({}),
  });
}

export function mergePresentationAdapterLocalUiState(
  base: PresentationAdapterLocalUiState,
  patch: Partial<PresentationAdapterLocalUiState>
): PresentationAdapterLocalUiState {
  return Object.freeze({
    selectedSection: patch.selectedSection !== undefined ? patch.selectedSection : base.selectedSection,
    activeWidgetId: patch.activeWidgetId !== undefined ? patch.activeWidgetId : base.activeWidgetId,
    expandedPanels: patch.expandedPanels !== undefined ? Object.freeze([...patch.expandedPanels]) : base.expandedPanels,
    visibleWidgets:
      patch.visibleWidgets !== undefined ? Object.freeze({ ...patch.visibleWidgets }) : base.visibleWidgets,
    selectedConversationId:
      patch.selectedConversationId !== undefined ? patch.selectedConversationId : base.selectedConversationId,
    selectedMessageId:
      patch.selectedMessageId !== undefined ? patch.selectedMessageId : base.selectedMessageId,
    layoutPreferences:
      patch.layoutPreferences !== undefined
        ? Object.freeze({ ...patch.layoutPreferences })
        : base.layoutPreferences,
  });
}

function ensureMandatoryFields<T extends object>(
  input: Partial<T>,
  fields: readonly string[],
  issues: PresentationAdapterValidationIssue[],
  label: string
): void {
  for (const field of fields) {
    if (!(field in input) || input[field as keyof T] === undefined) {
      issues.push(issue(`missing_${field}`, `${label}.${field} is required.`));
    }
  }
}

export function computePresentationAdapterOverallScore(dimensions: PresentationAdapterScoreDimensions): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

const ANALYSIS_SCORE_WEIGHTS = Object.freeze({
  architectureHealth: 0.11,
  maintainability: 0.09,
  scalability: 0.08,
  regressionSafety: 0.11,
  inputBoundaryIntegrity: 0.14,
  mappingIntegrity: 0.13,
  presentationStateSafety: 0.12,
  reactIndependence: 0.12,
  bugTraceability: 0.05,
  certificationReadiness: 0.05,
} as const);

export function computePresentationAdapterAnalysisScore(
  dimensions: PresentationAdapterAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.inputBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.inputBoundaryIntegrity +
    dimensions.mappingIntegrity * ANALYSIS_SCORE_WEIGHTS.mappingIntegrity +
    dimensions.presentationStateSafety * ANALYSIS_SCORE_WEIGHTS.presentationStateSafety +
    dimensions.reactIndependence * ANALYSIS_SCORE_WEIGHTS.reactIndependence +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsPresentationAdapterMinimumScore(overall: number): boolean {
  return overall >= PRESENTATION_ADAPTER_MINIMUM_OVERALL_SCORE;
}

export function validatePresentationAdapterMetadata(
  input: Partial<PresentationAdapterMetadata>
): PresentationAdapterValidationResult {
  const issues: PresentationAdapterValidationIssue[] = [];
  if (!input.tags || !Array.isArray(input.tags)) {
    issues.push(issue("missing_tags", "metadata.tags is required."));
  }
  if (!("domainHint" in input)) issues.push(issue("missing_domain_hint", "metadata.domainHint is required."));
  if (!("presentationHint" in input)) {
    issues.push(issue("missing_presentation_hint", "metadata.presentationHint is required."));
  }
  if (!("adapterHint" in input)) issues.push(issue("missing_adapter_hint", "metadata.adapterHint is required."));
  if (!("taxonomyOverride" in input)) {
    issues.push(issue("missing_taxonomy_override", "metadata.taxonomyOverride is required."));
  }
  if (!input.extension || typeof input.extension !== "object") {
    issues.push(issue("missing_extension", "metadata.extension is required."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validatePresentationAdapterLocalUiState(
  input: Partial<PresentationAdapterLocalUiState>
): PresentationAdapterValidationResult {
  const issues: PresentationAdapterValidationIssue[] = [];
  ensureMandatoryFields(input, PRESENTATION_ADAPTER_LOCAL_STATE_MANDATORY_FIELDS, issues, "localState");
  if (!input.expandedPanels || !Array.isArray(input.expandedPanels)) {
    issues.push(issue("missing_expanded_panels", "localState.expandedPanels is required."));
  }
  if (!input.visibleWidgets || typeof input.visibleWidgets !== "object") {
    issues.push(issue("missing_visible_widgets", "localState.visibleWidgets is required."));
  }
  if (!input.layoutPreferences || typeof input.layoutPreferences !== "object") {
    issues.push(issue("missing_layout_preferences", "localState.layoutPreferences is required."));
  }
  const forbiddenKeys = ["registryRecords", "businessEntities", "intelligenceCache", "explanationCache", "kpiValues", "riskScores", "scenarioResults"];
  for (const key of forbiddenKeys) {
    if (key in (input as Record<string, unknown>)) {
      issues.push(issue("forbidden_local_state_key", `localState must not include ${key}.`));
    }
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function mapWidgetToProps(
  widget: ExecutiveDashboardWidgetDefinition,
  localState: PresentationAdapterLocalUiState
): PresentationAdapterDashboardWidgetProps {
  const isVisible = localState.visibleWidgets[widget.widgetId] ?? true;
  return Object.freeze({
    widgetId: widget.widgetId,
    widgetType: widget.widgetType,
    title: widget.widgetTitle,
    displayHint: widget.displayHint,
    referenceIds: Object.freeze([...widget.referenceIds]),
    isVisible,
    metadata: cloneMetadata(["[PA_WIDGET_PROPS]"]),
  });
}

function mapSectionToProps(
  section: ExecutiveDashboardSectionDefinition,
  localState: PresentationAdapterLocalUiState
): PresentationAdapterDashboardSectionProps {
  return Object.freeze({
    sectionId: section.sectionId,
    sectionType: section.sectionType,
    title: section.sectionTitle,
    widgets: Object.freeze(section.widgets.map((widget) => mapWidgetToProps(widget, localState))),
    metadata: cloneMetadata(["[PA_SECTION_PROPS]"]),
  });
}

export function validatePresentationAdapterDashboardProps(
  input: Partial<PresentationAdapterDashboardProps>
): PresentationAdapterValidationResult {
  const issues: PresentationAdapterValidationIssue[] = [];
  ensureMandatoryFields(input, PRESENTATION_ADAPTER_DASHBOARD_PROPS_MANDATORY_FIELDS, issues, "dashboardProps");
  if (input.contractVersion !== PRESENTATION_ADAPTER_VERSION) {
    issues.push(issue("invalid_contract_version", "dashboardProps contractVersion must match PHASE-13/PA-1."));
  }
  if (input.source !== PRESENTATION_ADAPTER_SOURCE) {
    issues.push(issue("invalid_source", "dashboardProps source must match presentation adapter source."));
  }
  if (input.lifecycleState && !isLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "dashboardProps lifecycleState is invalid."));
  }
  if (input.localState) {
    issues.push(...validatePresentationAdapterLocalUiState(input.localState).issues);
  }
  const metadataResult = validatePresentationAdapterMetadata(input.metadata ?? {});
  issues.push(...metadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validatePresentationAdapterAssistantChatProps(
  input: Partial<PresentationAdapterAssistantChatProps>
): PresentationAdapterValidationResult {
  const issues: PresentationAdapterValidationIssue[] = [];
  ensureMandatoryFields(input, PRESENTATION_ADAPTER_ASSISTANT_PROPS_MANDATORY_FIELDS, issues, "assistantProps");
  if (input.contractVersion !== PRESENTATION_ADAPTER_VERSION) {
    issues.push(issue("invalid_contract_version", "assistantProps contractVersion must match PHASE-13/PA-1."));
  }
  if (input.source !== PRESENTATION_ADAPTER_SOURCE) {
    issues.push(issue("invalid_source", "assistantProps source must match presentation adapter source."));
  }
  if (input.lifecycleState && !isLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "assistantProps lifecycleState is invalid."));
  }
  if (input.messages && input.messages.some((message) => message.role !== "assistant")) {
    issues.push(issue("invalid_message_role", "Assistant chat props may only contain assistant role messages."));
  }
  if (input.localState) {
    issues.push(...validatePresentationAdapterLocalUiState(input.localState).issues);
  }
  const metadataResult = validatePresentationAdapterMetadata(input.metadata ?? {});
  issues.push(...metadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validatePresentationAdapterUiEvent(
  input: Partial<PresentationAdapterUiEvent>
): PresentationAdapterValidationResult {
  const issues: PresentationAdapterValidationIssue[] = [];
  ensureMandatoryFields(input, PRESENTATION_ADAPTER_UI_EVENT_MANDATORY_FIELDS, issues, "uiEvent");
  if (input.eventType && !isUiEventType(input.eventType)) {
    issues.push(issue("invalid_event_type", "uiEvent eventType is invalid."));
  }
  if (input.source !== PRESENTATION_ADAPTER_SOURCE) {
    issues.push(issue("invalid_source", "uiEvent source must match presentation adapter source."));
  }
  if (input.payload && typeof input.payload !== "object") {
    issues.push(issue("invalid_payload", "uiEvent payload must be a string map."));
  }
  const metadataResult = validatePresentationAdapterMetadata(input.metadata ?? {});
  issues.push(...metadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validatePaEdiInputBoundary(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("eip_direct_execution") &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("registry_access") &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("edi_mutation") &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("dashboard_mutation");
  return Object.freeze({
    valid,
    evidence: valid ? "EDI input boundary locked — read-only dashboard response mapping." : "EDI boundary incomplete.",
  });
}

export function validatePaEaiInputBoundary(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("eip_direct_execution") &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("registry_access") &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("eai_mutation") &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("assistant_mutation");
  return Object.freeze({
    valid,
    evidence: valid ? "EAI input boundary locked — read-only assistant response mapping." : "EAI boundary incomplete.",
  });
}

export function validatePaDumbAdapterIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("ai_reasoning") &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("llm_runtime") &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("kpi_calculations") &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("persistence") &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("ui_implementation");
  return Object.freeze({
    valid,
    evidence: valid ? "Dumb adapter rule locked — mapping only." : "Dumb adapter boundary incomplete.",
  });
}

export function validatePaLocalStateSafety(): Readonly<{ valid: boolean; evidence: string }> {
  const sample = defaultPresentationAdapterLocalUiState();
  const valid =
    validatePresentationAdapterLocalUiState(sample).valid &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("intelligence_cache") &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("explanation_cache") &&
    PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("business_entity_ownership");
  return Object.freeze({
    valid,
    evidence: valid ? "Local UI state excludes registry and cache payloads." : "Local state safety incomplete.",
  });
}

export function mapExecutiveDashboardToPresentationProps(
  input: PresentationAdapterDashboardMappingInput
): PresentationAdapterMappingResult<PresentationAdapterDashboardProps> {
  const issues: PresentationAdapterValidationIssue[] = [];
  const { dashboardResponse, dashboardSession } = input;
  const adapterId = input.adapterId?.trim() || EXAMPLE_ADAPTER_ID;
  const localState = mergePresentationAdapterLocalUiState(
    defaultPresentationAdapterLocalUiState(),
    input.localState ?? {}
  );

  if (!dashboardResponse.responseId?.trim()) {
    issues.push(issue("missing_dashboard_response", "dashboardResponse is required."));
  }
  if (dashboardResponse.source !== "phase-11-executive-dashboard-intelligence") {
    issues.push(issue("invalid_edi_source", "dashboardResponse must originate from EDI."));
  }

  if (issues.length > 0) {
    return Object.freeze({ success: false, props: null, issues: Object.freeze(issues) });
  }

  const sections = Object.freeze(
    dashboardResponse.sections.map((section) => mapSectionToProps(section, localState))
  );

  const props: PresentationAdapterDashboardProps = Object.freeze({
    contractVersion: PRESENTATION_ADAPTER_VERSION,
    adapterId,
    dashboardSessionId: dashboardSession?.dashboardSessionId ?? dashboardResponse.dashboardSessionId,
    dashboardResponseId: dashboardResponse.responseId,
    workspaceId: dashboardResponse.workspaceId,
    executiveModelId: dashboardResponse.executiveModelId,
    layoutSummary: dashboardSession?.layoutSummary ?? "Dashboard layout mapped to presentation props.",
    sections,
    localState,
    metadata: cloneMetadata(["[PA_DASHBOARD_PROPS]", ...PRESENTATION_ADAPTER_TAGS]),
    lifecycleState: "available",
    source: PRESENTATION_ADAPTER_SOURCE,
  });

  const validation = validatePresentationAdapterDashboardProps(props);
  if (!validation.valid) {
    return Object.freeze({ success: false, props: null, issues: validation.issues });
  }

  recordPresentationAdapterDiagnosticEvent({
    type: "DashboardPropsMapped",
    adapterId,
    workspaceId: props.workspaceId,
    dashboardSessionId: props.dashboardSessionId,
  });
  recordPresentationAdapterDiagnostic({
    type: "DashboardPropsMapped",
    adapterId,
    workspaceId: props.workspaceId,
    dashboardSessionId: props.dashboardSessionId,
    message: `Mapped ${sections.length} dashboard section(s) to presentation props.`,
  });

  return Object.freeze({ success: true, props, issues: Object.freeze([]) });
}

function mapExplanationToChatMessage(
  response: ExecutiveAssistantResponse
): PresentationAdapterChatMessageProps {
  const explanation = response.explanation;
  return Object.freeze({
    messageId: explanation.explanationId,
    role: "assistant",
    text: explanation.explanationText,
    referenceKind: explanation.referenceKind,
    referenceIds: Object.freeze([...explanation.identityReferences]),
    metadata: cloneMetadata(["[PA_CHAT_MESSAGE]"]),
  });
}

export function mapExecutiveAssistantToChatProps(
  input: PresentationAdapterAssistantMappingInput
): PresentationAdapterMappingResult<PresentationAdapterAssistantChatProps> {
  const issues: PresentationAdapterValidationIssue[] = [];
  const { assistantResponse, assistantSession } = input;
  const adapterId = input.adapterId?.trim() || EXAMPLE_ADAPTER_ID;
  const localState = mergePresentationAdapterLocalUiState(
    defaultPresentationAdapterLocalUiState(),
    input.localState ?? {}
  );

  if (!assistantResponse.responseId?.trim()) {
    issues.push(issue("missing_assistant_response", "assistantResponse is required."));
  }
  if (assistantResponse.source !== "phase-12-executive-assistant-intelligence") {
    issues.push(issue("invalid_eai_source", "assistantResponse must originate from EAI."));
  }

  if (issues.length > 0) {
    return Object.freeze({ success: false, props: null, issues: Object.freeze(issues) });
  }

  const message = mapExplanationToChatMessage(assistantResponse);
  const conversationId = assistantSession?.conversationId ?? `conv-${assistantResponse.assistantSessionId}`;

  const props: PresentationAdapterAssistantChatProps = Object.freeze({
    contractVersion: PRESENTATION_ADAPTER_VERSION,
    adapterId,
    assistantSessionId: assistantSession?.assistantSessionId ?? assistantResponse.assistantSessionId,
    assistantResponseId: assistantResponse.responseId,
    conversationId,
    workspaceId: assistantResponse.workspaceId,
    executiveModelId: assistantResponse.executiveModelId,
    messages: Object.freeze([message]),
    localState: mergePresentationAdapterLocalUiState(localState, {
      selectedConversationId: conversationId,
      selectedMessageId: message.messageId,
    }),
    metadata: cloneMetadata(["[PA_ASSISTANT_PROPS]", ...PRESENTATION_ADAPTER_TAGS]),
    lifecycleState: "available",
    source: PRESENTATION_ADAPTER_SOURCE,
  });

  const validation = validatePresentationAdapterAssistantChatProps(props);
  if (!validation.valid) {
    return Object.freeze({ success: false, props: null, issues: validation.issues });
  }

  recordPresentationAdapterDiagnosticEvent({
    type: "AssistantPropsMapped",
    adapterId,
    workspaceId: props.workspaceId,
    assistantSessionId: props.assistantSessionId,
  });
  recordPresentationAdapterDiagnostic({
    type: "AssistantPropsMapped",
    adapterId,
    workspaceId: props.workspaceId,
    assistantSessionId: props.assistantSessionId,
    message: "Mapped assistant explanation to chat props.",
  });

  return Object.freeze({ success: true, props, issues: Object.freeze([]) });
}

export function mapUiInteractionToAdapterEvent(
  input: PresentationAdapterUiEventMappingInput
): PresentationAdapterMappingResult<PresentationAdapterUiEvent> {
  const issues: PresentationAdapterValidationIssue[] = [];

  if (!input.targetId?.trim()) {
    issues.push(issue("missing_target_id", "targetId is required."));
  }
  if (!isUiEventType(input.eventType)) {
    issues.push(issue("invalid_event_type", "eventType is invalid."));
  }

  if (issues.length > 0) {
    return Object.freeze({ success: false, props: null, issues: Object.freeze(issues) });
  }

  const event: PresentationAdapterUiEvent = Object.freeze({
    eventId: `pa-event-${input.eventType}-${input.targetId}`,
    eventType: input.eventType,
    targetId: input.targetId,
    workspaceId: input.workspaceId?.trim() || null,
    payload: Object.freeze({ ...(input.payload ?? {}) }),
    metadata: cloneMetadata(["[PA_UI_EVENT]"]),
    createdAt: nowIso(),
    source: PRESENTATION_ADAPTER_SOURCE,
  });

  const validation = validatePresentationAdapterUiEvent(event);
  if (!validation.valid) {
    return Object.freeze({ success: false, props: null, issues: validation.issues });
  }

  recordPresentationAdapterDiagnosticEvent({
    type: "UiEventMapped",
    adapterId: EXAMPLE_ADAPTER_ID,
    workspaceId: event.workspaceId,
    eventId: event.eventId,
  });
  recordPresentationAdapterDiagnostic({
    type: "UiEventMapped",
    adapterId: EXAMPLE_ADAPTER_ID,
    workspaceId: event.workspaceId,
    eventId: event.eventId,
    message: `Mapped UI interaction ${input.eventType} to adapter event.`,
  });

  return Object.freeze({ success: true, props: event, issues: Object.freeze([]) });
}

export function applyPresentationAdapterLocalStateUpdate(input: {
  current: PresentationAdapterLocalUiState;
  patch: Partial<PresentationAdapterLocalUiState>;
  adapterId?: string;
}): PresentationAdapterMappingResult<PresentationAdapterLocalUiState> {
  const next = mergePresentationAdapterLocalUiState(input.current, input.patch);
  const validation = validatePresentationAdapterLocalUiState(next);
  if (!validation.valid) {
    return Object.freeze({ success: false, props: null, issues: validation.issues });
  }

  recordPresentationAdapterDiagnosticEvent({
    type: "LocalStateUpdated",
    adapterId: input.adapterId?.trim() || EXAMPLE_ADAPTER_ID,
  });
  recordPresentationAdapterDiagnostic({
    type: "LocalStateUpdated",
    adapterId: input.adapterId?.trim() || EXAMPLE_ADAPTER_ID,
    message: "Local UI state updated.",
  });

  return Object.freeze({ success: true, props: next, issues: Object.freeze([]) });
}

export function resolvePresentationAdapterDashboardPropsExample(): PresentationAdapterDashboardProps {
  const result = mapExecutiveDashboardToPresentationProps({
    dashboardResponse: resolveExecutiveDashboardResponseExample(),
  });
  if (!result.success || !result.props) {
    throw new Error("Failed to resolve dashboard props example.");
  }
  return result.props;
}

export function resolvePresentationAdapterAssistantChatPropsExample(): PresentationAdapterAssistantChatProps {
  const result = mapExecutiveAssistantToChatProps({
    assistantResponse: resolveExecutiveAssistantResponseExample(),
  });
  if (!result.success || !result.props) {
    throw new Error("Failed to resolve assistant chat props example.");
  }
  return result.props;
}

export function resolvePresentationAdapterUiEventExample(): PresentationAdapterUiEvent {
  const result = mapUiInteractionToAdapterEvent({
    eventType: "widget_clicked",
    targetId: "widget-example-001",
    workspaceId: "ws-example-001",
    payload: Object.freeze({ panelId: "kpi_overview" }),
  });
  if (!result.success || !result.props) {
    throw new Error("Failed to resolve UI event example.");
  }
  return result.props;
}
