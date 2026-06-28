/**
 * PHASE-3 / EMG-2 — Executive Model Generation Pipeline contract.
 * Orchestration vocabulary — no runtime execution.
 */

import {
  EXECUTIVE_MODEL_GENERATION_VERSION,
  EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID,
  resolveExecutiveModelExample,
  validateEmgBklBindingIntegration,
  validateEmgEbdsCorrelationIntegration,
  validateEmgWorkspaceIsolation,
  validateExecutiveModelRecord,
} from "../executiveModel/executiveModelGenerationContract.ts";
import type { ExecutiveModelGenerationStage } from "../executiveModel/executiveModelGenerationTypes.ts";
import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import type {
  PipelineCheckpointKind,
  PipelineCheckpointRecord,
  PipelineExecutionSession,
  PipelineExecutionStage,
  PipelineFailureKind,
  PipelineRetryPolicy,
  PipelineScoreDimensions,
  PipelineAnalysisScoreDimensions,
  PipelineSessionState,
  PipelineStageRecord,
  PipelineValidationIssue,
  PipelineValidationResult,
  PipelineValidationSummary,
} from "./executiveModelPipelineTypes.ts";

export const EXECUTIVE_MODEL_PIPELINE_VERSION = "PHASE-3/EMG-2" as const;
export const EXECUTIVE_MODEL_PIPELINE_SOURCE = "phase-3-executive-model-pipeline" as const;
export const EXECUTIVE_MODEL_PIPELINE_LOG_PREFIX = "[NexoraExecutiveModelPipeline]" as const;

export const EXECUTIVE_MODEL_PIPELINE_MINIMUM_OVERALL_SCORE = 98 as const;

export const EXECUTIVE_MODEL_PIPELINE_TAGS = Object.freeze([
  "[EMG2_PIPELINE_ORCHESTRATION]",
  "[MODEL_GENERATION_PIPELINE_DEFINED]",
  "[WORKSPACE_PIPELINE_OWNED]",
  "[EMG3_READY]",
] as const);

export const EXECUTIVE_MODEL_PIPELINE_FREEZE_TAGS = Object.freeze([
  "[EMG_2_CERTIFIED]",
  "[EXECUTIVE_MODEL_GENERATION_PIPELINE_FROZEN]",
  "[PHASE3_EMG_2_COMPLETE]",
] as const);

export const PIPELINE_EXECUTION_STAGES = Object.freeze([
  "initialize",
  "load_foundation",
  "bind_business_knowledge",
  "compose_model",
  "validate_model",
  "emit_model",
  "completed",
  "failed",
] as const satisfies readonly PipelineExecutionStage[]);

export const PIPELINE_SESSION_STATES = Object.freeze([
  "active",
  "completed",
  "failed",
  "cancelled",
] as const satisfies readonly PipelineSessionState[]);

export const PIPELINE_CHECKPOINT_KINDS = Object.freeze([
  "foundation_loaded",
  "knowledge_bound",
  "model_composed",
  "validation_passed",
  "model_emitted",
] as const satisfies readonly PipelineCheckpointKind[]);

export const PIPELINE_FAILURE_KINDS = Object.freeze([
  "recoverable",
  "non_recoverable",
  "validation_failure",
  "dependency_failure",
  "cancelled",
] as const satisfies readonly PipelineFailureKind[]);

export const EMG1_PIPELINE_ALIGNMENT_MAP = Object.freeze({
  initialize: "intake",
  load_foundation: "bind",
  bind_business_knowledge: "bind",
  compose_model: "compose",
  validate_model: "validate",
  emit_model: "emit",
} as const satisfies Partial<Record<PipelineExecutionStage, ExecutiveModelGenerationStage>>);

export const EMG1_COMPOSE_ALIGNMENT_STAGES = Object.freeze([
  "normalize",
  "compose",
] as const satisfies readonly ExecutiveModelGenerationStage[]);

export const PIPELINE_STAGE_TRANSITIONS = Object.freeze({
  initialize: Object.freeze(["load_foundation", "failed"] as const),
  load_foundation: Object.freeze(["bind_business_knowledge", "failed"] as const),
  bind_business_knowledge: Object.freeze(["compose_model", "failed"] as const),
  compose_model: Object.freeze(["validate_model", "failed"] as const),
  validate_model: Object.freeze(["emit_model", "failed"] as const),
  emit_model: Object.freeze(["completed", "failed"] as const),
  completed: Object.freeze([] as const),
  failed: Object.freeze([] as const),
} as const satisfies Partial<Record<PipelineExecutionStage, readonly PipelineExecutionStage[]>>);

export const CHECKPOINT_STAGE_MAP = Object.freeze({
  foundation_loaded: "load_foundation",
  knowledge_bound: "bind_business_knowledge",
  model_composed: "compose_model",
  validation_passed: "validate_model",
  model_emitted: "emit_model",
} as const satisfies Record<PipelineCheckpointKind, PipelineExecutionStage>);

export const EXECUTIVE_MODEL_PIPELINE_MUST_NOT_OWN = Object.freeze([
  "executive_intelligence",
  "recommendations",
  "kpi_calculations",
  "risk_calculations",
  "scenario_simulations",
  "dashboard_rendering",
  "assistant_logic",
  "persistence",
  "object_creation_runtime",
  "relationship_discovery",
  "parsing",
  "upload_execution",
  "synchronization",
  "registry_mutation",
  "scene_sync",
  "intelligence_reasoning",
  "business_rule_execution",
  "model_runtime_storage",
  "ds1_contract_mutation",
  "emg1_contract_mutation",
  "retry_engine",
] as const);

export const EXECUTIVE_MODEL_PIPELINE_FORBIDDEN_PATTERNS = Object.freeze([
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
  ".tsx",
] as const);

export const EXECUTIVE_MODEL_PIPELINE_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-3/EMG-2",
  title: "Executive Model Generation Pipeline",
  goal: "Library-only pipeline orchestration contract after frozen EMG-1.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveModelPipeline/executiveModelPipelineTypes.ts",
    "frontend/app/lib/executiveModelPipeline/executiveModelPipelineContract.ts",
    "frontend/app/lib/executiveModelPipeline/executiveModelPipelineDiagnostics.ts",
    "frontend/app/lib/executiveModelPipeline/executiveModelPipelineCertification.ts",
    "frontend/app/lib/executiveModelPipeline/executiveModelPipelineCertification.test.ts",
    "docs/emg-2-build-report.md",
    "docs/emg-2-analysis-report.md",
    "docs/emg-2-freeze-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_MODEL_PIPELINE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["DS-1-FOUNDATION", "EMG-1", "STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_MODEL_PIPELINE_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_MODEL_PIPELINE_MODULE_PATHS = Object.freeze(
  EXECUTIVE_MODEL_PIPELINE_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

export const DEFAULT_PIPELINE_RETRY_POLICY = Object.freeze({
  maxAttempts: 1,
  retryFromCheckpoint: null,
  retryEligibleFailureKinds: Object.freeze(["recoverable", "dependency_failure"] as const),
  backoffHintMs: null,
} satisfies PipelineRetryPolicy);

const STAGE_SET = new Set<string>(PIPELINE_EXECUTION_STAGES);
const SESSION_STATE_SET = new Set<string>(PIPELINE_SESSION_STATES);
const CHECKPOINT_SET = new Set<string>(PIPELINE_CHECKPOINT_KINDS);
const EXAMPLE_TS = "2026-06-22T00:00:00.000Z";
const EXAMPLE_WORKSPACE = "workspace-example-001";
const EXAMPLE_SESSION_ID = "emgp-session-example-001";
const EXAMPLE_MODEL_ID = "emg-model-example-001";

function issue(code: string, message: string): PipelineValidationIssue {
  return Object.freeze({ code, message });
}

export function computeExecutiveModelPipelineOverallScore(dimensions: PipelineScoreDimensions): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsExecutiveModelPipelineMinimumScore(overall: number): boolean {
  return overall >= EXECUTIVE_MODEL_PIPELINE_MINIMUM_OVERALL_SCORE;
}

const ANALYSIS_SCORE_WEIGHTS = Object.freeze({
  architectureHealth: 0.14,
  maintainability: 0.12,
  scalability: 0.1,
  regressionSafety: 0.14,
  orchestrationBoundaryIntegrity: 0.16,
  pipelineIntegrity: 0.14,
  bugTraceability: 0.08,
  certificationReadiness: 0.12,
} as const);

export function computeExecutiveModelPipelineAnalysisScore(
  dimensions: PipelineAnalysisScoreDimensions
): number {
  const weighted =
    dimensions.architectureHealth * ANALYSIS_SCORE_WEIGHTS.architectureHealth +
    dimensions.maintainability * ANALYSIS_SCORE_WEIGHTS.maintainability +
    dimensions.scalability * ANALYSIS_SCORE_WEIGHTS.scalability +
    dimensions.regressionSafety * ANALYSIS_SCORE_WEIGHTS.regressionSafety +
    dimensions.orchestrationBoundaryIntegrity * ANALYSIS_SCORE_WEIGHTS.orchestrationBoundaryIntegrity +
    dimensions.pipelineIntegrity * ANALYSIS_SCORE_WEIGHTS.pipelineIntegrity +
    dimensions.bugTraceability * ANALYSIS_SCORE_WEIGHTS.bugTraceability +
    dimensions.certificationReadiness * ANALYSIS_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function buildPipelineOwnershipContract(
  session: Pick<PipelineExecutionSession, "executionSessionId" | "workspaceId" | "executiveModelId">
) {
  return Object.freeze({
    executionSessionId: session.executionSessionId.trim(),
    workspaceId: session.workspaceId.trim(),
    executiveModelId: session.executiveModelId.trim(),
    isolationPolicy: "workspace-exclusive" as const,
  });
}

export function validatePipelineStageTransition(
  fromStage: PipelineExecutionStage,
  toStage: PipelineExecutionStage
): PipelineValidationResult {
  const allowed = (PIPELINE_STAGE_TRANSITIONS[fromStage] ?? []) as readonly PipelineExecutionStage[];
  const valid = allowed.includes(toStage);
  return Object.freeze({
    valid,
    issues: Object.freeze(
      valid
        ? []
        : [issue("invalid_transition", `Transition from ${fromStage} to ${toStage} is not allowed.`)]
    ),
  });
}

export function validatePipelineRetryPolicy(input: Partial<PipelineRetryPolicy>): PipelineValidationResult {
  const issues: PipelineValidationIssue[] = [];
  if (typeof input.maxAttempts !== "number" || input.maxAttempts < 1) {
    issues.push(issue("invalid_max_attempts", "maxAttempts must be at least 1."));
  }
  if (!Array.isArray(input.retryEligibleFailureKinds)) {
    issues.push(issue("missing_failure_kinds", "retryEligibleFailureKinds must be an array."));
  }
  if (input.retryFromCheckpoint && !CHECKPOINT_SET.has(input.retryFromCheckpoint)) {
    issues.push(issue("invalid_checkpoint", "retryFromCheckpoint must be a supported checkpoint kind."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function validateCheckpoints(input: readonly PipelineCheckpointRecord[]): PipelineValidationResult {
  const issues: PipelineValidationIssue[] = [];
  let lastIndex = -1;
  for (const checkpoint of input) {
    if (!CHECKPOINT_SET.has(checkpoint.checkpointKind)) {
      issues.push(issue("invalid_checkpoint_kind", "Unsupported checkpoint kind."));
    }
    const expectedStage = CHECKPOINT_STAGE_MAP[checkpoint.checkpointKind];
    if (checkpoint.stageAtCheckpoint !== expectedStage) {
      issues.push(issue("checkpoint_stage_mismatch", `Checkpoint ${checkpoint.checkpointKind} stage mismatch.`));
    }
    const kindIndex = PIPELINE_CHECKPOINT_KINDS.indexOf(checkpoint.checkpointKind);
    if (kindIndex <= lastIndex) {
      issues.push(issue("checkpoint_order", "Checkpoints must be monotonically ordered."));
    }
    lastIndex = kindIndex;
    if (checkpoint.source !== EXECUTIVE_MODEL_PIPELINE_SOURCE) {
      issues.push(issue("invalid_checkpoint_source", "Checkpoint source must be phase-3-executive-model-pipeline."));
    }
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function validateValidationSummary(input: Partial<PipelineValidationSummary>): PipelineValidationResult {
  const issues: PipelineValidationIssue[] = [];
  if (typeof input.valid !== "boolean") issues.push(issue("missing_valid_flag", "valid flag is required."));
  if (typeof input.issueCount !== "number") issues.push(issue("missing_issue_count", "issueCount is required."));
  if (!Array.isArray(input.issues)) issues.push(issue("missing_issues", "issues must be an array."));
  if (input.delegatedTo !== "phase-3-executive-model-generation") {
    issues.push(issue("invalid_delegation", "Validation must delegate to EMG-1."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validatePipelineExecutionSession(
  input: Partial<PipelineExecutionSession>
): PipelineValidationResult {
  const issues: PipelineValidationIssue[] = [];
  if (!input.executionSessionId?.trim()) {
    issues.push(issue("missing_session_id", "executionSessionId is required."));
  }
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.executiveModelId?.trim()) {
    issues.push(issue("missing_model_id", "executiveModelId is required."));
  }
  if (!input.pipelineState || !SESSION_STATE_SET.has(input.pipelineState)) {
    issues.push(issue("invalid_pipeline_state", "pipelineState must be supported."));
  }
  if (!input.currentStage || !STAGE_SET.has(input.currentStage)) {
    issues.push(issue("invalid_current_stage", "currentStage must be supported."));
  }
  if (!Array.isArray(input.checkpoints)) {
    issues.push(issue("missing_checkpoints", "checkpoints must be an array."));
  } else issues.push(...validateCheckpoints(input.checkpoints).issues);
  if (!input.validationSummary) {
    issues.push(issue("missing_validation_summary", "validationSummary is required."));
  } else issues.push(...validateValidationSummary(input.validationSummary).issues);
  if (!Array.isArray(input.diagnostics)) {
    issues.push(issue("missing_diagnostics", "diagnostics must be an array."));
  }
  if (!input.metadata) issues.push(issue("missing_metadata", "metadata is required."));
  if (!input.createdAt?.trim()) issues.push(issue("missing_created_at", "createdAt is required."));
  if (input.completedAt !== null && input.completedAt !== undefined && !input.completedAt.trim()) {
    issues.push(issue("invalid_completed_at", "completedAt must be null or a non-empty ISO string."));
  }
  if (!input.retryPolicy) issues.push(issue("missing_retry_policy", "retryPolicy is required."));
  else issues.push(...validatePipelineRetryPolicy(input.retryPolicy).issues);
  if (input.source && input.source !== EXECUTIVE_MODEL_PIPELINE_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-3-executive-model-pipeline."));
  }
  if (input.sourceFoundationId && input.sourceFoundationId !== EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID) {
    issues.push(issue("invalid_foundation_id", "sourceFoundationId must match EMG-1 foundation id."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function pipelineStageRecords(): readonly PipelineStageRecord[] {
  return Object.freeze(
    PIPELINE_EXECUTION_STAGES.map((stage) =>
      Object.freeze({
        stage,
        stageStatus: stage === "completed" || stage === "failed" ? ("completed" as const) : ("completed" as const),
        declaredAt: EXAMPLE_TS,
        source: EXECUTIVE_MODEL_PIPELINE_SOURCE,
      })
    )
  );
}

function exampleCheckpoints(): readonly PipelineCheckpointRecord[] {
  return Object.freeze(
    PIPELINE_CHECKPOINT_KINDS.map((checkpointKind, index) =>
      Object.freeze({
        checkpointId: `emgp-ckpt-${String(index + 1).padStart(3, "0")}`,
        checkpointKind,
        reachedAt: EXAMPLE_TS,
        stageAtCheckpoint: CHECKPOINT_STAGE_MAP[checkpointKind],
        evidence: `${checkpointKind} checkpoint recorded.`,
        source: EXECUTIVE_MODEL_PIPELINE_SOURCE,
      })
    )
  );
}

export function resolvePipelineExecutionSessionExample(): PipelineExecutionSession {
  const model = resolveExecutiveModelExample();
  const validation = validateExecutiveModelRecord(model);

  const validationSummary: PipelineValidationSummary = Object.freeze({
    valid: validation.valid,
    issueCount: validation.issues.length,
    issues: Object.freeze([...validation.issues]),
    validatedAt: EXAMPLE_TS,
    delegatedTo: "phase-3-executive-model-generation",
    source: EXECUTIVE_MODEL_PIPELINE_SOURCE,
  });

  return Object.freeze({
    contractVersion: EXECUTIVE_MODEL_PIPELINE_VERSION,
    executionSessionId: EXAMPLE_SESSION_ID,
    workspaceId: EXAMPLE_WORKSPACE,
    executiveModelId: EXAMPLE_MODEL_ID,
    sourceFoundationId: EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID,
    pipelineState: "completed",
    currentStage: "completed",
    stages: pipelineStageRecords(),
    checkpoints: exampleCheckpoints(),
    validationSummary,
    diagnostics: Object.freeze([
      Object.freeze({
        event: "PipelineSessionCreated",
        message: "Example pipeline session created.",
        stage: "initialize",
        recordedAt: EXAMPLE_TS,
      }),
      Object.freeze({
        event: "PipelineCompleted",
        message: "Example pipeline session completed.",
        stage: "completed",
        recordedAt: EXAMPLE_TS,
      }),
    ]),
    metadata: Object.freeze({
      displayName: "Operational Model Generation Run",
      triggerSource: "certification-probe",
      emg1ContractVersion: EXECUTIVE_MODEL_GENERATION_VERSION,
      tags: Object.freeze(["example", "emg-2"]),
      extension: Object.freeze({ orchestratorProfileId: null, futureExtension: Object.freeze({}) }),
    }),
    failureRecord: null,
    retryPolicy: DEFAULT_PIPELINE_RETRY_POLICY,
    emittedModelRef: model.executiveModelId,
    createdAt: EXAMPLE_TS,
    completedAt: EXAMPLE_TS,
    source: EXECUTIVE_MODEL_PIPELINE_SOURCE,
  });
}

export function validateEmgpEmg1AlignmentIntegration(): Readonly<{ valid: boolean; evidence: string }> {
  const alignmentKeys = Object.keys(EMG1_PIPELINE_ALIGNMENT_MAP);
  const composeAligned =
    EMG1_COMPOSE_ALIGNMENT_STAGES.includes("normalize") && EMG1_COMPOSE_ALIGNMENT_STAGES.includes("compose");
  const valid = alignmentKeys.length === 6 && composeAligned;
  return Object.freeze({
    valid,
    evidence: valid
      ? "Six EMG-2 stages aligned; compose_model maps to normalize+compose."
      : "EMG-1 alignment map incomplete.",
  });
}

export function validateEmgpEmg1ValidationDelegation(): Readonly<{ valid: boolean; evidence: string }> {
  const session = resolvePipelineExecutionSessionExample();
  const delegated =
    session.validationSummary.delegatedTo === "phase-3-executive-model-generation" &&
    session.validationSummary.valid === true;
  return Object.freeze({
    valid: delegated,
    evidence: delegated ? "Validation summary delegates to EMG-1 validator." : "Validation delegation missing.",
  });
}

export function validateEmgpFoundationIntegration(): Readonly<{ valid: boolean; evidence: string }> {
  const session = resolvePipelineExecutionSessionExample();
  const ebds = validateEmgEbdsCorrelationIntegration();
  const bkl = validateEmgBklBindingIntegration();
  const workspace = validateEmgWorkspaceIsolation();
  const valid =
    session.sourceFoundationId === EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID &&
    ebds.valid &&
    bkl.valid &&
    workspace.valid &&
    session.workspaceId === EXAMPLE_WORKSPACE;
  return Object.freeze({
    valid,
    evidence: valid ? `Session scoped to ${EXAMPLE_WORKSPACE} under DS-1 foundation.` : "Foundation integration gap.",
  });
}

export function validateEmgpStageTransitionContract(): Readonly<{ valid: boolean; evidence: string }> {
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
    evidence: valid ? "Success-path transitions validate." : "Stage transition contract invalid.",
  });
}
