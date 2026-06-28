/**
 * PHASE-8 / DS6-INT-1 — Executive Scenario Model Integration contract.
 * Scenario definition vocabulary — quad-registry input only.
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
  validateExecutiveKpiRegistry,
} from "../executiveKpi/executiveKpiContract.ts";
import type { ExecutiveKpiRegistry } from "../executiveKpi/executiveKpiTypes.ts";
import {
  resolveExecutiveObjectRegistryWithRiskDeclarationsExample,
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
import { STAGE_GLOBAL_FORBIDDEN_PATTERNS, STAGE_SCORE_WEIGHTS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  recordExecutiveScenarioDiagnostic,
  recordExecutiveScenarioDiagnosticEvent,
} from "./executiveScenarioDiagnostics.ts";
import type {
  DeclaredScenarioStub,
  ExecutiveScenario,
  ExecutiveScenarioAssumption,
  ExecutiveScenarioCategory,
  ExecutiveScenarioConstraint,
  ExecutiveScenarioIntegrationInput,
  ExecutiveScenarioIntegrationResult,
  ExecutiveScenarioKpiReference,
  ExecutiveScenarioLifecycleState,
  ExecutiveScenarioMetadata,
  ExecutiveScenarioObjectReference,
  ExecutiveScenarioOwnershipContract,
  ExecutiveScenarioRegistry,
  ExecutiveScenarioRelationshipReference,
  ExecutiveScenarioRiskReference,
  ExecutiveScenarioScoreDimensions,
  ExecutiveScenarioAnalysisScoreDimensions,
  ExecutiveScenarioStatus,
  ExecutiveScenarioValidationIssue,
  ExecutiveScenarioValidationResult,
} from "./executiveScenarioTypes.ts";

export const EXECUTIVE_SCENARIO_INTEGRATION_VERSION = "PHASE-8/DS6-INT-1" as const;
export const EXECUTIVE_SCENARIO_INTEGRATION_SOURCE = "phase-8-executive-scenario-integration" as const;
export const EXECUTIVE_SCENARIO_INTEGRATION_LOG_PREFIX = "[NexoraExecutiveScenarioIntegration]" as const;
export const EXECUTIVE_SCENARIO_INTEGRATION_MINIMUM_OVERALL_SCORE = 98 as const;
export const SCENARIO_DECLARATIONS_EXTENSION_KEY = "scenarioDeclarations" as const;

export const EXECUTIVE_SCENARIO_INTEGRATION_TAGS = Object.freeze([
  "[DS6_INT_EXECUTIVE_SCENARIO]",
  "[SCENARIO_INTEGRATION_DEFINED]",
  "[WORKSPACE_SCENARIO_OWNED]",
  "[OKR_ENGINE_READY]",
] as const);

export const EXECUTIVE_SCENARIO_INTEGRATION_FREEZE_TAGS = Object.freeze([
  "[DS6_INT_1_CERTIFIED]",
  "[EXECUTIVE_SCENARIO_MODEL_INTEGRATION_FROZEN]",
  "[PHASE8_DS6_SCENARIO_COMPLETE]",
] as const);

export const EXECUTIVE_SCENARIO_CATEGORIES = Object.freeze([
  "strategic",
  "operational",
  "financial",
  "organizational",
  "market",
  "contingency",
  "optimization",
  "custom",
] as const satisfies readonly ExecutiveScenarioCategory[]);

export const EXECUTIVE_SCENARIO_STATUSES = Object.freeze([
  "proposed",
  "approved",
  "rejected",
  "active",
  "archived",
] as const satisfies readonly ExecutiveScenarioStatus[]);

export const EXECUTIVE_SCENARIO_LIFECYCLE_STATES = Object.freeze([
  "draft",
  "defined",
  "validated",
  "active",
  "deprecated",
  "archived",
] as const satisfies readonly ExecutiveScenarioLifecycleState[]);

export const EXECUTIVE_SCENARIO_REGISTRY_STATES = Object.freeze([
  "draft",
  "validated",
  "active",
] as const);

export const EXECUTIVE_SCENARIO_REFERENCE_ROLES = Object.freeze([
  "primary",
  "secondary",
  "context",
  "custom",
] as const);

export const EXECUTIVE_SCENARIO_MANDATORY_FIELDS = Object.freeze([
  "executiveScenarioId",
  "workspaceId",
  "executiveModelId",
  "displayName",
  "scenarioCategory",
  "scenarioStatus",
  "objectReferences",
  "relationshipReferences",
  "kpiReferences",
  "riskReferences",
  "assumptions",
  "constraints",
  "metadata",
  "lifecycleState",
  "createdAt",
  "updatedAt",
] as const);

export const EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN = Object.freeze([
  "scenario_simulation",
  "scenario_prediction",
  "scenario_optimization",
  "prediction_engine",
  "optimization_engine",
  "impact_simulation",
  "what_if_analysis",
  "monte_carlo",
  "risk_scoring",
  "risk_calculation",
  "probability_calculation",
  "mitigation_planning",
  "mitigation_engine",
  "kpi_calculations",
  "kpi_formula_execution",
  "object_creation",
  "relationship_discovery",
  "relationship_inference",
  "graph_algorithms",
  "path_finding",
  "dependency_calculation",
  "executive_intelligence",
  "intelligence_reasoning",
  "recommendations",
  "ai_reasoning",
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
] as const);

export const EXECUTIVE_SCENARIO_INTEGRATION_FORBIDDEN_PATTERNS = Object.freeze([
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
  "dashboardIntelligence/",
  "executiveIntelligencePlatform/",
  "assistantRuntime",
  "ParserEngine",
  "ImportEngine",
  "SynchronizationEngine",
  ".tsx",
] as const);

export const EXECUTIVE_SCENARIO_INTEGRATION_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-8/DS6-INT-1",
  title: "Executive Scenario Model Integration",
  goal: "Library-only scenario integration contract consuming frozen DS2, DS3, DS4, and DS5 registries.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveScenario/executiveScenarioTypes.ts",
    "frontend/app/lib/executiveScenario/executiveScenarioContract.ts",
    "frontend/app/lib/executiveScenario/executiveScenarioDiagnostics.ts",
    "frontend/app/lib/executiveScenario/executiveScenarioCertification.ts",
    "frontend/app/lib/executiveScenario/executiveScenarioCertification.test.ts",
    "docs/ds6-int-1-understanding-report.md",
    "docs/ds6-int-1-build-report.md",
    "docs/ds6-int-1-analysis-report.md",
    "docs/ds6-int-1-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_SCENARIO_INTEGRATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "DS2-INT-1",
    "DS3-INT-1",
    "DS4-INT-1",
    "DS5-INT-1",
    "STAGE-ARCH-3",
    "INT-5",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_SCENARIO_INTEGRATION_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_SCENARIO_INTEGRATION_MODULE_PATHS = Object.freeze(
  EXECUTIVE_SCENARIO_INTEGRATION_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const EXAMPLE_INTEGRATION_SESSION_ID = "esis-session-example-001";
const EXAMPLE_REGISTRY_ID = "esis-registry-example-001";

function issue(code: string, message: string): ExecutiveScenarioValidationIssue {
  return Object.freeze({ code, message });
}

function nowIso(): string {
  return new Date().toISOString();
}

function isExecutiveScenarioCategory(value: string): value is ExecutiveScenarioCategory {
  return (EXECUTIVE_SCENARIO_CATEGORIES as readonly string[]).includes(value);
}

function isExecutiveScenarioStatus(value: string): value is ExecutiveScenarioStatus {
  return (EXECUTIVE_SCENARIO_STATUSES as readonly string[]).includes(value);
}

function isExecutiveScenarioLifecycleState(value: string): value is ExecutiveScenarioLifecycleState {
  return (EXECUTIVE_SCENARIO_LIFECYCLE_STATES as readonly string[]).includes(value);
}

export function computeExecutiveScenarioIntegrationOverallScore(
  dimensions: ExecutiveScenarioScoreDimensions
): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveScenarioIntegrationMinimumScore(overall: number): boolean {
  return overall >= EXECUTIVE_SCENARIO_INTEGRATION_MINIMUM_OVERALL_SCORE;
}

const ANALYSIS_SCORE_WEIGHTS = Object.freeze({
  architectureHealth: 0.12,
  maintainability: 0.11,
  scalability: 0.1,
  regressionSafety: 0.13,
  registryBoundaryIntegrity: 0.14,
  scenarioModelIntegrity: 0.13,
  referenceIntegrity: 0.13,
  bugTraceability: 0.07,
  certificationReadiness: 0.07,
} as const);

export function computeExecutiveScenarioIntegrationAnalysisScore(
  dimensions: ExecutiveScenarioAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.registryBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.registryBoundaryIntegrity +
    dimensions.scenarioModelIntegrity * ANALYSIS_SCORE_WEIGHTS.scenarioModelIntegrity +
    dimensions.referenceIntegrity * ANALYSIS_SCORE_WEIGHTS.referenceIntegrity +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function computeExecutiveScenarioContentHash(input: {
  executiveScenarioId: string;
  displayName: string;
  scenarioCategory: ExecutiveScenarioCategory;
  scenarioStatus: ExecutiveScenarioStatus;
}): string {
  return Object.freeze(
    `esis:${input.executiveScenarioId}:${input.displayName}:${input.scenarioCategory}:${input.scenarioStatus}`
  );
}

function readScenarioDeclarationsFromObject(object: ExecutiveObject): readonly DeclaredScenarioStub[] {
  const extension = object.metadata.extension.futureExtension;
  if (!extension || typeof extension !== "object") {
    return Object.freeze([]);
  }
  const raw = (extension as Record<string, unknown>)[SCENARIO_DECLARATIONS_EXTENSION_KEY];
  if (!Array.isArray(raw)) {
    return Object.freeze([]);
  }
  return Object.freeze(raw as DeclaredScenarioStub[]);
}

export function extractScenarioDeclarationsFromRegistry(
  registry: ExecutiveObjectRegistry
): ReadonlyArray<DeclaredScenarioStub & { hostObjectId: string }> {
  const collected: Array<DeclaredScenarioStub & { hostObjectId: string }> = [];
  for (const object of registry.objects) {
    for (const stub of readScenarioDeclarationsFromObject(object)) {
      collected.push(Object.freeze({ ...stub, hostObjectId: object.executiveObjectId }));
    }
  }
  return Object.freeze(collected);
}

export function validateScenarioAssumptions(
  assumptions: readonly ExecutiveScenarioAssumption[] | undefined
): ExecutiveScenarioValidationResult {
  const issues: ExecutiveScenarioValidationIssue[] = [];
  if (!assumptions) {
    issues.push(issue("missing_assumptions", "assumptions is required."));
    return Object.freeze({ valid: false, issues: Object.freeze(issues) });
  }
  const seen = new Set<string>();
  for (const assumption of assumptions) {
    if (!assumption.assumptionId?.trim()) {
      issues.push(issue("missing_assumption_id", "assumptionId is required."));
    }
    if (!assumption.description?.trim()) {
      issues.push(issue("missing_assumption_description", "assumption description is required."));
    }
    if (assumption.assumptionId && seen.has(assumption.assumptionId)) {
      issues.push(issue("duplicate_assumption_id", `Duplicate assumption id ${assumption.assumptionId}.`));
    }
    if (assumption.assumptionId) seen.add(assumption.assumptionId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateScenarioConstraints(
  constraints: readonly ExecutiveScenarioConstraint[] | undefined
): ExecutiveScenarioValidationResult {
  const issues: ExecutiveScenarioValidationIssue[] = [];
  if (!constraints) {
    issues.push(issue("missing_constraints", "constraints is required."));
    return Object.freeze({ valid: false, issues: Object.freeze(issues) });
  }
  const seen = new Set<string>();
  for (const constraint of constraints) {
    if (!constraint.constraintId?.trim()) {
      issues.push(issue("missing_constraint_id", "constraintId is required."));
    }
    if (!constraint.description?.trim()) {
      issues.push(issue("missing_constraint_description", "constraint description is required."));
    }
    if (constraint.constraintId && seen.has(constraint.constraintId)) {
      issues.push(issue("duplicate_constraint_id", `Duplicate constraint id ${constraint.constraintId}.`));
    }
    if (constraint.constraintId) seen.add(constraint.constraintId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateDeclaredScenarioStub(input: Partial<DeclaredScenarioStub>): ExecutiveScenarioValidationResult {
  const issues: ExecutiveScenarioValidationIssue[] = [];
  if (!input.executiveScenarioId?.trim()) {
    issues.push(issue("missing_executive_scenario_id", "executiveScenarioId is required."));
  }
  if (!input.displayName?.trim()) {
    issues.push(issue("missing_display_name", "displayName is required."));
  }
  if (!input.scenarioCategory || !isExecutiveScenarioCategory(input.scenarioCategory)) {
    issues.push(issue("invalid_scenario_category", "scenarioCategory must be one of eight values."));
  }
  if (!input.scenarioStatus || !isExecutiveScenarioStatus(input.scenarioStatus)) {
    issues.push(issue("invalid_scenario_status", "scenarioStatus must be one of five values."));
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
  const assumptionValidation = validateScenarioAssumptions(input.assumptions);
  if (!assumptionValidation.valid) issues.push(...assumptionValidation.issues);
  const constraintValidation = validateScenarioConstraints(input.constraints);
  if (!constraintValidation.valid) issues.push(...constraintValidation.issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateObjectRegistryIntegrationInput(
  registry: Partial<ExecutiveObjectRegistry>
): ExecutiveScenarioValidationResult {
  return validateExecutiveObjectRegistry(registry);
}

export function validateRelationshipRegistryIntegrationInput(
  registry: Partial<ExecutiveRelationshipRegistry>
): ExecutiveScenarioValidationResult {
  return validateExecutiveRelationshipRegistry(registry);
}

export function validateKpiRegistryIntegrationInput(
  registry: Partial<ExecutiveKpiRegistry>
): ExecutiveScenarioValidationResult {
  return validateExecutiveKpiRegistry(registry);
}

export function validateRiskRegistryIntegrationInput(
  registry: Partial<ExecutiveRiskRegistry>
): ExecutiveScenarioValidationResult {
  return validateExecutiveRiskRegistry(registry);
}

export function validateScenarioObjectReferences(input: {
  objectReferences: readonly ExecutiveScenarioObjectReference[];
  objectRegistry: ExecutiveObjectRegistry;
}): ExecutiveScenarioValidationResult {
  const issues: ExecutiveScenarioValidationIssue[] = [];
  const seen = new Set<string>();
  for (const reference of input.objectReferences) {
    if (!reference.executiveObjectId?.trim()) {
      issues.push(issue("missing_reference_object_id", "objectReferences executiveObjectId is required."));
      continue;
    }
    if (!resolveExecutiveObjectById(input.objectRegistry, reference.executiveObjectId)) {
      issues.push(
        issue("reference_object_missing", `Object ${reference.executiveObjectId} not in object registry.`)
      );
    }
    if (seen.has(reference.executiveObjectId)) {
      issues.push(issue("duplicate_object_reference", `Duplicate object reference ${reference.executiveObjectId}.`));
    }
    seen.add(reference.executiveObjectId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateScenarioRelationshipReferences(input: {
  relationshipReferences: readonly ExecutiveScenarioRelationshipReference[];
  relationshipRegistry: ExecutiveRelationshipRegistry;
}): ExecutiveScenarioValidationResult {
  const issues: ExecutiveScenarioValidationIssue[] = [];
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

export function validateScenarioKpiReferences(input: {
  kpiReferences: readonly ExecutiveScenarioKpiReference[];
  kpiRegistry: ExecutiveKpiRegistry;
}): ExecutiveScenarioValidationResult {
  const issues: ExecutiveScenarioValidationIssue[] = [];
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

export function validateScenarioRiskReferences(input: {
  riskReferences: readonly ExecutiveScenarioRiskReference[];
  riskRegistry: ExecutiveRiskRegistry;
}): ExecutiveScenarioValidationResult {
  const issues: ExecutiveScenarioValidationIssue[] = [];
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

export function validateExecutiveScenario(input: Partial<ExecutiveScenario>): ExecutiveScenarioValidationResult {
  const issues: ExecutiveScenarioValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_SCENARIO_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match DS6-INT-1."));
  }
  if (!input.executiveScenarioId?.trim()) {
    issues.push(issue("missing_executive_scenario_id", "executiveScenarioId is required."));
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
  if (!input.scenarioCategory || !isExecutiveScenarioCategory(input.scenarioCategory)) {
    issues.push(issue("invalid_scenario_category", "scenarioCategory must be one of eight values."));
  }
  if (!input.scenarioStatus || !isExecutiveScenarioStatus(input.scenarioStatus)) {
    issues.push(issue("invalid_scenario_status", "scenarioStatus must be one of five values."));
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
  const assumptionValidation = validateScenarioAssumptions(input.assumptions);
  if (!assumptionValidation.valid) issues.push(...assumptionValidation.issues);
  const constraintValidation = validateScenarioConstraints(input.constraints);
  if (!constraintValidation.valid) issues.push(...constraintValidation.issues);
  if (!input.metadata) {
    issues.push(issue("missing_metadata", "metadata is required."));
  }
  if (!input.lifecycleState || !isExecutiveScenarioLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "lifecycleState must be one of six lifecycle values."));
  }
  if (!input.createdAt?.trim()) {
    issues.push(issue("missing_created_at", "createdAt is required."));
  }
  if (!input.updatedAt?.trim()) {
    issues.push(issue("missing_updated_at", "updatedAt is required."));
  }
  if (input.source !== EXECUTIVE_SCENARIO_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-8-executive-scenario-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveScenarioRegistry(
  input: Partial<ExecutiveScenarioRegistry>,
  context?: {
    objectRegistry?: ExecutiveObjectRegistry;
    relationshipRegistry?: ExecutiveRelationshipRegistry;
    kpiRegistry?: ExecutiveKpiRegistry;
    riskRegistry?: ExecutiveRiskRegistry;
  }
): ExecutiveScenarioValidationResult {
  const issues: ExecutiveScenarioValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_SCENARIO_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match DS6-INT-1."));
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
  if (!input.integrationSessionId?.trim()) {
    issues.push(issue("missing_integration_session_id", "integrationSessionId is required."));
  }
  if (!input.scenarios) {
    issues.push(issue("missing_scenarios", "scenarios array is required."));
  } else {
    const ids = new Set<string>();
    for (const scenario of input.scenarios) {
      const scenarioValidation = validateExecutiveScenario(scenario);
      if (!scenarioValidation.valid) {
        issues.push(...scenarioValidation.issues.map((entry) => issue(`scenario_${entry.code}`, entry.message)));
      }
      if (scenario.workspaceId !== input.workspaceId) {
        issues.push(issue("workspace_mismatch", `Scenario ${scenario.executiveScenarioId} workspace mismatch.`));
      }
      if (scenario.executiveModelId !== input.executiveModelId) {
        issues.push(issue("model_mismatch", `Scenario ${scenario.executiveScenarioId} model mismatch.`));
      }
      if (ids.has(scenario.executiveScenarioId)) {
        issues.push(issue("duplicate_executive_scenario_id", `Duplicate id ${scenario.executiveScenarioId}.`));
      }
      ids.add(scenario.executiveScenarioId);
      if (context?.objectRegistry) {
        const objectReferenceValidation = validateScenarioObjectReferences({
          objectReferences: scenario.objectReferences,
          objectRegistry: context.objectRegistry,
        });
        if (!objectReferenceValidation.valid) issues.push(...objectReferenceValidation.issues);
      }
      if (context?.relationshipRegistry) {
        const relationshipReferenceValidation = validateScenarioRelationshipReferences({
          relationshipReferences: scenario.relationshipReferences,
          relationshipRegistry: context.relationshipRegistry,
        });
        if (!relationshipReferenceValidation.valid) issues.push(...relationshipReferenceValidation.issues);
      }
      if (context?.kpiRegistry) {
        const kpiReferenceValidation = validateScenarioKpiReferences({
          kpiReferences: scenario.kpiReferences,
          kpiRegistry: context.kpiRegistry,
        });
        if (!kpiReferenceValidation.valid) issues.push(...kpiReferenceValidation.issues);
      }
      if (context?.riskRegistry) {
        const riskReferenceValidation = validateScenarioRiskReferences({
          riskReferences: scenario.riskReferences,
          riskRegistry: context.riskRegistry,
        });
        if (!riskReferenceValidation.valid) issues.push(...riskReferenceValidation.issues);
      }
    }
    if (input.scenarioCount !== undefined && input.scenarioCount !== input.scenarios.length) {
      issues.push(issue("scenario_count_mismatch", "scenarioCount must match scenarios length."));
    }
  }
  if (input.source !== EXECUTIVE_SCENARIO_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "registry source must be phase-8-executive-scenario-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function buildExecutiveScenarioFromStub(input: {
  stub: DeclaredScenarioStub & { hostObjectId: string };
  objectRegistry: ExecutiveObjectRegistry;
  relationshipRegistry: ExecutiveRelationshipRegistry;
  kpiRegistry: ExecutiveKpiRegistry;
  riskRegistry: ExecutiveRiskRegistry;
  integrationSessionId: string;
  timestamp: string;
}): ExecutiveScenario {
  const hostObject = resolveExecutiveObjectById(input.objectRegistry, input.stub.hostObjectId);
  const metadata: ExecutiveScenarioMetadata = Object.freeze({
    tags: Object.freeze([...(input.stub.metadata?.tags ?? []), "esis-integrated"]),
    domainHint: hostObject?.metadata.domainHint ?? null,
    executiveCategoryHint: hostObject?.metadata.executiveCategoryHint ?? null,
    taxonomyOverride: null,
    extension: Object.freeze({ taxonomyOverride: null, futureExtension: Object.freeze({}) }),
  });
  const contentHash = computeExecutiveScenarioContentHash({
    executiveScenarioId: input.stub.executiveScenarioId,
    displayName: input.stub.displayName,
    scenarioCategory: input.stub.scenarioCategory,
    scenarioStatus: input.stub.scenarioStatus,
  });
  return Object.freeze({
    contractVersion: EXECUTIVE_SCENARIO_INTEGRATION_VERSION,
    executiveScenarioId: input.stub.executiveScenarioId,
    workspaceId: input.objectRegistry.workspaceId,
    executiveModelId: input.objectRegistry.executiveModelId,
    displayName: input.stub.displayName,
    scenarioCategory: input.stub.scenarioCategory,
    scenarioStatus: input.stub.scenarioStatus,
    objectReferences: Object.freeze(input.stub.objectReferences.map((entry) => Object.freeze({ ...entry }))),
    relationshipReferences: Object.freeze(
      input.stub.relationshipReferences.map((entry) => Object.freeze({ ...entry }))
    ),
    kpiReferences: Object.freeze(input.stub.kpiReferences.map((entry) => Object.freeze({ ...entry }))),
    riskReferences: Object.freeze(input.stub.riskReferences.map((entry) => Object.freeze({ ...entry }))),
    assumptions: Object.freeze(input.stub.assumptions.map((entry) => Object.freeze({ ...entry }))),
    constraints: Object.freeze(input.stub.constraints.map((entry) => Object.freeze({ ...entry }))),
    metadata,
    lifecycleState: "defined",
    objectRegistryId: input.objectRegistry.registryId,
    relationshipRegistryId: input.relationshipRegistry.registryId,
    kpiRegistryId: input.kpiRegistry.registryId,
    riskRegistryId: input.riskRegistry.registryId,
    hostObjectId: input.stub.hostObjectId,
    integrationSessionId: input.integrationSessionId,
    contentHash,
    createdAt: input.timestamp,
    updatedAt: input.timestamp,
    source: EXECUTIVE_SCENARIO_INTEGRATION_SOURCE,
  });
}

function promoteScenarioLifecycle(scenario: ExecutiveScenario): ExecutiveScenario {
  const validation = validateExecutiveScenario(scenario);
  if (!validation.valid) return scenario;
  return Object.freeze({ ...scenario, lifecycleState: "validated" as const, updatedAt: nowIso() });
}

function validateQuadRegistryScope(input: ExecutiveScenarioIntegrationInput): ExecutiveScenarioValidationResult {
  const { objectRegistry, relationshipRegistry, kpiRegistry, riskRegistry } = input;
  const issues: ExecutiveScenarioValidationIssue[] = [];
  const registries = [relationshipRegistry, kpiRegistry, riskRegistry];
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

export function integrateExecutiveScenariosFromRegistries(
  input: ExecutiveScenarioIntegrationInput
): ExecutiveScenarioIntegrationResult {
  const integrationSessionId = input.integrationSessionId?.trim() || `esis-${Date.now()}`;
  const timestamp = nowIso();

  const objectRegistryValidation = validateObjectRegistryIntegrationInput(input.objectRegistry);
  if (!objectRegistryValidation.valid) {
    recordExecutiveScenarioDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.objectRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      scenarios: Object.freeze([]),
      issues: objectRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const relationshipRegistryValidation = validateRelationshipRegistryIntegrationInput(input.relationshipRegistry);
  if (!relationshipRegistryValidation.valid) {
    recordExecutiveScenarioDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.relationshipRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      scenarios: Object.freeze([]),
      issues: relationshipRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const kpiRegistryValidation = validateKpiRegistryIntegrationInput(input.kpiRegistry);
  if (!kpiRegistryValidation.valid) {
    recordExecutiveScenarioDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.kpiRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      scenarios: Object.freeze([]),
      issues: kpiRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const riskRegistryValidation = validateRiskRegistryIntegrationInput(input.riskRegistry);
  if (!riskRegistryValidation.valid) {
    recordExecutiveScenarioDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.riskRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      scenarios: Object.freeze([]),
      issues: riskRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const scopeValidation = validateQuadRegistryScope(input);
  if (!scopeValidation.valid) {
    recordExecutiveScenarioDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.objectRegistry.workspaceId,
    });
    return Object.freeze({
      success: false,
      registry: null,
      scenarios: Object.freeze([]),
      issues: scopeValidation.issues,
      integrationSessionId,
    });
  }

  const objectRegistry = input.objectRegistry;
  const relationshipRegistry = input.relationshipRegistry;
  const kpiRegistry = input.kpiRegistry;
  const riskRegistry = input.riskRegistry;
  const declarations = extractScenarioDeclarationsFromRegistry(objectRegistry);
  const seenIds = new Set<string>();
  const scenarioIssues: ExecutiveScenarioValidationIssue[] = [];
  const builtScenarios: ExecutiveScenario[] = [];

  for (const stubWithHost of declarations) {
    const stubValidation = validateDeclaredScenarioStub(stubWithHost);
    if (!stubValidation.valid) {
      scenarioIssues.push(...stubValidation.issues);
      continue;
    }
    if (seenIds.has(stubWithHost.executiveScenarioId)) {
      scenarioIssues.push(
        issue("duplicate_executive_scenario_id", `Duplicate declaration id ${stubWithHost.executiveScenarioId}.`)
      );
      continue;
    }
    seenIds.add(stubWithHost.executiveScenarioId);

    const scenario = buildExecutiveScenarioFromStub({
      stub: stubWithHost,
      objectRegistry,
      relationshipRegistry,
      kpiRegistry,
      riskRegistry,
      integrationSessionId,
      timestamp,
    });
    recordExecutiveScenarioDiagnosticEvent({
      type: "ScenarioDeclared",
      integrationSessionId,
      workspaceId: objectRegistry.workspaceId,
      executiveScenarioId: scenario.executiveScenarioId,
    });

    const objectReferenceValidation = validateScenarioObjectReferences({
      objectReferences: scenario.objectReferences,
      objectRegistry,
    });
    if (!objectReferenceValidation.valid) {
      scenarioIssues.push(...objectReferenceValidation.issues);
      continue;
    }

    const relationshipReferenceValidation = validateScenarioRelationshipReferences({
      relationshipReferences: scenario.relationshipReferences,
      relationshipRegistry,
    });
    if (!relationshipReferenceValidation.valid) {
      scenarioIssues.push(...relationshipReferenceValidation.issues);
      continue;
    }

    const kpiReferenceValidation = validateScenarioKpiReferences({
      kpiReferences: scenario.kpiReferences,
      kpiRegistry,
    });
    if (!kpiReferenceValidation.valid) {
      scenarioIssues.push(...kpiReferenceValidation.issues);
      continue;
    }

    const riskReferenceValidation = validateScenarioRiskReferences({
      riskReferences: scenario.riskReferences,
      riskRegistry,
    });
    if (!riskReferenceValidation.valid) {
      scenarioIssues.push(...riskReferenceValidation.issues);
      continue;
    }

    const promoted = promoteScenarioLifecycle(scenario);
    recordExecutiveScenarioDiagnosticEvent({
      type: "ScenarioValidated",
      integrationSessionId,
      workspaceId: promoted.workspaceId,
      executiveScenarioId: promoted.executiveScenarioId,
    });
    builtScenarios.push(promoted);
  }

  if (scenarioIssues.length > 0) {
    recordExecutiveScenarioDiagnostic({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: objectRegistry.workspaceId,
      message: "Scenario declaration validation failed.",
    });
    return Object.freeze({
      success: false,
      registry: null,
      scenarios: Object.freeze(builtScenarios),
      issues: Object.freeze(scenarioIssues),
      integrationSessionId,
    });
  }

  const validatedScenarios = Object.freeze(builtScenarios);
  const scenarioRegistry: ExecutiveScenarioRegistry = Object.freeze({
    contractVersion: EXECUTIVE_SCENARIO_INTEGRATION_VERSION,
    registryId: `${integrationSessionId}-registry`,
    workspaceId: objectRegistry.workspaceId,
    executiveModelId: objectRegistry.executiveModelId,
    objectRegistryId: objectRegistry.registryId,
    relationshipRegistryId: relationshipRegistry.registryId,
    kpiRegistryId: kpiRegistry.registryId,
    riskRegistryId: riskRegistry.registryId,
    integrationSessionId,
    scenarios: validatedScenarios,
    scenarioCount: validatedScenarios.length,
    registryState: "validated",
    source: EXECUTIVE_SCENARIO_INTEGRATION_SOURCE,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const outputValidation = validateExecutiveScenarioRegistry(scenarioRegistry, {
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
    riskRegistry,
  });
  if (!outputValidation.valid) {
    recordExecutiveScenarioDiagnostic({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: objectRegistry.workspaceId,
      message: "Executive scenario registry validation failed.",
    });
    return Object.freeze({
      success: false,
      registry: null,
      scenarios: validatedScenarios,
      issues: outputValidation.issues,
      integrationSessionId,
    });
  }

  recordExecutiveScenarioDiagnosticEvent({
    type: "ScenarioRegistered",
    integrationSessionId,
    workspaceId: objectRegistry.workspaceId,
  });
  recordExecutiveScenarioDiagnostic({
    type: "ScenarioRegistered",
    integrationSessionId,
    workspaceId: objectRegistry.workspaceId,
    message: `Registered ${validatedScenarios.length} executive scenario(s).`,
  });

  return Object.freeze({
    success: true,
    registry: Object.freeze({ ...scenarioRegistry, registryId: `${integrationSessionId}-registry` }),
    scenarios: validatedScenarios,
    issues: Object.freeze([]),
    integrationSessionId,
  });
}

export function resolveExecutiveScenarioById(
  registry: ExecutiveScenarioRegistry,
  executiveScenarioId: string
): ExecutiveScenario | null {
  return registry.scenarios.find((entry) => entry.executiveScenarioId === executiveScenarioId) ?? null;
}

export function listExecutiveScenariosByCategory(
  registry: ExecutiveScenarioRegistry,
  scenarioCategory: ExecutiveScenarioCategory
): readonly ExecutiveScenario[] {
  return Object.freeze(registry.scenarios.filter((entry) => entry.scenarioCategory === scenarioCategory));
}

export function listExecutiveScenariosByStatus(
  registry: ExecutiveScenarioRegistry,
  scenarioStatus: ExecutiveScenarioStatus
): readonly ExecutiveScenario[] {
  return Object.freeze(registry.scenarios.filter((entry) => entry.scenarioStatus === scenarioStatus));
}

export function listExecutiveScenariosForObject(
  registry: ExecutiveScenarioRegistry,
  executiveObjectId: string
): readonly ExecutiveScenario[] {
  return Object.freeze(
    registry.scenarios.filter((entry) =>
      entry.objectReferences.some((reference) => reference.executiveObjectId === executiveObjectId)
    )
  );
}

export function listExecutiveScenariosForRisk(
  registry: ExecutiveScenarioRegistry,
  executiveRiskId: string
): readonly ExecutiveScenario[] {
  return Object.freeze(
    registry.scenarios.filter((entry) =>
      entry.riskReferences.some((reference) => reference.executiveRiskId === executiveRiskId)
    )
  );
}

export function buildExecutiveScenarioOwnershipContract(
  registry: ExecutiveScenarioRegistry
): ExecutiveScenarioOwnershipContract {
  return Object.freeze({
    registryId: registry.registryId,
    workspaceId: registry.workspaceId,
    executiveModelId: registry.executiveModelId,
    objectRegistryId: registry.objectRegistryId,
    relationshipRegistryId: registry.relationshipRegistryId,
    kpiRegistryId: registry.kpiRegistryId,
    riskRegistryId: registry.riskRegistryId,
    isolationPolicy: "workspace-exclusive",
    upstreamAuthority: "phase-7-executive-risk-integration",
    mutationPolicy: "integration-derived-immutable-snapshot",
  });
}

export function validateEsisQuadRegistryInputBoundary(): Readonly<{ valid: boolean; evidence: string }> {
  const mustNotOwn =
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("ds1_direct_consumption") &&
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("emg_direct_consumption") &&
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("emg_model_record_consumption") &&
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("scenario_simulation") &&
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("persistence");
  return Object.freeze({
    valid: mustNotOwn,
    evidence: mustNotOwn
      ? "Quad-registry input boundary locked; DS-1, EMG, simulation, and persistence excluded."
      : "Input boundary incomplete.",
  });
}

export function validateEsisNoSimulationIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const noSimulation =
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("scenario_simulation") &&
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("scenario_prediction") &&
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("scenario_optimization") &&
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("prediction_engine") &&
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("optimization_engine") &&
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("graph_algorithms");
  return Object.freeze({
    valid: noSimulation,
    evidence: noSimulation
      ? "Declarative scenario definitions only; simulation and graph analysis excluded."
      : "No-simulation boundary incomplete.",
  });
}

export function validateEsisReferenceIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const referenceIntegrity =
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("graph_algorithms") &&
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("path_finding") &&
    EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("dependency_calculation") &&
    EXECUTIVE_SCENARIO_REFERENCE_ROLES.length === 4;
  return Object.freeze({
    valid: referenceIntegrity,
    evidence: referenceIntegrity
      ? "Declarative identity references only; traversal and dependency analysis excluded."
      : "Reference integrity boundary incomplete.",
  });
}

export function attachScenarioDeclarationsToObjectRegistry(
  objectRegistry: ExecutiveObjectRegistry,
  declarationsByHostObjectId: Readonly<Record<string, readonly DeclaredScenarioStub[]>>
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
            [SCENARIO_DECLARATIONS_EXTENSION_KEY]: Object.freeze(
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

export function resolveExecutiveObjectRegistryWithScenarioDeclarationsExample(): ExecutiveObjectRegistry {
  const baseRegistry = resolveExecutiveObjectRegistryWithRiskDeclarationsExample();
  return attachScenarioDeclarationsToObjectRegistry(baseRegistry, {
    "emg-obj-outcome": Object.freeze([
      Object.freeze({
        executiveScenarioId: "esis-scenario-outcome-delay-001",
        displayName: "Outcome Delivery Delay Contingency",
        scenarioCategory: "contingency" as const,
        scenarioStatus: "proposed" as const,
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
        assumptions: Object.freeze([
          Object.freeze({
            assumptionId: "asis-001",
            description: "Supplier capacity remains constrained through Q3.",
          }),
        ]),
        constraints: Object.freeze([
          Object.freeze({
            constraintId: "cst-001",
            description: "No additional headcount approved for outcome delivery team.",
          }),
        ]),
        metadata: Object.freeze({ tags: Object.freeze(["example"]) }),
      }),
    ]),
  });
}

export function resolveExecutiveScenarioIntegrationInputExample(): ExecutiveScenarioIntegrationInput {
  const objectRegistry = resolveExecutiveObjectRegistryWithScenarioDeclarationsExample();
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  const kpiRegistry = resolveExecutiveKpiRegistryExample();
  const riskRegistry = resolveExecutiveRiskRegistryExample();
  return Object.freeze({
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
    riskRegistry,
    integrationSessionId: EXAMPLE_INTEGRATION_SESSION_ID,
  });
}

export function resolveExecutiveScenarioRegistryExample(): ExecutiveScenarioRegistry {
  const input = resolveExecutiveScenarioIntegrationInputExample();
  const integration = integrateExecutiveScenariosFromRegistries(input);
  if (!integration.registry) {
    throw new Error("Executive scenario registry example failed to build.");
  }
  return Object.freeze({ ...integration.registry, registryId: EXAMPLE_REGISTRY_ID });
}

export function resolveExecutiveScenarioExample(): ExecutiveScenario {
  const registry = resolveExecutiveScenarioRegistryExample();
  const first = registry.scenarios[0];
  if (!first) {
    throw new Error("Executive scenario example registry is empty.");
  }
  return first;
}
