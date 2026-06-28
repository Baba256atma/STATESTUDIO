/**
 * PHASE-7 / DS5-INT-1 — Executive Risk Model Integration contract.
 * Risk definition vocabulary — triple-registry input only.
 */

import {
  resolveExecutiveObjectById,
  resolveExecutiveObjectRegistryExample,
  validateExecutiveObjectRegistry,
} from "../executiveObject/executiveObjectContract.ts";
import type { ExecutiveObject, ExecutiveObjectRegistry } from "../executiveObject/executiveObjectTypes.ts";
import {
  resolveExecutiveKpiById,
  resolveExecutiveKpiRegistryExample,
  resolveExecutiveObjectRegistryWithKpiDeclarationsExample,
  validateExecutiveKpiRegistry,
} from "../executiveKpi/executiveKpiContract.ts";
import type { ExecutiveKpiRegistry } from "../executiveKpi/executiveKpiTypes.ts";
import {
  resolveExecutiveRelationshipById,
  resolveExecutiveRelationshipRegistryExample,
  validateExecutiveRelationshipRegistry,
} from "../executiveRelationship/executiveRelationshipContract.ts";
import type { ExecutiveRelationshipRegistry } from "../executiveRelationship/executiveRelationshipTypes.ts";
import { STAGE_GLOBAL_FORBIDDEN_PATTERNS, STAGE_SCORE_WEIGHTS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  recordExecutiveRiskDiagnostic,
  recordExecutiveRiskDiagnosticEvent,
} from "./executiveRiskDiagnostics.ts";
import type {
  DeclaredRiskStub,
  ExecutiveRisk,
  ExecutiveRiskCategory,
  ExecutiveRiskIntegrationInput,
  ExecutiveRiskIntegrationResult,
  ExecutiveRiskKpiBinding,
  ExecutiveRiskLifecycleState,
  ExecutiveRiskLikelihoodHint,
  ExecutiveRiskMetadata,
  ExecutiveRiskObjectBinding,
  ExecutiveRiskOwnershipContract,
  ExecutiveRiskRegistry,
  ExecutiveRiskRelationshipBinding,
  ExecutiveRiskScoreDimensions,
  ExecutiveRiskAnalysisScoreDimensions,
  ExecutiveRiskSeverityHint,
  ExecutiveRiskValidationIssue,
  ExecutiveRiskValidationResult,
} from "./executiveRiskTypes.ts";

export const EXECUTIVE_RISK_INTEGRATION_VERSION = "PHASE-7/DS5-INT-1" as const;
export const EXECUTIVE_RISK_INTEGRATION_SOURCE = "phase-7-executive-risk-integration" as const;
export const EXECUTIVE_RISK_INTEGRATION_LOG_PREFIX = "[NexoraExecutiveRiskIntegration]" as const;
export const EXECUTIVE_RISK_INTEGRATION_MINIMUM_OVERALL_SCORE = 98 as const;
export const RISK_DECLARATIONS_EXTENSION_KEY = "riskDeclarations" as const;

export const EXECUTIVE_RISK_INTEGRATION_TAGS = Object.freeze([
  "[DS5_INT_EXECUTIVE_RISK]",
  "[RISK_INTEGRATION_DEFINED]",
  "[WORKSPACE_RISK_OWNED]",
  "[SCENARIO_ENGINE_READY]",
] as const);

export const EXECUTIVE_RISK_INTEGRATION_FREEZE_TAGS = Object.freeze([
  "[DS5_INT_1_CERTIFIED]",
  "[EXECUTIVE_RISK_MODEL_INTEGRATION_FROZEN]",
  "[PHASE7_DS5_RISK_COMPLETE]",
] as const);

export const EXECUTIVE_RISK_CATEGORIES = Object.freeze([
  "strategic",
  "operational",
  "financial",
  "compliance",
  "technical",
  "resource",
  "market",
  "custom",
] as const satisfies readonly ExecutiveRiskCategory[]);

export const EXECUTIVE_RISK_SEVERITY_HINTS = Object.freeze([
  "low",
  "medium",
  "high",
  "critical",
] as const satisfies readonly ExecutiveRiskSeverityHint[]);

export const EXECUTIVE_RISK_LIKELIHOOD_HINTS = Object.freeze([
  "rare",
  "unlikely",
  "possible",
  "likely",
  "almost_certain",
] as const satisfies readonly ExecutiveRiskLikelihoodHint[]);

export const EXECUTIVE_RISK_LIFECYCLE_STATES = Object.freeze([
  "draft",
  "defined",
  "validated",
  "active",
  "deprecated",
  "archived",
] as const satisfies readonly ExecutiveRiskLifecycleState[]);

export const EXECUTIVE_RISK_REGISTRY_STATES = Object.freeze([
  "draft",
  "validated",
  "active",
] as const);

export const EXECUTIVE_RISK_BINDING_ROLES = Object.freeze([
  "primary",
  "secondary",
  "context",
  "custom",
] as const);

export const EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN = Object.freeze([
  "risk_scoring",
  "risk_calculation",
  "probability_calculation",
  "mitigation_planning",
  "mitigation_engine",
  "impact_calculation",
  "risk_prioritization",
  "scenario_simulations",
  "scenario_generation",
  "kpi_calculations",
  "kpi_formula_execution",
  "relationship_discovery",
  "relationship_inference",
  "graph_algorithms",
  "path_finding",
  "dependency_calculation",
  "executive_intelligence",
  "intelligence_reasoning",
  "recommendations",
  "dashboard_rendering",
  "assistant_logic",
  "persistence",
  "upload_execution",
  "parsing",
  "synchronization",
  "scene_sync",
  "workspace_mutation",
  "registry_mutation",
  "object_registry_runtime",
  "legacy_risk_modules",
  "ds1_direct_consumption",
  "emg_direct_consumption",
  "emg_model_record_consumption",
  "legacy_relationship_runtime",
  "emg1_contract_mutation",
  "emg2_contract_mutation",
  "emg3_contract_mutation",
  "ds2_contract_mutation",
  "ds3_contract_mutation",
  "ds4_contract_mutation",
] as const);

export const EXECUTIVE_RISK_INTEGRATION_FORBIDDEN_PATTERNS = Object.freeze([
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
  "dashboardIntelligence/",
  "executiveIntelligencePlatform/",
  "assistantRuntime",
  "ParserEngine",
  "ImportEngine",
  "SynchronizationEngine",
  "scenario-intelligence/ScenarioGenerationRuntime",
  ".tsx",
] as const);

export const EXECUTIVE_RISK_INTEGRATION_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-7/DS5-INT-1",
  title: "Executive Risk Model Integration",
  goal: "Library-only risk integration contract consuming frozen DS2, DS3, and DS4 registries.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveRisk/executiveRiskTypes.ts",
    "frontend/app/lib/executiveRisk/executiveRiskContract.ts",
    "frontend/app/lib/executiveRisk/executiveRiskDiagnostics.ts",
    "frontend/app/lib/executiveRisk/executiveRiskCertification.ts",
    "frontend/app/lib/executiveRisk/executiveRiskCertification.test.ts",
    "docs/ds5-int-1-understanding-report.md",
    "docs/ds5-int-1-build-report.md",
    "docs/ds5-int-1-analysis-report.md",
    "docs/ds5-int-1-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_RISK_INTEGRATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["DS2-INT-1", "DS3-INT-1", "DS4-INT-1", "STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_RISK_INTEGRATION_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_RISK_INTEGRATION_MODULE_PATHS = Object.freeze(
  EXECUTIVE_RISK_INTEGRATION_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

export const EXECUTIVE_RISK_MANDATORY_FIELDS = Object.freeze([
  "executiveRiskId",
  "workspaceId",
  "executiveModelId",
  "displayName",
  "riskCategory",
  "severityHint",
  "likelihoodHint",
  "objectBindings",
  "relationshipBindings",
  "kpiBindings",
  "metadata",
  "lifecycleState",
  "createdAt",
  "updatedAt",
] as const);

const EXAMPLE_INTEGRATION_SESSION_ID = "erir-session-example-001";
const EXAMPLE_REGISTRY_ID = "erir-registry-example-001";

function issue(code: string, message: string): ExecutiveRiskValidationIssue {
  return Object.freeze({ code, message });
}

function nowIso(): string {
  return new Date().toISOString();
}

function isExecutiveRiskCategory(value: string): value is ExecutiveRiskCategory {
  return (EXECUTIVE_RISK_CATEGORIES as readonly string[]).includes(value);
}

function isExecutiveRiskSeverityHint(value: string): value is ExecutiveRiskSeverityHint {
  return (EXECUTIVE_RISK_SEVERITY_HINTS as readonly string[]).includes(value);
}

function isExecutiveRiskLikelihoodHint(value: string): value is ExecutiveRiskLikelihoodHint {
  return (EXECUTIVE_RISK_LIKELIHOOD_HINTS as readonly string[]).includes(value);
}

function isExecutiveRiskLifecycleState(value: string): value is ExecutiveRiskLifecycleState {
  return (EXECUTIVE_RISK_LIFECYCLE_STATES as readonly string[]).includes(value);
}

export function computeExecutiveRiskIntegrationOverallScore(
  dimensions: ExecutiveRiskScoreDimensions
): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveRiskIntegrationMinimumScore(overall: number): boolean {
  return overall >= EXECUTIVE_RISK_INTEGRATION_MINIMUM_OVERALL_SCORE;
}

const ANALYSIS_SCORE_WEIGHTS = Object.freeze({
  architectureHealth: 0.12,
  maintainability: 0.11,
  scalability: 0.1,
  regressionSafety: 0.13,
  registryBoundaryIntegrity: 0.14,
  riskModelIntegrity: 0.13,
  bindingIntegrity: 0.13,
  bugTraceability: 0.07,
  certificationReadiness: 0.07,
} as const);

export function computeExecutiveRiskIntegrationAnalysisScore(
  dimensions: ExecutiveRiskAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.registryBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.registryBoundaryIntegrity +
    dimensions.riskModelIntegrity * ANALYSIS_SCORE_WEIGHTS.riskModelIntegrity +
    dimensions.bindingIntegrity * ANALYSIS_SCORE_WEIGHTS.bindingIntegrity +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function computeExecutiveRiskContentHash(input: {
  executiveRiskId: string;
  displayName: string;
  riskCategory: ExecutiveRiskCategory;
  severityHint: ExecutiveRiskSeverityHint;
  likelihoodHint: ExecutiveRiskLikelihoodHint;
}): string {
  return Object.freeze(
    `erir:${input.executiveRiskId}:${input.displayName}:${input.riskCategory}:${input.severityHint}:${input.likelihoodHint}`
  );
}

function readRiskDeclarationsFromObject(object: ExecutiveObject): readonly DeclaredRiskStub[] {
  const extension = object.metadata.extension.futureExtension;
  if (!extension || typeof extension !== "object") {
    return Object.freeze([]);
  }
  const raw = (extension as Record<string, unknown>)[RISK_DECLARATIONS_EXTENSION_KEY];
  if (!Array.isArray(raw)) {
    return Object.freeze([]);
  }
  return Object.freeze(raw as DeclaredRiskStub[]);
}

export function extractRiskDeclarationsFromRegistry(
  registry: ExecutiveObjectRegistry
): ReadonlyArray<DeclaredRiskStub & { hostObjectId: string }> {
  const collected: Array<DeclaredRiskStub & { hostObjectId: string }> = [];
  for (const object of registry.objects) {
    for (const stub of readRiskDeclarationsFromObject(object)) {
      collected.push(Object.freeze({ ...stub, hostObjectId: object.executiveObjectId }));
    }
  }
  return Object.freeze(collected);
}

export function validateDeclaredRiskStub(input: Partial<DeclaredRiskStub>): ExecutiveRiskValidationResult {
  const issues: ExecutiveRiskValidationIssue[] = [];
  if (!input.executiveRiskId?.trim()) {
    issues.push(issue("missing_executive_risk_id", "executiveRiskId is required."));
  }
  if (!input.displayName?.trim()) {
    issues.push(issue("missing_display_name", "displayName is required."));
  }
  if (!input.riskCategory || !isExecutiveRiskCategory(input.riskCategory)) {
    issues.push(issue("invalid_risk_category", "riskCategory must be one of eight values."));
  }
  if (!input.severityHint || !isExecutiveRiskSeverityHint(input.severityHint)) {
    issues.push(issue("invalid_severity_hint", "severityHint must be low, medium, high, or critical."));
  }
  if (!input.likelihoodHint || !isExecutiveRiskLikelihoodHint(input.likelihoodHint)) {
    issues.push(issue("invalid_likelihood_hint", "likelihoodHint must be one of five values."));
  }
  if (!input.objectBindings) {
    issues.push(issue("missing_object_bindings", "objectBindings is required."));
  }
  if (!input.relationshipBindings) {
    issues.push(issue("missing_relationship_bindings", "relationshipBindings is required."));
  }
  if (!input.kpiBindings) {
    issues.push(issue("missing_kpi_bindings", "kpiBindings is required."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateObjectRegistryIntegrationInput(
  registry: Partial<ExecutiveObjectRegistry>
): ExecutiveRiskValidationResult {
  return validateExecutiveObjectRegistry(registry);
}

export function validateRelationshipRegistryIntegrationInput(
  registry: Partial<ExecutiveRelationshipRegistry>
): ExecutiveRiskValidationResult {
  return validateExecutiveRelationshipRegistry(registry);
}

export function validateKpiRegistryIntegrationInput(
  registry: Partial<ExecutiveKpiRegistry>
): ExecutiveRiskValidationResult {
  return validateExecutiveKpiRegistry(registry);
}

export function validateRiskObjectBindings(input: {
  objectBindings: readonly ExecutiveRiskObjectBinding[];
  objectRegistry: ExecutiveObjectRegistry;
}): ExecutiveRiskValidationResult {
  const issues: ExecutiveRiskValidationIssue[] = [];
  const seen = new Set<string>();
  for (const binding of input.objectBindings) {
    if (!binding.executiveObjectId?.trim()) {
      issues.push(issue("missing_binding_object_id", "objectBindings executiveObjectId is required."));
      continue;
    }
    if (!resolveExecutiveObjectById(input.objectRegistry, binding.executiveObjectId)) {
      issues.push(
        issue("binding_object_missing", `Object ${binding.executiveObjectId} not in object registry.`)
      );
    }
    if (seen.has(binding.executiveObjectId)) {
      issues.push(issue("duplicate_object_binding", `Duplicate object binding ${binding.executiveObjectId}.`));
    }
    seen.add(binding.executiveObjectId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateRiskRelationshipBindings(input: {
  relationshipBindings: readonly ExecutiveRiskRelationshipBinding[];
  relationshipRegistry: ExecutiveRelationshipRegistry;
}): ExecutiveRiskValidationResult {
  const issues: ExecutiveRiskValidationIssue[] = [];
  const seen = new Set<string>();
  for (const binding of input.relationshipBindings) {
    if (!binding.executiveRelationshipId?.trim()) {
      issues.push(issue("missing_binding_relationship_id", "relationshipBindings executiveRelationshipId is required."));
      continue;
    }
    if (!resolveExecutiveRelationshipById(input.relationshipRegistry, binding.executiveRelationshipId)) {
      issues.push(
        issue(
          "binding_relationship_missing",
          `Relationship ${binding.executiveRelationshipId} not in relationship registry.`
        )
      );
    }
    if (seen.has(binding.executiveRelationshipId)) {
      issues.push(
        issue("duplicate_relationship_binding", `Duplicate relationship binding ${binding.executiveRelationshipId}.`)
      );
    }
    seen.add(binding.executiveRelationshipId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateRiskKpiBindings(input: {
  kpiBindings: readonly ExecutiveRiskKpiBinding[];
  kpiRegistry: ExecutiveKpiRegistry;
}): ExecutiveRiskValidationResult {
  const issues: ExecutiveRiskValidationIssue[] = [];
  const seen = new Set<string>();
  for (const binding of input.kpiBindings) {
    if (!binding.executiveKpiId?.trim()) {
      issues.push(issue("missing_binding_kpi_id", "kpiBindings executiveKpiId is required."));
      continue;
    }
    if (!resolveExecutiveKpiById(input.kpiRegistry, binding.executiveKpiId)) {
      issues.push(issue("binding_kpi_missing", `KPI ${binding.executiveKpiId} not in KPI registry.`));
    }
    if (seen.has(binding.executiveKpiId)) {
      issues.push(issue("duplicate_kpi_binding", `Duplicate KPI binding ${binding.executiveKpiId}.`));
    }
    seen.add(binding.executiveKpiId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveRisk(input: Partial<ExecutiveRisk>): ExecutiveRiskValidationResult {
  const issues: ExecutiveRiskValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_RISK_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match DS5-INT-1."));
  }
  if (!input.executiveRiskId?.trim()) {
    issues.push(issue("missing_executive_risk_id", "executiveRiskId is required."));
  }
  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_workspace_id", "workspaceId is required."));
  }
  if (!input.executiveModelId?.trim()) {
    issues.push(issue("missing_executive_model_id", "executiveModelId is required."));
  }
  if (!input.displayName?.trim()) {
    issues.push(issue("missing_display_name", "displayName is required."));
  }
  if (!input.riskCategory || !isExecutiveRiskCategory(input.riskCategory)) {
    issues.push(issue("invalid_risk_category", "riskCategory must be one of eight values."));
  }
  if (!input.severityHint || !isExecutiveRiskSeverityHint(input.severityHint)) {
    issues.push(issue("invalid_severity_hint", "severityHint must be low, medium, high, or critical."));
  }
  if (!input.likelihoodHint || !isExecutiveRiskLikelihoodHint(input.likelihoodHint)) {
    issues.push(issue("invalid_likelihood_hint", "likelihoodHint must be one of five values."));
  }
  if (!input.objectBindings) {
    issues.push(issue("missing_object_bindings", "objectBindings is required."));
  }
  if (!input.relationshipBindings) {
    issues.push(issue("missing_relationship_bindings", "relationshipBindings is required."));
  }
  if (!input.kpiBindings) {
    issues.push(issue("missing_kpi_bindings", "kpiBindings is required."));
  }
  if (!input.metadata) {
    issues.push(issue("missing_metadata", "metadata is required."));
  }
  if (!input.lifecycleState || !isExecutiveRiskLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "lifecycleState must be one of six lifecycle values."));
  }
  if (!input.createdAt?.trim()) {
    issues.push(issue("missing_created_at", "createdAt is required."));
  }
  if (!input.updatedAt?.trim()) {
    issues.push(issue("missing_updated_at", "updatedAt is required."));
  }
  if (input.source !== EXECUTIVE_RISK_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-7-executive-risk-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveRiskRegistry(
  input: Partial<ExecutiveRiskRegistry>,
  context?: {
    objectRegistry?: ExecutiveObjectRegistry;
    relationshipRegistry?: ExecutiveRelationshipRegistry;
    kpiRegistry?: ExecutiveKpiRegistry;
  }
): ExecutiveRiskValidationResult {
  const issues: ExecutiveRiskValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_RISK_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match DS5-INT-1."));
  }
  if (!input.registryId?.trim()) {
    issues.push(issue("missing_registry_id", "registryId is required."));
  }
  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_workspace_id", "registry workspaceId is required."));
  }
  if (!input.executiveModelId?.trim()) {
    issues.push(issue("missing_executive_model_id", "registry executiveModelId is required."));
  }
  if (!input.objectRegistryId?.trim()) {
    issues.push(issue("missing_object_registry_id", "objectRegistryId is required."));
  }
  if (!input.relationshipRegistryId?.trim()) {
    issues.push(issue("missing_relationship_registry_id", "relationshipRegistryId is required."));
  }
  if (!input.kpiRegistryId?.trim()) {
    issues.push(issue("missing_kpi_registry_id", "kpiRegistryId is required."));
  }
  if (!input.integrationSessionId?.trim()) {
    issues.push(issue("missing_integration_session_id", "integrationSessionId is required."));
  }
  if (!input.risks) {
    issues.push(issue("missing_risks", "risks array is required."));
  } else {
    const ids = new Set<string>();
    for (const risk of input.risks) {
      const riskValidation = validateExecutiveRisk(risk);
      if (!riskValidation.valid) {
        issues.push(...riskValidation.issues.map((entry) => issue(`risk_${entry.code}`, entry.message)));
      }
      if (risk.workspaceId !== input.workspaceId) {
        issues.push(issue("workspace_mismatch", `Risk ${risk.executiveRiskId} workspace mismatch.`));
      }
      if (risk.executiveModelId !== input.executiveModelId) {
        issues.push(issue("model_mismatch", `Risk ${risk.executiveRiskId} model mismatch.`));
      }
      if (ids.has(risk.executiveRiskId)) {
        issues.push(issue("duplicate_executive_risk_id", `Duplicate id ${risk.executiveRiskId}.`));
      }
      ids.add(risk.executiveRiskId);
      if (context?.objectRegistry) {
        const objectBindingValidation = validateRiskObjectBindings({
          objectBindings: risk.objectBindings,
          objectRegistry: context.objectRegistry,
        });
        if (!objectBindingValidation.valid) {
          issues.push(...objectBindingValidation.issues);
        }
      }
      if (context?.relationshipRegistry) {
        const relationshipBindingValidation = validateRiskRelationshipBindings({
          relationshipBindings: risk.relationshipBindings,
          relationshipRegistry: context.relationshipRegistry,
        });
        if (!relationshipBindingValidation.valid) {
          issues.push(...relationshipBindingValidation.issues);
        }
      }
      if (context?.kpiRegistry) {
        const kpiBindingValidation = validateRiskKpiBindings({
          kpiBindings: risk.kpiBindings,
          kpiRegistry: context.kpiRegistry,
        });
        if (!kpiBindingValidation.valid) {
          issues.push(...kpiBindingValidation.issues);
        }
      }
    }
    if (input.riskCount !== undefined && input.riskCount !== input.risks.length) {
      issues.push(issue("risk_count_mismatch", "riskCount must match risks length."));
    }
  }
  if (input.source !== EXECUTIVE_RISK_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "registry source must be phase-7-executive-risk-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function buildExecutiveRiskFromStub(input: {
  stub: DeclaredRiskStub & { hostObjectId: string };
  objectRegistry: ExecutiveObjectRegistry;
  relationshipRegistry: ExecutiveRelationshipRegistry;
  kpiRegistry: ExecutiveKpiRegistry;
  integrationSessionId: string;
  timestamp: string;
}): ExecutiveRisk {
  const hostObject = resolveExecutiveObjectById(input.objectRegistry, input.stub.hostObjectId);
  const metadata: ExecutiveRiskMetadata = Object.freeze({
    tags: Object.freeze([...(input.stub.metadata?.tags ?? []), "erir-integrated"]),
    domainHint: hostObject?.metadata.domainHint ?? null,
    executiveCategoryHint: hostObject?.metadata.executiveCategoryHint ?? null,
    taxonomyOverride: null,
    extension: Object.freeze({ taxonomyOverride: null, futureExtension: Object.freeze({}) }),
  });
  const contentHash = computeExecutiveRiskContentHash({
    executiveRiskId: input.stub.executiveRiskId,
    displayName: input.stub.displayName,
    riskCategory: input.stub.riskCategory,
    severityHint: input.stub.severityHint,
    likelihoodHint: input.stub.likelihoodHint,
  });
  return Object.freeze({
    contractVersion: EXECUTIVE_RISK_INTEGRATION_VERSION,
    executiveRiskId: input.stub.executiveRiskId,
    workspaceId: input.objectRegistry.workspaceId,
    executiveModelId: input.objectRegistry.executiveModelId,
    displayName: input.stub.displayName,
    riskCategory: input.stub.riskCategory,
    severityHint: input.stub.severityHint,
    likelihoodHint: input.stub.likelihoodHint,
    objectBindings: Object.freeze(input.stub.objectBindings.map((entry) => Object.freeze({ ...entry }))),
    relationshipBindings: Object.freeze(
      input.stub.relationshipBindings.map((entry) => Object.freeze({ ...entry }))
    ),
    kpiBindings: Object.freeze(input.stub.kpiBindings.map((entry) => Object.freeze({ ...entry }))),
    metadata,
    lifecycleState: "defined",
    objectRegistryId: input.objectRegistry.registryId,
    relationshipRegistryId: input.relationshipRegistry.registryId,
    kpiRegistryId: input.kpiRegistry.registryId,
    hostObjectId: input.stub.hostObjectId,
    integrationSessionId: input.integrationSessionId,
    contentHash,
    createdAt: input.timestamp,
    updatedAt: input.timestamp,
    source: EXECUTIVE_RISK_INTEGRATION_SOURCE,
  });
}

function promoteRiskLifecycle(risk: ExecutiveRisk): ExecutiveRisk {
  const validation = validateExecutiveRisk(risk);
  if (!validation.valid) return risk;
  return Object.freeze({ ...risk, lifecycleState: "validated" as const, updatedAt: nowIso() });
}

function validateTripleRegistryScope(input: ExecutiveRiskIntegrationInput): ExecutiveRiskValidationResult {
  const { objectRegistry, relationshipRegistry, kpiRegistry } = input;
  const issues: ExecutiveRiskValidationIssue[] = [];
  if (
    objectRegistry.workspaceId !== relationshipRegistry.workspaceId ||
    objectRegistry.executiveModelId !== relationshipRegistry.executiveModelId
  ) {
    issues.push(issue("registry_scope_mismatch", "Object and relationship registries must share workspace and model scope."));
  }
  if (
    objectRegistry.workspaceId !== kpiRegistry.workspaceId ||
    objectRegistry.executiveModelId !== kpiRegistry.executiveModelId
  ) {
    issues.push(issue("registry_scope_mismatch", "Object and KPI registries must share workspace and model scope."));
  }
  if (
    relationshipRegistry.workspaceId !== kpiRegistry.workspaceId ||
    relationshipRegistry.executiveModelId !== kpiRegistry.executiveModelId
  ) {
    issues.push(
      issue("registry_scope_mismatch", "Relationship and KPI registries must share workspace and model scope.")
    );
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function integrateExecutiveRisksFromRegistries(
  input: ExecutiveRiskIntegrationInput
): ExecutiveRiskIntegrationResult {
  const integrationSessionId = input.integrationSessionId?.trim() || `erir-${Date.now()}`;
  const timestamp = nowIso();

  const objectRegistryValidation = validateObjectRegistryIntegrationInput(input.objectRegistry);
  if (!objectRegistryValidation.valid) {
    recordExecutiveRiskDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.objectRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      risks: Object.freeze([]),
      issues: objectRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const relationshipRegistryValidation = validateRelationshipRegistryIntegrationInput(input.relationshipRegistry);
  if (!relationshipRegistryValidation.valid) {
    recordExecutiveRiskDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.relationshipRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      risks: Object.freeze([]),
      issues: relationshipRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const kpiRegistryValidation = validateKpiRegistryIntegrationInput(input.kpiRegistry);
  if (!kpiRegistryValidation.valid) {
    recordExecutiveRiskDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.kpiRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      risks: Object.freeze([]),
      issues: kpiRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const scopeValidation = validateTripleRegistryScope(input);
  if (!scopeValidation.valid) {
    recordExecutiveRiskDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.objectRegistry.workspaceId,
    });
    return Object.freeze({
      success: false,
      registry: null,
      risks: Object.freeze([]),
      issues: scopeValidation.issues,
      integrationSessionId,
    });
  }

  const objectRegistry = input.objectRegistry;
  const relationshipRegistry = input.relationshipRegistry;
  const kpiRegistry = input.kpiRegistry;
  const declarations = extractRiskDeclarationsFromRegistry(objectRegistry);
  const seenIds = new Set<string>();
  const riskIssues: ExecutiveRiskValidationIssue[] = [];
  const builtRisks: ExecutiveRisk[] = [];

  for (const stubWithHost of declarations) {
    const stubValidation = validateDeclaredRiskStub(stubWithHost);
    if (!stubValidation.valid) {
      riskIssues.push(...stubValidation.issues);
      continue;
    }
    if (seenIds.has(stubWithHost.executiveRiskId)) {
      riskIssues.push(issue("duplicate_executive_risk_id", `Duplicate declaration id ${stubWithHost.executiveRiskId}.`));
      continue;
    }
    seenIds.add(stubWithHost.executiveRiskId);

    const risk = buildExecutiveRiskFromStub({
      stub: stubWithHost,
      objectRegistry,
      relationshipRegistry,
      kpiRegistry,
      integrationSessionId,
      timestamp,
    });
    recordExecutiveRiskDiagnosticEvent({
      type: "RiskDeclared",
      integrationSessionId,
      workspaceId: objectRegistry.workspaceId,
      executiveRiskId: risk.executiveRiskId,
    });

    const objectBindingValidation = validateRiskObjectBindings({
      objectBindings: risk.objectBindings,
      objectRegistry,
    });
    if (!objectBindingValidation.valid) {
      riskIssues.push(...objectBindingValidation.issues);
      continue;
    }

    const relationshipBindingValidation = validateRiskRelationshipBindings({
      relationshipBindings: risk.relationshipBindings,
      relationshipRegistry,
    });
    if (!relationshipBindingValidation.valid) {
      riskIssues.push(...relationshipBindingValidation.issues);
      continue;
    }

    const kpiBindingValidation = validateRiskKpiBindings({
      kpiBindings: risk.kpiBindings,
      kpiRegistry,
    });
    if (!kpiBindingValidation.valid) {
      riskIssues.push(...kpiBindingValidation.issues);
      continue;
    }

    const promoted = promoteRiskLifecycle(risk);
    recordExecutiveRiskDiagnosticEvent({
      type: "RiskValidated",
      integrationSessionId,
      workspaceId: promoted.workspaceId,
      executiveRiskId: promoted.executiveRiskId,
    });
    builtRisks.push(promoted);
  }

  if (riskIssues.length > 0) {
    recordExecutiveRiskDiagnostic({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: objectRegistry.workspaceId,
      message: "Risk declaration validation failed.",
    });
    return Object.freeze({
      success: false,
      registry: null,
      risks: Object.freeze(builtRisks),
      issues: Object.freeze(riskIssues),
      integrationSessionId,
    });
  }

  const validatedRisks = Object.freeze(builtRisks);
  const riskRegistry: ExecutiveRiskRegistry = Object.freeze({
    contractVersion: EXECUTIVE_RISK_INTEGRATION_VERSION,
    registryId: `${integrationSessionId}-registry`,
    workspaceId: objectRegistry.workspaceId,
    executiveModelId: objectRegistry.executiveModelId,
    objectRegistryId: objectRegistry.registryId,
    relationshipRegistryId: relationshipRegistry.registryId,
    kpiRegistryId: kpiRegistry.registryId,
    integrationSessionId,
    risks: validatedRisks,
    riskCount: validatedRisks.length,
    registryState: "validated",
    source: EXECUTIVE_RISK_INTEGRATION_SOURCE,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const outputValidation = validateExecutiveRiskRegistry(riskRegistry, {
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
  });
  if (!outputValidation.valid) {
    recordExecutiveRiskDiagnostic({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: objectRegistry.workspaceId,
      message: "Executive risk registry validation failed.",
    });
    return Object.freeze({
      success: false,
      registry: null,
      risks: validatedRisks,
      issues: outputValidation.issues,
      integrationSessionId,
    });
  }

  recordExecutiveRiskDiagnosticEvent({
    type: "RiskRegistered",
    integrationSessionId,
    workspaceId: objectRegistry.workspaceId,
  });
  recordExecutiveRiskDiagnostic({
    type: "RiskRegistered",
    integrationSessionId,
    workspaceId: objectRegistry.workspaceId,
    message: `Registered ${validatedRisks.length} executive risk(s).`,
  });

  return Object.freeze({
    success: true,
    registry: Object.freeze({ ...riskRegistry, registryId: `${integrationSessionId}-registry` }),
    risks: validatedRisks,
    issues: Object.freeze([]),
    integrationSessionId,
  });
}

export function resolveExecutiveRiskById(
  registry: ExecutiveRiskRegistry,
  executiveRiskId: string
): ExecutiveRisk | null {
  return registry.risks.find((entry) => entry.executiveRiskId === executiveRiskId) ?? null;
}

export function listExecutiveRisksByCategory(
  registry: ExecutiveRiskRegistry,
  riskCategory: ExecutiveRiskCategory
): readonly ExecutiveRisk[] {
  return Object.freeze(registry.risks.filter((entry) => entry.riskCategory === riskCategory));
}

export function listExecutiveRisksForObject(
  registry: ExecutiveRiskRegistry,
  executiveObjectId: string
): readonly ExecutiveRisk[] {
  return Object.freeze(
    registry.risks.filter((entry) =>
      entry.objectBindings.some((binding) => binding.executiveObjectId === executiveObjectId)
    )
  );
}

export function listExecutiveRisksForKpi(
  registry: ExecutiveRiskRegistry,
  executiveKpiId: string
): readonly ExecutiveRisk[] {
  return Object.freeze(
    registry.risks.filter((entry) =>
      entry.kpiBindings.some((binding) => binding.executiveKpiId === executiveKpiId)
    )
  );
}

export function buildExecutiveRiskOwnershipContract(registry: ExecutiveRiskRegistry): ExecutiveRiskOwnershipContract {
  return Object.freeze({
    registryId: registry.registryId,
    workspaceId: registry.workspaceId,
    executiveModelId: registry.executiveModelId,
    objectRegistryId: registry.objectRegistryId,
    relationshipRegistryId: registry.relationshipRegistryId,
    kpiRegistryId: registry.kpiRegistryId,
    isolationPolicy: "workspace-exclusive",
    upstreamAuthority: "phase-6-executive-kpi-integration",
    mutationPolicy: "integration-derived-immutable-snapshot",
  });
}

export function validateErirTripleRegistryInputBoundary(): Readonly<{ valid: boolean; evidence: string }> {
  const mustNotOwn =
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("ds1_direct_consumption") &&
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("emg_direct_consumption") &&
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("emg_model_record_consumption") &&
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("risk_scoring") &&
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("persistence");
  return Object.freeze({
    valid: mustNotOwn,
    evidence: mustNotOwn
      ? "Triple-registry input boundary locked; DS-1, EMG, and risk scoring excluded."
      : "Input boundary incomplete.",
  });
}

export function validateErirNoScoringIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const noScoring =
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("risk_scoring") &&
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("risk_calculation") &&
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("probability_calculation") &&
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("mitigation_planning") &&
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("mitigation_engine") &&
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("graph_algorithms");
  return Object.freeze({
    valid: noScoring,
    evidence: noScoring
      ? "Declarative risk definitions only; scoring and graph analysis excluded."
      : "No-scoring boundary incomplete.",
  });
}

export function validateErirBindingIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const bindingIntegrity =
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("graph_algorithms") &&
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("path_finding") &&
    EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("dependency_calculation") &&
    EXECUTIVE_RISK_BINDING_ROLES.length === 4;
  return Object.freeze({
    valid: bindingIntegrity,
    evidence: bindingIntegrity
      ? "Declarative identity bindings only; traversal and dependency analysis excluded."
      : "Binding integrity boundary incomplete.",
  });
}

export function attachRiskDeclarationsToObjectRegistry(
  objectRegistry: ExecutiveObjectRegistry,
  declarationsByHostObjectId: Readonly<Record<string, readonly DeclaredRiskStub[]>>
): ExecutiveObjectRegistry {
  const objects = objectRegistry.objects.map((object) => {
    const declarations = declarationsByHostObjectId[object.executiveObjectId];
    if (!declarations || declarations.length === 0) {
      return object;
    }
    return Object.freeze({
      ...object,
      metadata: Object.freeze({
        ...object.metadata,
        extension: Object.freeze({
          ...object.metadata.extension,
          futureExtension: Object.freeze({
            ...(object.metadata.extension.futureExtension ?? {}),
            [RISK_DECLARATIONS_EXTENSION_KEY]: Object.freeze(
              declarations.map((entry) => Object.freeze({ ...entry }))
            ),
          }),
        }),
      }),
    });
  });
  return Object.freeze({
    ...objectRegistry,
    objects: Object.freeze(objects),
    objectCount: objects.length,
  });
}

export function resolveExecutiveObjectRegistryWithRiskDeclarationsExample(): ExecutiveObjectRegistry {
  const baseRegistry = resolveExecutiveObjectRegistryWithKpiDeclarationsExample();
  return attachRiskDeclarationsToObjectRegistry(baseRegistry, {
    "emg-obj-outcome": Object.freeze([
      Object.freeze({
        executiveRiskId: "erir-risk-outcome-delivery-001",
        displayName: "Outcome Delivery Delay Risk",
        riskCategory: "operational" as const,
        severityHint: "high" as const,
        likelihoodHint: "possible" as const,
        objectBindings: Object.freeze([
          Object.freeze({
            executiveObjectId: "emg-obj-outcome",
            bindingRole: "primary" as const,
          }),
        ]),
        relationshipBindings: Object.freeze([
          Object.freeze({
            executiveRelationshipId: "eri-rel-supplier-outcome-001",
            bindingRole: "context" as const,
          }),
        ]),
        kpiBindings: Object.freeze([
          Object.freeze({
            executiveKpiId: "eki-kpi-outcome-delivery-001",
            bindingRole: "primary" as const,
          }),
        ]),
        metadata: Object.freeze({ tags: Object.freeze(["example"]) }),
      }),
    ]),
  });
}

export function resolveExecutiveRiskIntegrationInputExample(): ExecutiveRiskIntegrationInput {
  const objectRegistry = resolveExecutiveObjectRegistryWithRiskDeclarationsExample();
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  const kpiRegistry = resolveExecutiveKpiRegistryExample();
  return Object.freeze({
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
    integrationSessionId: EXAMPLE_INTEGRATION_SESSION_ID,
  });
}

export function resolveExecutiveRiskRegistryExample(): ExecutiveRiskRegistry {
  const input = resolveExecutiveRiskIntegrationInputExample();
  const integration = integrateExecutiveRisksFromRegistries(input);
  if (!integration.registry) {
    throw new Error("Executive risk registry example failed to build.");
  }
  return Object.freeze({ ...integration.registry, registryId: EXAMPLE_REGISTRY_ID });
}

export function resolveExecutiveRiskExample(): ExecutiveRisk {
  const registry = resolveExecutiveRiskRegistryExample();
  const first = registry.risks[0];
  if (!first) {
    throw new Error("Executive risk example registry is empty.");
  }
  return first;
}
