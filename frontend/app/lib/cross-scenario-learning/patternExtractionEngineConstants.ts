/**
 * APP-10:2 — Pattern Extraction Engine constants.
 */

import type { PatternCategory, PatternType } from "./patternExtractionEngineTypes.ts";

export const PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION = "APP-10/2" as const;
export const PATTERN_EXTRACTION_ENGINE_ARCHITECTURE_VERSION = "APP-10/2-pattern-extraction-arch" as const;
export const PATTERN_EXTRACTION_ENGINE_OWNER = "pattern-extraction-engine" as const;

export const PATTERN_EXTRACTION_ENGINE_TAGS = Object.freeze([
  "[APP10_2]",
  "[PATTERN_EXTRACTION_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_ML]",
  "[NO_SIMILARITY]",
  "[NO_RECOMMENDATION]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const PATTERN_EXTRACTION_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "clustering",
  "similarityEngine",
  "recommendationEngine",
  "openai",
  "prompt(",
  "predict(",
  "forecast(",
] as const);

export const PATTERN_CATEGORY_KEYS = Object.freeze([
  "growth",
  "cost_reduction",
  "operational",
  "strategic",
  "financial",
  "risk",
  "resource",
  "customer",
  "product",
  "organizational",
] as const satisfies readonly PatternCategory[]);

export const PATTERN_TYPE_KEYS = Object.freeze([
  "strategy_outcome",
  "operational_outcome",
  "decision_outcome",
  "resource_outcome",
  "risk_outcome",
] as const satisfies readonly PatternType[]);

export const PATTERN_EXTRACTION_MANDATORY_PATTERN_FIELDS = Object.freeze([
  "patternId",
  "patternName",
  "patternType",
  "patternCategory",
  "executiveSummary",
  "supportingEvidence",
  "sourceScenarioIds",
  "sourceDecisionIds",
  "outcomeSummary",
  "confidenceMetadata",
  "extractionTimestamp",
  "version",
  "provenance",
  "metadata",
  "readOnly",
] as const);

export const PATTERN_EXTRACTION_ENGINE_LIMITS = Object.freeze({
  maxRegisteredPatterns: 4096,
  maxEvidencePerPattern: 256,
  maxStrategyChainSteps: 32,
  maxScenarioInputs: 4096,
  minOccurrencesForExtraction: 2,
  maxPatternNameLength: 128,
  maxExecutiveSummaryLength: 1024,
  maxOutcomeSummaryLength: 512,
} as const);

export const PATTERN_EXTRACTION_PIPELINE_STAGES = Object.freeze([
  "load_certified_scenarios",
  "validate_inputs",
  "normalize_records",
  "aggregate_evidence",
  "extract_reusable_pattern",
  "attach_provenance",
  "validate_pattern",
  "register_pattern",
  "produce_immutable_result",
] as const);

export const PATTERN_EXTRACTION_CERTIFIED_SOURCE_APPS = Object.freeze([
  "APP-5",
  "APP-6",
  "APP-7",
  "APP-8",
  "APP-9",
  "APP-10/1",
] as const);

export const PATTERN_EXTRACTION_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noMachineLearning: true,
  noSimilarityEngine: true,
  noRecommendationEngine: true,
  noForecasting: true,
  noEmbeddings: true,
  noVectorSearch: true,
  noClustering: true,
  immutablePatterns: true,
  deterministicOnly: true,
  consumerOnly: true,
} as const);

export const PATTERN_CATEGORY_LABELS: Readonly<Record<PatternCategory, string>> = Object.freeze({
  growth: "Growth",
  cost_reduction: "Cost Reduction",
  operational: "Operational",
  strategic: "Strategic",
  financial: "Financial",
  risk: "Risk",
  resource: "Resource",
  customer: "Customer",
  product: "Product",
  organizational: "Organizational",
});
