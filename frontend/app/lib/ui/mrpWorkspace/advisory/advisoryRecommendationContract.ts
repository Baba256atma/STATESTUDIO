/**
 * MRP:5A:3 — Executive recommendation surface contract.
 *
 * Advisory consumes intelligence. Advisory creates recommendation. Advisory does not execute.
 */

import type { AdvisoryConfidenceLevel } from "./advisoryStateContract.ts";

export const MRP_ADVISORY_RECOMMENDATION_TAG = "[MRP_ADVISORY_RECOMMENDATION]" as const;

export const ADVISORY_RECOMMENDATION_VERSION = "5A.3.0";

export const ADVISORY_RECOMMENDATION_PURPOSE =
  "What do I recommend?" as const;

export type AdvisoryRecommendationSourceId =
  | "risk"
  | "timeline"
  | "scenario"
  | "war_room";

export type ExecutiveRecommendationCard = Readonly<{
  recommendation: string;
  why: string;
  expectedBenefit: string;
  expectedRisk: string;
  confidence: AdvisoryConfidenceLevel;
}>;

export type AdvisoryRecommendationLayer = Readonly<{
  card: ExecutiveRecommendationCard;
  sources: readonly AdvisoryRecommendationSourceId[];
  consumesIntelligenceOnly: true;
  createsRecommendation: true;
  executesActions: false;
}>;

export type AdvisoryRecommendationSurface = Readonly<{
  purpose: typeof ADVISORY_RECOMMENDATION_PURPOSE;
  card: ExecutiveRecommendationCard;
  sources: readonly AdvisoryRecommendationSourceId[];
  consumesIntelligenceOnly: true;
  createsRecommendation: true;
  executesActions: false;
}>;

export const ADVISORY_RECOMMENDATION_SOURCE_ORDER: readonly AdvisoryRecommendationSourceId[] =
  Object.freeze(["risk", "timeline", "scenario", "war_room"]);

export const ADVISORY_RECOMMENDATION_FIELD_LABELS = Object.freeze({
  recommendation: "Recommendation",
  why: "Why",
  expectedBenefit: "Expected Benefit",
  expectedRisk: "Expected Risk",
  confidence: "Confidence",
});

export const DEFAULT_EXECUTIVE_RECOMMENDATION_CARD: ExecutiveRecommendationCard = Object.freeze({
  recommendation: "No executive recommendation available",
  why: "Awaiting intelligence from certified workspaces.",
  expectedBenefit: "Benefit assessment pending recommendation intake.",
  expectedRisk: "Risk assessment pending recommendation intake.",
  confidence: "unknown",
});

export const DEFAULT_ADVISORY_RECOMMENDATION_LAYER: AdvisoryRecommendationLayer = Object.freeze({
  card: DEFAULT_EXECUTIVE_RECOMMENDATION_CARD,
  sources: Object.freeze([]),
  consumesIntelligenceOnly: true,
  createsRecommendation: true,
  executesActions: false,
});

export const DEFAULT_ADVISORY_RECOMMENDATION_SURFACE: AdvisoryRecommendationSurface = Object.freeze({
  purpose: ADVISORY_RECOMMENDATION_PURPOSE,
  card: DEFAULT_EXECUTIVE_RECOMMENDATION_CARD,
  sources: Object.freeze([]),
  consumesIntelligenceOnly: true,
  createsRecommendation: true,
  executesActions: false,
});
