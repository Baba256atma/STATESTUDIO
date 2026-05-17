/**
 * D7:2:1 — Operational universe topology engine (immutable, non-mutating).
 */

import type { SceneJson } from "../../sceneTypes.ts";
import type {
  BuildOperationalUniverseTopologyInput,
  BuildOperationalUniverseTopologyResult,
  OperationalRegion,
  OperationalRelationship,
  OperationalUniverseTopology,
  OperationalUniverseTopologySnapshot,
  TopologyPanelContract,
  TopologyObjectInput,
} from "./topologyTypes.ts";
import {
  buildTopologyContentFingerprint,
  guardBuildTopology,
} from "./topologyGuards.ts";
import {
  CANONICAL_REGION_LABELS,
  classifyTopologyObjects,
  domainClassForRegion,
} from "./operationalUniverseClassification.ts";
import {
  buildCrossDomainDependencyChannels,
  inferCrossRegionRelationships,
} from "./crossDomainDependencyModel.ts";
import {
  buildExecutiveTopologySemantics,
  buildRegionExecutiveSummary,
} from "./executiveTopologySemantics.ts";
import { logTopologyDev } from "./topologyDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function topologyCreatedAt(): string {
  return new Date(Date.UTC(2026, 0, 1)).toISOString();
}

function normalizeId(value: unknown, fallback: string): string {
  const id = String(value ?? "").trim();
  return id || fallback;
}

/** Read-only extraction from scene — does not mutate sceneJson. */
export function extractTopologyObjectsFromScene(
  sceneJson: SceneJson | null | undefined,
  simulationMetrics?: Readonly<Record<string, { fragility?: number; operationalLoad?: number }>>
): TopologyObjectInput[] {
  const objects = sceneJson?.scene?.objects ?? [];
  return objects.map((obj, index) => {
    const objectId = normalizeId(obj.id ?? obj.name, `obj:${index}`);
    const metrics = simulationMetrics?.[objectId];
    return {
      objectId,
      label: String(obj.label ?? obj.display_label ?? obj.name ?? objectId),
      domain: String(obj.domain ?? obj.semantic?.domain ?? ""),
      category: String(obj.category ?? obj.semantic?.category ?? obj.type ?? ""),
      role: String(obj.role ?? obj.semantic?.role ?? ""),
      tags: [...(obj.tags ?? obj.semantic?.tags ?? [])].map(String),
      dependencies: [...(obj.dependencies ?? obj.semantic?.dependencies ?? [])].map(String).filter(Boolean),
      fragilityScore: clamp01(Number(metrics?.fragility ?? obj.emphasis ?? 0.2)),
    };
  });
}

function buildRegions(
  classifications: ReturnType<typeof classifyTopologyObjects>,
  objects: readonly TopologyObjectInput[],
  relationships: readonly OperationalRelationship[]
): OperationalRegion[] {
  const objectsByRegion = new Map<string, string[]>();
  const fragilityByRegion = new Map<string, number[]>();

  for (const cls of classifications) {
    const list = objectsByRegion.get(cls.regionId) ?? [];
    list.push(cls.objectId);
    objectsByRegion.set(cls.regionId, list);

    const obj = objects.find((o) => o.objectId === cls.objectId);
    const scores = fragilityByRegion.get(cls.regionId) ?? [];
    scores.push(obj?.fragilityScore ?? 0.2);
    fragilityByRegion.set(cls.regionId, scores);
  }

  const regions: OperationalRegion[] = [];
  for (const regionId of [...objectsByRegion.keys()].sort()) {
    const objectIds = [...(objectsByRegion.get(regionId) ?? [])].sort();
    const fragilities = fragilityByRegion.get(regionId) ?? [0.2];
    const fragilityScore = clamp01(
      fragilities.reduce((sum, v) => sum + v, 0) / fragilities.length
    );
    const inbound = relationships.filter((r) => r.targetRegionId === regionId);
    const outbound = relationships.filter((r) => r.sourceRegionId === regionId);
    const label =
      CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ??
      regionId.replace(/_/g, " ");

    const region: OperationalRegion = {
      regionId,
      label,
      objectIds: Object.freeze(objectIds),
      operationalRole: domainClassForRegion(regionId),
      domainClass: domainClassForRegion(regionId),
      fragilityScore,
      executiveSummary: buildRegionExecutiveSummary(
        {
          regionId,
          label,
          objectIds,
          domainClass: domainClassForRegion(regionId),
          fragilityScore,
        },
        inbound,
        outbound
      ),
    };
    regions.push(region);
  }

  return regions.sort((a, b) => a.regionId.localeCompare(b.regionId));
}

export function buildTopologyPanelContract(input: {
  topology: OperationalUniverseTopology;
  semantics: OperationalUniverseTopologySnapshot["semantics"];
}): TopologyPanelContract {
  const regionRows = input.topology.operationalRegions.map((region) =>
    Object.freeze({
      regionId: region.regionId,
      label: region.label,
      objectCount: region.objectIds.length,
      fragilityScore: region.fragilityScore ?? 0.2,
      domainClass: region.domainClass,
      summary: region.executiveSummary ?? region.label,
    })
  );

  const regionLabelById = Object.fromEntries(
    input.topology.operationalRegions.map((r) => [r.regionId, r.label])
  );

  const relationshipRows = input.topology.crossDomainRelationships.map((rel) =>
    Object.freeze({
      relationshipId: rel.relationshipId,
      sourceLabel: regionLabelById[rel.sourceRegionId] ?? rel.sourceRegionId,
      targetLabel: regionLabelById[rel.targetRegionId] ?? rel.targetRegionId,
      relationshipType: rel.relationshipType,
      intensity: rel.intensity,
      executiveLabel:
        rel.executiveLabel ??
        `${regionLabelById[rel.sourceRegionId] ?? rel.sourceRegionId} → ${regionLabelById[rel.targetRegionId] ?? rel.targetRegionId}`,
    })
  );

  const viewHint =
    input.topology.crossDomainRelationships.length > 6
      ? "dependency_panel"
      : input.topology.operationalRegions.length > 5
        ? "region_navigation"
        : "universe_map";

  return Object.freeze({
    topologyId: input.topology.topologyId,
    regionCount: input.topology.operationalRegions.length,
    relationshipCount: input.topology.crossDomainRelationships.length,
    regions: Object.freeze(regionRows),
    relationships: Object.freeze(relationshipRows),
    headline: input.semantics.universeHeadline,
    viewHint,
  });
}

/**
 * Build operational universe topology without mutating source objects or scene data.
 */
export function buildOperationalUniverseTopology(
  input: BuildOperationalUniverseTopologyInput
): BuildOperationalUniverseTopologyResult {
  const topologyId = String(input.topologyId ?? "topology::enterprise").trim() || "topology::enterprise";
  const objects = [...input.objects].sort((a, b) => a.objectId.localeCompare(b.objectId));

  logTopologyDev("OperationalUniverse", {
    topologyId,
    objectCount: objects.length,
  });

  const classifications = classifyTopologyObjects({
    objects,
    regionOverrides: input.regionOverrides,
  });

  const inferred = inferCrossRegionRelationships(classifications, objects);
  const explicit = (input.explicitRelationships ?? []).map((rel, index) =>
    Object.freeze({
      ...rel,
      relationshipId: `rel::explicit::${index}`,
      executiveLabel: undefined,
      intensity: clamp01(rel.intensity ?? 0.5),
    })
  );

  const relationshipMap = new Map<string, OperationalRelationship>();
  for (const rel of [...inferred, ...explicit]) {
    const key = `${rel.sourceRegionId}|${rel.targetRegionId}|${rel.relationshipType}`;
    relationshipMap.set(key, rel);
  }
  const relationships = Object.freeze(
    [...relationshipMap.values()].sort((a, b) => a.relationshipId.localeCompare(b.relationshipId))
  );

  const pendingFingerprint = buildTopologyContentFingerprint({
    objectIds: objects.map((o) => o.objectId),
    relationshipKeys: relationships.map((r) => r.relationshipId),
  });

  const guard = guardBuildTopology({
    topologyId,
    objects,
    relationships,
    priorTopologyFingerprints: input.priorTopologyFingerprints,
    pendingFingerprint,
  });
  if (!guard.ok) return { ok: false, guard };

  const operationalRegions = Object.freeze(buildRegions(classifications, objects, relationships));
  const objectToRegionId = Object.freeze(
    Object.fromEntries(classifications.map((c) => [c.objectId, c.regionId]))
  );

  const dependencyChannels = buildCrossDomainDependencyChannels(relationships);

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    topologyId,
    regions: operationalRegions.map((r) => r.regionId),
    relationships: relationships.map((r) => r.relationshipId),
  });

  const topology: OperationalUniverseTopology = Object.freeze({
    topologyId,
    createdAt: topologyCreatedAt(),
    operationalRegions,
    crossDomainRelationships: relationships,
    dependencyChannels,
    objectToRegionId,
    fingerprint,
  });

  const semantics = buildExecutiveTopologySemantics({
    regions: operationalRegions,
    relationships,
    channels: dependencyChannels,
  });

  const snapshot: OperationalUniverseTopologySnapshot = Object.freeze({
    topology,
    classifications: Object.freeze(classifications.map((c) => Object.freeze({ ...c }))),
    semantics: Object.freeze({
      ...semantics,
      regionSummaries: Object.freeze([...semantics.regionSummaries]),
      dependencySummaries: Object.freeze([...semantics.dependencySummaries]),
      strategicBullets: Object.freeze([...semantics.strategicBullets]),
    }),
    builtAt: topology.createdAt,
  });

  const panelContract = buildTopologyPanelContract({ topology, semantics: snapshot.semantics });

  logTopologyDev("Topology", {
    topologyId,
    regions: operationalRegions.length,
    relationships: relationships.length,
    fingerprint,
  });

  return { ok: true, snapshot, panelContract };
}

export function freezeOperationalUniverseTopologySnapshot(
  snapshot: OperationalUniverseTopologySnapshot
): OperationalUniverseTopologySnapshot {
  return Object.freeze({
    ...snapshot,
    topology: Object.freeze({
      ...snapshot.topology,
      operationalRegions: Object.freeze(
        snapshot.topology.operationalRegions.map((r) =>
          Object.freeze({ ...r, objectIds: Object.freeze([...r.objectIds]) })
        )
      ),
      crossDomainRelationships: Object.freeze([...snapshot.topology.crossDomainRelationships]),
      dependencyChannels: Object.freeze([...snapshot.topology.dependencyChannels]),
      objectToRegionId: Object.freeze({ ...snapshot.topology.objectToRegionId }),
    }),
    classifications: Object.freeze(snapshot.classifications.map((c) => Object.freeze({ ...c }))),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
