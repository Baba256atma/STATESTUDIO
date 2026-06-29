/**
 * APP-12:6 — Executive Recommendation Optimization dimension evaluator.
 */

import {
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_LABELS,
} from "./executiveRecommendationOptimizationEngineConstants.ts";
import type {
  OptimizationDimension,
  OptimizationDimensionKey,
  OptimizationImprovementLevel,
  RecommendationOptimizationVariant,
} from "./executiveRecommendationOptimizationEngineTypes.ts";
import type { RecommendationGovernance } from "./executiveRecommendationGovernanceEngineTypes.ts";

function levelFromCondition(improved: boolean, maintained: boolean): OptimizationImprovementLevel {
  if (improved) {
    return "improved";
  }
  if (maintained) {
    return "maintained";
  }
  return "limited";
}

function findGovernanceDimension(governance: RecommendationGovernance, key: string) {
  return governance.dimensions.find((entry) => entry.dimensionKey === key);
}

function evaluateStrategicImprovement(
  governance: RecommendationGovernance,
  variant: RecommendationOptimizationVariant
): OptimizationDimension {
  const strategic = findGovernanceDimension(governance, "strategy_alignment");
  const improved = strategic?.compliance === "compliant";
  const maintained = strategic?.compliance === "partial";
  return Object.freeze({
    dimensionKey: "strategic_improvement" as const,
    label: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_LABELS.strategic_improvement,
    improvementLevel: levelFromCondition(improved, maintained),
    rationale: `Variant ${variant.variantId} proposes strategic refinement while preserving intent.`,
    evidenceIds: Object.freeze([`optimization-strategic-${governance.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateRiskReduction(governance: RecommendationGovernance): OptimizationDimension {
  const risk = findGovernanceDimension(governance, "risk_constraint_compliance");
  const improved = risk?.compliance === "compliant";
  const maintained = risk?.compliance !== "non_compliant";
  return Object.freeze({
    dimensionKey: "risk_reduction" as const,
    label: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_LABELS.risk_reduction,
    improvementLevel: levelFromCondition(improved, maintained),
    rationale: improved
      ? "Risk constraints satisfied; variant proposes lower-risk advisory path."
      : "Risk reduction limited by governance baseline.",
    evidenceIds: Object.freeze([`optimization-risk-${governance.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateResourceEfficiency(governance: RecommendationGovernance): OptimizationDimension {
  const resource = findGovernanceDimension(governance, "resource_constraint_compliance");
  const improved = resource?.compliance === "compliant";
  const maintained = resource?.compliance === "partial";
  return Object.freeze({
    dimensionKey: "resource_efficiency" as const,
    label: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_LABELS.resource_efficiency,
    improvementLevel: levelFromCondition(improved, maintained),
    rationale: "Variant optimizes resource references without exceeding governance limits.",
    evidenceIds: Object.freeze([`optimization-resource-${governance.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateTimelineImprovement(governance: RecommendationGovernance): OptimizationDimension {
  const timeline = findGovernanceDimension(governance, "timeline_constraint_compliance");
  const improved = timeline?.compliance === "compliant";
  const maintained = timeline?.compliance === "partial";
  return Object.freeze({
    dimensionKey: "timeline_improvement" as const,
    label: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_LABELS.timeline_improvement,
    improvementLevel: levelFromCondition(improved, maintained),
    rationale: "Variant aligns timeline dependencies for improved consistency.",
    evidenceIds: Object.freeze([`optimization-timeline-${governance.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateBusinessImpact(governance: RecommendationGovernance): OptimizationDimension {
  const business = findGovernanceDimension(governance, "business_constraint_compliance");
  const improved = business?.compliance === "compliant";
  const maintained = business?.compliance === "partial";
  return Object.freeze({
    dimensionKey: "business_impact" as const,
    label: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_LABELS.business_impact,
    improvementLevel: levelFromCondition(improved, maintained),
    rationale: "Variant maintains business intent with improved context coverage.",
    evidenceIds: Object.freeze([`optimization-business-${governance.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateDependencyOptimization(governance: RecommendationGovernance): OptimizationDimension {
  const dependency = findGovernanceDimension(governance, "dependency_compliance");
  const improved = dependency?.compliance === "compliant";
  const maintained = dependency?.compliance === "partial";
  return Object.freeze({
    dimensionKey: "dependency_optimization" as const,
    label: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_LABELS.dependency_optimization,
    improvementLevel: levelFromCondition(improved, maintained),
    rationale: `Dependency graph (${Object.keys(governance.provenance.dependencyVersions).length} entries) optimized for consistency.`,
    evidenceIds: Object.freeze([`optimization-dependency-${governance.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateConfidenceImprovement(governance: RecommendationGovernance): OptimizationDimension {
  const confidence = findGovernanceDimension(governance, "confidence_availability");
  const improved = confidence?.compliance === "compliant";
  const maintained = confidence?.compliance === "partial";
  return Object.freeze({
    dimensionKey: "confidence_improvement" as const,
    label: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_LABELS.confidence_improvement,
    improvementLevel: levelFromCondition(improved, maintained),
    rationale: "Variant references confidence signals while preserving governance bounds.",
    evidenceIds: Object.freeze([`optimization-confidence-${governance.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateGovernancePreservation(governance: RecommendationGovernance): OptimizationDimension {
  const compliant = governance.summary.overallCompliance !== "non_compliant";
  const allPolicies = governance.policyResults.every((entry) => entry.compliant);
  const improved = compliant && allPolicies;
  const maintained = compliant;
  return Object.freeze({
    dimensionKey: "governance_preservation" as const,
    label: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_LABELS.governance_preservation,
    improvementLevel: levelFromCondition(improved, maintained),
    rationale: "Optimization variant preserves governance compliance; original recommendation not modified.",
    evidenceIds: Object.freeze([`optimization-governance-${governance.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateExplainabilityPreservation(governance: RecommendationGovernance): OptimizationDimension {
  const explainability = findGovernanceDimension(governance, "governance_completeness");
  const improved = explainability?.compliance === "compliant";
  const maintained = explainability?.compliance !== "non_compliant";
  return Object.freeze({
    dimensionKey: "explainability_preservation" as const,
    label: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_LABELS.explainability_preservation,
    improvementLevel: levelFromCondition(improved, maintained),
    rationale: "Variant maintains full explainability trace from APP-12:4 explanation chain.",
    evidenceIds: Object.freeze([`optimization-explainability-${governance.recommendationId}`]),
    readOnly: true as const,
  });
}

function evaluateOverallOptimizationQuality(
  dimensions: readonly OptimizationDimension[],
  recommendationId: string
): OptimizationDimension {
  const improved = dimensions.filter((entry) => entry.improvementLevel === "improved").length;
  const limited = dimensions.filter((entry) => entry.improvementLevel === "limited").length;
  const level: OptimizationImprovementLevel =
    improved >= 5 ? "improved" : limited > 0 ? "maintained" : "improved";
  return Object.freeze({
    dimensionKey: "overall_optimization_quality" as const,
    label: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_LABELS.overall_optimization_quality,
    improvementLevel: level,
    rationale: `Overall optimization: ${improved} improved dimensions, ${limited} limited.`,
    evidenceIds: Object.freeze([`optimization-overall-${recommendationId}`]),
    readOnly: true as const,
  });
}

export function evaluateAllOptimizationDimensions(
  governance: RecommendationGovernance,
  variant: RecommendationOptimizationVariant
): readonly OptimizationDimension[] {
  const base = Object.freeze([
    evaluateStrategicImprovement(governance, variant),
    evaluateRiskReduction(governance),
    evaluateResourceEfficiency(governance),
    evaluateTimelineImprovement(governance),
    evaluateBusinessImpact(governance),
    evaluateDependencyOptimization(governance),
    evaluateConfidenceImprovement(governance),
    evaluateGovernancePreservation(governance),
    evaluateExplainabilityPreservation(governance),
  ]);
  const overall = evaluateOverallOptimizationQuality(base, governance.recommendationId);
  return Object.freeze([...base, overall]);
}

export const ExecutiveRecommendationOptimizationDimensionEvaluator = Object.freeze({
  evaluateAllOptimizationDimensions,
});
