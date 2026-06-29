/**
 * APP-12:5 — Executive Recommendation Governance profile builder.
 */

import { EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION } from "./executiveRecommendationGovernanceEngineConstants.ts";
import { aggregateGovernanceEvidence } from "./executiveRecommendationGovernanceEvidenceAggregator.ts";
import {
  validateRecommendationConstraints,
  validateRecommendationPolicies,
} from "./executiveRecommendationGovernanceConstraintPolicyValidator.ts";
import { evaluateAllGovernanceDimensions } from "./executiveRecommendationGovernanceDimensionEvaluator.ts";
import type {
  GovernanceCompliance,
  GovernanceDimension,
  GovernanceProfile,
  GovernanceSummary,
  RecommendationGovernance,
  RecommendationGovernanceProvenance,
} from "./executiveRecommendationGovernanceEngineTypes.ts";
import type { RecommendationExplanation } from "./executiveRecommendationExplainabilityEngineTypes.ts";

export function buildGovernanceId(recommendationId: string): string {
  return `recommendation-governance-${recommendationId}`;
}

function countByCompliance(
  dimensions: readonly GovernanceDimension[],
  compliance: GovernanceCompliance
): number {
  return dimensions.filter((entry) => entry.compliance === compliance).length;
}

function deriveOverallCompliance(dimensions: readonly GovernanceDimension[]): GovernanceCompliance {
  const nonCompliant = countByCompliance(dimensions, "non_compliant");
  const partial = countByCompliance(dimensions, "partial");
  if (nonCompliant > 0) {
    return "non_compliant";
  }
  if (partial > 0) {
    return "partial";
  }
  return "compliant";
}

export function buildGovernanceSummary(
  explanation: RecommendationExplanation,
  dimensions: readonly GovernanceDimension[]
): GovernanceSummary {
  const overallCompliance = deriveOverallCompliance(dimensions);
  const compliantCount = countByCompliance(dimensions, "compliant");
  const partialCount = countByCompliance(dimensions, "partial");
  const nonCompliantCount = countByCompliance(dimensions, "non_compliant");

  return Object.freeze({
    summaryId: `governance-summary-${explanation.recommendationId}`,
    overallCompliance,
    compliantDimensionCount: compliantCount,
    partialDimensionCount: partialCount,
    nonCompliantDimensionCount: nonCompliantCount,
    narrative: `Governance validated ${dimensions.length} dimensions: ${compliantCount} compliant, ${partialCount} partial, ${nonCompliantCount} non-compliant. Overall: ${overallCompliance}. Recommendation not modified.`,
    readOnly: true as const,
  });
}

export function buildRecommendationGovernanceProvenance(
  explanation: RecommendationExplanation
): RecommendationGovernanceProvenance {
  return Object.freeze({
    recommendationId: explanation.recommendationId,
    evaluationId: explanation.evaluationId,
    explanationId: explanation.explanationId,
    workspaceId: explanation.provenance.workspaceId,
    sourcePlatforms: explanation.sourcePlatforms,
    dependencyVersions: Object.freeze({
      ...explanation.provenance.dependencyVersions,
      "APP-12/5": "APP-12/5/certified",
    }),
    generationVersion: "APP-12/2" as const,
    evaluationVersion: "APP-12/3" as const,
    explanationVersion: "APP-12/4" as const,
    governanceVersion: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
    engineVersion: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
    foundationVersion: "APP-12/1" as const,
    readOnly: true as const,
  });
}

export function buildGovernanceProfile(
  explanation: RecommendationExplanation,
  dimensions: readonly GovernanceDimension[]
): GovernanceProfile {
  return Object.freeze({
    profileId: `governance-profile-${explanation.recommendationId}`,
    recommendationId: explanation.recommendationId,
    evaluationId: explanation.evaluationId,
    explanationId: explanation.explanationId,
    dimensions,
    summary: buildGovernanceSummary(explanation, dimensions),
    readOnly: true as const,
  });
}

export function buildRecommendationGovernanceFromExplanation(
  explanation: RecommendationExplanation,
  governanceTimestamp: string
): RecommendationGovernance {
  const dimensions = evaluateAllGovernanceDimensions(explanation);
  const constraintResults = validateRecommendationConstraints(explanation, dimensions);
  const policyResults = validateRecommendationPolicies(explanation, dimensions);
  const governanceEvidence = aggregateGovernanceEvidence(explanation, dimensions);
  const profile = buildGovernanceProfile(explanation, dimensions);
  const provenance = buildRecommendationGovernanceProvenance(explanation);
  const governanceId = buildGovernanceId(explanation.recommendationId);

  return Object.freeze({
    governanceId,
    recommendationId: explanation.recommendationId,
    evaluationId: explanation.evaluationId,
    explanationId: explanation.explanationId,
    summary: profile.summary,
    dimensions,
    constraintResults,
    policyResults,
    governanceEvidence,
    profile,
    provenance,
    governanceTimestamp,
    engineVersion: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildRecommendationGovernanceProfilesFromExplanations(
  explanations: readonly RecommendationExplanation[],
  governanceTimestamp: string
): readonly RecommendationGovernance[] {
  return Object.freeze(
    explanations.map((explanation) => buildRecommendationGovernanceFromExplanation(explanation, governanceTimestamp))
  );
}

export const ExecutiveRecommendationGovernanceProfileBuilder = Object.freeze({
  buildRecommendationGovernanceFromExplanation,
  buildRecommendationGovernanceProfilesFromExplanations,
  buildGovernanceProfile,
});
