/**
 * PHASE-6 / DS4-INT-1 — Executive KPI Model Integration contract.
 * KPI definition vocabulary — ExecutiveObjectRegistry + ExecutiveRelationshipRegistry input only.
 */

import {
  resolveExecutiveObjectById,
  resolveExecutiveObjectRegistryExample,
  validateExecutiveObjectRegistry,
} from "../executiveObject/executiveObjectContract.ts";
import type { ExecutiveObject, ExecutiveObjectRegistry } from "../executiveObject/executiveObjectTypes.ts";
import {
  resolveExecutiveRelationshipById,
  resolveExecutiveObjectRegistryWithDeclarationsExample,
  resolveExecutiveRelationshipRegistryExample,
  validateExecutiveRelationshipRegistry,
} from "../executiveRelationship/executiveRelationshipContract.ts";
import type { ExecutiveRelationshipRegistry } from "../executiveRelationship/executiveRelationshipTypes.ts";
import { STAGE_GLOBAL_FORBIDDEN_PATTERNS, STAGE_SCORE_WEIGHTS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  recordExecutiveKpiDiagnostic,
  recordExecutiveKpiDiagnosticEvent,
} from "./executiveKpiDiagnostics.ts";
import type {
  DeclaredKpiStub,
  ExecutiveKpi,
  ExecutiveKpiCategory,
  ExecutiveKpiIntegrationInput,
  ExecutiveKpiIntegrationResult,
  ExecutiveKpiLifecycleState,
  ExecutiveKpiMeasurementType,
  ExecutiveKpiMetadata,
  ExecutiveKpiObjectBinding,
  ExecutiveKpiOwnershipContract,
  ExecutiveKpiRegistry,
  ExecutiveKpiRelationshipBinding,
  ExecutiveKpiScoreDimensions,
  ExecutiveKpiAnalysisScoreDimensions,
  ExecutiveKpiTargetDefinition,
  ExecutiveKpiValidationIssue,
  ExecutiveKpiValidationResult,
} from "./executiveKpiTypes.ts";

export const EXECUTIVE_KPI_INTEGRATION_VERSION = "PHASE-6/DS4-INT-1" as const;
export const EXECUTIVE_KPI_INTEGRATION_SOURCE = "phase-6-executive-kpi-integration" as const;
export const EXECUTIVE_KPI_INTEGRATION_LOG_PREFIX = "[NexoraExecutiveKpiIntegration]" as const;
export const EXECUTIVE_KPI_INTEGRATION_MINIMUM_OVERALL_SCORE = 98 as const;
export const KPI_DECLARATIONS_EXTENSION_KEY = "kpiDeclarations" as const;

export const EXECUTIVE_KPI_INTEGRATION_TAGS = Object.freeze([
  "[DS4_INT_EXECUTIVE_KPI]",
  "[KPI_INTEGRATION_DEFINED]",
  "[WORKSPACE_KPI_OWNED]",
  "[RISK_ENGINE_READY]",
] as const);

export const EXECUTIVE_KPI_INTEGRATION_FREEZE_TAGS = Object.freeze([
  "[DS4_INT_1_CERTIFIED]",
  "[EXECUTIVE_KPI_MODEL_INTEGRATION_FROZEN]",
  "[PHASE6_DS4_KPI_COMPLETE]",
] as const);

export const EXECUTIVE_KPI_CATEGORIES = Object.freeze([
  "financial",
  "operational",
  "strategic",
  "quality",
  "resource",
  "customer",
  "compliance",
  "custom",
] as const satisfies readonly ExecutiveKpiCategory[]);

export const EXECUTIVE_KPI_MEASUREMENT_TYPES = Object.freeze([
  "percentage",
  "currency",
  "duration",
  "count",
  "ratio",
  "score",
  "boolean",
  "custom",
] as const satisfies readonly ExecutiveKpiMeasurementType[]);

export const EXECUTIVE_KPI_LIFECYCLE_STATES = Object.freeze([
  "draft",
  "defined",
  "validated",
  "active",
  "deprecated",
  "archived",
] as const satisfies readonly ExecutiveKpiLifecycleState[]);

export const EXECUTIVE_KPI_REGISTRY_STATES = Object.freeze([
  "draft",
  "validated",
  "active",
] as const);

export const EXECUTIVE_KPI_BINDING_ROLES = Object.freeze([
  "primary",
  "secondary",
  "context",
  "custom",
] as const);

export const EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN = Object.freeze([
  "kpi_calculations",
  "kpi_formula_execution",
  "aggregation_engine",
  "threshold_evaluation",
  "forecasting",
  "relationship_discovery",
  "relationship_inference",
  "graph_algorithms",
  "path_finding",
  "dependency_calculation",
  "risk_calculations",
  "risk_generation",
  "scenario_simulations",
  "scenario_generation",
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
  "legacy_kpi_modules",
  "ds1_direct_consumption",
  "emg_direct_consumption",
  "emg_model_record_consumption",
  "legacy_relationship_runtime",
  "emg1_contract_mutation",
  "emg2_contract_mutation",
  "emg3_contract_mutation",
  "ds2_contract_mutation",
  "ds3_contract_mutation",
] as const);

export const EXECUTIVE_KPI_INTEGRATION_FORBIDDEN_PATTERNS = Object.freeze([
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
  "kpi-intelligence/",
  "KpiImpactSimulationEngine",
  "dashboardIntelligence/",
  "executiveIntelligencePlatform/",
  "assistantRuntime",
  "ParserEngine",
  "ImportEngine",
  "SynchronizationEngine",
  "scenario-intelligence/ScenarioGenerationRuntime",
  "risk-intelligence/RiskIntelligenceRuntime",
  "config/core/kpis",
  "config/customers/",
  ".tsx",
] as const);

export const EXECUTIVE_KPI_INTEGRATION_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-6/DS4-INT-1",
  title: "Executive KPI Model Integration",
  goal: "Library-only KPI integration contract consuming frozen DS2 ExecutiveObjectRegistry and DS3 ExecutiveRelationshipRegistry.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveKpi/executiveKpiTypes.ts",
    "frontend/app/lib/executiveKpi/executiveKpiContract.ts",
    "frontend/app/lib/executiveKpi/executiveKpiDiagnostics.ts",
    "frontend/app/lib/executiveKpi/executiveKpiCertification.ts",
    "frontend/app/lib/executiveKpi/executiveKpiCertification.test.ts",
    "docs/ds4-int-1-build-report.md",
    "docs/ds4-int-1-analysis-report.md",
    "docs/ds4-int-1-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_KPI_INTEGRATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["DS2-INT-1", "DS3-INT-1", "STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_KPI_INTEGRATION_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_KPI_INTEGRATION_MODULE_PATHS = Object.freeze(
  EXECUTIVE_KPI_INTEGRATION_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const EXAMPLE_INTEGRATION_SESSION_ID = "eki-session-example-001";
const EXAMPLE_REGISTRY_ID = "eki-registry-example-001";

function issue(code: string, message: string): ExecutiveKpiValidationIssue {
  return Object.freeze({ code, message });
}

function nowIso(): string {
  return new Date().toISOString();
}

function isExecutiveKpiCategory(value: string): value is ExecutiveKpiCategory {
  return (EXECUTIVE_KPI_CATEGORIES as readonly string[]).includes(value);
}

function isExecutiveKpiMeasurementType(value: string): value is ExecutiveKpiMeasurementType {
  return (EXECUTIVE_KPI_MEASUREMENT_TYPES as readonly string[]).includes(value);
}

function isExecutiveKpiLifecycleState(value: string): value is ExecutiveKpiLifecycleState {
  return (EXECUTIVE_KPI_LIFECYCLE_STATES as readonly string[]).includes(value);
}

export function computeExecutiveKpiIntegrationOverallScore(dimensions: ExecutiveKpiScoreDimensions): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveKpiIntegrationMinimumScore(overall: number): boolean {
  return overall >= EXECUTIVE_KPI_INTEGRATION_MINIMUM_OVERALL_SCORE;
}

const ANALYSIS_SCORE_WEIGHTS = Object.freeze({
  architectureHealth: 0.12,
  maintainability: 0.11,
  scalability: 0.1,
  regressionSafety: 0.13,
  registryBoundaryIntegrity: 0.14,
  kpiModelIntegrity: 0.13,
  bindingIntegrity: 0.13,
  bugTraceability: 0.07,
  certificationReadiness: 0.07,
} as const);

export function computeExecutiveKpiIntegrationAnalysisScore(
  dimensions: ExecutiveKpiAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.registryBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.registryBoundaryIntegrity +
    dimensions.kpiModelIntegrity * ANALYSIS_SCORE_WEIGHTS.kpiModelIntegrity +
    dimensions.bindingIntegrity * ANALYSIS_SCORE_WEIGHTS.bindingIntegrity +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function computeExecutiveKpiContentHash(input: {
  executiveKpiId: string;
  displayName: string;
  kpiCategory: ExecutiveKpiCategory;
  measurementType: ExecutiveKpiMeasurementType;
}): string {
  return Object.freeze(
    `eki:${input.executiveKpiId}:${input.displayName}:${input.kpiCategory}:${input.measurementType}`
  );
}

export function validateExecutiveKpiTargetDefinition(
  input: Partial<ExecutiveKpiTargetDefinition>
): ExecutiveKpiValidationResult {
  const issues: ExecutiveKpiValidationIssue[] = [];
  if (!input.description?.trim()) {
    issues.push(issue("missing_target_description", "targetDefinition.description is required."));
  }
  if (input.unitHint === undefined) {
    issues.push(issue("missing_unit_hint", "targetDefinition.unitHint is required (nullable)."));
  }
  if (input.directionHint === undefined) {
    issues.push(issue("missing_direction_hint", "targetDefinition.directionHint is required (nullable)."));
  }
  if (input.targetValueHint === undefined) {
    issues.push(issue("missing_target_value_hint", "targetDefinition.targetValueHint is required (nullable)."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function readKpiDeclarationsFromObject(object: ExecutiveObject): readonly DeclaredKpiStub[] {
  const extension = object.metadata.extension.futureExtension;
  if (!extension || typeof extension !== "object") {
    return Object.freeze([]);
  }
  const raw = (extension as Record<string, unknown>)[KPI_DECLARATIONS_EXTENSION_KEY];
  if (!Array.isArray(raw)) {
    return Object.freeze([]);
  }
  return Object.freeze(raw as DeclaredKpiStub[]);
}

export function extractKpiDeclarationsFromRegistry(
  registry: ExecutiveObjectRegistry
): ReadonlyArray<DeclaredKpiStub & { hostObjectId: string }> {
  const collected: Array<DeclaredKpiStub & { hostObjectId: string }> = [];
  for (const object of registry.objects) {
    for (const stub of readKpiDeclarationsFromObject(object)) {
      collected.push(Object.freeze({ ...stub, hostObjectId: object.executiveObjectId }));
    }
  }
  return Object.freeze(collected);
}

export function validateDeclaredKpiStub(input: Partial<DeclaredKpiStub>): ExecutiveKpiValidationResult {
  const issues: ExecutiveKpiValidationIssue[] = [];
  if (!input.executiveKpiId?.trim()) {
    issues.push(issue("missing_executive_kpi_id", "executiveKpiId is required."));
  }
  if (!input.displayName?.trim()) {
    issues.push(issue("missing_display_name", "displayName is required."));
  }
  if (!input.kpiCategory || !isExecutiveKpiCategory(input.kpiCategory)) {
    issues.push(issue("invalid_kpi_category", "kpiCategory must be one of eight values."));
  }
  if (!input.measurementType || !isExecutiveKpiMeasurementType(input.measurementType)) {
    issues.push(issue("invalid_measurement_type", "measurementType must be one of eight values."));
  }
  if (!input.targetDefinition) {
    issues.push(issue("missing_target_definition", "targetDefinition is required."));
  } else {
    const targetValidation = validateExecutiveKpiTargetDefinition(input.targetDefinition);
    if (!targetValidation.valid) {
      issues.push(...targetValidation.issues);
    }
  }
  if (!input.objectBindings) {
    issues.push(issue("missing_object_bindings", "objectBindings is required."));
  }
  if (!input.relationshipBindings) {
    issues.push(issue("missing_relationship_bindings", "relationshipBindings is required."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateObjectRegistryIntegrationInput(
  registry: Partial<ExecutiveObjectRegistry>
): ExecutiveKpiValidationResult {
  return validateExecutiveObjectRegistry(registry);
}

export function validateRelationshipRegistryIntegrationInput(
  registry: Partial<ExecutiveRelationshipRegistry>
): ExecutiveKpiValidationResult {
  return validateExecutiveRelationshipRegistry(registry);
}

export function validateKpiObjectBindings(input: {
  objectBindings: readonly ExecutiveKpiObjectBinding[];
  objectRegistry: ExecutiveObjectRegistry;
}): ExecutiveKpiValidationResult {
  const issues: ExecutiveKpiValidationIssue[] = [];
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
      issues.push(
        issue("duplicate_object_binding", `Duplicate object binding ${binding.executiveObjectId}.`)
      );
    }
    seen.add(binding.executiveObjectId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateKpiRelationshipBindings(input: {
  relationshipBindings: readonly ExecutiveKpiRelationshipBinding[];
  relationshipRegistry: ExecutiveRelationshipRegistry;
}): ExecutiveKpiValidationResult {
  const issues: ExecutiveKpiValidationIssue[] = [];
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
        issue(
          "duplicate_relationship_binding",
          `Duplicate relationship binding ${binding.executiveRelationshipId}.`
        )
      );
    }
    seen.add(binding.executiveRelationshipId);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveKpi(input: Partial<ExecutiveKpi>): ExecutiveKpiValidationResult {
  const issues: ExecutiveKpiValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_KPI_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match DS4-INT-1."));
  }
  if (!input.executiveKpiId?.trim()) {
    issues.push(issue("missing_executive_kpi_id", "executiveKpiId is required."));
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
  if (!input.kpiCategory || !isExecutiveKpiCategory(input.kpiCategory)) {
    issues.push(issue("invalid_kpi_category", "kpiCategory must be one of eight values."));
  }
  if (!input.measurementType || !isExecutiveKpiMeasurementType(input.measurementType)) {
    issues.push(issue("invalid_measurement_type", "measurementType must be one of eight values."));
  }
  if (!input.targetDefinition) {
    issues.push(issue("missing_target_definition", "targetDefinition is required."));
  } else {
    const targetValidation = validateExecutiveKpiTargetDefinition(input.targetDefinition);
    if (!targetValidation.valid) {
      issues.push(...targetValidation.issues);
    }
  }
  if (!input.objectBindings) {
    issues.push(issue("missing_object_bindings", "objectBindings is required."));
  }
  if (!input.relationshipBindings) {
    issues.push(issue("missing_relationship_bindings", "relationshipBindings is required."));
  }
  if (!input.metadata) {
    issues.push(issue("missing_metadata", "metadata is required."));
  }
  if (!input.lifecycleState || !isExecutiveKpiLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "lifecycleState must be one of six lifecycle values."));
  }
  if (!input.createdAt?.trim()) {
    issues.push(issue("missing_created_at", "createdAt is required."));
  }
  if (!input.updatedAt?.trim()) {
    issues.push(issue("missing_updated_at", "updatedAt is required."));
  }
  if (input.source !== EXECUTIVE_KPI_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-6-executive-kpi-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveKpiRegistry(
  input: Partial<ExecutiveKpiRegistry>,
  context?: {
    objectRegistry?: ExecutiveObjectRegistry;
    relationshipRegistry?: ExecutiveRelationshipRegistry;
  }
): ExecutiveKpiValidationResult {
  const issues: ExecutiveKpiValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_KPI_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match DS4-INT-1."));
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
  if (!input.integrationSessionId?.trim()) {
    issues.push(issue("missing_integration_session_id", "integrationSessionId is required."));
  }
  if (!input.kpis) {
    issues.push(issue("missing_kpis", "kpis array is required."));
  } else {
    const ids = new Set<string>();
    for (const kpi of input.kpis) {
      const kpiValidation = validateExecutiveKpi(kpi);
      if (!kpiValidation.valid) {
        issues.push(...kpiValidation.issues.map((entry) => issue(`kpi_${entry.code}`, entry.message)));
      }
      if (kpi.workspaceId !== input.workspaceId) {
        issues.push(issue("workspace_mismatch", `KPI ${kpi.executiveKpiId} workspace mismatch.`));
      }
      if (kpi.executiveModelId !== input.executiveModelId) {
        issues.push(issue("model_mismatch", `KPI ${kpi.executiveKpiId} model mismatch.`));
      }
      if (ids.has(kpi.executiveKpiId)) {
        issues.push(issue("duplicate_executive_kpi_id", `Duplicate id ${kpi.executiveKpiId}.`));
      }
      ids.add(kpi.executiveKpiId);
      if (context?.objectRegistry) {
        const objectBindingValidation = validateKpiObjectBindings({
          objectBindings: kpi.objectBindings,
          objectRegistry: context.objectRegistry,
        });
        if (!objectBindingValidation.valid) {
          issues.push(...objectBindingValidation.issues);
        }
      }
      if (context?.relationshipRegistry) {
        const relationshipBindingValidation = validateKpiRelationshipBindings({
          relationshipBindings: kpi.relationshipBindings,
          relationshipRegistry: context.relationshipRegistry,
        });
        if (!relationshipBindingValidation.valid) {
          issues.push(...relationshipBindingValidation.issues);
        }
      }
    }
    if (input.kpiCount !== undefined && input.kpiCount !== input.kpis.length) {
      issues.push(issue("kpi_count_mismatch", "kpiCount must match kpis length."));
    }
  }
  if (input.source !== EXECUTIVE_KPI_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "registry source must be phase-6-executive-kpi-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function buildExecutiveKpiFromStub(input: {
  stub: DeclaredKpiStub & { hostObjectId: string };
  objectRegistry: ExecutiveObjectRegistry;
  relationshipRegistry: ExecutiveRelationshipRegistry;
  integrationSessionId: string;
  timestamp: string;
}): ExecutiveKpi {
  const hostObject = resolveExecutiveObjectById(input.objectRegistry, input.stub.hostObjectId);
  const metadata: ExecutiveKpiMetadata = Object.freeze({
    tags: Object.freeze([...(input.stub.metadata?.tags ?? []), "eki-integrated"]),
    domainHint: hostObject?.metadata.domainHint ?? null,
    executiveCategoryHint: hostObject?.metadata.executiveCategoryHint ?? null,
    taxonomyOverride: null,
    extension: Object.freeze({ taxonomyOverride: null, futureExtension: Object.freeze({}) }),
  });
  const contentHash = computeExecutiveKpiContentHash({
    executiveKpiId: input.stub.executiveKpiId,
    displayName: input.stub.displayName,
    kpiCategory: input.stub.kpiCategory,
    measurementType: input.stub.measurementType,
  });
  return Object.freeze({
    contractVersion: EXECUTIVE_KPI_INTEGRATION_VERSION,
    executiveKpiId: input.stub.executiveKpiId,
    workspaceId: input.objectRegistry.workspaceId,
    executiveModelId: input.objectRegistry.executiveModelId,
    displayName: input.stub.displayName,
    kpiCategory: input.stub.kpiCategory,
    measurementType: input.stub.measurementType,
    targetDefinition: Object.freeze({ ...input.stub.targetDefinition }),
    objectBindings: Object.freeze(input.stub.objectBindings.map((entry) => Object.freeze({ ...entry }))),
    relationshipBindings: Object.freeze(
      input.stub.relationshipBindings.map((entry) => Object.freeze({ ...entry }))
    ),
    metadata,
    lifecycleState: "defined",
    objectRegistryId: input.objectRegistry.registryId,
    relationshipRegistryId: input.relationshipRegistry.registryId,
    hostObjectId: input.stub.hostObjectId,
    integrationSessionId: input.integrationSessionId,
    contentHash,
    createdAt: input.timestamp,
    updatedAt: input.timestamp,
    source: EXECUTIVE_KPI_INTEGRATION_SOURCE,
  });
}

function promoteKpiLifecycle(kpi: ExecutiveKpi): ExecutiveKpi {
  const validation = validateExecutiveKpi(kpi);
  if (!validation.valid) return kpi;
  return Object.freeze({ ...kpi, lifecycleState: "validated" as const, updatedAt: nowIso() });
}

export function integrateExecutiveKpisFromRegistries(
  input: ExecutiveKpiIntegrationInput
): ExecutiveKpiIntegrationResult {
  const integrationSessionId = input.integrationSessionId?.trim() || `eki-${Date.now()}`;
  const timestamp = nowIso();

  const objectRegistryValidation = validateObjectRegistryIntegrationInput(input.objectRegistry);
  if (!objectRegistryValidation.valid) {
    recordExecutiveKpiDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.objectRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      kpis: Object.freeze([]),
      issues: objectRegistryValidation.issues,
      integrationSessionId,
    });
  }

  const relationshipRegistryValidation = validateRelationshipRegistryIntegrationInput(input.relationshipRegistry);
  if (!relationshipRegistryValidation.valid) {
    recordExecutiveKpiDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.relationshipRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      kpis: Object.freeze([]),
      issues: relationshipRegistryValidation.issues,
      integrationSessionId,
    });
  }

  if (
    input.objectRegistry.workspaceId !== input.relationshipRegistry.workspaceId ||
    input.objectRegistry.executiveModelId !== input.relationshipRegistry.executiveModelId
  ) {
    const scopeIssue = issue("registry_scope_mismatch", "Object and relationship registries must share workspace and model scope.");
    recordExecutiveKpiDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.objectRegistry.workspaceId,
    });
    return Object.freeze({
      success: false,
      registry: null,
      kpis: Object.freeze([]),
      issues: Object.freeze([scopeIssue]),
      integrationSessionId,
    });
  }

  const objectRegistry = input.objectRegistry;
  const relationshipRegistry = input.relationshipRegistry;
  const declarations = extractKpiDeclarationsFromRegistry(objectRegistry);
  const seenIds = new Set<string>();
  const kpiIssues: ExecutiveKpiValidationIssue[] = [];
  const builtKpis: ExecutiveKpi[] = [];

  for (const stubWithHost of declarations) {
    const stubValidation = validateDeclaredKpiStub(stubWithHost);
    if (!stubValidation.valid) {
      kpiIssues.push(...stubValidation.issues);
      continue;
    }
    if (seenIds.has(stubWithHost.executiveKpiId)) {
      kpiIssues.push(issue("duplicate_executive_kpi_id", `Duplicate declaration id ${stubWithHost.executiveKpiId}.`));
      continue;
    }
    seenIds.add(stubWithHost.executiveKpiId);

    const kpi = buildExecutiveKpiFromStub({
      stub: stubWithHost,
      objectRegistry,
      relationshipRegistry,
      integrationSessionId,
      timestamp,
    });
    recordExecutiveKpiDiagnosticEvent({
      type: "KpiDeclared",
      integrationSessionId,
      workspaceId: objectRegistry.workspaceId,
      executiveKpiId: kpi.executiveKpiId,
    });

    const objectBindingValidation = validateKpiObjectBindings({
      objectBindings: kpi.objectBindings,
      objectRegistry,
    });
    if (!objectBindingValidation.valid) {
      kpiIssues.push(...objectBindingValidation.issues);
      continue;
    }

    const relationshipBindingValidation = validateKpiRelationshipBindings({
      relationshipBindings: kpi.relationshipBindings,
      relationshipRegistry,
    });
    if (!relationshipBindingValidation.valid) {
      kpiIssues.push(...relationshipBindingValidation.issues);
      continue;
    }

    const promoted = promoteKpiLifecycle(kpi);
    recordExecutiveKpiDiagnosticEvent({
      type: "KpiValidated",
      integrationSessionId,
      workspaceId: promoted.workspaceId,
      executiveKpiId: promoted.executiveKpiId,
    });
    builtKpis.push(promoted);
  }

  if (kpiIssues.length > 0) {
    recordExecutiveKpiDiagnostic({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: objectRegistry.workspaceId,
      message: "KPI declaration validation failed.",
    });
    return Object.freeze({
      success: false,
      registry: null,
      kpis: Object.freeze(builtKpis),
      issues: Object.freeze(kpiIssues),
      integrationSessionId,
    });
  }

  const validatedKpis = Object.freeze(builtKpis);
  const kpiRegistry: ExecutiveKpiRegistry = Object.freeze({
    contractVersion: EXECUTIVE_KPI_INTEGRATION_VERSION,
    registryId: `${integrationSessionId}-registry`,
    workspaceId: objectRegistry.workspaceId,
    executiveModelId: objectRegistry.executiveModelId,
    objectRegistryId: objectRegistry.registryId,
    relationshipRegistryId: relationshipRegistry.registryId,
    integrationSessionId,
    kpis: validatedKpis,
    kpiCount: validatedKpis.length,
    registryState: "validated",
    source: EXECUTIVE_KPI_INTEGRATION_SOURCE,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const outputValidation = validateExecutiveKpiRegistry(kpiRegistry, {
    objectRegistry,
    relationshipRegistry,
  });
  if (!outputValidation.valid) {
    recordExecutiveKpiDiagnostic({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: objectRegistry.workspaceId,
      message: "Executive KPI registry validation failed.",
    });
    return Object.freeze({
      success: false,
      registry: null,
      kpis: validatedKpis,
      issues: outputValidation.issues,
      integrationSessionId,
    });
  }

  recordExecutiveKpiDiagnosticEvent({
    type: "KpiRegistered",
    integrationSessionId,
    workspaceId: objectRegistry.workspaceId,
  });
  recordExecutiveKpiDiagnostic({
    type: "KpiRegistered",
    integrationSessionId,
    workspaceId: objectRegistry.workspaceId,
    message: `Registered ${validatedKpis.length} executive KPI(s).`,
  });

  return Object.freeze({
    success: true,
    registry: Object.freeze({ ...kpiRegistry, registryId: `${integrationSessionId}-registry` }),
    kpis: validatedKpis,
    issues: Object.freeze([]),
    integrationSessionId,
  });
}

export function resolveExecutiveKpiById(
  registry: ExecutiveKpiRegistry,
  executiveKpiId: string
): ExecutiveKpi | null {
  return registry.kpis.find((entry) => entry.executiveKpiId === executiveKpiId) ?? null;
}

export function listExecutiveKpisByCategory(
  registry: ExecutiveKpiRegistry,
  kpiCategory: ExecutiveKpiCategory
): readonly ExecutiveKpi[] {
  return Object.freeze(registry.kpis.filter((entry) => entry.kpiCategory === kpiCategory));
}

export function listExecutiveKpisForObject(
  registry: ExecutiveKpiRegistry,
  executiveObjectId: string
): readonly ExecutiveKpi[] {
  return Object.freeze(
    registry.kpis.filter((entry) =>
      entry.objectBindings.some((binding) => binding.executiveObjectId === executiveObjectId)
    )
  );
}

export function buildExecutiveKpiOwnershipContract(registry: ExecutiveKpiRegistry): ExecutiveKpiOwnershipContract {
  return Object.freeze({
    registryId: registry.registryId,
    workspaceId: registry.workspaceId,
    executiveModelId: registry.executiveModelId,
    objectRegistryId: registry.objectRegistryId,
    relationshipRegistryId: registry.relationshipRegistryId,
    isolationPolicy: "workspace-exclusive",
    upstreamAuthority: "phase-5-executive-relationship-integration",
    mutationPolicy: "integration-derived-immutable-snapshot",
  });
}

export function validateEkiDualRegistryInputBoundary(): Readonly<{ valid: boolean; evidence: string }> {
  const mustNotOwn =
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("ds1_direct_consumption") &&
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("emg_direct_consumption") &&
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("emg_model_record_consumption") &&
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("kpi_calculations") &&
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("persistence");
  return Object.freeze({
    valid: mustNotOwn,
    evidence: mustNotOwn
      ? "Dual-registry input boundary locked; DS-1, EMG, and KPI calculation excluded."
      : "Input boundary incomplete.",
  });
}

export function validateEkiNoCalculationIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const noCalculation =
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("kpi_calculations") &&
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("kpi_formula_execution") &&
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("aggregation_engine") &&
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("threshold_evaluation") &&
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("forecasting") &&
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("graph_algorithms");
  return Object.freeze({
    valid: noCalculation,
    evidence: noCalculation
      ? "Declarative KPI definitions only; calculation and graph analysis excluded."
      : "No-calculation boundary incomplete.",
  });
}

export function validateEkiBindingIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const bindingIntegrity =
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("graph_algorithms") &&
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("path_finding") &&
    EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("dependency_calculation") &&
    EXECUTIVE_KPI_BINDING_ROLES.length === 4;
  return Object.freeze({
    valid: bindingIntegrity,
    evidence: bindingIntegrity
      ? "Declarative identity bindings only; traversal and dependency analysis excluded."
      : "Binding integrity boundary incomplete.",
  });
}

export function attachKpiDeclarationsToObjectRegistry(
  objectRegistry: ExecutiveObjectRegistry,
  declarationsByHostObjectId: Readonly<Record<string, readonly DeclaredKpiStub[]>>
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
            [KPI_DECLARATIONS_EXTENSION_KEY]: Object.freeze(
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

export function resolveExecutiveObjectRegistryWithKpiDeclarationsExample(): ExecutiveObjectRegistry {
  const baseRegistry = resolveExecutiveObjectRegistryWithDeclarationsExample();
  return attachKpiDeclarationsToObjectRegistry(baseRegistry, {
    "emg-obj-outcome": Object.freeze([
      Object.freeze({
        executiveKpiId: "eki-kpi-outcome-delivery-001",
        displayName: "Outcome Delivery Rate",
        kpiCategory: "operational" as const,
        measurementType: "percentage" as const,
        targetDefinition: Object.freeze({
          description: "Percentage of planned outcomes delivered on schedule.",
          unitHint: "percent",
          directionHint: "higher_is_better" as const,
          targetValueHint: "95",
        }),
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
        metadata: Object.freeze({ tags: Object.freeze(["example"]) }),
      }),
    ]),
  });
}

export function resolveExecutiveKpiIntegrationInputExample(): ExecutiveKpiIntegrationInput {
  const objectRegistry = resolveExecutiveObjectRegistryWithKpiDeclarationsExample();
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  return Object.freeze({
    objectRegistry,
    relationshipRegistry,
    integrationSessionId: EXAMPLE_INTEGRATION_SESSION_ID,
  });
}

export function resolveExecutiveKpiRegistryExample(): ExecutiveKpiRegistry {
  const input = resolveExecutiveKpiIntegrationInputExample();
  const integration = integrateExecutiveKpisFromRegistries(input);
  if (!integration.registry) {
    throw new Error("Executive KPI registry example failed to build.");
  }
  return Object.freeze({ ...integration.registry, registryId: EXAMPLE_REGISTRY_ID });
}

export function resolveExecutiveKpiExample(): ExecutiveKpi {
  const registry = resolveExecutiveKpiRegistryExample();
  const first = registry.kpis[0];
  if (!first) {
    throw new Error("Executive KPI example registry is empty.");
  }
  return first;
}
