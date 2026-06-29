/**
 * APP-12:2 — Executive Recommendation Generation Engine constants.
 */

import type { ExecutiveRecommendationDomainKey } from "./executiveRecommendationTypes.ts";

export const EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION = "APP-12/2" as const;
export const EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_ARCHITECTURE_VERSION =
  "APP-12/2-generation-engine-arch" as const;
export const EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_OWNER =
  "executive-recommendation-generation-engine" as const;

export const EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_TAGS = Object.freeze([
  "[APP12_2]",
  "[RECOMMENDATION_GENERATION_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_EVALUATION]",
  "[NO_RANKING]",
  "[NO_EXECUTION]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "evaluateRecommendation",
  "rankRecommendation",
  "optimizeRecommendation",
  "executeRecommendation",
  "approveRecommendation",
  "workflowEngine",
  "recommendationRanking",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "openai",
  "prompt(",
  "predict(",
  "forecast(",
  "autonomousDecision",
] as const);

export const EXECUTIVE_RECOMMENDATION_GENERATION_PIPELINE_STAGES = Object.freeze([
  "load_certified_source_records",
  "validate_dependencies",
  "normalize_source_information",
  "aggregate_recommendation_evidence",
  "build_recommendation_candidates",
  "attach_provenance",
  "validate_contracts",
  "register_candidates",
  "produce_immutable_generation_results",
] as const);

export const EXECUTIVE_RECOMMENDATION_GENERATION_MANDATORY_CANDIDATE_FIELDS = Object.freeze([
  "recommendationId",
  "category",
  "executiveSummary",
  "supportingEvidence",
  "sourceReferences",
  "businessContext",
  "reasoning",
  "provenance",
  "generationTimestamp",
  "engineVersion",
  "version",
  "readOnly",
] as const);

export const EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_LIMITS = Object.freeze({
  maxRegisteredCandidates: 4096,
  maxSourceRecords: 4096,
  maxSummaryLength: 1024,
  maxBusinessContextLength: 512,
  maxSourceAppsPerRecord: 13,
  maxEvidencePerCandidate: 8,
} as const);

export const EXECUTIVE_RECOMMENDATION_GENERATION_CERTIFIED_SOURCE_APPS = Object.freeze([
  "APP-1",
  "APP-2",
  "APP-3",
  "APP-4",
  "APP-5",
  "APP-6",
  "APP-7",
  "APP-8",
  "APP-9",
  "APP-10",
  "APP-11",
  "DS",
  "INT",
] as const);

export const EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP: Readonly<
  Record<
    string,
    Readonly<{ platformId: string; defaultAppId: string; defaultDomain: ExecutiveRecommendationDomainKey }>
  >
> = Object.freeze({
  "executive-time-provider": Object.freeze({
    platformId: "executive-time-platform",
    defaultAppId: "APP-1",
    defaultDomain: "operational" as const,
  }),
  "scenario-intelligence-provider": Object.freeze({
    platformId: "scenario-intelligence-platform",
    defaultAppId: "APP-2",
    defaultDomain: "scenario" as const,
  }),
  "executive-intent-provider": Object.freeze({
    platformId: "executive-intent-platform",
    defaultAppId: "APP-3",
    defaultDomain: "strategic" as const,
  }),
  "executive-memory-provider": Object.freeze({
    platformId: "executive-memory-platform",
    defaultAppId: "APP-4",
    defaultDomain: "organizational" as const,
  }),
  "scenario-timeline-provider": Object.freeze({
    platformId: "scenario-timeline-platform",
    defaultAppId: "APP-5",
    defaultDomain: "timeline" as const,
  }),
  "decision-timeline-provider": Object.freeze({
    platformId: "decision-timeline-platform",
    defaultAppId: "APP-6",
    defaultDomain: "timeline" as const,
  }),
  "business-timeline-provider": Object.freeze({
    platformId: "business-timeline-platform",
    defaultAppId: "APP-7",
    defaultDomain: "financial" as const,
  }),
  "decision-journal-provider": Object.freeze({
    platformId: "decision-journal-platform",
    defaultAppId: "APP-8",
    defaultDomain: "risk" as const,
  }),
  "confidence-evolution-provider": Object.freeze({
    platformId: "confidence-evolution-platform",
    defaultAppId: "APP-9",
    defaultDomain: "risk" as const,
  }),
  "cross-scenario-learning-provider": Object.freeze({
    platformId: "cross-scenario-learning-platform",
    defaultAppId: "APP-10",
    defaultDomain: "mixed" as const,
  }),
  "executive-inbox-provider": Object.freeze({
    platformId: "executive-inbox-platform",
    defaultAppId: "APP-11",
    defaultDomain: "operational" as const,
  }),
  "ds-platform-provider": Object.freeze({
    platformId: "ds-platform",
    defaultAppId: "DS",
    defaultDomain: "resource" as const,
  }),
  "int-platform-provider": Object.freeze({
    platformId: "int-platform",
    defaultAppId: "INT",
    defaultDomain: "customer" as const,
  }),
});

export const EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noEvaluation: true,
  noRanking: true,
  noOptimization: true,
  noExecution: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  immutableCandidates: true,
  deterministicOnly: true,
  consumerOnly: true,
} as const);
