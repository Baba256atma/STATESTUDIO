/**
 * NPA-T NMI:2 — bounded management branch/path projection.
 * Not the NMI:4 Decision Roadmap. No invented nodes or edges. Cycles are visited once.
 */

import type { ManagementMap, ManagementMapNode, NmiManagementBranch } from "./nmiManagementMapContract.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";

export type NmiManagementBranchInput = {
  readonly originNodeId: string;
  readonly maxDepth?: number;
};

function neighborsOf(
  nodeId: string,
  relationships: readonly NmiManagementRelationship[],
): readonly NmiManagementRelationship[] {
  return Object.freeze(
    relationships
      .filter((item) => item.fromId === nodeId || item.toId === nodeId)
      .slice()
      .sort((a, b) => a.relationshipId.localeCompare(b.relationshipId)),
  );
}

function otherId(nodeId: string, rel: NmiManagementRelationship): string {
  return rel.fromId === nodeId ? rel.toId : rel.fromId;
}

export function extractNmiManagementBranch(map: ManagementMap, input: NmiManagementBranchInput): NmiManagementBranch {
  const maxDepth = input.maxDepth ?? 6;
  const origin = map.nodes.find((node) => node.nodeId === input.originNodeId) ?? null;
  if (!origin) {
    return Object.freeze({
      originNodeId: input.originNodeId,
      originPresent: false,
      maxDepth,
      nodes: Object.freeze([]),
      relationships: Object.freeze([]),
      unresolvedRelationshipIds: Object.freeze([...(map.unresolvedRelationshipIds ?? [])]),
      cycleEncountered: false,
      truncatedByDepth: false,
      inventedNodes: false as const,
      inventedRelationships: false as const,
      createsCausalCertainty: false as const,
    });
  }

  const byId = new Map(map.nodes.map((node) => [node.nodeId, node]));
  const visited = new Set<string>([origin.nodeId]);
  const keptNodes: ManagementMapNode[] = [origin];
  const keptRels: NmiManagementRelationship[] = [];
  const keptRelIds = new Set<string>();
  let cycleEncountered = false;
  let truncatedByDepth = false;

  type QueueItem = { readonly nodeId: string; readonly depth: number };
  const queue: QueueItem[] = [{ nodeId: origin.nodeId, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.depth >= maxDepth) {
      if (neighborsOf(current.nodeId, map.relationships).some((rel) => !visited.has(otherId(current.nodeId, rel)))) {
        truncatedByDepth = true;
      }
      continue;
    }
    for (const rel of neighborsOf(current.nodeId, map.relationships)) {
      const nextId = otherId(current.nodeId, rel);
      if (keptRelIds.has(rel.relationshipId)) continue;
      keptRelIds.add(rel.relationshipId);
      keptRels.push(rel);
      if (visited.has(nextId)) {
        cycleEncountered = true;
        continue;
      }
      const nextNode = byId.get(nextId);
      if (!nextNode) continue;
      visited.add(nextId);
      keptNodes.push(nextNode);
      queue.push({ nodeId: nextId, depth: current.depth + 1 });
    }
  }

  keptNodes.sort((a, b) => a.nodeId.localeCompare(b.nodeId));
  keptRels.sort((a, b) => a.relationshipId.localeCompare(b.relationshipId));

  return Object.freeze({
    originNodeId: origin.nodeId,
    originPresent: true,
    maxDepth,
    nodes: Object.freeze(keptNodes),
    relationships: Object.freeze(keptRels),
    unresolvedRelationshipIds: Object.freeze([...(map.unresolvedRelationshipIds ?? [])]),
    cycleEncountered,
    truncatedByDepth,
    inventedNodes: false as const,
    inventedRelationships: false as const,
    createsCausalCertainty: false as const,
  });
}
