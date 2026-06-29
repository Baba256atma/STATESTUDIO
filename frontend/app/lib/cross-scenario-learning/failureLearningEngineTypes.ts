/**
 * APP-10:5 — Failure Learning Engine domain types.
 */

import type {
  FAILURE_CATEGORY_KEYS,
  FAILURE_FACTOR_KEYS,
  FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
  FAILURE_LEARNING_PIPELINE_STAGES,
} from "./failureLearningEngineConstants.ts";

export type FailureId = string;
export type FailureWorkspaceId = string;
export type ScenarioId = string;
export type PatternId = string;
export type SimilarityResultId = string;
export type OutcomeId = string;
export type DecisionId = string;

export type FailureCategory = (typeof FAILURE_CATEGORY_KEYS)[number];
export type FailureFactorKey = (typeof FAILURE_FACTOR_KEYS)[number];
export type FailureLearningPipelineStage = (typeof FAILURE_LEARNING_PIPELINE_STAGES)[number];

export type FailureMetadata = Readonly<{
  metadataVersion: string;
  owner?: string;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type FailureProvenance = Readonly<{
  scenarioIds: readonly ScenarioId[];
  decisionIds: readonly DecisionId[];
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  similarityResultIds: readonly SimilarityResultId[];
  patternIds: readonly PatternId[];
  outcomeIds: readonly OutcomeId[];
  confidenceVersion: string;
  extractionVersion: "APP-10/2";
  similarityVersion: "APP-10/3";
  outcomeVersion: "APP-10/4";
  engineVersion: typeof FAILURE_LEARNING_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type FailureEvidence = Readonly<{
  evidenceId: string;
  sourceApp: string;
  sourceType: string;
  referenceId: string;
  scenarioId: ScenarioId;
  description: string;
  readOnly: true;
}>;

export type FailureFactor = Readonly<{
  factorId: string;
  factorKey: FailureFactorKey;
  label: string;
  description: string;
  readOnly: true;
}>;

export type FailureCause = Readonly<{
  causeId: string;
  label: string;
  description: string;
  readOnly: true;
}>;

export type FailureHistory = Readonly<{
  historyId: string;
  scenarioIds: readonly ScenarioId[];
  failureCategories: readonly FailureCategory[];
  recordedAt: readonly string[];
  readOnly: true;
}>;

export type FailureProfile = Readonly<{
  failureId: FailureId;
  workspaceId: FailureWorkspaceId;
  relatedPatternIds: readonly PatternId[];
  relatedScenarioIds: readonly ScenarioId[];
  relatedOutcomeIds: readonly OutcomeId[];
  businessGoal: string;
  failureCategory: FailureCategory;
  failureFactors: readonly FailureFactor[];
  failureCauses: readonly FailureCause[];
  kpiImpactSummary: string;
  riskImpactSummary: string;
  evidenceCount: number;
  provenance: FailureProvenance;
  engineVersion: typeof FAILURE_LEARNING_ENGINE_CONTRACT_VERSION;
  learningTimestamp: string;
  version: typeof FAILURE_LEARNING_ENGINE_CONTRACT_VERSION;
  metadata: FailureMetadata;
  readOnly: true;
}>;

export type ExecutiveFailure = Readonly<{
  failure: FailureProfile;
  evidence: readonly FailureEvidence[];
  history: FailureHistory;
  readOnly: true;
}>;

export type HistoricalFailureRecordInput = Readonly<{
  scenarioId: ScenarioId;
  workspaceId: FailureWorkspaceId;
  businessGoal: string;
  failureCategory: FailureCategory;
  failureFactorKeys: readonly FailureFactorKey[];
  failureCauses: readonly Readonly<{ label: string; description: string }>[];
  kpiImpactSummary: string;
  riskImpactSummary: string;
  relatedPatternIds: readonly PatternId[];
  relatedSimilarityResultIds: readonly SimilarityResultId[];
  relatedOutcomeIds: readonly OutcomeId[];
  decisionIds: readonly DecisionId[];
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  confidenceVersion?: string;
  sourceApps: readonly string[];
  recordedAt?: string;
}>;

export type NormalizedFailureRecord = Readonly<{
  scenarioId: ScenarioId;
  workspaceId: FailureWorkspaceId;
  businessGoal: string;
  failureSignature: string;
  failureCategory: FailureCategory;
  failureFactorKeys: readonly FailureFactorKey[];
  failureCauses: readonly Readonly<{ label: string; description: string }>[];
  kpiImpactSummary: string;
  riskImpactSummary: string;
  relatedPatternIds: readonly PatternId[];
  relatedSimilarityResultIds: readonly SimilarityResultId[];
  relatedOutcomeIds: readonly OutcomeId[];
  decisionIds: readonly DecisionId[];
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  confidenceVersion: string;
  sourceApps: readonly string[];
  recordedAt: string;
  readOnly: true;
}>;

export type FailureLearningRequest = Readonly<{
  workspaceId: FailureWorkspaceId;
  records: readonly HistoricalFailureRecordInput[];
  learningTimestamp?: string;
}>;

export type FailureLearningResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: FailureWorkspaceId;
  learnedFailures: readonly ExecutiveFailure[];
  registeredFailureIds: readonly FailureId[];
  pipelineStages: readonly FailureLearningPipelineStage[];
  learningTimestamp: string;
  readOnly: true;
}>;

export type FailureRegistrySnapshot = Readonly<{
  registryVersion: typeof FAILURE_LEARNING_ENGINE_CONTRACT_VERSION;
  failureCount: number;
  failureIds: readonly FailureId[];
  readOnly: true;
}>;

export type FailureValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type FailureValidationResult = Readonly<{
  valid: boolean;
  issues: readonly FailureValidationIssue[];
  readOnly: true;
}>;

export type FailureEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: FailureValidationIssue | null;
  readOnly: true;
}>;

export type FailureLearningEngineState = Readonly<{
  engineId: "failure-learning-engine";
  contractVersion: typeof FAILURE_LEARNING_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredFailureCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type FailureLearningCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type FailureLearningCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-10/5";
  contractVersion: typeof FAILURE_LEARNING_ENGINE_CONTRACT_VERSION;
  checks: readonly FailureLearningCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;
