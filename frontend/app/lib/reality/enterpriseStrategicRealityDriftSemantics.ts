/**
 * D7:7:4 — Executive-readable enterprise strategic reality drift semantics.
 */

import type {
  EnterpriseStrategicRealityDriftSemantics,
  EnterpriseStrategicRealityDriftIntelligenceState,
} from "./enterpriseStrategicRealityDriftTypes.ts";
import {
  DRIFT_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_DRIFT_DISCLAIMER,
} from "./enterpriseStrategicRealityDriftGuards.ts";

export function buildEnterpriseStrategicRealityDriftSemantics(input: {
  state: EnterpriseStrategicRealityDriftIntelligenceState;
}): EnterpriseStrategicRealityDriftSemantics {
  const coordinationDecay = input.state.driftEvolutionRecords.find((r) =>
    r.recordId.includes("coordination-decay")
  );
  const dependencyAccum = input.state.driftEvolutionRecords.find((r) =>
    r.recordId.includes("dependency-accumulation")
  );
  const alignmentDrift = input.state.strategicCoherenceDegradationRecords.find((r) =>
    r.recordId.includes("alignment-drift")
  );

  const headline =
    input.state.executiveDriftLabel === "stable" ||
    input.state.executiveDriftLabel === "emerging"
      ? "Operational coordination across logistics and governance systems remains functional, although gradual dependency concentration and declining recovery synchronization are beginning to introduce long-horizon strategic drift."
      : input.state.executiveDriftLabel === "drifting"
        ? alignmentDrift
          ? alignmentDrift.explanation
          : coordinationDecay
            ? coordinationDecay.explanation
            : "Strategic reality may be drifting as operational alignment weakens across interconnected domains."
        : input.state.executiveDriftLabel === "destabilizing" ||
            input.state.executiveDriftLabel === "critical"
          ? dependencyAccum
            ? dependencyAccum.explanation
            : "Destabilizing drift may elevate systemic fragility when coherence degradation persists."
          : coordinationDecay
            ? coordinationDecay.explanation
            : "Enterprise strategic reality drift remains under active assessment across long horizons.";

  const summaryParts: string[] = [];
  if (input.state.executiveDriftLabel === "stable") {
    summaryParts.push(
      "Stable drift conditions may indicate strategic coherence remains within acceptable long-horizon tolerance."
    );
  } else if (input.state.executiveDriftLabel === "emerging") {
    summaryParts.push(
      "Emerging drift may signal gradual weakening before acute instability becomes visible."
    );
  } else if (input.state.executiveDriftLabel === "drifting") {
    summaryParts.push(
      "Drifting conditions may reflect slow divergence from strategic stability across operational layers."
    );
  } else if (input.state.executiveDriftLabel === "destabilizing") {
    summaryParts.push(
      "Destabilizing drift may suggest accelerating coherence loss across enterprise domains."
    );
  } else {
    summaryParts.push(
      "Critical drift conditions may elevate strategic risk until coherence stabilizes under executive control."
    );
  }
  summaryParts.push(
    `Indicative strategic coherence is ${(input.state.strategicCoherenceScore * 100).toFixed(0)}% with drift evolution at ${(input.state.driftEvolutionScore * 100).toFixed(0)}% and degradation at ${(input.state.coherenceDegradationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.driftAmbiguityDisclaimer || DRIFT_AMBIGUITY_DISCLAIMER);
  summaryParts.push(
    input.state.nonAutonomousDriftDisclaimer || NON_AUTONOMOUS_DRIFT_DISCLAIMER
  );

  const driftSummaries = input.state.activeDriftSignals.map((s) => {
    const drivers = (s.dominantDriftDrivers ?? []).join(", ") || "drift_drivers";
    return `${s.driftId}: ${s.driftState} (${drivers}, strength ${(s.driftStrength * 100).toFixed(0)}%).`;
  });

  const evolutionSummaries = input.state.driftEvolutionRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const degradationSummaries = input.state.strategicCoherenceDegradationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.emergingDriftZones.length > 0) {
    bullets.push(`Emerging drift zones: ${input.state.emergingDriftZones.join(", ")}.`);
  }
  if (input.state.destabilizedRealityZones.length > 0) {
    bullets.push(
      `Destabilized reality zones: ${input.state.destabilizedRealityZones.join(", ")}.`
    );
  }
  bullets.push(
    "Nexora models stable reality, gradual drift, and strategic instability; executive authority remains fully in control."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    driftSummaries: Object.freeze(driftSummaries),
    evolutionSummaries: Object.freeze(evolutionSummaries),
    degradationSummaries: Object.freeze(degradationSummaries),
    bullets: Object.freeze(bullets),
  });
}
