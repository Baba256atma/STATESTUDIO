/**
 * APP-10:3 — Similarity Engine constants.
 */

import type { KpiDirection, RiskProfile, SimilarityDimensionId } from "./similarityEngineTypes.ts";

export const SIMILARITY_ENGINE_CONTRACT_VERSION = "APP-10/3" as const;
export const SIMILARITY_ENGINE_ARCHITECTURE_VERSION = "APP-10/3-similarity-engine-arch" as const;
export const SIMILARITY_ENGINE_OWNER = "similarity-engine" as const;

export const SIMILARITY_ENGINE_TAGS = Object.freeze([
  "[APP10_3]",
  "[SIMILARITY_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_ML]",
  "[NO_EMBEDDINGS]",
  "[NO_RECOMMENDATION]",
  "[EXPLAINABLE]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SIMILARITY_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "clustering",
  "recommendationEngine",
  "openai",
  "prompt(",
  "predict(",
  "forecast(",
  "cosineSimilarity",
] as const);

export const KPI_DIRECTION_KEYS = Object.freeze([
  "increase",
  "decrease",
  "stable",
  "mixed",
] as const satisfies readonly KpiDirection[]);

export const RISK_PROFILE_KEYS = Object.freeze([
  "low",
  "medium",
  "high",
  "stable",
] as const satisfies readonly RiskProfile[]);

export const SIMILARITY_DIMENSION_IDS = Object.freeze([
  "strategy_chain",
  "kpi_direction",
  "risk_profile",
  "business_goal",
  "timeline_phase",
  "workspace_domain",
  "object_types",
  "decision_type",
  "outcome_type",
  "pattern_category",
] as const satisfies readonly SimilarityDimensionId[]);

export const SIMILARITY_DIMENSION_WEIGHTS: Readonly<Record<SimilarityDimensionId, number>> = Object.freeze({
  strategy_chain: 30,
  kpi_direction: 20,
  risk_profile: 20,
  business_goal: 15,
  timeline_phase: 10,
  workspace_domain: 5,
  object_types: 0,
  decision_type: 0,
  outcome_type: 0,
  pattern_category: 0,
});

export const SIMILARITY_DIMENSION_LABELS: Readonly<Record<SimilarityDimensionId, string>> = Object.freeze({
  strategy_chain: "Strategy Chain",
  kpi_direction: "KPI Direction",
  risk_profile: "Risk Profile",
  business_goal: "Business Goal",
  timeline_phase: "Timeline Phase",
  workspace_domain: "Workspace Domain",
  object_types: "Object Types",
  decision_type: "Decision Type",
  outcome_type: "Outcome Type",
  pattern_category: "Pattern Category",
});

export const SIMILARITY_SCORING_METHOD = "deterministic_weighted_rules" as const;

export const SIMILARITY_ENGINE_LIMITS = Object.freeze({
  maxRegisteredResults: 4096,
  maxHistoricalScenarios: 4096,
  maxPatternsCompared: 1024,
  maxStrategyChainSteps: 32,
  maxObjectTypes: 16,
  minScore: 0,
  maxScore: 100,
} as const);

export const SIMILARITY_MANDATORY_RESULT_FIELDS = Object.freeze([
  "similarityResultId",
  "queryScenarioId",
  "workspaceId",
  "comparisonType",
  "score",
  "dimensions",
  "evidence",
  "explanation",
  "comparedAt",
  "version",
  "readOnly",
] as const);

export const SIMILARITY_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noMachineLearning: true,
  noEmbeddings: true,
  noVectorSearch: true,
  noClustering: true,
  noRecommendationEngine: true,
  noForecasting: true,
  deterministicOnly: true,
  explainableOnly: true,
  consumerOnly: true,
} as const);

export const SIMILARITY_CERTIFIED_DEPENDENCIES = Object.freeze([
  Object.freeze({ phaseId: "APP-10/1", label: "Cross-Scenario Learning Foundation", required: true as const }),
  Object.freeze({ phaseId: "APP-10/2", label: "Pattern Extraction Engine", required: true as const }),
] as const);
