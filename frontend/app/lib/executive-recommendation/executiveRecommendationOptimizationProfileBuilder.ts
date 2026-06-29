/**
 * APP-12:6 — Executive Recommendation Optimization profile builder.
 */

import { EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION } from "./executiveRecommendationOptimizationEngineConstants.ts";
import { aggregateOptimizationEvidence } from "./executiveRecommendationOptimizationEvidenceAggregator.ts";
import { evaluateAllOptimizationDimensions } from "./executiveRecommendationOptimizationDimensionEvaluator.ts";
import { buildOptimizationVariant } from "./executiveRecommendationOptimizationVariantBuilder.ts";
import type {
  OptimizationDimension,
  OptimizationImprovementLevel,
  OptimizationProfile,
  OptimizationSummary,
  RecommendationOptimization,
  RecommendationOptimizationProvenance,
  RecommendationOptimizationVariant,
} from "./executiveRecommendationOptimizationEngineTypes.ts";
import type { RecommendationGovernance } from "./executiveRecommendationGovernanceEngineTypes.ts";

export function buildOptimizationId(recommendationId: string): string {
  return `recommendation-optimization-${recommendationId}`;
}

function countByLevel(
  dimensions: readonly OptimizationDimension[],
  level: OptimizationImprovementLevel
): number {
  return dimensions.filter((entry) => entry.improvementLevel === level).length;
}

function deriveOverallLevel(dimensions: readonly OptimizationDimension[]): OptimizationImprovementLevel {
  const limited = countByLevel(dimensions, "limited");
  const improved = countByLevel(dimensions, "improved");
  if (limited > 2) {
    return "limited";
  }
  if (improved >= 5) {
    return "improved";
  }
  return "maintained";
}

export function buildOptimizationSummary(
  governance: RecommendationGovernance,
  dimensions: readonly OptimizationDimension[]
): OptimizationSummary {
  const overallImprovementLevel = deriveOverallLevel(dimensions);
  return Object.freeze({
    summaryId: `optimization-summary-${governance.recommendationId}`,
    overallImprovementLevel,
    improvedDimensionCount: countByLevel(dimensions, "improved"),
    maintainedDimensionCount: countByLevel(dimensions, "maintained"),
    limitedDimensionCount: countByLevel(dimensions, "limited"),
    narrative: `Deterministic optimization variant for ${governance.recommendationId}. Original recommendation preserved. Overall improvement: ${overallImprovementLevel}.`,
    readOnly: true as const,
  });
}

export function buildImprovementList(
  dimensions: readonly OptimizationDimension[],
  variant: RecommendationOptimizationVariant
): readonly string[] {
  const improvements = [
    `Optimization variant ${variant.variantId} preserves recommendation intent.`,
    ...variant.proposedAdjustments,
  ];
  for (const dimension of dimensions.filter((entry) => entry.improvementLevel === "improved")) {
    improvements.push(`${dimension.label}: ${dimension.rationale}`);
  }
  return Object.freeze(improvements);
}

export function buildRecommendationOptimizationProvenance(
  governance: RecommendationGovernance
): RecommendationOptimizationProvenance {
  return Object.freeze({
    recommendationId: governance.recommendationId,
    governanceId: governance.governanceId,
    evaluationId: governance.evaluationId,
    explanationId: governance.explanationId,
    workspaceId: governance.provenance.workspaceId,
    sourcePlatforms: governance.provenance.sourcePlatforms,
    dependencyVersions: Object.freeze({
      ...governance.provenance.dependencyVersions,
      "APP-12/6": "APP-12/6/certified",
    }),
    generationVersion: "APP-12/2" as const,
    evaluationVersion: "APP-12/3" as const,
    explanationVersion: "APP-12/4" as const,
    governanceVersion: "APP-12/5" as const,
    optimizationVersion: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
    engineVersion: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
    foundationVersion: "APP-12/1" as const,
    readOnly: true as const,
  });
}

export function buildOptimizationProfile(
  governance: RecommendationGovernance,
  variant: RecommendationOptimizationVariant,
  dimensions: readonly OptimizationDimension[]
): OptimizationProfile {
  return Object.freeze({
    profileId: `optimization-profile-${governance.recommendationId}`,
    recommendationId: governance.recommendationId,
    governanceId: governance.governanceId,
    variantId: variant.variantId,
    dimensions,
    summary: buildOptimizationSummary(governance, dimensions),
    readOnly: true as const,
  });
}

export function buildRecommendationOptimizationFromGovernance(
  governance: RecommendationGovernance,
  optimizationTimestamp: string
): RecommendationOptimization {
  const variant = buildOptimizationVariant(governance);
  const dimensions = evaluateAllOptimizationDimensions(governance, variant);
  const optimizationEvidence = aggregateOptimizationEvidence(governance, dimensions);
  const profile = buildOptimizationProfile(governance, variant, dimensions);
  const provenance = buildRecommendationOptimizationProvenance(governance);
  const optimizationId = buildOptimizationId(governance.recommendationId);

  return Object.freeze({
    optimizationId,
    recommendationId: governance.recommendationId,
    governanceId: governance.governanceId,
    variant,
    summary: profile.summary,
    dimensions,
    improvements: buildImprovementList(dimensions, variant),
    optimizationEvidence,
    profile,
    provenance,
    optimizationTimestamp,
    engineVersion: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildRecommendationOptimizationsFromGovernanceRecords(
  governanceRecords: readonly RecommendationGovernance[],
  optimizationTimestamp: string
): readonly RecommendationOptimization[] {
  return Object.freeze(
    governanceRecords
      .filter((entry) => entry.summary.overallCompliance !== "non_compliant")
      .map((entry) => buildRecommendationOptimizationFromGovernance(entry, optimizationTimestamp))
  );
}

export const ExecutiveRecommendationOptimizationProfileBuilder = Object.freeze({
  buildRecommendationOptimizationFromGovernance,
  buildRecommendationOptimizationsFromGovernanceRecords,
  buildOptimizationProfile,
});
