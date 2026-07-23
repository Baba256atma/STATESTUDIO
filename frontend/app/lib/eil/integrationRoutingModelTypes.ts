/**
 * EIL-3:3 — Integration Routing Model Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Routing Model.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-3:3.
 */

/** Model status for EIL-3:3. */
export type RoutingModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type RoutingModelReadiness = "ReadyForValidation";

/** Closed domain-model category vocabulary. */
export type RoutingDomainModelKey =
  | "Route"
  | "RoutePath"
  | "RouteNode"
  | "RouteSegment"
  | "RouteCondition"
  | "RoutePolicy"
  | "RoutePriority"
  | "RouteMetadata"
  | "RouteCategory"
  | "RouteLifecycle"
  | "RouteDependency"
  | "RouteCompatibility"
  | "RouteBoundary"
  | "RouteContext"
  | "RouteTopology"
  | "RouteConfiguration";

/** Closed relationship-type vocabulary. */
export type RoutingRelationshipType =
  | "owns"
  | "references"
  | "dependsOn"
  | "compatibleWith"
  | "mappedTo"
  | "connectedTo"
  | "belongsTo"
  | "composedOf"
  | "extends"
  | "routesThrough"
  | "governedBy"
  | "classifiedAs";

/** Closed topology-model vocabulary. */
export type RoutingTopologyKey =
  | "Linear"
  | "Tree"
  | "Mesh"
  | "Star"
  | "Ring"
  | "Hub"
  | "Gateway"
  | "Composite";

/** Closed lifecycle-state vocabulary. */
export type RoutingModelLifecycleState =
  | "Declared"
  | "Designed"
  | "Verified"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated"
  | "Retired";

/** Closed model ownership vocabulary. */
export type RoutingModelOwnership =
  | "EIL-3:3"
  | "EIL-3 Integration Routing Model";

/** Immutable registry reference — never duplicates registry values. */
export interface RoutingRegistryReference {
  readonly registryId: "EIL-3:2/IntegrationRoutingRegistry";
  readonly registryNamespace: "nexora.eil.integration-routing.registry";
  readonly entryPoint: "integrationRoutingRegistry.ts";
  readonly collection:
    | "categories"
    | "contracts"
    | "capabilities"
    | "responsibilities"
    | "lifecycleCoverage"
    | "ownershipCoverage"
    | "collections";
  readonly entryKey: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesRegistryValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Base immutable domain model descriptor. */
export interface RoutingDomainModel {
  readonly modelId: `EIL-3:3/Model/${RoutingDomainModelKey}`;
  readonly canonicalKey: RoutingDomainModelKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: RoutingModelOwnership;
  readonly lifecycle: RoutingModelLifecycleState;
  readonly sourceRegistryReference: RoutingRegistryReference;
  readonly sourceReference: string;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable relationship model. */
export interface RoutingRelationshipModel {
  readonly relationshipId: `EIL-3:3/Relationship/${string}`;
  readonly relationshipType: RoutingRelationshipType;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourceModelKey: RoutingDomainModelKey;
  readonly targetModelKey: RoutingDomainModelKey;
  readonly ownership: RoutingModelOwnership;
  readonly lifecycle: RoutingModelLifecycleState;
  readonly sourceRegistryReference: RoutingRegistryReference;
  readonly sourceReference: string;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly resolvesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable topology model. */
export interface RoutingTopologyModel {
  readonly topologyModelId: `EIL-3:3/Topology/${RoutingTopologyKey}`;
  readonly canonicalKey: RoutingTopologyKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: RoutingModelOwnership;
  readonly lifecycle: RoutingModelLifecycleState;
  readonly sourceRegistryReference: RoutingRegistryReference;
  readonly sourceReference: string;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly graphEngine: false;
  readonly routingEngine: false;
  readonly visualization: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable lifecycle mapping model. */
export interface RoutingLifecycleModel {
  readonly lifecycleModelId: `EIL-3:3/Lifecycle/${RoutingModelLifecycleState}`;
  readonly canonicalKey: RoutingModelLifecycleState;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: RoutingModelOwnership;
  readonly lifecycle: RoutingModelLifecycleState;
  readonly sourceRegistryReference: RoutingRegistryReference;
  readonly sourceReference: string;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical model identity descriptor. */
export interface RoutingModelIdentity {
  readonly phaseId: "EIL-3:3";
  readonly canonicalId: "EIL-3:3/IntegrationRoutingModel";
  readonly name: "Integration Routing Model";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-routing.model";
  readonly layer: "EIL";
  readonly platform: "EIL-3";
  readonly phaseType: "Model";
  readonly status: RoutingModelStatus;
  readonly readiness: RoutingModelReadiness;
  readonly registryDependency: "EIL-3:2/IntegrationRoutingRegistry";
  readonly registryEntryPoint: "integrationRoutingRegistry.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate model collections. */
export interface RoutingModelCollections {
  readonly collectionsId: "EIL-3:3/Collections";
  readonly sourcePhase: "EIL-3:3";
  readonly domains: readonly RoutingDomainModel[];
  readonly relationships: readonly RoutingRelationshipModel[];
  readonly topologies: readonly RoutingTopologyModel[];
  readonly lifecycles: readonly RoutingLifecycleModel[];
  readonly domainModelCount: number;
  readonly relationshipCount: number;
  readonly topologyCount: number;
  readonly lifecycleCount: number;
  readonly totalModelEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate model inventory. */
export interface RoutingModelInventory {
  readonly inventoryId: "EIL-3:3/Inventory";
  readonly domainModelCount: number;
  readonly relationshipCount: number;
  readonly topologyCount: number;
  readonly lifecycleCount: number;
  readonly totalModelEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate model summary. */
export interface RoutingModelSummary {
  readonly modelId: "EIL-3:3/IntegrationRoutingModel";
  readonly version: "1.0.0";
  readonly name: "Integration Routing Model";
  readonly namespace: "nexora.eil.integration-routing.model";
  readonly status: RoutingModelStatus;
  readonly readiness: RoutingModelReadiness;
  readonly registryId: "EIL-3:2/IntegrationRoutingRegistry";
  readonly domainModelCount: number;
  readonly relationshipCount: number;
  readonly topologyCount: number;
  readonly lifecycleCount: number;
  readonly totalModelEntryCount: number;
  readonly nextPhase: "EIL-3:4 — Integration Routing Validation";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
