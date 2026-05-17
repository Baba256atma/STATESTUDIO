/**
 * D7:8:10 — Executive-readable meta-strategic completion semantics.
 */

import type {
  MetaStrategicCompletionSemantics,
  MetaStrategicCompletionIntelligenceState,
} from "./metaStrategicCompletionTypes.ts";
import {
  COMPLETION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_COMPLETION_DISCLAIMER,
} from "./metaStrategicCompletionGuards.ts";

export function buildMetaStrategicCompletionSemantics(input: {
  state: MetaStrategicCompletionIntelligenceState;
}): MetaStrategicCompletionSemantics {
  const longHorizonSync = input.state.enterpriseCognitionSynchronizationRecords.find((r) =>
    r.recordId.includes("long-horizon-coherence")
  );
  const cognitionFragmentation = input.state.strategicWorldCoherenceRecords.find((r) =>
    r.recordId.includes("cognition-fragmentation")
  );
  const cognitionDegradation = input.state.strategicWorldCoherenceRecords.find((r) =>
    r.recordId.includes("cognition-degradation")
  );

  const headline =
    input.state.executiveCompletionLabel === "stable" ||
    input.state.executiveCompletionLabel === "coherent" ||
    input.state.executiveCompletionLabel === "synchronized"
      ? longHorizonSync && input.state.worldFragmentationScore >= 0.35
        ? "Enterprise strategic cognition remains broadly synchronized as resilience adaptation, governance continuity, and predictive coherence continue stabilizing long-horizon strategic evolution, although optimization pressure and strategic drift still threaten equilibrium continuity."
        : "Enterprise strategic cognition may remain finalized as all meta-intelligence layers synchronize into one integrated operational intelligence world under executive oversight."
      : input.state.executiveCompletionLabel === "fragmented"
        ? cognitionFragmentation
          ? cognitionFragmentation.explanation
          : cognitionDegradation
            ? cognitionDegradation.explanation
            : "Meta-strategic completion may be fragmenting as enterprise cognition pathways desynchronize across the strategic world."
        : input.state.executiveCompletionLabel === "critical"
          ? "Critical completion conditions may elevate when strategic world fragmentation compounds across all finalized cognition layers."
          : longHorizonSync
            ? longHorizonSync.explanation
            : "Meta-strategic intelligence completion remains under active assessment across the enterprise cognition ecosystem.";

  const summaryParts: string[] = [];
  if (input.state.executiveCompletionLabel === "stable") {
    summaryParts.push(
      "Stable completion may indicate the enterprise meta-cognitive platform is grounded and operationally coherent."
    );
  } else if (input.state.executiveCompletionLabel === "coherent") {
    summaryParts.push(
      "Coherent completion may reflect aligned meta-intelligence layers forming one strategic cognition environment."
    );
  } else if (input.state.executiveCompletionLabel === "synchronized") {
    summaryParts.push(
      "Synchronized completion may signal full enterprise cognition finalization across the meta-strategic stack."
    );
  } else if (input.state.executiveCompletionLabel === "fragmented") {
    summaryParts.push(
      "Fragmented completion may elevate when disconnected pathways weaken unified meta-operational intelligence."
    );
  } else {
    summaryParts.push(
      "Critical completion conditions may threaten strategic world coherence until synchronization strengthens under executive control."
    );
  }
  summaryParts.push(
    `Indicative enterprise meta-coherence is ${(input.state.enterpriseMetaCoherenceScore * 100).toFixed(0)}% with cognition synchronization at ${(input.state.cognitionSynchronizationScore * 100).toFixed(0)}% and world fragmentation at ${(input.state.worldFragmentationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.completionAmbiguityDisclaimer || COMPLETION_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousCompletionDisclaimer || NON_AUTONOMOUS_COMPLETION_DISCLAIMER
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    completionSummaries: Object.freeze(
      input.state.activeCompletionSignals.map((s) => {
        const drivers = (s.dominantCompletionDrivers ?? []).join(", ") || "completion_drivers";
        return `${s.completionId}: ${s.completionState} (${drivers}, strength ${(s.completionStrength * 100).toFixed(0)}%).`;
      })
    ),
    synchronizationSummaries: Object.freeze(
      input.state.enterpriseCognitionSynchronizationRecords.slice(0, 4).map((r) => r.explanation)
    ),
    worldCoherenceSummaries: Object.freeze(
      input.state.strategicWorldCoherenceRecords.slice(0, 4).map((r) => r.explanation)
    ),
    bullets: Object.freeze([
      ...(input.state.synchronizedMetaWorldZones.length > 0
        ? [`Synchronized meta-world zones: ${input.state.synchronizedMetaWorldZones.join(", ")}.`]
        : []),
      ...(input.state.fragmentedMetaWorldZones.length > 0
        ? [`Fragmented meta-world zones: ${input.state.fragmentedMetaWorldZones.join(", ")}.`]
        : []),
      "Nexora finalizes unified meta-strategic cognition into one enterprise intelligence environment; strategic authority remains fully under executive control.",
    ]),
  });
}
