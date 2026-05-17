/**
 * D7:6:5 — Executive-readable narrative semantics.
 */

import type {
  ExecutiveNarrativeSemantics,
  ExecutiveNarrativeIntelligenceState,
} from "./executiveNarrativeTypes.ts";
import {
  NARRATIVE_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_NARRATIVE_DISCLAIMER,
} from "./narrativeIntelligenceGuards.ts";

export function buildExecutiveNarrativeSemantics(input: {
  state: ExecutiveNarrativeIntelligenceState;
}): ExecutiveNarrativeSemantics {
  const recoveryContext = input.state.strategicContextRecords.find((r) =>
    r.recordId.includes("recovery-sequencing")
  );
  const predictiveContext = input.state.strategicContextRecords.find((r) =>
    r.recordId.includes("predictive-trajectory")
  );
  const topCoherence = input.state.narrativeCoherenceRecords[0];

  const headline =
    input.state.executiveNarrativeLabel === "fragmented" ||
    input.state.executiveNarrativeLabel === "critical" ||
    input.state.executiveNarrativeLabel === "complex"
      ? "Current operational patterns suggest that logistics dependency concentration is beginning to undermine recovery synchronization, increasing long-term volatility risk unless stabilization sequencing improves."
      : input.state.executiveNarrativeLabel === "clear"
        ? "Current stabilization momentum suggests that coordinated recovery sequencing may strengthen long-term resilience while reducing future operational volatility."
        : recoveryContext
          ? recoveryContext.explanation
          : predictiveContext
            ? predictiveContext.explanation
            : topCoherence
              ? topCoherence.explanation
              : "Executive narrative synthesis remains under active assessment across strategic operational pathways.";

  const summaryParts: string[] = [];
  if (input.state.executiveNarrativeLabel === "clear") {
    summaryParts.push(
      "Clear narrative framing may indicate coherent strategic context with stable executive understanding."
    );
  } else if (input.state.executiveNarrativeLabel === "developing") {
    summaryParts.push(
      "Developing narratives may reflect emerging operational context that warrants continued evidence-grounded synthesis."
    );
  } else if (input.state.executiveNarrativeLabel === "complex") {
    summaryParts.push(
      "Complex narratives may indicate multi-layer operational context requiring structured executive interpretation."
    );
  } else if (input.state.executiveNarrativeLabel === "fragmented") {
    summaryParts.push(
      "Fragmented narratives may signal interpretation gaps when competing signals lack integrated strategic framing."
    );
  } else {
    summaryParts.push(
      "Critical narrative conditions may elevate fragmentation risk until context synthesis stabilizes under executive control."
    );
  }
  summaryParts.push(
    `Indicative narrative clarity is ${(input.state.narrativeClarityScore * 100).toFixed(0)}% with strategic context at ${(input.state.strategicContextScore * 100).toFixed(0)}% and fragmentation at ${(input.state.narrativeFragmentationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.narrativeAmbiguityDisclaimer || NARRATIVE_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonManipulationNarrativeDisclaimer || NON_MANIPULATION_NARRATIVE_DISCLAIMER
  );

  const narrativeSummaries = input.state.activeNarratives.map((n) => {
    const drivers = (n.dominantNarrativeDrivers ?? []).join(", ") || "narrative_drivers";
    return `${n.narrativeId}: ${n.narrativeState} (${drivers}, strength ${(n.narrativeStrength * 100).toFixed(0)}%).`;
  });

  const contextSummaries = input.state.strategicContextRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const coherenceSummaries = input.state.narrativeCoherenceRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.strategicNarrativeZones.length > 0) {
    bullets.push(`Strategic narrative zones: ${input.state.strategicNarrativeZones.join(", ")}.`);
  }
  if (input.state.fragmentedNarrativeZones.length > 0) {
    bullets.push(`Fragmented narrative zones: ${input.state.fragmentedNarrativeZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora synthesizes narratives for executive support; strategic interpretation remains fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    narrativeSummaries: Object.freeze(narrativeSummaries),
    contextSummaries: Object.freeze(contextSummaries),
    coherenceSummaries: Object.freeze(coherenceSummaries),
    bullets: Object.freeze(bullets),
  });
}
