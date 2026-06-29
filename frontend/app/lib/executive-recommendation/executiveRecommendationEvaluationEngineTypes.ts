/**
 * APP-12:3 — Executive Recommendation Evaluation Engine domain types.
 */

import type {
  EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_EVALUATION_PIPELINE_STAGES,
} from "./executiveRecommendationEvaluationEngineConstants.ts";
import type {
  ExecutiveRecommendation,
  RecommendationCandidate,
  RecommendationId,
  RecommendationWorkspaceId,
} from "./executiveRecommendationGenerationEngineTypes.ts";

export type EvaluationId = string;
export type RecommendationEvaluationSessionId = string;
export type RecommendationEvaluationPipelineStage =
  (typeof EXECUTIVE_RECOMMENDATION_EVALUATION_PIPELINE_STAGES)[number];
export type EvaluationDimensionKey = (typeof EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS)[number];
export type EvaluationReadiness = "complete" | "partial" | "insufficient";

export type EvaluationEvidence = Readonly<{
  evidenceId: string;
  dimensionKey: EvaluationDimensionKey;
  signal: string;
  rationale: string;
  readOnly: true;
}>;

export type EvaluationDimension = Readonly<{
  dimensionKey: EvaluationDimensionKey;
  label: string;
  readiness: EvaluationReadiness;
  rationale: string;
  evidenceIds: readonly string[];
  readOnly: true;
}>;

export type EvaluationSummary = Readonly<{
  summaryId: string;
  overallReadiness: EvaluationReadiness;
  completeDimensionCount: number;
  partialDimensionCount: number;
  insufficientDimensionCount: number;
  narrative: string;
  readOnly: true;
}>;

export type RecommendationEvaluationProvenance = Readonly<{
  recommendationId: RecommendationId;
  originatingPlatforms: readonly string[];
  workspaceId: RecommendationWorkspaceId;
  dependencyVersions: Readonly<Record<string, string>>;
  generationVersion: "APP-12/2";
  evaluationVersion: typeof EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION;
  foundationVersion: "APP-12/1";
  readOnly: true;
}>;

export type RecommendationEvaluationProfile = Readonly<{
  profileId: string;
  recommendationId: RecommendationId;
  dimensions: readonly EvaluationDimension[];
  summary: EvaluationSummary;
  readOnly: true;
}>;

export type RecommendationEvaluation = Readonly<{
  evaluationId: EvaluationId;
  recommendationId: RecommendationId;
  summary: EvaluationSummary;
  dimensions: readonly EvaluationDimension[];
  supportingEvidence: readonly EvaluationEvidence[];
  evaluationNotes: readonly string[];
  profile: RecommendationEvaluationProfile;
  provenance: RecommendationEvaluationProvenance;
  evaluationTimestamp: string;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type RecommendationEvaluationValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type RecommendationEvaluationValidation = Readonly<{
  valid: boolean;
  issues: readonly RecommendationEvaluationValidationIssue[];
  readOnly: true;
}>;

export type RecommendationEvaluationResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: RecommendationWorkspaceId;
  sessionId: RecommendationEvaluationSessionId;
  evaluations: readonly RecommendationEvaluation[];
  profiles: readonly RecommendationEvaluationProfile[];
  registeredEvaluationIds: readonly EvaluationId[];
  skippedCandidates: number;
  pipelineStages: readonly RecommendationEvaluationPipelineStage[];
  evaluationTimestamp: string;
  readOnly: true;
}>;

export type RecommendationEvaluationRegistrySnapshot = Readonly<{
  registryVersion: typeof EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION;
  evaluationCount: number;
  evaluationIds: readonly EvaluationId[];
  readOnly: true;
}>;

export type RecommendationEvaluationEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type RecommendationEvaluationEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: RecommendationEvaluationEngineError | null;
  readOnly: true;
}>;

export type ExecutiveRecommendationEvaluationRequest = Readonly<{
  workspaceId: RecommendationWorkspaceId;
  sessionId: RecommendationEvaluationSessionId;
  sessionLabel: string;
  candidates: readonly RecommendationCandidate[];
  evaluationTimestamp?: string;
}>;

export type ExecutiveRecommendationEvaluationEngineState = Readonly<{
  engineId: "executive-recommendation-evaluation-engine";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredEvaluationCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationEvaluationCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationEvaluationCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-12/3";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION;
  checks: readonly ExecutiveRecommendationEvaluationCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export function recommendationEvaluationEngineErrorFromCode(
  code: string,
  message: string,
  field?: string
): RecommendationEvaluationEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export type { ExecutiveRecommendation, RecommendationCandidate, RecommendationId, RecommendationWorkspaceId };
