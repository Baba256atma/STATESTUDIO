/**
 * APP-12:3 — Executive Recommendation Evaluation Engine constants.
 */

export const EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION = "APP-12/3" as const;
export const EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_ARCHITECTURE_VERSION =
  "APP-12/3-evaluation-engine-arch" as const;
export const EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_OWNER =
  "executive-recommendation-evaluation-engine" as const;

export const EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_TAGS = Object.freeze([
  "[APP12_3]",
  "[RECOMMENDATION_EVALUATION_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_RANKING]",
  "[NO_OPTIMIZATION]",
  "[NO_EXECUTION]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "rankRecommendation",
  "optimizeRecommendation",
  "executeRecommendation",
  "approveRecommendation",
  "workflowEngine",
  "recommendationRanking",
  "recommendationOrdering",
  "compareRecommendations",
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

export const EXECUTIVE_RECOMMENDATION_EVALUATION_PIPELINE_STAGES = Object.freeze([
  "load_recommendation_candidates",
  "validate_dependencies",
  "evaluate_dimensions",
  "aggregate_evaluation_evidence",
  "build_evaluation_profiles",
  "attach_provenance",
  "validate_contracts",
  "register_evaluations",
  "produce_immutable_evaluation_results",
] as const);

export const EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS = Object.freeze([
  "evidence_completeness",
  "provenance_integrity",
  "business_context_coverage",
  "strategy_alignment",
  "risk_awareness",
  "timeline_consistency",
  "confidence_availability",
  "dependency_completeness",
  "explainability_coverage",
  "governance_readiness",
] as const);

export const EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_LABELS: Readonly<
  Record<(typeof EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS)[number], string>
> = Object.freeze({
  evidence_completeness: "Evidence Completeness",
  provenance_integrity: "Provenance Integrity",
  business_context_coverage: "Business Context Coverage",
  strategy_alignment: "Strategy Alignment",
  risk_awareness: "Risk Awareness",
  timeline_consistency: "Timeline Consistency",
  confidence_availability: "Confidence Availability",
  dependency_completeness: "Dependency Completeness",
  explainability_coverage: "Explainability Coverage",
  governance_readiness: "Governance Readiness",
});

export const EXECUTIVE_RECOMMENDATION_EVALUATION_MANDATORY_EVALUATION_FIELDS = Object.freeze([
  "evaluationId",
  "recommendationId",
  "summary",
  "dimensions",
  "supportingEvidence",
  "evaluationNotes",
  "provenance",
  "evaluationTimestamp",
  "engineVersion",
  "version",
  "readOnly",
] as const);

export const EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_LIMITS = Object.freeze({
  maxRegisteredEvaluations: 4096,
  maxCandidatesPerRequest: 4096,
  maxEvaluationNotesLength: 1024,
  maxEvidencePerEvaluation: 16,
  maxDimensionsPerEvaluation: 10,
} as const);

export const EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noRanking: true,
  noOptimization: true,
  noExecution: true,
  noApproval: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  immutableEvaluations: true,
  deterministicOnly: true,
  consumerOnly: true,
  noComparison: true,
} as const);
