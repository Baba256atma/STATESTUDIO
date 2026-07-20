/**
 * NEA-5:3 — Gateway Routing Domain Models.
 *
 * Immutable domain model kind declarations composed from Registry references.
 * Strongly typed structure only. No routing execution. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-5:3.
 */

import {
  GatewayRoutingRegistryId,
  GatewayRoutingRegistryPlatform,
} from "./gatewayRoutingRegistry.ts";
import type {
  GatewayRoutingModelKindDescriptor,
  RouteIdentityModel,
} from "./gatewayRoutingModelTypes.ts";

const registry = GatewayRoutingRegistryPlatform;

const kind = (
  modelKind: GatewayRoutingModelKindDescriptor["modelKind"],
  modelName: string,
  description: string,
  registryCollections: GatewayRoutingModelKindDescriptor["registryCollections"],
  fieldCount: number,
  composesModels: GatewayRoutingModelKindDescriptor["composesModels"],
  order: number,
): GatewayRoutingModelKindDescriptor =>
  Object.freeze({
    modelKind,
    modelName,
    description,
    registryCollections: Object.freeze([...registryCollections]),
    fieldCount,
    composesModels: Object.freeze([...composesModels]),
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly twenty Gateway Routing domain model kinds.
 * Registry collections are referenced, never duplicated.
 */
export const GatewayRoutingDomainModels: readonly GatewayRoutingModelKindDescriptor[] =
  Object.freeze([
    kind(
      "RouteIdentity",
      "Route Identity Model",
      "Immutable routing identity structure.",
      Object.freeze(["routeIdentities", "destinations", "decisions", "priorities", "statuses"]),
      6,
      Object.freeze([]),
      1,
    ),
    kind(
      "RouteDefinition",
      "Route Definition Model",
      "Immutable routing definition composed from Registry references.",
      Object.freeze([
        "routeIdentities",
        "destinations",
        "strategies",
        "priorities",
        "routingPolicies",
        "capabilities",
        "lifecycleEntries",
      ]),
      10,
      Object.freeze([
        "RouteIdentity",
        "RouteDestination",
        "RouteStrategy",
        "RoutePriority",
        "RoutePolicy",
        "RouteCapability",
        "RouteLifecycle",
      ]),
      2,
    ),
    kind(
      "RouteDestination",
      "Route Destination Model",
      "Canonical destination metadata — no consumer invocation.",
      Object.freeze(["destinations"]),
      3,
      Object.freeze([]),
      3,
    ),
    kind(
      "RouteDecision",
      "Route Decision Model",
      "Canonical routing decision metadata — no decision evaluation.",
      Object.freeze(["decisions"]),
      3,
      Object.freeze([]),
      4,
    ),
    kind(
      "RouteContext",
      "Route Context Model",
      "Immutable routing context metadata — no context propagation runtime.",
      Object.freeze(["contexts"]),
      3,
      Object.freeze([]),
      5,
    ),
    kind(
      "RouteStrategy",
      "Route Strategy Model",
      "Immutable strategy declarations — no strategy execution.",
      Object.freeze(["strategies"]),
      3,
      Object.freeze([]),
      6,
    ),
    kind(
      "RoutePriority",
      "Route Priority Model",
      "Canonical priority metadata — no priority scheduling.",
      Object.freeze(["priorities"]),
      3,
      Object.freeze([]),
      7,
    ),
    kind(
      "RouteStatus",
      "Route Status Model",
      "Routing status metadata — no status transitions at runtime.",
      Object.freeze(["statuses"]),
      3,
      Object.freeze([]),
      8,
    ),
    kind(
      "RouteResult",
      "Route Result Model",
      "Routing result metadata — no result emission runtime.",
      Object.freeze(["results"]),
      3,
      Object.freeze([]),
      9,
    ),
    kind(
      "RoutePolicy",
      "Route Policy Model",
      "Routing policy metadata — no policy engine execution.",
      Object.freeze(["routingPolicies"]),
      3,
      Object.freeze([]),
      10,
    ),
    kind(
      "RouteMetadata",
      "Route Metadata Model",
      "Immutable routing metadata structure.",
      Object.freeze(["routeIdentities", "statuses", "lifecycleEntries"]),
      5,
      Object.freeze(["RouteDefinition"]),
      11,
    ),
    kind(
      "RouteCapability",
      "Route Capability Model",
      "Canonical routing capability metadata — no capability execution.",
      Object.freeze(["capabilities"]),
      3,
      Object.freeze([]),
      12,
    ),
    kind(
      "RouteLifecycle",
      "Route Lifecycle Model",
      "Canonical routing lifecycle metadata — no state machine runtime.",
      Object.freeze(["lifecycleEntries"]),
      3,
      Object.freeze([]),
      13,
    ),
    kind(
      "RouteRequest",
      "Route Request Model",
      "Routing request metadata — no message processing.",
      Object.freeze(["routeIdentities", "contexts", "statuses"]),
      6,
      Object.freeze(["RouteIdentity", "RouteContext", "RouteResolution"]),
      14,
    ),
    kind(
      "RouteResponse",
      "Route Response Model",
      "Routing response metadata — no consumer invocation.",
      Object.freeze(["results", "statuses"]),
      5,
      Object.freeze(["RouteResult", "RouteDiagnostics"]),
      15,
    ),
    kind(
      "RouteResolution",
      "Route Resolution Model",
      "Destination resolution metadata — no routing logic.",
      Object.freeze(["destinations", "decisions"]),
      4,
      Object.freeze(["RouteDestination", "RouteDecision"]),
      16,
    ),
    kind(
      "RouteDiagnostics",
      "Route Diagnostics Model",
      "Routing diagnostics metadata — no diagnostic processing.",
      Object.freeze(["statuses", "results"]),
      4,
      Object.freeze(["RouteResult"]),
      17,
    ),
    kind(
      "RouteSummary",
      "Route Summary Model",
      "Immutable aggregate metadata for a routing exchange.",
      Object.freeze(["routeIdentities", "statuses"]),
      5,
      Object.freeze(["RouteDefinition", "RouteResponse"]),
      18,
    ),
    kind(
      "RouteConfiguration",
      "Route Configuration Model",
      "Routing configuration metadata — no executable configuration.",
      Object.freeze(["strategies", "routingPolicies", "contexts"]),
      5,
      Object.freeze(["RouteStrategy"]),
      19,
    ),
    kind(
      "RouteReference",
      "Route Reference Model",
      "Canonical references among routing objects.",
      Object.freeze(["routeIdentities", "contracts"]),
      4,
      Object.freeze(["RouteIdentity"]),
      20,
    ),
  ]);

/**
 * Route identity model instances derived from Registry route identities.
 * Structure only — no runtime routing.
 */
export const RouteIdentityModels: readonly RouteIdentityModel[] = Object.freeze(
  registry.collections.routeIdentities.map((item) =>
    Object.freeze({
      modelKind: "RouteIdentity" as const,
      routeId: item.routeId,
      version: item.version,
      destination: item.destination,
      decision: item.decision,
      priority: item.priority,
      status: item.status,
      registryIdentityRef: item.routeId,
      routesAtRuntime: false as const,
      executesRuntime: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: item.deterministicOrder,
    }),
  ),
);

/** Registry anchors — counts derived from Registry collections by reference. */
export const GatewayRoutingModelRegistryAnchors = Object.freeze({
  registryId: GatewayRoutingRegistryId,
  sourcePhase: "NEA-5:3" as const,
  routeIdentityCount: registry.collections.routeIdentityCount,
  destinationCount: registry.collections.destinationCount,
  decisionCount: registry.collections.decisionCount,
  strategyCount: registry.collections.strategyCount,
  priorityCount: registry.collections.priorityCount,
  statusCount: registry.collections.statusCount,
  resultCount: registry.collections.resultCount,
  contextCount: registry.collections.contextCount,
  routingPolicyCount: registry.collections.routingPolicyCount,
  contractCount: registry.collections.contractCount,
  lifecycleEntryCount: registry.collections.lifecycleEntryCount,
  capabilityCount: registry.capabilities.capabilityCount,
  registryPolicyCount: registry.policies.policyCount,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable domain model catalog. */
export const GatewayRoutingDomainModelCatalog = Object.freeze({
  catalogId: "NEA-5:3/DomainModelCatalog",
  sourcePhase: "NEA-5:3" as const,
  models: GatewayRoutingDomainModels,
  modelCount: GatewayRoutingDomainModels.length,
  routeIdentityModels: RouteIdentityModels,
  routeIdentityModelCount: RouteIdentityModels.length,
  registryAnchors: GatewayRoutingModelRegistryAnchors,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
