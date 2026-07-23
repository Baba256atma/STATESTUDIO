/**
 * EIL-1:3 — Integration Topology Models.
 *
 * Architectural topology node metadata derived from Registry references.
 * No graph engine. No routing engine. No visualization.
 *
 * Ownership: owned exclusively by EIL-1:3.
 */

import { IntegrationRegistryIdentity } from "./integrationRegistry.ts";
import type {
  IntegrationRegistryReference,
  IntegrationTopologyModel,
  IntegrationTopologyNodeKind,
} from "./integrationModelTypes.ts";

const registryRef = (
  collection: IntegrationRegistryReference["collection"],
  entryKey: string,
): IntegrationRegistryReference =>
  Object.freeze({
    registryId: IntegrationRegistryIdentity.canonicalId,
    registryNamespace: IntegrationRegistryIdentity.namespace,
    entryPoint: "integrationRegistry.ts" as const,
    collection,
    entryKey,
    preservesCanonicalReference: true as const,
    duplicatesRegistryValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const topology = (
  key: string,
  nodeKind: IntegrationTopologyNodeKind,
  canonicalName: string,
  description: string,
  collection: IntegrationRegistryReference["collection"],
  entryKey: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationTopologyModel =>
  Object.freeze({
    topologyId: `EIL-1:3/Topology/${key}` as const,
    nodeKind,
    canonicalKey: key,
    canonicalName,
    description,
    sourceRegistryReference: registryRef(collection, entryKey),
    ownership: "EIL-1:3" as const,
    lifecycle: "Verified" as const,
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
 * Exactly eight topology node models expressing architecture only.
 */
export const IntegrationTopologyModels: readonly IntegrationTopologyModel[] =
  Object.freeze([
    topology(
      "PlatformNode",
      "PlatformNode",
      "Platform Node",
      "Topology node representing a coordinated platform identity.",
      "types",
      "PlatformRole.Both",
      1,
      Object.freeze(["topology", "platform"]),
    ),
    topology(
      "IntegrationNode",
      "IntegrationNode",
      "Integration Node",
      "Topology node representing an integration coordination point.",
      "categories",
      "IntegrationType",
      2,
      Object.freeze(["topology", "integration"]),
    ),
    topology(
      "ProducerNode",
      "ProducerNode",
      "Producer Node",
      "Topology node representing a producer participant.",
      "types",
      "PlatformRole.Producer",
      3,
      Object.freeze(["topology", "producer"]),
    ),
    topology(
      "ConsumerNode",
      "ConsumerNode",
      "Consumer Node",
      "Topology node representing a consumer participant.",
      "types",
      "PlatformRole.Consumer",
      4,
      Object.freeze(["topology", "consumer"]),
    ),
    topology(
      "CoordinationNode",
      "CoordinationNode",
      "Coordination Node",
      "Topology node representing executive coordination metadata.",
      "categories",
      "Coordination",
      5,
      Object.freeze(["topology", "coordination"]),
    ),
    topology(
      "BoundaryNode",
      "BoundaryNode",
      "Boundary Node",
      "Topology node representing an architectural boundary.",
      "categories",
      "Ownership",
      6,
      Object.freeze(["topology", "boundary"]),
    ),
    topology(
      "RoutingNode",
      "RoutingNode",
      "Routing Node",
      "Topology node representing declarative routing metadata.",
      "categories",
      "Routing",
      7,
      Object.freeze(["topology", "routing"]),
    ),
    topology(
      "CompatibilityNode",
      "CompatibilityNode",
      "Compatibility Node",
      "Topology node representing compatibility alignment metadata.",
      "categories",
      "Compatibility",
      8,
      Object.freeze(["topology", "compatibility"]),
    ),
  ]);
