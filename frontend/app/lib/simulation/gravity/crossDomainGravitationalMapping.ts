/**
 * D7:2:8 — Cross-domain gravitational influence mapping.
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { CrossDomainGravityRecord, RegionGravityProfile } from "./systemicRiskGravityTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function mapCrossDomainGravitationalInfluence(input: {
  topology: OperationalUniverseTopology;
  profiles: readonly RegionGravityProfile[];
}): readonly CrossDomainGravityRecord[] {
  const profileByRegion = new Map(input.profiles.map((p) => [p.regionId, p]));
  const regionDomain = new Map(
    input.topology.operationalRegions.map((r) => [r.regionId, r.domainClass])
  );
  const records: CrossDomainGravityRecord[] = [];
  const seen = new Set<string>();

  for (const rel of input.topology.crossDomainRelationships) {
    const source = profileByRegion.get(rel.sourceRegionId);
    const target = profileByRegion.get(rel.targetRegionId);
    if (!source || !target) continue;

    const gravitationalPull = clamp01(
      (source.destabilizingInfluence + target.instabilityAttraction) / 2 * 0.6 + rel.intensity * 0.4
    );
    if (gravitationalPull < 0.35) continue;

    const key = `${rel.sourceRegionId}|${rel.targetRegionId}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const sourceDomain = regionDomain.get(rel.sourceRegionId) ?? "unclassified";
    const targetDomain = regionDomain.get(rel.targetRegionId) ?? "unclassified";

    records.push(
      Object.freeze({
        recordId: `gravity-cross::${key}`,
        sourceRegionId: rel.sourceRegionId,
        targetRegionId: rel.targetRegionId,
        sourceDomainClass: sourceDomain,
        targetDomainClass: targetDomain,
        gravitationalPull,
        explanation: `Gravitational instability pull from ${regionLabel(rel.sourceRegionId)} (${sourceDomain}) toward ${regionLabel(rel.targetRegionId)} (${targetDomain}).`,
      })
    );
  }

  return Object.freeze(
    records.sort(
      (a, b) => b.gravitationalPull - a.gravitationalPull || a.recordId.localeCompare(b.recordId)
    )
  );
}
