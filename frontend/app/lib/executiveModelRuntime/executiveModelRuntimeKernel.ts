/**
 * PHASE-3 / EMG-3 — Executive Model Pipeline Runtime kernel.
 * Generic stage execution — structural model emission only.
 */

import { isDs1FoundationFrozen } from "../datasourceCertification/ds1FoundationCertification.ts";
import {
  EXECUTIVE_MODEL_GENERATION_SOURCE,
  EXECUTIVE_MODEL_GENERATION_VERSION,
  EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID,
  resolveExecutiveModelExample,
  validateExecutiveModelRecord,
} from "../executiveModel/executiveModelGenerationContract.ts";
import type { ExecutiveModelRecord } from "../executiveModel/executiveModelGenerationTypes.ts";
import { isExecutiveModelGenerationFrozen } from "../executiveModel/executiveModelGenerationCertification.ts";
import {
  CHECKPOINT_STAGE_MAP,
  EXECUTIVE_MODEL_PIPELINE_SOURCE,
  EXECUTIVE_MODEL_PIPELINE_VERSION,
  validatePipelineStageTransition,
} from "../executiveModelPipeline/executiveModelPipelineContract.ts";
import type {
  PipelineCheckpointKind,
  PipelineFailureKind,
  PipelineFailureRecord,
  PipelineValidationSummary,
} from "../executiveModelPipeline/executiveModelPipelineTypes.ts";
import { isExecutiveModelPipelineFrozen } from "../executiveModelPipeline/executiveModelPipelineCertification.ts";
import {
  EXECUTIVE_MODEL_RUNTIME_SOURCE,
  EXECUTIVE_MODEL_RUNTIME_VERSION,
  RUNTIME_EXECUTABLE_STAGES,
} from "./executiveModelRuntimeContract.ts";
import {
  recordRuntimeDiagnostic,
  recordRuntimeDiagnosticEvent,
} from "./executiveModelRuntimeDiagnostics.ts";
import type {
  RuntimeCheckpointRecord,
  RuntimeExecutableStage,
  RuntimeExecutionContext,
  RuntimeExecutionInput,
  RuntimeExecutionResult,
  RuntimeSession,
  RuntimeSessionDiagnosticEntry,
  RuntimeStageOutcome,
} from "./executiveModelRuntimeTypes.ts";

const activeSessions = new Map<string, RuntimeSession>();

function nowIso(): string {
  return new Date().toISOString();
}

function createCheckpoint(
  runtimeSessionId: string,
  checkpointKind: PipelineCheckpointKind,
  evidence: string
): RuntimeCheckpointRecord {
  return Object.freeze({
    checkpointId: `${runtimeSessionId}-${checkpointKind}`,
    checkpointKind,
    reachedAt: nowIso(),
    stageAtCheckpoint: CHECKPOINT_STAGE_MAP[checkpointKind],
    evidence,
    runtimeSessionId,
    source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
  });
}

function appendDiagnostic(
  diagnostics: readonly RuntimeSessionDiagnosticEntry[],
  event: string,
  message: string,
  stage: RuntimeSessionDiagnosticEntry["stage"]
): readonly RuntimeSessionDiagnosticEntry[] {
  return Object.freeze([
    ...diagnostics,
    Object.freeze({ event, message, stage, recordedAt: nowIso() }),
  ]);
}

function buildValidationSummary(model: ExecutiveModelRecord): PipelineValidationSummary {
  const validation = validateExecutiveModelRecord(model);
  return Object.freeze({
    valid: validation.valid,
    issueCount: validation.issues.length,
    issues: Object.freeze([...validation.issues]),
    validatedAt: nowIso(),
    delegatedTo: "phase-3-executive-model-generation",
    source: EXECUTIVE_MODEL_PIPELINE_SOURCE,
  });
}

function composeStructuralModel(input: RuntimeExecutionInput): ExecutiveModelRecord {
  const template = resolveExecutiveModelExample();
  return Object.freeze({
    ...template,
    contractVersion: EXECUTIVE_MODEL_GENERATION_VERSION,
    executiveModelId: input.executiveModelId,
    workspaceId: input.workspaceId,
    sourceFoundationId: input.sourceFoundationId,
    lifecycleState: "generated",
    generationPipeline: Object.freeze({
      ...template.generationPipeline,
      inputBindings: Object.freeze({
        businessDataSourceIds: Object.freeze([...input.businessDataSourceIds]),
        knowledgeArtifactIds: Object.freeze([...input.knowledgeArtifactIds]),
        statusSnapshotId: input.statusSnapshotId,
      }),
      currentStage: "emit",
      pipelineStatus: "declared",
      source: EXECUTIVE_MODEL_GENERATION_SOURCE,
    }),
    createdAt: nowIso(),
    updatedAt: nowIso(),
    generatedBy: "emg-runtime-kernel",
    source: EXECUTIVE_MODEL_GENERATION_SOURCE,
  });
}

function executeStage(
  stage: RuntimeExecutableStage,
  context: RuntimeExecutionContext,
  input: RuntimeExecutionInput
): RuntimeStageOutcome {
  switch (stage) {
    case "initialize": {
      if (!isDs1FoundationFrozen() || !isExecutiveModelGenerationFrozen() || !isExecutiveModelPipelineFrozen()) {
        return Object.freeze({
          stage,
          success: false,
          failureKind: "dependency_failure",
          message: "Prerequisite freeze checks failed.",
          checkpointKind: null,
          source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
        });
      }
      if (input.workspaceId.trim().length === 0 || input.executiveModelId.trim().length === 0) {
        return Object.freeze({
          stage,
          success: false,
          failureKind: "non_recoverable",
          message: "Workspace or model id missing.",
          checkpointKind: null,
          source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
        });
      }
      return Object.freeze({
        stage,
        success: true,
        failureKind: null,
        message: "Runtime session initialized.",
        checkpointKind: null,
        source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
      });
    }
    case "load_foundation": {
      if (input.businessDataSourceIds.length === 0) {
        return Object.freeze({
          stage,
          success: false,
          failureKind: "dependency_failure",
          message: "No business data source references.",
          checkpointKind: null,
          source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
        });
      }
      return Object.freeze({
        stage,
        success: true,
        failureKind: null,
        message: `Foundation loaded for ${input.sourceFoundationId}.`,
        checkpointKind: "foundation_loaded",
        source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
      });
    }
    case "bind_business_knowledge": {
      if (input.knowledgeArtifactIds.length === 0) {
        return Object.freeze({
          stage,
          success: false,
          failureKind: "dependency_failure",
          message: "No knowledge artifact references.",
          checkpointKind: null,
          source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
        });
      }
      return Object.freeze({
        stage,
        success: true,
        failureKind: null,
        message: `${input.knowledgeArtifactIds.length} knowledge artifact(s) bound.`,
        checkpointKind: "knowledge_bound",
        source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
      });
    }
    case "compose_model":
      return Object.freeze({
        stage,
        success: true,
        failureKind: null,
        message: "Structural model composed from bound references.",
        checkpointKind: "model_composed",
        source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
      });
    case "validate_model": {
      const draft = context.draftModel ?? composeStructuralModel(input);
      const validation = validateExecutiveModelRecord(draft);
      if (!validation.valid) {
        return Object.freeze({
          stage,
          success: false,
          failureKind: "validation_failure",
          message: validation.issues[0]?.message ?? "Model validation failed.",
          checkpointKind: null,
          source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
        });
      }
      return Object.freeze({
        stage,
        success: true,
        failureKind: null,
        message: "Model validated via EMG-1 validator.",
        checkpointKind: "validation_passed",
        source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
      });
    }
    case "emit_model": {
      const draft = context.draftModel ?? composeStructuralModel(input);
      const validation = validateExecutiveModelRecord(draft);
      if (!validation.valid) {
        return Object.freeze({
          stage,
          success: false,
          failureKind: "validation_failure",
          message: "Cannot emit invalid model.",
          checkpointKind: null,
          source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
        });
      }
      return Object.freeze({
        stage,
        success: true,
        failureKind: null,
        message: `Model ${draft.executiveModelId} emitted.`,
        checkpointKind: "model_emitted",
        source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
      });
    }
    default:
      return Object.freeze({
        stage,
        success: false,
        failureKind: "non_recoverable",
        message: "Unsupported stage.",
        checkpointKind: null,
        source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
      });
  }
}

function buildFailureRecord(
  failureKind: PipelineFailureKind,
  failedAtStage: RuntimeExecutableStage,
  message: string
): PipelineFailureRecord {
  return Object.freeze({
    failureKind,
    failedAtStage,
    message,
    validationIssues: failureKind === "validation_failure" ? Object.freeze([]) : null,
    failedAt: nowIso(),
    source: EXECUTIVE_MODEL_PIPELINE_SOURCE,
  });
}

function createInitialContext(input: RuntimeExecutionInput): RuntimeExecutionContext {
  return Object.freeze({
    workspaceId: input.workspaceId,
    executionSessionId: input.executionSessionId,
    executiveModelId: input.executiveModelId,
    foundationReferences: Object.freeze({
      sourceFoundationId: input.sourceFoundationId,
      businessDataSourceIds: Object.freeze([...input.businessDataSourceIds]),
      statusSnapshotId: input.statusSnapshotId,
    }),
    knowledgeBindings: Object.freeze({
      knowledgeArtifactIds: Object.freeze([...input.knowledgeArtifactIds]),
    }),
    pipelineSessionRef: input.executionSessionId,
    boundSemanticRefs: Object.freeze([...input.knowledgeArtifactIds]),
    draftModel: null,
    validationSummary: null,
    emittedModelRef: null,
    cancellationState: "none",
    lastError: null,
    source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
  });
}

export function requestRuntimeCancellation(runtimeSessionId: string): boolean {
  const session = activeSessions.get(runtimeSessionId);
  if (!session || session.runtimeState !== "running") return false;
  const updatedContext = Object.freeze({
    ...session.executionContext,
    cancellationState: "requested" as const,
  });
  activeSessions.set(
    runtimeSessionId,
    Object.freeze({
      ...session,
      executionContext: updatedContext,
    })
  );
  recordRuntimeDiagnosticEvent({
    type: "RuntimeCancelled",
    runtimeSessionId,
    workspaceId: session.workspaceId,
  });
  return true;
}

export function runExecutiveModelRuntime(input: RuntimeExecutionInput & {
  runtimeSessionId?: string;
}): RuntimeExecutionResult {
  const runtimeSessionId = input.runtimeSessionId?.trim() || `emgr-${Date.now()}`;
  const createdAt = nowIso();

  let context = createInitialContext(input);
  let checkpoints: readonly RuntimeCheckpointRecord[] = [];
  let diagnostics: readonly RuntimeSessionDiagnosticEntry[] = appendDiagnostic([], "RuntimeSessionCreated", "Runtime session created.", "initialize");
  let currentStage: RuntimeSession["currentStage"] = "initialize";
  let runtimeState: RuntimeSession["runtimeState"] = "running";
  let failureRecord: PipelineFailureRecord | null = null;
  let emittedModel: ExecutiveModelRecord | null = null;

  recordRuntimeDiagnosticEvent({
    type: "RuntimeSessionCreated",
    runtimeSessionId,
    workspaceId: input.workspaceId,
  });

  const baseSession: RuntimeSession = Object.freeze({
    contractVersion: EXECUTIVE_MODEL_RUNTIME_VERSION,
    runtimeSessionId,
    executionSessionId: input.executionSessionId,
    workspaceId: input.workspaceId,
    executiveModelId: input.executiveModelId,
    runtimeState,
    currentStage,
    executionContext: context,
    checkpoints,
    diagnostics,
    metadata: Object.freeze({
      displayName: input.metadata?.displayName ?? "Executive Model Runtime Run",
      triggerSource: input.metadata?.triggerSource ?? "runtime-kernel",
      emg1ContractVersion: EXECUTIVE_MODEL_GENERATION_VERSION,
      emg2ContractVersion: EXECUTIVE_MODEL_PIPELINE_VERSION,
      tags: Object.freeze(["runtime"]),
      extension: Object.freeze({ runtimeProfileId: null, futureExtension: Object.freeze({}) }),
    }),
    failureRecord,
    emittedModel,
    createdAt,
    completedAt: null,
    source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
  });

  activeSessions.set(runtimeSessionId, baseSession);

  for (const stage of RUNTIME_EXECUTABLE_STAGES) {
    const live = activeSessions.get(runtimeSessionId);
    if (live?.executionContext.cancellationState === "requested") {
      runtimeState = "cancelled";
      currentStage = stage;
      failureRecord = buildFailureRecord("cancelled", stage, "Runtime cancelled between stages.");
      diagnostics = appendDiagnostic(diagnostics, "RuntimeCancelled", failureRecord.message, stage);
      recordRuntimeDiagnosticEvent({ type: "RuntimeCancelled", runtimeSessionId, workspaceId: input.workspaceId });
      break;
    }

    currentStage = stage;
    recordRuntimeDiagnosticEvent({
      type: "RuntimeStageStarted",
      runtimeSessionId,
      workspaceId: input.workspaceId,
    });
    diagnostics = appendDiagnostic(diagnostics, "RuntimeStageStarted", `Stage ${stage} started.`, stage);

    if (stage === "compose_model") {
      const draft = composeStructuralModel(input);
      context = Object.freeze({ ...context, draftModel: draft });
    }

    const outcome = executeStage(stage, context, input);

    if (!outcome.success) {
      runtimeState = "failed";
      failureRecord = buildFailureRecord(
        outcome.failureKind ?? "non_recoverable",
        stage,
        outcome.message
      );
      context = Object.freeze({ ...context, lastError: outcome.message });
      diagnostics = appendDiagnostic(diagnostics, "RuntimeFailed", outcome.message, stage);
      recordRuntimeDiagnosticEvent({ type: "RuntimeFailed", runtimeSessionId, workspaceId: input.workspaceId });
      recordRuntimeDiagnostic({
        type: "RuntimeFailed",
        runtimeSessionId,
        workspaceId: input.workspaceId,
        message: outcome.message,
      });
      break;
    }

    if (outcome.checkpointKind) {
      const checkpoint = createCheckpoint(runtimeSessionId, outcome.checkpointKind, outcome.message);
      checkpoints = Object.freeze([...checkpoints, checkpoint]);
      recordRuntimeDiagnosticEvent({
        type: "RuntimeCheckpointRecorded",
        runtimeSessionId,
        workspaceId: input.workspaceId,
      });
      diagnostics = appendDiagnostic(
        diagnostics,
        "RuntimeCheckpointRecorded",
        outcome.message,
        outcome.checkpointKind ? CHECKPOINT_STAGE_MAP[outcome.checkpointKind] : stage
      );
    }

    if (stage === "validate_model") {
      const draft = context.draftModel ?? composeStructuralModel(input);
      const summary = buildValidationSummary(draft);
      context = Object.freeze({ ...context, draftModel: draft, validationSummary: summary });
    }

    if (stage === "emit_model") {
      const draft = context.draftModel ?? composeStructuralModel(input);
      emittedModel = draft;
      context = Object.freeze({
        ...context,
        draftModel: draft,
        emittedModelRef: draft.executiveModelId,
        validationSummary: buildValidationSummary(draft),
      });
      recordRuntimeDiagnosticEvent({
        type: "RuntimeModelEmitted",
        runtimeSessionId,
        workspaceId: input.workspaceId,
      });
      recordRuntimeDiagnostic({
        type: "RuntimeModelEmitted",
        runtimeSessionId,
        workspaceId: input.workspaceId,
        message: `Emitted model ${draft.executiveModelId}.`,
      });
      diagnostics = appendDiagnostic(diagnostics, "RuntimeModelEmitted", outcome.message, "emit_model");
    }

    recordRuntimeDiagnosticEvent({
      type: "RuntimeStageCompleted",
      runtimeSessionId,
      workspaceId: input.workspaceId,
    });
    diagnostics = appendDiagnostic(diagnostics, "RuntimeStageCompleted", outcome.message, stage);

    const nextStage =
      stage === "emit_model"
        ? "completed"
        : (RUNTIME_EXECUTABLE_STAGES[RUNTIME_EXECUTABLE_STAGES.indexOf(stage) + 1] as RuntimeExecutableStage | undefined);
    if (nextStage && stage !== "emit_model") {
      const transition = validatePipelineStageTransition(stage, nextStage);
      if (!transition.valid) {
        runtimeState = "failed";
        failureRecord = buildFailureRecord("non_recoverable", stage, transition.issues[0]?.message ?? "Invalid transition.");
        break;
      }
    }
  }

  if (runtimeState === "running" && emittedModel) {
    runtimeState = "completed";
    currentStage = "completed";
  }

  const completedAt = runtimeState === "completed" || runtimeState === "failed" || runtimeState === "cancelled" ? nowIso() : null;

  const finalSession: RuntimeSession = Object.freeze({
    contractVersion: EXECUTIVE_MODEL_RUNTIME_VERSION,
    runtimeSessionId,
    executionSessionId: input.executionSessionId,
    workspaceId: input.workspaceId,
    executiveModelId: input.executiveModelId,
    runtimeState,
    currentStage,
    executionContext: Object.freeze({
      ...context,
      cancellationState:
        runtimeState === "cancelled" ? ("acknowledged" as const) : context.cancellationState,
    }),
    checkpoints,
    diagnostics,
    metadata: baseSession.metadata,
    failureRecord,
    emittedModel,
    createdAt,
    completedAt,
    source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
  });

  activeSessions.set(runtimeSessionId, finalSession);

  return Object.freeze({
    session: finalSession,
    success: runtimeState === "completed",
    emittedModel,
    source: EXECUTIVE_MODEL_RUNTIME_SOURCE,
  });
}

export function getActiveRuntimeSession(runtimeSessionId: string): RuntimeSession | null {
  return activeSessions.get(runtimeSessionId) ?? null;
}

export function resetActiveRuntimeSessionsForTests(): void {
  activeSessions.clear();
}

export const ExecutiveModelRuntimeKernel = Object.freeze({
  runExecutiveModelRuntime,
  requestRuntimeCancellation,
  getActiveRuntimeSession,
  resetActiveRuntimeSessionsForTests,
});
