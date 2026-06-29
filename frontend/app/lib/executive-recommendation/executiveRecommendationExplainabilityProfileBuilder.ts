/**
 * APP-12:4 — Executive Recommendation Explainability profile builder.
 */

import { EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION } from "./executiveRecommendationExplainabilityEngineConstants.ts";
import { aggregateExplanationEvidence } from "./executiveRecommendationExplainabilityEvidenceAggregator.ts";
import { buildAllExplanationSections } from "./executiveRecommendationExplainabilitySectionBuilder.ts";
import type {
  ExplanationSection,
  ExplanationSummary,
  RecommendationExplanation,
  RecommendationExplanationProfile,
  RecommendationExplanationProvenance,
} from "./executiveRecommendationExplainabilityEngineTypes.ts";
import type { RecommendationEvaluation } from "./executiveRecommendationEvaluationEngineTypes.ts";

export function buildExplanationId(recommendationId: string): string {
  return `recommendation-explanation-${recommendationId}`;
}

export function buildExplanationSummary(
  evaluation: RecommendationEvaluation,
  sectionCount: number,
  evidenceCount: number,
  sourcePlatformCount: number
): ExplanationSummary {
  return Object.freeze({
    summaryId: `explanation-summary-${evaluation.recommendationId}`,
    narrative: `Deterministic explanation for recommendation ${evaluation.recommendationId} with ${sectionCount} sections, ${evidenceCount} evidence references, and ${sourcePlatformCount} source platform(s). No black-box output.`,
    sectionCount,
    evidenceCount,
    sourcePlatformCount,
    readOnly: true as const,
  });
}

export function buildRecommendationExplanationProvenance(
  evaluation: RecommendationEvaluation
): RecommendationExplanationProvenance {
  return Object.freeze({
    recommendationId: evaluation.recommendationId,
    evaluationId: evaluation.evaluationId,
    workspaceId: evaluation.provenance.workspaceId,
    sourcePlatforms: evaluation.provenance.originatingPlatforms,
    dependencyVersions: Object.freeze({
      ...evaluation.provenance.dependencyVersions,
      "APP-12/4": "APP-12/4/certified",
    }),
    generationVersion: "APP-12/2" as const,
    evaluationVersion: "APP-12/3" as const,
    explanationVersion: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
    engineVersion: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
    foundationVersion: "APP-12/1" as const,
    readOnly: true as const,
  });
}

export function buildRecommendationExplanationProfile(
  evaluation: RecommendationEvaluation,
  sections: readonly ExplanationSection[]
): RecommendationExplanationProfile {
  const evidenceCount = sections.reduce((count, section) => count + section.evidenceIds.length, 0);
  return Object.freeze({
    profileId: `explanation-profile-${evaluation.recommendationId}`,
    recommendationId: evaluation.recommendationId,
    evaluationId: evaluation.evaluationId,
    sections,
    summary: buildExplanationSummary(
      evaluation,
      sections.length,
      evidenceCount,
      evaluation.provenance.originatingPlatforms.length
    ),
    readOnly: true as const,
  });
}

export function buildRecommendationExplanationFromEvaluation(
  evaluation: RecommendationEvaluation,
  explanationTimestamp: string
): RecommendationExplanation {
  const sections = buildAllExplanationSections(evaluation);
  const evidenceReferences = aggregateExplanationEvidence(evaluation, sections);
  const profile = buildRecommendationExplanationProfile(evaluation, sections);
  const provenance = buildRecommendationExplanationProvenance(evaluation);
  const explanationId = buildExplanationId(evaluation.recommendationId);
  const executiveSummary = sections.find((entry) => entry.sectionKey === "executive_summary")?.content ?? profile.summary.narrative;

  return Object.freeze({
    explanationId,
    recommendationId: evaluation.recommendationId,
    evaluationId: evaluation.evaluationId,
    executiveSummary,
    sections,
    evidenceReferences,
    sourcePlatforms: evaluation.provenance.originatingPlatforms,
    summary: profile.summary,
    profile,
    provenance,
    explanationTimestamp,
    engineVersion: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildRecommendationExplanationsFromEvaluations(
  evaluations: readonly RecommendationEvaluation[],
  explanationTimestamp: string
): readonly RecommendationExplanation[] {
  return Object.freeze(
    evaluations.map((evaluation) => buildRecommendationExplanationFromEvaluation(evaluation, explanationTimestamp))
  );
}

export const ExecutiveRecommendationExplainabilityProfileBuilder = Object.freeze({
  buildRecommendationExplanationFromEvaluation,
  buildRecommendationExplanationsFromEvaluations,
  buildRecommendationExplanationProfile,
});
