/**
 * APP-12:6 — Executive Recommendation Optimization Engine constants.
 */

export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION = "APP-12/6" as const;
export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_ARCHITECTURE_VERSION =
  "APP-12/6-optimization-engine-arch" as const;
export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_OWNER =
  "executive-recommendation-optimization-engine" as const;

export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_TAGS = Object.freeze([
  "[APP12_6]",
  "[RECOMMENDATION_OPTIMIZATION_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_EXECUTION]",
  "[NO_APPROVAL]",
  "[NO_MUTATION]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "generateExecutiveRecommendations",
  "evaluateExecutiveRecommendations",
  "explainExecutiveRecommendations",
  "validateExecutiveRecommendationGovernance",
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
  "llm",
  "predict(",
  "forecast(",
  "autonomousDecision",
] as const);

export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_PIPELINE_STAGES = Object.freeze([
  "load_governance_compliant_recommendations",
  "validate_dependencies",
  "generate_optimization_variants",
  "evaluate_optimization_dimensions",
  "aggregate_optimization_evidence",
  "build_optimization_profiles",
  "attach_provenance",
  "validate_contracts",
  "register_optimization_results",
  "produce_immutable_optimization_results",
] as const);

export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS = Object.freeze([
  "strategic_improvement",
  "risk_reduction",
  "resource_efficiency",
  "timeline_improvement",
  "business_impact",
  "dependency_optimization",
  "confidence_improvement",
  "governance_preservation",
  "explainability_preservation",
  "overall_optimization_quality",
] as const);

export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_LABELS: Readonly<
  Record<(typeof EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS)[number], string>
> = Object.freeze({
  strategic_improvement: "Strategic Improvement",
  risk_reduction: "Risk Reduction",
  resource_efficiency: "Resource Efficiency",
  timeline_improvement: "Timeline Improvement",
  business_impact: "Business Impact",
  dependency_optimization: "Dependency Optimization",
  confidence_improvement: "Confidence Improvement",
  governance_preservation: "Governance Preservation",
  explainability_preservation: "Explainability Preservation",
  overall_optimization_quality: "Overall Optimization Quality",
});

export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_MANDATORY_OPTIMIZATION_FIELDS = Object.freeze([
  "optimizationId",
  "recommendationId",
  "governanceId",
  "variant",
  "summary",
  "dimensions",
  "improvements",
  "optimizationEvidence",
  "profile",
  "provenance",
  "optimizationTimestamp",
  "engineVersion",
  "version",
  "readOnly",
] as const);

export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_LIMITS = Object.freeze({
  maxRegisteredOptimizations: 4096,
  maxGovernanceRecordsPerRequest: 4096,
  maxDimensionsPerOptimization: 10,
  maxImprovementsPerOptimization: 10,
  maxEvidencePerOptimization: 16,
} as const);

export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noGeneration: true,
  noEvaluation: true,
  noExplainability: true,
  noGovernanceMutation: true,
  noExecution: true,
  noApproval: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  noOriginalMutation: true,
  immutableOptimizations: true,
  deterministicOnly: true,
  consumerOnly: true,
  noComparison: true,
} as const);
