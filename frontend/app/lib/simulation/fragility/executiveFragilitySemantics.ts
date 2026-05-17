/**
 * D7:2:4 — Executive-readable fragility concentration semantics.
 */

import type {
  ExecutiveFragilitySemantics,
  OperationalFragilityMap,
} from "./fragilityConcentrationTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveFragilitySemantics(input: {
  map: OperationalFragilityMap;
}): ExecutiveFragilitySemantics {
  const topZone = input.map.fragilityZones[0];
  const topCorridor = input.map.vulnerabilityCorridors[0];
  const topCritical = input.map.criticalRegions[0];

  const headline = topZone && topZone.concentrationLevel !== "low"
    ? topZone.concentrationLevel === "critical"
      ? `Critical fragility concentration is emerging across ${topZone.affectedRegionIds.map(regionLabel).join(" and ")} due to sustained dependency pressure.`
      : `Fragility concentration is increasing across ${topZone.affectedRegionIds.map(regionLabel).join(" and ")} due to sustained operational stress.`
    : topCorridor
      ? `Cross-domain vulnerability is elevated between ${regionLabel(topCorridor.sourceRegionId)} and ${regionLabel(topCorridor.targetRegionId)}.`
      : topCritical
        ? `${regionLabel(topCritical)} shows elevated systemic fragility exposure.`
        : "Operational fragility concentration remains within contained enterprise bounds.";

  const summaryParts: string[] = [];
  if (input.map.collapseRiskLabel === "contained") {
    summaryParts.push("Fragility is distributed without acute systemic concentration.");
  } else if (input.map.collapseRiskLabel === "elevated") {
    summaryParts.push("Fragility clusters are forming in interconnected operational regions.");
  } else {
    summaryParts.push(
      "Concentrated fragility and recovery weakness indicate approaching collapse risk in key corridors."
    );
  }
  summaryParts.push(
    `Systemic exposure is ${(input.map.systemicExposureScore * 100).toFixed(0)}% with cascade potential at ${(input.map.cascadePotentialScore * 100).toFixed(0)}%.`
  );

  const zoneSummaries = input.map.fragilityZones.slice(0, 5).map((zone) => {
    const regions = zone.affectedRegionIds.map(regionLabel).join(" and ");
    const drivers = zone.dominantFragilityDrivers.slice(0, 2).join(", ") || "operational stress";
    return `${regions} form a ${zone.concentrationLevel} fragility concentration driven by ${drivers}.`;
  });

  const corridorSummaries = input.map.vulnerabilityCorridors.slice(0, 4).map((c) => c.explanation);

  const criticalRegionSummaries = input.map.criticalRegions.map(
    (id) => `${regionLabel(id)} is classified as a critical fragility region.`
  );

  const bullets: string[] = [];
  if (topZone && topZone.dominantFragilityDrivers.length > 0) {
    bullets.push(topZone.dominantFragilityDrivers[0]);
  }
  for (const profile of [...input.map.regionProfiles]
    .sort((a, b) => b.fragilityScore - a.fragilityScore)
    .slice(0, 2)) {
    if (profile.fragilityScore > 0.55) {
      bullets.push(
        `${regionLabel(profile.regionId)} shows elevated fragility with reduced operational resilience.`
      );
    }
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    zoneSummaries,
    corridorSummaries,
    criticalRegionSummaries,
    bullets,
  };
}
