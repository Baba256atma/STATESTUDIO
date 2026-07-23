/**
 * EIL-3:3 — Integration Routing Relationship Models.
 *
 * Canonical descriptive relationships between routing domain models.
 * Metadata only — no relationship resolution or execution.
 *
 * Ownership: owned exclusively by EIL-3:3.
 */

import { IntegrationRoutingRegistryIdentity } from "./integrationRoutingRegistry.ts";
import type {
  RoutingDomainModelKey,
  RoutingRegistryReference,
  RoutingRelationshipModel,
  RoutingRelationshipType,
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

const relationship = (
  key: string,
  relationshipType: RoutingRelationshipType,
  canonicalName: string,
  description: string,
  sourceModelKey: RoutingDomainModelKey,
  targetModelKey: RoutingDomainModelKey,
  collection: RoutingRegistryReference["collection"],
  entryKey: string,
  ordinal: number,
  tags: readonly string[],
): RoutingRelationshipModel =>
  Object.freeze({
    relationshipId: `EIL-3:3/Relationship/${key}` as const,
    relationshipType,
    canonicalKey: key,
    canonicalName,
    description,
    sourceModelKey,
    targetModelKey,
    ownership: "EIL-3:3" as const,
    lifecycle: "Verified" as const,
    sourceRegistryReference: registryRef(collection, entryKey),
    sourceReference: `EIL-3:2/IntegrationRoutingRegistry/${collection}/${entryKey}`,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    resolvesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve relationship declarations covering every relationship type.
 * Descriptive metadata only.
 */
export const IntegrationRoutingRelationshipModels: readonly RoutingRelationshipModel[] =
  Object.freeze([
    relationship(
      "RouteOwnsPath",
      "owns",
      "Route → Path",
      "Route owns path definition metadata.",
      "Route",
      "RoutePath",
      "contracts",
      "RoutePathContract",
      1,
      Object.freeze(["owns", "path"]),
    ),
    relationship(
      "RouteReferencesMetadata",
      "references",
      "Route → Metadata",
      "Route references metadata envelope declarations.",
      "Route",
      "RouteMetadata",
      "contracts",
      "RouteMetadataContract",
      2,
      Object.freeze(["references", "metadata"]),
    ),
    relationship(
      "RouteDependsOnConfiguration",
      "dependsOn",
      "Route → Configuration",
      "Route depends on configuration metadata.",
      "Route",
      "RouteConfiguration",
      "contracts",
      "RouteConfigurationContract",
      3,
      Object.freeze(["dependsOn", "configuration"]),
    ),
    relationship(
      "RouteCompatibleWithCategory",
      "compatibleWith",
      "Route → Category",
      "Route is compatible with category classification metadata.",
      "Route",
      "RouteCategory",
      "categories",
      "DirectRoute",
      4,
      Object.freeze(["compatibleWith", "category"]),
    ),
    relationship(
      "PathMappedToSegment",
      "mappedTo",
      "Path → Segment",
      "Path model maps to segment model metadata.",
      "RoutePath",
      "RouteSegment",
      "capabilities",
      "RouteClassification",
      5,
      Object.freeze(["mappedTo", "segment"]),
    ),
    relationship(
      "NodeConnectedToSegment",
      "connectedTo",
      "Node → Segment",
      "Node connects to segment metadata.",
      "RouteNode",
      "RouteSegment",
      "capabilities",
      "RouteDescription",
      6,
      Object.freeze(["connectedTo", "node"]),
    ),
    relationship(
      "SegmentBelongsToPath",
      "belongsTo",
      "Segment → Path",
      "Segment belongs to path definition metadata.",
      "RouteSegment",
      "RoutePath",
      "contracts",
      "RoutePathContract",
      7,
      Object.freeze(["belongsTo", "path"]),
    ),
    relationship(
      "TopologyComposedOfRoutes",
      "composedOf",
      "Topology → Route",
      "Topology is composed of route metadata.",
      "RouteTopology",
      "Route",
      "collections",
      "collections",
      8,
      Object.freeze(["composedOf", "topology"]),
    ),
    relationship(
      "CompatibilityExtendsLifecycle",
      "extends",
      "Compatibility → Lifecycle",
      "Compatibility metadata extends lifecycle mapping metadata.",
      "RouteCompatibility",
      "RouteLifecycle",
      "contracts",
      "RouteLifecycleContract",
      9,
      Object.freeze(["extends", "lifecycle"]),
    ),
    relationship(
      "RouteRoutesThroughNode",
      "routesThrough",
      "Route → Node",
      "Route routes through node metadata without runtime traversal.",
      "Route",
      "RouteNode",
      "capabilities",
      "RouteDescription",
      10,
      Object.freeze(["routesThrough", "node"]),
    ),
    relationship(
      "RouteGovernedByPolicy",
      "governedBy",
      "Route → Policy",
      "Route is governed by policy metadata without policy engines.",
      "Route",
      "RoutePolicy",
      "contracts",
      "RoutePolicyContract",
      11,
      Object.freeze(["governedBy", "policy"]),
    ),
    relationship(
      "RouteClassifiedAsCategory",
      "classifiedAs",
      "Route → Category",
      "Route is classified as category metadata.",
      "Route",
      "RouteCategory",
      "categories",
      "DirectRoute",
      12,
      Object.freeze(["classifiedAs", "category"]),
    ),
  ]);

/** Exactly twelve relationship types covered by the relationship models. */
export const IntegrationRoutingRelationshipTypes = Object.freeze([
  "owns",
  "references",
  "dependsOn",
  "compatibleWith",
  "mappedTo",
  "connectedTo",
  "belongsTo",
  "composedOf",
  "extends",
  "routesThrough",
  "governedBy",
  "classifiedAs",
] as const satisfies readonly RoutingRelationshipType[]);
