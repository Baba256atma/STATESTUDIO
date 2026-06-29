/**
 * APP-12:6 — Executive Recommendation Optimization Engine domain types.
 */

import type {
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_PIPELINE_STAGES,
} from "./executiveRecommendationOptimizationEngineConstants.ts";
import type { EvaluationId } from "./executiveRecommendationEvaluationEngineTypes.ts";
import type { ExplanationId } from "./executiveRecommendationExplainabilityEngineTypes.ts";
import type { GovernanceId, RecommendationGovernance } from "./executiveRecommendationGovernanceEngineTypes.ts";
import type { RecommendationId, RecommendationWorkspaceId } from "./executiveRecommendationGenerationEngineTypes.ts";

export type OptimizationId = string;
export type VariantId = string;
export type RecommendationOptimizationSessionId = string;
export type RecommendationOptimizationPipelineStage =
  (typeof EXECUTIVE_RECOMMENDATION_OPTIMIZATION_PIPELINE_STAGES)[number];
export type OptimizationDimensionKey = (typeof EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS)[number];
export type OptimizationImprovementLevel = "improved" | "maintained" | "limited";

export type OptimizationEvidence = Readonly<{
  evidenceId: string;
  dimensionKey: OptimizationDimensionKey;
  signal: string;
  rationale: string;
  readOnly: true;
}>;

export type OptimizationDimension = Readonly<{
  dimensionKey: OptimizationDimensionKey;
  label: string;
  improvementLevel: OptimizationImprovementLevel;
  rationale: string;
  evidenceIds: readonly string[];
  readOnly: true;
}>;

export type OptimizationSummary = Readonly<{
  summaryId: string;
  overallImprovementLevel: OptimizationImprovementLevel;
  improvedDimensionCount: number;
  maintainedDimensionCount: number;
  limitedDimensionCount: number;
  narrative: string;
  readOnly: true;
}>;

export type RecommendationOptimizationVariant = Readonly<{
  variantId: VariantId;
  recommendationId: RecommendationId;
  governanceId: GovernanceId;
  intentPreserved: true;
  proposedAdjustments: readonly string[];
  governancePreserved: true;
  readOnly: true;
}>;

export type RecommendationOptimizationProvenance = Readonly<{
  recommendationId: RecommendationId;
  governanceId: GovernanceId;
  evaluationId: EvaluationId;
  explanationId: ExplanationId;
  workspaceId: RecommendationWorkspaceId;
  sourcePlatforms: readonly string[];
  dependencyVersions: Readonly<Record<string, string>>;
  generationVersion: "APP-12/2";
  evaluationVersion: "APP-12/3";
  explanationVersion: "APP-12/4";
  governanceVersion: "APP-12/5";
  optimizationVersion: typeof EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION;
  foundationVersion: "APP-12/1";
  readOnly: true;
}>;

export type OptimizationProfile = Readonly<{
  profileId: string;
  recommendationId: RecommendationId;
  governanceId: GovernanceId;
  variantId: VariantId;
  dimensions: readonly OptimizationDimension[];
  summary: OptimizationSummary;
  readOnly: true;
}>;

export type RecommendationOptimization = Readonly<{
  optimizationId: OptimizationId;
  recommendationId: RecommendationId;
  governanceId: GovernanceId;
  variant: RecommendationOptimizationVariant;
  summary: OptimizationSummary;
  dimensions: readonly OptimizationDimension[];
  improvements: readonly string[];
  optimizationEvidence: readonly OptimizationEvidence[];
  profile: OptimizationProfile;
  provenance: RecommendationOptimizationProvenance;
  optimizationTimestamp: string;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type RecommendationOptimizationValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type RecommendationOptimizationValidation = Readonly<{
  valid: boolean;
  issues: readonly RecommendationOptimizationValidationIssue[];
  readOnly: true;
}>;

export type RecommendationOptimizationResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: RecommendationWorkspaceId;
  sessionId: RecommendationOptimizationSessionId;
  optimizations: readonly RecommendationOptimization[];
  profiles: readonly OptimizationProfile[];
  registeredOptimizationIds: readonly OptimizationId[];
  skippedGovernanceRecords: number;
  pipelineStages: readonly RecommendationOptimizationPipelineStage[];
  optimizationTimestamp: string;
  readOnly: true;
}>;

export type RecommendationOptimizationRegistrySnapshot = Readonly<{
  registryVersion: typeof EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION;
  optimizationCount: number;
  optimizationIds: readonly OptimizationId[];
  readOnly: true;
}>;

export type RecommendationOptimizationEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type RecommendationOptimizationEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: RecommendationOptimizationEngineError | null;
  readOnly: true;
}>;

export type ExecutiveRecommendationOptimizationRequest = Readonly<{
  workspaceId: RecommendationWorkspaceId;
  sessionId: RecommendationOptimizationSessionId;
  sessionLabel: string;
  governanceRecords: readonly RecommendationGovernance[];
  optimizationTimestamp?: string;
}>;

export type ExecutiveRecommendationOptimizationEngineState = Readonly<{
  engineId: "executive-recommendation-optimization-engine";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredOptimizationCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationOptimizationCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationOptimizationCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-12/6";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION;
  checks: readonly ExecutiveRecommendationOptimizationCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export function recommendationOptimizationEngineErrorFromCode(
  code: string,
  message: string,
  field?: string
): RecommendationOptimizationEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export type { RecommendationGovernance, RecommendationId, RecommendationWorkspaceId, GovernanceId, EvaluationId, ExplanationId };
