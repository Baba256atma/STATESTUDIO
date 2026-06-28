/**
 * PHASE-9 / OKR-INT-1 — Executive OKR Integration contract.
 * OKR definition vocabulary — penta-registry input only.
 */

import {
  resolveExecutiveObjectById,
  validateExecutiveObjectRegistry,
} from "../executiveObject/executiveObjectContract.ts";
import type { ExecutiveObject, ExecutiveObjectRegistry } from "../executiveObject/executiveObjectTypes.ts";
import {
  resolveExecutiveKpiById,
  resolveExecutiveKpiRegistryExample,
  validateExecutiveKpiRegistry,
} from "../executiveKpi/executiveKpiContract.ts";
import type { ExecutiveKpiRegistry } from "../executiveKpi/executiveKpiTypes.ts";
import {
  resolveExecutiveRiskById,
  resolveExecutiveRiskRegistryExample,
  validateExecutiveRiskRegistry,
} from "../executiveRisk/executiveRiskContract.ts";
import type { ExecutiveRiskRegistry } from "../executiveRisk/executiveRiskTypes.ts";
import {
  resolveExecutiveRelationshipById,
  resolveExecutiveRelationshipRegistryExample,
  validateExecutiveRelationshipRegistry,
} from "../executiveRelationship/executiveRelationshipContract.ts";
import type { ExecutiveRelationshipRegistry } from "../executiveRelationship/executiveRelationshipTypes.ts";
import {
  resolveExecutiveObjectRegistryWithScenarioDeclarationsExample,
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
  recordExecutiveOkrDiagnostic,
  recordExecutiveOkrDiagnosticEvent,
} from "./executiveOkrDiagnostics.ts";
import type {
  DeclaredKeyResultStub,
  DeclaredObjectiveStub,
  ExecutiveKeyResult,
  ExecutiveObjective,
  ExecutiveObjectiveCategory,
  ExecutiveOkrIntegrationInput,
  ExecutiveOkrIntegrationResult,
  ExecutiveOkrKpiReference,
  ExecutiveOkrLifecycleState,
  ExecutiveOkrMetadata,
  ExecutiveOkrObjectReference,
  ExecutiveOkrOwnershipContract,
  ExecutiveOkrRegistry,
  ExecutiveOkrReferenceRole,
  ExecutiveOkrRelationshipReference,
  ExecutiveOkrRiskReference,
  ExecutiveOkrScenarioReference,
  ExecutiveOkrAnalysisScoreDimensions,
  ExecutiveOkrScoreDimensions,
  ExecutiveOkrValidationIssue,
  ExecutiveOkrValidationResult,
} from "./executiveOkrTypes.ts";

export const EXECUTIVE_OKR_INTEGRATION_VERSION = "PHASE-9/OKR-INT-1" as const;
export const EXECUTIVE_OKR_INTEGRATION_SOURCE = "phase-9-executive-okr-integration" as const;
export const EXECUTIVE_OKR_INTEGRATION_LOG_PREFIX = "[NexoraExecutiveOkrIntegration]" as const;
export const EXECUTIVE_OKR_INTEGRATION_MINIMUM_OVERALL_SCORE = 99 as const;
export const OKR_DECLARATIONS_EXTENSION_KEY = "okrDeclarations" as const;

export const EXECUTIVE_OKR_INTEGRATION_TAGS = Object.freeze([
  "[OKR_INT_EXECUTIVE_OKR]",
  "[OKR_INTEGRATION_DEFINED]",
  "[WORKSPACE_OKR_OWNED]",
  "[INT_PLATFORM_READY]",
] as const);

export const EXECUTIVE_OKR_INTEGRATION_FREEZE_TAGS = Object.freeze([
  "[OKR_INT_1_CERTIFIED]",
  "[EXECUTIVE_OKR_INTEGRATION_FROZEN]",
  "[PHASE9_OKR_COMPLETE]",
] as const);

export const EXECUTIVE_OBJECTIVE_CATEGORIES = Object.freeze([
  "strategic",
  "operational",
  "financial",
  "organizational",
  "transformation",
  "innovation",
  "compliance",
  "custom",
] as const satisfies readonly ExecutiveObjectiveCategory[]);

export const EXECUTIVE_OKR_LIFECYCLE_STATES = Object.freeze([
  "draft",
  "defined",
  "validated",
  "active",
  "deprecated",
  "archived",
] as const satisfies readonly ExecutiveOkrLifecycleState[]);

export const EXECUTIVE_OKR_REGISTRY_STATES = Object.freeze([
  "draft",
  "validated",
  "active",
] as const);

export const EXECUTIVE_OKR_REFERENCE_ROLES = Object.freeze([
  "primary",
  "secondary",
  "context",
  "custom",
] as const);

export const EXECUTIVE_OBJECTIVE_MANDATORY_FIELDS = Object.freeze([
  "executiveObjectiveId",
  "workspaceId",
  "executiveModelId",
  "displayName",
  "objectiveCategory",
  "metadata",
  "lifecycleState",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_KEY_RESULT_MANDATORY_FIELDS = Object.freeze([
  "executiveKeyResultId",
  "executiveObjectiveId",
  "displayName",
  "targetDescription",
  "objectReferences",
  "relationshipReferences",
  "kpiReferences",
  "riskReferences",
  "scenarioReferences",
  "metadata",
  "lifecycleState",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN = Object.freeze([
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
  "strategy_optimization",
  "prediction_engine",
  "optimization_engine",
  "forecasting",
  "forecast_engine",
  "executive_intelligence",
  "intelligence_reasoning",
  "recommendations",
  "ai_reasoning",
  "object_creation",
  "relationship_discovery",
  "relationship_inference",
  "graph_algorithms",
  "path_finding",
  "dependency_calculation",
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
  "legacy_okr_modules",
  "legacy_scenario_modules",
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
  "ds5_contract_mutation",
  "ds6_contract_mutation",
] as const);

export const EXECUTIVE_OKR_INTEGRATION_FORBIDDEN_PATTERNS = Object.freeze([
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
  "executiveIntelligencePlatform/",
  "assistantRuntime",
  "ParserEngine",
  "ImportEngine",
  "SynchronizationEngine",
  ".tsx",
] as const);

export const EXECUTIVE_OKR_INTEGRATION_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-9/OKR-INT-1",
  title: "Executive OKR Integration",
  goal: "Library-only OKR integration contract consuming frozen DS2, DS3, DS4, DS5, and DS6 registries.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveOkr/executiveOkrTypes.ts",
    "frontend/app/lib/executiveOkr/executiveOkrContract.ts",
    "frontend/app/lib/executiveOkr/executiveOkrDiagnostics.ts",
    "frontend/app/lib/executiveOkr/executiveOkrCertification.ts",
    "frontend/app/lib/executiveOkr/executiveOkrCertification.test.ts",
    "docs/okr-int-1-understanding-report.md",
    "docs/okr-int-1-build-report.md",
    "docs/okr-int-1-analysis-report.md",
    "docs/okr-int-1-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_OKR_INTEGRATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "DS2-INT-1",
    "DS3-INT-1",
    "DS4-INT-1",
    "DS5-INT-1",
    "DS6-INT-1",
    "STAGE-ARCH-3",
    "INT-5",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_OKR_INTEGRATION_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_OKR_INTEGRATION_MODULE_PATHS = Object.freeze(
  EXECUTIVE_OKR_INTEGRATION_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const EXAMPLE_INTEGRATION_SESSION_ID = "eoikr-session-example-001";
const EXAMPLE_REGISTRY_ID = "eoikr-registry-example-001";

function issue(code: string, message: string): ExecutiveOkrValidationIssue {
  return Object.freeze({ code, message });
}

function nowIso(): string {
  return new Date().toISOString();
}

function isExecutiveObjectiveCategory(value: string): value is ExecutiveObjectiveCategory {
  return (EXECUTIVE_OBJECTIVE_CATEGORIES as readonly string[]).includes(value);
}

function isExecutiveOkrLifecycleState(value: string): value is ExecutiveOkrLifecycleState {
  return (EXECUTIVE_OKR_LIFECYCLE_STATES as readonly string[]).includes(value);
}

function isExecutiveOkrReferenceRole(value: string): value is ExecutiveOkrReferenceRole {
  return (EXECUTIVE_OKR_REFERENCE_ROLES as readonly string[]).includes(value);
}

function cloneMetadata(input: {
  hostObject: ExecutiveObject | null;
  tags?: readonly string[];
}): ExecutiveOkrMetadata {
  return Object.freeze({
    tags: Object.freeze([...(input.tags ?? []), "eoikr-integrated"]),
    domainHint: input.hostObject?.metadata.domainHint ?? null,
    executiveCategoryHint: input.hostObject?.metadata.executiveCategoryHint ?? null,
    taxonomyOverride: null,
    extension: Object.freeze({
      taxonomyOverride: null,
      futureExtension: Object.freeze({}),
    }),
  });
}

export function computeExecutiveOkrIntegrationOverallScore(dimensions: ExecutiveOkrScoreDimensions): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveOkrIntegrationMinimumScore(overall: number): boolean {
  return overall >= EXECUTIVE_OKR_INTEGRATION_MINIMUM_OVERALL_SCORE;
}

const ANALYSIS_SCORE_WEIGHTS = Object.freeze({
  architectureHealth: 0.11,
  maintainability: 0.1,
  scalability: 0.09,
  regressionSafety: 0.12,
  registryBoundaryIntegrity: 0.13,
  objectiveIntegrity: 0.12,
  keyResultIntegrity: 0.12,
  identityReferenceIntegrity: 0.12,
  bugTraceability: 0.05,
  certificationReadiness: 0.04,
} as const);

export function computeExecutiveOkrIntegrationAnalysisScore(
  dimensions: ExecutiveOkrAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.registryBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.registryBoundaryIntegrity +
    dimensions.objectiveIntegrity * ANALYSIS_SCORE_WEIGHTS.objectiveIntegrity +
    dimensions.keyResultIntegrity * ANALYSIS_SCORE_WEIGHTS.keyResultIntegrity +
    dimensions.identityReferenceIntegrity * ANALYSIS_SCORE_WEIGHTS.identityReferenceIntegrity +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function computeExecutiveObjectiveContentHash(input: {
  executiveObjectiveId: string;
  displayName: string;
  objectiveCategory: ExecutiveObjectiveCategory;
}): string {
  return Object.freeze(
    `eoikr:objective:${input.executiveObjectiveId}:${input.displayName}:${input.objectiveCategory}`
  );
}

export function computeExecutiveKeyResultContentHash(input: {
  executiveKeyResultId: string;
  executiveObjectiveId: string;
  displayName: string;
  targetDescription: string;
}): string {
  return Object.freeze(
    `eoikr:key-result:${input.executiveKeyResultId}:${input.executiveObjectiveId}:${input.displayName}:${input.targetDescription}`
  );
}

function readOkrDeclarationsFromObject(object: ExecutiveObject): readonly DeclaredObjectiveStub[] {
  const extension = object.metadata.extension.futureExtension;
  if (!extension || typeof extension !== "object") {
    return Object.freeze([]);
  }
  const raw = (extension as Record<string, unknown>)[OKR_DECLARATIONS_EXTENSION_KEY];
  if (!Array.isArray(raw)) {
    return Object.freeze([]);
  }
  return Object.freeze(raw as DeclaredObjectiveStub[]);
}

export function extractOkrDeclarationsFromRegistry(
  registry: ExecutiveObjectRegistry
): ReadonlyArray<DeclaredObjectiveStub & { hostObjectId: string }> {
  const collected: Array<DeclaredObjectiveStub & { hostObjectId: string }> = [];
  for (const object of registry.objects) {
    for (const objective of readOkrDeclarationsFromObject(object)) {
      collected.push(Object.freeze({ ...objective, hostObjectId: object.executiveObjectId }));
    }
  }
  return Object.freeze(collected);
}

export function attachOkrDeclarationsToObjectRegistry(
  objectRegistry: ExecutiveObjectRegistry,
  declarationsByHostObjectId: Readonly<Record<string, readonly DeclaredObjectiveStub[]>>
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
            [OKR_DECLARATIONS_EXTENSION_KEY]: Object.freeze(
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

export function validateDeclaredObjectiveStub(
  input: Partial<DeclaredObjectiveStub>
): ExecutiveOkrValidationResult {
  const issues: ExecutiveOkrValidationIssue[] = [];
  if (!input.executiveObjectiveId?.trim()) {
    issues.push(issue("missing_executive_objective_id", "executiveObjectiveId is required."));
  }
  if (!input.displayName?.trim()) {
    issues.push(issue("missing_display_name", "displayName is required."));
  }
  if (!input.objectiveCategory || !isExecutiveObjectiveCategory(input.objectiveCategory)) {
    issues.push(issue("invalid_objective_category", "objectiveCategory must be one of eight values."));
  }
  if (!input.keyResults) {
    issues.push(issue("missing_key_results", "keyResults is required."));
  } else {
    const keyResultIds = new Set<string>();
    for (const keyResult of input.keyResults) {
      const keyResultValidation = validateDeclaredKeyResultStub(keyResult);
      if (!keyResultValidation.valid) {
        issues.push(...keyResultValidation.issues.map((entry) => issue(`key_result_${entry.code}`, entry.message)));
      }
      if (keyResultIds.has(keyResult.executiveKeyResultId)) {
        issues.push(
          issue("duplicate_declared_key_result_id", `Duplicate key result declaration ${keyResult.executiveKeyResultId}.`)
        );
      }
      keyResultIds.add(keyResult.executiveKeyResultId);
    }
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateDeclaredKeyResultStub(
  input: Partial<DeclaredKeyResultStub>
): ExecutiveOkrValidationResult {
  const issues: ExecutiveOkrValidationIssue[] = [];
  if (!input.executiveKeyResultId?.trim()) {
    issues.push(issue("missing_executive_key_result_id", "executiveKeyResultId is required."));
  }
  if (!input.displayName?.trim()) {
    issues.push(issue("missing_display_name", "displayName is required."));
  }
  if (!input.targetDescription?.trim()) {
    issues.push(issue("missing_target_description", "targetDescription is required."));
  }

  if (!input.objectReferences || input.objectReferences.length === 0) {
    issues.push(issue("missing_object_references", "objectReferences must include at least one reference."));
  }
  if (!input.relationshipReferences || input.relationshipReferences.length === 0) {
    issues.push(
      issue("missing_relationship_references", "relationshipReferences must include at least one reference.")
    );
  }
  if (!input.kpiReferences || input.kpiReferences.length === 0) {
    issues.push(issue("missing_kpi_references", "kpiReferences must include at least one reference."));
  }
  if (!input.riskReferences || input.riskReferences.length === 0) {
    issues.push(issue("missing_risk_references", "riskReferences must include at least one reference."));
  }
  if (!input.scenarioReferences || input.scenarioReferences.length === 0) {
    issues.push(issue("missing_scenario_references", "scenarioReferences must include at least one reference."));
  }

  const validateRole = (role: string | undefined, context: string): void => {
    if (!role || !isExecutiveOkrReferenceRole(role)) {
      issues.push(issue("invalid_reference_role", `${context} referenceRole is invalid.`));
    }
  };
  for (const reference of input.objectReferences ?? []) validateRole(reference.referenceRole, "object");
  for (const reference of input.relationshipReferences ?? []) validateRole(reference.referenceRole, "relationship");
  for (const reference of input.kpiReferences ?? []) validateRole(reference.referenceRole, "kpi");
  for (const reference of input.riskReferences ?? []) validateRole(reference.referenceRole, "risk");
  for (const reference of input.scenarioReferences ?? []) validateRole(reference.referenceRole, "scenario");

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveObjective(input: Partial<ExecutiveObjective>): ExecutiveOkrValidationResult {
  const issues: ExecutiveOkrValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_OKR_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match OKR-INT-1."));
  }
  if (!input.executiveObjectiveId?.trim()) {
    issues.push(issue("missing_executive_objective_id", "executiveObjectiveId is required."));
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
  if (!input.objectiveCategory || !isExecutiveObjectiveCategory(input.objectiveCategory)) {
    issues.push(issue("invalid_objective_category", "objectiveCategory must be one of eight values."));
  }
  if (!input.metadata) {
    issues.push(issue("missing_metadata", "metadata is required."));
  }
  if (!input.lifecycleState || !isExecutiveOkrLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "lifecycleState must be one of six lifecycle values."));
  }
  if (!input.createdAt?.trim()) {
    issues.push(issue("missing_created_at", "createdAt is required."));
  }
  if (!input.updatedAt?.trim()) {
    issues.push(issue("missing_updated_at", "updatedAt is required."));
  }
  if (input.source !== EXECUTIVE_OKR_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-9-executive-okr-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveKeyResult(input: Partial<ExecutiveKeyResult>): ExecutiveOkrValidationResult {
  const issues: ExecutiveOkrValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_OKR_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match OKR-INT-1."));
  }
  if (!input.executiveKeyResultId?.trim()) {
    issues.push(issue("missing_executive_key_result_id", "executiveKeyResultId is required."));
  }
  if (!input.executiveObjectiveId?.trim()) {
    issues.push(issue("missing_executive_objective_id", "executiveObjectiveId is required."));
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
  if (!input.targetDescription?.trim()) {
    issues.push(issue("missing_target_description", "targetDescription is required."));
  }
  if (!input.objectReferences) {
    issues.push(issue("missing_object_references", "objectReferences is required."));
  }
  if (!input.relationshipReferences) {
    issues.push(issue("missing_relationship_references", "relationshipReferences is required."));
  }
  if (!input.kpiReferences) {
    issues.push(issue("missing_kpi_references", "kpiReferences is required."));
  }
  if (!input.riskReferences) {
    issues.push(issue("missing_risk_references", "riskReferences is required."));
  }
  if (!input.scenarioReferences) {
    issues.push(issue("missing_scenario_references", "scenarioReferences is required."));
  }
  if (!input.metadata) {
    issues.push(issue("missing_metadata", "metadata is required."));
  }
  if (!input.lifecycleState || !isExecutiveOkrLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "lifecycleState must be one of six lifecycle values."));
  }
  if (!input.createdAt?.trim()) {
    issues.push(issue("missing_created_at", "createdAt is required."));
  }
  if (!input.updatedAt?.trim()) {
    issues.push(issue("missing_updated_at", "updatedAt is required."));
  }
  if (input.source !== EXECUTIVE_OKR_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-9-executive-okr-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveOkrRegistry(
  input: Partial<ExecutiveOkrRegistry>,
  context?: {
    objectRegistry?: ExecutiveObjectRegistry;
    relationshipRegistry?: ExecutiveRelationshipRegistry;
    kpiRegistry?: ExecutiveKpiRegistry;
    riskRegistry?: ExecutiveRiskRegistry;
    scenarioRegistry?: ExecutiveScenarioRegistry;
  }
): ExecutiveOkrValidationResult {
  const issues: ExecutiveOkrValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_OKR_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match OKR-INT-1."));
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
  if (!input.riskRegistryId?.trim()) {
    issues.push(issue("missing_risk_registry_id", "riskRegistryId is required."));
  }
  if (!input.scenarioRegistryId?.trim()) {
    issues.push(issue("missing_scenario_registry_id", "scenarioRegistryId is required."));
  }
  if (!input.integrationSessionId?.trim()) {
    issues.push(issue("missing_integration_session_id", "integrationSessionId is required."));
  }
  if (!input.objectives) {
    issues.push(issue("missing_objectives", "objectives array is required."));
  } else {
    const objectiveIds = new Set<string>();
    for (const objective of input.objectives) {
      const objectiveValidation = validateExecutiveObjective(objective);
      if (!objectiveValidation.valid) {
        issues.push(...objectiveValidation.issues.map((entry) => issue(`objective_${entry.code}`, entry.message)));
      }
      if (objective.workspaceId !== input.workspaceId) {
        issues.push(issue("objective_workspace_mismatch", `Objective ${objective.executiveObjectiveId} workspace mismatch.`));
      }
      if (objective.executiveModelId !== input.executiveModelId) {
        issues.push(issue("objective_model_mismatch", `Objective ${objective.executiveObjectiveId} model mismatch.`));
      }
      if (objectiveIds.has(objective.executiveObjectiveId)) {
        issues.push(
          issue("duplicate_executive_objective_id", `Duplicate objective id ${objective.executiveObjectiveId}.`)
        );
      }
      objectiveIds.add(objective.executiveObjectiveId);
    }
    if (input.objectiveCount !== undefined && input.objectiveCount !== input.objectives.length) {
      issues.push(issue("objective_count_mismatch", "objectiveCount must match objectives length."));
    }
  }
  if (!input.keyResults) {
    issues.push(issue("missing_key_results", "keyResults array is required."));
  } else {
    const keyResultIds = new Set<string>();
    const objectiveIds = new Set((input.objectives ?? []).map((entry) => entry.executiveObjectiveId));
    for (const keyResult of input.keyResults) {
      const keyResultValidation = validateExecutiveKeyResult(keyResult);
      if (!keyResultValidation.valid) {
        issues.push(...keyResultValidation.issues.map((entry) => issue(`key_result_${entry.code}`, entry.message)));
      }
      if (keyResult.workspaceId !== input.workspaceId) {
        issues.push(
          issue("key_result_workspace_mismatch", `Key result ${keyResult.executiveKeyResultId} workspace mismatch.`)
        );
      }
      if (keyResult.executiveModelId !== input.executiveModelId) {
        issues.push(issue("key_result_model_mismatch", `Key result ${keyResult.executiveKeyResultId} model mismatch.`));
      }
      if (!objectiveIds.has(keyResult.executiveObjectiveId)) {
        issues.push(
          issue(
            "key_result_objective_missing",
            `Key result ${keyResult.executiveKeyResultId} references missing objective ${keyResult.executiveObjectiveId}.`
          )
        );
      }
      if (keyResultIds.has(keyResult.executiveKeyResultId)) {
        issues.push(
          issue("duplicate_executive_key_result_id", `Duplicate key result id ${keyResult.executiveKeyResultId}.`)
        );
      }
      keyResultIds.add(keyResult.executiveKeyResultId);

      if (context?.objectRegistry) {
        const objectReferenceValidation = validateKeyResultObjectReferences({
          objectReferences: keyResult.objectReferences,
          objectRegistry: context.objectRegistry,
        });
        if (!objectReferenceValidation.valid) issues.push(...objectReferenceValidation.issues);
      }
      if (context?.relationshipRegistry) {
        const relationshipReferenceValidation = validateKeyResultRelationshipReferences({
          relationshipReferences: keyResult.relationshipReferences,
          relationshipRegistry: context.relationshipRegistry,
        });
        if (!relationshipReferenceValidation.valid) issues.push(...relationshipReferenceValidation.issues);
      }
      if (context?.kpiRegistry) {
        const kpiReferenceValidation = validateKeyResultKpiReferences({
          kpiReferences: keyResult.kpiReferences,
          kpiRegistry: context.kpiRegistry,
        });
        if (!kpiReferenceValidation.valid) issues.push(...kpiReferenceValidation.issues);
      }
      if (context?.riskRegistry) {
        const riskReferenceValidation = validateKeyResultRiskReferences({
          riskReferences: keyResult.riskReferences,
          riskRegistry: context.riskRegistry,
        });
        if (!riskReferenceValidation.valid) issues.push(...riskReferenceValidation.issues);
      }
      if (context?.scenarioRegistry) {
        const scenarioReferenceValidation = validateKeyResultScenarioReferences({
          scenarioReferences: keyResult.scenarioReferences,
          scenarioRegistry: context.scenarioRegistry,
        });
        if (!scenarioReferenceValidation.valid) issues.push(...scenarioReferenceValidation.issues);
      }
    }
    if (input.keyResultCount !== undefined && input.keyResultCount !== input.keyResults.length) {
      issues.push(issue("key_result_count_mismatch", "keyResultCount must match keyResults length."));
    }
  }
  if (input.source !== EXECUTIVE_OKR_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "registry source must be phase-9-executive-okr-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateObjectRegistryIntegrationInput(
  registry: Partial<ExecutiveObjectRegistry>
): ExecutiveOkrValidationResult {
  return validateExecutiveObjectRegistry(registry);
}

export function validateRelationshipRegistryIntegrationInput(
  registry: Partial<ExecutiveRelationshipRegistry>
): ExecutiveOkrValidationResult {
  return validateExecutiveRelationshipRegistry(registry);
}

export function validateKpiRegistryIntegrationInput(
  registry: Partial<ExecutiveKpiRegistry>
): ExecutiveOkrValidationResult {
  return validateExecutiveKpiRegistry(registry);
}

export function validateRiskRegistryIntegrationInput(
  registry: Partial<ExecutiveRiskRegistry>
): ExecutiveOkrValidationResult {
  return validateExecutiveRiskRegistry(registry);
}

export function validateScenarioRegistryIntegrationInput(
  registry: Partial<ExecutiveScenarioRegistry>
): ExecutiveOkrValidationResult {
  return validateExecutiveScenarioRegistry(registry);
}

export function validateKeyResultObjectReferences(input: {
  objectReferences: readonly ExecutiveOkrObjectReference[];
  objectRegistry: ExecutiveObjectRegistry;
}): ExecutiveOkrValidationResult {
  const issues: ExecutiveOkrValidationIssue[] = [];
  const seen = new Set<string>();
  for (const reference of input.objectReferences) {
    if (!reference.executiveObjectId?.trim()) {
      issues.push(issue("missing_reference_object_id", "objectReferences executiveObjectId is required."));
      continue;
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

export function validateKeyResultRelationshipReferences(input: {
  relationshipReferences: readonly ExecutiveOkrRelationshipReference[];
  relationshipRegistry: ExecutiveRelationshipRegistry;
}): ExecutiveOkrValidationResult {
  const issues: ExecutiveOkrValidationIssue[] = [];
  const seen = new Set<string>();
  for (const reference of input.relationshipReferences) {
    if (!reference.executiveRelationshipId?.trim()) {
      issues.push(
        issue("missing_reference_relationship_id", "relationshipReferences executiveRelationshipId is required.")
      );
      continue;
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
        issue(
          "duplicate_relationship_reference",
          `Duplicate relationship reference ${reference.executiveRelationshipId}.`
        )
      );
    }
    seen.add(reference.executiveRelationshipId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateKeyResultKpiReferences(input: {
  kpiReferences: readonly ExecutiveOkrKpiReference[];
  kpiRegistry: ExecutiveKpiRegistry;
}): ExecutiveOkrValidationResult {
  const issues: ExecutiveOkrValidationIssue[] = [];
  const seen = new Set<string>();
  for (const reference of input.kpiReferences) {
    if (!reference.executiveKpiId?.trim()) {
      issues.push(issue("missing_reference_kpi_id", "kpiReferences executiveKpiId is required."));
      continue;
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

export function validateKeyResultRiskReferences(input: {
  riskReferences: readonly ExecutiveOkrRiskReference[];
  riskRegistry: ExecutiveRiskRegistry;
}): ExecutiveOkrValidationResult {
  const issues: ExecutiveOkrValidationIssue[] = [];
  const seen = new Set<string>();
  for (const reference of input.riskReferences) {
    if (!reference.executiveRiskId?.trim()) {
      issues.push(issue("missing_reference_risk_id", "riskReferences executiveRiskId is required."));
      continue;
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

export function validateKeyResultScenarioReferences(input: {
  scenarioReferences: readonly ExecutiveOkrScenarioReference[];
  scenarioRegistry: ExecutiveScenarioRegistry;
}): ExecutiveOkrValidationResult {
  const issues: ExecutiveOkrValidationIssue[] = [];
  const seen = new Set<string>();
  for (const reference of input.scenarioReferences) {
    if (!reference.executiveScenarioId?.trim()) {
      issues.push(issue("missing_reference_scenario_id", "scenarioReferences executiveScenarioId is required."));
      continue;
    }
    if (!resolveExecutiveScenarioById(input.scenarioRegistry, reference.executiveScenarioId)) {
      issues.push(
        issue("reference_scenario_missing", `Scenario ${reference.executiveScenarioId} not in scenario registry.`)
      );
    }
    if (seen.has(reference.executiveScenarioId)) {
      issues.push(issue("duplicate_scenario_reference", `Duplicate scenario reference ${reference.executiveScenarioId}.`));
    }
    seen.add(reference.executiveScenarioId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function buildExecutiveObjectiveFromStub(input: {
  stub: DeclaredObjectiveStub & { hostObjectId: string };
  objectRegistry: ExecutiveObjectRegistry;
  relationshipRegistry: ExecutiveRelationshipRegistry;
  kpiRegistry: ExecutiveKpiRegistry;
  riskRegistry: ExecutiveRiskRegistry;
  scenarioRegistry: ExecutiveScenarioRegistry;
  integrationSessionId: string;
  timestamp: string;
}): ExecutiveObjective {
  const hostObject = resolveExecutiveObjectById(input.objectRegistry, input.stub.hostObjectId);
  const metadata = cloneMetadata({
    hostObject,
    tags: input.stub.metadata?.tags,
  });
  const contentHash = computeExecutiveObjectiveContentHash({
    executiveObjectiveId: input.stub.executiveObjectiveId,
    displayName: input.stub.displayName,
    objectiveCategory: input.stub.objectiveCategory,
  });
  return Object.freeze({
    contractVersion: EXECUTIVE_OKR_INTEGRATION_VERSION,
    executiveObjectiveId: input.stub.executiveObjectiveId,
    workspaceId: input.objectRegistry.workspaceId,
    executiveModelId: input.objectRegistry.executiveModelId,
    displayName: input.stub.displayName,
    objectiveCategory: input.stub.objectiveCategory,
    metadata,
    lifecycleState: "defined",
    objectRegistryId: input.objectRegistry.registryId,
    relationshipRegistryId: input.relationshipRegistry.registryId,
    kpiRegistryId: input.kpiRegistry.registryId,
    riskRegistryId: input.riskRegistry.registryId,
    scenarioRegistryId: input.scenarioRegistry.registryId,
    hostObjectId: input.stub.hostObjectId,
    integrationSessionId: input.integrationSessionId,
    contentHash,
    createdAt: input.timestamp,
    updatedAt: input.timestamp,
    source: EXECUTIVE_OKR_INTEGRATION_SOURCE,
  });
}

function buildExecutiveKeyResultFromStub(input: {
  objective: ExecutiveObjective;
  keyResultStub: DeclaredKeyResultStub;
  objectRegistry: ExecutiveObjectRegistry;
  relationshipRegistry: ExecutiveRelationshipRegistry;
  kpiRegistry: ExecutiveKpiRegistry;
  riskRegistry: ExecutiveRiskRegistry;
  scenarioRegistry: ExecutiveScenarioRegistry;
  integrationSessionId: string;
  timestamp: string;
}): ExecutiveKeyResult {
  const metadata = cloneMetadata({
    hostObject: null,
    tags: input.keyResultStub.metadata?.tags,
  });
  const contentHash = computeExecutiveKeyResultContentHash({
    executiveKeyResultId: input.keyResultStub.executiveKeyResultId,
    executiveObjectiveId: input.objective.executiveObjectiveId,
    displayName: input.keyResultStub.displayName,
    targetDescription: input.keyResultStub.targetDescription,
  });
  return Object.freeze({
    contractVersion: EXECUTIVE_OKR_INTEGRATION_VERSION,
    executiveKeyResultId: input.keyResultStub.executiveKeyResultId,
    executiveObjectiveId: input.objective.executiveObjectiveId,
    workspaceId: input.objective.workspaceId,
    executiveModelId: input.objective.executiveModelId,
    displayName: input.keyResultStub.displayName,
    targetDescription: input.keyResultStub.targetDescription,
    objectReferences: Object.freeze(input.keyResultStub.objectReferences.map((entry) => Object.freeze({ ...entry }))),
    relationshipReferences: Object.freeze(
      input.keyResultStub.relationshipReferences.map((entry) => Object.freeze({ ...entry }))
    ),
    kpiReferences: Object.freeze(input.keyResultStub.kpiReferences.map((entry) => Object.freeze({ ...entry }))),
    riskReferences: Object.freeze(input.keyResultStub.riskReferences.map((entry) => Object.freeze({ ...entry }))),
    scenarioReferences: Object.freeze(
      input.keyResultStub.scenarioReferences.map((entry) => Object.freeze({ ...entry }))
    ),
    metadata,
    lifecycleState: "defined",
    objectRegistryId: input.objectRegistry.registryId,
    relationshipRegistryId: input.relationshipRegistry.registryId,
    kpiRegistryId: input.kpiRegistry.registryId,
    riskRegistryId: input.riskRegistry.registryId,
    scenarioRegistryId: input.scenarioRegistry.registryId,
    integrationSessionId: input.integrationSessionId,
    contentHash,
    createdAt: input.timestamp,
    updatedAt: input.timestamp,
    source: EXECUTIVE_OKR_INTEGRATION_SOURCE,
  });
}

function promoteExecutiveObjectiveLifecycle(objective: ExecutiveObjective): ExecutiveObjective {
  const validation = validateExecutiveObjective(objective);
  if (!validation.valid) return objective;
  return Object.freeze({ ...objective, lifecycleState: "validated" as const, updatedAt: nowIso() });
}

function promoteExecutiveKeyResultLifecycle(keyResult: ExecutiveKeyResult): ExecutiveKeyResult {
  const validation = validateExecutiveKeyResult(keyResult);
  if (!validation.valid) return keyResult;
  return Object.freeze({ ...keyResult, lifecycleState: "validated" as const, updatedAt: nowIso() });
}

function validatePentaRegistryScope(input: ExecutiveOkrIntegrationInput): ExecutiveOkrValidationResult {
  const { objectRegistry, relationshipRegistry, kpiRegistry, riskRegistry, scenarioRegistry } = input;
  const issues: ExecutiveOkrValidationIssue[] = [];
  const registries = [relationshipRegistry, kpiRegistry, riskRegistry, scenarioRegistry];
  for (const registry of registries) {
    if (
      objectRegistry.workspaceId !== registry.workspaceId ||
      objectRegistry.executiveModelId !== registry.executiveModelId
    ) {
      issues.push(
        issue("registry_scope_mismatch", "All registries must share workspaceId and executiveModelId scope.")
      );
      break;
    }
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function integrateExecutiveOkrsFromRegistries(
  input: ExecutiveOkrIntegrationInput
): ExecutiveOkrIntegrationResult {
  const integrationSessionId = input.integrationSessionId?.trim() || `eoikr-${Date.now()}`;
  const timestamp = nowIso();

  const objectRegistryValidation = validateObjectRegistryIntegrationInput(input.objectRegistry);
  if (!objectRegistryValidation.valid) {
    recordExecutiveOkrDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.objectRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      objectives: Object.freeze([]),
      keyResults: Object.freeze([]),
      issues: objectRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const relationshipRegistryValidation = validateRelationshipRegistryIntegrationInput(input.relationshipRegistry);
  if (!relationshipRegistryValidation.valid) {
    recordExecutiveOkrDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.relationshipRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      objectives: Object.freeze([]),
      keyResults: Object.freeze([]),
      issues: relationshipRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const kpiRegistryValidation = validateKpiRegistryIntegrationInput(input.kpiRegistry);
  if (!kpiRegistryValidation.valid) {
    recordExecutiveOkrDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.kpiRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      objectives: Object.freeze([]),
      keyResults: Object.freeze([]),
      issues: kpiRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const riskRegistryValidation = validateRiskRegistryIntegrationInput(input.riskRegistry);
  if (!riskRegistryValidation.valid) {
    recordExecutiveOkrDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.riskRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      objectives: Object.freeze([]),
      keyResults: Object.freeze([]),
      issues: riskRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const scenarioRegistryValidation = validateScenarioRegistryIntegrationInput(input.scenarioRegistry);
  if (!scenarioRegistryValidation.valid) {
    recordExecutiveOkrDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.scenarioRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      objectives: Object.freeze([]),
      keyResults: Object.freeze([]),
      issues: scenarioRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const scopeValidation = validatePentaRegistryScope(input);
  if (!scopeValidation.valid) {
    recordExecutiveOkrDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.objectRegistry.workspaceId,
    });
    return Object.freeze({
      success: false,
      registry: null,
      objectives: Object.freeze([]),
      keyResults: Object.freeze([]),
      issues: scopeValidation.issues,
      integrationSessionId,
    });
  }

  const declarations = extractOkrDeclarationsFromRegistry(input.objectRegistry);
  const objectiveIds = new Set<string>();
  const keyResultIds = new Set<string>();
  const objectives: ExecutiveObjective[] = [];
  const keyResults: ExecutiveKeyResult[] = [];
  const integrationIssues: ExecutiveOkrValidationIssue[] = [];

  for (const declaration of declarations) {
    const declaredObjectiveValidation = validateDeclaredObjectiveStub(declaration);
    if (!declaredObjectiveValidation.valid) {
      integrationIssues.push(...declaredObjectiveValidation.issues);
      continue;
    }
    if (objectiveIds.has(declaration.executiveObjectiveId)) {
      integrationIssues.push(
        issue("duplicate_executive_objective_id", `Duplicate declaration id ${declaration.executiveObjectiveId}.`)
      );
      continue;
    }
    objectiveIds.add(declaration.executiveObjectiveId);

    const objective = buildExecutiveObjectiveFromStub({
      stub: declaration,
      objectRegistry: input.objectRegistry,
      relationshipRegistry: input.relationshipRegistry,
      kpiRegistry: input.kpiRegistry,
      riskRegistry: input.riskRegistry,
      scenarioRegistry: input.scenarioRegistry,
      integrationSessionId,
      timestamp,
    });

    recordExecutiveOkrDiagnosticEvent({
      type: "ObjectiveDeclared",
      integrationSessionId,
      workspaceId: objective.workspaceId,
      executiveObjectiveId: objective.executiveObjectiveId,
    });
    recordExecutiveOkrDiagnostic({
      type: "ObjectiveDeclared",
      integrationSessionId,
      workspaceId: objective.workspaceId,
      executiveObjectiveId: objective.executiveObjectiveId,
      message: `Objective ${objective.executiveObjectiveId} declared.`,
    });

    const objectiveValidation = validateExecutiveObjective(objective);
    if (!objectiveValidation.valid) {
      integrationIssues.push(...objectiveValidation.issues);
      continue;
    }

    const promotedObjective = promoteExecutiveObjectiveLifecycle(objective);
    objectives.push(promotedObjective);
    recordExecutiveOkrDiagnosticEvent({
      type: "ObjectiveValidated",
      integrationSessionId,
      workspaceId: promotedObjective.workspaceId,
      executiveObjectiveId: promotedObjective.executiveObjectiveId,
    });
    recordExecutiveOkrDiagnostic({
      type: "ObjectiveValidated",
      integrationSessionId,
      workspaceId: promotedObjective.workspaceId,
      executiveObjectiveId: promotedObjective.executiveObjectiveId,
      message: `Objective ${promotedObjective.executiveObjectiveId} validated.`,
    });

    for (const keyResultDeclaration of declaration.keyResults) {
      const declaredKeyResultValidation = validateDeclaredKeyResultStub(keyResultDeclaration);
      if (!declaredKeyResultValidation.valid) {
        integrationIssues.push(...declaredKeyResultValidation.issues);
        continue;
      }
      if (keyResultIds.has(keyResultDeclaration.executiveKeyResultId)) {
        integrationIssues.push(
          issue(
            "duplicate_executive_key_result_id",
            `Duplicate key result declaration ${keyResultDeclaration.executiveKeyResultId}.`
          )
        );
        continue;
      }
      keyResultIds.add(keyResultDeclaration.executiveKeyResultId);

      const keyResult = buildExecutiveKeyResultFromStub({
        objective: promotedObjective,
        keyResultStub: keyResultDeclaration,
        objectRegistry: input.objectRegistry,
        relationshipRegistry: input.relationshipRegistry,
        kpiRegistry: input.kpiRegistry,
        riskRegistry: input.riskRegistry,
        scenarioRegistry: input.scenarioRegistry,
        integrationSessionId,
        timestamp,
      });

      recordExecutiveOkrDiagnosticEvent({
        type: "KeyResultDeclared",
        integrationSessionId,
        workspaceId: keyResult.workspaceId,
        executiveObjectiveId: keyResult.executiveObjectiveId,
        executiveKeyResultId: keyResult.executiveKeyResultId,
      });
      recordExecutiveOkrDiagnostic({
        type: "KeyResultDeclared",
        integrationSessionId,
        workspaceId: keyResult.workspaceId,
        executiveObjectiveId: keyResult.executiveObjectiveId,
        executiveKeyResultId: keyResult.executiveKeyResultId,
        message: `Key result ${keyResult.executiveKeyResultId} declared.`,
      });

      const keyResultValidation = validateExecutiveKeyResult(keyResult);
      if (!keyResultValidation.valid) {
        integrationIssues.push(...keyResultValidation.issues);
        continue;
      }

      const objectReferenceValidation = validateKeyResultObjectReferences({
        objectReferences: keyResult.objectReferences,
        objectRegistry: input.objectRegistry,
      });
      if (!objectReferenceValidation.valid) {
        integrationIssues.push(...objectReferenceValidation.issues);
        continue;
      }
      const relationshipReferenceValidation = validateKeyResultRelationshipReferences({
        relationshipReferences: keyResult.relationshipReferences,
        relationshipRegistry: input.relationshipRegistry,
      });
      if (!relationshipReferenceValidation.valid) {
        integrationIssues.push(...relationshipReferenceValidation.issues);
        continue;
      }
      const kpiReferenceValidation = validateKeyResultKpiReferences({
        kpiReferences: keyResult.kpiReferences,
        kpiRegistry: input.kpiRegistry,
      });
      if (!kpiReferenceValidation.valid) {
        integrationIssues.push(...kpiReferenceValidation.issues);
        continue;
      }
      const riskReferenceValidation = validateKeyResultRiskReferences({
        riskReferences: keyResult.riskReferences,
        riskRegistry: input.riskRegistry,
      });
      if (!riskReferenceValidation.valid) {
        integrationIssues.push(...riskReferenceValidation.issues);
        continue;
      }
      const scenarioReferenceValidation = validateKeyResultScenarioReferences({
        scenarioReferences: keyResult.scenarioReferences,
        scenarioRegistry: input.scenarioRegistry,
      });
      if (!scenarioReferenceValidation.valid) {
        integrationIssues.push(...scenarioReferenceValidation.issues);
        continue;
      }

      const promotedKeyResult = promoteExecutiveKeyResultLifecycle(keyResult);
      keyResults.push(promotedKeyResult);
      recordExecutiveOkrDiagnosticEvent({
        type: "KeyResultValidated",
        integrationSessionId,
        workspaceId: promotedKeyResult.workspaceId,
        executiveObjectiveId: promotedKeyResult.executiveObjectiveId,
        executiveKeyResultId: promotedKeyResult.executiveKeyResultId,
      });
      recordExecutiveOkrDiagnostic({
        type: "KeyResultValidated",
        integrationSessionId,
        workspaceId: promotedKeyResult.workspaceId,
        executiveObjectiveId: promotedKeyResult.executiveObjectiveId,
        executiveKeyResultId: promotedKeyResult.executiveKeyResultId,
        message: `Key result ${promotedKeyResult.executiveKeyResultId} validated.`,
      });
    }
  }

  const frozenObjectives = Object.freeze(objectives);
  const frozenKeyResults = Object.freeze(keyResults);
  const registry: ExecutiveOkrRegistry = Object.freeze({
    contractVersion: EXECUTIVE_OKR_INTEGRATION_VERSION,
    registryId: `${integrationSessionId}-registry`,
    workspaceId: input.objectRegistry.workspaceId,
    executiveModelId: input.objectRegistry.executiveModelId,
    objectRegistryId: input.objectRegistry.registryId,
    relationshipRegistryId: input.relationshipRegistry.registryId,
    kpiRegistryId: input.kpiRegistry.registryId,
    riskRegistryId: input.riskRegistry.registryId,
    scenarioRegistryId: input.scenarioRegistry.registryId,
    integrationSessionId,
    objectives: frozenObjectives,
    keyResults: frozenKeyResults,
    objectiveCount: frozenObjectives.length,
    keyResultCount: frozenKeyResults.length,
    registryState: "validated",
    source: EXECUTIVE_OKR_INTEGRATION_SOURCE,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const outputValidation = validateExecutiveOkrRegistry(registry, {
    objectRegistry: input.objectRegistry,
    relationshipRegistry: input.relationshipRegistry,
    kpiRegistry: input.kpiRegistry,
    riskRegistry: input.riskRegistry,
    scenarioRegistry: input.scenarioRegistry,
  });

  if (integrationIssues.length > 0 || !outputValidation.valid) {
    const issues = Object.freeze([...integrationIssues, ...outputValidation.issues]);
    recordExecutiveOkrDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.objectRegistry.workspaceId,
    });
    recordExecutiveOkrDiagnostic({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.objectRegistry.workspaceId,
      message: "Executive OKR registry validation failed.",
    });
    return Object.freeze({
      success: false,
      registry: null,
      objectives: frozenObjectives,
      keyResults: frozenKeyResults,
      issues,
      integrationSessionId,
    });
  }

  recordExecutiveOkrDiagnosticEvent({
    type: "OkrRegistered",
    integrationSessionId,
    workspaceId: registry.workspaceId,
  });
  recordExecutiveOkrDiagnostic({
    type: "OkrRegistered",
    integrationSessionId,
    workspaceId: registry.workspaceId,
    message: `Registered ${registry.objectiveCount} objective(s) and ${registry.keyResultCount} key result(s).`,
  });

  return Object.freeze({
    success: true,
    registry: Object.freeze({ ...registry, registryId: `${integrationSessionId}-registry` }),
    objectives: frozenObjectives,
    keyResults: frozenKeyResults,
    issues: Object.freeze([]),
    integrationSessionId,
  });
}

export function resolveExecutiveObjectiveById(
  registry: ExecutiveOkrRegistry,
  executiveObjectiveId: string
): ExecutiveObjective | null {
  return registry.objectives.find((entry) => entry.executiveObjectiveId === executiveObjectiveId) ?? null;
}

export function resolveExecutiveKeyResultById(
  registry: ExecutiveOkrRegistry,
  executiveKeyResultId: string
): ExecutiveKeyResult | null {
  return registry.keyResults.find((entry) => entry.executiveKeyResultId === executiveKeyResultId) ?? null;
}

export function listKeyResultsForObjective(
  registry: ExecutiveOkrRegistry,
  executiveObjectiveId: string
): readonly ExecutiveKeyResult[] {
  return Object.freeze(registry.keyResults.filter((entry) => entry.executiveObjectiveId === executiveObjectiveId));
}

export function listExecutiveObjectivesByCategory(
  registry: ExecutiveOkrRegistry,
  objectiveCategory: ExecutiveObjectiveCategory
): readonly ExecutiveObjective[] {
  return Object.freeze(registry.objectives.filter((entry) => entry.objectiveCategory === objectiveCategory));
}

export function listKeyResultsForKpi(
  registry: ExecutiveOkrRegistry,
  executiveKpiId: string
): readonly ExecutiveKeyResult[] {
  return Object.freeze(
    registry.keyResults.filter((entry) =>
      entry.kpiReferences.some((reference) => reference.executiveKpiId === executiveKpiId)
    )
  );
}

export function buildExecutiveOkrOwnershipContract(registry: ExecutiveOkrRegistry): ExecutiveOkrOwnershipContract {
  return Object.freeze({
    registryId: registry.registryId,
    workspaceId: registry.workspaceId,
    executiveModelId: registry.executiveModelId,
    objectRegistryId: registry.objectRegistryId,
    relationshipRegistryId: registry.relationshipRegistryId,
    kpiRegistryId: registry.kpiRegistryId,
    riskRegistryId: registry.riskRegistryId,
    scenarioRegistryId: registry.scenarioRegistryId,
    isolationPolicy: "workspace-exclusive",
    upstreamAuthority: "phase-8-executive-scenario-integration",
    mutationPolicy: "integration-derived-immutable-snapshot",
  });
}

export function validateEoikrPentaRegistryInputBoundary(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("ds1_direct_consumption") &&
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("emg_direct_consumption") &&
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("emg_model_record_consumption") &&
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("persistence") &&
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("scene_sync");
  return Object.freeze({
    valid,
    evidence: valid
      ? "Penta-registry input boundary locked; DS-1, EMG, persistence, and scene sync excluded."
      : "Penta-registry input boundary incomplete.",
  });
}

export function validateEoikrNoCalculationIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("progress_calculation") &&
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("achievement_scoring") &&
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("kpi_calculations") &&
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("kpi_formula_execution") &&
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("prediction_engine");
  return Object.freeze({
    valid,
    evidence: valid
      ? "Declarative OKR integration only; progress, KPI calculation, and prediction are excluded."
      : "No-calculation boundary incomplete.",
  });
}

export function validateEoikrReferenceIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const valid =
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("relationship_inference") &&
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("graph_algorithms") &&
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("path_finding") &&
    EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("dependency_calculation") &&
    EXECUTIVE_OKR_REFERENCE_ROLES.length === 4;
  return Object.freeze({
    valid,
    evidence: valid
      ? "Identity-based penta references enforced; no inference or graph traversal behavior."
      : "Reference integrity boundary incomplete.",
  });
}

export function resolveExecutiveObjectRegistryWithOkrDeclarationsExample(): ExecutiveObjectRegistry {
  const baseRegistry = resolveExecutiveObjectRegistryWithScenarioDeclarationsExample();
  return attachOkrDeclarationsToObjectRegistry(baseRegistry, {
    "emg-obj-outcome": Object.freeze([
      Object.freeze({
        executiveObjectiveId: "eoikr-objective-outcome-delivery-001",
        displayName: "Outcome Delivery Predictability",
        objectiveCategory: "operational" as const,
        keyResults: Object.freeze([
          Object.freeze({
            executiveKeyResultId: "eoikr-kr-outcome-delivery-001",
            displayName: "Outcome Delivery Assurance",
            targetDescription:
              "Declare measurable delivery assurance target tied to supplier dependency and contingency readiness.",
            objectReferences: Object.freeze([
              Object.freeze({
                executiveObjectId: "emg-obj-outcome",
                referenceRole: "primary" as const,
              }),
            ]),
            relationshipReferences: Object.freeze([
              Object.freeze({
                executiveRelationshipId: "eri-rel-supplier-outcome-001",
                referenceRole: "context" as const,
              }),
            ]),
            kpiReferences: Object.freeze([
              Object.freeze({
                executiveKpiId: "eki-kpi-outcome-delivery-001",
                referenceRole: "primary" as const,
              }),
            ]),
            riskReferences: Object.freeze([
              Object.freeze({
                executiveRiskId: "erir-risk-outcome-delivery-001",
                referenceRole: "primary" as const,
              }),
            ]),
            scenarioReferences: Object.freeze([
              Object.freeze({
                executiveScenarioId: "esis-scenario-outcome-delay-001",
                referenceRole: "secondary" as const,
              }),
            ]),
            metadata: Object.freeze({ tags: Object.freeze(["example", "outcome-delivery"]) }),
          }),
        ]),
        metadata: Object.freeze({ tags: Object.freeze(["example", "operational-objective"]) }),
      }),
    ]),
  });
}

export function resolveExecutiveOkrIntegrationInputExample(): ExecutiveOkrIntegrationInput {
  const objectRegistry = resolveExecutiveObjectRegistryWithOkrDeclarationsExample();
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  const kpiRegistry = resolveExecutiveKpiRegistryExample();
  const riskRegistry = resolveExecutiveRiskRegistryExample();
  const scenarioRegistry = resolveExecutiveScenarioRegistryExample();
  return Object.freeze({
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
    riskRegistry,
    scenarioRegistry,
    integrationSessionId: EXAMPLE_INTEGRATION_SESSION_ID,
  });
}

export function resolveExecutiveOkrRegistryExample(): ExecutiveOkrRegistry {
  const input = resolveExecutiveOkrIntegrationInputExample();
  const integration = integrateExecutiveOkrsFromRegistries(input);
  if (!integration.registry) {
    throw new Error("Executive OKR registry example failed to build.");
  }
  return Object.freeze({ ...integration.registry, registryId: EXAMPLE_REGISTRY_ID });
}

export function resolveExecutiveObjectiveExample(): ExecutiveObjective {
  const registry = resolveExecutiveOkrRegistryExample();
  const first = registry.objectives[0];
  if (!first) {
    throw new Error("Executive OKR objective example registry is empty.");
  }
  return first;
}

export function resolveExecutiveKeyResultExample(): ExecutiveKeyResult {
  const registry = resolveExecutiveOkrRegistryExample();
  const first = registry.keyResults[0];
  if (!first) {
    throw new Error("Executive OKR key result example registry is empty.");
  }
  return first;
}
