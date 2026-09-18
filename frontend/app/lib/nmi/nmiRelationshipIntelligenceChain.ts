/**
 * NPA-T NMI:3 — bounded direction-aware relationship chains.
 * Traversal may follow either endpoint; semantic direction is never reversed.
 */

import type { ManagementMap } from "./nmiManagementMapContract.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import type { NmiRelationshipChain, NmiRelationshipChainHop, NmiVaiCausalOverlay } from "./nmiRelationshipIntelligenceContract.ts";
import { interpretNmiRelationship, overlayByRelationshipId } from "./nmiRelationshipIntelligenceInterpret.ts";

export type NmiRelationshipChainInput = {
  readonly originNodeId: string;
  readonly maxHops?: number;
  readonly kinds?: readonly NmiManagementRelationship["kind"][];
};

function incident(
  nodeId: string,
  relationships: readonly NmiManagementRelationship[],
  kinds: readonly NmiManagementRelationship["kind"][] | undefined,
): readonly NmiManagementRelationship[] {
  return Object.freeze(
    relationships
      .filter((item) => item.fromId === nodeId || item.toId === nodeId)
      .filter((item) => !kinds || kinds.includes(item.kind))
      .slice()
      .sort((a, b) => a.relationshipId.localeCompare(b.relationshipId)),
  );
}

export function extractNmiRelationshipChain(
  map: ManagementMap,
  input: NmiRelationshipChainInput,
  overlays: readonly NmiVaiCausalOverlay[] = [],
): NmiRelationshipChain {
  const maxHops = input.maxHops ?? 6;
  const overlayMap = overlayByRelationshipId(overlays);
  const originPresent = map.nodes.some((node) => node.nodeId === input.originNodeId);
  if (!originPresent) {
    return Object.freeze({
      originNodeId: input.originNodeId,
      maxHops,
      hops: Object.freeze([]),
      inventedRelationships: false as const,
      truncatedByDepth: false,
    });
  }

  const visitedRels = new Set<string>();
  const hops: NmiRelationshipChainHop[] = [];
  type QueueItem = { readonly nodeId: string; readonly depth: number };
  const queue: QueueItem[] = [{ nodeId: input.originNodeId, depth: 0 }];
  const visitedNodes = new Set<string>([input.originNodeId]);
  let truncatedByDepth = false;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const edges = incident(current.nodeId, map.relationships, input.kinds);
    if (current.depth >= maxHops) {
      if (edges.some((rel) => !visitedRels.has(rel.relationshipId))) truncatedByDepth = true;
      continue;
    }
    for (const rel of edges) {
      if (visitedRels.has(rel.relationshipId)) continue;
      visitedRels.add(rel.relationshipId);
      const nextId = rel.fromId === current.nodeId ? rel.toId : rel.fromId;
      const traversal = rel.fromId === current.nodeId ? "FORWARD" : "REVERSE";
      hops.push(
        Object.freeze({
          relationshipId: rel.relationshipId,
          traversal,
          fromNodeId: current.nodeId,
          toNodeId: nextId,
          semanticSourceId: rel.fromId,
          semanticTargetId: rel.toId,
          interpretation: interpretNmiRelationship(map, rel, overlayMap.get(rel.relationshipId)),
        }),
      );
      if (visitedNodes.has(nextId)) continue;
      visitedNodes.add(nextId);
      queue.push({ nodeId: nextId, depth: current.depth + 1 });
    }
  }

  hops.sort((a, b) => a.relationshipId.localeCompare(b.relationshipId));
  return Object.freeze({
    originNodeId: input.originNodeId,
    maxHops,
    hops: Object.freeze(hops),
    inventedRelationships: false as const,
    truncatedByDepth,
  });
}
