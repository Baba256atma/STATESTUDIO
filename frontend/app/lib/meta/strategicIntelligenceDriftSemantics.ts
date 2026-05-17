/**
 * D7:8:4 — Executive-readable strategic intelligence drift semantics.
 */

import type {
  StrategicIntelligenceDriftSemantics,
  StrategicIntelligenceDriftIntelligenceState,
} from "./strategicIntelligenceDriftTypes.ts";
import {
  DRIFT_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_DRIFT_DISCLAIMER,
} from "./strategicIntelligenceDriftGuards.ts";

export function buildStrategicIntelligenceDriftSemantics(input: {
  state: StrategicIntelligenceDriftIntelligenceState;
}): StrategicIntelligenceDriftSemantics {
  const resilienceErosion = input.state.longHorizonIntelligenceDriftRecords.find((r) =>
    r.recordId.includes("resilience-erosion")
  );
  const coherenceDegradation = input.state.longHorizonIntelligenceDriftRecords.find((r) =>
    r.recordId.includes("coherence-degradation")
  );
  const hiddenInstability = input.state.strategicCoherenceDegradationRecords.find((r) =>
    r.recordId.includes("hidden-instability")
  );

  const headline =
    input.state.executiveDriftLabel === "stable" ||
    (input.state.executiveDriftLabel === "emerging" &&
      input.state.strategicDriftInstabilityScore < 0.5)
      ? resilienceErosion && input.state.longHorizonDriftScore >= 0.35
        ? "Enterprise strategic intelligence remains operationally coherent, although repeated optimization-driven decision cycles are gradually weakening resilience redundancy and increasing long-horizon strategic drift risk."
        : "Enterprise strategic intelligence may remain broadly coherent with manageable long-horizon drift under executive oversight."
      : input.state.executiveDriftLabel === "drifting" ||
          input.state.executiveDriftLabel === "destabilizing"
        ? coherenceDegradation
          ? coherenceDegradation.explanation
          : hiddenInstability
            ? hiddenInstability.explanation
            : "Strategic intelligence drift may be accumulating as coherence degradation pathways weaken long-horizon resilience and continuity."
        : input.state.executiveDriftLabel === "critical"
          ? "Critical strategic intelligence drift conditions may elevate when coherence degradation, resilience erosion, and predictive instability compound under sustained pressure."
          : resilienceErosion
            ? resilienceErosion.explanation
            : "Strategic intelligence drift remains under active assessment across enterprise reasoning systems.";

  const summaryParts: string[] = [];
  if (input.state.executiveDriftLabel === "stable") {
    summaryParts.push(
      "Stable drift conditions may indicate strategic intelligence remains aligned with long-horizon coherence objectives."
    );
  } else if (input.state.executiveDriftLabel === "emerging") {
    summaryParts.push(
      "Emerging drift may signal early coherence degradation that warrants executive attention before destabilization accelerates."
    );
  } else if (input.state.executiveDriftLabel === "drifting") {
    summaryParts.push(
      "Drifting conditions may reflect gradual loss of strategic coherence as optimization bias and resilience erosion accumulate."
    );
  } else if (input.state.executiveDriftLabel === "destabilizing") {
    summaryParts.push(
      "Destabilizing drift may elevate when hidden long-horizon instability compounds across governance and predictive systems."
    );
  } else {
    summaryParts.push(
      "Critical drift conditions may threaten coherent strategic evolution until stabilization pathways strengthen under executive control."
    );
  }
  summaryParts.push(
    `Indicative strategic intelligence coherence is ${(input.state.strategicIntelligenceCoherenceScore * 100).toFixed(0)}% with long-horizon drift at ${(input.state.longHorizonDriftScore * 100).toFixed(0)}% and instability at ${(input.state.strategicDriftInstabilityScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.driftAmbiguityDisclaimer || DRIFT_AMBIGUITY_DISCLAIMER);
  summaryParts.push(input.state.nonAutonomousDriftDisclaimer || NON_AUTONOMOUS_DRIFT_DISCLAIMER);

  const driftSummaries = input.state.activeDriftSignals.map((s) => {
    const drivers = (s.dominantDriftDrivers ?? []).join(", ") || "drift_drivers";
    return `${s.driftId}: ${s.driftState} (${drivers}, strength ${(s.driftStrength * 100).toFixed(0)}%).`;
  });

  const longHorizonSummaries = input.state.longHorizonIntelligenceDriftRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const degradationSummaries = input.state.strategicCoherenceDegradationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.emergingDriftZones.length > 0) {
    bullets.push(`Emerging drift zones: ${input.state.emergingDriftZones.join(", ")}.`);
  }
  if (input.state.degradedStrategicZones.length > 0) {
    bullets.push(`Degraded strategic zones: ${input.state.degradedStrategicZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora models strategic intelligence drift and coherence degradation; strategic authority remains fully under executive control."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    driftSummaries: Object.freeze(driftSummaries),
    longHorizonSummaries: Object.freeze(longHorizonSummaries),
    degradationSummaries: Object.freeze(degradationSummaries),
    bullets: Object.freeze(bullets),
  });
}
