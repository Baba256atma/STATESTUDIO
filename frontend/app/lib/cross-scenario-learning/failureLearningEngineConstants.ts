/**
 * APP-10:5 — Failure Learning Engine constants.
 */

import type { FailureCategory, FailureFactorKey } from "./failureLearningEngineTypes.ts";

export const FAILURE_LEARNING_ENGINE_CONTRACT_VERSION = "APP-10/5" as const;
export const FAILURE_LEARNING_ENGINE_ARCHITECTURE_VERSION = "APP-10/5-failure-learning-arch" as const;
export const FAILURE_LEARNING_ENGINE_OWNER = "failure-learning-engine" as const;

export const FAILURE_LEARNING_ENGINE_TAGS = Object.freeze([
  "[APP10_5]",
  "[FAILURE_LEARNING_ENGINE]",
  "[DETERMINISTIC]",
  "[HISTORICAL_EVIDENCE]",
  "[NO_PREDICTION]",
  "[NO_MITIGATION]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const FAILURE_LEARNING_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "recommendationEngine",
  "forecast(",
  "predict(",
  "openai",
  "prompt(",
  "strategyLearning",
  "mitigationAdvice",
  "executiveCoaching",
] as const);

export const FAILURE_CATEGORY_KEYS = Object.freeze([
  "strategic_failure",
  "operational_failure",
  "financial_failure",
  "resource_failure",
  "execution_failure",
  "timeline_failure",
  "risk_escalation",
  "dependency_failure",
  "mixed_failure",
] as const satisfies readonly FailureCategory[]);

export const FAILURE_CATEGORY_LABELS: Readonly<Record<FailureCategory, string>> = Object.freeze({
  strategic_failure: "Strategic Failure",
  operational_failure: "Operational Failure",
  financial_failure: "Financial Failure",
  resource_failure: "Resource Failure",
  execution_failure: "Execution Failure",
  timeline_failure: "Timeline Failure",
  risk_escalation: "Risk Escalation",
  dependency_failure: "Dependency Failure",
  mixed_failure: "Mixed Failure",
});

export const FAILURE_FACTOR_KEYS = Object.freeze([
  "insufficient_resources",
  "execution_delays",
  "incorrect_assumptions",
  "dependency_conflicts",
  "kpi_deterioration",
  "unmanaged_risks",
  "external_constraints",
  "stakeholder_issues",
] as const satisfies readonly FailureFactorKey[]);

export const FAILURE_FACTOR_LABELS: Readonly<Record<FailureFactorKey, string>> = Object.freeze({
  insufficient_resources: "Insufficient Resources",
  execution_delays: "Execution Delays",
  incorrect_assumptions: "Incorrect Assumptions",
  dependency_conflicts: "Dependency Conflicts",
  kpi_deterioration: "KPI Deterioration",
  unmanaged_risks: "Unmanaged Risks",
  external_constraints: "External Constraints",
  stakeholder_issues: "Stakeholder Issues",
});

export const FAILURE_LEARNING_PIPELINE_STAGES = Object.freeze([
  "load_certified_historical_records",
  "validate_dependencies",
  "normalize_failure_records",
  "aggregate_evidence",
  "build_failure_profiles",
  "attach_provenance",
  "validate_contracts",
  "register_failures",
  "produce_immutable_learning_results",
] as const);

export const FAILURE_LEARNING_MANDATORY_PROFILE_FIELDS = Object.freeze([
  "failureId",
  "relatedPatternIds",
  "relatedScenarioIds",
  "relatedOutcomeIds",
  "businessGoal",
  "failureCategory",
  "failureFactors",
  "kpiImpactSummary",
  "riskImpactSummary",
  "evidenceCount",
  "provenance",
  "engineVersion",
  "learningTimestamp",
  "version",
  "readOnly",
] as const);

export const FAILURE_LEARNING_ENGINE_LIMITS = Object.freeze({
  maxRegisteredFailures: 4096,
  maxHistoricalRecords: 4096,
  maxEvidencePerFailure: 256,
  maxRelatedPatternIds: 32,
  maxRelatedScenarioIds: 256,
  maxRelatedOutcomeIds: 64,
  maxFailureFactors: 16,
  maxFailureCauses: 16,
} as const);

export const FAILURE_LEARNING_CERTIFIED_SOURCES = Object.freeze([
  "APP-5",
  "APP-6",
  "APP-7",
  "APP-8",
  "APP-9",
  "APP-10/2",
  "APP-10/3",
  "APP-10/4",
] as const);

export const FAILURE_LEARNING_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noMachineLearning: true,
  noForecasting: true,
  noRecommendationEngine: true,
  noMitigationAdvice: true,
  noExecutiveCoaching: true,
  noConfidenceRanking: true,
  historicalEvidenceOnly: true,
  deterministicOnly: true,
  consumerOnly: true,
} as const);

export const FAILURE_LEARNING_CERTIFIED_DEPENDENCIES = Object.freeze([
  Object.freeze({ phaseId: "APP-10/1", label: "Cross-Scenario Learning Foundation", required: true as const }),
  Object.freeze({ phaseId: "APP-10/2", label: "Pattern Extraction Engine", required: true as const }),
  Object.freeze({ phaseId: "APP-10/3", label: "Similarity Engine", required: true as const }),
  Object.freeze({ phaseId: "APP-10/4", label: "Outcome Learning Engine", required: true as const }),
] as const);
