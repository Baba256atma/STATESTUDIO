/**
 * APP-10:7 — Recommendation Learning Engine domain types.
 */

import type {
  RECOMMENDATION_CATEGORY_KEYS,
  RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
  RECOMMENDATION_LEARNING_PIPELINE_STAGES,
  RECOMMENDATION_LIFECYCLE_STATE_KEYS,
} from "./recommendationLearningEngineConstants.ts";

export type RecommendationId = string;
export type RecommendationWorkspaceId = string;
export type ScenarioId = string;
export type StrategyId = string;
export type SimilarityResultId = string;
export type OutcomeId = string;
export type FailureId = string;
export type DecisionId = string;

export type RecommendationCategory = (typeof RECOMMENDATION_CATEGORY_KEYS)[number];
export type RecommendationLifecycleState = (typeof RECOMMENDATION_LIFECYCLE_STATE_KEYS)[number];
export type RecommendationLearningPipelineStage = (typeof RECOMMENDATION_LEARNING_PIPELINE_STAGES)[number];

export type RecommendationMetadata = Readonly<{
  metadataVersion: string;
  owner?: string;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type RecommendationProvenance = Readonly<{
  scenarioIds: readonly ScenarioId[];
  decisionIds: readonly DecisionId[];
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  similarityResultIds: readonly SimilarityResultId[];
  strategyIds: readonly StrategyId[];
  outcomeIds: readonly OutcomeId[];
  failureIds: readonly FailureId[];
  confidenceVersion: string;
  similarityVersion: "APP-10/3";
  outcomeVersion: "APP-10/4";
  failureVersion: "APP-10/5";
  strategyVersion: "APP-10/6";
  engineVersion: typeof RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type RecommendationEvidence = Readonly<{
  evidenceId: string;
  sourceApp: string;
  sourceType: string;
  referenceId: string;
  scenarioId: ScenarioId;
  description: string;
  readOnly: true;
}>;

export type RecommendationLifecycle = Readonly<{
  lifecycleId: string;
  state: RecommendationLifecycleState;
  recordedAt: string;
  readOnly: true;
}>;

export type RecommendationImplementation = Readonly<{
  implementationId: string;
  scenarioId: ScenarioId;
  implementedAt: string;
  summary: string;
  readOnly: true;
}>;

export type RecommendationOutcomeLink = Readonly<{
  linkId: string;
  outcomeId: OutcomeId;
  scenarioId: ScenarioId;
  summary: string;
  readOnly: true;
}>;

export type RecommendationFailureLink = Readonly<{
  linkId: string;
  failureId: FailureId;
  scenarioId: ScenarioId;
  summary: string;
  readOnly: true;
}>;

export type RecommendationHistoricalMetrics = Readonly<{
  acceptanceCount: number;
  rejectionCount: number;
  implementationCount: number;
  completionCount: number;
  readOnly: true;
}>;

export type RecommendationProfile = Readonly<{
  recommendationId: RecommendationId;
  workspaceId: RecommendationWorkspaceId;
  recommendationCategory: RecommendationCategory;
  recommendationSummary: string;
  lifecycleState: RecommendationLifecycleState;
  relatedStrategyIds: readonly StrategyId[];
  relatedOutcomeIds: readonly OutcomeId[];
  relatedFailureIds: readonly FailureId[];
  relatedScenarioIds: readonly ScenarioId[];
  acceptanceHistory: readonly RecommendationLifecycle[];
  implementationHistory: readonly RecommendationImplementation[];
  outcomeSummary: string;
  failureSummary: string;
  historicalEvidence: readonly RecommendationEvidence[];
  historicalMetrics: RecommendationHistoricalMetrics;
  provenance: RecommendationProvenance;
  evidenceCount: number;
  engineVersion: typeof RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION;
  learningTimestamp: string;
  version: typeof RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION;
  metadata: RecommendationMetadata;
  readOnly: true;
}>;

export type ExecutiveRecommendationHistory = Readonly<{
  profile: RecommendationProfile;
  outcomeLinks: readonly RecommendationOutcomeLink[];
  failureLinks: readonly RecommendationFailureLink[];
  lifecycleHistory: readonly RecommendationLifecycle[];
  readOnly: true;
}>;

export type HistoricalRecommendationRecordInput = Readonly<{
  recommendationRecordId: string;
  scenarioId: ScenarioId;
  workspaceId: RecommendationWorkspaceId;
  recommendationSummary: string;
  recommendationCategory: RecommendationCategory;
  lifecycleState: RecommendationLifecycleState;
  outcomeSummary: string;
  failureSummary: string;
  relatedStrategyIds: readonly StrategyId[];
  relatedSimilarityResultIds: readonly SimilarityResultId[];
  relatedOutcomeIds: readonly OutcomeId[];
  relatedFailureIds: readonly FailureId[];
  decisionIds: readonly DecisionId[];
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  acceptanceEvents: readonly Readonly<{ state: "accepted" | "rejected"; recordedAt: string }>[];
  implementationEvents: readonly Readonly<{ implementedAt: string; summary: string }>[];
  confidenceVersion?: string;
  sourceApps: readonly string[];
  recordedAt?: string;
}>;

export type NormalizedRecommendationRecord = Readonly<{
  recommendationRecordId: string;
  scenarioId: ScenarioId;
  workspaceId: RecommendationWorkspaceId;
  recommendationSignature: string;
  recommendationSummary: string;
  recommendationCategory: RecommendationCategory;
  lifecycleState: RecommendationLifecycleState;
  outcomeSummary: string;
  failureSummary: string;
  relatedStrategyIds: readonly StrategyId[];
  relatedSimilarityResultIds: readonly SimilarityResultId[];
  relatedOutcomeIds: readonly OutcomeId[];
  relatedFailureIds: readonly FailureId[];
  decisionIds: readonly DecisionId[];
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  acceptanceEvents: readonly Readonly<{ state: "accepted" | "rejected"; recordedAt: string }>[];
  implementationEvents: readonly Readonly<{ implementedAt: string; summary: string }>[];
  confidenceVersion: string;
  sourceApps: readonly string[];
  recordedAt: string;
  readOnly: true;
}>;

export type RecommendationLearningRequest = Readonly<{
  workspaceId: RecommendationWorkspaceId;
  records: readonly HistoricalRecommendationRecordInput[];
  learningTimestamp?: string;
}>;

export type RecommendationLearningResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: RecommendationWorkspaceId;
  learnedRecommendations: readonly ExecutiveRecommendationHistory[];
  registeredRecommendationIds: readonly RecommendationId[];
  pipelineStages: readonly RecommendationLearningPipelineStage[];
  learningTimestamp: string;
  readOnly: true;
}>;

export type RecommendationRegistrySnapshot = Readonly<{
  registryVersion: typeof RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION;
  profileCount: number;
  recommendationIds: readonly RecommendationId[];
  readOnly: true;
}>;

export type RecommendationValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type RecommendationValidationResult = Readonly<{
  valid: boolean;
  issues: readonly RecommendationValidationIssue[];
  readOnly: true;
}>;

export type RecommendationEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: RecommendationValidationIssue | null;
  readOnly: true;
}>;

export type RecommendationLearningEngineState = Readonly<{
  engineId: "recommendation-learning-engine";
  contractVersion: typeof RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredProfileCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type RecommendationLearningCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type RecommendationLearningCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-10/7";
  contractVersion: typeof RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION;
  checks: readonly RecommendationLearningCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;
