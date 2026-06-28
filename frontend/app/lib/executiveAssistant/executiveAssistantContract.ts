/**
 * PHASE-12 / EAI-1 — Executive Assistant Intelligence contract.
 * Conversational explanation vocabulary — EIP response input only.
 * Stage-2: deterministic explanation composition, read-only and identity-based.
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
  recordExecutiveAssistantDiagnostic,
  recordExecutiveAssistantDiagnosticEvent,
} from "./executiveAssistantDiagnostics.ts";
import type {
  ExecutiveAssistantAnalysisScoreDimensions,
  ExecutiveAssistantContext,
  ExecutiveAssistantConversationState,
  ExecutiveAssistantExplanation,
  ExecutiveAssistantExplanationInput,
  ExecutiveAssistantExplanationResult,
  ExecutiveAssistantLifecycleState,
  ExecutiveAssistantMetadata,
  ExecutiveAssistantOwnershipContract,
  ExecutiveAssistantReferenceKind,
  ExecutiveAssistantRequest,
  ExecutiveAssistantRequestType,
  ExecutiveAssistantResponse,
  ExecutiveAssistantScoreDimensions,
  ExecutiveAssistantSession,
  ExecutiveAssistantValidationIssue,
  ExecutiveAssistantValidationResult,
} from "./executiveAssistantTypes.ts";

export const EXECUTIVE_ASSISTANT_VERSION = "PHASE-12/EAI-1" as const;
export const EXECUTIVE_ASSISTANT_SOURCE = "phase-12-executive-assistant-intelligence" as const;
export const EXECUTIVE_ASSISTANT_LOG_PREFIX = "[NexoraExecutiveAssistant]" as const;
export const EXECUTIVE_ASSISTANT_MINIMUM_OVERALL_SCORE = 99 as const;

export const EXECUTIVE_ASSISTANT_TAGS = Object.freeze([
  "[EAI_EXECUTIVE_ASSISTANT]",
  "[ASSISTANT_INTELLIGENCE_DEFINED]",
  "[WORKSPACE_ASSISTANT_OWNED]",
  "[CONVERSATION_ADAPTER_READY]",
] as const);

export const EXECUTIVE_ASSISTANT_FREEZE_TAGS = Object.freeze([
  "[EAI_1_CERTIFIED]",
  "[EXECUTIVE_ASSISTANT_INTELLIGENCE_FROZEN]",
  "[PHASE12_EAI_COMPLETE]",
] as const);

export const EXECUTIVE_ASSISTANT_REQUEST_TYPES = Object.freeze([
  "explain_summary",
  "explain_object",
  "explain_relationship",
  "explain_kpi",
  "explain_risk",
  "explain_scenario",
  "explain_okr",
  "executive_question",
  "custom",
] as const satisfies readonly ExecutiveAssistantRequestType[]);

export const EXECUTIVE_ASSISTANT_LIFECYCLE_STATES = Object.freeze([
  "initialized",
  "prepared",
  "validated",
  "available",
  "deprecated",
  "archived",
] as const satisfies readonly ExecutiveAssistantLifecycleState[]);

export const EXECUTIVE_ASSISTANT_EXPLANATION_STAGES = Object.freeze([
  "accept",
  "prepare",
  "scope",
  "compose",
  "validate",
  "respond",
] as const);

export const EXECUTIVE_ASSISTANT_SESSION_MANDATORY_FIELDS = Object.freeze([
  "assistantSessionId",
  "workspaceId",
  "executiveModelId",
  "intelligenceSessionId",
  "intelligenceResponseId",
  "intelligenceRequestId",
  "conversationId",
  "requestTypesUsed",
  "explanationCount",
  "sessionSummary",
  "metadata",
  "lifecycleState",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_ASSISTANT_REQUEST_MANDATORY_FIELDS = Object.freeze([
  "requestId",
  "assistantSessionId",
  "workspaceId",
  "executiveModelId",
  "intelligenceResponseId",
  "requestType",
  "targetReferenceId",
  "metadata",
  "lifecycleState",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_ASSISTANT_RESPONSE_MANDATORY_FIELDS = Object.freeze([
  "responseId",
  "requestId",
  "assistantSessionId",
  "workspaceId",
  "executiveModelId",
  "intelligenceResponseId",
  "explanation",
  "conversationMetadata",
  "metadata",
  "lifecycleState",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_ASSISTANT_CONTEXT_MANDATORY_FIELDS = Object.freeze([
  "contextId",
  "assistantSessionId",
  "workspaceId",
  "executiveModelId",
  "intelligenceSessionId",
  "intelligenceResponseId",
  "conversationState",
  "metadata",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_ASSISTANT_MUST_NOT_OWN = Object.freeze([
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
  "llm_inference",
  "llm_runtime",
  "recommendation_engine",
  "recommendation_generation",
  "generated_advice",
  "intelligence_orchestration",
  "intelligence_creation",
  "registry_access",
  "registry_duplication",
  "registry_mutation",
  "registry_embedding",
  "registry_replacement",
  "registry_caching",
  "intelligence_cache",
  "explanation_cache",
  "business_entity_ownership",
  "dashboard_rendering",
  "dashboard_layout_composition",
  "ui_implementation",
  "assistant_runtime",
  "persistence",
  "upload_execution",
  "parsing",
  "synchronization",
  "scene_sync",
  "workspace_mutation",
  "legacy_assistant_modules",
  "legacy_dashboard_modules",
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

export const EXECUTIVE_ASSISTANT_FORBIDDEN_PATTERNS = Object.freeze([
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
  "executiveDashboard/",
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

export const EXECUTIVE_ASSISTANT_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-12/EAI-1",
  title: "Executive Assistant Intelligence",
  goal: "Library-only conversational explanation layer consuming frozen EIP responses.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveAssistant/executiveAssistantTypes.ts",
    "frontend/app/lib/executiveAssistant/executiveAssistantContract.ts",
    "frontend/app/lib/executiveAssistant/executiveAssistantDiagnostics.ts",
    "frontend/app/lib/executiveAssistant/executiveAssistantCertification.ts",
    "frontend/app/lib/executiveAssistant/executiveAssistantCertification.test.ts",
    "docs/executive-assistant-understanding-report.md",
    "docs/executive-assistant-build-report.md",
    "docs/executive-assistant-analysis-report.md",
    "docs/executive-assistant-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_ASSISTANT_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["EIP-1", "STAGE-ARCH-3"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_ASSISTANT_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_ASSISTANT_MODULE_PATHS = Object.freeze(
  EXECUTIVE_ASSISTANT_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

export const EXAMPLE_ASSISTANT_SESSION_ID = "eai-session-example-001";
export const EXAMPLE_CONVERSATION_ID = "eai-conversation-example-001";

function issue(code: string, message: string): ExecutiveAssistantValidationIssue {
  return Object.freeze({ code, message });
}

function nowIso(): string {
  return new Date().toISOString();
}

function isLifecycleState(value: string): value is ExecutiveAssistantLifecycleState {
  return (EXECUTIVE_ASSISTANT_LIFECYCLE_STATES as readonly string[]).includes(value);
}

function isRequestType(value: string): value is ExecutiveAssistantRequestType {
  return (EXECUTIVE_ASSISTANT_REQUEST_TYPES as readonly string[]).includes(value);
}

function cloneMetadata(tags: readonly string[] = []): ExecutiveAssistantMetadata {
  return Object.freeze({
    tags: Object.freeze([...tags]),
    domainHint: null,
    executiveCategoryHint: null,
    conversationHint: null,
    taxonomyOverride: null,
    extension: Object.freeze({
      taxonomyOverride: null,
      futureExtension: Object.freeze({}),
    }),
  });
}

function defaultConversationState(conversationId: string): ExecutiveAssistantConversationState {
  return Object.freeze({
    conversationId,
    selectedTopic: "explain_summary",
    turnMetadata: Object.freeze([] as const),
    historyMetadata: Object.freeze([] as const),
    userPreferences: Object.freeze({}),
    explanationContext: null,
  });
}

function ensureMandatoryFields<T extends object>(
  input: Partial<T>,
  fields: readonly string[],
  issues: ExecutiveAssistantValidationIssue[],
  label: string
): void {
  for (const field of fields) {
    if (!(field in input) || input[field as keyof T] === undefined) {
      issues.push(issue(`missing_${field}`, `${label}.${field} is required.`));
    }
  }
}

export function computeExecutiveAssistantOverallScore(dimensions: ExecutiveAssistantScoreDimensions): number {
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
  eipInputBoundaryIntegrity: 0.13,
  conversationOnlyIntegrity: 0.13,
  explanationIntegrity: 0.12,
  conversationMetadataSafety: 0.12,
  bugTraceability: 0.05,
  certificationReadiness: 0.06,
} as const);

export function computeExecutiveAssistantAnalysisScore(
  dimensions: ExecutiveAssistantAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.eipInputBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.eipInputBoundaryIntegrity +
    dimensions.conversationOnlyIntegrity * ANALYSIS_SCORE_WEIGHTS.conversationOnlyIntegrity +
    dimensions.explanationIntegrity * ANALYSIS_SCORE_WEIGHTS.explanationIntegrity +
    dimensions.conversationMetadataSafety * ANALYSIS_SCORE_WEIGHTS.conversationMetadataSafety +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveAssistantMinimumScore(overall: number): boolean {
  return overall >= EXECUTIVE_ASSISTANT_MINIMUM_OVERALL_SCORE;
}

export function validateExecutiveAssistantMetadata(
  input: Partial<ExecutiveAssistantMetadata>
): ExecutiveAssistantValidationResult {
  const issues: ExecutiveAssistantValidationIssue[] = [];
  if (!input.tags || !Array.isArray(input.tags)) {
    issues.push(issue("missing_tags", "metadata.tags is required."));
  }
  if (!("domainHint" in input)) issues.push(issue("missing_domain_hint", "metadata.domainHint is required."));
  if (!("executiveCategoryHint" in input)) {
    issues.push(issue("missing_executive_category_hint", "metadata.executiveCategoryHint is required."));
  }
  if (!("conversationHint" in input)) {
    issues.push(issue("missing_conversation_hint", "metadata.conversationHint is required."));
  }
  if (!("taxonomyOverride" in input)) {
    issues.push(issue("missing_taxonomy_override", "metadata.taxonomyOverride is required."));
  }
  if (!input.extension || typeof input.extension !== "object") {
    issues.push(issue("missing_extension", "metadata.extension is required."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveAssistantConversationState(
  input: Partial<ExecutiveAssistantConversationState>
): ExecutiveAssistantValidationResult {
  const issues: ExecutiveAssistantValidationIssue[] = [];
  if (!input.conversationId?.trim()) issues.push(issue("missing_conversation_id", "conversationId is required."));
  if (!("selectedTopic" in input)) issues.push(issue("missing_selected_topic", "selectedTopic is required."));
  if (!input.turnMetadata || !Array.isArray(input.turnMetadata)) {
    issues.push(issue("missing_turn_metadata", "turnMetadata is required."));
  }
  if (!input.historyMetadata || !Array.isArray(input.historyMetadata)) {
    issues.push(issue("missing_history_metadata", "historyMetadata is required."));
  }
  if (!input.userPreferences || typeof input.userPreferences !== "object") {
    issues.push(issue("missing_user_preferences", "userPreferences is required."));
  }
  if (!("explanationContext" in input)) {
    issues.push(issue("missing_explanation_context", "explanationContext is required."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveAssistantExplanation(
  input: Partial<ExecutiveAssistantExplanation>
): ExecutiveAssistantValidationResult {
  const issues: ExecutiveAssistantValidationIssue[] = [];
  if (!input.explanationId?.trim()) issues.push(issue("missing_explanation_id", "explanationId is required."));
  if (!input.explanationScope || !isRequestType(input.explanationScope)) {
    issues.push(issue("invalid_explanation_scope", "explanationScope must be a known request type."));
  }
  if (!input.explanationText?.trim()) issues.push(issue("missing_explanation_text", "explanationText is required."));
  if (!input.identityReferences || !Array.isArray(input.identityReferences)) {
    issues.push(issue("missing_identity_references", "identityReferences is required."));
  }
  if (!input.referenceKind) issues.push(issue("missing_reference_kind", "referenceKind is required."));
  if (!("sourceTopic" in input)) issues.push(issue("missing_source_topic", "sourceTopic is required."));
  const metadataResult = validateExecutiveAssistantMetadata(input.explanationMetadata ?? {});
  issues.push(...metadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveAssistantSession(
  input: Partial<ExecutiveAssistantSession>
): ExecutiveAssistantValidationResult {
  const issues: ExecutiveAssistantValidationIssue[] = [];
  ensureMandatoryFields(input, EXECUTIVE_ASSISTANT_SESSION_MANDATORY_FIELDS, issues, "session");
  if (input.contractVersion !== EXECUTIVE_ASSISTANT_VERSION) {
    issues.push(issue("invalid_contract_version", "session contractVersion must match PHASE-12/EAI-1."));
  }
  if (input.lifecycleState && !isLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "session lifecycleState is invalid."));
  }
  if (typeof input.explanationCount !== "number" || input.explanationCount < 0) {
    issues.push(issue("invalid_explanation_count", "explanationCount must be a non-negative number."));
  }
  const metadataResult = validateExecutiveAssistantMetadata(input.metadata ?? {});
  issues.push(...metadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveAssistantRequest(
  input: Partial<ExecutiveAssistantRequest>
): ExecutiveAssistantValidationResult {
  const issues: ExecutiveAssistantValidationIssue[] = [];
  ensureMandatoryFields(input, EXECUTIVE_ASSISTANT_REQUEST_MANDATORY_FIELDS, issues, "request");
  if (input.contractVersion !== EXECUTIVE_ASSISTANT_VERSION) {
    issues.push(issue("invalid_contract_version", "request contractVersion must match PHASE-12/EAI-1."));
  }
  if (input.requestType && !isRequestType(input.requestType)) {
    issues.push(issue("invalid_request_type", "requestType is invalid."));
  }
  if (input.lifecycleState && !isLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "request lifecycleState is invalid."));
  }
  const metadataResult = validateExecutiveAssistantMetadata(input.metadata ?? {});
  issues.push(...metadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveAssistantResponse(
  input: Partial<ExecutiveAssistantResponse>
): ExecutiveAssistantValidationResult {
  const issues: ExecutiveAssistantValidationIssue[] = [];
  ensureMandatoryFields(input, EXECUTIVE_ASSISTANT_RESPONSE_MANDATORY_FIELDS, issues, "response");
  if (input.contractVersion !== EXECUTIVE_ASSISTANT_VERSION) {
    issues.push(issue("invalid_contract_version", "response contractVersion must match PHASE-12/EAI-1."));
  }
  if (input.lifecycleState && !isLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "response lifecycleState is invalid."));
  }
  if (input.explanation) {
    const explanationResult = validateExecutiveAssistantExplanation(input.explanation);
    if (!explanationResult.valid) issues.push(...explanationResult.issues);
  }
  const metadataResult = validateExecutiveAssistantMetadata(input.metadata ?? {});
  const conversationMetadataResult = validateExecutiveAssistantMetadata(input.conversationMetadata ?? {});
  issues.push(...metadataResult.issues, ...conversationMetadataResult.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveAssistantContext(
  input: Partial<ExecutiveAssistantContext>
): ExecutiveAssistantValidationResult {
  const issues: ExecutiveAssistantValidationIssue[] = [];
  ensureMandatoryFields(input, EXECUTIVE_ASSISTANT_CONTEXT_MANDATORY_FIELDS, issues, "context");
  const conversationResult = validateExecutiveAssistantConversationState(input.conversationState ?? {});
  issues.push(...conversationResult.issues);
  const metadataResult = validateExecutiveAssistantMetadata(input.metadata ?? {});
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
  ids.add(response.responseId);
  ids.add(response.requestId);
  ids.add(response.intelligenceSessionId);
  return ids;
}

export function validateExplanationReferenceProjection(input: {
  intelligenceResponse: ExecutiveIntelligenceResponse;
  explanation: ExecutiveAssistantExplanation;
}): ExecutiveAssistantValidationResult {
  const issues: ExecutiveAssistantValidationIssue[] = [];
  const allowedIds = collectEipReferenceIds(input.intelligenceResponse);
  for (const referenceId of input.explanation.identityReferences) {
    if (referenceId && !allowedIds.has(referenceId)) {
      issues.push(issue("unknown_reference_id", `Explanation references unknown id ${referenceId}.`));
    }
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateEipIntelligenceInputCorrelation(input: {
  intelligenceResponse: ExecutiveIntelligenceResponse;
  intelligenceSession: ExecutiveIntelligenceSession;
  intelligenceContext: ExecutiveIntelligenceContext;
}): ExecutiveAssistantValidationResult {
  const issues: ExecutiveAssistantValidationIssue[] = [];
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

export function validateEaiEipInputBoundary(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("registry_access") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("ds1_direct_consumption") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("emg_direct_consumption") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("object_registry_direct_consumption") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("intelligence_orchestration") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("intelligence_creation") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("dashboard_layout_composition");
  return Object.freeze({
    valid,
    evidence: valid ? "EIP-only input boundary locked." : "EIP input boundary incomplete.",
  });
}

export function validateEaiExplanationOnlyIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("ai_reasoning") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("llm_inference") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("llm_runtime") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("recommendation_generation") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("kpi_calculations") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("ui_implementation");
  return Object.freeze({
    valid,
    evidence: valid ? "Explanation-only boundary locked." : "Explanation boundary incomplete.",
  });
}

export function validateEaiConversationStateIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const sample = defaultConversationState(EXAMPLE_CONVERSATION_ID);
  const valid =
    validateExecutiveAssistantConversationState(sample).valid &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("registry_caching") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("intelligence_cache") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("explanation_cache") &&
    EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("business_entity_ownership");
  return Object.freeze({
    valid,
    evidence: valid ? "Conversation state excludes registry and explanation cache." : "Conversation state integrity incomplete.",
  });
}

function resolveReferenceKind(requestType: ExecutiveAssistantRequestType): ExecutiveAssistantReferenceKind {
  switch (requestType) {
    case "explain_summary":
    case "executive_question":
      return "summary";
    case "explain_object":
      return "object";
    case "explain_relationship":
      return "relationship";
    case "explain_kpi":
      return "kpi";
    case "explain_risk":
      return "risk";
    case "explain_scenario":
      return "scenario";
    case "explain_okr":
      return "okr";
    default:
      return "custom";
  }
}

function resolveIdentityReferences(input: {
  requestType: ExecutiveAssistantRequestType;
  intelligenceResponse: ExecutiveIntelligenceResponse;
  targetReferenceId: string | null;
}): readonly string[] {
  const { requestType, intelligenceResponse, targetReferenceId } = input;

  if (targetReferenceId?.trim()) {
    return Object.freeze([targetReferenceId.trim()]);
  }

  switch (requestType) {
    case "explain_summary":
    case "executive_question":
      return Object.freeze([intelligenceResponse.responseId]);
    case "explain_object":
      return Object.freeze(intelligenceResponse.referencedObjects.map((entry) => entry.executiveObjectId));
    case "explain_relationship":
      return Object.freeze(intelligenceResponse.referencedRelationships.map((entry) => entry.executiveRelationshipId));
    case "explain_kpi":
      return Object.freeze(intelligenceResponse.referencedKpis.map((entry) => entry.executiveKpiId));
    case "explain_risk":
      return Object.freeze(intelligenceResponse.referencedRisks.map((entry) => entry.executiveRiskId));
    case "explain_scenario":
      return Object.freeze(intelligenceResponse.referencedScenarios.map((entry) => entry.executiveScenarioId));
    case "explain_okr":
      return Object.freeze(
        intelligenceResponse.referencedOkrs.flatMap((entry) =>
          [entry.executiveObjectiveId, entry.executiveKeyResultId].filter((id): id is string => Boolean(id))
        )
      );
    default:
      return Object.freeze([intelligenceResponse.responseId]);
  }
}

function composeExplanationText(input: {
  requestType: ExecutiveAssistantRequestType;
  intelligenceResponse: ExecutiveIntelligenceResponse;
  identityReferences: readonly string[];
  targetReferenceId: string | null;
}): string {
  const { requestType, intelligenceResponse, identityReferences, targetReferenceId } = input;
  const summary = intelligenceResponse.executiveSummary.trim();

  switch (requestType) {
    case "explain_summary":
      return summary;
    case "explain_object":
      return targetReferenceId
        ? `Executive object reference ${targetReferenceId} is included in the intelligence response scope. ${summary}`
        : `Executive object references (${identityReferences.length}) are included in the intelligence response scope. ${summary}`;
    case "explain_relationship":
      return targetReferenceId
        ? `Executive relationship reference ${targetReferenceId} is included in the intelligence response scope. ${summary}`
        : `Executive relationship references (${identityReferences.length}) are included in the intelligence response scope. ${summary}`;
    case "explain_kpi":
      return targetReferenceId
        ? `KPI identity reference ${targetReferenceId} is included in the intelligence response scope — declarative identity only, no calculated values. ${summary}`
        : `KPI identity references (${identityReferences.length}) are included in the intelligence response scope — declarative identity only. ${summary}`;
    case "explain_risk":
      return targetReferenceId
        ? `Risk identity reference ${targetReferenceId} is included in the intelligence response scope — declarative identity only, no risk scores. ${summary}`
        : `Risk identity references (${identityReferences.length}) are included in the intelligence response scope — declarative identity only. ${summary}`;
    case "explain_scenario":
      return targetReferenceId
        ? `Scenario identity reference ${targetReferenceId} is included in the intelligence response scope — declarative identity only, no simulation. ${summary}`
        : `Scenario identity references (${identityReferences.length}) are included in the intelligence response scope — declarative identity only. ${summary}`;
    case "explain_okr":
      return targetReferenceId
        ? `OKR identity reference ${targetReferenceId} is included in the intelligence response scope — declarative identity only, no progress values. ${summary}`
        : `OKR identity references (${identityReferences.length}) are included in the intelligence response scope — declarative identity only. ${summary}`;
    case "executive_question":
      return `Executive question context derived from intelligence response: ${summary}`;
    default:
      return `Custom explanation scope from intelligence response metadata. ${summary}`;
  }
}

export function composeExecutiveAssistantExplanationFromIntelligence(
  input: ExecutiveAssistantExplanationInput
): ExecutiveAssistantExplanationResult {
  const assistantSessionId = input.assistantSessionId?.trim() || EXAMPLE_ASSISTANT_SESSION_ID;
  const conversationId = input.conversationId?.trim() || EXAMPLE_CONVERSATION_ID;
  const requestId = `${assistantSessionId}-request`;
  const responseId = `${assistantSessionId}-response`;
  const contextId = `${assistantSessionId}-context`;
  const explanationId = `${assistantSessionId}-explanation`;
  const timestamp = nowIso();
  const targetReferenceId = input.targetReferenceId?.trim() || null;

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
      assistantSessionId,
    });
  }

  if (!isRequestType(input.requestType)) {
    return Object.freeze({
      success: false,
      session: null,
      request: null,
      response: null,
      context: null,
      issues: Object.freeze([issue("invalid_request_type", "requestType is invalid.")]),
      assistantSessionId,
    });
  }

  const metadata = cloneMetadata(["eai-composed", input.requestType]);
  const conversationMetadata = cloneMetadata(["eai-conversation", input.requestType]);

  let session: ExecutiveAssistantSession = Object.freeze({
    contractVersion: EXECUTIVE_ASSISTANT_VERSION,
    assistantSessionId,
    workspaceId: input.intelligenceResponse.workspaceId,
    executiveModelId: input.intelligenceResponse.executiveModelId,
    intelligenceSessionId: input.intelligenceResponse.intelligenceSessionId,
    intelligenceResponseId: input.intelligenceResponse.responseId,
    intelligenceRequestId: input.intelligenceResponse.requestId,
    conversationId,
    requestTypesUsed: Object.freeze([input.requestType]),
    explanationCount: 0,
    sessionSummary: "",
    metadata,
    lifecycleState: "initialized",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: EXECUTIVE_ASSISTANT_SOURCE,
  });

  recordExecutiveAssistantDiagnosticEvent({
    type: "AssistantSessionCreated",
    assistantSessionId,
    workspaceId: session.workspaceId,
    requestId,
  });
  recordExecutiveAssistantDiagnostic({
    type: "AssistantSessionCreated",
    assistantSessionId,
    workspaceId: session.workspaceId,
    requestId,
    message: `Assistant session ${assistantSessionId} initialized.`,
  });

  let request: ExecutiveAssistantRequest = Object.freeze({
    contractVersion: EXECUTIVE_ASSISTANT_VERSION,
    requestId,
    assistantSessionId,
    workspaceId: input.intelligenceResponse.workspaceId,
    executiveModelId: input.intelligenceResponse.executiveModelId,
    intelligenceResponseId: input.intelligenceResponse.responseId,
    requestType: input.requestType,
    targetReferenceId,
    metadata,
    lifecycleState: "prepared",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: EXECUTIVE_ASSISTANT_SOURCE,
  });

  recordExecutiveAssistantDiagnosticEvent({
    type: "AssistantRequestAccepted",
    assistantSessionId,
    workspaceId: session.workspaceId,
    requestId,
  });
  recordExecutiveAssistantDiagnostic({
    type: "AssistantRequestAccepted",
    assistantSessionId,
    workspaceId: session.workspaceId,
    requestId,
    message: `Assistant request ${requestId} accepted.`,
  });

  session = Object.freeze({ ...session, lifecycleState: "prepared", updatedAt: nowIso() });

  const conversationState = defaultConversationState(conversationId);
  const context: ExecutiveAssistantContext = Object.freeze({
    contextId,
    assistantSessionId,
    workspaceId: input.intelligenceResponse.workspaceId,
    executiveModelId: input.intelligenceResponse.executiveModelId,
    intelligenceSessionId: input.intelligenceResponse.intelligenceSessionId,
    intelligenceResponseId: input.intelligenceResponse.responseId,
    conversationState: Object.freeze({
      ...conversationState,
      selectedTopic: input.requestType,
      explanationContext: input.requestType,
    }),
    metadata,
    createdAt: timestamp,
    updatedAt: timestamp,
    source: EXECUTIVE_ASSISTANT_SOURCE,
  });

  recordExecutiveAssistantDiagnosticEvent({
    type: "ExplanationPrepared",
    assistantSessionId,
    workspaceId: session.workspaceId,
    requestId,
  });
  recordExecutiveAssistantDiagnostic({
    type: "ExplanationPrepared",
    assistantSessionId,
    workspaceId: session.workspaceId,
    requestId,
    message: `Explanation context ${contextId} prepared.`,
  });

  const identityReferences = resolveIdentityReferences({
    requestType: input.requestType,
    intelligenceResponse: input.intelligenceResponse,
    targetReferenceId,
  });

  const explanationText = composeExplanationText({
    requestType: input.requestType,
    intelligenceResponse: input.intelligenceResponse,
    identityReferences,
    targetReferenceId,
  });

  const explanation: ExecutiveAssistantExplanation = Object.freeze({
    explanationId,
    explanationScope: input.requestType,
    explanationText,
    identityReferences,
    referenceKind: resolveReferenceKind(input.requestType),
    explanationMetadata: cloneMetadata(["eai-explanation", input.requestType]),
    sourceTopic: targetReferenceId ?? input.requestType,
  });

  recordExecutiveAssistantDiagnosticEvent({
    type: "ExplanationValidated",
    assistantSessionId,
    workspaceId: session.workspaceId,
    requestId,
  });
  recordExecutiveAssistantDiagnostic({
    type: "ExplanationValidated",
    assistantSessionId,
    workspaceId: session.workspaceId,
    requestId,
    message: `Explanation ${explanationId} validated=${validateExecutiveAssistantExplanation(explanation).valid}.`,
  });

  const projectionValidation = validateExplanationReferenceProjection({
    intelligenceResponse: input.intelligenceResponse,
    explanation,
  });

  const issues: ExecutiveAssistantValidationIssue[] = [...projectionValidation.issues];
  if (!validateExecutiveAssistantExplanation(explanation).valid) {
    issues.push(...validateExecutiveAssistantExplanation(explanation).issues);
  }

  session = Object.freeze({
    ...session,
    explanationCount: 1,
    sessionSummary: `Explanation composed for ${input.requestType} with ${identityReferences.length} reference(s).`,
    lifecycleState: "validated",
    updatedAt: nowIso(),
  });

  let response: ExecutiveAssistantResponse = Object.freeze({
    contractVersion: EXECUTIVE_ASSISTANT_VERSION,
    responseId,
    requestId,
    assistantSessionId,
    workspaceId: input.intelligenceResponse.workspaceId,
    executiveModelId: input.intelligenceResponse.executiveModelId,
    intelligenceResponseId: input.intelligenceResponse.responseId,
    explanation,
    conversationMetadata,
    metadata,
    lifecycleState: "validated",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: EXECUTIVE_ASSISTANT_SOURCE,
  });

  const sessionValidation = validateExecutiveAssistantSession(session);
  const requestValidation = validateExecutiveAssistantRequest(request);
  const responseValidation = validateExecutiveAssistantResponse(response);
  const contextValidation = validateExecutiveAssistantContext(context);
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
      assistantSessionId,
    });
  }

  request = Object.freeze({ ...request, lifecycleState: "validated", updatedAt: nowIso() });
  session = Object.freeze({ ...session, lifecycleState: "available", updatedAt: nowIso() });
  response = Object.freeze({ ...response, lifecycleState: "available", updatedAt: nowIso() });

  recordExecutiveAssistantDiagnosticEvent({
    type: "AssistantResponseReady",
    assistantSessionId,
    workspaceId: session.workspaceId,
    requestId,
    responseId,
  });
  recordExecutiveAssistantDiagnostic({
    type: "AssistantResponseReady",
    assistantSessionId,
    workspaceId: session.workspaceId,
    requestId,
    responseId,
    message: `Assistant response ${responseId} ready.`,
  });

  recordExecutiveAssistantDiagnosticEvent({
    type: "ConversationUpdated",
    assistantSessionId,
    workspaceId: session.workspaceId,
    requestId,
  });
  recordExecutiveAssistantDiagnostic({
    type: "ConversationUpdated",
    assistantSessionId,
    workspaceId: session.workspaceId,
    requestId,
    message: `Conversation ${conversationId} updated with explanation turn.`,
  });

  return Object.freeze({
    success: true,
    session,
    request,
    response,
    context,
    issues: Object.freeze([] as const),
    assistantSessionId,
  });
}

export function buildExecutiveAssistantOwnershipContract(
  session: ExecutiveAssistantSession
): ExecutiveAssistantOwnershipContract {
  return Object.freeze({
    assistantSessionId: session.assistantSessionId,
    workspaceId: session.workspaceId,
    executiveModelId: session.executiveModelId,
    intelligenceSessionId: session.intelligenceSessionId,
    intelligenceResponseId: session.intelligenceResponseId,
    isolationPolicy: "workspace-exclusive",
    upstreamAuthority: "phase-10-executive-intelligence-platform",
    mutationPolicy: "read-only-explanation-snapshot",
  });
}

export function resolveExecutiveAssistantExplanationInputExample(): ExecutiveAssistantExplanationInput {
  return Object.freeze({
    intelligenceResponse: resolveExecutiveIntelligenceResponseExample(),
    intelligenceSession: resolveExecutiveIntelligenceSessionExample(),
    intelligenceContext: resolveExecutiveIntelligenceContextExample(),
    requestType: "explain_summary",
    assistantSessionId: EXAMPLE_ASSISTANT_SESSION_ID,
    conversationId: EXAMPLE_CONVERSATION_ID,
  });
}

export function resolveExecutiveAssistantExplanationResultExample(): ExecutiveAssistantExplanationResult {
  return composeExecutiveAssistantExplanationFromIntelligence(resolveExecutiveAssistantExplanationInputExample());
}

export function resolveExecutiveAssistantSessionExample(): ExecutiveAssistantSession {
  const result = resolveExecutiveAssistantExplanationResultExample();
  if (!result.session) throw new Error("Executive assistant session example failed to build.");
  return result.session;
}

export function resolveExecutiveAssistantRequestExample(): ExecutiveAssistantRequest {
  const result = resolveExecutiveAssistantExplanationResultExample();
  if (!result.request) throw new Error("Executive assistant request example failed to build.");
  return result.request;
}

export function resolveExecutiveAssistantResponseExample(): ExecutiveAssistantResponse {
  const result = resolveExecutiveAssistantExplanationResultExample();
  if (!result.response) throw new Error("Executive assistant response example failed to build.");
  return result.response;
}

export function resolveExecutiveAssistantContextExample(): ExecutiveAssistantContext {
  const result = resolveExecutiveAssistantExplanationResultExample();
  if (!result.context) throw new Error("Executive assistant context example failed to build.");
  return result.context;
}
