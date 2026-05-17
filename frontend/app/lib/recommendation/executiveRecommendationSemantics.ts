/**
 * D7:5:1 — Executive-readable strategic recommendation semantics.
 */

import type {
  ExecutiveRecommendationSemantics,
  StrategicRecommendationState,
} from "./strategicRecommendationTypes.ts";
import {
  NON_EXECUTION_DISCLAIMER,
  RECOMMENDATION_UNCERTAINTY_DISCLAIMER,
} from "./recommendationGuards.ts";
import { CANONICAL_REGION_LABELS } from "../simulation/topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveRecommendationSemantics(input: {
  state: StrategicRecommendationState;
}): ExecutiveRecommendationSemantics {
  const logisticsCoordination = input.state.activeRecommendations.find((r) =>
    r.recommendationId.includes("logistics-coordination")
  );
  const dependencyReduction = input.state.activeRecommendations.find((r) =>
    r.recommendationId.includes("dependency-concentration")
  );
  const recoverySync = input.state.activeRecommendations.find((r) =>
    r.recommendationId.includes("recovery-synchronization")
  );
  const topImpact = input.state.interventionImpactRecords[0];

  const headline =
    logisticsCoordination
      ? "Current operational conditions suggest prioritizing logistics coordination stabilization to reduce future dependency-pressure amplification across manufacturing recovery systems."
      : dependencyReduction
        ? "High dependency pressure with weak recovery coordination may warrant reducing dependency concentration as a preventive executive action."
        : recoverySync
          ? "Improving resilience trends with stabilizing momentum may support accelerating recovery synchronization across coordinated operational domains."
          : topImpact
            ? topImpact.explanation
            : input.state.strategicRecommendationLabel === "stabilizing"
              ? "Grounded stabilization recommendations may support executive decision-making to reduce operational instability."
              : input.state.strategicRecommendationLabel === "critical"
                ? "Critical intervention recommendations may warrant prioritized executive review; recommendations remain advisory only."
                : "Strategic executive recommendations remain under active assessment based on operational and predictive intelligence.";

  const summaryParts: string[] = [];
  if (input.state.strategicRecommendationLabel === "critical") {
    summaryParts.push(
      "Critical recommendations highlight high-impact intervention opportunities requiring executive authorization."
    );
  } else if (input.state.strategicRecommendationLabel === "preventive") {
    summaryParts.push(
      "Preventive recommendations may reduce instability before escalation across dependency and recovery systems."
    );
  } else if (input.state.strategicRecommendationLabel === "stabilizing") {
    summaryParts.push(
      "Stabilizing recommendations may align with recovery leverage and equilibrium restoration pathways."
    );
  } else if (input.state.strategicRecommendationLabel === "adaptive") {
    summaryParts.push(
      "Adaptive recommendations may strengthen organizational resilience under evolving operational conditions."
    );
  } else {
    summaryParts.push(
      "Informational recommendations provide executive context without implying mandatory action."
    );
  }
  summaryParts.push(
    `Indicative recommendation confidence is ${(input.state.recommendationConfidenceScore * 100).toFixed(0)}% with stabilization leverage at ${(input.state.stabilizationLeverageScore * 100).toFixed(0)}% and intervention risk at ${(input.state.interventionRiskScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.uncertaintyDisclaimer || RECOMMENDATION_UNCERTAINTY_DISCLAIMER);
  summaryParts.push(input.state.nonExecutionDisclaimer || NON_EXECUTION_DISCLAIMER);

  const recommendationSummaries = input.state.activeRecommendations.slice(0, 6).map((r) => {
    const regions = r.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (r.dominantRecommendationDrivers ?? []).join(", ") || "operational_intelligence";
    return `${regions}: ${r.recommendationState} recommendation (${drivers}, strength ${(r.recommendationStrength * 100).toFixed(0)}%).`;
  });

  const interventionSummaries = input.state.interventionImpactRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const influenceSummaries = input.state.executiveRecommendationInfluenceRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.stabilizationRecommendationZones.length > 0) {
    bullets.push(
      `Stabilization recommendation zones: ${input.state.stabilizationRecommendationZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.criticalInterventionZones.length > 0) {
    bullets.push(
      `Critical intervention zones: ${input.state.criticalInterventionZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.resilienceSupportZones.length > 0) {
    bullets.push(
      `Resilience support zones: ${input.state.resilienceSupportZones.map(regionLabel).join(", ")}.`
    );
  }
  bullets.push("All recommendations require executive authorization and are not auto-executed.");

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    recommendationSummaries: Object.freeze(recommendationSummaries),
    interventionSummaries: Object.freeze(interventionSummaries),
    influenceSummaries: Object.freeze(influenceSummaries),
    bullets: Object.freeze(bullets),
  });
}
