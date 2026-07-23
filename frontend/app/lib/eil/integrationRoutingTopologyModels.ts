/**
 * EIL-3:3 — Integration Routing Topology Models.
 *
 * Immutable topology architecture declarations for routing metadata.
 * Metadata only — no graph engines or routing traversal.
 *
 * Ownership: owned exclusively by EIL-3:3.
 */

import { IntegrationRoutingRegistryIdentity } from "./integrationRoutingRegistry.ts";
import type {
  RoutingRegistryReference,
  RoutingTopologyKey,
  RoutingTopologyModel,
} from "./integrationRoutingModelTypes.ts";

const registryRef = (
  collection: RoutingRegistryReference["collection"],
  entryKey: string,
): RoutingRegistryReference =>
  Object.freeze({
    registryId: IntegrationRoutingRegistryIdentity.canonicalId,
    registryNamespace: IntegrationRoutingRegistryIdentity.namespace,
    entryPoint: "integrationRoutingRegistry.ts" as const,
    collection,
    entryKey,
    preservesCanonicalReference: true as const,
    duplicatesRegistryValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const topology = (
  key: RoutingTopologyKey,
  canonicalName: string,
  description: string,
  ordinal: number,
  tags: readonly string[],
): RoutingTopologyModel =>
  Object.freeze({
    topologyModelId: `EIL-3:3/Topology/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    ownership: "EIL-3:3" as const,
    lifecycle: "Verified" as const,
    sourceRegistryReference: registryRef("collections", "collections"),
    sourceReference:
      `EIL-3:2/IntegrationRoutingRegistry/collections/topology/${key}`,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    graphEngine: false as const,
    routingEngine: false as const,
    visualization: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight immutable topology models.
 * Architecture description only.
 */
export const IntegrationRoutingTopologyModels: readonly RoutingTopologyModel[] =
  Object.freeze([
    topology(
      "Linear",
      "Linear",
      "Declarative linear topology metadata for sequential route composition.",
      1,
      Object.freeze(["topology", "linear"]),
    ),
    topology(
      "Tree",
      "Tree",
      "Declarative tree topology metadata for hierarchical route composition.",
      2,
      Object.freeze(["topology", "tree"]),
    ),
    topology(
      "Mesh",
      "Mesh",
      "Declarative mesh topology metadata for multi-path route composition.",
      3,
      Object.freeze(["topology", "mesh"]),
    ),
    topology(
      "Star",
      "Star",
      "Declarative star topology metadata for hub-and-spoke route composition.",
      4,
      Object.freeze(["topology", "star"]),
    ),
    topology(
      "Ring",
      "Ring",
      "Declarative ring topology metadata for cyclic route composition.",
      5,
      Object.freeze(["topology", "ring"]),
    ),
    topology(
      "Hub",
      "Hub",
      "Declarative hub topology metadata for centralized route composition.",
      6,
      Object.freeze(["topology", "hub"]),
    ),
    topology(
      "Gateway",
      "Gateway",
      "Declarative gateway topology metadata for boundary route composition.",
      7,
      Object.freeze(["topology", "gateway"]),
    ),
    topology(
      "Composite",
      "Composite",
      "Declarative composite topology metadata for multi-topology route composition.",
      8,
      Object.freeze(["topology", "composite"]),
    ),
  ]);
