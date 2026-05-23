import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  FeedbackClassificationCategory,
  FeedbackPriorityAssessment,
  LearningPattern,
  ProductImprovementRecommendation,
} from "./executiveFeedbackTypes.ts";

const areaByCategory: Record<FeedbackClassificationCategory, ProductImprovementRecommendation["area"]> = {
  product: "intelligence_improvement",
  UX: "UX_improvement",
  workflow: "workflow_improvement",
  trust: "trust_improvement",
  simulation: "intelligence_improvement",
  dashboard: "UX_improvement",
  onboarding: "onboarding_improvement",
  operational_intelligence: "intelligence_improvement",
  recommendation_quality: "trust_improvement",
};

export function generateProductImprovementRecommendations(
  patterns: readonly LearningPattern[],
  priorities: readonly FeedbackPriorityAssessment[]
): readonly ProductImprovementRecommendation[] {
  const recommendations: ProductImprovementRecommendation[] = patterns.slice(0, 6).map((pattern) => {
    const score = priorities.find((priority) => priority.frequency === pattern.occurrenceCount)?.score ?? pattern.confidence;
    const area = areaByCategory[pattern.category];
    const summary =
      pattern.type === "recurring_friction"
        ? `Reduce friction in ${pattern.label}.`
        : pattern.type === "recurring_request"
          ? `Evaluate requested capability around ${pattern.label}.`
          : pattern.type === "trusted_capability"
            ? `Protect and highlight trusted capability ${pattern.label}.`
            : `Review ${pattern.label} for product learning.`;

    return {
      recommendationId: stableSignature(["d10-product-improvement", pattern.patternId, area]).slice(0, 56),
      area,
      priorityScore: Math.max(0, Math.min(1, Number(score.toFixed(4)))),
      summary,
      rationale: `Derived from ${pattern.occurrenceCount} feedback occurrence(s) classified as ${pattern.category}.`,
      advisoryOnly: true as const,
      signature: stableSignature(["d10-product-improvement", pattern.signature, area, score]),
    };
  });

  if (recommendations.length === 0) {
    return Object.freeze([
      {
        recommendationId: stableSignature(["d10-product-improvement", "collect-feedback"]).slice(0, 56),
        area: "onboarding_improvement",
        priorityScore: 0.42,
        summary: "Collect structured feedback after the next pilot session.",
        rationale: "No confirmed feedback pattern is available yet.",
        advisoryOnly: true,
        signature: stableSignature(["d10-product-improvement", "collect-feedback", 0.42]),
      },
    ]);
  }

  return Object.freeze(recommendations.sort((a, b) => b.priorityScore - a.priorityScore || a.recommendationId.localeCompare(b.recommendationId)));
}
