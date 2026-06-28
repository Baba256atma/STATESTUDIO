/**
 * PHASE-3 / EMG-3 — Executive Model Pipeline Runtime contract.
 * Generic kernel vocabulary — structural emission only.
 */

import {
  EXECUTIVE_MODEL_GENERATION_SOURCE,
  EXECUTIVE_MODEL_GENERATION_VERSION,
  EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID,
  resolveExecutiveModelExample,
  validateExecutiveModelRecord,
} from "../executiveModel/executiveModelGenerationContract.ts";
import type { ExecutiveModelRecord } from "../executiveModel/executiveModelGenerationTypes.ts";
import {
  CHECKPOINT_STAGE_MAP,
  EXECUTIVE_MODEL_PIPELINE_VERSION,
  PIPELINE_CHECKPOINT_KINDS,
  validatePipelineStageTransition,
} from "../executiveModelPipeline/executiveModelPipelineContract.ts";
import type { PipelineExecutionStage, PipelineValidationSummary } from "../executiveModelPipeline/executiveModelPipelineTypes.ts";
import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import type {
  RuntimeExecutionContext,
  RuntimeExecutionInput,
  RuntimeScoreDimensions,
  RuntimeAnalysisScoreDimensions,
  RuntimeSession,
  RuntimeState,
  RuntimeValidationIssue,
  RuntimeValidationResult,
} from "./executiveModelRuntimeTypes.ts";

export const EXECUTIVE_MODEL_RUNTIME_VERSION = "PHASE-3/EMG-3" as const;
export const EXECUTIVE_MODEL_RUNTIME_SOURCE = "phase-3-executive-model-runtime" as const;
export const EXECUTIVE_MODEL_RUNTIME_LOG_PREFIX = "[NexoraExecutiveModelRuntime]" as const;

export const EXECUTIVE_MODEL_RUNTIME_MINIMUM_OVERALL_SCORE = 98 as const;

export const EXECUTIVE_MODEL_RUNTIME_TAGS = Object.freeze([
  "[EMG3_PIPELINE_RUNTIME]",
  "[MODEL_GENERATION_RUNTIME_DEFINED]",
  "[WORKSPACE_RUNTIME_OWNED]",
  "[DOMAIN_ENGINE_READY]",
] as const);

export const EXECUTIVE_MODEL_RUNTIME_FREEZE_TAGS = Object.freeze([
  "[EMG_3_CERTIFIED]",
  "[EXECUTIVE_MODEL_PIPELINE_RUNTIME_FROZEN]",
  "[PHASE3_EMG_COMPLETE]",
] as const);

export const RUNTIME_STATES = Object.freeze([
  "idle",
  "running",
  "completed",
  "failed",
  "cancelled",
] as const satisfies readonly RuntimeState[]);

export const RUNTIME_EXECUTABLE_STAGES = Object.freeze([
  "initialize",
  "load_foundation",
  "bind_business_knowledge",
  "compose_model",
  "validate_model",
  "emit_model",
] as const);

export const RUNTIME_TERMINAL_STAGES = Object.freeze([
  "completed",
  "failed",
] as const satisfies readonly PipelineExecutionStage[]);

export const RUNTIME_TERMINAL_STATES = Object.freeze([
  "completed",
  "failed",
  "cancelled",
] as const satisfies readonly RuntimeState[]);

export const RUNTIME_CANCELLATION_STATES = Object.freeze([
  "none",
  "requested",
  "acknowledged",
] as const);

export const EXECUTIVE_MODEL_RUNTIME_MUST_NOT_OWN = Object.freeze([
  "object_generation",
  "relationship_generation",
  "kpi_generation",
  "risk_generation",
  "scenario_generation",
  "executive_intelligence",
  "recommendations",
  "dashboard_rendering",
  "assistant_logic",
  "persistence",
  "upload_execution",
  "parsing",
  "synchronization",
  "registry_mutation",
  "scene_sync",
  "intelligence_reasoning",
  "relationship_discovery",
  "kpi_calculations",
  "risk_calculations",
  "scenario_simulations",
  "background_workers",
  "queue_system",
  "ds1_contract_mutation",
  "emg1_contract_mutation",
  "emg2_contract_mutation",
] as const);

export const EXECUTIVE_MODEL_RUNTIME_FORBIDDEN_PATTERNS = Object.freeze([
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
  "executiveModel/executiveModelGenerationContract",
  "executiveModelPipeline/executiveModelPipelineContract",
  ".tsx",
] as const);

export const EXECUTIVE_MODEL_RUNTIME_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-3/EMG-3",
  title: "Executive Model Pipeline Runtime",
  goal: "Library-only generic pipeline execution kernel after frozen EMG-1 and EMG-2.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveModelRuntime/executiveModelRuntimeTypes.ts",
    "frontend/app/lib/executiveModelRuntime/executiveModelRuntimeContract.ts",
    "frontend/app/lib/executiveModelRuntime/executiveModelRuntimeDiagnostics.ts",
    "frontend/app/lib/executiveModelRuntime/executiveModelRuntimeKernel.ts",
    "frontend/app/lib/executiveModelRuntime/executiveModelRuntimeCertification.ts",
    "frontend/app/lib/executiveModelRuntime/executiveModelRuntimeCertification.test.ts",
    "docs/emg-3-build-report.md",
    "docs/emg-3-analysis-report.md",
    "docs/emg-3-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_MODEL_RUNTIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["DS-1-FOUNDATION", "EMG-1", "EMG-2", "STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_MODEL_RUNTIME_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_MODEL_RUNTIME_MODULE_PATHS = Object.freeze(
  EXECUTIVE_MODEL_RUNTIME_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const EXAMPLE_TS = "2026-06-22T00:00:00.000Z";
const EXAMPLE_WORKSPACE = "workspace-example-001";
const EXAMPLE_RUNTIME_SESSION_ID = "emgr-session-example-001";
const EXAMPLE_EXECUTION_SESSION_ID = "emgp-session-example-001";
const EXAMPLE_MODEL_ID = "emg-model-example-001";

function issue(code: string, message: string): RuntimeValidationIssue {
  return Object.freeze({ code, message });
}

export function computeExecutiveModelRuntimeOverallScore(dimensions: RuntimeScoreDimensions): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveModelRuntimeMinimumScore(overall: number): boolean {
  return overall >= EXECUTIVE_MODEL_RUNTIME_MINIMUM_OVERALL_SCORE;
}

const ANALYSIS_SCORE_WEIGHTS = Object.freeze({
  architectureHealth: 0.14,
  maintainability: 0.12,
  scalability: 0.1,
  regressionSafety: 0.14,
  runtimeBoundaryIntegrity: 0.16,
  structuralEmissionIntegrity: 0.14,
  bugTraceability: 0.08,
  certificationReadiness: 0.12,
} as const);

export function computeExecutiveModelRuntimeAnalysisScore(
  dimensions: RuntimeAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.runtimeBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.runtimeBoundaryIntegrity +
    dimensions.structuralEmissionIntegrity * ANALYSIS_SCORE_WEIGHTS.structuralEmissionIntegrity +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function buildRuntimeOwnershipContract(
  session: Pick<RuntimeSession, "runtimeSessionId" | "workspaceId" | "executiveModelId">
) {
  return Object.freeze({
    runtimeSessionId: session.runtimeSessionId.trim(),
    workspaceId: session.workspaceId.trim(),
    executiveModelId: session.executiveModelId.trim(),
    isolationPolicy: "workspace-exclusive" as const,
  });
}

export function validateRuntimeExecutionContext(input: Partial<RuntimeExecutionContext>): RuntimeValidationResult {
  const issues: RuntimeValidationIssue[] = [];
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.executionSessionId?.trim()) {
    issues.push(issue("missing_execution_session_id", "executionSessionId is required."));
  }
  if (!input.executiveModelId?.trim()) issues.push(issue("missing_model_id", "executiveModelId is required."));
  if (!input.foundationReferences) {
    issues.push(issue("missing_foundation_refs", "foundationReferences is required."));
  }
  if (!input.knowledgeBindings) {
    issues.push(issue("missing_knowledge_bindings", "knowledgeBindings is required."));
  }
  if (!input.pipelineSessionRef?.trim()) {
    issues.push(issue("missing_pipeline_ref", "pipelineSessionRef is required."));
  }
  if (!Array.isArray(input.boundSemanticRefs)) {
    issues.push(issue("missing_semantic_refs", "boundSemanticRefs must be an array."));
  }
  if (input.source && input.source !== EXECUTIVE_MODEL_RUNTIME_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-3-executive-model-runtime."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateRuntimeSession(input: Partial<RuntimeSession>): RuntimeValidationResult {
  const issues: RuntimeValidationIssue[] = [];
  if (!input.runtimeSessionId?.trim()) issues.push(issue("missing_runtime_session_id", "runtimeSessionId is required."));
  if (!input.executionSessionId?.trim()) {
    issues.push(issue("missing_execution_session_id", "executionSessionId is required."));
  }
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.executiveModelId?.trim()) issues.push(issue("missing_model_id", "executiveModelId is required."));
  if (!input.runtimeState || !RUNTIME_STATES.includes(input.runtimeState)) {
    issues.push(issue("invalid_runtime_state", "runtimeState must be supported."));
  }
  if (!input.currentStage) issues.push(issue("missing_current_stage", "currentStage is required."));
  if (!input.executionContext) issues.push(issue("missing_context", "executionContext is required."));
  else issues.push(...validateRuntimeExecutionContext(input.executionContext).issues);
  if (!Array.isArray(input.checkpoints)) issues.push(issue("missing_checkpoints", "checkpoints must be an array."));
  if (!Array.isArray(input.diagnostics)) issues.push(issue("missing_diagnostics", "diagnostics must be an array."));
  if (!input.metadata) issues.push(issue("missing_metadata", "metadata is required."));
  if (!input.createdAt?.trim()) issues.push(issue("missing_created_at", "createdAt is required."));
  if (input.completedAt !== null && input.completedAt !== undefined && !input.completedAt.trim()) {
    issues.push(issue("invalid_completed_at", "completedAt must be null or a non-empty ISO string."));
  }
  if (input.source && input.source !== EXECUTIVE_MODEL_RUNTIME_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-3-executive-model-runtime."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateStructuralModelEmission(model: ExecutiveModelRecord | null): RuntimeValidationResult {
  const issues: RuntimeValidationIssue[] = [];
  if (!model) {
    issues.push(issue("missing_model", "Emitted model is required."));
    return Object.freeze({ valid: false, issues: Object.freeze(issues) });
  }
  const validation = validateExecutiveModelRecord(model);
  if (!validation.valid) issues.push(...validation.issues.map((entry) => issue(entry.code, entry.message)));
  if (model.lifecycleState !== "generated") {
    issues.push(issue("invalid_lifecycle", "Emitted model lifecycle must be generated."));
  }
  if (model.source !== EXECUTIVE_MODEL_GENERATION_SOURCE) {
    issues.push(issue("invalid_model_source", "Emitted model must use EMG-1 source."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function resolveRuntimeExecutionInputExample(): RuntimeExecutionInput {
  const model = resolveExecutiveModelExample();
  return Object.freeze({
    executionSessionId: EXAMPLE_EXECUTION_SESSION_ID,
    workspaceId: EXAMPLE_WORKSPACE,
    executiveModelId: EXAMPLE_MODEL_ID,
    sourceFoundationId: EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID,
    businessDataSourceIds: Object.freeze([...model.generationPipeline.inputBindings.businessDataSourceIds]),
    knowledgeArtifactIds: Object.freeze([...model.generationPipeline.inputBindings.knowledgeArtifactIds]),
    statusSnapshotId: model.generationPipeline.inputBindings.statusSnapshotId,
    metadata: Object.freeze({
      displayName: "Operational Model Runtime Run",
      triggerSource: "certification-probe",
    }),
  });
}

export function resolveRuntimeSessionExample(): RuntimeSession {
  return Object.freeze({
    contractVersion: EXECUTIVE_MODEL_RUNTIME_VERSION,
    runtimeSessionId: EXAMPLE_RUNTIME_SESSION_ID,
    executionSessionId: EXAMPLE_EXECUTION_SESSION_ID,
    workspaceId: EXAMPLE_WORKSPACE,
    executiveModelId: EXAMPLE_MODEL_ID,
    runtimeState: "completed",
    currentStage: "completed",
    executionContext: Object.freeze({
      workspaceId: EXAMPLE_WORKSPACE,
      executionSessionId: EXAMPLE_EXECUTION_SESSION_ID,
      executiveModelId: EXAMPLE_MODEL_ID,
      foundationReferences: Object.freeze({
        sourceFoundationId: EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID,
        businessDataSourceIds: Object.freeze(["ebds-example-operational"]),
        statusSnapshotId: null,
      }),
      knowledgeBindings: Object.freeze({
        knowledgeArtifactIds: Object.freeze(["bkl-example-domain", "bkl-example-kpi", "bkl-example-risk"]),
      }),
      pipelineSessionRef: EXAMPLE_EXECUTION_SESSION_ID,
      boundSemanticRefs: Object.freeze(["bkl-example-domain", "bkl-example-kpi", "bkl-example-risk"]),
      draftModel: null,
      validationSummary: Object.freeze({
        valid: true,
        issueCount: 0,
        issues: Object.freeze([]),
        validatedAt: EXAMPLE_TS,
        delegatedTo: "phase-3-executive-model-generation",
        source: "phase-3-executive-model-pipeline",
      }) satisfies PipelineValidationSummary,
      emittedModelRef: EXAMPLE_MODEL_ID,
      cancellationState: "none",
      lastError: null,
      source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
    }),
    checkpoints: Object.freeze(
      PIPELINE_CHECKPOINT_KINDS.map((checkpointKind, index) =>
        Object.freeze({
          checkpointId: `emgr-ckpt-${String(index + 1).padStart(3, "0")}`,
          checkpointKind,
          reachedAt: EXAMPLE_TS,
          stageAtCheckpoint: CHECKPOINT_STAGE_MAP[checkpointKind],
          evidence: `${checkpointKind} runtime checkpoint recorded.`,
          runtimeSessionId: EXAMPLE_RUNTIME_SESSION_ID,
          source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
        })
      )
    ),
    diagnostics: Object.freeze([
      Object.freeze({
        event: "RuntimeSessionCreated",
        message: "Example runtime session created.",
        stage: "initialize",
        recordedAt: EXAMPLE_TS,
      }),
    ]),
    metadata: Object.freeze({
      displayName: "Operational Model Runtime Run",
      triggerSource: "certification-probe",
      emg1ContractVersion: EXECUTIVE_MODEL_GENERATION_VERSION,
      emg2ContractVersion: EXECUTIVE_MODEL_PIPELINE_VERSION,
      tags: Object.freeze(["example", "emg-3"]),
      extension: Object.freeze({ runtimeProfileId: null, futureExtension: Object.freeze({}) }),
    }),
    failureRecord: null,
    emittedModel: resolveExecutiveModelExample(),
    createdAt: EXAMPLE_TS,
    completedAt: EXAMPLE_TS,
    source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
  });
}

export function validateEmgrEmg2TransitionIntegration(): Readonly<{ valid: boolean; evidence: string }> {
  const chain = [
    ["initialize", "load_foundation"],
    ["load_foundation", "bind_business_knowledge"],
    ["bind_business_knowledge", "compose_model"],
    ["compose_model", "validate_model"],
    ["validate_model", "emit_model"],
    ["emit_model", "completed"],
  ] as const;
  const valid = chain.every(([from, to]) => validatePipelineStageTransition(from, to).valid);
  return Object.freeze({
    valid,
    evidence: valid ? "Runtime success path uses EMG-2 transitions." : "EMG-2 transition integration gap.",
  });
}

export function validateEmgrStructuralEmissionIntegration(): Readonly<{ valid: boolean; evidence: string }> {
  const example = resolveRuntimeSessionExample();
  const emission = validateStructuralModelEmission(example.emittedModel);
  return Object.freeze({
    valid: emission.valid,
    evidence: emission.valid ? "Runtime emits EMG-1 compatible structural model." : "Structural emission invalid.",
  });
}

export function validateEmgrContextBoundary(): Readonly<{ valid: boolean; evidence: string }> {
  const context = resolveRuntimeSessionExample().executionContext;
  const allowedKeys = new Set([
    "workspaceId",
    "executionSessionId",
    "executiveModelId",
    "foundationReferences",
    "knowledgeBindings",
    "pipelineSessionRef",
    "boundSemanticRefs",
    "draftModel",
    "validationSummary",
    "emittedModelRef",
    "cancellationState",
    "lastError",
    "source",
  ]);
  const keys = Object.keys(context);
  const valid = keys.every((key) => allowedKeys.has(key));
  return Object.freeze({
    valid,
    evidence: valid ? "Execution context holds only approved slices." : "Execution context boundary violation.",
  });
}
