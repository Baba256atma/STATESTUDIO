/**
 * D7:8:9 — Executive-readable unified meta-strategic semantics.
 */

import type {
  UnifiedMetaStrategicSemantics,
  UnifiedMetaStrategicIntelligenceState,
} from "./unifiedMetaStrategicTypes.ts";
import {
  UNIFIED_META_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_UNIFIED_META_DISCLAIMER,
} from "./unifiedMetaStrategicGuards.ts";

export function buildUnifiedMetaStrategicSemantics(input: {
  state: UnifiedMetaStrategicIntelligenceState;
}): UnifiedMetaStrategicSemantics {
  const longHorizonSync = input.state.crossIntelligenceSynchronizationRecords.find((r) =>
    r.recordId.includes("long-horizon-coherence")
  );
  const ecosystemFragmentation = input.state.unifiedMetaCoherenceRecords.find((r) =>
    r.recordId.includes("ecosystem-fragmentation")
  );
  const driftDegradation = input.state.unifiedMetaCoherenceRecords.find((r) =>
    r.recordId.includes("long-horizon-degradation")
  );

  const headline =
    input.state.executiveUnifiedMetaLabel === "coherent" ||
    input.state.executiveUnifiedMetaLabel === "adaptive" ||
    input.state.executiveUnifiedMetaLabel === "transforming"
      ? longHorizonSync && input.state.ecosystemFragmentationScore >= 0.35
        ? "Enterprise strategic intelligence remains broadly coherent as resilience adaptation, continuity preservation, and governance synchronization continue stabilizing long-horizon strategic evolution, although optimization pressure and predictive volatility still threaten equilibrium continuity."
        : "Enterprise strategic intelligence may remain unified as meta-intelligence layers synchronize into one long-horizon cognition ecosystem under executive oversight."
      : input.state.executiveUnifiedMetaLabel === "fragmented"
        ? driftDegradation
          ? driftDegradation.explanation
          : ecosystemFragmentation
            ? ecosystemFragmentation.explanation
            : "Unified strategic intelligence may be fragmenting as meta-intelligence layers desynchronize across enterprise cognition systems."
        : input.state.executiveUnifiedMetaLabel === "critical"
          ? "Critical unified meta conditions may elevate when strategic ecosystem fragmentation compounds across all intelligence layers."
          : longHorizonSync
            ? longHorizonSync.explanation
            : "Unified meta-strategic intelligence remains under active assessment across enterprise cognition systems.";

  const summaryParts: string[] = [];
  if (input.state.executiveUnifiedMetaLabel === "coherent") {
    summaryParts.push(
      "Coherent unified meta may indicate all strategic intelligence layers synchronize into one stable long-horizon ecosystem."
    );
  } else if (input.state.executiveUnifiedMetaLabel === "adaptive") {
    summaryParts.push(
      "Adaptive unified meta may reflect cross-layer synchronization absorbing disruption without ecosystem fragmentation."
    );
  } else if (input.state.executiveUnifiedMetaLabel === "transforming") {
    summaryParts.push(
      "Transforming unified meta may signal the enterprise cognition ecosystem evolving through coordinated layer adaptation."
    );
  } else if (input.state.executiveUnifiedMetaLabel === "fragmented") {
    summaryParts.push(
      "Fragmented unified meta may elevate when operational continuity improves but strategic drift accelerates across pathways."
    );
  } else {
    summaryParts.push(
      "Critical unified meta conditions may threaten strategic coherence until layer synchronization strengthens under executive control."
    );
  }
  summaryParts.push(
    `Indicative unified strategic coherence is ${(input.state.unifiedStrategicCoherenceScore * 100).toFixed(0)}% with meta synchronization at ${(input.state.metaSynchronizationScore * 100).toFixed(0)}% and ecosystem fragmentation at ${(input.state.ecosystemFragmentationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.unifiedMetaAmbiguityDisclaimer || UNIFIED_META_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousUnifiedMetaDisclaimer || NON_AUTONOMOUS_UNIFIED_META_DISCLAIMER
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    unifiedMetaSummaries: Object.freeze(
      input.state.activeUnifiedMetaSignals.map((s) => {
        const drivers = (s.dominantUnifiedDrivers ?? []).join(", ") || "unified_drivers";
        return `${s.unifiedMetaId}: ${s.unifiedMetaState} (${drivers}, strength ${(s.unifiedMetaStrength * 100).toFixed(0)}%).`;
      })
    ),
    synchronizationSummaries: Object.freeze(
      input.state.crossIntelligenceSynchronizationRecords.slice(0, 4).map((r) => r.explanation)
    ),
    coherenceSummaries: Object.freeze(
      input.state.unifiedMetaCoherenceRecords.slice(0, 4).map((r) => r.explanation)
    ),
    bullets: Object.freeze([
      ...(input.state.synchronizedMetaZones.length > 0
        ? [`Synchronized meta zones: ${input.state.synchronizedMetaZones.join(", ")}.`]
        : []),
      ...(input.state.fragmentedMetaZones.length > 0
        ? [`Fragmented meta zones: ${input.state.fragmentedMetaZones.join(", ")}.`]
        : []),
      "Nexora unifies multi-layer strategic intelligence into one enterprise meta-cognition ecosystem; strategic authority remains fully under executive control.",
    ]),
  });
}
