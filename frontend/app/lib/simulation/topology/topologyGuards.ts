/**
 * D7:2:1 — Topology governance guard rails.
 */

import type { OperationalRelationship, TopologyObjectInput } from "./topologyTypes.ts";
import { logTopologyDev } from "./topologyDevLog.ts";

export type TopologyGuardCode =
  | "empty_topology_id"
  | "no_objects"
  | "too_many_regions"
  | "too_many_relationships"
  | "invalid_relationship"
  | "circular_dependency"
  | "orphan_region"
  | "duplicate_topology"
  | "unstable_rebuild"
  | "classification_conflict";

export type TopologyGuardResult =
  | { ok: true }
  | { ok: false; code: TopologyGuardCode; message: string };

export const DEFAULT_MAX_TOPOLOGY_REGIONS = 32;
export const DEFAULT_MAX_TOPOLOGY_RELATIONSHIPS = 128;
export const DEFAULT_MAX_DEPENDENCY_CYCLE_DEPTH = 6;

function reject(code: TopologyGuardCode, message: string): TopologyGuardResult {
  const result = { ok: false as const, code, message };
  logTopologyDev("TopologyGuard", { code, message });
  return result;
}

export function buildTopologyContentFingerprint(input: {
  objectIds: readonly string[];
  relationshipKeys: readonly string[];
}): string {
  return JSON.stringify({
    objects: [...input.objectIds].sort(),
    relationships: [...input.relationshipKeys].sort(),
  });
}

export function guardBuildTopology(input: {
  topologyId: string;
  objects: readonly TopologyObjectInput[];
  relationships: readonly OperationalRelationship[];
  priorTopologyFingerprints?: readonly string[];
  pendingFingerprint?: string;
}): TopologyGuardResult {
  if (!String(input.topologyId ?? "").trim()) {
    return reject("empty_topology_id", "Topology id is required");
  }

  if (input.objects.length === 0) {
    return reject("no_objects", "At least one operational object is required");
  }

  const regionIds = new Set(
    input.relationships.flatMap((r) => [r.sourceRegionId, r.targetRegionId])
  );
  if (regionIds.size > DEFAULT_MAX_TOPOLOGY_REGIONS) {
    return reject(
      "too_many_regions",
      `Region count ${regionIds.size} exceeds max ${DEFAULT_MAX_TOPOLOGY_REGIONS}`
    );
  }

  if (input.relationships.length > DEFAULT_MAX_TOPOLOGY_RELATIONSHIPS) {
    return reject(
      "too_many_relationships",
      `Relationship count ${input.relationships.length} exceeds max ${DEFAULT_MAX_TOPOLOGY_RELATIONSHIPS}`
    );
  }

  for (const rel of input.relationships) {
    if (!rel.sourceRegionId || !rel.targetRegionId) {
      return reject("invalid_relationship", "Relationships require source and target regions");
    }
    if (rel.intensity < 0 || rel.intensity > 1) {
      return reject(
        "invalid_relationship",
        `Relationship ${rel.relationshipId} intensity must be between 0 and 1`
      );
    }
  }

  const cycle = detectRegionDependencyCycle(input.relationships);
  if (cycle) {
    return reject(
      "circular_dependency",
      `Circular regional dependency detected: ${cycle.join(" -> ")}`
    );
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorTopologyFingerprints ?? []).includes(pending)) {
    return reject("duplicate_topology", "Identical topology build was already executed");
  }

  return { ok: true };
}

export function detectRegionDependencyCycle(
  relationships: readonly OperationalRelationship[]
): string[] | null {
  const adjacency = new Map<string, string[]>();
  for (const rel of relationships) {
    if (rel.relationshipType !== "dependency" && rel.relationshipType !== "resource_flow") {
      continue;
    }
    const list = adjacency.get(rel.sourceRegionId) ?? [];
    list.push(rel.targetRegionId);
    adjacency.set(rel.sourceRegionId, list);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  function dfs(node: string): string[] | null {
    if (visiting.has(node)) {
      const cycleStart = stack.indexOf(node);
      return cycleStart >= 0 ? [...stack.slice(cycleStart), node] : [node, node];
    }
    if (visited.has(node)) return null;
    visiting.add(node);
    stack.push(node);
    for (const next of adjacency.get(node) ?? []) {
      const found = dfs(next);
      if (found) return found;
    }
    stack.pop();
    visiting.delete(node);
    visited.add(node);
    return null;
  }

  for (const node of [...adjacency.keys()].sort()) {
    const found = dfs(node);
    if (found) return found;
  }
  return null;
}
