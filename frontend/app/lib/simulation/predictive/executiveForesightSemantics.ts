/**
 * D7:4:8 — Executive-readable predictive foresight semantics.
 */

import type {
  ExecutiveForesightSemantics,
  PredictiveExecutiveForesightState,
} from "./executiveForesightTypes.ts";
import { FORESIGHT_UNCERTAINTY_DISCLAIMER } from "./foresightGuards.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveForesightSemantics(input: {
  state: PredictiveExecutiveForesightState;
}): ExecutiveForesightSemantics {
  const logisticsFragility = input.state.activeForesightSignals.find((s) =>
    s.signalId.includes("logistics-dependency")
  );
  const stabilization = input.state.activeForesightSignals.find((s) =>
    s.signalId.includes("stabilization-opportunity")
  );
  const instabilityCluster = input.state.activeForesightSignals.find((s) =>
    s.signalId.includes("instability-cluster")
  );
  const topLongHorizon = input.state.longHorizonForesightRecords[0];

  const headline =
    logisticsFragility && stabilization
      ? "Current operational patterns suggest emerging long-term fragility pressure within logistics dependency systems, although improving executive coordination may strengthen future recovery resilience."
      : logisticsFragility
        ? "Emerging long-term fragility pressure within logistics dependency systems may warrant proactive executive preparation across operations and recovery systems."
        : stabilization
          ? "Recovery stabilization combined with improving coordination may indicate a future stabilization opportunity foresight across key operational domains."
          : instabilityCluster
            ? "Growing dependency pressure combined with coordination strain may form an early instability foresight signal requiring executive attention."
            : topLongHorizon
              ? topLongHorizon.explanation
              : input.state.predictiveForesightLabel === "stabilizing"
                ? "Long-horizon operational patterns may support future stabilization as strategic preparedness strengthens."
                : input.state.predictiveForesightLabel === "volatile"
                  ? "Volatile foresight patterns may emerge across operational futures; executive preparation may reduce escalation risk."
                  : "Predictive executive foresight patterns remain under active assessment across the operational universe.";

  const summaryParts: string[] = [];
  if (input.state.predictiveForesightLabel === "critical") {
    summaryParts.push(
      "Critical long-horizon risk patterns may warrant prioritized executive foresight review."
    );
  } else if (input.state.predictiveForesightLabel === "volatile") {
    summaryParts.push(
      "Volatile foresight conditions suggest multiple operational futures may diverge before stabilization."
    );
  } else if (input.state.predictiveForesightLabel === "stabilizing") {
    summaryParts.push(
      "Stabilizing foresight trends may support proactive executive preparation for recovery and coordination gains."
    );
  } else if (input.state.predictiveForesightLabel === "developing") {
    summaryParts.push(
      "Developing foresight signals may indicate meaningful future patterns before full emergence."
    );
  } else {
    summaryParts.push(
      "Emerging foresight signals may develop as operational evolution patterns accumulate over time."
    );
  }
  summaryParts.push(
    `Indicative strategic preparedness is ${(input.state.strategicPreparednessScore * 100).toFixed(0)}% with long-horizon risk at ${(input.state.longHorizonRiskScore * 100).toFixed(0)}% and future readiness at ${(input.state.futureReadinessScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.uncertaintyDisclaimer || FORESIGHT_UNCERTAINTY_DISCLAIMER);

  const signalSummaries = input.state.activeForesightSignals.slice(0, 6).map((s) => {
    const regions = s.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (s.dominantForesightDrivers ?? []).join(", ") || "operational_evolution";
    return `${regions}: may show ${s.foresightState} foresight (${drivers}, strength ${(s.foresightStrength * 100).toFixed(0)}%).`;
  });

  const longHorizonSummaries = input.state.longHorizonForesightRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const preparationSummaries = input.state.executivePreparationGapRecords.map(
    (g) => g.explanation
  );

  const bullets: string[] = [];
  if (input.state.foresightOpportunityZones.length > 0) {
    bullets.push(
      `Foresight opportunity zones: ${input.state.foresightOpportunityZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.longHorizonRiskZones.length > 0) {
    bullets.push(
      `Long-horizon risk zones: ${input.state.longHorizonRiskZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.futureReadinessZones.length > 0) {
    bullets.push(
      `Future readiness zones: ${input.state.futureReadinessZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.executivePreparationGapRecords.length > 0) {
    bullets.push(
      `${input.state.executivePreparationGapRecords.length} executive preparation gap(s) may benefit from proactive review.`
    );
  }

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    signalSummaries: Object.freeze(signalSummaries),
    longHorizonSummaries: Object.freeze(longHorizonSummaries),
    preparationSummaries: Object.freeze(preparationSummaries),
    bullets: Object.freeze(bullets),
  });
}
