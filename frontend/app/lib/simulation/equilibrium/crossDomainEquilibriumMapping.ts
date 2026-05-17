/**
 * D7:2:7 — Cross-domain equilibrium intelligence.
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { CrossDomainEquilibriumRecord, RegionEquilibriumProfile } from "./equilibriumTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function mapCrossDomainEquilibrium(input: {
  topology: OperationalUniverseTopology;
  profiles: readonly RegionEquilibriumProfile[];
}): readonly CrossDomainEquilibriumRecord[] {
  const profileByRegion = new Map(input.profiles.map((p) => [p.regionId, p]));
  const regionDomain = new Map(
    input.topology.operationalRegions.map((r) => [r.regionId, r.domainClass])
  );
  const records: CrossDomainEquilibriumRecord[] = [];
  const seen = new Set<string>();

  for (const rel of input.topology.crossDomainRelationships) {
    const source = profileByRegion.get(rel.sourceRegionId);
    const target = profileByRegion.get(rel.targetRegionId);
    if (!source || !target) continue;

    const balanceShift = clamp01(target.balanceScore - source.balanceScore);
    if (Math.abs(balanceShift) < 0.12) continue;

    const key = `${rel.sourceRegionId}|${rel.targetRegionId}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const sourceDomain = regionDomain.get(rel.sourceRegionId) ?? "unclassified";
    const targetDomain = regionDomain.get(rel.targetRegionId) ?? "unclassified";

    records.push(
      Object.freeze({
        recordId: `eq-cross::${key}`,
        sourceRegionId: rel.sourceRegionId,
        targetRegionId: rel.targetRegionId,
        sourceDomainClass: sourceDomain,
        targetDomainClass: targetDomain,
        balanceShift,
        explanation:
          balanceShift > 0
            ? `Operational balance is stronger in ${regionLabel(rel.targetRegionId)} (${targetDomain}) than ${regionLabel(rel.sourceRegionId)} (${sourceDomain}).`
            : `Operational balance is weaker in ${regionLabel(rel.targetRegionId)} (${targetDomain}) relative to ${regionLabel(rel.sourceRegionId)} (${sourceDomain}).`,
      })
    );
  }

  return Object.freeze(
    records.sort(
      (a, b) => Math.abs(b.balanceShift) - Math.abs(a.balanceShift) || a.recordId.localeCompare(b.recordId)
    )
  );
}
