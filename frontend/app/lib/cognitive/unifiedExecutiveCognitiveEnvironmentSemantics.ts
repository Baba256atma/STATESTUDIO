/**
 * D7:6:9 — Executive-readable unified cognitive environment semantics.
 */

import type {
  UnifiedExecutiveCognitiveEnvironmentSemantics,
  UnifiedExecutiveCognitiveEnvironmentIntelligenceState,
} from "./unifiedExecutiveCognitiveEnvironmentTypes.ts";
import {
  ENVIRONMENT_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_ENVIRONMENT_DISCLAIMER,
} from "./cognitiveEnvironmentGuards.ts";

export function buildUnifiedExecutiveCognitiveEnvironmentSemantics(input: {
  state: UnifiedExecutiveCognitiveEnvironmentIntelligenceState;
}): UnifiedExecutiveCognitiveEnvironmentSemantics {
  const narrativeTimelineSync = input.state.crossCognitiveSynchronizationRecords.find((r) =>
    r.recordId.includes("narrative-timeline")
  );
  const layerDivergence = input.state.cognitiveEnvironmentFragmentationRecords.find((r) =>
    r.recordId.includes("layer-divergence")
  );
  const governanceSync = input.state.crossCognitiveSynchronizationRecords.find((r) =>
    r.recordId.includes("governance-awareness")
  );

  const headline =
    input.state.executiveEnvironmentLabel === "synchronized" ||
    input.state.executiveEnvironmentLabel === "coherent"
      ? "Executive cognitive systems remain broadly synchronized around recovery stabilization pathways, although predictive volatility across manufacturing governance systems is beginning to fragment long-horizon strategic continuity."
      : input.state.executiveEnvironmentLabel === "transitional"
        ? "Executive cognitive environment may be in transitional alignment as panels and timelines shift while core strategic context remains partially synchronized."
        : input.state.executiveEnvironmentLabel === "fragmented" ||
            input.state.executiveEnvironmentLabel === "critical"
          ? layerDivergence
            ? layerDivergence.explanation
            : "Unified executive cognition may require consolidation when cognitive layers diverge across timelines, narratives, and immersion systems."
          : narrativeTimelineSync
            ? narrativeTimelineSync.explanation
            : governanceSync
              ? governanceSync.explanation
              : "Unified executive cognitive environment remains under active assessment across strategic operational pathways.";

  const summaryParts: string[] = [];
  if (input.state.executiveEnvironmentLabel === "coherent") {
    summaryParts.push(
      "Coherent environment may indicate aligned cognition layers with stable cross-panel context."
    );
  } else if (input.state.executiveEnvironmentLabel === "synchronized") {
    summaryParts.push(
      "Synchronized environment may reflect seamless integration across timelines, narratives, simulations, and presence layers."
    );
  } else if (input.state.executiveEnvironmentLabel === "transitional") {
    summaryParts.push(
      "Transitional environment may reflect shifting context as executives move between panels without full fragmentation."
    );
  } else if (input.state.executiveEnvironmentLabel === "fragmented") {
    summaryParts.push(
      "Fragmented environment may suggest disconnected systems are weakening unified executive experience."
    );
  } else {
    summaryParts.push(
      "Critical environment conditions may elevate continuity risk until cognitive layers resynchronize under executive control."
    );
  }
  summaryParts.push(
    `Indicative environment coherence is ${(input.state.environmentCoherenceScore * 100).toFixed(0)}% with cross-cognitive sync at ${(input.state.crossCognitiveSyncScore * 100).toFixed(0)}% and fragmentation at ${(input.state.environmentFragmentationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.environmentAmbiguityDisclaimer || ENVIRONMENT_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonManipulationEnvironmentDisclaimer || NON_MANIPULATION_ENVIRONMENT_DISCLAIMER
  );

  const environmentSummaries = input.state.activeEnvironmentSignals.map((s) => {
    const drivers = (s.dominantEnvironmentDrivers ?? []).join(", ") || "environment_drivers";
    return `${s.environmentId}: ${s.environmentState} (${drivers}, strength ${(s.environmentStrength * 100).toFixed(0)}%).`;
  });

  const syncSummaries = input.state.crossCognitiveSynchronizationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const fragmentationSummaries = input.state.cognitiveEnvironmentFragmentationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.synchronizedCognitionZones.length > 0) {
    bullets.push(
      `Synchronized cognition zones: ${input.state.synchronizedCognitionZones.join(", ")}.`
    );
  }
  if (input.state.fragmentedEnvironmentZones.length > 0) {
    bullets.push(
      `Fragmented environment zones: ${input.state.fragmentedEnvironmentZones.join(", ")}.`
    );
  }
  bullets.push(
    "Nexora supports unified executive cognition; environment integration decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    environmentSummaries: Object.freeze(environmentSummaries),
    syncSummaries: Object.freeze(syncSummaries),
    fragmentationSummaries: Object.freeze(fragmentationSummaries),
    bullets: Object.freeze(bullets),
  });
}
