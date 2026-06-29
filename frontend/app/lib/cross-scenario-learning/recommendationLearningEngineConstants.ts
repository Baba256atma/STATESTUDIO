/**
 * APP-10:7 — Recommendation Learning Engine constants.
 */

import type { RecommendationCategory, RecommendationLifecycleState } from "./recommendationLearningEngineTypes.ts";

export const RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION = "APP-10/7" as const;
export const RECOMMENDATION_LEARNING_ENGINE_ARCHITECTURE_VERSION = "APP-10/7-recommendation-learning-arch" as const;
export const RECOMMENDATION_LEARNING_ENGINE_OWNER = "recommendation-learning-engine" as const;

export const RECOMMENDATION_LEARNING_ENGINE_TAGS = Object.freeze([
  "[APP10_7]",
  "[RECOMMENDATION_LEARNING_ENGINE]",
  "[DETERMINISTIC]",
  "[HISTORICAL_EVIDENCE]",
  "[NO_GENERATION]",
  "[NO_RANKING]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const RECOMMENDATION_LEARNING_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "recommendationGenerator",
  "recommendationRanking",
  "recommendationOptimization",
  "recommendationScoring",
  "executiveAdvisor",
  "forecast(",
  "predict(",
  "openai",
  "prompt(",
  "clustering",
] as const);

export const RECOMMENDATION_CATEGORY_KEYS = Object.freeze([
  "strategic_recommendation",
  "operational_recommendation",
  "financial_recommendation",
  "resource_recommendation",
  "risk_recommendation",
  "growth_recommendation",
  "cost_recommendation",
  "timeline_recommendation",
  "organizational_recommendation",
  "mixed_recommendation",
] as const satisfies readonly RecommendationCategory[]);

export const RECOMMENDATION_CATEGORY_LABELS: Readonly<Record<RecommendationCategory, string>> = Object.freeze({
  strategic_recommendation: "Strategic Recommendation",
  operational_recommendation: "Operational Recommendation",
  financial_recommendation: "Financial Recommendation",
  resource_recommendation: "Resource Recommendation",
  risk_recommendation: "Risk Recommendation",
  growth_recommendation: "Growth Recommendation",
  cost_recommendation: "Cost Recommendation",
  timeline_recommendation: "Timeline Recommendation",
  organizational_recommendation: "Organizational Recommendation",
  mixed_recommendation: "Mixed Recommendation",
});

export const RECOMMENDATION_LIFECYCLE_STATE_KEYS = Object.freeze([
  "proposed",
  "reviewed",
  "accepted",
  "rejected",
  "implemented",
  "completed",
  "archived",
] as const satisfies readonly RecommendationLifecycleState[]);

export const RECOMMENDATION_LIFECYCLE_STATE_LABELS: Readonly<Record<RecommendationLifecycleState, string>> =
  Object.freeze({
    proposed: "Proposed",
    reviewed: "Reviewed",
    accepted: "Accepted",
    rejected: "Rejected",
    implemented: "Implemented",
    completed: "Completed",
    archived: "Archived",
  });

export const RECOMMENDATION_LEARNING_PIPELINE_STAGES = Object.freeze([
  "load_certified_recommendation_records",
  "validate_dependencies",
  "normalize_recommendation_records",
  "aggregate_historical_evidence",
  "link_strategies_outcomes_and_failures",
  "build_recommendation_profiles",
  "attach_provenance",
  "validate_contracts",
  "register_recommendation_profiles",
  "produce_immutable_learning_results",
] as const);

export const RECOMMENDATION_LEARNING_MANDATORY_PROFILE_FIELDS = Object.freeze([
  "recommendationId",
  "recommendationCategory",
  "recommendationSummary",
  "lifecycleState",
  "relatedStrategyIds",
  "relatedOutcomeIds",
  "relatedFailureIds",
  "relatedScenarioIds",
  "acceptanceHistory",
  "implementationHistory",
  "outcomeSummary",
  "failureSummary",
  "historicalEvidence",
  "provenance",
  "engineVersion",
  "learningTimestamp",
  "version",
  "readOnly",
] as const);

export const RECOMMENDATION_LEARNING_ENGINE_LIMITS = Object.freeze({
  maxRegisteredProfiles: 4096,
  maxHistoricalRecords: 4096,
  maxEvidencePerProfile: 256,
  maxRelatedStrategyIds: 32,
  maxRelatedScenarioIds: 256,
  maxRelatedOutcomeIds: 64,
  maxRelatedFailureIds: 64,
} as const);

export const RECOMMENDATION_LEARNING_CERTIFIED_SOURCES = Object.freeze([
  "APP-6",
  "APP-7",
  "APP-8",
  "APP-9",
  "APP-10/3",
  "APP-10/4",
  "APP-10/5",
  "APP-10/6",
] as const);

export const RECOMMENDATION_LEARNING_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noMachineLearning: true,
  noForecasting: true,
  noRecommendationGeneration: true,
  noRecommendationRanking: true,
  noRecommendationOptimization: true,
  noExecutiveAdvisor: true,
  historicalEvidenceOnly: true,
  deterministicOnly: true,
  consumerOnly: true,
} as const);

export const RECOMMENDATION_LEARNING_CERTIFIED_DEPENDENCIES = Object.freeze([
  Object.freeze({ phaseId: "APP-10/1", label: "Cross-Scenario Learning Foundation", required: true as const }),
  Object.freeze({ phaseId: "APP-10/2", label: "Pattern Extraction Engine", required: true as const }),
  Object.freeze({ phaseId: "APP-10/3", label: "Similarity Engine", required: true as const }),
  Object.freeze({ phaseId: "APP-10/4", label: "Outcome Learning Engine", required: true as const }),
  Object.freeze({ phaseId: "APP-10/5", label: "Failure Learning Engine", required: true as const }),
  Object.freeze({ phaseId: "APP-10/6", label: "Strategy Learning Engine", required: true as const }),
] as const);
