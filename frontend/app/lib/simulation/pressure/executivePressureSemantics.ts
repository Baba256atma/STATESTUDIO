/**
 * D7:2:3 — Executive-readable dependency pressure semantics.
 */

import type {
  EnterprisePressureState,
  ExecutivePressureSemantics,
  PressurePropagationRecord,
} from "./dependencyPressureTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutivePressureSemantics(input: {
  state: EnterprisePressureState;
  propagationRecords: readonly PressurePropagationRecord[];
}): ExecutivePressureSemantics {
  const topHotspot = input.state.fragilityHotspots[0];
  const topSaturation = input.state.saturationRegions[0];
  const topPropagation = input.propagationRecords[0];

  const headline = topHotspot
    ? topHotspot.reason
    : topSaturation
      ? `${regionLabel(topSaturation)} dependency pressure is approaching operational saturation.`
      : topPropagation
        ? `Dependency stress is propagating from ${regionLabel(topPropagation.originRegionId)} toward ${regionLabel(topPropagation.affectedRegionId)}.`
        : "Enterprise dependency pressure remains within stable operating bounds.";

  const summaryParts: string[] = [];
  if (input.state.pressureStabilityLabel === "stable") {
    summaryParts.push("Operational dependencies are absorbing stress without systemic escalation.");
  } else if (input.state.pressureStabilityLabel === "elevated") {
    summaryParts.push("Dependency pressure is elevated in parts of the operational universe.");
  } else {
    summaryParts.push(
      "Concentrated fragility and saturation signals indicate cascading instability risk."
    );
  }
  summaryParts.push(
    `Systemic pressure is ${(input.state.systemicPressureScore * 100).toFixed(0)}% with cascade risk at ${(input.state.cascadeRiskScore * 100).toFixed(0)}%.`
  );

  const saturationSummaries = input.state.saturationRegions.map(
    (id) => `${regionLabel(id)} is operating near dependency saturation.`
  );

  const hotspotSummaries = input.state.fragilityHotspots.map((h) => h.reason);

  const propagationSummaries = input.propagationRecords.slice(0, 5).map((r) => {
    const origin = regionLabel(r.originRegionId);
    const affected = regionLabel(r.affectedRegionId);
    return `${origin} stress is influencing ${affected} through operational dependencies.`;
  });

  const bullets: string[] = [];
  if (topHotspot) bullets.push(topHotspot.reason);
  for (const acc of [...input.state.regionAccumulations]
    .sort((a, b) => b.accumulatedPressure - a.accumulatedPressure)
    .slice(0, 2)) {
    if (acc.accumulatedPressure > 0.55) {
      bullets.push(
        `${regionLabel(acc.regionId)} shows accumulated dependency pressure with inbound strain.`
      );
    }
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    saturationSummaries,
    hotspotSummaries,
    propagationSummaries,
    bullets,
  };
}
