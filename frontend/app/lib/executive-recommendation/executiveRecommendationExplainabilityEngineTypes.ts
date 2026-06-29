/**
 * APP-12:4 — Executive Recommendation Explainability Engine domain types.
 */

import type {
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_PIPELINE_STAGES,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS,
} from "./executiveRecommendationExplainabilityEngineConstants.ts";
import type { EvaluationId, RecommendationEvaluation } from "./executiveRecommendationEvaluationEngineTypes.ts";
import type { RecommendationId, RecommendationWorkspaceId } from "./executiveRecommendationGenerationEngineTypes.ts";

export type ExplanationId = string;
export type RecommendationExplainabilitySessionId = string;
export type RecommendationExplainabilityPipelineStage =
  (typeof EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_PIPELINE_STAGES)[number];
export type ExplanationSectionKey = (typeof EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS)[number];

export type ExplanationEvidence = Readonly<{
  evidenceId: string;
  sectionKey: ExplanationSectionKey;
  signal: string;
  rationale: string;
  sourcePlatform: string;
  readOnly: true;
}>;

export type ExplanationSection = Readonly<{
  sectionKey: ExplanationSectionKey;
  label: string;
  content: string;
  evidenceIds: readonly string[];
  readOnly: true;
}>;

export type ExplanationSummary = Readonly<{
  summaryId: string;
  narrative: string;
  sectionCount: number;
  evidenceCount: number;
  sourcePlatformCount: number;
  readOnly: true;
}>;

export type RecommendationExplanationProvenance = Readonly<{
  recommendationId: RecommendationId;
  evaluationId: EvaluationId;
  workspaceId: RecommendationWorkspaceId;
  sourcePlatforms: readonly string[];
  dependencyVersions: Readonly<Record<string, string>>;
  generationVersion: "APP-12/2";
  evaluationVersion: "APP-12/3";
  explanationVersion: typeof EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION;
  foundationVersion: "APP-12/1";
  readOnly: true;
}>;

export type RecommendationExplanationProfile = Readonly<{
  profileId: string;
  recommendationId: RecommendationId;
  evaluationId: EvaluationId;
  sections: readonly ExplanationSection[];
  summary: ExplanationSummary;
  readOnly: true;
}>;

export type RecommendationExplanation = Readonly<{
  explanationId: ExplanationId;
  recommendationId: RecommendationId;
  evaluationId: EvaluationId;
  executiveSummary: string;
  sections: readonly ExplanationSection[];
  evidenceReferences: readonly ExplanationEvidence[];
  sourcePlatforms: readonly string[];
  summary: ExplanationSummary;
  profile: RecommendationExplanationProfile;
  provenance: RecommendationExplanationProvenance;
  explanationTimestamp: string;
  engineVersion: typeof EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExplanationValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExplanationValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExplanationValidationIssue[];
  readOnly: true;
}>;

export type ExplanationResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: RecommendationWorkspaceId;
  sessionId: RecommendationExplainabilitySessionId;
  explanations: readonly RecommendationExplanation[];
  profiles: readonly RecommendationExplanationProfile[];
  registeredExplanationIds: readonly ExplanationId[];
  skippedEvaluations: number;
  pipelineStages: readonly RecommendationExplainabilityPipelineStage[];
  explanationTimestamp: string;
  readOnly: true;
}>;

export type RecommendationExplanationRegistrySnapshot = Readonly<{
  registryVersion: typeof EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION;
  explanationCount: number;
  explanationIds: readonly ExplanationId[];
  readOnly: true;
}>;

export type RecommendationExplainabilityEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type RecommendationExplainabilityEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: RecommendationExplainabilityEngineError | null;
  readOnly: true;
}>;

export type ExecutiveRecommendationExplainabilityRequest = Readonly<{
  workspaceId: RecommendationWorkspaceId;
  sessionId: RecommendationExplainabilitySessionId;
  sessionLabel: string;
  evaluations: readonly RecommendationEvaluation[];
  explanationTimestamp?: string;
}>;

export type ExecutiveRecommendationExplainabilityEngineState = Readonly<{
  engineId: "executive-recommendation-explainability-engine";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredExplanationCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationExplainabilityCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationExplainabilityCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-12/4";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION;
  checks: readonly ExecutiveRecommendationExplainabilityCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export function recommendationExplainabilityEngineErrorFromCode(
  code: string,
  message: string,
  field?: string
): RecommendationExplainabilityEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export type { RecommendationEvaluation, RecommendationId, RecommendationWorkspaceId, EvaluationId };
