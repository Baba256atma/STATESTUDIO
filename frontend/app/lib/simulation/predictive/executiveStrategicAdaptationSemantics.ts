/**
 * D7:4:7 — Executive-readable strategic adaptation semantics.
 */

import type {
  ExecutiveStrategicAdaptationSemantics,
  PredictiveStrategicAdaptationState,
} from "./strategicAdaptationTypes.ts";
import { ADAPTATION_UNCERTAINTY_DISCLAIMER } from "./adaptationGuards.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveStrategicAdaptationSemantics(input: {
  state: PredictiveStrategicAdaptationState;
}): ExecutiveStrategicAdaptationSemantics {
  const crossDomainFlexibility = input.state.activeAdaptationSignals.find((s) =>
    s.signalId.includes("cross-domain-flexibility")
  );
  const leadershipAdaptation = input.state.activeAdaptationSignals.find((s) =>
    s.signalId.includes("leadership-recovery")
  );
  const topPathway = input.state.predictiveAdaptationPathwayRecords[0];

  const headline =
    crossDomainFlexibility
      ? "Current operational conditions suggest that moderate improvements in cross-domain coordination flexibility could significantly strengthen long-term recovery adaptation across logistics and manufacturing systems."
      : leadershipAdaptation
        ? "Improved leadership coordination may support adaptive recovery acceleration as organizational flexibility strengthens under operational pressure."
        : topPathway
          ? topPathway.explanation
          : input.state.predictiveAdaptationLabel === "flexible"
            ? "Strategic flexibility may reshape future trajectories as adaptation capability strengthens across coordinated operational domains."
            : input.state.predictiveAdaptationLabel === "strained"
              ? "Adaptation capacity remains strained; targeted flexibility improvements may be needed to preserve long-term survivability."
              : "Predictive strategic adaptation patterns remain under active assessment across the operational universe.";

  const summaryParts: string[] = [];
  if (input.state.predictiveAdaptationLabel === "flexible") {
    summaryParts.push(
      "Strategic flexibility may increase as resilience-driven adaptation reshapes future operational evolution."
    );
  } else if (input.state.predictiveAdaptationLabel === "adaptive") {
    summaryParts.push(
      "Adaptive capability may strengthen recovery pathways where coordination and resilience align."
    );
  } else if (input.state.predictiveAdaptationLabel === "strained") {
    summaryParts.push(
      "Strained adaptation conditions suggest organizational rigidity may limit flexibility under sustained pressure."
    );
  } else if (input.state.predictiveAdaptationLabel === "critical") {
    summaryParts.push(
      "Critical adaptation fragility may constrain survivability unless flexibility windows are addressed."
    );
  } else {
    summaryParts.push(
      "Emerging adaptation signals may develop as organizations respond to instability and recovery conditions."
    );
  }
  summaryParts.push(
    `Indicative adaptive resilience is ${(input.state.adaptiveResilienceScore * 100).toFixed(0)}% with strategic flexibility at ${(input.state.strategicFlexibilityScore * 100).toFixed(0)}% and adaptation fragility at ${(input.state.adaptationFragilityScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.uncertaintyDisclaimer || ADAPTATION_UNCERTAINTY_DISCLAIMER);

  const signalSummaries = input.state.activeAdaptationSignals.slice(0, 6).map((s) => {
    const regions = s.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (s.dominantAdaptationDrivers ?? []).join(", ") || "adaptation_pressure";
    return `${regions}: may show ${s.adaptationState} adaptation (${drivers}, strength ${(s.adaptationStrength * 100).toFixed(0)}%).`;
  });

  const flexibilitySummaries = input.state.resilienceFlexibilityRecords.map((r) => r.explanation);
  const pathwaySummaries = input.state.predictiveAdaptationPathwayRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.strategicFlexibilityZones.length > 0) {
    bullets.push(
      `Strategic flexibility zones: ${input.state.strategicFlexibilityZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.adaptationFragilityZones.length > 0) {
    bullets.push(
      `Adaptation fragility zones: ${input.state.adaptationFragilityZones.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    flexibilitySummaries,
    pathwaySummaries,
    bullets,
  };
}
