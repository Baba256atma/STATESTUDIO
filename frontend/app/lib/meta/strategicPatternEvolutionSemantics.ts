/**
 * D7:8:2 — Executive-readable strategic pattern evolution semantics.
 */

import type {
  StrategicPatternEvolutionSemantics,
  StrategicPatternEvolutionIntelligenceState,
} from "./strategicPatternEvolutionTypes.ts";
import {
  PATTERN_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_PATTERN_DISCLAIMER,
} from "./strategicPatternEvolutionGuards.ts";

export function buildStrategicPatternEvolutionSemantics(input: {
  state: StrategicPatternEvolutionIntelligenceState;
}): StrategicPatternEvolutionSemantics {
  const optimizationPattern = input.state.longHorizonPatternRecords.find((r) =>
    r.recordId.includes("optimization-risk")
  );
  const resiliencePattern = input.state.longHorizonPatternRecords.find((r) =>
    r.recordId.includes("resilience-adaptation")
  );
  const continuityDegradation = input.state.patternInstabilityRecords.find((r) =>
    r.recordId.includes("continuity-degradation")
  );

  const headline =
    input.state.executivePatternLabel === "degrading" ||
    (input.state.executivePatternLabel === "emerging" &&
      input.state.patternInstabilityScore >= 0.45)
      ? optimizationPattern && input.state.patternInstabilityScore >= 0.4
        ? "Enterprise operational behavior increasingly reflects a recurring optimization-driven fragility pattern in which short-term efficiency gains continue weakening long-horizon resilience and recovery continuity."
        : continuityDegradation
          ? continuityDegradation.explanation
          : "Recurring strategic behaviors may be forming degrading enterprise patterns that weaken long-horizon continuity under sustained optimization pressure."
      : input.state.executivePatternLabel === "adaptive" ||
          input.state.executivePatternLabel === "stabilizing"
        ? resiliencePattern
          ? resiliencePattern.explanation
          : "Enterprise strategic patterns may be stabilizing into adaptive structures that reinforce continuity and resilience across operational domains."
        : input.state.executivePatternLabel === "critical"
          ? "Critical pattern conditions may elevate when recurring strategic failures compound across recovery, governance, and continuity systems."
          : input.state.executivePatternLabel === "emerging"
            ? "Emerging strategic patterns may indicate recognizable long-horizon behaviors forming across enterprise operational realities."
            : optimizationPattern
              ? optimizationPattern.explanation
              : "Strategic pattern evolution remains under active assessment across recurring enterprise behaviors.";

  const summaryParts: string[] = [];
  if (input.state.executivePatternLabel === "emerging") {
    summaryParts.push(
      "Emerging patterns may indicate early recognition of recurring strategic behaviors across domains."
    );
  } else if (input.state.executivePatternLabel === "stabilizing") {
    summaryParts.push(
      "Stabilizing patterns may reflect durable recurring structures that support continuity equilibrium."
    );
  } else if (input.state.executivePatternLabel === "adaptive") {
    summaryParts.push(
      "Adaptive patterns may signal positive long-horizon resilience growth through repeated governance coordination."
    );
  } else if (input.state.executivePatternLabel === "degrading") {
    summaryParts.push(
      "Degrading patterns may elevate when recurring optimization and fragility accumulation weaken shared resilience goals."
    );
  } else {
    summaryParts.push(
      "Critical pattern conditions may threaten coherent strategic evolution until stabilization pathways strengthen under executive control."
    );
  }
  summaryParts.push(
    `Indicative pattern coherence is ${(input.state.patternCoherenceScore * 100).toFixed(0)}% with long-horizon pattern strength at ${(input.state.longHorizonPatternScore * 100).toFixed(0)}% and instability at ${(input.state.patternInstabilityScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.patternAmbiguityDisclaimer || PATTERN_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousPatternDisclaimer || NON_AUTONOMOUS_PATTERN_DISCLAIMER
  );

  const patternSummaries = input.state.activePatternSignals.map((s) => {
    const drivers = (s.dominantPatternDrivers ?? []).join(", ") || "pattern_drivers";
    return `${s.patternId}: ${s.patternState} (${drivers}, strength ${(s.patternStrength * 100).toFixed(0)}%).`;
  });

  const longHorizonSummaries = input.state.longHorizonPatternRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const instabilitySummaries = input.state.patternInstabilityRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.adaptivePatternZones.length > 0) {
    bullets.push(
      `Adaptive pattern zones: ${input.state.adaptivePatternZones.join(", ")}.`
    );
  }
  if (input.state.unstablePatternZones.length > 0) {
    bullets.push(`Unstable pattern zones: ${input.state.unstablePatternZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora models recurring strategy, pattern evolution, and long-horizon consequences; strategic authority remains fully under executive control."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    patternSummaries: Object.freeze(patternSummaries),
    longHorizonSummaries: Object.freeze(longHorizonSummaries),
    instabilitySummaries: Object.freeze(instabilitySummaries),
    bullets: Object.freeze(bullets),
  });
}
