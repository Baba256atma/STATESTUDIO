/**
 * PHASE-5 / DS3-INT-1 — Executive Relationship Model Integration contract.
 * Relationship definition vocabulary — ExecutiveObjectRegistry input only.
 */

import {
  resolveExecutiveObjectById,
  resolveExecutiveObjectRegistryExample,
  validateExecutiveObjectRegistry,
} from "../executiveObject/executiveObjectContract.ts";
import type { ExecutiveObject, ExecutiveObjectRegistry } from "../executiveObject/executiveObjectTypes.ts";
import { STAGE_GLOBAL_FORBIDDEN_PATTERNS, STAGE_SCORE_WEIGHTS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  recordExecutiveRelationshipDiagnostic,
  recordExecutiveRelationshipDiagnosticEvent,
} from "./executiveRelationshipDiagnostics.ts";
import type {
  DeclaredRelationshipStub,
  ExecutiveRelationship,
  ExecutiveRelationshipDirection,
  ExecutiveRelationshipIntegrationInput,
  ExecutiveRelationshipIntegrationResult,
  ExecutiveRelationshipLifecycleState,
  ExecutiveRelationshipMetadata,
  ExecutiveRelationshipOwnershipContract,
  ExecutiveRelationshipRegistry,
  ExecutiveRelationshipScoreDimensions,
  ExecutiveRelationshipAnalysisScoreDimensions,
  ExecutiveRelationshipType,
  ExecutiveRelationshipValidationIssue,
  ExecutiveRelationshipValidationResult,
} from "./executiveRelationshipTypes.ts";

export const EXECUTIVE_RELATIONSHIP_INTEGRATION_VERSION = "PHASE-5/DS3-INT-1" as const;
export const EXECUTIVE_RELATIONSHIP_INTEGRATION_SOURCE = "phase-5-executive-relationship-integration" as const;
export const EXECUTIVE_RELATIONSHIP_INTEGRATION_LOG_PREFIX = "[NexoraExecutiveRelationshipIntegration]" as const;
export const EXECUTIVE_RELATIONSHIP_INTEGRATION_MINIMUM_OVERALL_SCORE = 98 as const;
export const RELATIONSHIP_DECLARATIONS_EXTENSION_KEY = "relationshipDeclarations" as const;

export const EXECUTIVE_RELATIONSHIP_INTEGRATION_TAGS = Object.freeze([
  "[DS3_INT_EXECUTIVE_RELATIONSHIP]",
  "[RELATIONSHIP_INTEGRATION_DEFINED]",
  "[WORKSPACE_RELATIONSHIP_OWNED]",
  "[KPI_ENGINE_READY]",
] as const);

export const EXECUTIVE_RELATIONSHIP_INTEGRATION_FREEZE_TAGS = Object.freeze([
  "[DS3_INT_1_CERTIFIED]",
  "[EXECUTIVE_RELATIONSHIP_MODEL_INTEGRATION_FROZEN]",
  "[PHASE5_DS3_RELATIONSHIP_COMPLETE]",
] as const);

export const EXECUTIVE_RELATIONSHIP_TYPES = Object.freeze([
  "depends_on",
  "reports_to",
  "owns",
  "supports",
  "controls",
  "influences",
  "uses",
  "custom",
] as const satisfies readonly ExecutiveRelationshipType[]);

export const EXECUTIVE_RELATIONSHIP_DIRECTIONS = Object.freeze([
  "forward",
  "reverse",
  "bidirectional",
] as const satisfies readonly ExecutiveRelationshipDirection[]);

export const EXECUTIVE_RELATIONSHIP_LIFECYCLE_STATES = Object.freeze([
  "draft",
  "defined",
  "validated",
  "active",
  "deprecated",
  "archived",
] as const satisfies readonly ExecutiveRelationshipLifecycleState[]);

export const EXECUTIVE_RELATIONSHIP_REGISTRY_STATES = Object.freeze([
  "draft",
  "validated",
  "active",
] as const);

export const EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN = Object.freeze([
  "relationship_discovery",
  "relationship_inference",
  "graph_algorithms",
  "path_finding",
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
  "scene_sync",
  "workspace_mutation",
  "registry_mutation",
  "object_registry_runtime",
  "ds1_direct_consumption",
  "emg_direct_consumption",
  "legacy_relationship_runtime",
  "emg1_contract_mutation",
  "emg2_contract_mutation",
  "emg3_contract_mutation",
  "ds2_contract_mutation",
] as const);

export const EXECUTIVE_RELATIONSHIP_INTEGRATION_FORBIDDEN_PATTERNS = Object.freeze([
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
  "dashboardIntelligence/",
  "executiveIntelligencePlatform/",
  "assistantRuntime",
  "ParserEngine",
  "ImportEngine",
  "SynchronizationEngine",
  "scenario-intelligence/ScenarioGenerationRuntime",
  "risk-intelligence/RiskIntelligenceRuntime",
  "KpiImpactSimulationEngine",
  ".tsx",
] as const);

export const EXECUTIVE_RELATIONSHIP_INTEGRATION_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-5/DS3-INT-1",
  title: "Executive Relationship Model Integration",
  goal: "Library-only relationship integration contract consuming frozen DS2 ExecutiveObjectRegistry.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveRelationship/executiveRelationshipTypes.ts",
    "frontend/app/lib/executiveRelationship/executiveRelationshipContract.ts",
    "frontend/app/lib/executiveRelationship/executiveRelationshipDiagnostics.ts",
    "frontend/app/lib/executiveRelationship/executiveRelationshipCertification.ts",
    "frontend/app/lib/executiveRelationship/executiveRelationshipCertification.test.ts",
    "docs/ds3-int-1-understanding-report.md",
    "docs/ds3-int-1-build-report.md",
    "docs/ds3-int-1-analysis-report.md",
    "docs/ds3-int-1-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_RELATIONSHIP_INTEGRATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["DS2-INT-1", "STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_RELATIONSHIP_INTEGRATION_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_RELATIONSHIP_INTEGRATION_MODULE_PATHS = Object.freeze(
  EXECUTIVE_RELATIONSHIP_INTEGRATION_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const EXAMPLE_INTEGRATION_SESSION_ID = "eri-session-example-001";
const EXAMPLE_REGISTRY_ID = "eri-registry-example-001";

function issue(code: string, message: string): ExecutiveRelationshipValidationIssue {
  return Object.freeze({ code, message });
}

function nowIso(): string {
  return new Date().toISOString();
}

function isExecutiveRelationshipType(value: string): value is ExecutiveRelationshipType {
  return (EXECUTIVE_RELATIONSHIP_TYPES as readonly string[]).includes(value);
}

function isExecutiveRelationshipDirection(value: string): value is ExecutiveRelationshipDirection {
  return (EXECUTIVE_RELATIONSHIP_DIRECTIONS as readonly string[]).includes(value);
}

function isExecutiveRelationshipLifecycleState(value: string): value is ExecutiveRelationshipLifecycleState {
  return (EXECUTIVE_RELATIONSHIP_LIFECYCLE_STATES as readonly string[]).includes(value);
}

export function computeExecutiveRelationshipIntegrationOverallScore(
  dimensions: ExecutiveRelationshipScoreDimensions
): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveRelationshipIntegrationMinimumScore(overall: number): boolean {
  return overall >= EXECUTIVE_RELATIONSHIP_INTEGRATION_MINIMUM_OVERALL_SCORE;
}

const ANALYSIS_SCORE_WEIGHTS = Object.freeze({
  architectureHealth: 0.13,
  maintainability: 0.11,
  scalability: 0.1,
  regressionSafety: 0.13,
  objectRegistryInputBoundaryIntegrity: 0.15,
  relationshipModelIntegrity: 0.13,
  noInferenceIntegrity: 0.13,
  bugTraceability: 0.07,
  certificationReadiness: 0.05,
} as const);

export function computeExecutiveRelationshipIntegrationAnalysisScore(
  dimensions: ExecutiveRelationshipAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.objectRegistryInputBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.objectRegistryInputBoundaryIntegrity +
    dimensions.relationshipModelIntegrity * ANALYSIS_SCORE_WEIGHTS.relationshipModelIntegrity +
    dimensions.noInferenceIntegrity * ANALYSIS_SCORE_WEIGHTS.noInferenceIntegrity +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function computeExecutiveRelationshipContentHash(input: {
  executiveRelationshipId: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: ExecutiveRelationshipType;
  direction: ExecutiveRelationshipDirection;
}): string {
  return Object.freeze(
    `eri:${input.executiveRelationshipId}:${input.sourceObjectId}:${input.targetObjectId}:${input.relationshipType}:${input.direction}`
  );
}

function readRelationshipDeclarationsFromObject(object: ExecutiveObject): readonly DeclaredRelationshipStub[] {
  const extension = object.metadata.extension.futureExtension;
  if (!extension || typeof extension !== "object") {
    return Object.freeze([]);
  }
  const raw = (extension as Record<string, unknown>)[RELATIONSHIP_DECLARATIONS_EXTENSION_KEY];
  if (!Array.isArray(raw)) {
    return Object.freeze([]);
  }
  return Object.freeze(raw as DeclaredRelationshipStub[]);
}

export function extractRelationshipDeclarationsFromRegistry(
  registry: ExecutiveObjectRegistry
): ReadonlyArray<DeclaredRelationshipStub & { hostObjectId: string }> {
  const collected: Array<DeclaredRelationshipStub & { hostObjectId: string }> = [];
  for (const object of registry.objects) {
    for (const stub of readRelationshipDeclarationsFromObject(object)) {
      collected.push(Object.freeze({ ...stub, hostObjectId: object.executiveObjectId }));
    }
  }
  return Object.freeze(collected);
}

export function validateDeclaredRelationshipStub(
  input: Partial<DeclaredRelationshipStub>
): ExecutiveRelationshipValidationResult {
  const issues: ExecutiveRelationshipValidationIssue[] = [];
  if (!input.executiveRelationshipId?.trim()) {
    issues.push(issue("missing_executive_relationship_id", "executiveRelationshipId is required."));
  }
  if (!input.sourceObjectId?.trim()) {
    issues.push(issue("missing_source_object_id", "sourceObjectId is required."));
  }
  if (!input.targetObjectId?.trim()) {
    issues.push(issue("missing_target_object_id", "targetObjectId is required."));
  }
  if (!input.relationshipType || !isExecutiveRelationshipType(input.relationshipType)) {
    issues.push(issue("invalid_relationship_type", "relationshipType must be one of eight values."));
  }
  if (!input.direction || !isExecutiveRelationshipDirection(input.direction)) {
    issues.push(issue("invalid_direction", "direction must be forward, reverse, or bidirectional."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateObjectRegistryIntegrationInput(
  registry: Partial<ExecutiveObjectRegistry>
): ExecutiveRelationshipValidationResult {
  return validateExecutiveObjectRegistry(registry);
}

export function validateRelationshipEndpoints(input: {
  relationship: Pick<ExecutiveRelationship, "sourceObjectId" | "targetObjectId">;
  objectRegistry: ExecutiveObjectRegistry;
  allowSelfReferentialRelationships?: boolean;
}): ExecutiveRelationshipValidationResult {
  const issues: ExecutiveRelationshipValidationIssue[] = [];
  if (!resolveExecutiveObjectById(input.objectRegistry, input.relationship.sourceObjectId)) {
    issues.push(issue("source_endpoint_missing", `Source object ${input.relationship.sourceObjectId} not in registry.`));
  }
  if (!resolveExecutiveObjectById(input.objectRegistry, input.relationship.targetObjectId)) {
    issues.push(issue("target_endpoint_missing", `Target object ${input.relationship.targetObjectId} not in registry.`));
  }
  if (
    input.relationship.sourceObjectId === input.relationship.targetObjectId &&
    input.allowSelfReferentialRelationships !== true
  ) {
    issues.push(issue("self_referential_forbidden", "Self-referential relationships are not allowed."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveRelationship(input: Partial<ExecutiveRelationship>): ExecutiveRelationshipValidationResult {
  const issues: ExecutiveRelationshipValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_RELATIONSHIP_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match DS3-INT-1."));
  }
  if (!input.executiveRelationshipId?.trim()) {
    issues.push(issue("missing_executive_relationship_id", "executiveRelationshipId is required."));
  }
  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_workspace_id", "workspaceId is required."));
  }
  if (!input.executiveModelId?.trim()) {
    issues.push(issue("missing_executive_model_id", "executiveModelId is required."));
  }
  if (!input.sourceObjectId?.trim()) {
    issues.push(issue("missing_source_object_id", "sourceObjectId is required."));
  }
  if (!input.targetObjectId?.trim()) {
    issues.push(issue("missing_target_object_id", "targetObjectId is required."));
  }
  if (!input.relationshipType || !isExecutiveRelationshipType(input.relationshipType)) {
    issues.push(issue("invalid_relationship_type", "relationshipType must be one of eight values."));
  }
  if (!input.direction || !isExecutiveRelationshipDirection(input.direction)) {
    issues.push(issue("invalid_direction", "direction must be forward, reverse, or bidirectional."));
  }
  if (input.strengthHint === undefined) {
    issues.push(issue("missing_strength_hint", "strengthHint is required (nullable)."));
  }
  if (!input.metadata) {
    issues.push(issue("missing_metadata", "metadata is required."));
  }
  if (!input.lifecycleState || !isExecutiveRelationshipLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle_state", "lifecycleState must be one of six lifecycle values."));
  }
  if (!input.createdAt?.trim()) {
    issues.push(issue("missing_created_at", "createdAt is required."));
  }
  if (!input.updatedAt?.trim()) {
    issues.push(issue("missing_updated_at", "updatedAt is required."));
  }
  if (input.source !== EXECUTIVE_RELATIONSHIP_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-5-executive-relationship-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveRelationshipRegistry(
  input: Partial<ExecutiveRelationshipRegistry>,
  objectRegistry?: ExecutiveObjectRegistry
): ExecutiveRelationshipValidationResult {
  const issues: ExecutiveRelationshipValidationIssue[] = [];
  if (input.contractVersion !== EXECUTIVE_RELATIONSHIP_INTEGRATION_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion must match DS3-INT-1."));
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
  if (!input.integrationSessionId?.trim()) {
    issues.push(issue("missing_integration_session_id", "integrationSessionId is required."));
  }
  if (!input.relationships) {
    issues.push(issue("missing_relationships", "relationships array is required."));
  } else {
    const ids = new Set<string>();
    for (const relationship of input.relationships) {
      const relationshipValidation = validateExecutiveRelationship(relationship);
      if (!relationshipValidation.valid) {
        issues.push(...relationshipValidation.issues.map((entry) => issue(`relationship_${entry.code}`, entry.message)));
      }
      if (relationship.workspaceId !== input.workspaceId) {
        issues.push(issue("workspace_mismatch", `Relationship ${relationship.executiveRelationshipId} workspace mismatch.`));
      }
      if (relationship.executiveModelId !== input.executiveModelId) {
        issues.push(issue("model_mismatch", `Relationship ${relationship.executiveRelationshipId} model mismatch.`));
      }
      if (ids.has(relationship.executiveRelationshipId)) {
        issues.push(issue("duplicate_executive_relationship_id", `Duplicate id ${relationship.executiveRelationshipId}.`));
      }
      ids.add(relationship.executiveRelationshipId);
      if (objectRegistry) {
        const endpointValidation = validateRelationshipEndpoints({
          relationship,
          objectRegistry,
        });
        if (!endpointValidation.valid) {
          issues.push(...endpointValidation.issues);
        }
      }
    }
    if (input.relationshipCount !== undefined && input.relationshipCount !== input.relationships.length) {
      issues.push(issue("relationship_count_mismatch", "relationshipCount must match relationships length."));
    }
  }
  if (input.source !== EXECUTIVE_RELATIONSHIP_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "registry source must be phase-5-executive-relationship-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function buildExecutiveRelationshipFromStub(input: {
  stub: DeclaredRelationshipStub & { hostObjectId: string };
  objectRegistry: ExecutiveObjectRegistry;
  integrationSessionId: string;
  timestamp: string;
}): ExecutiveRelationship {
  const sourceObject = resolveExecutiveObjectById(input.objectRegistry, input.stub.sourceObjectId);
  const metadata: ExecutiveRelationshipMetadata = Object.freeze({
    tags: Object.freeze([...(input.stub.metadata?.tags ?? []), "eri-integrated"]),
    domainHint: sourceObject?.metadata.domainHint ?? null,
    executiveCategoryHint: sourceObject?.metadata.executiveCategoryHint ?? null,
    classificationOverride: null,
    extension: Object.freeze({ classificationOverride: null, futureExtension: Object.freeze({}) }),
  });
  const contentHash = computeExecutiveRelationshipContentHash({
    executiveRelationshipId: input.stub.executiveRelationshipId,
    sourceObjectId: input.stub.sourceObjectId,
    targetObjectId: input.stub.targetObjectId,
    relationshipType: input.stub.relationshipType,
    direction: input.stub.direction,
  });
  return Object.freeze({
    contractVersion: EXECUTIVE_RELATIONSHIP_INTEGRATION_VERSION,
    executiveRelationshipId: input.stub.executiveRelationshipId,
    workspaceId: input.objectRegistry.workspaceId,
    executiveModelId: input.objectRegistry.executiveModelId,
    sourceObjectId: input.stub.sourceObjectId,
    targetObjectId: input.stub.targetObjectId,
    relationshipType: input.stub.relationshipType,
    direction: input.stub.direction,
    strengthHint: input.stub.strengthHint,
    metadata,
    lifecycleState: "defined",
    objectRegistryId: input.objectRegistry.registryId,
    hostObjectId: input.stub.hostObjectId,
    integrationSessionId: input.integrationSessionId,
    contentHash,
    createdAt: input.timestamp,
    updatedAt: input.timestamp,
    source: EXECUTIVE_RELATIONSHIP_INTEGRATION_SOURCE,
  });
}

function promoteRelationshipLifecycle(relationship: ExecutiveRelationship): ExecutiveRelationship {
  const validation = validateExecutiveRelationship(relationship);
  if (!validation.valid) return relationship;
  return Object.freeze({ ...relationship, lifecycleState: "validated" as const, updatedAt: nowIso() });
}

export function integrateExecutiveRelationshipsFromObjectRegistry(
  input: ExecutiveRelationshipIntegrationInput
): ExecutiveRelationshipIntegrationResult {
  const integrationSessionId = input.integrationSessionId?.trim() || `eri-${Date.now()}`;
  const timestamp = nowIso();
  const registryValidation = validateObjectRegistryIntegrationInput(input.objectRegistry);
  if (!registryValidation.valid) {
    recordExecutiveRelationshipDiagnosticEvent({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: input.objectRegistry.workspaceId ?? null,
    });
    return Object.freeze({
      success: false,
      registry: null,
      relationships: Object.freeze([]),
      issues: registryValidation.issues,
      integrationSessionId,
    });
  }

  const objectRegistry = input.objectRegistry;
  const declarations = extractRelationshipDeclarationsFromRegistry(objectRegistry);
  const seenIds = new Set<string>();
  const relationshipIssues: ExecutiveRelationshipValidationIssue[] = [];
  const builtRelationships: ExecutiveRelationship[] = [];

  for (const stubWithHost of declarations) {
    const stubValidation = validateDeclaredRelationshipStub(stubWithHost);
    if (!stubValidation.valid) {
      relationshipIssues.push(...stubValidation.issues);
      continue;
    }
    if (seenIds.has(stubWithHost.executiveRelationshipId)) {
      relationshipIssues.push(
        issue("duplicate_executive_relationship_id", `Duplicate declaration id ${stubWithHost.executiveRelationshipId}.`)
      );
      continue;
    }
    seenIds.add(stubWithHost.executiveRelationshipId);

    const relationship = buildExecutiveRelationshipFromStub({
      stub: stubWithHost,
      objectRegistry,
      integrationSessionId,
      timestamp,
    });
    recordExecutiveRelationshipDiagnosticEvent({
      type: "RelationshipDeclared",
      integrationSessionId,
      workspaceId: objectRegistry.workspaceId,
      executiveRelationshipId: relationship.executiveRelationshipId,
    });

    const endpointValidation = validateRelationshipEndpoints({
      relationship,
      objectRegistry,
      allowSelfReferentialRelationships: input.allowSelfReferentialRelationships,
    });
    if (!endpointValidation.valid) {
      relationshipIssues.push(...endpointValidation.issues);
      continue;
    }

    const promoted = promoteRelationshipLifecycle(relationship);
    recordExecutiveRelationshipDiagnosticEvent({
      type: "RelationshipValidated",
      integrationSessionId,
      workspaceId: promoted.workspaceId,
      executiveRelationshipId: promoted.executiveRelationshipId,
    });
    builtRelationships.push(promoted);
  }

  if (relationshipIssues.length > 0) {
    recordExecutiveRelationshipDiagnostic({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: objectRegistry.workspaceId,
      message: "Relationship declaration validation failed.",
    });
    return Object.freeze({
      success: false,
      registry: null,
      relationships: Object.freeze(builtRelationships),
      issues: Object.freeze(relationshipIssues),
      integrationSessionId,
    });
  }

  const validatedRelationships = Object.freeze(builtRelationships);
  const relationshipRegistry: ExecutiveRelationshipRegistry = Object.freeze({
    contractVersion: EXECUTIVE_RELATIONSHIP_INTEGRATION_VERSION,
    registryId: `${integrationSessionId}-registry`,
    workspaceId: objectRegistry.workspaceId,
    executiveModelId: objectRegistry.executiveModelId,
    objectRegistryId: objectRegistry.registryId,
    integrationSessionId,
    relationships: validatedRelationships,
    relationshipCount: validatedRelationships.length,
    registryState: "validated",
    source: EXECUTIVE_RELATIONSHIP_INTEGRATION_SOURCE,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const outputValidation = validateExecutiveRelationshipRegistry(relationshipRegistry, objectRegistry);
  if (!outputValidation.valid) {
    recordExecutiveRelationshipDiagnostic({
      type: "CertificationFailed",
      integrationSessionId,
      workspaceId: objectRegistry.workspaceId,
      message: "Executive relationship registry validation failed.",
    });
    return Object.freeze({
      success: false,
      registry: null,
      relationships: validatedRelationships,
      issues: outputValidation.issues,
      integrationSessionId,
    });
  }

  recordExecutiveRelationshipDiagnosticEvent({
    type: "RelationshipRegistered",
    integrationSessionId,
    workspaceId: objectRegistry.workspaceId,
  });
  recordExecutiveRelationshipDiagnostic({
    type: "RelationshipRegistered",
    integrationSessionId,
    workspaceId: objectRegistry.workspaceId,
    message: `Registered ${validatedRelationships.length} executive relationship(s).`,
  });

  return Object.freeze({
    success: true,
    registry: Object.freeze({ ...relationshipRegistry, registryId: `${integrationSessionId}-registry` }),
    relationships: validatedRelationships,
    issues: Object.freeze([]),
    integrationSessionId,
  });
}

export function resolveExecutiveRelationshipById(
  registry: ExecutiveRelationshipRegistry,
  executiveRelationshipId: string
): ExecutiveRelationship | null {
  return registry.relationships.find((entry) => entry.executiveRelationshipId === executiveRelationshipId) ?? null;
}

export function listExecutiveRelationshipsByType(
  registry: ExecutiveRelationshipRegistry,
  relationshipType: ExecutiveRelationshipType
): readonly ExecutiveRelationship[] {
  return Object.freeze(registry.relationships.filter((entry) => entry.relationshipType === relationshipType));
}

export function listExecutiveRelationshipsForObject(
  registry: ExecutiveRelationshipRegistry,
  executiveObjectId: string
): readonly ExecutiveRelationship[] {
  return Object.freeze(
    registry.relationships.filter(
      (entry) => entry.sourceObjectId === executiveObjectId || entry.targetObjectId === executiveObjectId
    )
  );
}

export function buildExecutiveRelationshipOwnershipContract(
  registry: ExecutiveRelationshipRegistry
): ExecutiveRelationshipOwnershipContract {
  return Object.freeze({
    registryId: registry.registryId,
    workspaceId: registry.workspaceId,
    executiveModelId: registry.executiveModelId,
    objectRegistryId: registry.objectRegistryId,
    isolationPolicy: "workspace-exclusive",
    upstreamAuthority: "phase-4-executive-object-integration",
    mutationPolicy: "integration-derived-immutable-snapshot",
  });
}

export function validateEriObjectRegistryInputBoundary(): Readonly<{ valid: boolean; evidence: string }> {
  const mustNotOwn =
    EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("ds1_direct_consumption") &&
    EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("emg_direct_consumption") &&
    EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("relationship_discovery") &&
    EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("persistence");
  return Object.freeze({
    valid: mustNotOwn,
    evidence: mustNotOwn
      ? "ObjectRegistry-only input boundary locked; DS-1 and EMG direct consumption excluded."
      : "Input boundary incomplete.",
  });
}

export function validateEriNoInferenceIntegrity(): Readonly<{ valid: boolean; evidence: string }> {
  const noInference =
    EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("relationship_discovery") &&
    EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("relationship_inference") &&
    EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("graph_algorithms") &&
    EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("path_finding");
  return Object.freeze({
    valid: noInference,
    evidence: noInference
      ? "Declarative extraction only; discovery, inference, and graph algorithms excluded."
      : "No-inference boundary incomplete.",
  });
}

export function attachRelationshipDeclarationsToObjectRegistry(
  objectRegistry: ExecutiveObjectRegistry,
  declarationsByHostObjectId: Readonly<Record<string, readonly DeclaredRelationshipStub[]>>
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
            [RELATIONSHIP_DECLARATIONS_EXTENSION_KEY]: Object.freeze(declarations.map((entry) => Object.freeze({ ...entry }))),
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

export function resolveExecutiveObjectRegistryWithDeclarationsExample(): ExecutiveObjectRegistry {
  const baseRegistry = resolveExecutiveObjectRegistryExample();
  return attachRelationshipDeclarationsToObjectRegistry(baseRegistry, {
    "emg-obj-supplier": Object.freeze([
      Object.freeze({
        executiveRelationshipId: "eri-rel-supplier-outcome-001",
        sourceObjectId: "emg-obj-supplier",
        targetObjectId: "emg-obj-outcome",
        relationshipType: "depends_on" as const,
        direction: "forward" as const,
        strengthHint: "primary",
        metadata: Object.freeze({ tags: Object.freeze(["example"]) }),
      }),
    ]),
  });
}

export function resolveExecutiveRelationshipRegistryExample(): ExecutiveRelationshipRegistry {
  const integration = integrateExecutiveRelationshipsFromObjectRegistry({
    objectRegistry: resolveExecutiveObjectRegistryWithDeclarationsExample(),
    integrationSessionId: EXAMPLE_INTEGRATION_SESSION_ID,
  });
  if (!integration.registry) {
    throw new Error("Executive relationship registry example failed to build.");
  }
  return Object.freeze({ ...integration.registry, registryId: EXAMPLE_REGISTRY_ID });
}

export function resolveExecutiveRelationshipExample(): ExecutiveRelationship {
  const registry = resolveExecutiveRelationshipRegistryExample();
  const first = registry.relationships[0];
  if (!first) {
    throw new Error("Executive relationship example registry is empty.");
  }
  return first;
}

export function resolveExecutiveRelationshipIntegrationInputExample(): ExecutiveRelationshipIntegrationInput {
  return Object.freeze({
    objectRegistry: resolveExecutiveObjectRegistryWithDeclarationsExample(),
    integrationSessionId: EXAMPLE_INTEGRATION_SESSION_ID,
  });
}
