/**
 * D7:6:8 — Executive-readable strategic presence semantics.
 */

import type {
  ExecutiveStrategicPresenceSemantics,
  ExecutiveStrategicPresenceIntelligenceState,
} from "./executiveStrategicPresenceTypes.ts";
import {
  PRESENCE_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_PRESENCE_DISCLAIMER,
} from "./strategicPresenceGuards.ts";

export function buildExecutiveStrategicPresenceSemantics(input: {
  state: ExecutiveStrategicPresenceIntelligenceState;
}): ExecutiveStrategicPresenceSemantics {
  const operationalLayer = input.state.situationalAwarenessLayerRecords.find((r) =>
    r.recordId.includes("operational-awareness")
  );
  const predictiveLayer = input.state.situationalAwarenessLayerRecords.find((r) =>
    r.recordId.includes("predictive-evolution")
  );
  const fragmentationRecord = input.state.presenceFragmentationRecords.find((r) =>
    r.recordId.includes("awareness-instability")
  );

  const headline =
    input.state.executivePresenceLabel === "sustained" ||
    input.state.executivePresenceLabel === "focused"
      ? "Executive strategic awareness remains stable across logistics recovery systems, although increasing predictive volatility and governance fragmentation are beginning to reduce long-horizon situational continuity."
      : input.state.executivePresenceLabel === "aware"
        ? "Executive strategic awareness may remain observational across operational regions while situational continuity stays within manageable bounds."
        : input.state.executivePresenceLabel === "fragmented" ||
            input.state.executivePresenceLabel === "critical"
          ? fragmentationRecord
            ? fragmentationRecord.explanation
            : operationalLayer
              ? operationalLayer.explanation
              : "Strategic presence fragmentation may reduce decision quality until situational continuity stabilizes under executive control."
          : predictiveLayer
            ? predictiveLayer.explanation
            : "Executive strategic presence remains under active assessment across operational pathways.";

  const summaryParts: string[] = [];
  if (input.state.executivePresenceLabel === "aware") {
    summaryParts.push(
      "Aware presence may indicate baseline situational scanning with manageable continuity across domains."
    );
  } else if (input.state.executivePresenceLabel === "focused") {
    summaryParts.push(
      "Focused presence may reflect sustained strategic attention across evolving operational realities."
    );
  } else if (input.state.executivePresenceLabel === "sustained") {
    summaryParts.push(
      "Sustained presence may indicate continuous cross-domain awareness during complex decision cycles."
    );
  } else if (input.state.executivePresenceLabel === "fragmented") {
    summaryParts.push(
      "Fragmented presence may suggest disconnected future branches are reducing long-horizon situational continuity."
    );
  } else {
    summaryParts.push(
      "Critical presence conditions may elevate continuity risk until strategic awareness consolidates under executive control."
    );
  }
  summaryParts.push(
    `Indicative situational continuity is ${(input.state.situationalContinuityScore * 100).toFixed(0)}% with multi-layer awareness at ${(input.state.multiLayerAwarenessScore * 100).toFixed(0)}% and fragmentation at ${(input.state.presenceFragmentationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.presenceAmbiguityDisclaimer || PRESENCE_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonManipulationPresenceDisclaimer || NON_MANIPULATION_PRESENCE_DISCLAIMER
  );

  const presenceSummaries = input.state.activePresenceSignals.map((s) => {
    const drivers = (s.dominantPresenceDrivers ?? []).join(", ") || "presence_drivers";
    return `${s.presenceId}: ${s.presenceState} (${drivers}, strength ${(s.presenceStrength * 100).toFixed(0)}%).`;
  });

  const layerSummaries = input.state.situationalAwarenessLayerRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const fragmentationSummaries = input.state.presenceFragmentationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.sustainedAwarenessZones.length > 0) {
    bullets.push(`Sustained awareness zones: ${input.state.sustainedAwarenessZones.join(", ")}.`);
  }
  if (input.state.fragmentedPresenceZones.length > 0) {
    bullets.push(
      `Fragmented presence zones: ${input.state.fragmentedPresenceZones.join(", ")}.`
    );
  }
  bullets.push(
    "Nexora supports strategic presence for executive situational awareness; continuity decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    presenceSummaries: Object.freeze(presenceSummaries),
    layerSummaries: Object.freeze(layerSummaries),
    fragmentationSummaries: Object.freeze(fragmentationSummaries),
    bullets: Object.freeze(bullets),
  });
}
