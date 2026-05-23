import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveFeedbackItem,
  FeedbackTrendPoint,
  FeedbackTrendSummary,
  LearningPattern,
} from "./executiveFeedbackTypes.ts";

function trend(values: readonly number[]): "increasing" | "decreasing" | "flat" {
  if (values.length < 2) return "flat";
  const first = values[0]!;
  const last = values[values.length - 1]!;
  if (last > first + 0.03) return "increasing";
  if (last < first - 0.03) return "decreasing";
  return "flat";
}

export function buildFeedbackTrendPoint(
  items: readonly ExecutiveFeedbackItem[],
  patterns: readonly LearningPattern[],
  generatedAt: number
): FeedbackTrendPoint {
  const trustObservations = items.filter((item) => item.dimensions.trustworthiness >= 0.75 || item.summary.toLowerCase().includes("trust")).length;
  const satisfactionTotal = items.reduce((sum, item) => sum + (item.dimensions.usability + item.dimensions.decisionUsefulness + item.dimensions.clarity) / 3, 0);
  return {
    generatedAt,
    feedbackVolume: items.length,
    recurringIssues: patterns.filter((pattern) => pattern.type === "recurring_concern" || pattern.type === "recurring_friction").length,
    recurringRequests: patterns.filter((pattern) => pattern.type === "recurring_request").length,
    trustObservations,
    executiveSatisfaction: items.length ? Number((satisfactionTotal / items.length).toFixed(4)) : 0,
  };
}

export function buildFeedbackTrendSummary(
  previous: readonly FeedbackTrendPoint[],
  current: FeedbackTrendPoint
): FeedbackTrendSummary {
  const points = [...previous, current].slice(-8);
  return {
    volumeTrend: trend(points.map((point) => point.feedbackVolume)),
    recurringIssueTrend: trend(points.map((point) => point.recurringIssues)),
    recurringRequestTrend: trend(points.map((point) => point.recurringRequests)),
    trustObservationTrend: trend(points.map((point) => point.trustObservations)),
    executiveSatisfactionTrend: trend(points.map((point) => point.executiveSatisfaction)),
    points: Object.freeze(points),
    signature: stableSignature(["d10-feedback-trend", points]),
  };
}
