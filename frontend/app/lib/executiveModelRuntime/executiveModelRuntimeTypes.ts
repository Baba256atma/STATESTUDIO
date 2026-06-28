/**
 * PHASE-3 / EMG-3 — Executive Model Pipeline Runtime types.
 * Generic execution kernel shapes — no domain engine logic.
 */

import type { ExecutiveModelRecord } from "../executiveModel/executiveModelGenerationTypes.ts";
import type {
  PipelineCheckpointKind,
  PipelineCheckpointRecord,
  PipelineExecutionStage,
  PipelineFailureKind,
  PipelineFailureRecord,
  PipelineValidationSummary,
} from "../executiveModelPipeline/executiveModelPipelineTypes.ts";

export type RuntimeWorkspaceId = string;

export type RuntimeState = "idle" | "running" | "completed" | "failed" | "cancelled";

export type RuntimeCancellationState = "none" | "requested" | "acknowledged";

export type RuntimeExecutableStage = Exclude<
  PipelineExecutionStage,
  "completed" | "failed"
>;

export type RuntimeSessionExtensionPoint = Readonly<{
  runtimeProfileId?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type RuntimeExecutionMetadata = Readonly<{
  displayName: string;
  triggerSource: string;
  emg1ContractVersion: string;
  emg2ContractVersion: string;
  tags: readonly string[];
  extension: RuntimeSessionExtensionPoint;
}>;

export type RuntimeFoundationReferences = Readonly<{
  sourceFoundationId: string;
  businessDataSourceIds: readonly string[];
  statusSnapshotId: string | null;
}>;

export type RuntimeKnowledgeBindings = Readonly<{
  knowledgeArtifactIds: readonly string[];
}>;

export type RuntimeExecutionContext = Readonly<{
  workspaceId: RuntimeWorkspaceId;
  executionSessionId: string;
  executiveModelId: string;
  foundationReferences: RuntimeFoundationReferences;
  knowledgeBindings: RuntimeKnowledgeBindings;
  pipelineSessionRef: string;
  boundSemanticRefs: readonly string[];
  draftModel: ExecutiveModelRecord | null;
  validationSummary: PipelineValidationSummary | null;
  emittedModelRef: string | null;
  cancellationState: RuntimeCancellationState;
  lastError: string | null;
  source: "phase-3-executive-model-runtime";
}>;

export type RuntimeCheckpointRecord = Readonly<{
  checkpointId: string;
  checkpointKind: PipelineCheckpointKind;
  reachedAt: string;
  stageAtCheckpoint: PipelineExecutionStage;
  evidence: string;
  runtimeSessionId: string;
  source: "phase-3-executive-model-runtime";
}>;

export type RuntimeSessionDiagnosticEntry = Readonly<{
  event: string;
  message: string;
  stage: PipelineExecutionStage | null;
  recordedAt: string;
}>;

export type RuntimeSession = Readonly<{
  contractVersion: string;
  runtimeSessionId: string;
  executionSessionId: string;
  workspaceId: RuntimeWorkspaceId;
  executiveModelId: string;
  runtimeState: RuntimeState;
  currentStage: PipelineExecutionStage;
  executionContext: RuntimeExecutionContext;
  checkpoints: readonly RuntimeCheckpointRecord[];
  diagnostics: readonly RuntimeSessionDiagnosticEntry[];
  metadata: RuntimeExecutionMetadata;
  failureRecord: PipelineFailureRecord | null;
  emittedModel: ExecutiveModelRecord | null;
  createdAt: string;
  completedAt: string | null;
  source: "phase-3-executive-model-runtime";
}>;

export type RuntimeStageOutcome = Readonly<{
  stage: RuntimeExecutableStage;
  success: boolean;
  failureKind: PipelineFailureKind | null;
  message: string;
  checkpointKind: PipelineCheckpointKind | null;
  source: "phase-3-executive-model-runtime";
}>;

export type RuntimeExecutionInput = Readonly<{
  executionSessionId: string;
  workspaceId: RuntimeWorkspaceId;
  executiveModelId: string;
  sourceFoundationId: string;
  businessDataSourceIds: readonly string[];
  knowledgeArtifactIds: readonly string[];
  statusSnapshotId: string | null;
  metadata?: Partial<Pick<RuntimeExecutionMetadata, "displayName" | "triggerSource">>;
}>;

export type RuntimeExecutionResult = Readonly<{
  session: RuntimeSession;
  success: boolean;
  emittedModel: ExecutiveModelRecord | null;
  source: "phase-3-executive-model-runtime";
}>;

export type RuntimeValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type RuntimeValidationResult = Readonly<{
  valid: boolean;
  issues: readonly RuntimeValidationIssue[];
}>;

export type RuntimeScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type RuntimeScoreReport = Readonly<{
  contractVersion: string;
  dimensions: RuntimeScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type RuntimeCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type RuntimeAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  runtimeBoundaryIntegrity: number;
  structuralEmissionIntegrity: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type RuntimeAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: RuntimeAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type RuntimeFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  executableStagesCount: number;
  runtimeStatesCount: number;
  generatedAt: string;
}>;

export type RuntimeCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly RuntimeCertificationCheck[];
  scoreReport: RuntimeScoreReport;
  analysisScoreReport: RuntimeAnalysisScoreReport | null;
  freezeReport: RuntimeFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type RuntimeDiagnosticEventType =
  | "RuntimeSessionCreated"
  | "RuntimeStageStarted"
  | "RuntimeStageCompleted"
  | "RuntimeCheckpointRecorded"
  | "RuntimeCancelled"
  | "RuntimeFailed"
  | "RuntimeModelEmitted"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type RuntimeDiagnosticEvent = Readonly<{
  type: RuntimeDiagnosticEventType;
  runtimeSessionId: string | null;
  workspaceId: RuntimeWorkspaceId | null;
  timestamp: string;
}>;

export type RuntimeDiagnosticLogEntry = Readonly<{
  runtimeSessionId: string | null;
  workspaceId: RuntimeWorkspaceId | null;
  event: RuntimeDiagnosticEventType;
  message: string;
  generatedAt: string;
}>;
