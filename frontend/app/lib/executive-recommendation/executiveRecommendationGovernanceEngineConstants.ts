/**
 * APP-12:5 — Executive Recommendation Governance Engine constants.
 */

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION = "APP-12/5" as const;
export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_ARCHITECTURE_VERSION =
  "APP-12/5-governance-engine-arch" as const;
export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_OWNER =
  "executive-recommendation-governance-engine" as const;

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_TAGS = Object.freeze([
  "[APP12_5]",
  "[RECOMMENDATION_GOVERNANCE_ENGINE]",
  "[DETERMINISTIC]",
  "[NO_GENERATION]",
  "[NO_EVALUATION]",
  "[NO_OPTIMIZATION]",
  "[NO_APPROVAL]",
  "[NO_EXECUTION]",
  "[CONSUMER_ONLY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "generateExecutiveRecommendations",
  "evaluateExecutiveRecommendations",
  "explainExecutiveRecommendations",
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

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_PIPELINE_STAGES = Object.freeze([
  "load_recommendation_explanations",
  "validate_dependencies",
  "evaluate_governance_dimensions",
  "validate_constraints_and_policies",
  "aggregate_governance_evidence",
  "build_governance_profiles",
  "attach_provenance",
  "validate_contracts",
  "register_governance_records",
  "produce_immutable_governance_results",
] as const);

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS = Object.freeze([
  "executive_policy_compliance",
  "strategic_alignment",
  "risk_constraint_compliance",
  "timeline_constraint_compliance",
  "business_constraint_compliance",
  "resource_constraint_compliance",
  "dependency_compliance",
  "workspace_governance",
  "provenance_integrity",
  "governance_completeness",
] as const);

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_LABELS: Readonly<
  Record<(typeof EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS)[number], string>
> = Object.freeze({
  executive_policy_compliance: "Executive Policy Compliance",
  strategic_alignment: "Strategic Alignment",
  risk_constraint_compliance: "Risk Constraint Compliance",
  timeline_constraint_compliance: "Timeline Constraint Compliance",
  business_constraint_compliance: "Business Constraint Compliance",
  resource_constraint_compliance: "Resource Constraint Compliance",
  dependency_compliance: "Dependency Compliance",
  workspace_governance: "Workspace Governance",
  provenance_integrity: "Provenance Integrity",
  governance_completeness: "Governance Completeness",
});

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_CONSTRAINT_KEYS = Object.freeze([
  "risk_limit",
  "timeline_limit",
  "business_boundary",
  "resource_boundary",
] as const);

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_POLICY_KEYS = Object.freeze([
  "executive_policy",
  "workspace_policy",
  "dependency_policy",
  "provenance_policy",
] as const);

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_MANDATORY_GOVERNANCE_FIELDS = Object.freeze([
  "governanceId",
  "recommendationId",
  "evaluationId",
  "explanationId",
  "summary",
  "dimensions",
  "constraintResults",
  "policyResults",
  "governanceEvidence",
  "profile",
  "provenance",
  "governanceTimestamp",
  "engineVersion",
  "version",
  "readOnly",
] as const);

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_LIMITS = Object.freeze({
  maxRegisteredGovernanceRecords: 4096,
  maxExplanationsPerRequest: 4096,
  maxDimensionsPerGovernance: 10,
  maxConstraintsPerGovernance: 4,
  maxPoliciesPerGovernance: 4,
  maxEvidencePerGovernance: 24,
} as const);

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noGeneration: true,
  noEvaluation: true,
  noExplainability: true,
  noRanking: true,
  noOptimization: true,
  noExecution: true,
  noApproval: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  noModification: true,
  immutableGovernance: true,
  deterministicOnly: true,
  consumerOnly: true,
  noComparison: true,
} as const);
