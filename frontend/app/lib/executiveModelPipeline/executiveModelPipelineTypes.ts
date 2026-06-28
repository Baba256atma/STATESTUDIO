/**
 * PHASE-3 / EMG-2 — Executive Model Generation Pipeline types.
 * Orchestration contract shapes only — no runtime execution.
 */

import type { ExecutiveModelValidationIssue } from "../executiveModel/executiveModelGenerationTypes.ts";

export type PipelineWorkspaceId = string;

export type PipelineExecutionStage =
  | "initialize"
  | "load_foundation"
  | "bind_business_knowledge"
  | "compose_model"
  | "validate_model"
  | "emit_model"
  | "completed"
  | "failed";

export type PipelineSessionState = "active" | "completed" | "failed" | "cancelled";

export type PipelineStageExecutionStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export type PipelineCheckpointKind =
  | "foundation_loaded"
  | "knowledge_bound"
  | "model_composed"
  | "validation_passed"
  | "model_emitted";

export type PipelineFailureKind =
  | "recoverable"
  | "non_recoverable"
  | "validation_failure"
  | "dependency_failure"
  | "cancelled";

export type PipelineSessionExtensionPoint = Readonly<{
  orchestratorProfileId?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type PipelineExecutionMetadata = Readonly<{
  displayName: string;
  triggerSource: string;
  emg1ContractVersion: string;
  tags: readonly string[];
  extension: PipelineSessionExtensionPoint;
}>;

export type PipelineRetryPolicy = Readonly<{
  maxAttempts: number;
  retryFromCheckpoint: PipelineCheckpointKind | null;
  retryEligibleFailureKinds: readonly PipelineFailureKind[];
  backoffHintMs: number | null;
}>;

export type PipelineStageRecord = Readonly<{
  stage: PipelineExecutionStage;
  stageStatus: PipelineStageExecutionStatus;
  declaredAt: string;
  source: "phase-3-executive-model-pipeline";
}>;

export type PipelineCheckpointRecord = Readonly<{
  checkpointId: string;
  checkpointKind: PipelineCheckpointKind;
  reachedAt: string;
  stageAtCheckpoint: PipelineExecutionStage;
  evidence: string;
  source: "phase-3-executive-model-pipeline";
}>;

export type PipelineValidationSummary = Readonly<{
  valid: boolean;
  issueCount: number;
  issues: readonly ExecutiveModelValidationIssue[];
  validatedAt: string | null;
  delegatedTo: "phase-3-executive-model-generation";
  source: "phase-3-executive-model-pipeline";
}>;

export type PipelineFailureRecord = Readonly<{
  failureKind: PipelineFailureKind;
  failedAtStage: PipelineExecutionStage;
  message: string;
  validationIssues: readonly ExecutiveModelValidationIssue[] | null;
  failedAt: string;
  source: "phase-3-executive-model-pipeline";
}>;

export type PipelineSessionDiagnosticEntry = Readonly<{
  event: string;
  message: string;
  stage: PipelineExecutionStage | null;
  recordedAt: string;
}>;

export type PipelineExecutionSession = Readonly<{
  contractVersion: string;
  executionSessionId: string;
  workspaceId: PipelineWorkspaceId;
  executiveModelId: string;
  sourceFoundationId: string;
  pipelineState: PipelineSessionState;
  currentStage: PipelineExecutionStage;
  stages: readonly PipelineStageRecord[];
  checkpoints: readonly PipelineCheckpointRecord[];
  validationSummary: PipelineValidationSummary;
  diagnostics: readonly PipelineSessionDiagnosticEntry[];
  metadata: PipelineExecutionMetadata;
  failureRecord: PipelineFailureRecord | null;
  retryPolicy: PipelineRetryPolicy;
  emittedModelRef: string | null;
  createdAt: string;
  completedAt: string | null;
  source: "phase-3-executive-model-pipeline";
}>;

export type PipelineOwnershipContract = Readonly<{
  executionSessionId: string;
  workspaceId: PipelineWorkspaceId;
  executiveModelId: string;
  isolationPolicy: "workspace-exclusive";
}>;

export type PipelineValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type PipelineValidationResult = Readonly<{
  valid: boolean;
  issues: readonly PipelineValidationIssue[];
}>;

export type PipelineScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type PipelineScoreReport = Readonly<{
  contractVersion: string;
  dimensions: PipelineScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type PipelineCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type PipelineAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  orchestrationBoundaryIntegrity: number;
  pipelineIntegrity: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type PipelineAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: PipelineAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type PipelineFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  pipelineStagesCount: number;
  checkpointKindsCount: number;
  failureKindsCount: number;
  generatedAt: string;
}>;

export type PipelineCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly PipelineCertificationCheck[];
  scoreReport: PipelineScoreReport;
  analysisScoreReport: PipelineAnalysisScoreReport | null;
  freezeReport: PipelineFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type PipelineDiagnosticEventType =
  | "PipelineSessionCreated"
  | "PipelineStageDeclared"
  | "PipelineStageTransitioned"
  | "CheckpointRecorded"
  | "ValidationSummaryDeclared"
  | "PipelineFailed"
  | "PipelineCompleted"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type PipelineDiagnosticEvent = Readonly<{
  type: PipelineDiagnosticEventType;
  executionSessionId: string | null;
  workspaceId: PipelineWorkspaceId | null;
  timestamp: string;
}>;

export type PipelineDiagnosticLogEntry = Readonly<{
  executionSessionId: string | null;
  workspaceId: PipelineWorkspaceId | null;
  event: PipelineDiagnosticEventType;
  message: string;
  generatedAt: string;
}>;
