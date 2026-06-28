/**
 * PHASE-3 / EMG-1 — Executive Model Generation contract.
 * Canonical model vocabulary — definition-only, no runtime execution.
 */

import { resolveBusinessKnowledgeConceptExample } from "../businessKnowledge/businessKnowledgeLayerContract.ts";
import { resolveExecutiveBusinessDataSourceExample } from "../datasource/executiveBusinessDataSourceContract.ts";
import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import type {
  ExecutiveAssumptionDefinition,
  ExecutiveConstraintDefinition,
  ExecutiveKpiDefinition,
  ExecutiveModelFamilies,
  ExecutiveModelGenerationPipeline,
  ExecutiveModelGenerationStage,
  ExecutiveModelGenerationStageRecord,
  ExecutiveModelLifecycleState,
  ExecutiveModelMetadata,
  ExecutiveModelRecord,
  ExecutiveModelScoreDimensions,
  ExecutiveModelAnalysisScoreDimensions,
  ExecutiveModelValidationIssue,
  ExecutiveModelValidationResult,
  ExecutiveObjectDefinition,
  ExecutiveRelationshipDefinition,
  ExecutiveResourceDefinition,
  ExecutiveRiskDefinition,
} from "./executiveModelGenerationTypes.ts";

export const EXECUTIVE_MODEL_GENERATION_VERSION = "PHASE-3/EMG-1" as const;
export const EXECUTIVE_MODEL_GENERATION_SOURCE = "phase-3-executive-model-generation" as const;
export const EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID = "PHASE-2/DS-1" as const;
export const NEXORA_EXECUTIVE_MODEL_LOG_PREFIX = "[NexoraExecutiveModel]" as const;

export const EXECUTIVE_MODEL_GENERATION_MINIMUM_OVERALL_SCORE = 98 as const;

export const EXECUTIVE_MODEL_GENERATION_TAGS = Object.freeze([
  "[EMG1_EXECUTIVE_MODEL]",
  "[MODEL_GENERATION_DEFINED]",
  "[WORKSPACE_MODEL_OWNED]",
  "[EMG2_READY]",
] as const);

export const EXECUTIVE_MODEL_GENERATION_FREEZE_TAGS = Object.freeze([
  "[EMG_1_CERTIFIED]",
  "[EXECUTIVE_MODEL_GENERATION_ENGINE_FROZEN]",
  "[PHASE3_EMG_1_COMPLETE]",
] as const);

export const EXECUTIVE_MODEL_LIFECYCLE_STATES = Object.freeze([
  "draft",
  "generating",
  "generated",
  "reviewed",
  "approved",
  "published",
  "superseded",
  "archived",
] as const satisfies readonly ExecutiveModelLifecycleState[]);

export const EXECUTIVE_MODEL_GENERATION_STAGES = Object.freeze([
  "intake",
  "bind",
  "normalize",
  "compose",
  "validate",
  "emit",
] as const satisfies readonly ExecutiveModelGenerationStage[]);

export const EXECUTIVE_MODEL_FAMILY_IDS = Object.freeze([
  "objects",
  "relationships",
  "kpis",
  "risks",
  "resources",
  "constraints",
  "assumptions",
] as const);

export const BKL_CONCEPT_TO_MODEL_FAMILY_HINTS = Object.freeze({
  business_entity: "objects",
  process: "objects",
  activity: "objects",
  kpi_definition: "kpis",
  risk_definition: "risks",
  resource: "resources",
  stakeholder: "resources",
  business_rule: "constraints",
  business_term: "assumptions",
} as const);

export const EXECUTIVE_MODEL_GENERATION_MUST_NOT_OWN = Object.freeze([
  "executive_intelligence",
  "recommendations",
  "kpi_calculations",
  "risk_calculations",
  "scenario_simulations",
  "dashboard_rendering",
  "assistant_logic",
  "object_persistence",
  "relationship_discovery_runtime",
  "parsing",
  "upload_execution",
  "synchronization",
  "registry_mutation",
  "scene_sync",
  "intelligence_reasoning",
  "business_rule_execution",
  "model_runtime_storage",
  "ds1_contract_mutation",
] as const);

export const EXECUTIVE_MODEL_GENERATION_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "data-sources/dataSourceRegistryRuntime",
  "scene/objectRegistryRuntime",
  "workspace/workspaceSceneSync",
  "workspaceSceneSync.ts",
  "workspaceRelationshipSceneSync",
  "dashboardIntelligence/",
  "executiveIntelligencePlatform/",
  "assistantRuntime",
  "RelationshipRenderer",
  "ParserEngine",
  "ImportEngine",
  "ValidationEngine",
  "SynchronizationEngine",
  "scenario-intelligence/ScenarioGenerationRuntime",
  "risk-intelligence/RiskIntelligenceRuntime",
  "KpiImpactSimulationEngine",
  ".tsx",
] as const);

export const EXECUTIVE_MODEL_GENERATION_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-3/EMG-1",
  title: "Executive Model Generation Engine",
  goal: "Library-only canonical executive model generation contract after DS-1 Foundation.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveModel/executiveModelGenerationTypes.ts",
    "frontend/app/lib/executiveModel/executiveModelGenerationContract.ts",
    "frontend/app/lib/executiveModel/executiveModelGenerationDiagnostics.ts",
    "frontend/app/lib/executiveModel/executiveModelGenerationCertification.ts",
    "frontend/app/lib/executiveModel/executiveModelGenerationCertification.test.ts",
    "docs/emg-1-build-report.md",
    "docs/emg-1-analysis-report.md",
    "docs/emg-1-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_MODEL_GENERATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["DS-1-FOUNDATION", "STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_MODEL_GENERATION_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_MODEL_GENERATION_MODULE_PATHS = Object.freeze(
  EXECUTIVE_MODEL_GENERATION_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const LIFECYCLE_SET = new Set<string>(EXECUTIVE_MODEL_LIFECYCLE_STATES);
const STAGE_SET = new Set<string>(EXECUTIVE_MODEL_GENERATION_STAGES);
const EXAMPLE_TS = "2026-06-22T00:00:00.000Z";
const EXAMPLE_WORKSPACE = "workspace-example-001";
const EXAMPLE_MODEL_ID = "emg-model-example-001";

function issue(code: string, message: string): ExecutiveModelValidationIssue {
  return Object.freeze({ code, message });
}

export function computeExecutiveModelGenerationOverallScore(
  dimensions: ExecutiveModelScoreDimensions
): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveModelGenerationMinimumScore(overall: number): boolean {
  return overall >= EXECUTIVE_MODEL_GENERATION_MINIMUM_OVERALL_SCORE;
}

const ANALYSIS_SCORE_WEIGHTS = Object.freeze({
  architectureHealth: 0.14,
  maintainability: 0.12,
  scalability: 0.1,
  regressionSafety: 0.14,
  definitionBoundaryIntegrity: 0.16,
  modelIntegrity: 0.14,
  bugTraceability: 0.08,
  certificationReadiness: 0.12,
} as const);

export function computeExecutiveModelGenerationAnalysisScore(
  dimensions: ExecutiveModelAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.definitionBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.definitionBoundaryIntegrity +
    dimensions.modelIntegrity * ANALYSIS_SCORE_WEIGHTS.modelIntegrity +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function buildExecutiveModelOwnershipContract(
  record: Pick<ExecutiveModelRecord, "executiveModelId" | "workspaceId">
) {
  return Object.freeze({
    executiveModelId: record.executiveModelId.trim(),
    workspaceId: record.workspaceId.trim(),
    isolationPolicy: "workspace-exclusive" as const,
  });
}

function validatePipeline(input: Partial<ExecutiveModelGenerationPipeline>): ExecutiveModelValidationResult {
  const issues: ExecutiveModelValidationIssue[] = [];
  if (!Array.isArray(input.stages) || input.stages.length === 0) {
    issues.push(issue("missing_stages", "generationPipeline.stages must be a non-empty array."));
  } else {
    for (const stage of input.stages) {
      if (!stage.stage || !STAGE_SET.has(stage.stage)) {
        issues.push(issue("invalid_stage", "Each pipeline stage must be a supported value."));
      }
      if (stage.source && stage.source !== EXECUTIVE_MODEL_GENERATION_SOURCE) {
        issues.push(issue("invalid_stage_source", "Stage source must be phase-3-executive-model-generation."));
      }
    }
  }
  if (!input.inputBindings) issues.push(issue("missing_bindings", "generationPipeline.inputBindings is required."));
  else {
    if (!Array.isArray(input.inputBindings.businessDataSourceIds)) {
      issues.push(issue("missing_ebds_ids", "inputBindings.businessDataSourceIds must be an array."));
    }
    if (!Array.isArray(input.inputBindings.knowledgeArtifactIds)) {
      issues.push(issue("missing_bkl_ids", "inputBindings.knowledgeArtifactIds must be an array."));
    }
  }
  if (!input.currentStage || !STAGE_SET.has(input.currentStage)) {
    issues.push(issue("invalid_current_stage", "currentStage must be a supported pipeline stage."));
  }
  if (input.pipelineStatus && input.pipelineStatus !== "declared") {
    issues.push(issue("invalid_pipeline_status", "pipelineStatus must be declared."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function validateFamilies(input: Partial<ExecutiveModelFamilies>): ExecutiveModelValidationResult {
  const issues: ExecutiveModelValidationIssue[] = [];
  for (const family of EXECUTIVE_MODEL_FAMILY_IDS) {
    if (!Array.isArray(input[family])) {
      issues.push(issue(`missing_${family}`, `modelFamilies.${family} must be an array.`));
    }
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function validateMetadata(input: Partial<ExecutiveModelMetadata>): ExecutiveModelValidationResult {
  const issues: ExecutiveModelValidationIssue[] = [];
  if (!input.displayName?.trim()) issues.push(issue("missing_display_name", "metadata.displayName is required."));
  if (!Array.isArray(input.tags)) issues.push(issue("missing_tags", "metadata.tags must be an array."));
  if (!input.extension) issues.push(issue("missing_extension", "metadata.extension is required."));
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveModelRecord(input: Partial<ExecutiveModelRecord>): ExecutiveModelValidationResult {
  const issues: ExecutiveModelValidationIssue[] = [];
  if (!input.executiveModelId?.trim()) issues.push(issue("missing_model_id", "executiveModelId is required."));
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.sourceFoundationId?.trim()) {
    issues.push(issue("missing_foundation_id", "sourceFoundationId is required."));
  }
  if (!input.lifecycleState || !LIFECYCLE_SET.has(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle", "lifecycleState must be a supported value."));
  }
  if (!input.modelFamilies) issues.push(issue("missing_families", "modelFamilies is required."));
  else issues.push(...validateFamilies(input.modelFamilies).issues);
  if (!input.generationPipeline) issues.push(issue("missing_pipeline", "generationPipeline is required."));
  else issues.push(...validatePipeline(input.generationPipeline).issues);
  if (!input.metadata) issues.push(issue("missing_metadata", "metadata is required."));
  else issues.push(...validateMetadata(input.metadata).issues);
  if (!input.createdAt?.trim()) issues.push(issue("missing_created_at", "createdAt is required."));
  if (!input.updatedAt?.trim()) issues.push(issue("missing_updated_at", "updatedAt is required."));
  if (!input.generatedBy?.trim()) issues.push(issue("missing_generated_by", "generatedBy is required."));
  if (input.source && input.source !== EXECUTIVE_MODEL_GENERATION_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-3-executive-model-generation."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function pipelineStages(): readonly ExecutiveModelGenerationStageRecord[] {
  return Object.freeze(
    EXECUTIVE_MODEL_GENERATION_STAGES.map((stage) =>
      Object.freeze({
        stage,
        declaredAt: EXAMPLE_TS,
        stageStatus: "declared" as const,
        source: EXECUTIVE_MODEL_GENERATION_SOURCE,
      })
    )
  );
}

function exampleObjects(ebdsId: string, bklDomainId: string): readonly ExecutiveObjectDefinition[] {
  return Object.freeze([
    Object.freeze({
      executiveObjectId: "emg-obj-supplier",
      displayName: "Primary Supplier",
      objectKind: "entity" as const,
      businessRole: "source",
      knowledgeArtifactRef: bklDomainId,
      businessDataSourceRef: ebdsId,
      metadata: Object.freeze({ tags: Object.freeze(["operational"]) }),
      source: EXECUTIVE_MODEL_GENERATION_SOURCE,
    }),
    Object.freeze({
      executiveObjectId: "emg-obj-outcome",
      displayName: "On-Time Delivery",
      objectKind: "outcome" as const,
      businessRole: "outcome",
      knowledgeArtifactRef: null,
      businessDataSourceRef: ebdsId,
      metadata: Object.freeze({ tags: Object.freeze(["kpi-linked"]) }),
      source: EXECUTIVE_MODEL_GENERATION_SOURCE,
    }),
  ]);
}

function exampleFamilies(ebdsId: string, bklDomainId: string, bklKpiId: string, bklRiskId: string): ExecutiveModelFamilies {
  const objects = exampleObjects(ebdsId, bklDomainId);
  const relationships: readonly ExecutiveRelationshipDefinition[] = Object.freeze([
    Object.freeze({
      executiveRelationshipId: "emg-rel-001",
      fromExecutiveObjectId: "emg-obj-supplier",
      toExecutiveObjectId: "emg-obj-outcome",
      relationshipKind: "flows_to",
      strengthHint: "primary",
      source: EXECUTIVE_MODEL_GENERATION_SOURCE,
    }),
  ]);
  const kpis: readonly ExecutiveKpiDefinition[] = Object.freeze([
    Object.freeze({
      executiveKpiId: "emg-kpi-001",
      displayName: "On-Time Delivery Rate",
      definitionText: "Percentage of orders delivered by promise date.",
      directionality: "higher_is_better",
      linkedObjectIds: Object.freeze(["emg-obj-outcome"]),
      knowledgeArtifactRef: bklKpiId,
      source: EXECUTIVE_MODEL_GENERATION_SOURCE,
    }),
  ]);
  const risks: readonly ExecutiveRiskDefinition[] = Object.freeze([
    Object.freeze({
      executiveRiskId: "emg-risk-001",
      displayName: "Supplier Concentration",
      definitionText: "Risk of single-source supplier dependency.",
      severityHint: "medium",
      linkedObjectIds: Object.freeze(["emg-obj-supplier"]),
      knowledgeArtifactRef: bklRiskId,
      source: EXECUTIVE_MODEL_GENERATION_SOURCE,
    }),
  ]);
  const resources: readonly ExecutiveResourceDefinition[] = Object.freeze([
    Object.freeze({
      executiveResourceId: "emg-res-001",
      displayName: "Warehouse Capacity",
      resourceKind: "capacity",
      linkedObjectIds: Object.freeze(["emg-obj-supplier"]),
      knowledgeArtifactRef: "bkl-example-resource",
      source: EXECUTIVE_MODEL_GENERATION_SOURCE,
    }),
  ]);
  const constraints: readonly ExecutiveConstraintDefinition[] = Object.freeze([
    Object.freeze({
      executiveConstraintId: "emg-con-001",
      displayName: "VP Approval Threshold",
      constraintKind: "business_rule",
      constraintText: "Orders over threshold require VP approval.",
      linkedObjectIds: Object.freeze(["emg-obj-supplier"]),
      knowledgeArtifactRef: "bkl-example-business_rule",
      source: EXECUTIVE_MODEL_GENERATION_SOURCE,
    }),
  ]);
  const assumptions: readonly ExecutiveAssumptionDefinition[] = Object.freeze([
    Object.freeze({
      executiveAssumptionId: "emg-asm-001",
      displayName: "Stable Lead Time",
      assumptionText: "Supplier lead time remains within historical band.",
      assumptionScope: "model",
      linkedElementIds: Object.freeze(["emg-obj-supplier", "emg-kpi-001"]),
      source: EXECUTIVE_MODEL_GENERATION_SOURCE,
    }),
  ]);
  return Object.freeze({ objects, relationships, kpis, risks, resources, constraints, assumptions });
}

export function resolveExecutiveModelExample(): ExecutiveModelRecord {
  const ebds = resolveExecutiveBusinessDataSourceExample("operational");
  const bklDomain = resolveBusinessKnowledgeConceptExample("business_domain");
  const bklKpi = resolveBusinessKnowledgeConceptExample("kpi_definition");
  const bklRisk = resolveBusinessKnowledgeConceptExample("risk_definition");

  const metadata: ExecutiveModelMetadata = Object.freeze({
    displayName: "Operational Executive Model",
    description: "Canonical model derived from approved BKL definitions and EBDS source.",
    executiveCategoryHint: "operational",
    domainHint: bklDomain.displayName,
    tags: Object.freeze(["example", "emg-1"]),
    approvalRecord: null,
    extension: Object.freeze({ modelProfileId: null, futureExtension: Object.freeze({}) }),
  });

  const generationPipeline: ExecutiveModelGenerationPipeline = Object.freeze({
    stages: pipelineStages(),
    inputBindings: Object.freeze({
      businessDataSourceIds: Object.freeze([ebds.businessDataSourceId]),
      knowledgeArtifactIds: Object.freeze([
        bklDomain.knowledgeArtifactId,
        bklKpi.knowledgeArtifactId,
        bklRisk.knowledgeArtifactId,
      ]),
      statusSnapshotId: null,
    }),
    currentStage: "emit",
    pipelineStatus: "declared",
    source: EXECUTIVE_MODEL_GENERATION_SOURCE,
  });

  return Object.freeze({
    contractVersion: EXECUTIVE_MODEL_GENERATION_VERSION,
    executiveModelId: EXAMPLE_MODEL_ID,
    workspaceId: EXAMPLE_WORKSPACE,
    sourceFoundationId: EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID,
    lifecycleState: "generated",
    modelFamilies: exampleFamilies(
      ebds.businessDataSourceId,
      bklDomain.knowledgeArtifactId,
      bklKpi.knowledgeArtifactId,
      bklRisk.knowledgeArtifactId
    ),
    generationPipeline,
    metadata,
    createdAt: EXAMPLE_TS,
    updatedAt: EXAMPLE_TS,
    generatedBy: "emg-contract-example",
    source: EXECUTIVE_MODEL_GENERATION_SOURCE,
  });
}

export function validateEmgBklBindingIntegration(): Readonly<{ valid: boolean; evidence: string }> {
  const model = resolveExecutiveModelExample();
  const bklDomain = resolveBusinessKnowledgeConceptExample("business_domain");
  const bound =
    model.generationPipeline.inputBindings.knowledgeArtifactIds.includes(bklDomain.knowledgeArtifactId) &&
    model.modelFamilies.objects.some((obj) => obj.knowledgeArtifactRef === bklDomain.knowledgeArtifactId);
  return Object.freeze({
    valid: bound,
    evidence: bound ? `BKL artifact ${bklDomain.knowledgeArtifactId} bound to model families.` : "BKL binding missing.",
  });
}

export function validateEmgEbdsCorrelationIntegration(): Readonly<{ valid: boolean; evidence: string }> {
  const model = resolveExecutiveModelExample();
  const ebds = resolveExecutiveBusinessDataSourceExample("operational");
  const correlated =
    model.generationPipeline.inputBindings.businessDataSourceIds.includes(ebds.businessDataSourceId) &&
    model.workspaceId === ebds.workspaceId &&
    model.sourceFoundationId === EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID;
  return Object.freeze({
    valid: correlated,
    evidence: correlated
      ? `EBDS ${ebds.businessDataSourceId} correlated under ${EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID}.`
      : "EBDS correlation missing.",
  });
}

export function validateEmgWorkspaceIsolation(): Readonly<{ valid: boolean; evidence: string }> {
  const model = resolveExecutiveModelExample();
  const ebds = resolveExecutiveBusinessDataSourceExample("operational");
  const bkl = resolveBusinessKnowledgeConceptExample("business_domain");
  const isolated =
    model.workspaceId === EXAMPLE_WORKSPACE &&
    ebds.workspaceId === EXAMPLE_WORKSPACE &&
    bkl.workspaceId === EXAMPLE_WORKSPACE;
  return Object.freeze({
    valid: isolated,
    evidence: isolated ? `Model scoped to ${EXAMPLE_WORKSPACE}.` : "Workspace isolation mismatch.",
  });
}
