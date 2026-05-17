/**
 * D7:7:6 — Executive-readable enterprise strategic reality evolution semantics.
 */

import type {
  EnterpriseStrategicRealityEvolutionSemantics,
  EnterpriseStrategicRealityEvolutionIntelligenceState,
} from "./enterpriseStrategicRealityEvolutionTypes.ts";
import {
  EVOLUTION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_EVOLUTION_DISCLAIMER,
} from "./enterpriseStrategicRealityEvolutionGuards.ts";

export function buildEnterpriseStrategicRealityEvolutionSemantics(input: {
  state: EnterpriseStrategicRealityEvolutionIntelligenceState;
}): EnterpriseStrategicRealityEvolutionSemantics {
  const organizationalTransform = input.state.longHorizonTransformationRecords.find((r) =>
    r.recordId.includes("organizational")
  );
  const recoveryTransform = input.state.longHorizonTransformationRecords.find((r) =>
    r.recordId.includes("recovery-to-transformation")
  );
  const unstableTransition = input.state.evolutionaryTransitionRecords.find((r) =>
    r.recordId.includes("unstable-organizational")
  );

  const headline =
    input.state.executiveEvolutionLabel === "stable" ||
    input.state.executiveEvolutionLabel === "adaptive" ||
    input.state.executiveEvolutionLabel === "transforming"
      ? "Enterprise operational systems are gradually transitioning toward a more resilient recovery structure as governance synchronization improves and dependency concentration weakens across logistics coordination pathways."
      : input.state.executiveEvolutionLabel === "accelerating"
        ? unstableTransition
          ? unstableTransition.explanation
          : organizationalTransform
            ? organizationalTransform.explanation
            : "Enterprise reality evolution may be accelerating as transitional instability accumulates across domains."
        : input.state.executiveEvolutionLabel === "critical"
          ? unstableTransition
            ? unstableTransition.explanation
            : "Critical evolution conditions may threaten coherent transformation under sustained strategic pressure."
          : recoveryTransform
            ? recoveryTransform.explanation
            : "Enterprise strategic reality evolution remains under active assessment across interconnected systems.";

  const summaryParts: string[] = [];
  if (input.state.executiveEvolutionLabel === "stable") {
    summaryParts.push(
      "Stable evolution may indicate coherent long-horizon transformation with preserved operational structure."
    );
  } else if (input.state.executiveEvolutionLabel === "adaptive") {
    summaryParts.push(
      "Adaptive evolution may reflect gradual operational transformation under improving coordination."
    );
  } else if (input.state.executiveEvolutionLabel === "transforming") {
    summaryParts.push(
      "Transforming evolution may signal emerging structural change across enterprise operational ecosystems."
    );
  } else if (input.state.executiveEvolutionLabel === "accelerating") {
    summaryParts.push(
      "Accelerating evolution may indicate rising transitional instability during strategic restructuring."
    );
  } else {
    summaryParts.push(
      "Critical evolution conditions may elevate transformation risk until coherence stabilizes under executive control."
    );
  }
  summaryParts.push(
    `Indicative transformation coherence is ${(input.state.transformationCoherenceScore * 100).toFixed(0)}% with long-horizon evolution at ${(input.state.longHorizonEvolutionScore * 100).toFixed(0)}% and transition instability at ${(input.state.transitionInstabilityScore * 100).toFixed(0)}%.`
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

  const transformationSummaries = input.state.longHorizonTransformationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const transitionSummaries = input.state.evolutionaryTransitionRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.adaptiveEvolutionZones.length > 0) {
    bullets.push(
      `Adaptive evolution zones: ${input.state.adaptiveEvolutionZones.join(", ")}.`
    );
  }
  if (input.state.unstableTransitionZones.length > 0) {
    bullets.push(
      `Unstable transition zones: ${input.state.unstableTransitionZones.join(", ")}.`
    );
  }
  bullets.push(
    "Nexora models current reality, transformation, and future reality; strategic authority remains fully under executive control."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    evolutionSummaries: Object.freeze(evolutionSummaries),
    transformationSummaries: Object.freeze(transformationSummaries),
    transitionSummaries: Object.freeze(transitionSummaries),
    bullets: Object.freeze(bullets),
  });
}
