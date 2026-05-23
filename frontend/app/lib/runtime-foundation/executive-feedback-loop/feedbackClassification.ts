import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveFeedbackItem,
  FeedbackClassification,
  FeedbackClassificationCategory,
} from "./executiveFeedbackTypes.ts";

const KEYWORDS: readonly [FeedbackClassificationCategory, readonly string[]][] = Object.freeze([
  ["dashboard", ["dashboard", "readiness", "health", "scorecard", "status"]],
  ["trust", ["trust", "confidence", "believe", "reliable", "rationale"]],
  ["UX", ["confusing", "hard", "layout", "click", "panel", "navigation", "visual"]],
  ["workflow", ["workflow", "sequence", "step", "handoff", "process", "journey"]],
  ["simulation", ["simulation", "scenario", "compare", "outcome", "propagation"]],
  ["onboarding", ["onboarding", "first", "learn", "training", "guided"]],
  ["operational_intelligence", ["fragility", "risk", "operational", "dependency", "signal"]],
  ["recommendation_quality", ["recommendation", "decision", "option", "alternative", "explain"]],
  ["product", ["feature", "capability", "value", "request", "product"]],
]);

function categoryFor(item: ExecutiveFeedbackItem): FeedbackClassificationCategory {
  const text = `${item.type} ${item.summary} ${item.detail} ${item.tags.join(" ")}`.toLowerCase();
  if (item.type === "usability_concern") return "UX";
  if (item.type === "enhancement_request") return "product";
  if (item.type === "validation_result") return "workflow";
  if (item.type === "strategic_insight") return "operational_intelligence";
  for (const [category, keywords] of KEYWORDS) {
    if (keywords.some((keyword) => text.includes(keyword))) return category;
  }
  return "product";
}

function signalKeyFor(item: ExecutiveFeedbackItem, category: FeedbackClassificationCategory): string {
  const workflow = item.relatedWorkflow ?? "general";
  const tag = item.tags[0] ?? item.type;
  return `${category}:${workflow}:${tag}`.toLowerCase().replace(/\s+/g, "_");
}

export function classifyFeedbackItem(item: ExecutiveFeedbackItem): FeedbackClassification {
  const category = categoryFor(item);
  const signalKey = signalKeyFor(item, category);
  const dimensionBoost =
    category === "trust"
      ? item.dimensions.trustworthiness
      : category === "dashboard"
        ? item.dimensions.dashboardEffectiveness
        : category === "simulation"
          ? item.dimensions.simulationUsefulness
          : category === "recommendation_quality"
            ? item.dimensions.decisionUsefulness
            : item.dimensions.clarity;
  const confidence = Math.max(0.55, Math.min(0.98, Number((0.62 + dimensionBoost * 0.28 + item.tags.length * 0.02).toFixed(4))));

  return {
    classificationId: stableSignature(["d10-feedback-classification", item.feedbackId, category]).slice(0, 56),
    feedbackId: item.feedbackId,
    category,
    rationale: `Classified as ${category} from feedback type ${item.type} and available text signals.`,
    confidence,
    signalKey,
    signature: stableSignature(["d10-feedback-classification", item.signature, category, signalKey, confidence]),
  };
}

export function classifyFeedbackItems(items: readonly ExecutiveFeedbackItem[]): readonly FeedbackClassification[] {
  return Object.freeze(items.map(classifyFeedbackItem));
}
