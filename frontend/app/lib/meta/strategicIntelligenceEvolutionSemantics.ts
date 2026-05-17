/**
 * D7:8:6 — Executive-readable strategic intelligence evolution semantics.
 */

import type {
  StrategicIntelligenceEvolutionSemantics,
  StrategicIntelligenceEvolutionIntelligenceState,
} from "./strategicIntelligenceEvolutionTypes.ts";
import {
  EVOLUTION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_EVOLUTION_DISCLAIMER,
} from "./strategicIntelligenceEvolutionGuards.ts";

export function buildStrategicIntelligenceEvolutionSemantics(input: {
  state: StrategicIntelligenceEvolutionIntelligenceState;
}): StrategicIntelligenceEvolutionSemantics {
  const governanceEvolution = input.state.longHorizonEvolutionRecords.find((r) =>
    r.recordId.includes("governance-evolution")
  );
  const unstableTransformation = input.state.strategicTransformationRecords.find((r) =>
    r.recordId.includes("unstable-transformation")
  );
  const strategicContradiction = input.state.strategicTransformationRecords.find((r) =>
    r.recordId.includes("strategic-contradiction")
  );

  const headline =
    input.state.executiveEvolutionLabel === "stable" ||
    input.state.executiveEvolutionLabel === "adaptive" ||
    input.state.executiveEvolutionLabel === "accelerating"
      ? governanceEvolution && input.state.transformationPressureScore >= 0.35
        ? "Enterprise strategic intelligence continues evolving toward stronger resilience coordination and continuity preservation, although predictive volatility and optimization pressure are still introducing instability across long-horizon transformation pathways."
        : "Enterprise strategic intelligence may continue maturing as resilience adaptation and continuity preservation strengthen long-horizon strategic capability under executive oversight."
      : input.state.executiveEvolutionLabel === "transforming"
        ? unstableTransformation
          ? unstableTransformation.explanation
          : strategicContradiction
            ? strategicContradiction.explanation
            : "Strategic intelligence evolution may be unstable as transformation pressure and predictive volatility introduce tension across long-horizon pathways."
        : input.state.executiveEvolutionLabel === "critical"
          ? "Critical evolution conditions may elevate when negative strategic trajectories compound across governance, resilience, and continuity systems."
          : governanceEvolution
            ? governanceEvolution.explanation
            : "Strategic intelligence evolution remains under active assessment across enterprise cognition systems.";

  const summaryParts: string[] = [];
  if (input.state.executiveEvolutionLabel === "stable") {
    summaryParts.push(
      "Stable evolution may indicate strategic intelligence matures without degrading long-horizon coherence."
    );
  } else if (input.state.executiveEvolutionLabel === "adaptive") {
    summaryParts.push(
      "Adaptive evolution may reflect strategic intelligence transforming through resilience learning without fragmentation collapse."
    );
  } else if (input.state.executiveEvolutionLabel === "accelerating") {
    summaryParts.push(
      "Accelerating evolution may signal positive strategic maturation as recovery adaptation and governance coordination strengthen."
    );
  } else if (input.state.executiveEvolutionLabel === "transforming") {
    summaryParts.push(
      "Transforming evolution may elevate when operational adaptation and predictive coherence diverge across pathways."
    );
  } else {
    summaryParts.push(
      "Critical evolution conditions may threaten strategic continuity until stabilization pathways strengthen under executive control."
    );
  }
  summaryParts.push(
    `Indicative evolution coherence is ${(input.state.strategicEvolutionCoherenceScore * 100).toFixed(0)}% with adaptive transformation at ${(input.state.adaptiveTransformationScore * 100).toFixed(0)}% and transformation pressure at ${(input.state.transformationPressureScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.evolutionAmbiguityDisclaimer || EVOLUTION_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousEvolutionDisclaimer || NON_AUTONOMOUS_EVOLUTION_DISCLAIMER
  );

  const evolutionSummaries = input.state.activeEvolutionSignals.map((s) => {
    const drivers = (s.dominantEvolutionDrivers ?? []).join(", ") || "evolution_drivers";
    return `${s.evolutionId}: ${s.evolutionState} (${drivers}, strength ${(s.evolutionStrength * 100).toFixed(0)}%).`;
  });

  const longHorizonSummaries = input.state.longHorizonEvolutionRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const transformationSummaries = input.state.strategicTransformationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.adaptiveEvolutionZones.length > 0) {
    bullets.push(
      `Adaptive evolution zones: ${input.state.adaptiveEvolutionZones.join(", ")}.`
    );
  }
  if (input.state.unstableTransformationZones.length > 0) {
    bullets.push(
      `Unstable transformation zones: ${input.state.unstableTransformationZones.join(", ")}.`
    );
  }
  bullets.push(
    "Nexora models current strategic intelligence, transformation, and future capability; strategic authority remains fully under executive control."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    evolutionSummaries: Object.freeze(evolutionSummaries),
    longHorizonSummaries: Object.freeze(longHorizonSummaries),
    transformationSummaries: Object.freeze(transformationSummaries),
    bullets: Object.freeze(bullets),
  });
}
