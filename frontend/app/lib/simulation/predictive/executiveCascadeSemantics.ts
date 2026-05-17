/**
 * D7:4:4 — Executive-readable predictive cascade semantics.
 */

import type {
  ExecutiveCascadeSemantics,
  PredictiveCascadeState,
} from "./cascadingConsequenceTypes.ts";
import { CASCADE_UNCERTAINTY_DISCLAIMER } from "./cascadeGuards.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveCascadeSemantics(input: {
  state: PredictiveCascadeState;
}): ExecutiveCascadeSemantics {
  const pressureAmplification = input.state.futureAmplificationRecords.find((r) =>
    r.recordId.includes("pressure-chain")
  );
  const manufacturingSignal = input.state.activeCascadeSignals.find((s) =>
    s.originatingRegionIds.includes("manufacturing")
  );
  const stabilizationRipple = input.state.activeCascadeSignals.find(
    (s) => s.signalId === "cascade::stabilization-ripple"
  );
  const topConsequence = input.state.secondaryTertiaryConsequenceRecords[0];

  const headline =
    pressureAmplification && manufacturingSignal
      ? "Current manufacturing instability may trigger cascading recovery delays across logistics and finance systems if dependency pressure continues to intensify."
      : stabilizationRipple
        ? "Improved executive coordination may ripple through trust and resilience systems, reducing fragility concentration and supporting equilibrium recovery."
        : topConsequence
          ? topConsequence.explanation
          : input.state.predictiveCascadeLabel === "critical"
            ? "Critical cascading consequences may spread across multiple operational domains under current instability conditions."
            : input.state.predictiveCascadeLabel === "stabilizing"
              ? "Stabilization ripples may reduce future cascade intensity where recovery and coordination align."
              : "Predictive cascade patterns remain mixed across interconnected enterprise systems.";

  const summaryParts: string[] = [];
  if (input.state.predictiveCascadeLabel === "amplifying") {
    summaryParts.push(
      "Cascade amplification may intensify as dependency and momentum effects propagate through operational chains."
    );
  } else if (input.state.predictiveCascadeLabel === "propagating") {
    summaryParts.push(
      "Chain-reaction propagation may spread secondary and tertiary consequences across connected regions."
    );
  } else if (input.state.predictiveCascadeLabel === "stabilizing") {
    summaryParts.push(
      "Stabilization ripple effects may dampen future consequence propagation where resilience strengthens."
    );
  } else {
    summaryParts.push(
      "Localized cascade effects may remain contained unless dependency pressure escalates further."
    );
  }
  summaryParts.push(
    `Indicative propagation is ${(input.state.cascadePropagationScore * 100).toFixed(0)}% with amplification at ${(input.state.cascadeAmplificationScore * 100).toFixed(0)}% and stabilization at ${(input.state.cascadeStabilizationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.uncertaintyDisclaimer || CASCADE_UNCERTAINTY_DISCLAIMER);

  const signalSummaries = input.state.activeCascadeSignals.slice(0, 6).map((s) => {
    const origin = s.originatingRegionIds.map(regionLabel).join(", ");
    const affected = s.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (s.dominantCascadeDrivers ?? []).join(", ") || "operational_propagation";
    return `${origin} → ${affected}: may ${s.cascadeState} (hop ${s.hopDepth}, ${drivers}, intensity ${(s.propagationIntensity * 100).toFixed(0)}%).`;
  });

  const consequenceSummaries = input.state.secondaryTertiaryConsequenceRecords.map(
    (r) => r.explanation
  );
  const amplificationSummaries = input.state.futureAmplificationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.amplificationZones.length > 0) {
    bullets.push(
      `Amplification zones: ${input.state.amplificationZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.stabilizationZones.length > 0) {
    bullets.push(
      `Stabilization zones: ${input.state.stabilizationZones.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    consequenceSummaries,
    amplificationSummaries,
    bullets,
  };
}
