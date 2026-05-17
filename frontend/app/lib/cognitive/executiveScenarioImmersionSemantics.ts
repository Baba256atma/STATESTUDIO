/**
 * D7:6:7 — Executive-readable scenario immersion semantics.
 */

import type {
  ExecutiveScenarioImmersionSemantics,
  ExecutiveScenarioImmersionIntelligenceState,
} from "./executiveScenarioImmersionTypes.ts";
import {
  IMMERSION_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_IMMERSION_DISCLAIMER,
} from "./scenarioImmersionGuards.ts";

export function buildExecutiveScenarioImmersionSemantics(input: {
  state: ExecutiveScenarioImmersionIntelligenceState;
}): ExecutiveScenarioImmersionSemantics {
  const operationalLayer = input.state.scenarioEvolutionLayerRecords.find((r) =>
    r.recordId.includes("operational-evolution")
  );
  const recoveryLayer = input.state.scenarioEvolutionLayerRecords.find((r) =>
    r.recordId.includes("recovery-sequencing")
  );
  const overloadCognition = input.state.immersiveCognitionRecords.find((r) =>
    r.recordId.includes("immersion-overload")
  );

  const headline =
    input.state.executiveImmersionLabel === "immersed" ||
    input.state.executiveImmersionLabel === "engaged" ||
    input.state.executiveImmersionLabel === "overloaded" ||
    input.state.executiveImmersionLabel === "critical"
      ? "This scenario demonstrates how unresolved dependency concentration may gradually destabilize recovery coordination over multiple operational horizons while increasing long-term governance pressure."
      : input.state.executiveImmersionLabel === "observational"
        ? "Observational scenario immersion may support baseline understanding of how operational evolution unfolds across strategic horizons without overstating future outcomes."
        : operationalLayer
          ? operationalLayer.explanation
          : recoveryLayer
            ? recoveryLayer.explanation
            : overloadCognition
              ? overloadCognition.explanation
              : "Executive scenario immersion remains under active assessment across strategic operational pathways.";

  const summaryParts: string[] = [];
  if (input.state.executiveImmersionLabel === "observational") {
    summaryParts.push(
      "Observational immersion may indicate passive scenario review with manageable exploration depth."
    );
  } else if (input.state.executiveImmersionLabel === "engaged") {
    summaryParts.push(
      "Engaged immersion may reflect active strategic exploration across evolving operational futures."
    );
  } else if (input.state.executiveImmersionLabel === "immersed") {
    summaryParts.push(
      "Immersed cognition may indicate deep operational understanding across multi-layer scenario evolution."
    );
  } else if (input.state.executiveImmersionLabel === "overloaded") {
    summaryParts.push(
      "Immersion overload may suggest scenario branches exceed comfortable executive exploration capacity."
    );
  } else {
    summaryParts.push(
      "Critical immersion conditions may elevate exploration risk until scenario coherence stabilizes under executive control."
    );
  }
  summaryParts.push(
    `Indicative immersion clarity is ${(input.state.immersionClarityScore * 100).toFixed(0)}% with multi-layer scenario score at ${(input.state.multiLayerScenarioScore * 100).toFixed(0)}% and overload at ${(input.state.immersionOverloadScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.immersionAmbiguityDisclaimer || IMMERSION_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonManipulationImmersionDisclaimer || NON_MANIPULATION_IMMERSION_DISCLAIMER
  );

  const immersionSummaries = input.state.activeImmersionSignals.map((s) => {
    const drivers = (s.dominantImmersionDrivers ?? []).join(", ") || "immersion_drivers";
    return `${s.immersionId}: ${s.immersionState} (${drivers}, strength ${(s.immersionStrength * 100).toFixed(0)}%).`;
  });

  const layerSummaries = input.state.scenarioEvolutionLayerRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const cognitionSummaries = input.state.immersiveCognitionRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.deepExplorationZones.length > 0) {
    bullets.push(`Deep exploration zones: ${input.state.deepExplorationZones.join(", ")}.`);
  }
  if (input.state.cognitiveImmersionRiskZones.length > 0) {
    bullets.push(
      `Cognitive immersion risk zones: ${input.state.cognitiveImmersionRiskZones.join(", ")}.`
    );
  }
  bullets.push(
    "Nexora supports scenario immersion for executive understanding; strategic exploration decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    immersionSummaries: Object.freeze(immersionSummaries),
    layerSummaries: Object.freeze(layerSummaries),
    cognitionSummaries: Object.freeze(cognitionSummaries),
    bullets: Object.freeze(bullets),
  });
}
