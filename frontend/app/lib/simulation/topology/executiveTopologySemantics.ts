/**
 * D7:2:1 — Executive-readable topology semantics.
 */

import type {
  ExecutiveTopologySemantics,
  OperationalRegion,
  OperationalRelationship,
  CrossDomainDependencyChannel,
} from "./topologyTypes.ts";
import { CANONICAL_REGION_LABELS } from "./operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

function relationshipPhrase(rel: OperationalRelationship): string {
  switch (rel.relationshipType) {
    case "resource_flow":
      return "feeds resources into";
    case "financial_flow":
      return "influences financial outcomes in";
    case "operational_support":
      return "provides operational support to";
    case "risk_exposure":
      return "exposes risk to";
    default:
      return "depends on";
  }
}

export function buildExecutiveTopologySemantics(input: {
  regions: readonly OperationalRegion[];
  relationships: readonly OperationalRelationship[];
  channels: readonly CrossDomainDependencyChannel[];
}): ExecutiveTopologySemantics {
  const regionSummaries = input.regions.map((region) => {
    const fragility =
      region.fragilityScore != null
        ? region.fragilityScore >= 0.6
          ? "elevated fragility"
          : region.fragilityScore >= 0.35
            ? "moderate exposure"
            : "stable posture"
        : "stable posture";
    return `${region.label} contains ${region.objectIds.length} operational entities with ${fragility}.`;
  });

  const dependencySummaries = input.relationships.slice(0, 6).map((rel) => {
    const source = regionLabel(rel.sourceRegionId);
    const target = regionLabel(rel.targetRegionId);
    return `${source} ${relationshipPhrase(rel)} ${target}.`;
  });

  const topChannel = [...input.channels].sort(
    (a, b) => b.fragilityTransmissionScore - a.fragilityTransmissionScore
  )[0];

  const universeHeadline = topChannel
    ? `${regionLabel(topChannel.fromRegionId)} is structurally linked to ${regionLabel(topChannel.toRegionId)} across the operational universe.`
    : `The operational universe organizes ${input.regions.length} strategic regions across the enterprise.`;

  const strategicBullets: string[] = [];
  const highFragility = input.regions
    .filter((r) => (r.fragilityScore ?? 0) >= 0.55)
    .map((r) => r.label);
  if (highFragility.length > 0) {
    strategicBullets.push(
      `Elevated fragility concentrates in: ${highFragility.slice(0, 4).join(", ")}.`
    );
  }
  for (const rel of input.relationships.filter((r) => r.intensity >= 0.7).slice(0, 3)) {
    strategicBullets.push(
      `${regionLabel(rel.sourceRegionId)} has a strong ${rel.relationshipType.replace(/_/g, " ")} link to ${regionLabel(rel.targetRegionId)}.`
    );
  }

  return {
    universeHeadline,
    regionSummaries,
    dependencySummaries,
    strategicBullets,
  };
}

export function buildRegionExecutiveSummary(
  region: OperationalRegion,
  inbound: readonly OperationalRelationship[],
  outbound: readonly OperationalRelationship[]
): string {
  if (outbound.length > 0 && inbound.length > 0) {
    return `${region.label} both influences and depends on peer operational regions.`;
  }
  if (outbound.length > 0) {
    return `${region.label} is a structural upstream influence in the operational universe.`;
  }
  if (inbound.length > 0) {
    return `${region.label} is highly dependent on upstream operational recovery.`;
  }
  return `${region.label} operates with limited cross-domain coupling.`;
}
