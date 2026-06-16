/**
 * MRP:5A:2 — Advisory recommendation runtime state contract.
 *
 * Advisory owns recommendation — no commitment, approval, or scene writes.
 */

export const MRP_ADVISORY_RUNTIME_TAG = "[MRP_ADVISORY_RUNTIME]" as const;

export const ADVISORY_STATE_VERSION = "5A.2.0";

export type AdvisoryConfidenceLevel =
  | "unknown"
  | "low"
  | "moderate"
  | "high"
  | "very_high";

export type AdvisoryRecommendationRuntime = Readonly<{
  recommendationId: string | null;
  recommendationTitle: string | null;
  confidence: AdvisoryConfidenceLevel;
  rationale: string | null;
  selectedObjectId: string | null;
  sourceScenarioId: string | null;
  sourceDecisionId: string | null;
}>;

export const ADVISORY_CONFIDENCE_LEVELS: readonly AdvisoryConfidenceLevel[] = Object.freeze([
  "unknown",
  "low",
  "moderate",
  "high",
  "very_high",
]);

export const ADVISORY_CONFIDENCE_LABELS: Readonly<Record<AdvisoryConfidenceLevel, string>> =
  Object.freeze({
    unknown: "Unknown",
    low: "Low",
    moderate: "Moderate",
    high: "High",
    very_high: "Very High",
  });

export const DEFAULT_ADVISORY_RECOMMENDATION_RUNTIME: AdvisoryRecommendationRuntime =
  Object.freeze({
    recommendationId: null,
    recommendationTitle: null,
    confidence: "unknown",
    rationale: null,
    selectedObjectId: null,
    sourceScenarioId: null,
    sourceDecisionId: null,
  });
