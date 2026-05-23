import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  LearningGovernanceClassification,
  LearningGovernanceSeverity,
  ProductImprovementRecommendation,
} from "./executiveFeedbackTypes.ts";

function severityFor(score: number): LearningGovernanceSeverity {
  if (score >= 0.86) return "strategic_priority";
  if (score >= 0.76) return "high_priority";
  if (score >= 0.64) return "priority_candidate";
  if (score >= 0.48) return "improvement_opportunity";
  return "informational";
}

export function classifyLearningGovernance(
  recommendations: readonly ProductImprovementRecommendation[]
): readonly LearningGovernanceClassification[] {
  return Object.freeze(
    recommendations.map((recommendation) => {
      const severity = severityFor(recommendation.priorityScore);
      return {
        classificationId: stableSignature(["d10-learning-governance", recommendation.recommendationId, severity]).slice(0, 56),
        severity,
        explanation: recommendation.summary,
        rationale: recommendation.rationale,
        confidence: recommendation.priorityScore,
        recommendedNextStep:
          severity === "strategic_priority" || severity === "high_priority"
            ? "Review in the next executive product learning session."
            : "Track in the pilot learning backlog for pattern confirmation.",
      };
    })
  );
}
