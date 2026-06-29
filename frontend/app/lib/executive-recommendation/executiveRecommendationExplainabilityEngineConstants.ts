/**
 * APP-12:4 — Executive Recommendation Explainability Engine constants.
 */

export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION = "APP-12/4" as const;
export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_ARCHITECTURE_VERSION =
  "APP-12/4-explainability-engine-arch" as const;
export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_OWNER =
  "executive-recommendation-explainability-engine" as const;

export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_TAGS = Object.freeze([
  "[APP12_4]",
  "[RECOMMENDATION_EXPLAINABILITY_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_GENERATION]",
  "[NO_EVALUATION]",
  "[NO_RANKING]",
  "[NO_EXECUTION]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "generateExecutiveRecommendations",
  "evaluateExecutiveRecommendations",
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
  "llm",
  "predict(",
  "forecast(",
  "autonomousDecision",
] as const);

export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_PIPELINE_STAGES = Object.freeze([
  "load_evaluated_recommendations",
  "validate_dependencies",
  "build_explanation_sections",
  "aggregate_explanation_evidence",
  "build_explanation_profiles",
  "attach_provenance",
  "validate_contracts",
  "register_explanations",
  "produce_immutable_explanation_results",
] as const);

export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS = Object.freeze([
  "executive_summary",
  "business_context",
  "supporting_evidence",
  "strategy_rationale",
  "risk_considerations",
  "timeline_context",
  "historical_learning_references",
  "confidence_context",
  "dependency_summary",
  "provenance_summary",
] as const);

export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_LABELS: Readonly<
  Record<(typeof EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS)[number], string>
> = Object.freeze({
  executive_summary: "Executive Summary",
  business_context: "Business Context",
  supporting_evidence: "Supporting Evidence",
  strategy_rationale: "Strategy Rationale",
  risk_considerations: "Risk Considerations",
  timeline_context: "Timeline Context",
  historical_learning_references: "Historical Learning References",
  confidence_context: "Confidence Context",
  dependency_summary: "Dependency Summary",
  provenance_summary: "Provenance Summary",
});

export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_MANDATORY_EXPLANATION_FIELDS = Object.freeze([
  "explanationId",
  "recommendationId",
  "evaluationId",
  "executiveSummary",
  "sections",
  "evidenceReferences",
  "sourcePlatforms",
  "summary",
  "profile",
  "provenance",
  "explanationTimestamp",
  "engineVersion",
  "version",
  "readOnly",
] as const);

export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_LIMITS = Object.freeze({
  maxRegisteredExplanations: 4096,
  maxEvaluationsPerRequest: 4096,
  maxSectionsPerExplanation: 10,
  maxEvidencePerExplanation: 20,
  maxContentLength: 2048,
} as const);

export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noGeneration: true,
  noEvaluation: true,
  noRanking: true,
  noOptimization: true,
  noExecution: true,
  noApproval: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  noLlmReasoning: true,
  immutableExplanations: true,
  deterministicOnly: true,
  consumerOnly: true,
  noComparison: true,
} as const);
