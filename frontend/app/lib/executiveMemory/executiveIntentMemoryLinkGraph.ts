/**
 * APP-4:5 — Executive Intent ↔ Memory link graph utilities.
 */

import type { IntentIdentifier } from "../executiveIntent/executiveIntentTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";
import {
  listExecutiveIntentMemoryLinksFromRegistry,
  listLinkedIntentIdsForMemory,
  listLinkedMemoryIdsForIntent,
} from "./executiveIntentMemoryLinkRegistry.ts";
import type { ExecutiveIntentMemoryLinkGraph, ExecutiveIntentMemoryLinkGraphEdge } from "./executiveIntentMemoryLinkTypes.ts";

function toEdge(
  link: ReturnType<typeof listExecutiveIntentMemoryLinksFromRegistry>[number]
): ExecutiveIntentMemoryLinkGraphEdge {
  return Object.freeze({
    linkId: link.linkId,
    intentId: link.intentId,
    memoryId: link.memoryId,
    relationship: link.relationship,
    linkType: link.linkType,
    lifecycle: link.lifecycle,
    readOnly: true as const,
  });
}

export function inspectExecutiveIntentMemoryLinkGraph(input: {
  intentId?: IntentIdentifier;
  memoryId?: ExecutiveMemoryId;
  lifecycle?: "active" | "archived";
}): ExecutiveIntentMemoryLinkGraph {
  const query = Object.freeze({
    intentId: input.intentId,
    memoryId: input.memoryId,
    lifecycle: input.lifecycle ?? ("active" as const),
  });
  const edges = listExecutiveIntentMemoryLinksFromRegistry(query).map((link) => toEdge(link));
  const linkedMemoryIds = input.intentId
    ? listLinkedMemoryIdsForIntent(input.intentId)
    : Object.freeze(
        [...new Set(edges.map((edge) => edge.memoryId).filter((id): id is ExecutiveMemoryId => id !== null))].sort(
          (left, right) => left.localeCompare(right)
        )
      );
  const linkedIntentIds = input.memoryId
    ? listLinkedIntentIdsForMemory(input.memoryId)
    : Object.freeze([...new Set(edges.map((edge) => edge.intentId))].sort((left, right) => left.localeCompare(right)));

  return Object.freeze({
    intentId: input.intentId ?? null,
    memoryId: input.memoryId ?? null,
    edges: Object.freeze(edges),
    linkedMemoryIds,
    linkedIntentIds,
    directRelationshipCount: edges.length,
    readOnly: true as const,
  });
}

export const ExecutiveIntentMemoryLinkGraphInspector = Object.freeze({
  inspectExecutiveIntentMemoryLinkGraph,
});
