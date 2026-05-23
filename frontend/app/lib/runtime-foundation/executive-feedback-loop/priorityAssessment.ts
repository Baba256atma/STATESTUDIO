import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveFeedbackItem,
  FeedbackClassification,
  FeedbackPriorityAssessment,
} from "./executiveFeedbackTypes.ts";

function clamp(value: number): number {
  return Math.max(0, Math.min(1, Number(value.toFixed(4))));
}

function complexityFor(item: ExecutiveFeedbackItem, classification: FeedbackClassification): number {
  if (classification.category === "onboarding" || classification.category === "dashboard") return 0.35;
  if (classification.category === "UX" || classification.category === "workflow") return 0.45;
  if (item.type === "issue" || classification.category === "simulation") return 0.62;
  return 0.52;
}

export function assessFeedbackPriorities(
  items: readonly ExecutiveFeedbackItem[],
  classifications: readonly FeedbackClassification[]
): readonly FeedbackPriorityAssessment[] {
  const frequencyByKey = new Map<string, number>();
  for (const classification of classifications) {
    frequencyByKey.set(classification.signalKey, (frequencyByKey.get(classification.signalKey) ?? 0) + 1);
  }

  const priorities = items.map((item) => {
    const classification = classifications.find((entry) => entry.feedbackId === item.feedbackId)!;
    const frequency = frequencyByKey.get(classification.signalKey) ?? 1;
    const executiveImpact = clamp((item.dimensions.decisionUsefulness + item.dimensions.explainability + item.dimensions.clarity) / 3);
    const userImpact = clamp((item.dimensions.usability + item.dimensions.workflowQuality + item.dimensions.dashboardEffectiveness) / 3);
    const businessValue = clamp((item.dimensions.decisionUsefulness + item.dimensions.simulationUsefulness + item.dimensions.workflowQuality) / 3);
    const trustImpact = clamp(item.dimensions.trustworthiness);
    const implementationComplexity = complexityFor(item, classification);
    const frequencyScore = clamp(Math.min(frequency, 5) / 5);
    const score = clamp(
      executiveImpact * 0.22 +
        userImpact * 0.18 +
        businessValue * 0.2 +
        trustImpact * 0.2 +
        (1 - implementationComplexity) * 0.1 +
        frequencyScore * 0.1
    );

    return {
      priorityId: stableSignature(["d10-feedback-priority", item.feedbackId, classification.signalKey]).slice(0, 56),
      feedbackId: item.feedbackId,
      score,
      executiveImpact,
      userImpact,
      businessValue,
      trustImpact,
      implementationComplexity,
      frequency,
      recommendation:
        score >= 0.76
          ? "Prioritize for near-term product learning review."
          : score >= 0.62
            ? "Review as a candidate improvement after current blockers."
            : "Track for pattern confirmation before prioritization.",
      signature: stableSignature(["d10-feedback-priority", item.signature, classification.signalKey, score, frequency]),
    };
  });

  return Object.freeze(priorities.sort((a, b) => b.score - a.score || a.priorityId.localeCompare(b.priorityId)));
}
