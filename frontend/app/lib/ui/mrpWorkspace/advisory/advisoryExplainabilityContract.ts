/**
 * MRP:5A:4 — Recommendation explainability contract.
 *
 * Explains recommendation reasoning — Advisory consumes intelligence, does not execute.
 */

import type { AdvisoryConfidenceLevel } from "./advisoryStateContract.ts";

export const MRP_ADVISORY_EXPLAINABILITY_TAG = "[MRP_ADVISORY_EXPLAINABILITY]" as const;

export const ADVISORY_EXPLAINABILITY_VERSION = "5A.4.0";

export const ADVISORY_EXPLAINABILITY_PURPOSE = "Why do I recommend this?" as const;

export type RecommendationDriverSectionId =
  | "risk_drivers"
  | "operational_drivers"
  | "scenario_drivers"
  | "strategic_drivers";

export type RecommendationDriverEntry = Readonly<{
  id: string;
  label: string;
  detail: string;
}>;

export type RecommendationDriverSection = Readonly<{
  id: RecommendationDriverSectionId;
  label: string;
  drivers: readonly RecommendationDriverEntry[];
}>;

export type RecommendationDriversSurface = Readonly<{
  purpose: typeof ADVISORY_EXPLAINABILITY_PURPOSE;
  sections: readonly RecommendationDriverSection[];
  explainsRecommendationOnly: true;
}>;

export type ConfidenceAnalysisSurface = Readonly<{
  confidenceScore: number;
  confidenceLabel: string;
  confidenceLevel: AdvisoryConfidenceLevel;
  supportingEvidence: readonly string[];
  uncertaintyIndicators: readonly string[];
}>;

export type AdvisoryExplainabilityLayer = Readonly<{
  drivers: RecommendationDriversSurface;
  confidenceAnalysis: ConfidenceAnalysisSurface;
  explainsRecommendationOnly: true;
}>;

export type AdvisoryExplainabilitySurface = Readonly<{
  purpose: typeof ADVISORY_EXPLAINABILITY_PURPOSE;
  drivers: RecommendationDriversSurface;
  confidenceAnalysis: ConfidenceAnalysisSurface;
  explainsRecommendationOnly: true;
}>;

export const RECOMMENDATION_DRIVER_SECTION_ORDER: readonly RecommendationDriverSectionId[] =
  Object.freeze([
    "risk_drivers",
    "operational_drivers",
    "scenario_drivers",
    "strategic_drivers",
  ]);

export const RECOMMENDATION_DRIVER_SECTION_LABELS: Readonly<
  Record<RecommendationDriverSectionId, string>
> = Object.freeze({
  risk_drivers: "Risk Drivers",
  operational_drivers: "Operational Drivers",
  scenario_drivers: "Scenario Drivers",
  strategic_drivers: "Strategic Drivers",
});

export const DEFAULT_RECOMMENDATION_DRIVERS_SURFACE: RecommendationDriversSurface = Object.freeze({
  purpose: ADVISORY_EXPLAINABILITY_PURPOSE,
  sections: Object.freeze(
    RECOMMENDATION_DRIVER_SECTION_ORDER.map((id) =>
      Object.freeze({
        id,
        label: RECOMMENDATION_DRIVER_SECTION_LABELS[id],
        drivers: Object.freeze([]),
      })
    )
  ),
  explainsRecommendationOnly: true,
});

export const DEFAULT_CONFIDENCE_ANALYSIS_SURFACE: ConfidenceAnalysisSurface = Object.freeze({
  confidenceScore: 0,
  confidenceLabel: "Unknown",
  confidenceLevel: "unknown",
  supportingEvidence: Object.freeze(["Awaiting certified workspace intelligence."]),
  uncertaintyIndicators: Object.freeze(["No object selection — confidence not evaluated."]),
});

export const DEFAULT_ADVISORY_EXPLAINABILITY_LAYER: AdvisoryExplainabilityLayer = Object.freeze({
  drivers: DEFAULT_RECOMMENDATION_DRIVERS_SURFACE,
  confidenceAnalysis: DEFAULT_CONFIDENCE_ANALYSIS_SURFACE,
  explainsRecommendationOnly: true,
});

export const DEFAULT_ADVISORY_EXPLAINABILITY_SURFACE: AdvisoryExplainabilitySurface = Object.freeze({
  purpose: ADVISORY_EXPLAINABILITY_PURPOSE,
  drivers: DEFAULT_RECOMMENDATION_DRIVERS_SURFACE,
  confidenceAnalysis: DEFAULT_CONFIDENCE_ANALYSIS_SURFACE,
  explainsRecommendationOnly: true,
});
