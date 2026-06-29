/**
 * APP-12:5 — Executive Recommendation Governance Engine domain types.
 */

import type {
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_CONSTRAINT_KEYS,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_PIPELINE_STAGES,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_POLICY_KEYS,
} from "./executiveRecommendationGovernanceEngineConstants.ts";
import type { EvaluationId } from "./executiveRecommendationEvaluationEngineTypes.ts";
import type { ExplanationId, RecommendationExplanation } from "./executiveRecommendationExplainabilityEngineTypes.ts";
import type { RecommendationId, RecommendationWorkspaceId } from "./executiveRecommendationGenerationEngineTypes.ts";

export type GovernanceId = string;
export type RecommendationGovernanceSessionId = string;
export type RecommendationGovernancePipelineStage =
  (typeof EXECUTIVE_RECOMMENDATION_GOVERNANCE_PIPELINE_STAGES)[number];
export type GovernanceDimensionKey = (typeof EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS)[number];
export type GovernanceConstraintKey = (typeof EXECUTIVE_RECOMMENDATION_GOVERNANCE_CONSTRAINT_KEYS)[number];
export type GovernancePolicyKey = (typeof EXECUTIVE_RECOMMENDATION_GOVERNANCE_POLICY_KEYS)[number];
export type GovernanceCompliance = "compliant" | "partial" | "non_compliant";

export type GovernanceEvidence = Readonly<{
  evidenceId: string;
  dimensionKey: GovernanceDimensionKey;
  signal: string;
  rationale: string;
  readOnly: true;
}>;

export type GovernanceDimension = Readonly<{
  dimensionKey: GovernanceDimensionKey;
  label: string;
  compliance: GovernanceCompliance;
  rationale: string;
  evidenceIds: readonly string[];
  readOnly: true;
}>;

export type RecommendationConstraint = Readonly<{
  constraintId: string;
  constraintKey: GovernanceConstraintKey;
  compliant: boolean;
  rationale: string;
  readOnly: true;
}>;

export type RecommendationPolicy = Readonly<{
  policyId: string;
  policyKey: GovernancePolicyKey;
  compliant: boolean;
  rationale: string;
  readOnly: true;
}>;

export type GovernanceSummary = Readonly<{
  summaryId: string;
  overallCompliance: GovernanceCompliance;
  compliantDimensionCount: number;
  partialDimensionCount: number;
  nonCompliantDimensionCount: number;
  narrative: string;
  readOnly: true;
}>;

export type RecommendationGovernanceProvenance = Readonly<{
  recommendationId: RecommendationId;
  evaluationId: EvaluationId;
  explanationId: ExplanationId;
  workspaceId: RecommendationWorkspaceId;
  sourcePlatforms: readonly string[];
  dependencyVersions: Readonly<Record<string, string>>;
  generationVersion: "APP-12/2";
  evaluationVersion: "APP-12/3";
  explanationVersion: "APP-12/4";
  governanceVersion: typeof EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION;
  foundationVersion: "APP-12/1";
  readOnly: true;
}>;

export type GovernanceProfile = Readonly<{
  profileId: string;
  recommendationId: RecommendationId;
  evaluationId: EvaluationId;
  explanationId: ExplanationId;
  dimensions: readonly GovernanceDimension[];
  summary: GovernanceSummary;
  readOnly: true;
}>;

export type RecommendationGovernance = Readonly<{
  governanceId: GovernanceId;
  recommendationId: RecommendationId;
  evaluationId: EvaluationId;
  explanationId: ExplanationId;
  summary: GovernanceSummary;
  dimensions: readonly GovernanceDimension[];
  constraintResults: readonly RecommendationConstraint[];
  policyResults: readonly RecommendationPolicy[];
  governanceEvidence: readonly GovernanceEvidence[];
  profile: GovernanceProfile;
  provenance: RecommendationGovernanceProvenance;
  governanceTimestamp: string;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type RecommendationGovernanceValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type RecommendationGovernanceValidation = Readonly<{
  valid: boolean;
  issues: readonly RecommendationGovernanceValidationIssue[];
  readOnly: true;
}>;

export type RecommendationGovernanceResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: RecommendationWorkspaceId;
  sessionId: RecommendationGovernanceSessionId;
  governanceRecords: readonly RecommendationGovernance[];
  profiles: readonly GovernanceProfile[];
  registeredGovernanceIds: readonly GovernanceId[];
  skippedExplanations: number;
  pipelineStages: readonly RecommendationGovernancePipelineStage[];
  governanceTimestamp: string;
  readOnly: true;
}>;

export type RecommendationGovernanceRegistrySnapshot = Readonly<{
  registryVersion: typeof EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION;
  governanceCount: number;
  governanceIds: readonly GovernanceId[];
  readOnly: true;
}>;

export type RecommendationGovernanceEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type RecommendationGovernanceEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: RecommendationGovernanceEngineError | null;
  readOnly: true;
}>;

export type ExecutiveRecommendationGovernanceRequest = Readonly<{
  workspaceId: RecommendationWorkspaceId;
  sessionId: RecommendationGovernanceSessionId;
  sessionLabel: string;
  explanations: readonly RecommendationExplanation[];
  governanceTimestamp?: string;
}>;

export type ExecutiveRecommendationGovernanceEngineState = Readonly<{
  engineId: "executive-recommendation-governance-engine";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredGovernanceCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationGovernanceCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationGovernanceCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-12/5";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION;
  checks: readonly ExecutiveRecommendationGovernanceCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export function recommendationGovernanceEngineErrorFromCode(
  code: string,
  message: string,
  field?: string
): RecommendationGovernanceEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export type { RecommendationExplanation, RecommendationId, RecommendationWorkspaceId, EvaluationId, ExplanationId };
