/**
 * PHASE-4 / DS2-INT-1 — Executive Object Model Integration contract.
 * Object definition vocabulary — EMG-3 input only.
 */

import {
  EXECUTIVE_MODEL_GENERATION_SOURCE,
  resolveExecutiveModelExample,
  validateExecutiveModelRecord,
} from "../executiveModel/executiveModelGenerationContract.ts";
import type {
  ExecutiveModelRecord,
  ExecutiveObjectDefinition,
  ExecutiveObjectKind,
  ExecutiveResourceDefinition,
  ExecutiveResourceKind,
} from "../executiveModel/executiveModelGenerationTypes.ts";
import { STAGE_GLOBAL_FORBIDDEN_PATTERNS, STAGE_SCORE_WEIGHTS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  recordExecutiveObjectDiagnostic,
  recordExecutiveObjectDiagnosticEvent,
} from "./executiveObjectDiagnostics.ts";
import type {
  ExecutiveObject,
  ExecutiveObjectIntegrationInput,
  ExecutiveObjectIntegrationResult,
  ExecutiveObjectLifecycleState,
  ExecutiveObjectOwnershipContract,
  ExecutiveObjectRegistry,
  ExecutiveObjectScoreDimensions,
  ExecutiveObjectAnalysisScoreDimensions,
  ExecutiveObjectSourceReference,
  ExecutiveObjectType,
  ExecutiveObjectValidationIssue,
  ExecutiveObjectValidationResult,
} from "./executiveObjectTypes.ts";

export const EXECUTIVE_OBJECT_INTEGRATION_VERSION = "PHASE-4/DS2-INT-1" as const;
export const EXECUTIVE_OBJECT_INTEGRATION_SOURCE = "phase-4-executive-object-integration" as const;
export const EXECUTIVE_OBJECT_INTEGRATION_LOG_PREFIX = "[NexoraExecutiveObjectIntegration]" as const;
export const EXECUTIVE_OBJECT_INTEGRATION_MINIMUM_OVERALL_SCORE = 98 as const;

export const EXECUTIVE_OBJECT_INTEGRATION_TAGS = Object.freeze([
  "[DS2_INT_EXECUTIVE_OBJECT]",
  "[OBJECT_INTEGRATION_DEFINED]",
  "[WORKSPACE_OBJECT_OWNED]",
  "[REL_ENGINE_READY]",
] as const);

export const EXECUTIVE_OBJECT_INTEGRATION_FREEZE_TAGS = Object.freeze([
  "[DS2_INT_1_CERTIFIED]",
  "[EXECUTIVE_OBJECT_MODEL_INTEGRATION_FROZEN]",
  "[PHASE4_DS2_OBJECT_COMPLETE]",
] as const);

export const EXECUTIVE_OBJECT_TYPES = Object.freeze([
  "organization",
  "process",
  "department",
  "person",
  "resource",
  "asset",
  "system",
  "custom",
] as const satisfies readonly ExecutiveObjectType[]);

export const EXECUTIVE_OBJECT_LIFECYCLE_STATES = Object.freeze([
  "draft",
  "defined",
  "validated",
  "active",
  "deprecated",
  "archived",
] as const satisfies readonly ExecutiveObjectLifecycleState[]);

export const EXECUTIVE_OBJECT_REGISTRY_STATES = Object.freeze([
  "draft",
  "validated",
  "active",
] as const);

export const EMG1_OBJECT_KIND_TO_OBJECT_TYPE = Object.freeze({
  entity: "organization",
  process_node: "process",
  resource_pool: "resource",
  outcome: "custom",
  control: "system",
} as const satisfies Record<ExecutiveObjectKind, ExecutiveObjectType>);

export const EMG1_RESOURCE_KIND_TO_OBJECT_TYPE = Object.freeze({
  capacity: "resource",
  capability: "resource",
  asset: "asset",
  stakeholder: "person",
} as const satisfies Record<ExecutiveResourceKind, ExecutiveObjectType>);

export const EXECUTIVE_OBJECT_INTEGRATION_MUST_NOT_OWN = Object.freeze([
  "relationship_discovery",
  "relationship_generation",
  "kpi_calculations",
  "kpi_generation",
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
  "registry_mutation",
  "scene_sync",
  "workspace_mutation",
  "object_registry_runtime",
  "background_workers",
  "queue_system",
  "ds1_direct_consumption",
  "emg1_contract_mutation",
  "emg2_contract_mutation",
  "emg3_contract_mutation",
] as const);

export const EXECUTIVE_OBJECT_INTEGRATION_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "datasourceCertification/",
  "datasource/",
  "data-sources/dataSourceRegistryRuntime",
  "businessKnowledge/",
  "executiveBusinessDataSource",
  "scene/objectRegistryRuntime",
  "workspace/workspaceSceneSync",
  "workspaceRelationshipSceneSync",
  "dashboardIntelligence/",
  "executiveIntelligencePlatform/",
  "assistantRuntime",
  "RelationshipRenderer",
  "relationships/executive",
  "ParserEngine",
  "ImportEngine",
  "SynchronizationEngine",
  "scenario-intelligence/ScenarioGenerationRuntime",
  "risk-intelligence/RiskIntelligenceRuntime",
  "KpiImpactSimulationEngine",
  ".tsx",
] as const);

export const EXECUTIVE_OBJECT_INTEGRATION_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-4/DS2-INT-1",
  title: "Executive Object Model Integration",
  goal: "Library-only object integration contract consuming frozen EMG-3 emitted models.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveObject/executiveObjectTypes.ts",
    "frontend/app/lib/executiveObject/executiveObjectContract.ts",
    "frontend/app/lib/executiveObject/executiveObjectDiagnostics.ts",
    "frontend/app/lib/executiveObject/executiveObjectCertification.ts",
    "frontend/app/lib/executiveObject/executiveObjectCertification.test.ts",
    "docs/ds2-int-1-understanding-report.md",
    "docs/ds2-int-1-build-report.md",
    "docs/ds2-int-1-analysis-report.md",
    "docs/ds2-int-1-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_OBJECT_INTEGRATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["EMG-1", "EMG-2", "EMG-3", "STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_OBJECT_INTEGRATION_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_OBJECT_INTEGRATION_MODULE_PATHS = Object.freeze(
  EXECUTIVE_OBJECT_INTEGRATION_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const EXAMPLE_TS = "2026-06-22T00:00:00.000Z";
const EXAMPLE_INTEGRATION_SESSION_ID = "eoi-session-example-001";
const EXAMPLE_REGISTRY_ID = "eoi-registry-example-001";

function issue(code: string, message: string): ExecutiveObjectValidationIssue {
  return Object.freeze({ code, message });
}

function nowIso(): string {
  return new Date().toISOString();
}

function isExecutiveObjectType(value: string): value is ExecutiveObjectType {
  return (EXECUTIVE_OBJECT_TYPES as readonly string[]).includes(value);
}

function isExecutiveObjectLifecycleState(value: string): value is ExecutiveObjectLifecycleState {
  return (EXECUTIVE_OBJECT_LIFECYCLE_STATES as readonly string[]).includes(value);
}

export function computeExecutiveObjectIntegrationOverallScore(
  dimensions: ExecutiveObjectScoreDimensions
): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveObjectIntegrationMinimumScore(overall: number): boolean {
  return overall >= EXECUTIVE_OBJECT_INTEGRATION_MINIMUM_OVERALL_SCORE;
}

const ANALYSIS_SCORE_WEIGHTS = Object.freeze({
  architectureHealth: 0.14,
  maintainability: 0.12,
  scalability: 0.1,
  regressionSafety: 0.14,
  emg3InputBoundaryIntegrity: 0.16,
  objectModelIntegrity: 0.14,
  bugTraceability: 0.08,
  certificationReadiness: 0.12,
} as const);

export function computeExecutiveObjectIntegrationAnalysisScore(
  dimensions: ExecutiveObjectAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.emg3InputBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.emg3InputBoundaryIntegrity +
    dimensions.objectModelIntegrity * ANALYSIS_SCORE_WEIGHTS.objectModelIntegrity +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function mapEmg1ObjectKindToObjectType(
  objectKind: ExecutiveObjectKind,
  classificationOverride?: string | null
): ExecutiveObjectType {
  if (classificationOverride && isExecutiveObjectType(classificationOverride)) {
    return classificationOverride;
  }
  return EMG1_OBJECT_KIND_TO_OBJECT_TYPE[objectKind];
}

export function mapEmg1ResourceKindToObjectType(resourceKind: ExecutiveResourceKind): ExecutiveObjectType {
  return EMG1_RESOURCE_KIND_TO_OBJECT_TYPE[resourceKind];
}

export function computeExecutiveObjectContentHash(input: {
  executiveObjectId: string;
  displayName: string;
  objectType: ExecutiveObjectType;
  businessRole: string;
}): string {
  return Object.freeze(
    `eoi:${input.executiveObjectId}:${input.objectType}:${input.displayName}:${input.businessRole}`
  );
}

export function validateObjectSourceReference(
  input: Partial<ExecutiveObjectSourceReference>
): ExecutiveObjectValidationResult {
  const issues: ExecutiveObjectValidationIssue[] = [];
  if (input.sourceLayer !== EXECUTIVE_MODEL_GENERATION_SOURCE) {
    issues.push(issue("invalid_source_layer", "sourceReference.sourceLayer must be EMG-1 generation source."));
  }
  if (!input.elementKind) {
    issues.push(issue("missing_element_kind", "sourceReference.elementKind is required."));
  }
  if (!input.elementId?.trim()) {
    issues.push(issue("missing_element_id", "sourceReference.elementId is required."));
  }
  if (!input.executiveModelId?.trim()) {
    issues.push(issue("missing_executive_model_id", "sourceReference.executiveModelId is required."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateEmg3IntegrationInput(
  record: Partial<ExecutiveModelRecord>
): ExecutiveObjectValidationResult {
  const emgValidation = validateExecutiveModelRecord(record);
  const issues: ExecutiveObjectValidationIssue[] = [...emgValidation.issues.map((entry) => issue(entry.code, entry.message))];
  if (record.source && record.source !== EXECUTIVE_MODEL_GENERATION_SOURCE) {
    issues.push(issue("invalid_emg_source", "Executive model source must be EMG-1 generation."));
  }
  if (record.lifecycleState && record.lifecycleState !== "generated") {
    issues.push(issue("invalid_emg_lifecycle", "Integration input lifecycle must be generated."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveObject(input: Partial<ExecutiveObject>): ExecutiveObjectValidationResult {
  const issues: ExecutiveObjectValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_OBJECT_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match DS2-INT-1."));
  }
  if (!input.executiveObjectId?.trim()) {
    issues.push(issue("missing_executive_object_id", "executiveObjectId is required."));
  }
  if (!input.executiveModelId?.trim()) {
    issues.push(issue("missing_executive_model_id", "executiveModelId is required."));
  }
  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_workspace_id", "workspaceId is required."));
  }
  if (!input.objectType || !isExecutiveObjectType(input.objectType)) {
    issues.push(issue("invalid_object_type", "objectType must be one of eight classification values."));
  }
  if (!input.displayName?.trim()) {
    issues.push(issue("missing_display_name", "displayName is required."));
  }
  if (!input.businessRole?.trim()) {
    issues.push(issue("missing_business_role", "businessRole is required."));
  }
  if (!input.metadata) {
    issues.push(issue("missing_metadata", "metadata is required."));
  }
  if (!input.lifecycleState || !isExecutiveObjectLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "lifecycleState must be one of six lifecycle values."));
  }
  if (!input.sourceReference) {
    issues.push(issue("missing_source_reference", "sourceReference is required."));
  } else {
    const sourceValidation = validateObjectSourceReference(input.sourceReference);
    if (!sourceValidation.valid) issues.push(...sourceValidation.issues);
  }
  if (!input.createdAt?.trim()) {
    issues.push(issue("missing_created_at", "createdAt is required."));
  }
  if (!input.updatedAt?.trim()) {
    issues.push(issue("missing_updated_at", "updatedAt is required."));
  }
  if (input.source !== EXECUTIVE_OBJECT_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-4-executive-object-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveObjectRegistry(
  input: Partial<ExecutiveObjectRegistry>
): ExecutiveObjectValidationResult {
  const issues: ExecutiveObjectValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_OBJECT_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match DS2-INT-1."));
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
  if (!input.integrationSessionId?.trim()) {
    issues.push(issue("missing_integration_session_id", "integrationSessionId is required."));
  }
  if (!input.objects) {
    issues.push(issue("missing_objects", "objects array is required."));
  } else {
    const ids = new Set<string>();
    for (const object of input.objects) {
      const objectValidation = validateExecutiveObject(object);
      if (!objectValidation.valid) {
        issues.push(...objectValidation.issues.map((entry) => issue(`object_${entry.code}`, entry.message)));
      }
      if (object.workspaceId !== input.workspaceId) {
        issues.push(issue("workspace_mismatch", `Object ${object.executiveObjectId} workspace mismatch.`));
      }
      if (object.executiveModelId !== input.executiveModelId) {
        issues.push(issue("model_mismatch", `Object ${object.executiveObjectId} model mismatch.`));
      }
      if (ids.has(object.executiveObjectId)) {
        issues.push(issue("duplicate_executive_object_id", `Duplicate id ${object.executiveObjectId}.`));
      }
      ids.add(object.executiveObjectId);
    }
    if (input.objectCount !== undefined && input.objectCount !== input.objects.length) {
      issues.push(issue("object_count_mismatch", "objectCount must match objects length."));
    }
  }
  if (input.source !== EXECUTIVE_OBJECT_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "registry source must be phase-4-executive-object-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function buildExecutiveObjectFromDefinition(input: {
  definition: ExecutiveObjectDefinition;
  record: ExecutiveModelRecord;
  integrationSessionId: string;
  timestamp: string;
}): ExecutiveObject {
  const classificationOverride =
    input.definition.metadata.tags?.find((tag) => tag.startsWith("objectType:"))?.slice("objectType:".length) ?? null;
  const objectType = mapEmg1ObjectKindToObjectType(input.definition.objectKind, classificationOverride);
  const contentHash = computeExecutiveObjectContentHash({
    executiveObjectId: input.definition.executiveObjectId,
    displayName: input.definition.displayName,
    objectType,
    businessRole: input.definition.businessRole,
  });
  const sourceReference: ExecutiveObjectSourceReference = Object.freeze({
    sourceLayer: EXECUTIVE_MODEL_GENERATION_SOURCE,
    elementKind: "object",
    elementId: input.definition.executiveObjectId,
    executiveModelId: input.record.executiveModelId,
  });
  return Object.freeze({
    contractVersion: EXECUTIVE_OBJECT_INTEGRATION_VERSION,
    executiveObjectId: input.definition.executiveObjectId,
    executiveModelId: input.record.executiveModelId,
    workspaceId: input.record.workspaceId,
    objectType,
    displayName: input.definition.displayName,
    businessRole: input.definition.businessRole,
    metadata: Object.freeze({
      tags: Object.freeze([...(input.definition.metadata.tags ?? []), "eoi-integrated"]),
      domainHint: input.record.metadata.domainHint,
      executiveCategoryHint: input.record.metadata.executiveCategoryHint,
      classificationOverride,
      extension: Object.freeze({
        classificationOverride,
        futureExtension: Object.freeze({}),
      }),
    }),
    lifecycleState: "defined",
    sourceReference,
    emg1ObjectKind: input.definition.objectKind,
    knowledgeArtifactRef: input.definition.knowledgeArtifactRef,
    businessDataSourceRef: input.definition.businessDataSourceRef,
    integrationSessionId: input.integrationSessionId,
    contentHash,
    createdAt: input.timestamp,
    updatedAt: input.timestamp,
    source: EXECUTIVE_OBJECT_INTEGRATION_SOURCE,
  });
}

function buildExecutiveObjectFromResource(input: {
  resource: ExecutiveResourceDefinition;
  record: ExecutiveModelRecord;
  integrationSessionId: string;
  timestamp: string;
}): ExecutiveObject {
  const executiveObjectId = `${input.record.executiveModelId}:resource:${input.resource.executiveResourceId}`;
  const objectType = mapEmg1ResourceKindToObjectType(input.resource.resourceKind);
  const contentHash = computeExecutiveObjectContentHash({
    executiveObjectId,
    displayName: input.resource.displayName,
    objectType,
    businessRole: input.resource.resourceKind,
  });
  const sourceReference: ExecutiveObjectSourceReference = Object.freeze({
    sourceLayer: EXECUTIVE_MODEL_GENERATION_SOURCE,
    elementKind: "resource_projection",
    elementId: input.resource.executiveResourceId,
    executiveModelId: input.record.executiveModelId,
  });
  return Object.freeze({
    contractVersion: EXECUTIVE_OBJECT_INTEGRATION_VERSION,
    executiveObjectId,
    executiveModelId: input.record.executiveModelId,
    workspaceId: input.record.workspaceId,
    objectType,
    displayName: input.resource.displayName,
    businessRole: input.resource.resourceKind,
    metadata: Object.freeze({
      tags: Object.freeze(["eoi-integrated", "resource-projection"]),
      domainHint: input.record.metadata.domainHint,
      executiveCategoryHint: input.record.metadata.executiveCategoryHint,
      classificationOverride: null,
      extension: Object.freeze({ classificationOverride: null, futureExtension: Object.freeze({}) }),
    }),
    lifecycleState: "defined",
    sourceReference,
    emg1ObjectKind: null,
    knowledgeArtifactRef: input.resource.knowledgeArtifactRef,
    businessDataSourceRef: null,
    integrationSessionId: input.integrationSessionId,
    contentHash,
    createdAt: input.timestamp,
    updatedAt: input.timestamp,
    source: EXECUTIVE_OBJECT_INTEGRATION_SOURCE,
  });
}

function promoteObjectLifecycle(object: ExecutiveObject): ExecutiveObject {
  const validation = validateExecutiveObject(object);
  if (!validation.valid) return object;
  return Object.freeze({ ...object, lifecycleState: "validated" as const, updatedAt: nowIso() });
}

export function integrateExecutiveObjectsFromModel(
  input: ExecutiveObjectIntegrationInput
): ExecutiveObjectIntegrationResult {
  const integrationSessionId = input.integrationSessionId?.trim() || `eoi-${Date.now()}`;
  const timestamp = nowIso();
  const inputValidation = validateEmg3IntegrationInput(input.executiveModelRecord);
  if (!inputValidation.valid) {
    recordExecutiveObjectDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.executiveModelRecord.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      objects: Object.freeze([]),
      issues: inputValidation.issues,
      integrationSessionId,
    });
  }

  const record = input.executiveModelRecord;
  const declaredObjects = record.modelFamilies.objects.map((definition) => {
    const object = buildExecutiveObjectFromDefinition({
      definition,
      record,
      integrationSessionId,
      timestamp,
    });
    recordExecutiveObjectDiagnosticEvent({
      type: "ExecutiveObjectDeclared",
      integrationSessionId,
      workspaceId: record.workspaceId,
      executiveObjectId: object.executiveObjectId,
    });
    return object;
  });

  const projectedObjects =
    input.projectResourcesAsObjects === true
      ? record.modelFamilies.resources.map((resource) => {
          const object = buildExecutiveObjectFromResource({
            resource,
            record,
            integrationSessionId,
            timestamp,
          });
          recordExecutiveObjectDiagnosticEvent({
            type: "ExecutiveObjectDeclared",
            integrationSessionId,
            workspaceId: record.workspaceId,
            executiveObjectId: object.executiveObjectId,
          });
          return object;
        })
      : [];

  const combined = Object.freeze([...declaredObjects, ...projectedObjects]);
  const validatedObjects = combined.map((object) => {
    const promoted = promoteObjectLifecycle(object);
    recordExecutiveObjectDiagnosticEvent({
      type: "ExecutiveObjectValidated",
      integrationSessionId,
      workspaceId: promoted.workspaceId,
      executiveObjectId: promoted.executiveObjectId,
    });
    return promoted;
  });

  const registry: ExecutiveObjectRegistry = Object.freeze({
    contractVersion: EXECUTIVE_OBJECT_INTEGRATION_VERSION,
    registryId: `${integrationSessionId}-registry`,
    workspaceId: record.workspaceId,
    executiveModelId: record.executiveModelId,
    integrationSessionId,
    runtimeSessionId: input.runtimeSessionId ?? null,
    objects: validatedObjects,
    objectCount: validatedObjects.length,
    registryState: "validated",
    source: EXECUTIVE_OBJECT_INTEGRATION_SOURCE,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const registryValidation = validateExecutiveObjectRegistry(registry);
  if (!registryValidation.valid) {
    recordExecutiveObjectDiagnostic({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: record.workspaceId,
      message: "Executive object registry validation failed.",
    });
    return Object.freeze({
      success: false,
      registry: null,
      objects: validatedObjects,
      issues: registryValidation.issues,
      integrationSessionId,
    });
  }

  recordExecutiveObjectDiagnosticEvent({
    type: "ExecutiveObjectRegistered",
    integrationSessionId,
    workspaceId: record.workspaceId,
  });
  recordExecutiveObjectDiagnostic({
    type: "ExecutiveObjectRegistered",
    integrationSessionId,
    workspaceId: record.workspaceId,
    message: `Registered ${validatedObjects.length} executive object(s).`,
  });

  return Object.freeze({
    success: true,
    registry,
    objects: validatedObjects,
    issues: Object.freeze([]),
    integrationSessionId,
  });
}

export function resolveExecutiveObjectById(
  registry: ExecutiveObjectRegistry,
  executiveObjectId: string
): ExecutiveObject | null {
  return registry.objects.find((entry) => entry.executiveObjectId === executiveObjectId) ?? null;
}

export function listExecutiveObjectsByType(
  registry: ExecutiveObjectRegistry,
  objectType: ExecutiveObjectType
): readonly ExecutiveObject[] {
  return Object.freeze(registry.objects.filter((entry) => entry.objectType === objectType));
}

export function buildExecutiveObjectOwnershipContract(
  registry: ExecutiveObjectRegistry
): ExecutiveObjectOwnershipContract {
  return Object.freeze({
    registryId: registry.registryId,
    workspaceId: registry.workspaceId,
    executiveModelId: registry.executiveModelId,
    isolationPolicy: "workspace-exclusive",
    upstreamAuthority: "phase-3-executive-model-runtime",
    mutationPolicy: "integration-derived-immutable-snapshot",
  });
}

export function validateEoiEmg3InputBoundary(): Readonly<{ valid: boolean; evidence: string }> {
  const mustNotOwn =
    EXECUTIVE_OBJECT_INTEGRATION_MUST_NOT_OWN.includes("ds1_direct_consumption") &&
    EXECUTIVE_OBJECT_INTEGRATION_MUST_NOT_OWN.includes("relationship_discovery") &&
    EXECUTIVE_OBJECT_INTEGRATION_MUST_NOT_OWN.includes("persistence");
  return Object.freeze({
    valid: mustNotOwn,
    evidence: mustNotOwn
      ? "EMG-3-only input boundary locked; DS-1 direct consumption excluded."
      : "Input boundary incomplete.",
  });
}

export function validateEoiClassificationMapping(): Readonly<{ valid: boolean; evidence: string }> {
  const complete =
    Object.keys(EMG1_OBJECT_KIND_TO_OBJECT_TYPE).length === 5 &&
    EXECUTIVE_OBJECT_TYPES.length === 8;
  return Object.freeze({
    valid: complete,
    evidence: complete ? "Five EMG-1 kinds map to eight object types." : "Classification mapping incomplete.",
  });
}

export function resolveExecutiveObjectRegistryExample(): ExecutiveObjectRegistry {
  const integration = integrateExecutiveObjectsFromModel({
    executiveModelRecord: resolveExecutiveModelExample(),
    integrationSessionId: EXAMPLE_INTEGRATION_SESSION_ID,
    runtimeSessionId: "emgr-session-example-001",
  });
  if (!integration.registry) {
    throw new Error("Executive object registry example failed to build.");
  }
  return Object.freeze({ ...integration.registry, registryId: EXAMPLE_REGISTRY_ID });
}

export function resolveExecutiveObjectIntegrationInputExample(): ExecutiveObjectIntegrationInput {
  return Object.freeze({
    executiveModelRecord: resolveExecutiveModelExample(),
    integrationSessionId: EXAMPLE_INTEGRATION_SESSION_ID,
    runtimeSessionId: "emgr-session-example-001",
    projectResourcesAsObjects: false,
  });
}

export function resolveExecutiveObjectExample(): ExecutiveObject {
  const registry = resolveExecutiveObjectRegistryExample();
  const first = registry.objects[0];
  if (!first) {
    throw new Error("Executive object example registry is empty.");
  }
  return first;
}
