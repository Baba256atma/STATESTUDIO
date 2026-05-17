/**
 * D7:7:1 — Executive-readable strategic reality semantics.
 */

import type {
  StrategicRealitySemantics,
  StrategicRealityIntelligenceState,
} from "./strategicRealityTypes.ts";
import {
  REALITY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_REALITY_DISCLAIMER,
} from "./strategicRealityGuards.ts";

export function buildStrategicRealitySemantics(input: {
  state: StrategicRealityIntelligenceState;
}): StrategicRealitySemantics {
  const resilienceEvolution = input.state.unifiedOperationalStateRecords.find((r) =>
    r.recordId.includes("resilience-evolution")
  );
  const governanceEvolution = input.state.realityEvolutionRecords.find((r) =>
    r.recordId.includes("governance-instability")
  );
  const coherenceDegradation = input.state.realityEvolutionRecords.find((r) =>
    r.recordId.includes("reality-coherence-degradation")
  );

  const headline =
    input.state.executiveRealityLabel === "stable" ||
    input.state.executiveRealityLabel === "adaptive" ||
    input.state.executiveRealityLabel === "evolving"
      ? "Operational recovery conditions across logistics and manufacturing systems continue to evolve toward stabilization, although governance fragmentation and predictive volatility remain elevated in long-horizon recovery pathways."
      : input.state.executiveRealityLabel === "volatile" ||
          input.state.executiveRealityLabel === "critical"
        ? coherenceDegradation
          ? coherenceDegradation.explanation
          : governanceEvolution
            ? governanceEvolution.explanation
            : "Strategic operational reality may require consolidation when enterprise ecosystems diverge across domains."
        : resilienceEvolution
          ? resilienceEvolution.explanation
          : "Strategic operational reality remains under active assessment across the enterprise universe.";

  const summaryParts: string[] = [];
  if (input.state.executiveRealityLabel === "stable") {
    summaryParts.push(
      "Stable reality may indicate operationally grounded conditions with manageable evolution pressure."
    );
  } else if (input.state.executiveRealityLabel === "evolving") {
    summaryParts.push(
      "Evolving reality may reflect continuous strategic movement across interconnected operational systems."
    );
  } else if (input.state.executiveRealityLabel === "adaptive") {
    summaryParts.push(
      "Adaptive reality may indicate positive evolution when recovery and governance coherence improve together."
    );
  } else if (input.state.executiveRealityLabel === "volatile") {
    summaryParts.push(
      "Volatile reality may suggest elevated instability across operational and predictive layers."
    );
  } else {
    summaryParts.push(
      "Critical reality conditions may elevate strategic risk until operational coherence stabilizes under executive control."
    );
  }
  summaryParts.push(
    `Indicative operational reality coherence is ${(input.state.operationalRealityCoherenceScore * 100).toFixed(0)}% with unified state score at ${(input.state.unifiedOperationalStateScore * 100).toFixed(0)}% and instability at ${(input.state.realityInstabilityScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.realityAmbiguityDisclaimer || REALITY_AMBIGUITY_DISCLAIMER);
  summaryParts.push(
    input.state.nonAutonomousRealityDisclaimer || NON_AUTONOMOUS_REALITY_DISCLAIMER
  );

  const realitySummaries = input.state.activeRealitySignals.map((s) => {
    const drivers = (s.dominantRealityDrivers ?? []).join(", ") || "reality_drivers";
    return `${s.realityId}: ${s.realityState} (${drivers}, strength ${(s.realityStrength * 100).toFixed(0)}%).`;
  });

  const operationalStateSummaries = input.state.unifiedOperationalStateRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const evolutionSummaries = input.state.realityEvolutionRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.evolvingRealityZones.length > 0) {
    bullets.push(`Evolving reality zones: ${input.state.evolvingRealityZones.join(", ")}.`);
  }
  if (input.state.unstableRealityZones.length > 0) {
    bullets.push(`Unstable reality zones: ${input.state.unstableRealityZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora models strategic operational reality; enterprise evolution decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    realitySummaries: Object.freeze(realitySummaries),
    operationalStateSummaries: Object.freeze(operationalStateSummaries),
    evolutionSummaries: Object.freeze(evolutionSummaries),
    bullets: Object.freeze(bullets),
  });
}
