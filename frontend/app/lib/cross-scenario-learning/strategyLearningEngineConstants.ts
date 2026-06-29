/**
 * APP-10:6 — Strategy Learning Engine constants.
 */

import type { StrategyCategory } from "./strategyLearningEngineTypes.ts";

export const STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION = "APP-10/6" as const;
export const STRATEGY_LEARNING_ENGINE_ARCHITECTURE_VERSION = "APP-10/6-strategy-learning-arch" as const;
export const STRATEGY_LEARNING_ENGINE_OWNER = "strategy-learning-engine" as const;

export const STRATEGY_LEARNING_ENGINE_TAGS = Object.freeze([
  "[APP10_6]",
  "[STRATEGY_LEARNING_ENGINE]",
  "[DETERMINISTIC]",
  "[HISTORICAL_EVIDENCE]",
  "[NO_RECOMMENDATION]",
  "[NO_RANKING]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const STRATEGY_LEARNING_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "recommendationEngine",
  "forecast(",
  "predict(",
  "openai",
  "prompt(",
  "strategyRanking",
  "strategyAdvice",
  "clustering",
] as const);

export const STRATEGY_CATEGORY_KEYS = Object.freeze([
  "growth_strategy",
  "cost_reduction_strategy",
  "risk_reduction_strategy",
  "operational_strategy",
  "resource_strategy",
  "financial_strategy",
  "customer_strategy",
  "product_strategy",
  "organizational_strategy",
  "mixed_strategy",
] as const satisfies readonly StrategyCategory[]);

export const STRATEGY_CATEGORY_LABELS: Readonly<Record<StrategyCategory, string>> = Object.freeze({
  growth_strategy: "Growth Strategy",
  cost_reduction_strategy: "Cost Reduction Strategy",
  risk_reduction_strategy: "Risk Reduction Strategy",
  operational_strategy: "Operational Strategy",
  resource_strategy: "Resource Strategy",
  financial_strategy: "Financial Strategy",
  customer_strategy: "Customer Strategy",
  product_strategy: "Product Strategy",
  organizational_strategy: "Organizational Strategy",
  mixed_strategy: "Mixed Strategy",
});

export const STRATEGY_CONDITION_KEYS = Object.freeze([
  "workspace_domain",
  "business_goal",
  "timeline_phase",
  "kpi_direction",
  "risk_profile",
  "resource_constraints",
  "dependency_constraints",
  "execution_conditions",
] as const);

export const STRATEGY_LEARNING_PIPELINE_STAGES = Object.freeze([
  "load_certified_strategy_records",
  "validate_dependencies",
  "normalize_strategy_records",
  "aggregate_evidence",
  "link_outcomes_and_failures",
  "build_strategy_profiles",
  "attach_provenance",
  "validate_contracts",
  "register_strategies",
  "produce_immutable_learning_results",
] as const);

export const STRATEGY_LEARNING_MANDATORY_PROFILE_FIELDS = Object.freeze([
  "strategyId",
  "strategyName",
  "strategyCategory",
  "relatedPatternIds",
  "relatedScenarioIds",
  "relatedOutcomeIds",
  "relatedFailureIds",
  "businessConditions",
  "outcomeSummary",
  "failureSummary",
  "provenance",
  "engineVersion",
  "learningTimestamp",
  "version",
  "readOnly",
] as const);

export const STRATEGY_LEARNING_ENGINE_LIMITS = Object.freeze({
  maxRegisteredStrategies: 4096,
  maxHistoricalRecords: 4096,
  maxEvidencePerStrategy: 256,
  maxRelatedPatternIds: 32,
  maxRelatedScenarioIds: 256,
  maxRelatedOutcomeIds: 64,
  maxRelatedFailureIds: 64,
  maxBusinessConditions: 16,
} as const);

export const STRATEGY_LEARNING_CERTIFIED_SOURCES = Object.freeze([
  "APP-5",
  "APP-6",
  "APP-7",
  "APP-8",
  "APP-9",
  "APP-10/2",
  "APP-10/3",
  "APP-10/4",
  "APP-10/5",
] as const);

export const STRATEGY_LEARNING_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noMachineLearning: true,
  noForecasting: true,
  noRecommendationEngine: true,
  noStrategyRanking: true,
  noStrategyAdvice: true,
  noConfidencePrediction: true,
  historicalEvidenceOnly: true,
  deterministicOnly: true,
  consumerOnly: true,
} as const);

export const STRATEGY_LEARNING_CERTIFIED_DEPENDENCIES = Object.freeze([
  Object.freeze({ phaseId: "APP-10/1", label: "Cross-Scenario Learning Foundation", required: true as const }),
  Object.freeze({ phaseId: "APP-10/2", label: "Pattern Extraction Engine", required: true as const }),
  Object.freeze({ phaseId: "APP-10/3", label: "Similarity Engine", required: true as const }),
  Object.freeze({ phaseId: "APP-10/4", label: "Outcome Learning Engine", required: true as const }),
  Object.freeze({ phaseId: "APP-10/5", label: "Failure Learning Engine", required: true as const }),
] as const);
