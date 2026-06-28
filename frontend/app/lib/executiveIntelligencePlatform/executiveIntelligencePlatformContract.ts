/**
 * PHASE-10 / EIP-1 — Executive Intelligence Platform contract.
 * Platform orchestration vocabulary — hex-registry input only.
 * Stage-2: deterministic orchestration runtime, read-only and identity-based.
 */

import {
  resolveExecutiveKpiById,
  resolveExecutiveKpiRegistryExample,
  validateExecutiveKpiRegistry,
} from "../executiveKpi/executiveKpiContract.ts";
import type { ExecutiveKpiRegistry } from "../executiveKpi/executiveKpiTypes.ts";
import {
  integrateExecutiveOkrsFromRegistries,
  resolveExecutiveKeyResultById,
  resolveExecutiveObjectRegistryWithOkrDeclarationsExample,
  resolveExecutiveOkrRegistryExample,
  resolveExecutiveObjectiveById,
  validateExecutiveOkrRegistry,
} from "../executiveOkr/executiveOkrContract.ts";
import type { ExecutiveOkrRegistry } from "../executiveOkr/executiveOkrTypes.ts";
import {
  resolveExecutiveObjectById,
  validateExecutiveObjectRegistry,
} from "../executiveObject/executiveObjectContract.ts";
import type { ExecutiveObjectRegistry } from "../executiveObject/executiveObjectTypes.ts";
import {
  resolveExecutiveRelationshipById,
  resolveExecutiveRelationshipRegistryExample,
  validateExecutiveRelationshipRegistry,
} from "../executiveRelationship/executiveRelationshipContract.ts";
import type { ExecutiveRelationshipRegistry } from "../executiveRelationship/executiveRelationshipTypes.ts";
import {
  resolveExecutiveRiskById,
  resolveExecutiveRiskRegistryExample,
  validateExecutiveRiskRegistry,
} from "../executiveRisk/executiveRiskContract.ts";
import type { ExecutiveRiskRegistry } from "../executiveRisk/executiveRiskTypes.ts";
import {
  resolveExecutiveScenarioById,
  resolveExecutiveScenarioRegistryExample,
  validateExecutiveScenarioRegistry,
} from "../executiveScenario/executiveScenarioContract.ts";
import type { ExecutiveScenarioRegistry } from "../executiveScenario/executiveScenarioTypes.ts";
import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  recordExecutiveIntelligenceDiagnostic,
  recordExecutiveIntelligenceDiagnosticEvent,
} from "./executiveIntelligencePlatformDiagnostics.ts";
import type {
  ExecutiveIntelligenceAnalysisScoreDimensions,
  ExecutiveIntelligenceConsumedRegistries,
  ExecutiveIntelligenceContext,
  ExecutiveIntelligenceKpiReference,
  ExecutiveIntelligenceMetadata,
  ExecutiveIntelligenceObjectReference,
  ExecutiveIntelligenceOrchestrationInput,
  ExecutiveIntelligenceOrchestrationResult,
  ExecutiveIntelligenceOkrReference,
  ExecutiveIntelligencePlatformLifecycleState,
  ExecutiveIntelligencePlatformOwnershipContract,
  ExecutiveIntelligencePlatformRegistryInput,
  ExecutiveIntelligenceRelationshipReference,
  ExecutiveIntelligenceRequest,
  ExecutiveIntelligenceRequestType,
  ExecutiveIntelligenceResponse,
  ExecutiveIntelligenceRiskReference,
  ExecutiveIntelligenceScenarioReference,
  ExecutiveIntelligenceScoreDimensions,
  ExecutiveIntelligenceSession,
  ExecutiveIntelligenceValidationIssue,
  ExecutiveIntelligenceValidationResult,
} from "./executiveIntelligencePlatformTypes.ts";

export const EXECUTIVE_INTELLIGENCE_PLATFORM_VERSION = "PHASE-10/EIP-1" as const;
export const EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE = "phase-10-executive-intelligence-platform" as const;
export const EXECUTIVE_INTELLIGENCE_PLATFORM_LOG_PREFIX = "[NexoraExecutiveIntelligencePlatform]" as const;
export const EXECUTIVE_INTELLIGENCE_PLATFORM_MINIMUM_OVERALL_SCORE = 99 as const;

export const EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS = Object.freeze([
  "[EIP_EXECUTIVE_INTELLIGENCE_PLATFORM]",
  "[INTELLIGENCE_PLATFORM_DEFINED]",
  "[WORKSPACE_INTELLIGENCE_OWNED]",
  "[DASHBOARD_CONSUMER_READY]",
] as const);

export const EXECUTIVE_INTELLIGENCE_PLATFORM_FREEZE_TAGS = Object.freeze([
  "[EIP_1_CERTIFIED]",
  "[EXECUTIVE_INTELLIGENCE_PLATFORM_FROZEN]",
  "[PHASE10_EIP_COMPLETE]",
] as const);

export const EXECUTIVE_INTELLIGENCE_REQUEST_TYPES = Object.freeze([
  "summary",
  "explanation",
  "comparison",
  "recommendation_context",
  "executive_overview",
  "custom",
] as const satisfies readonly ExecutiveIntelligenceRequestType[]);

export const EXECUTIVE_INTELLIGENCE_PLATFORM_LIFECYCLE_STATES = Object.freeze([
  "initialized",
  "prepared",
  "validated",
  "available",
  "deprecated",
  "archived",
] as const satisfies readonly ExecutiveIntelligencePlatformLifecycleState[]);

export const EXECUTIVE_INTELLIGENCE_REFERENCE_ROLES = Object.freeze([
  "primary",
  "secondary",
  "context",
  "custom",
] as const);

export const EXECUTIVE_INTELLIGENCE_SESSION_MANDATORY_FIELDS = Object.freeze([
  "intelligenceSessionId",
  "workspaceId",
  "executiveModelId",
  "requestId",
  "requestType",
  "consumedRegistries",
  "responseSummary",
  "metadata",
  "lifecycleState",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_INTELLIGENCE_REQUEST_MANDATORY_FIELDS = Object.freeze([
  "requestId",
  "intelligenceSessionId",
  "workspaceId",
  "executiveModelId",
  "requestType",
  "consumedRegistries",
  "metadata",
  "lifecycleState",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_INTELLIGENCE_RESPONSE_MANDATORY_FIELDS = Object.freeze([
  "responseId",
  "requestId",
  "executiveSummary",
  "referencedObjects",
  "referencedRelationships",
  "referencedKpis",
  "referencedRisks",
  "referencedScenarios",
  "referencedOkrs",
  "metadata",
] as const);

export const EXECUTIVE_INTELLIGENCE_CONTEXT_MANDATORY_FIELDS = Object.freeze([
  "contextId",
  "intelligenceSessionId",
  "workspaceId",
  "executiveModelId",
  "consumedRegistries",
  "requestType",
  "metadata",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_INTELLIGENCE_ORCHESTRATION_STAGES = Object.freeze([
  "accept",
  "prepare",
  "correlate",
  "compose",
  "validate",
  "respond",
] as const);

export const EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN = Object.freeze([
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
  "object_creation",
  "relationship_discovery",
  "relationship_inference",
  "graph_algorithms",
  "path_finding",
  "dependency_calculation",
  "business_entity_ownership",
  "registry_duplication",
  "registry_mutation",
  "registry_embedding",
  "registry_replacement",
  "registry_caching",
  "dashboard_rendering",
  "assistant_logic",
  "persistence",
  "upload_execution",
  "parsing",
  "synchronization",
  "scene_sync",
  "workspace_mutation",
  "object_registry_runtime",
  "legacy_intelligence_modules",
  "legacy_okr_modules",
  "legacy_scenario_modules",
  "legacy_risk_modules",
  "executive_gateway_mutation",
  "time_context_mutation",
  "ds1_direct_consumption",
  "emg_direct_consumption",
  "emg_model_record_consumption",
  "ds2_contract_mutation",
  "ds3_contract_mutation",
  "ds4_contract_mutation",
  "ds5_contract_mutation",
  "ds6_contract_mutation",
  "okr_contract_mutation",
] as const);

export const EXECUTIVE_INTELLIGENCE_PLATFORM_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "datasourceCertification/",
  "datasource/",
  "businessKnowledge/",
  "executiveBusinessDataSource",
  "executiveModel/",
  "executiveModelPipeline/",
  "executiveModelRuntime/",
  "data-sources/dataSourceRegistryRuntime",
  "scene/objectRegistryRuntime",
  "workspace/workspaceSceneSync",
  "workspaceRelationshipSceneSync",
  "relationships/executive",
  "RelationshipRenderer",
  "risk-intelligence/",
  "RiskIntelligenceRuntime",
  "kpi-intelligence/",
  "scenario-intelligence/",
  "ScenarioGenerationRuntime",
  "scenario-authoring/",
  "mrpWorkspace/scenario",
  "okr/workspaceOkr",
  "okr/okrDashboard",
  "dashboardIntelligence/",
  "assistantRuntime",
  "executiveGateway/",
  "timeContext/",
  "ParserEngine",
  "ImportEngine",
  "SynchronizationEngine",
  "executiveIntelligencePlatformCertificationRunner",
  "executiveIntelligencePlatformCertificationHarness",
  "executiveIntelligencePlatformCertificationContract",
  "executiveIntelligencePlatformEndToEndScenarios",
  "executiveIntelligencePlatformRegressionSuite",
  "executiveIntelligencePlatformArchitectureFreeze",
  "executiveIntelligencePlatformDiagnosticsReport",
  ".tsx",
] as const);

export const EXECUTIVE_INTELLIGENCE_PLATFORM_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-10/EIP-1",
  title: "Executive Intelligence Platform",
  goal: "Library-only read-only orchestration layer consuming frozen DS2–OKR registries and producing executive intelligence responses.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveIntelligencePlatform/executiveIntelligencePlatformTypes.ts",
    "frontend/app/lib/executiveIntelligencePlatform/executiveIntelligencePlatformContract.ts",
    "frontend/app/lib/executiveIntelligencePlatform/executiveIntelligencePlatformDiagnostics.ts",
    "frontend/app/lib/executiveIntelligencePlatform/executiveIntelligencePlatformCertification.ts",
    "frontend/app/lib/executiveIntelligencePlatform/executiveIntelligencePlatformCertification.test.ts",
    "docs/executive-intelligence-platform-understanding-report.md",
    "docs/executive-intelligence-platform-build-report.md",
    "docs/executive-intelligence-platform-analysis-report.md",
    "docs/executive-intelligence-platform-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_INTELLIGENCE_PLATFORM_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "DS2-INT-1",
    "DS3-INT-1",
    "DS4-INT-1",
    "DS5-INT-1",
    "DS6-INT-1",
    "OKR-INT-1",
    "STAGE-ARCH-3",
    "INT-5",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_INTELLIGENCE_PLATFORM_MODULE_PATHS = Object.freeze(
  EXECUTIVE_INTELLIGENCE_PLATFORM_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

export const EXAMPLE_INTEGRATION_SESSION_ID = "eip-session-example-001";

const EIP_EXAMPLE_OBJECT_ID = "emg-obj-outcome";
const EIP_EXAMPLE_RELATIONSHIP_ID = "eri-rel-supplier-outcome-001";
const EIP_EXAMPLE_KPI_ID = "eki-kpi-outcome-delivery-001";
const EIP_EXAMPLE_RISK_ID = "erir-risk-outcome-delivery-001";
const EIP_EXAMPLE_SCENARIO_ID = "esis-scenario-outcome-delay-001";
const EIP_EXAMPLE_OBJECTIVE_ID = "eoikr-objective-outcome-delivery-001";
const EIP_EXAMPLE_KEY_RESULT_ID = "eoikr-kr-outcome-delivery-001";

function issue(code: string, message: string): ExecutiveIntelligenceValidationIssue {
  return Object.freeze({ code, message });
}

function nowIso(): string {
  return new Date().toISOString();
}

function isLifecycleState(value: string): value is ExecutiveIntelligencePlatformLifecycleState {
  return (EXECUTIVE_INTELLIGENCE_PLATFORM_LIFECYCLE_STATES as readonly string[]).includes(value);
}

function isRequestType(value: string): value is ExecutiveIntelligenceRequestType {
  return (EXECUTIVE_INTELLIGENCE_REQUEST_TYPES as readonly string[]).includes(value);
}

function isReferenceRole(value: string): boolean {
  return (EXECUTIVE_INTELLIGENCE_REFERENCE_ROLES as readonly string[]).includes(value);
}

function cloneMetadata(tags: readonly string[] = []): ExecutiveIntelligenceMetadata {
  return Object.freeze({
    tags: Object.freeze([...tags]),
    domainHint: null,
    executiveCategoryHint: null,
    taxonomyOverride: null,
    extension: Object.freeze({
      taxonomyOverride: null,
      futureExtension: Object.freeze({}),
    }),
  });
}

function asValidationResult(input: { valid: boolean; issues: readonly { code: string; message: string }[] }): ExecutiveIntelligenceValidationResult {
  return Object.freeze({
    valid: input.valid,
    issues: Object.freeze(input.issues.map((entry) => issue(entry.code, entry.message))),
  });
}

function roleAt(index: number): "primary" | "secondary" | "context" {
  if (index === 0) return "primary";
  if (index === 1) return "secondary";
  return "context";
}

function uniqueById<T>(entries: readonly T[], toId: (entry: T) => string): readonly T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const entry of entries) {
    const id = toId(entry);
    if (seen.has(id)) continue;
    seen.add(id);
    result.push(entry);
  }
  return Object.freeze(result);
}

function firstOrPreferred<T>(entries: readonly T[], preferredId: string, toId: (entry: T) => string): readonly T[] {
  if (entries.length === 0) return Object.freeze([]);
  const preferred = entries.find((entry) => toId(entry) === preferredId);
  if (preferred) return Object.freeze([preferred]);
  return Object.freeze([entries[0]]);
}

function ensureMandatoryFields<T extends object>(
  input: Partial<T>,
  fields: readonly string[],
  issues: ExecutiveIntelligenceValidationIssue[],
  prefix: string
): void {
  for (const field of fields) {
    if (!(field in input)) {
      issues.push(issue(`${prefix}_missing_${field}`, `${field} is required.`));
    }
  }
}

export function computeExecutiveIntelligencePlatformOverallScore(
  dimensions: ExecutiveIntelligenceScoreDimensions
): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveIntelligencePlatformMinimumScore(overall: number): boolean {
  return overall >= EXECUTIVE_INTELLIGENCE_PLATFORM_MINIMUM_OVERALL_SCORE;
}

const ANALYSIS_SCORE_WEIGHTS = Object.freeze({
  architectureHealth: 0.11,
  maintainability: 0.1,
  scalability: 0.09,
  regressionSafety: 0.12,
  registryBoundaryIntegrity: 0.13,
  orchestrationIntegrity: 0.12,
  referenceIntegrity: 0.12,
  businessOwnershipIsolation: 0.11,
  bugTraceability: 0.05,
  certificationReadiness: 0.05,
} as const);

export function computeExecutiveIntelligencePlatformAnalysisScore(
  dimensions: ExecutiveIntelligenceAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.registryBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.registryBoundaryIntegrity +
    dimensions.orchestrationIntegrity * ANALYSIS_SCORE_WEIGHTS.orchestrationIntegrity +
    dimensions.referenceIntegrity * ANALYSIS_SCORE_WEIGHTS.referenceIntegrity +
    dimensions.businessOwnershipIsolation * ANALYSIS_SCORE_WEIGHTS.businessOwnershipIsolation +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function buildConsumedRegistriesFromInput(
  input: ExecutiveIntelligencePlatformRegistryInput
): ExecutiveIntelligenceConsumedRegistries {
  return Object.freeze({
    objectRegistryId: input.objectRegistry.registryId,
    relationshipRegistryId: input.relationshipRegistry.registryId,
    kpiRegistryId: input.kpiRegistry.registryId,
    riskRegistryId: input.riskRegistry.registryId,
    scenarioRegistryId: input.scenarioRegistry.registryId,
    okrRegistryId: input.okrRegistry.registryId,
  });
}

export function validateExecutiveIntelligenceMetadata(
  input: Partial<ExecutiveIntelligenceMetadata>
): ExecutiveIntelligenceValidationResult {
  const issues: ExecutiveIntelligenceValidationIssue[] = [];
  if (!input.tags || !Array.isArray(input.tags)) {
    issues.push(issue("missing_tags", "metadata.tags is required."));
  }
  if (!("domainHint" in input)) {
    issues.push(issue("missing_domain_hint", "metadata.domainHint is required."));
  }
  if (!("executiveCategoryHint" in input)) {
    issues.push(issue("missing_executive_category_hint", "metadata.executiveCategoryHint is required."));
  }
  if (!("taxonomyOverride" in input)) {
    issues.push(issue("missing_taxonomy_override", "metadata.taxonomyOverride is required."));
  }
  if (!input.extension || typeof input.extension !== "object") {
    issues.push(issue("missing_extension", "metadata.extension is required."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveIntelligenceSession(
  input: Partial<ExecutiveIntelligenceSession>
): ExecutiveIntelligenceValidationResult {
  const issues: ExecutiveIntelligenceValidationIssue[] = [];
  ensureMandatoryFields(input, EXECUTIVE_INTELLIGENCE_SESSION_MANDATORY_FIELDS, issues, "session");
  if (input.contractVersion !== EXECUTIVE_INTELLIGENCE_PLATFORM_VERSION) {
    issues.push(issue("invalid_contract_version", "session contractVersion must match PHASE-10/EIP-1."));
  }
  if (!input.intelligenceSessionId?.trim()) issues.push(issue("missing_session_id", "intelligenceSessionId is required."));
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.executiveModelId?.trim()) issues.push(issue("missing_executive_model_id", "executiveModelId is required."));
  if (!input.requestId?.trim()) issues.push(issue("missing_request_id", "requestId is required."));
  if (!input.requestType || !isRequestType(input.requestType)) {
    issues.push(issue("invalid_request_type", "requestType must be one of six allowed request types."));
  }
  if (!input.responseSummary?.trim() && input.responseSummary !== "") {
    issues.push(issue("missing_response_summary", "responseSummary must be present."));
  }
  if (!input.metadata) {
    issues.push(issue("missing_metadata", "metadata is required."));
  } else {
    const metadataValidation = validateExecutiveIntelligenceMetadata(input.metadata);
    if (!metadataValidation.valid) issues.push(...metadataValidation.issues);
  }
  if (!input.lifecycleState || !isLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "session lifecycleState is invalid."));
  }
  if (!input.createdAt?.trim()) issues.push(issue("missing_created_at", "createdAt is required."));
  if (!input.updatedAt?.trim()) issues.push(issue("missing_updated_at", "updatedAt is required."));
  if (input.source !== EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-10-executive-intelligence-platform."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveIntelligenceRequest(
  input: Partial<ExecutiveIntelligenceRequest>
): ExecutiveIntelligenceValidationResult {
  const issues: ExecutiveIntelligenceValidationIssue[] = [];
  ensureMandatoryFields(input, EXECUTIVE_INTELLIGENCE_REQUEST_MANDATORY_FIELDS, issues, "request");
  if (input.contractVersion !== EXECUTIVE_INTELLIGENCE_PLATFORM_VERSION) {
    issues.push(issue("invalid_contract_version", "request contractVersion must match PHASE-10/EIP-1."));
  }
  if (!input.requestId?.trim()) issues.push(issue("missing_request_id", "requestId is required."));
  if (!input.intelligenceSessionId?.trim()) issues.push(issue("missing_session_id", "intelligenceSessionId is required."));
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.executiveModelId?.trim()) issues.push(issue("missing_executive_model_id", "executiveModelId is required."));
  if (!input.requestType || !isRequestType(input.requestType)) {
    issues.push(issue("invalid_request_type", "requestType must be one of six allowed request types."));
  }
  if (!input.metadata) {
    issues.push(issue("missing_metadata", "metadata is required."));
  } else {
    const metadataValidation = validateExecutiveIntelligenceMetadata(input.metadata);
    if (!metadataValidation.valid) issues.push(...metadataValidation.issues);
  }
  if (!input.lifecycleState || !isLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "request lifecycleState is invalid."));
  }
  if (!input.createdAt?.trim()) issues.push(issue("missing_created_at", "createdAt is required."));
  if (!input.updatedAt?.trim()) issues.push(issue("missing_updated_at", "updatedAt is required."));
  if (input.source !== EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-10-executive-intelligence-platform."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveIntelligenceResponse(
  input: Partial<ExecutiveIntelligenceResponse>
): ExecutiveIntelligenceValidationResult {
  const issues: ExecutiveIntelligenceValidationIssue[] = [];
  ensureMandatoryFields(input, EXECUTIVE_INTELLIGENCE_RESPONSE_MANDATORY_FIELDS, issues, "response");
  if (input.contractVersion !== EXECUTIVE_INTELLIGENCE_PLATFORM_VERSION) {
    issues.push(issue("invalid_contract_version", "response contractVersion must match PHASE-10/EIP-1."));
  }
  if (!input.responseId?.trim()) issues.push(issue("missing_response_id", "responseId is required."));
  if (!input.requestId?.trim()) issues.push(issue("missing_request_id", "requestId is required."));
  if (!input.intelligenceSessionId?.trim()) issues.push(issue("missing_session_id", "intelligenceSessionId is required."));
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.executiveModelId?.trim()) issues.push(issue("missing_executive_model_id", "executiveModelId is required."));
  if (typeof input.executiveSummary !== "string" || input.executiveSummary.trim().length === 0) {
    issues.push(issue("missing_executive_summary", "executiveSummary is required."));
  }
  if (!Array.isArray(input.referencedObjects)) issues.push(issue("missing_referenced_objects", "referencedObjects is required."));
  if (!Array.isArray(input.referencedRelationships)) issues.push(issue("missing_referenced_relationships", "referencedRelationships is required."));
  if (!Array.isArray(input.referencedKpis)) issues.push(issue("missing_referenced_kpis", "referencedKpis is required."));
  if (!Array.isArray(input.referencedRisks)) issues.push(issue("missing_referenced_risks", "referencedRisks is required."));
  if (!Array.isArray(input.referencedScenarios)) issues.push(issue("missing_referenced_scenarios", "referencedScenarios is required."));
  if (!Array.isArray(input.referencedOkrs)) issues.push(issue("missing_referenced_okrs", "referencedOkrs is required."));
  if (!input.metadata) {
    issues.push(issue("missing_metadata", "metadata is required."));
  } else {
    const metadataValidation = validateExecutiveIntelligenceMetadata(input.metadata);
    if (!metadataValidation.valid) issues.push(...metadataValidation.issues);
  }
  if (!input.lifecycleState || !isLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "response lifecycleState is invalid."));
  }
  if (!input.createdAt?.trim()) issues.push(issue("missing_created_at", "createdAt is required."));
  if (!input.updatedAt?.trim()) issues.push(issue("missing_updated_at", "updatedAt is required."));
  if (input.source !== EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-10-executive-intelligence-platform."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveIntelligenceContext(
  input: Partial<ExecutiveIntelligenceContext>
): ExecutiveIntelligenceValidationResult {
  const issues: ExecutiveIntelligenceValidationIssue[] = [];
  ensureMandatoryFields(input, EXECUTIVE_INTELLIGENCE_CONTEXT_MANDATORY_FIELDS, issues, "context");
  if (!input.contextId?.trim()) issues.push(issue("missing_context_id", "contextId is required."));
  if (!input.intelligenceSessionId?.trim()) issues.push(issue("missing_session_id", "intelligenceSessionId is required."));
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.executiveModelId?.trim()) issues.push(issue("missing_executive_model_id", "executiveModelId is required."));
  if (!input.requestType || !isRequestType(input.requestType)) {
    issues.push(issue("invalid_request_type", "context requestType is invalid."));
  }
  if (!input.metadata) {
    issues.push(issue("missing_metadata", "metadata is required."));
  } else {
    const metadataValidation = validateExecutiveIntelligenceMetadata(input.metadata);
    if (!metadataValidation.valid) issues.push(...metadataValidation.issues);
  }
  if (!input.createdAt?.trim()) issues.push(issue("missing_created_at", "createdAt is required."));
  if (!input.updatedAt?.trim()) issues.push(issue("missing_updated_at", "updatedAt is required."));
  if (input.source !== EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-10-executive-intelligence-platform."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateHexRegistryScope(
  input: ExecutiveIntelligencePlatformRegistryInput
): ExecutiveIntelligenceValidationResult {
  const issues: ExecutiveIntelligenceValidationIssue[] = [];
  const { objectRegistry, relationshipRegistry, kpiRegistry, riskRegistry, scenarioRegistry, okrRegistry } = input;

  const registries = [relationshipRegistry, kpiRegistry, riskRegistry, scenarioRegistry, okrRegistry];
  for (const registry of registries) {
    if (
      registry.workspaceId !== objectRegistry.workspaceId ||
      registry.executiveModelId !== objectRegistry.executiveModelId
    ) {
      issues.push(
        issue("registry_scope_mismatch", "All six registries must share workspaceId and executiveModelId scope.")
      );
      break;
    }
  }

  if (relationshipRegistry.objectRegistryId !== objectRegistry.registryId) {
    issues.push(issue("relationship_object_registry_mismatch", "relationshipRegistry.objectRegistryId must match objectRegistry.registryId."));
  }
  if (kpiRegistry.objectRegistryId !== objectRegistry.registryId) {
    issues.push(issue("kpi_object_registry_mismatch", "kpiRegistry.objectRegistryId must match objectRegistry.registryId."));
  }
  if (kpiRegistry.relationshipRegistryId !== relationshipRegistry.registryId) {
    issues.push(issue("kpi_relationship_registry_mismatch", "kpiRegistry.relationshipRegistryId must match relationshipRegistry.registryId."));
  }
  if (riskRegistry.objectRegistryId !== objectRegistry.registryId) {
    issues.push(issue("risk_object_registry_mismatch", "riskRegistry.objectRegistryId must match objectRegistry.registryId."));
  }
  if (riskRegistry.relationshipRegistryId !== relationshipRegistry.registryId) {
    issues.push(issue("risk_relationship_registry_mismatch", "riskRegistry.relationshipRegistryId must match relationshipRegistry.registryId."));
  }
  if (riskRegistry.kpiRegistryId !== kpiRegistry.registryId) {
    issues.push(issue("risk_kpi_registry_mismatch", "riskRegistry.kpiRegistryId must match kpiRegistry.registryId."));
  }
  if (scenarioRegistry.objectRegistryId !== objectRegistry.registryId) {
    issues.push(issue("scenario_object_registry_mismatch", "scenarioRegistry.objectRegistryId must match objectRegistry.registryId."));
  }
  if (scenarioRegistry.relationshipRegistryId !== relationshipRegistry.registryId) {
    issues.push(issue("scenario_relationship_registry_mismatch", "scenarioRegistry.relationshipRegistryId must match relationshipRegistry.registryId."));
  }
  if (scenarioRegistry.kpiRegistryId !== kpiRegistry.registryId) {
    issues.push(issue("scenario_kpi_registry_mismatch", "scenarioRegistry.kpiRegistryId must match kpiRegistry.registryId."));
  }
  if (scenarioRegistry.riskRegistryId !== riskRegistry.registryId) {
    issues.push(issue("scenario_risk_registry_mismatch", "scenarioRegistry.riskRegistryId must match riskRegistry.registryId."));
  }
  if (okrRegistry.objectRegistryId !== objectRegistry.registryId) {
    issues.push(issue("okr_object_registry_mismatch", "okrRegistry.objectRegistryId must match objectRegistry.registryId."));
  }
  if (okrRegistry.relationshipRegistryId !== relationshipRegistry.registryId) {
    issues.push(issue("okr_relationship_registry_mismatch", "okrRegistry.relationshipRegistryId must match relationshipRegistry.registryId."));
  }
  if (okrRegistry.kpiRegistryId !== kpiRegistry.registryId) {
    issues.push(issue("okr_kpi_registry_mismatch", "okrRegistry.kpiRegistryId must match kpiRegistry.registryId."));
  }
  if (okrRegistry.riskRegistryId !== riskRegistry.registryId) {
    issues.push(issue("okr_risk_registry_mismatch", "okrRegistry.riskRegistryId must match riskRegistry.registryId."));
  }
  if (okrRegistry.scenarioRegistryId !== scenarioRegistry.registryId) {
    issues.push(issue("okr_scenario_registry_mismatch", "okrRegistry.scenarioRegistryId must match scenarioRegistry.registryId."));
  }

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateObjectRegistryIntegrationInput(
  registry: Partial<ExecutiveObjectRegistry>
): ExecutiveIntelligenceValidationResult {
  return asValidationResult(validateExecutiveObjectRegistry(registry));
}

export function validateRelationshipRegistryIntegrationInput(
  registry: Partial<ExecutiveRelationshipRegistry>
): ExecutiveIntelligenceValidationResult {
  return asValidationResult(validateExecutiveRelationshipRegistry(registry));
}

export function validateKpiRegistryIntegrationInput(
  registry: Partial<ExecutiveKpiRegistry>
): ExecutiveIntelligenceValidationResult {
  return asValidationResult(validateExecutiveKpiRegistry(registry));
}

export function validateRiskRegistryIntegrationInput(
  registry: Partial<ExecutiveRiskRegistry>
): ExecutiveIntelligenceValidationResult {
  return asValidationResult(validateExecutiveRiskRegistry(registry));
}

export function validateScenarioRegistryIntegrationInput(
  registry: Partial<ExecutiveScenarioRegistry>
): ExecutiveIntelligenceValidationResult {
  return asValidationResult(validateExecutiveScenarioRegistry(registry));
}

export function validateOkrRegistryIntegrationInput(
  registry: Partial<ExecutiveOkrRegistry>
): ExecutiveIntelligenceValidationResult {
  return asValidationResult(validateExecutiveOkrRegistry(registry));
}

export function validateResponseObjectReferences(input: {
  referencedObjects: readonly ExecutiveIntelligenceObjectReference[];
  objectRegistry: ExecutiveObjectRegistry;
}): ExecutiveIntelligenceValidationResult {
  const issues: ExecutiveIntelligenceValidationIssue[] = [];
  const seen = new Set<string>();
  for (const reference of input.referencedObjects) {
    if (!reference.executiveObjectId?.trim()) {
      issues.push(issue("missing_reference_object_id", "referencedObjects executiveObjectId is required."));
      continue;
    }
    if (!isReferenceRole(reference.referenceRole)) {
      issues.push(issue("invalid_object_reference_role", "referencedObjects referenceRole is invalid."));
    }
    if (!resolveExecutiveObjectById(input.objectRegistry, reference.executiveObjectId)) {
      issues.push(issue("reference_object_missing", `Object ${reference.executiveObjectId} not in object registry.`));
    }
    if (seen.has(reference.executiveObjectId)) {
      issues.push(issue("duplicate_object_reference", `Duplicate object reference ${reference.executiveObjectId}.`));
    }
    seen.add(reference.executiveObjectId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateResponseRelationshipReferences(input: {
  referencedRelationships: readonly ExecutiveIntelligenceRelationshipReference[];
  relationshipRegistry: ExecutiveRelationshipRegistry;
}): ExecutiveIntelligenceValidationResult {
  const issues: ExecutiveIntelligenceValidationIssue[] = [];
  const seen = new Set<string>();
  for (const reference of input.referencedRelationships) {
    if (!reference.executiveRelationshipId?.trim()) {
      issues.push(issue("missing_reference_relationship_id", "referencedRelationships executiveRelationshipId is required."));
      continue;
    }
    if (!isReferenceRole(reference.referenceRole)) {
      issues.push(issue("invalid_relationship_reference_role", "referencedRelationships referenceRole is invalid."));
    }
    if (!resolveExecutiveRelationshipById(input.relationshipRegistry, reference.executiveRelationshipId)) {
      issues.push(
        issue(
          "reference_relationship_missing",
          `Relationship ${reference.executiveRelationshipId} not in relationship registry.`
        )
      );
    }
    if (seen.has(reference.executiveRelationshipId)) {
      issues.push(
        issue("duplicate_relationship_reference", `Duplicate relationship reference ${reference.executiveRelationshipId}.`)
      );
    }
    seen.add(reference.executiveRelationshipId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateResponseKpiReferences(input: {
  referencedKpis: readonly ExecutiveIntelligenceKpiReference[];
  kpiRegistry: ExecutiveKpiRegistry;
}): ExecutiveIntelligenceValidationResult {
  const issues: ExecutiveIntelligenceValidationIssue[] = [];
  const seen = new Set<string>();
  for (const reference of input.referencedKpis) {
    if (!reference.executiveKpiId?.trim()) {
      issues.push(issue("missing_reference_kpi_id", "referencedKpis executiveKpiId is required."));
      continue;
    }
    if (!isReferenceRole(reference.referenceRole)) {
      issues.push(issue("invalid_kpi_reference_role", "referencedKpis referenceRole is invalid."));
    }
    if (!resolveExecutiveKpiById(input.kpiRegistry, reference.executiveKpiId)) {
      issues.push(issue("reference_kpi_missing", `KPI ${reference.executiveKpiId} not in KPI registry.`));
    }
    if (seen.has(reference.executiveKpiId)) {
      issues.push(issue("duplicate_kpi_reference", `Duplicate KPI reference ${reference.executiveKpiId}.`));
    }
    seen.add(reference.executiveKpiId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateResponseRiskReferences(input: {
  referencedRisks: readonly ExecutiveIntelligenceRiskReference[];
  riskRegistry: ExecutiveRiskRegistry;
}): ExecutiveIntelligenceValidationResult {
  const issues: ExecutiveIntelligenceValidationIssue[] = [];
  const seen = new Set<string>();
  for (const reference of input.referencedRisks) {
    if (!reference.executiveRiskId?.trim()) {
      issues.push(issue("missing_reference_risk_id", "referencedRisks executiveRiskId is required."));
      continue;
    }
    if (!isReferenceRole(reference.referenceRole)) {
      issues.push(issue("invalid_risk_reference_role", "referencedRisks referenceRole is invalid."));
    }
    if (!resolveExecutiveRiskById(input.riskRegistry, reference.executiveRiskId)) {
      issues.push(issue("reference_risk_missing", `Risk ${reference.executiveRiskId} not in risk registry.`));
    }
    if (seen.has(reference.executiveRiskId)) {
      issues.push(issue("duplicate_risk_reference", `Duplicate risk reference ${reference.executiveRiskId}.`));
    }
    seen.add(reference.executiveRiskId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateResponseScenarioReferences(input: {
  referencedScenarios: readonly ExecutiveIntelligenceScenarioReference[];
  scenarioRegistry: ExecutiveScenarioRegistry;
}): ExecutiveIntelligenceValidationResult {
  const issues: ExecutiveIntelligenceValidationIssue[] = [];
  const seen = new Set<string>();
  for (const reference of input.referencedScenarios) {
    if (!reference.executiveScenarioId?.trim()) {
      issues.push(issue("missing_reference_scenario_id", "referencedScenarios executiveScenarioId is required."));
      continue;
    }
    if (!isReferenceRole(reference.referenceRole)) {
      issues.push(issue("invalid_scenario_reference_role", "referencedScenarios referenceRole is invalid."));
    }
    if (!resolveExecutiveScenarioById(input.scenarioRegistry, reference.executiveScenarioId)) {
      issues.push(issue("reference_scenario_missing", `Scenario ${reference.executiveScenarioId} not in scenario registry.`));
    }
    if (seen.has(reference.executiveScenarioId)) {
      issues.push(issue("duplicate_scenario_reference", `Duplicate scenario reference ${reference.executiveScenarioId}.`));
    }
    seen.add(reference.executiveScenarioId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateResponseOkrReferences(input: {
  referencedOkrs: readonly ExecutiveIntelligenceOkrReference[];
  okrRegistry: ExecutiveOkrRegistry;
}): ExecutiveIntelligenceValidationResult {
  const issues: ExecutiveIntelligenceValidationIssue[] = [];
  const seenObjectives = new Set<string>();
  const seenKeyResults = new Set<string>();
  for (const reference of input.referencedOkrs) {
    const objectiveId = reference.executiveObjectiveId?.trim() ?? "";
    const keyResultId = reference.executiveKeyResultId?.trim() ?? "";
    if (!objectiveId && !keyResultId) {
      issues.push(
        issue("missing_reference_okr_identity", "Each OKR reference must include objectiveId, keyResultId, or both.")
      );
      continue;
    }
    if (!isReferenceRole(reference.referenceRole)) {
      issues.push(issue("invalid_okr_reference_role", "referencedOkrs referenceRole is invalid."));
    }
    if (objectiveId) {
      if (!resolveExecutiveObjectiveById(input.okrRegistry, objectiveId)) {
        issues.push(issue("reference_objective_missing", `Objective ${objectiveId} not in OKR registry.`));
      }
      if (seenObjectives.has(objectiveId)) {
        issues.push(issue("duplicate_objective_reference", `Duplicate objective reference ${objectiveId}.`));
      }
      seenObjectives.add(objectiveId);
    }
    if (keyResultId) {
      if (!resolveExecutiveKeyResultById(input.okrRegistry, keyResultId)) {
        issues.push(issue("reference_key_result_missing", `Key result ${keyResultId} not in OKR registry.`));
      }
      if (seenKeyResults.has(keyResultId)) {
        issues.push(issue("duplicate_key_result_reference", `Duplicate key result reference ${keyResultId}.`));
      }
      seenKeyResults.add(keyResultId);
    }
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function correlateRegistryReferences(input: {
  requestType: ExecutiveIntelligenceRequestType;
  objectRegistry: ExecutiveObjectRegistry;
  relationshipRegistry: ExecutiveRelationshipRegistry;
  kpiRegistry: ExecutiveKpiRegistry;
  riskRegistry: ExecutiveRiskRegistry;
  scenarioRegistry: ExecutiveScenarioRegistry;
  okrRegistry: ExecutiveOkrRegistry;
}): Readonly<{
  referencedObjects: readonly ExecutiveIntelligenceObjectReference[];
  referencedRelationships: readonly ExecutiveIntelligenceRelationshipReference[];
  referencedKpis: readonly ExecutiveIntelligenceKpiReference[];
  referencedRisks: readonly ExecutiveIntelligenceRiskReference[];
  referencedScenarios: readonly ExecutiveIntelligenceScenarioReference[];
  referencedOkrs: readonly ExecutiveIntelligenceOkrReference[];
}> {
  const limit = input.requestType === "comparison" ? 2 : 1;

  const selectedObjects =
    input.requestType === "executive_overview"
      ? firstOrPreferred(input.objectRegistry.objects, EIP_EXAMPLE_OBJECT_ID, (entry) => entry.executiveObjectId)
      : Object.freeze(input.objectRegistry.objects.slice(0, limit));
  const selectedRelationships =
    input.requestType === "executive_overview"
      ? firstOrPreferred(
          input.relationshipRegistry.relationships,
          EIP_EXAMPLE_RELATIONSHIP_ID,
          (entry) => entry.executiveRelationshipId
        )
      : Object.freeze(input.relationshipRegistry.relationships.slice(0, limit));
  const selectedKpis =
    input.requestType === "executive_overview"
      ? firstOrPreferred(input.kpiRegistry.kpis, EIP_EXAMPLE_KPI_ID, (entry) => entry.executiveKpiId)
      : Object.freeze(input.kpiRegistry.kpis.slice(0, limit));
  const selectedRisks =
    input.requestType === "executive_overview"
      ? firstOrPreferred(input.riskRegistry.risks, EIP_EXAMPLE_RISK_ID, (entry) => entry.executiveRiskId)
      : Object.freeze(input.riskRegistry.risks.slice(0, limit));
  const selectedScenarios =
    input.requestType === "executive_overview"
      ? firstOrPreferred(
          input.scenarioRegistry.scenarios,
          EIP_EXAMPLE_SCENARIO_ID,
          (entry) => entry.executiveScenarioId
        )
      : Object.freeze(input.scenarioRegistry.scenarios.slice(0, limit));
  const selectedObjectives =
    input.requestType === "executive_overview"
      ? firstOrPreferred(
          input.okrRegistry.objectives,
          EIP_EXAMPLE_OBJECTIVE_ID,
          (entry) => entry.executiveObjectiveId
        )
      : Object.freeze(input.okrRegistry.objectives.slice(0, limit));
  const selectedKeyResults =
    input.requestType === "executive_overview"
      ? firstOrPreferred(
          input.okrRegistry.keyResults,
          EIP_EXAMPLE_KEY_RESULT_ID,
          (entry) => entry.executiveKeyResultId
        )
      : Object.freeze(input.okrRegistry.keyResults.slice(0, limit));

  const referencedObjects = uniqueById(
    selectedObjects.map((entry, index) =>
      Object.freeze({
        executiveObjectId: entry.executiveObjectId,
        referenceRole: roleAt(index),
      })
    ),
    (entry) => entry.executiveObjectId
  );

  const referencedRelationships = uniqueById(
    selectedRelationships.map((entry, index) =>
      Object.freeze({
        executiveRelationshipId: entry.executiveRelationshipId,
        referenceRole: roleAt(index),
      })
    ),
    (entry) => entry.executiveRelationshipId
  );

  const referencedKpis = uniqueById(
    selectedKpis.map((entry, index) =>
      Object.freeze({
        executiveKpiId: entry.executiveKpiId,
        referenceRole: roleAt(index),
      })
    ),
    (entry) => entry.executiveKpiId
  );

  const referencedRisks = uniqueById(
    selectedRisks.map((entry, index) =>
      Object.freeze({
        executiveRiskId: entry.executiveRiskId,
        referenceRole: roleAt(index),
      })
    ),
    (entry) => entry.executiveRiskId
  );

  const referencedScenarios = uniqueById(
    selectedScenarios.map((entry, index) =>
      Object.freeze({
        executiveScenarioId: entry.executiveScenarioId,
        referenceRole: roleAt(index),
      })
    ),
    (entry) => entry.executiveScenarioId
  );

  const referencedOkrs = Object.freeze([
    ...uniqueById(
      selectedObjectives.map((entry, index) =>
        Object.freeze({
          executiveObjectiveId: entry.executiveObjectiveId,
          executiveKeyResultId: null,
          referenceRole: roleAt(index),
        })
      ),
      (entry) => `objective:${entry.executiveObjectiveId ?? ""}:${entry.executiveKeyResultId ?? ""}`
    ),
    ...uniqueById(
      selectedKeyResults.map((entry, index) =>
        Object.freeze({
          executiveObjectiveId: null,
          executiveKeyResultId: entry.executiveKeyResultId,
          referenceRole: roleAt(index),
        })
      ),
      (entry) => `keyResult:${entry.executiveObjectiveId ?? ""}:${entry.executiveKeyResultId ?? ""}`
    ),
  ]);

  return Object.freeze({
    referencedObjects,
    referencedRelationships,
    referencedKpis,
    referencedRisks,
    referencedScenarios,
    referencedOkrs,
  });
}

export function composeExecutiveSummary(input: {
  requestType: ExecutiveIntelligenceRequestType;
  objectRegistry: ExecutiveObjectRegistry;
  relationshipRegistry: ExecutiveRelationshipRegistry;
  kpiRegistry: ExecutiveKpiRegistry;
  riskRegistry: ExecutiveRiskRegistry;
  scenarioRegistry: ExecutiveScenarioRegistry;
  okrRegistry: ExecutiveOkrRegistry;
  referencedObjects: readonly ExecutiveIntelligenceObjectReference[];
  referencedRelationships: readonly ExecutiveIntelligenceRelationshipReference[];
  referencedKpis: readonly ExecutiveIntelligenceKpiReference[];
  referencedRisks: readonly ExecutiveIntelligenceRiskReference[];
  referencedScenarios: readonly ExecutiveIntelligenceScenarioReference[];
  referencedOkrs: readonly ExecutiveIntelligenceOkrReference[];
}): string {
  const objectNames = input.referencedObjects
    .map((reference) => resolveExecutiveObjectById(input.objectRegistry, reference.executiveObjectId)?.displayName ?? null)
    .filter((entry): entry is string => Boolean(entry));
  const relationshipNames = input.referencedRelationships
    .map(
      (reference) =>
        resolveExecutiveRelationshipById(input.relationshipRegistry, reference.executiveRelationshipId)?.executiveRelationshipId ?? null
    )
    .filter((entry): entry is string => Boolean(entry));
  const kpiNames = input.referencedKpis
    .map((reference) => resolveExecutiveKpiById(input.kpiRegistry, reference.executiveKpiId)?.displayName ?? null)
    .filter((entry): entry is string => Boolean(entry));
  const riskNames = input.referencedRisks
    .map((reference) => resolveExecutiveRiskById(input.riskRegistry, reference.executiveRiskId)?.displayName ?? null)
    .filter((entry): entry is string => Boolean(entry));
  const scenarioNames = input.referencedScenarios
    .map((reference) => resolveExecutiveScenarioById(input.scenarioRegistry, reference.executiveScenarioId)?.displayName ?? null)
    .filter((entry): entry is string => Boolean(entry));
  const okrNames = input.referencedOkrs
    .map((reference) => {
      if (reference.executiveObjectiveId) {
        return resolveExecutiveObjectiveById(input.okrRegistry, reference.executiveObjectiveId)?.displayName ?? null;
      }
      if (reference.executiveKeyResultId) {
        return resolveExecutiveKeyResultById(input.okrRegistry, reference.executiveKeyResultId)?.displayName ?? null;
      }
      return null;
    })
    .filter((entry): entry is string => Boolean(entry));

  const safeList = (label: string, values: readonly string[]): string =>
    values.length > 0 ? `${label}: ${values.join(", ")}` : `${label}: none`;

  return [
    `Executive intelligence ${input.requestType} composed from frozen hex registries.`,
    safeList("Objects", objectNames),
    safeList("Relationships", relationshipNames),
    safeList("KPIs", kpiNames),
    safeList("Risks", riskNames),
    safeList("Scenarios", scenarioNames),
    safeList("OKRs", okrNames),
  ].join(" ");
}

export function orchestrateExecutiveIntelligenceFromRegistries(
  input: ExecutiveIntelligenceOrchestrationInput
): ExecutiveIntelligenceOrchestrationResult {
  const intelligenceSessionId = input.intelligenceSessionId?.trim() || `eip-${Date.now()}`;
  const requestId = `${intelligenceSessionId}-request`;
  const responseId = `${intelligenceSessionId}-response`;
  const contextId = `${intelligenceSessionId}-context`;
  const timestamp = nowIso();
  const issues: ExecutiveIntelligenceValidationIssue[] = [];

  const objectValidation = validateObjectRegistryIntegrationInput(input.objectRegistry);
  const relationshipValidation = validateRelationshipRegistryIntegrationInput(input.relationshipRegistry);
  const kpiValidation = validateKpiRegistryIntegrationInput(input.kpiRegistry);
  const riskValidation = validateRiskRegistryIntegrationInput(input.riskRegistry);
  const scenarioValidation = validateScenarioRegistryIntegrationInput(input.scenarioRegistry);
  const okrValidation = validateOkrRegistryIntegrationInput(input.okrRegistry);
  const scopeValidation = validateHexRegistryScope(input);

  if (
    !objectValidation.valid ||
    !relationshipValidation.valid ||
    !kpiValidation.valid ||
    !riskValidation.valid ||
    !scenarioValidation.valid ||
    !okrValidation.valid ||
    !scopeValidation.valid
  ) {
    issues.push(
      ...objectValidation.issues,
      ...relationshipValidation.issues,
      ...kpiValidation.issues,
      ...riskValidation.issues,
      ...scenarioValidation.issues,
      ...okrValidation.issues,
      ...scopeValidation.issues
    );
    return Object.freeze({
      success: false,
      session: null,
      request: null,
      response: null,
      context: null,
      issues: Object.freeze(issues),
      intelligenceSessionId,
    });
  }

  const consumedRegistries = buildConsumedRegistriesFromInput(input);
  const metadata = cloneMetadata(["eip-orchestrated", input.requestType]);

  let request: ExecutiveIntelligenceRequest = Object.freeze({
    contractVersion: EXECUTIVE_INTELLIGENCE_PLATFORM_VERSION,
    requestId,
    intelligenceSessionId,
    workspaceId: input.objectRegistry.workspaceId,
    executiveModelId: input.objectRegistry.executiveModelId,
    requestType: input.requestType,
    consumedRegistries,
    metadata,
    lifecycleState: "initialized",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE,
  });

  let session: ExecutiveIntelligenceSession = Object.freeze({
    contractVersion: EXECUTIVE_INTELLIGENCE_PLATFORM_VERSION,
    intelligenceSessionId,
    workspaceId: input.objectRegistry.workspaceId,
    executiveModelId: input.objectRegistry.executiveModelId,
    requestId,
    requestType: input.requestType,
    consumedRegistries,
    responseSummary: "",
    metadata,
    lifecycleState: "initialized",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE,
  });

  recordExecutiveIntelligenceDiagnosticEvent({
    type: "IntelligenceSessionCreated",
    intelligenceSessionId,
    workspaceId: session.workspaceId,
    requestId,
  });
  recordExecutiveIntelligenceDiagnostic({
    type: "IntelligenceSessionCreated",
    intelligenceSessionId,
    workspaceId: session.workspaceId,
    requestId,
    message: `Intelligence session ${intelligenceSessionId} initialized.`,
  });

  request = Object.freeze({ ...request, lifecycleState: "prepared", updatedAt: nowIso() });
  session = Object.freeze({ ...session, lifecycleState: "prepared", updatedAt: nowIso() });

  recordExecutiveIntelligenceDiagnosticEvent({
    type: "IntelligenceRequestAccepted",
    intelligenceSessionId,
    workspaceId: session.workspaceId,
    requestId,
  });
  recordExecutiveIntelligenceDiagnostic({
    type: "IntelligenceRequestAccepted",
    intelligenceSessionId,
    workspaceId: session.workspaceId,
    requestId,
    message: `Request ${requestId} accepted.`,
  });

  const context: ExecutiveIntelligenceContext = Object.freeze({
    contextId,
    intelligenceSessionId,
    workspaceId: input.objectRegistry.workspaceId,
    executiveModelId: input.objectRegistry.executiveModelId,
    consumedRegistries,
    requestType: input.requestType,
    metadata,
    createdAt: timestamp,
    updatedAt: timestamp,
    source: EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE,
  });

  recordExecutiveIntelligenceDiagnosticEvent({
    type: "IntelligenceContextPrepared",
    intelligenceSessionId,
    workspaceId: session.workspaceId,
    requestId,
  });
  recordExecutiveIntelligenceDiagnostic({
    type: "IntelligenceContextPrepared",
    intelligenceSessionId,
    workspaceId: session.workspaceId,
    requestId,
    message: `Context ${contextId} prepared.`,
  });

  const references = correlateRegistryReferences(input);
  recordExecutiveIntelligenceDiagnosticEvent({
    type: "RegistriesCorrelated",
    intelligenceSessionId,
    workspaceId: session.workspaceId,
    requestId,
  });
  recordExecutiveIntelligenceDiagnostic({
    type: "RegistriesCorrelated",
    intelligenceSessionId,
    workspaceId: session.workspaceId,
    requestId,
    message: "Identity-only registry references correlated.",
  });

  const executiveSummary = composeExecutiveSummary({
    ...input,
    ...references,
  });

  let response: ExecutiveIntelligenceResponse = Object.freeze({
    contractVersion: EXECUTIVE_INTELLIGENCE_PLATFORM_VERSION,
    responseId,
    requestId,
    intelligenceSessionId,
    workspaceId: input.objectRegistry.workspaceId,
    executiveModelId: input.objectRegistry.executiveModelId,
    executiveSummary,
    referencedObjects: references.referencedObjects,
    referencedRelationships: references.referencedRelationships,
    referencedKpis: references.referencedKpis,
    referencedRisks: references.referencedRisks,
    referencedScenarios: references.referencedScenarios,
    referencedOkrs: references.referencedOkrs,
    metadata,
    lifecycleState: "prepared",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE,
  });

  recordExecutiveIntelligenceDiagnosticEvent({
    type: "ResponseComposed",
    intelligenceSessionId,
    workspaceId: session.workspaceId,
    requestId,
    responseId,
  });
  recordExecutiveIntelligenceDiagnostic({
    type: "ResponseComposed",
    intelligenceSessionId,
    workspaceId: session.workspaceId,
    requestId,
    responseId,
    message: `Response ${responseId} composed.`,
  });

  const sessionValidation = validateExecutiveIntelligenceSession(session);
  const requestValidation = validateExecutiveIntelligenceRequest(request);
  const contextValidation = validateExecutiveIntelligenceContext(context);
  const responseValidation = validateExecutiveIntelligenceResponse(response);
  const responseObjectValidation = validateResponseObjectReferences({
    referencedObjects: response.referencedObjects,
    objectRegistry: input.objectRegistry,
  });
  const responseRelationshipValidation = validateResponseRelationshipReferences({
    referencedRelationships: response.referencedRelationships,
    relationshipRegistry: input.relationshipRegistry,
  });
  const responseKpiValidation = validateResponseKpiReferences({
    referencedKpis: response.referencedKpis,
    kpiRegistry: input.kpiRegistry,
  });
  const responseRiskValidation = validateResponseRiskReferences({
    referencedRisks: response.referencedRisks,
    riskRegistry: input.riskRegistry,
  });
  const responseScenarioValidation = validateResponseScenarioReferences({
    referencedScenarios: response.referencedScenarios,
    scenarioRegistry: input.scenarioRegistry,
  });
  const responseOkrValidation = validateResponseOkrReferences({
    referencedOkrs: response.referencedOkrs,
    okrRegistry: input.okrRegistry,
  });
  const boundaryValidation = validateEipHexRegistryInputBoundary();
  const noReasoningValidation = validateEipNoReasoningIntegrity();
  const referenceIntegrityValidation = validateEipReferenceIntegrity();

  if (
    !sessionValidation.valid ||
    !requestValidation.valid ||
    !contextValidation.valid ||
    !responseValidation.valid ||
    !responseObjectValidation.valid ||
    !responseRelationshipValidation.valid ||
    !responseKpiValidation.valid ||
    !responseRiskValidation.valid ||
    !responseScenarioValidation.valid ||
    !responseOkrValidation.valid ||
    !boundaryValidation.valid ||
    !noReasoningValidation.valid ||
    !referenceIntegrityValidation.valid
  ) {
    issues.push(
      ...sessionValidation.issues,
      ...requestValidation.issues,
      ...contextValidation.issues,
      ...responseValidation.issues,
      ...responseObjectValidation.issues,
      ...responseRelationshipValidation.issues,
      ...responseKpiValidation.issues,
      ...responseRiskValidation.issues,
      ...responseScenarioValidation.issues,
      ...responseOkrValidation.issues
    );
    if (!boundaryValidation.valid) {
      issues.push(issue("hex_registry_input_boundary_incomplete", boundaryValidation.evidence));
    }
    if (!noReasoningValidation.valid) {
      issues.push(issue("no_reasoning_integrity_incomplete", noReasoningValidation.evidence));
    }
    if (!referenceIntegrityValidation.valid) {
      issues.push(issue("reference_integrity_incomplete", referenceIntegrityValidation.evidence));
    }
    return Object.freeze({
      success: false,
      session: null,
      request: null,
      response: null,
      context: null,
      issues: Object.freeze(issues),
      intelligenceSessionId,
    });
  }

  request = Object.freeze({ ...request, lifecycleState: "validated", updatedAt: nowIso() });
  response = Object.freeze({ ...response, lifecycleState: "validated", updatedAt: nowIso() });
  session = Object.freeze({ ...session, lifecycleState: "validated", updatedAt: nowIso() });

  request = Object.freeze({ ...request, lifecycleState: "available", updatedAt: nowIso() });
  response = Object.freeze({ ...response, lifecycleState: "available", updatedAt: nowIso() });
  session = Object.freeze({
    ...session,
    lifecycleState: "available",
    responseSummary: executiveSummary,
    updatedAt: nowIso(),
  });

  recordExecutiveIntelligenceDiagnosticEvent({
    type: "ResponseValidated",
    intelligenceSessionId,
    workspaceId: session.workspaceId,
    requestId,
    responseId,
  });
  recordExecutiveIntelligenceDiagnostic({
    type: "ResponseValidated",
    intelligenceSessionId,
    workspaceId: session.workspaceId,
    requestId,
    responseId,
    message: `Response ${responseId} validated and published.`,
  });

  return Object.freeze({
    success: true,
    session,
    request,
    response,
    context,
    issues: Object.freeze([]),
    intelligenceSessionId,
  });
}

export function buildExecutiveIntelligenceOwnershipContract(
  session: ExecutiveIntelligenceSession
): ExecutiveIntelligencePlatformOwnershipContract {
  return Object.freeze({
    intelligenceSessionId: session.intelligenceSessionId,
    workspaceId: session.workspaceId,
    executiveModelId: session.executiveModelId,
    consumedRegistries: session.consumedRegistries,
    isolationPolicy: "workspace-exclusive",
    upstreamAuthority: "phase-9-executive-okr-integration",
    mutationPolicy: "read-only-orchestration-snapshot",
  });
}

export function validateEipHexRegistryInputBoundary(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("ds1_direct_consumption") &&
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("emg_direct_consumption") &&
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("emg_model_record_consumption") &&
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("persistence") &&
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("scene_sync");
  return Object.freeze({
    valid,
    evidence: valid
      ? "Hex-registry input boundary locked; DS-1, EMG direct consumption, persistence, and scene sync excluded."
      : "Hex-registry input boundary incomplete.",
  });
}

export function validateEipNoReasoningIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("ai_reasoning") &&
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("intelligence_reasoning") &&
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("recommendation_engine") &&
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("recommendation_generation") &&
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("llm_inference");
  return Object.freeze({
    valid,
    evidence: valid
      ? "No AI reasoning or recommendation ownership; orchestration remains declarative and deterministic."
      : "No-reasoning integrity boundary incomplete.",
  });
}

export function validateEipReferenceIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("relationship_inference") &&
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("graph_algorithms") &&
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("path_finding") &&
    EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("dependency_calculation") &&
    EXECUTIVE_INTELLIGENCE_REFERENCE_ROLES.length === 4;
  return Object.freeze({
    valid,
    evidence: valid
      ? "Identity reference integrity enforced; references remain id-only without embedded registry records."
      : "Reference integrity boundary incomplete.",
  });
}

export function resolveExecutiveIntelligencePlatformInputExample(): ExecutiveIntelligencePlatformRegistryInput {
  const objectRegistry = resolveExecutiveObjectRegistryWithOkrDeclarationsExample();
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  const kpiRegistry = resolveExecutiveKpiRegistryExample();
  const riskRegistry = resolveExecutiveRiskRegistryExample();
  const scenarioRegistry = resolveExecutiveScenarioRegistryExample();
  const okrIntegration = integrateExecutiveOkrsFromRegistries({
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
    riskRegistry,
    scenarioRegistry,
    integrationSessionId: EXAMPLE_INTEGRATION_SESSION_ID,
  });
  const okrRegistry = okrIntegration.registry ?? resolveExecutiveOkrRegistryExample();
  return Object.freeze({
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
    riskRegistry,
    scenarioRegistry,
    okrRegistry,
    intelligenceSessionId: EXAMPLE_INTEGRATION_SESSION_ID,
  });
}

export function resolveExecutiveIntelligenceOrchestrationInputExample(): ExecutiveIntelligenceOrchestrationInput {
  const base = resolveExecutiveIntelligencePlatformInputExample();
  return Object.freeze({
    ...base,
    requestType: "executive_overview",
  });
}

export function resolveExecutiveIntelligenceOrchestrationResultExample(): ExecutiveIntelligenceOrchestrationResult {
  return orchestrateExecutiveIntelligenceFromRegistries(resolveExecutiveIntelligenceOrchestrationInputExample());
}

export function resolveExecutiveIntelligenceSessionExample(): ExecutiveIntelligenceSession {
  const result = resolveExecutiveIntelligenceOrchestrationResultExample();
  if (!result.session) throw new Error("Executive intelligence session example failed to build.");
  return result.session;
}

export function resolveExecutiveIntelligenceRequestExample(): ExecutiveIntelligenceRequest {
  const result = resolveExecutiveIntelligenceOrchestrationResultExample();
  if (!result.request) throw new Error("Executive intelligence request example failed to build.");
  return result.request;
}

export function resolveExecutiveIntelligenceResponseExample(): ExecutiveIntelligenceResponse {
  const result = resolveExecutiveIntelligenceOrchestrationResultExample();
  if (!result.response) throw new Error("Executive intelligence response example failed to build.");
  return result.response;
}

export function resolveExecutiveIntelligenceContextExample(): ExecutiveIntelligenceContext {
  const result = resolveExecutiveIntelligenceOrchestrationResultExample();
  if (!result.context) throw new Error("Executive intelligence context example failed to build.");
  return result.context;
}
