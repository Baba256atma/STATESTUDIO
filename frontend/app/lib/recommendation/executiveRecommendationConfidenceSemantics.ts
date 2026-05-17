/**
 * D7:5:2 — Executive-readable recommendation confidence semantics.
 */

import type {
  ExecutiveRecommendationConfidenceSemantics,
  RecommendationConfidenceState,
} from "./recommendationConfidenceTypes.ts";
import { CONFIDENCE_UNCERTAINTY_DISCLAIMER } from "./confidenceGuards.ts";
import { CANONICAL_REGION_LABELS } from "../simulation/topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveRecommendationConfidenceSemantics(input: {
  state: RecommendationConfidenceState;
}): ExecutiveRecommendationConfidenceSemantics {
  const recoveryDivergence = input.state.recommendationUncertaintyRecords.find((r) =>
    r.recordId.includes("recovery-divergence")
  );
  const divergenceUncertainty = input.state.recommendationUncertaintyRecords.find((r) =>
    r.uncertaintyType === "divergence_amplification"
  );
  const highConfidence = input.state.activeConfidenceSignals.filter(
    (s) => s.confidenceState === "high"
  );
  const topEvidence = input.state.evidenceStrengthRecords[0];

  const headline =
    recoveryDivergence
      ? "Recommendation confidence remains moderate because recovery indicators are improving, although future operational divergence across manufacturing systems continues to introduce predictive ambiguity."
      : divergenceUncertainty
        ? "Recommendation confidence may be reduced where future operational divergence amplifies ambiguity across logistics and manufacturing recommendations."
        : highConfidence.length > 0
          ? "Strong operational evidence with stable predictive trajectories may support strongly supported recommendations for executive review."
          : topEvidence
            ? topEvidence.explanation
            : input.state.recommendationConfidenceLabel === "volatile"
              ? "Volatile confidence conditions suggest recommendation reliability may shift as operational signals evolve."
              : input.state.recommendationConfidenceLabel === "high"
                ? "Overall recommendation confidence may be relatively strong where evidence stability and predictive consistency align."
                : "Recommendation confidence remains under active assessment based on operational and predictive evidence.";

  const summaryParts: string[] = [];
  if (input.state.recommendationConfidenceLabel === "volatile") {
    summaryParts.push(
      "Volatile confidence reflects unstable predictive and operational conditions affecting recommendation reliability."
    );
  } else if (input.state.recommendationConfidenceLabel === "uncertain") {
    summaryParts.push(
      "Indeterminate confidence highlights ambiguity that executives should weigh before acting on recommendations."
    );
  } else if (input.state.recommendationConfidenceLabel === "high") {
    summaryParts.push(
      "High confidence indicates recommendations are comparatively well supported by current evidence, without implying definitive outcomes."
    );
  } else if (input.state.recommendationConfidenceLabel === "moderate") {
    summaryParts.push(
      "Moderate confidence suggests mixed evidence where some recommendations are better supported than others."
    );
  } else {
    summaryParts.push(
      "Low confidence may indicate insufficient evidence or elevated ambiguity across key operational domains."
    );
  }
  summaryParts.push(
    `Indicative overall confidence is ${(input.state.overallConfidenceScore * 100).toFixed(0)}% with evidence stability at ${(input.state.evidenceStabilityScore * 100).toFixed(0)}%, predictive consistency at ${(input.state.predictiveConsistencyScore * 100).toFixed(0)}%, and ambiguity amplification at ${(input.state.uncertaintyAmplificationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.uncertaintyDisclaimer || CONFIDENCE_UNCERTAINTY_DISCLAIMER);

  const confidenceSummaries = input.state.activeConfidenceSignals.slice(0, 6).map((s) => {
    const regions = s.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (s.dominantConfidenceDrivers ?? []).join(", ") || "operational_evidence";
    return `${regions}: ${s.confidenceState} confidence (${drivers}, evidence ${(s.evidenceStrength * 100).toFixed(0)}%).`;
  });

  const uncertaintySummaries = input.state.recommendationUncertaintyRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const evidenceSummaries = input.state.evidenceStrengthRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.uncertaintyZones.length > 0) {
    bullets.push(
      `Uncertainty zones: ${input.state.uncertaintyZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.stableRecommendationZones.length > 0) {
    bullets.push(
      `Stable recommendation zones: ${input.state.stableRecommendationZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.recommendationUncertaintyRecords.length > 0) {
    bullets.push(
      `${input.state.recommendationUncertaintyRecords.length} ambiguity factor(s) may affect recommendation reliability.`
    );
  }

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    confidenceSummaries: Object.freeze(confidenceSummaries),
    uncertaintySummaries: Object.freeze(uncertaintySummaries),
    evidenceSummaries: Object.freeze(evidenceSummaries),
    bullets: Object.freeze(bullets),
  });
}
