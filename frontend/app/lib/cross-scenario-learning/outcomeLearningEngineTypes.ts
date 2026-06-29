/**
 * APP-10:4 — Outcome Learning Engine domain types.
 */

import type {
  OUTCOME_CATEGORY_KEYS,
  OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION,
  OUTCOME_LEARNING_PIPELINE_STAGES,
} from "./outcomeLearningEngineConstants.ts";

export type OutcomeId = string;
export type OutcomeWorkspaceId = string;
export type ScenarioId = string;
export type PatternId = string;
export type SimilarityResultId = string;
export type DecisionId = string;

export type OutcomeCategory = (typeof OUTCOME_CATEGORY_KEYS)[number];
export type OutcomeLearningPipelineStage = (typeof OUTCOME_LEARNING_PIPELINE_STAGES)[number];

export type OutcomeMetadata = Readonly<{
  metadataVersion: string;
  owner?: string;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type OutcomeProvenance = Readonly<{
  scenarioIds: readonly ScenarioId[];
  decisionIds: readonly DecisionId[];
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  similarityResultIds: readonly SimilarityResultId[];
  patternIds: readonly PatternId[];
  confidenceVersion: string;
  extractionVersion: "APP-10/2";
  similarityVersion: "APP-10/3";
  engineVersion: typeof OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type OutcomeEvidence = Readonly<{
  evidenceId: string;
  sourceApp: string;
  sourceType: string;
  referenceId: string;
  scenarioId: ScenarioId;
  description: string;
  readOnly: true;
}>;

export type OutcomeSummary = Readonly<{
  summaryId: string;
  headline: string;
  category: OutcomeCategory;
  scenarioCount: number;
  evidenceCount: number;
  readOnly: true;
}>;

export type OutcomeStatistics = Readonly<{
  totalScenarios: number;
  totalEvidence: number;
  categoryCounts: Readonly<Record<OutcomeCategory, number>>;
  patternCount: number;
  readOnly: true;
}>;

export type OutcomeHistory = Readonly<{
  historyId: string;
  scenarioIds: readonly ScenarioId[];
  outcomeCategories: readonly OutcomeCategory[];
  recordedAt: readonly string[];
  readOnly: true;
}>;

export type OutcomeProfile = Readonly<{
  outcomeId: OutcomeId;
  workspaceId: OutcomeWorkspaceId;
  relatedPatternIds: readonly PatternId[];
  relatedScenarioIds: readonly ScenarioId[];
  businessGoal: string;
  finalOutcomeCategory: OutcomeCategory;
  kpiChangeSummary: string;
  riskChangeSummary: string;
  decisionSummary: string;
  evidenceCount: number;
  provenance: OutcomeProvenance;
  engineVersion: typeof OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION;
  learningTimestamp: string;
  version: typeof OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION;
  metadata: OutcomeMetadata;
  readOnly: true;
}>;

export type ExecutiveOutcome = Readonly<{
  outcome: OutcomeProfile;
  summary: OutcomeSummary;
  evidence: readonly OutcomeEvidence[];
  statistics: OutcomeStatistics;
  history: OutcomeHistory;
  readOnly: true;
}>;

export type HistoricalOutcomeRecordInput = Readonly<{
  scenarioId: ScenarioId;
  workspaceId: OutcomeWorkspaceId;
  businessGoal: string;
  finalOutcomeCategory: OutcomeCategory;
  kpiChangeSummary: string;
  riskChangeSummary: string;
  decisionSummary: string;
  relatedPatternIds: readonly PatternId[];
  relatedSimilarityResultIds: readonly SimilarityResultId[];
  decisionIds: readonly DecisionId[];
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  confidenceVersion?: string;
  sourceApps: readonly string[];
  recordedAt?: string;
}>;

export type NormalizedOutcomeRecord = Readonly<{
  scenarioId: ScenarioId;
  workspaceId: OutcomeWorkspaceId;
  businessGoal: string;
  outcomeSignature: string;
  finalOutcomeCategory: OutcomeCategory;
  kpiChangeSummary: string;
  riskChangeSummary: string;
  decisionSummary: string;
  relatedPatternIds: readonly PatternId[];
  relatedSimilarityResultIds: readonly SimilarityResultId[];
  decisionIds: readonly DecisionId[];
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  confidenceVersion: string;
  sourceApps: readonly string[];
  recordedAt: string;
  readOnly: true;
}>;

export type OutcomeLearningRequest = Readonly<{
  workspaceId: OutcomeWorkspaceId;
  records: readonly HistoricalOutcomeRecordInput[];
  learningTimestamp?: string;
}>;

export type OutcomeLearningResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: OutcomeWorkspaceId;
  learnedOutcomes: readonly ExecutiveOutcome[];
  registeredOutcomeIds: readonly OutcomeId[];
  pipelineStages: readonly OutcomeLearningPipelineStage[];
  learningTimestamp: string;
  readOnly: true;
}>;

export type OutcomeRegistrySnapshot = Readonly<{
  registryVersion: typeof OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION;
  outcomeCount: number;
  outcomeIds: readonly OutcomeId[];
  readOnly: true;
}>;

export type OutcomeValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type OutcomeValidationResult = Readonly<{
  valid: boolean;
  issues: readonly OutcomeValidationIssue[];
  readOnly: true;
}>;

export type OutcomeEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: OutcomeValidationIssue | null;
  readOnly: true;
}>;

export type OutcomeLearningEngineState = Readonly<{
  engineId: "outcome-learning-engine";
  contractVersion: typeof OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredOutcomeCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type OutcomeLearningCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type OutcomeLearningCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-10/4";
  contractVersion: typeof OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION;
  checks: readonly OutcomeLearningCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;
