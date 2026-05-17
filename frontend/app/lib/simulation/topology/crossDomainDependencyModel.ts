/**
 * D7:2:1 — Cross-domain dependency modeling (deterministic).
 */

import type {
  CrossDomainDependencyChannel,
  OperationalRelationship,
  OperationalRelationshipType,
  TopologyObjectClassification,
  TopologyObjectInput,
} from "./topologyTypes.ts";
import { logTopologyDev } from "./topologyDevLog.ts";

const CROSS_REGION_TYPE_PRIORITY: OperationalRelationshipType[] = [
  "dependency",
  "resource_flow",
  "financial_flow",
  "operational_support",
  "risk_exposure",
];

const INFERRED_REGION_PAIRS: ReadonlyArray<
  readonly [string, string, OperationalRelationshipType, number]
> = [
  ["manufacturing", "logistics", "resource_flow", 0.75],
  ["logistics", "supply_chain", "dependency", 0.7],
  ["supply_chain", "customer_systems", "operational_support", 0.65],
  ["manufacturing", "finance", "financial_flow", 0.55],
  ["executive_systems", "operations", "operational_support", 0.6],
  ["infrastructure", "operations", "dependency", 0.5],
  ["operations", "finance", "financial_flow", 0.45],
];

function relationshipKey(rel: Pick<OperationalRelationship, "sourceRegionId" | "targetRegionId" | "relationshipType">): string {
  return `${rel.sourceRegionId}|${rel.targetRegionId}|${rel.relationshipType}`;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function inferCrossRegionRelationships(
  classifications: readonly TopologyObjectClassification[],
  objects: readonly TopologyObjectInput[]
): OperationalRelationship[] {
  const objectById = new Map(objects.map((o) => [o.objectId, o]));
  const regionByObject = new Map(classifications.map((c) => [c.objectId, c.regionId]));
  const relMap = new Map<string, OperationalRelationship>();

  const add = (partial: Omit<OperationalRelationship, "relationshipId" | "executiveLabel">) => {
    if (partial.sourceRegionId === partial.targetRegionId) return;
    const key = relationshipKey(partial);
    const existing = relMap.get(key);
    const intensity = clamp01(Math.max(existing?.intensity ?? 0, partial.intensity));
    const sourceObjectIds = new Set([...(existing?.sourceObjectIds ?? []), ...(partial.sourceObjectIds ?? [])]);
    const targetObjectIds = new Set([...(existing?.targetObjectIds ?? []), ...(partial.targetObjectIds ?? [])]);
    relMap.set(key, {
      relationshipId: `rel::${key}`,
      sourceRegionId: partial.sourceRegionId,
      targetRegionId: partial.targetRegionId,
      relationshipType: partial.relationshipType,
      intensity,
      sourceObjectIds: Object.freeze([...sourceObjectIds].sort()),
      targetObjectIds: Object.freeze([...targetObjectIds].sort()),
    });
  };

  for (const obj of objects) {
    const sourceRegion = regionByObject.get(obj.objectId);
    if (!sourceRegion) continue;
    for (const depId of obj.dependencies ?? []) {
      const targetRegion = regionByObject.get(depId);
      if (!targetRegion || targetRegion === sourceRegion) continue;
      const dep = objectById.get(depId);
      const fragilityBoost = clamp01(
        ((obj.fragilityScore ?? 0.2) + (dep?.fragilityScore ?? 0.2)) / 2
      );
      add({
        sourceRegionId: sourceRegion,
        targetRegionId: targetRegion,
        relationshipType: "dependency",
        intensity: clamp01(0.45 + fragilityBoost * 0.35),
        sourceObjectIds: [obj.objectId],
        targetObjectIds: [depId],
      });
    }
  }

  const presentRegions = new Set(classifications.map((c) => c.regionId));
  for (const [from, to, type, intensity] of INFERRED_REGION_PAIRS) {
    if (presentRegions.has(from) && presentRegions.has(to)) {
      add({
        sourceRegionId: from,
        targetRegionId: to,
        relationshipType: type,
        intensity,
      });
    }
  }

  return [...relMap.values()].sort((a, b) => relationshipKey(a).localeCompare(relationshipKey(b)));
}

export function buildCrossDomainDependencyChannels(
  relationships: readonly OperationalRelationship[]
): readonly CrossDomainDependencyChannel[] {
  const channels: CrossDomainDependencyChannel[] = [];

  for (const rel of relationships) {
    const pairs =
      rel.sourceObjectIds && rel.targetObjectIds
        ? rel.sourceObjectIds.flatMap((s) =>
            (rel.targetObjectIds ?? []).map((t) => `${s}->${t}`)
          )
        : [`${rel.sourceRegionId}->${rel.targetRegionId}`];

    channels.push(
      Object.freeze({
        channelId: `channel::${rel.relationshipId}`,
        fromRegionId: rel.sourceRegionId,
        toRegionId: rel.targetRegionId,
        dependencyCount: pairs.length,
        averageIntensity: rel.intensity,
        fragilityTransmissionScore: clamp01(rel.intensity * 0.85),
        objectPairs: Object.freeze([...pairs].sort()),
      })
    );
  }

  logTopologyDev("DependencyMap", {
    channelCount: channels.length,
    types: CROSS_REGION_TYPE_PRIORITY.filter((t) => relationships.some((r) => r.relationshipType === t)),
  });

  return Object.freeze(channels);
}
