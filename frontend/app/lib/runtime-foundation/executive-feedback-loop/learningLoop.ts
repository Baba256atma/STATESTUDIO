import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveFeedbackItem,
  FeedbackClassification,
  LearningPattern,
  LearningPatternType,
} from "./executiveFeedbackTypes.ts";

function patternTypeFor(item: ExecutiveFeedbackItem): LearningPatternType {
  if (item.type === "issue") return "recurring_concern";
  if (item.type === "enhancement_request" || item.type === "suggestion") return "recurring_request";
  if (item.type === "usability_concern") return "recurring_friction";
  if (item.dimensions.workflowQuality >= 0.8 || item.summary.toLowerCase().includes("valuable")) return "successful_workflow";
  if (item.dimensions.trustworthiness >= 0.82 || item.summary.toLowerCase().includes("trust")) return "trusted_capability";
  return "underutilized_capability";
}

export function detectLearningPatterns(
  items: readonly ExecutiveFeedbackItem[],
  classifications: readonly FeedbackClassification[]
): readonly LearningPattern[] {
  const groups = new Map<string, { items: ExecutiveFeedbackItem[]; classification: FeedbackClassification; type: LearningPatternType }>();
  for (const item of items) {
    const classification = classifications.find((entry) => entry.feedbackId === item.feedbackId);
    if (!classification) continue;
    const type = patternTypeFor(item);
    const key = `${type}:${classification.signalKey}`;
    const existing = groups.get(key);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.set(key, { items: [item], classification, type });
    }
  }

  return Object.freeze(
    Array.from(groups.entries())
      .map(([key, group]) => {
        const occurrenceCount = group.items.length;
        const evidence = group.items.map((item) => item.summary).slice(0, 4);
        const confidence = Math.max(0.5, Math.min(0.96, Number((0.52 + occurrenceCount * 0.12 + group.classification.confidence * 0.18).toFixed(4))));
        return {
          patternId: stableSignature(["d10-learning-pattern", key]).slice(0, 56),
          type: group.type,
          label: group.classification.signalKey,
          category: group.classification.category,
          occurrenceCount,
          evidence: Object.freeze(evidence),
          confidence,
          signature: stableSignature(["d10-learning-pattern", key, evidence, confidence]),
        };
      })
      .sort((a, b) => b.occurrenceCount - a.occurrenceCount || b.confidence - a.confidence || a.patternId.localeCompare(b.patternId))
  );
}
