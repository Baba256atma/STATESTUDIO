/**
 * D7:8:1 — Executive-readable meta-strategic semantics.
 */

import type {
  MetaStrategicSemantics,
  MetaStrategicIntelligenceState,
} from "./metaStrategicTypes.ts";
import {
  META_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_META_DISCLAIMER,
} from "./metaStrategicGuards.ts";

export function buildMetaStrategicSemantics(input: {
  state: MetaStrategicIntelligenceState;
}): MetaStrategicSemantics {
  const optimizationTension = input.state.strategicEvolutionRecords.find((r) =>
    r.recordId.includes("optimization-stability")
  );
  const resilienceTradeoff = input.state.strategicEvolutionRecords.find((r) =>
    r.recordId.includes("resilience-tradeoff")
  );
  const resilienceImbalance = input.state.metaCoherenceRecords.find((r) =>
    r.recordId.includes("resilience-optimization")
  );

  const headline =
    input.state.executiveMetaLabel === "stable" ||
    input.state.executiveMetaLabel === "adaptive"
      ? optimizationTension && input.state.metaInstabilityScore >= 0.4
        ? "Current enterprise optimization strategies continue improving operational efficiency, although long-horizon resilience degradation and dependency concentration are beginning to introduce meta-strategic instability risks."
        : "Enterprise meta-strategic intelligence may remain broadly coherent as strategies evolve adaptively across operational and predictive domains under executive control."
      : input.state.executiveMetaLabel === "transforming"
        ? resilienceTradeoff
          ? resilienceTradeoff.explanation
          : "Long-horizon strategic transformation may be reshaping how enterprise strategies interact across interconnected decision ecosystems."
        : input.state.executiveMetaLabel === "fragmented"
          ? resilienceImbalance
            ? resilienceImbalance.explanation
            : "Meta-strategic fragmentation may signal conflicting strategic trajectories that weaken long-horizon organizational coherence."
          : input.state.executiveMetaLabel === "critical"
            ? "Critical meta-strategic conditions may elevate when strategy evolution, resilience tradeoffs, and governance instability compound under sustained pressure."
            : optimizationTension
              ? optimizationTension.explanation
              : "Enterprise meta-strategic intelligence remains under active assessment across strategy evolution pathways.";

  const summaryParts: string[] = [];
  if (input.state.executiveMetaLabel === "stable") {
    summaryParts.push(
      "Stable meta-strategic conditions may indicate coherent strategy evolution with manageable long-horizon tradeoffs."
    );
  } else if (input.state.executiveMetaLabel === "adaptive") {
    summaryParts.push(
      "Adaptive meta-strategic conditions may reflect effective strategy rebalancing under changing operational realities."
    );
  } else if (input.state.executiveMetaLabel === "transforming") {
    summaryParts.push(
      "Transforming meta-strategic conditions may signal substantive long-horizon shifts in how enterprise strategies interact."
    );
  } else if (input.state.executiveMetaLabel === "fragmented") {
    summaryParts.push(
      "Fragmented meta-strategic conditions may elevate when competing strategies undermine shared resilience and continuity objectives."
    );
  } else {
    summaryParts.push(
      "Critical meta-strategic conditions may threaten coherent strategy evolution until stabilization pathways strengthen under executive control."
    );
  }
  summaryParts.push(
    `Indicative meta-coherence is ${(input.state.strategicMetaCoherenceScore * 100).toFixed(0)}% with evolution at ${(input.state.strategicEvolutionScore * 100).toFixed(0)}% and instability at ${(input.state.metaInstabilityScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.metaAmbiguityDisclaimer || META_AMBIGUITY_DISCLAIMER);
  summaryParts.push(
    input.state.nonAutonomousMetaDisclaimer || NON_AUTONOMOUS_META_DISCLAIMER
  );

  const metaSummaries = input.state.activeMetaSignals.map((s) => {
    const drivers = (s.dominantMetaDrivers ?? []).join(", ") || "meta_drivers";
    return `${s.metaId}: ${s.metaState} (${drivers}, strength ${(s.metaStrength * 100).toFixed(0)}%).`;
  });

  const evolutionSummaries = input.state.strategicEvolutionRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const coherenceSummaries = input.state.metaCoherenceRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.adaptiveStrategyZones.length > 0) {
    bullets.push(
      `Adaptive strategy zones: ${input.state.adaptiveStrategyZones.join(", ")}.`
    );
  }
  if (input.state.unstableMetaZones.length > 0) {
    bullets.push(`Unstable meta zones: ${input.state.unstableMetaZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora models strategy evolution, coherence, and enterprise strategy dynamics; strategic authority remains fully under executive control."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    metaSummaries: Object.freeze(metaSummaries),
    evolutionSummaries: Object.freeze(evolutionSummaries),
    coherenceSummaries: Object.freeze(coherenceSummaries),
    bullets: Object.freeze(bullets),
  });
}
