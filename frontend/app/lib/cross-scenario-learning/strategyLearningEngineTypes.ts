/**
 * APP-10:6 — Strategy Learning Engine domain types.
 */

import type {
  STRATEGY_CATEGORY_KEYS,
  STRATEGY_CONDITION_KEYS,
  STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
  STRATEGY_LEARNING_PIPELINE_STAGES,
} from "./strategyLearningEngineConstants.ts";

export type StrategyId = string;
export type StrategyWorkspaceId = string;
export type ScenarioId = string;
export type PatternId = string;
export type SimilarityResultId = string;
export type OutcomeId = string;
export type FailureId = string;
export type DecisionId = string;

export type StrategyCategory = (typeof STRATEGY_CATEGORY_KEYS)[number];
export type StrategyConditionKey = (typeof STRATEGY_CONDITION_KEYS)[number];
export type StrategyLearningPipelineStage = (typeof STRATEGY_LEARNING_PIPELINE_STAGES)[number];

export type StrategyMetadata = Readonly<{
  metadataVersion: string;
  owner?: string;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type StrategyProvenance = Readonly<{
  scenarioIds: readonly ScenarioId[];
  decisionIds: readonly DecisionId[];
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  similarityResultIds: readonly SimilarityResultId[];
  patternIds: readonly PatternId[];
  outcomeIds: readonly OutcomeId[];
  failureIds: readonly FailureId[];
  confidenceVersion: string;
  extractionVersion: "APP-10/2";
  similarityVersion: "APP-10/3";
  outcomeVersion: "APP-10/4";
  failureVersion: "APP-10/5";
  engineVersion: typeof STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type StrategyEvidence = Readonly<{
  evidenceId: string;
  sourceApp: string;
  sourceType: string;
  referenceId: string;
  scenarioId: ScenarioId;
  description: string;
  readOnly: true;
}>;

export type StrategyCondition = Readonly<{
  conditionId: string;
  conditionKey: StrategyConditionKey;
  label: string;
  value: string;
  readOnly: true;
}>;

export type StrategyOutcomeLink = Readonly<{
  linkId: string;
  outcomeId: OutcomeId;
  scenarioId: ScenarioId;
  summary: string;
  readOnly: true;
}>;

export type StrategyFailureLink = Readonly<{
  linkId: string;
  failureId: FailureId;
  scenarioId: ScenarioId;
  summary: string;
  readOnly: true;
}>;

export type StrategyProfile = Readonly<{
  strategyId: StrategyId;
  workspaceId: StrategyWorkspaceId;
  strategyName: string;
  strategyCategory: StrategyCategory;
  relatedPatternIds: readonly PatternId[];
  relatedScenarioIds: readonly ScenarioId[];
  relatedOutcomeIds: readonly OutcomeId[];
  relatedFailureIds: readonly FailureId[];
  businessConditions: readonly StrategyCondition[];
  successEvidence: readonly StrategyEvidence[];
  failureEvidence: readonly StrategyEvidence[];
  riskEvidence: readonly StrategyEvidence[];
  outcomeSummary: string;
  failureSummary: string;
  evidenceCount: number;
  provenance: StrategyProvenance;
  engineVersion: typeof STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION;
  learningTimestamp: string;
  version: typeof STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION;
  metadata: StrategyMetadata;
  readOnly: true;
}>;

export type ExecutiveStrategy = Readonly<{
  strategy: StrategyProfile;
  outcomeLinks: readonly StrategyOutcomeLink[];
  failureLinks: readonly StrategyFailureLink[];
  readOnly: true;
}>;

export type HistoricalStrategyRecordInput = Readonly<{
  scenarioId: ScenarioId;
  workspaceId: StrategyWorkspaceId;
  strategyName: string;
  strategyCategory: StrategyCategory;
  businessGoal: string;
  workspaceDomain: string;
  timelinePhase: string;
  kpiDirection: string;
  riskProfile: string;
  resourceConstraints?: string;
  dependencyConstraints?: string;
  executionConditions?: string;
  outcomeSummary: string;
  failureSummary: string;
  relatedPatternIds: readonly PatternId[];
  relatedSimilarityResultIds: readonly SimilarityResultId[];
  relatedOutcomeIds: readonly OutcomeId[];
  relatedFailureIds: readonly FailureId[];
  decisionIds: readonly DecisionId[];
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  confidenceVersion?: string;
  sourceApps: readonly string[];
  recordedAt?: string;
}>;

export type NormalizedStrategyRecord = Readonly<{
  scenarioId: ScenarioId;
  workspaceId: StrategyWorkspaceId;
  strategySignature: string;
  strategyName: string;
  strategyCategory: StrategyCategory;
  businessGoal: string;
  workspaceDomain: string;
  timelinePhase: string;
  kpiDirection: string;
  riskProfile: string;
  resourceConstraints: string;
  dependencyConstraints: string;
  executionConditions: string;
  outcomeSummary: string;
  failureSummary: string;
  relatedPatternIds: readonly PatternId[];
  relatedSimilarityResultIds: readonly SimilarityResultId[];
  relatedOutcomeIds: readonly OutcomeId[];
  relatedFailureIds: readonly FailureId[];
  decisionIds: readonly DecisionId[];
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  confidenceVersion: string;
  sourceApps: readonly string[];
  recordedAt: string;
  readOnly: true;
}>;

export type StrategyLearningRequest = Readonly<{
  workspaceId: StrategyWorkspaceId;
  records: readonly HistoricalStrategyRecordInput[];
  learningTimestamp?: string;
}>;

export type StrategyLearningResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: StrategyWorkspaceId;
  learnedStrategies: readonly ExecutiveStrategy[];
  registeredStrategyIds: readonly StrategyId[];
  pipelineStages: readonly StrategyLearningPipelineStage[];
  learningTimestamp: string;
  readOnly: true;
}>;

export type StrategyRegistrySnapshot = Readonly<{
  registryVersion: typeof STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION;
  strategyCount: number;
  strategyIds: readonly StrategyId[];
  readOnly: true;
}>;

export type StrategyValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type StrategyValidationResult = Readonly<{
  valid: boolean;
  issues: readonly StrategyValidationIssue[];
  readOnly: true;
}>;

export type StrategyEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: StrategyValidationIssue | null;
  readOnly: true;
}>;

export type StrategyLearningEngineState = Readonly<{
  engineId: "strategy-learning-engine";
  contractVersion: typeof STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredStrategyCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type StrategyLearningCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type StrategyLearningCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-10/6";
  contractVersion: typeof STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION;
  checks: readonly StrategyLearningCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;
