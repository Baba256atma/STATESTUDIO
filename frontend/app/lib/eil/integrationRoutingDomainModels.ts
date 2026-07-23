/**
 * EIL-3:3 — Integration Routing Domain Models.
 *
 * Immutable architectural domain models derived from Registry references.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-3:3.
 */

import { IntegrationRoutingRegistryIdentity } from "./integrationRoutingRegistry.ts";
import type {
  RoutingDomainModel,
  RoutingDomainModelKey,
  RoutingRegistryReference,
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

const domainModel = (
  key: RoutingDomainModelKey,
  canonicalName: string,
  description: string,
  collection: RoutingRegistryReference["collection"],
  entryKey: string,
  ordinal: number,
  tags: readonly string[],
): RoutingDomainModel =>
  Object.freeze({
    modelId: `EIL-3:3/Model/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    ownership: "EIL-3:3" as const,
    lifecycle: "Verified" as const,
    sourceRegistryReference: registryRef(collection, entryKey),
    sourceReference: `EIL-3:2/IntegrationRoutingRegistry/${collection}/${entryKey}`,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen canonical routing domain model definitions.
 * Registry collections are referenced, never duplicated.
 */
export const IntegrationRoutingDomainModels: readonly RoutingDomainModel[] =
  Object.freeze([
    domainModel(
      "Route",
      "Route",
      "Root architectural model for an integration route definition.",
      "collections",
      "collections",
      1,
      Object.freeze(["domain", "root"]),
    ),
    domainModel(
      "RoutePath",
      "Route Path",
      "Architectural path definition for a route surface.",
      "contracts",
      "RoutePathContract",
      2,
      Object.freeze(["domain", "path"]),
    ),
    domainModel(
      "RouteNode",
      "Route Node",
      "Architectural node definition within a route topology.",
      "capabilities",
      "RouteDescription",
      3,
      Object.freeze(["domain", "node"]),
    ),
    domainModel(
      "RouteSegment",
      "Route Segment",
      "Architectural segment definition between route nodes.",
      "capabilities",
      "RouteClassification",
      4,
      Object.freeze(["domain", "segment"]),
    ),
    domainModel(
      "RouteCondition",
      "Route Condition",
      "Architectural condition metadata without evaluation runtime.",
      "contracts",
      "RouteConditionContract",
      5,
      Object.freeze(["domain", "condition"]),
    ),
    domainModel(
      "RoutePolicy",
      "Route Policy",
      "Architectural policy metadata without policy evaluation.",
      "contracts",
      "RoutePolicyContract",
      6,
      Object.freeze(["domain", "policy"]),
    ),
    domainModel(
      "RoutePriority",
      "Route Priority",
      "Architectural priority metadata without scheduling runtime.",
      "contracts",
      "RoutePriorityContract",
      7,
      Object.freeze(["domain", "priority"]),
    ),
    domainModel(
      "RouteMetadata",
      "Route Metadata",
      "Architectural metadata envelope for route definitions.",
      "contracts",
      "RouteMetadataContract",
      8,
      Object.freeze(["domain", "metadata"]),
    ),
    domainModel(
      "RouteCategory",
      "Route Category",
      "Architectural category classification for route definitions.",
      "categories",
      "DirectRoute",
      9,
      Object.freeze(["domain", "category"]),
    ),
    domainModel(
      "RouteLifecycle",
      "Route Lifecycle",
      "Architectural lifecycle mapping for route definitions.",
      "contracts",
      "RouteLifecycleContract",
      10,
      Object.freeze(["domain", "lifecycle"]),
    ),
    domainModel(
      "RouteDependency",
      "Route Dependency",
      "Architectural dependency metadata preserving approved direction.",
      "responsibilities",
      "PreserveDependencyDirection",
      11,
      Object.freeze(["domain", "dependency"]),
    ),
    domainModel(
      "RouteCompatibility",
      "Route Compatibility",
      "Architectural compatibility metadata for route definitions.",
      "contracts",
      "RouteCompatibilityContract",
      12,
      Object.freeze(["domain", "compatibility"]),
    ),
    domainModel(
      "RouteBoundary",
      "Route Boundary",
      "Architectural boundary metadata for route ownership surfaces.",
      "ownershipCoverage",
      "1",
      13,
      Object.freeze(["domain", "boundary"]),
    ),
    domainModel(
      "RouteContext",
      "Route Context",
      "Architectural context metadata surrounding a route definition.",
      "capabilities",
      "RouteMetadata",
      14,
      Object.freeze(["domain", "context"]),
    ),
    domainModel(
      "RouteTopology",
      "Route Topology",
      "Architectural topology metadata for route relationships.",
      "collections",
      "collections",
      15,
      Object.freeze(["domain", "topology"]),
    ),
    domainModel(
      "RouteConfiguration",
      "Route Configuration",
      "Architectural configuration metadata for route definitions.",
      "contracts",
      "RouteConfigurationContract",
      16,
      Object.freeze(["domain", "configuration"]),
    ),
  ]);
