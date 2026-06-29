/**
 * APP-10:4 — Outcome Learning Engine constants.
 */

import type { OutcomeCategory } from "./outcomeLearningEngineTypes.ts";

export const OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION = "APP-10/4" as const;
export const OUTCOME_LEARNING_ENGINE_ARCHITECTURE_VERSION = "APP-10/4-outcome-learning-arch" as const;
export const OUTCOME_LEARNING_ENGINE_OWNER = "outcome-learning-engine" as const;

export const OUTCOME_LEARNING_ENGINE_TAGS = Object.freeze([
  "[APP10_4]",
  "[OUTCOME_LEARNING_ENGINE]",
  "[DETERMINISTIC]",
  "[HISTORICAL_EVIDENCE]",
  "[NO_PREDICTION]",
  "[NO_RECOMMENDATION]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const OUTCOME_LEARNING_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "recommendationEngine",
  "forecast(",
  "predict(",
  "openai",
  "prompt(",
  "failureLearning",
  "strategyLearning",
] as const);

export const OUTCOME_CATEGORY_KEYS = Object.freeze([
  "strong_success",
  "moderate_success",
  "neutral",
  "moderate_failure",
  "critical_failure",
  "mixed_outcome",
] as const satisfies readonly OutcomeCategory[]);

export const OUTCOME_CATEGORY_LABELS: Readonly<Record<OutcomeCategory, string>> = Object.freeze({
  strong_success: "Strong Success",
  moderate_success: "Moderate Success",
  neutral: "Neutral",
  moderate_failure: "Moderate Failure",
  critical_failure: "Critical Failure",
  mixed_outcome: "Mixed Outcome",
});

export const OUTCOME_LEARNING_PIPELINE_STAGES = Object.freeze([
  "load_certified_historical_records",
  "validate_dependencies",
  "normalize_outcome_records",
  "aggregate_evidence",
  "build_outcome_profiles",
  "attach_provenance",
  "validate_contracts",
  "register_outcomes",
  "produce_immutable_learning_results",
] as const);

export const OUTCOME_LEARNING_MANDATORY_PROFILE_FIELDS = Object.freeze([
  "outcomeId",
  "relatedPatternIds",
  "relatedScenarioIds",
  "businessGoal",
  "finalOutcomeCategory",
  "kpiChangeSummary",
  "riskChangeSummary",
  "decisionSummary",
  "evidenceCount",
  "provenance",
  "engineVersion",
  "learningTimestamp",
  "version",
  "readOnly",
] as const);

export const OUTCOME_LEARNING_ENGINE_LIMITS = Object.freeze({
  maxRegisteredOutcomes: 4096,
  maxHistoricalRecords: 4096,
  maxEvidencePerOutcome: 256,
  maxRelatedPatternIds: 32,
  maxRelatedScenarioIds: 256,
} as const);

export const OUTCOME_LEARNING_CERTIFIED_SOURCES = Object.freeze([
  "APP-5",
  "APP-6",
  "APP-7",
  "APP-8",
  "APP-9",
  "APP-10/2",
  "APP-10/3",
] as const);

export const OUTCOME_LEARNING_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noMachineLearning: true,
  noForecasting: true,
  noRecommendationEngine: true,
  noExecutiveAdvice: true,
  noConfidenceRanking: true,
  historicalEvidenceOnly: true,
  deterministicOnly: true,
  consumerOnly: true,
} as const);

export const OUTCOME_LEARNING_CERTIFIED_DEPENDENCIES = Object.freeze([
  Object.freeze({ phaseId: "APP-10/1", label: "Cross-Scenario Learning Foundation", required: true as const }),
  Object.freeze({ phaseId: "APP-10/2", label: "Pattern Extraction Engine", required: true as const }),
  Object.freeze({ phaseId: "APP-10/3", label: "Similarity Engine", required: true as const }),
] as const);
