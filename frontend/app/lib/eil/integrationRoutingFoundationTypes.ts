/**
 * EIL-3:1 — Integration Routing Foundation Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Routing Platform.
 * Metadata-only. No runtime routing enforcement.
 *
 * Ownership: owned exclusively by EIL-3:1.
 */

export type RoutingFoundationStatus = "Foundation";

export type RoutingFoundationReadiness = "ReadyForRegistry";

export type RoutingLifecycleState =
  | "Declared"
  | "Designed"
  | "Verified"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated"
  | "Retired";

export type RoutingCategoryKey =
  | "DirectRoute"
  | "ConditionalRoute"
  | "SequentialRoute"
  | "ParallelRoute"
  | "EventRoute"
  | "RequestRoute"
  | "ResponseRoute"
  | "ScheduledRoute"
  | "GatewayRoute"
  | "CompositeRoute";

export type RoutingContractName =
  | "RouteContract"
  | "RouteIdentityContract"
  | "RoutePathContract"
  | "RoutePolicyContract"
  | "RouteConditionContract"
  | "RoutePriorityContract"
  | "RouteCompatibilityContract"
  | "RouteConfigurationContract"
  | "RouteLifecycleContract"
  | "RouteMetadataContract";

export type RoutingCapabilityId =
  | "RouteClassification"
  | "RouteDescription"
  | "RouteMetadata"
  | "RouteDependencyDeclaration"
  | "RouteCompatibilityDeclaration"
  | "RouteLifecycleAwareness"
  | "RoutePolicyDescription"
  | "RouteConfigurationMetadata"
  | "RouteInventorySupport"
  | "RouteReadinessDeclaration";

export type RoutingResponsibilityId =
  | "PreserveRouteIdentity"
  | "PreserveArchitecturalBoundaries"
  | "PublishRouteMetadata"
  | "PreserveCompatibility"
  | "PreserveDeterministicInventories"
  | "PreserveDependencyDirection"
  | "SupportFutureRuntimePlatforms"
  | "PreserveArchitecturalConsistency";

/** Canonical routing foundation identity. */
export interface RoutingIdentity {
  readonly foundationId: "EIL-3:1/IntegrationRoutingFoundation";
  readonly foundationName: "Integration Routing Foundation";
  readonly foundationVersion: "1.0.0";
  readonly foundationNamespace: "nexora.eil.integration-routing.foundation";
  readonly layer: "EIL";
  readonly platform: "EIL-3";
  readonly phaseId: "EIL-3:1";
  readonly phaseType: "Foundation";
  readonly owner: "EIL-3 Integration Routing Foundation";
  readonly status: RoutingFoundationStatus;
  readonly readiness: RoutingFoundationReadiness;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable routing category declaration. */
export interface RoutingCategory {
  readonly categoryId: `EIL-3:1/Category/${RoutingCategoryKey}`;
  readonly categoryKey: RoutingCategoryKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly runtimeImplemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Immutable routing contract declaration. */
export interface RoutingContract {
  readonly contractId: `EIL-3:1/Contract/${RoutingContractName}`;
  readonly contractName: RoutingContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Descriptive routing capability declaration. */
export interface RoutingCapability {
  readonly capabilityId: `EIL-3:1/Capability/${RoutingCapabilityId}`;
  readonly capabilityKey: RoutingCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly ownedByEil3: true;
  readonly executesRuntime: false;
  readonly performsRouting: false;
  readonly performsNetworking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Descriptive routing responsibility declaration. */
export interface RoutingResponsibility {
  readonly responsibilityId: RoutingResponsibilityId;
  readonly responsibilityName: string;
  readonly description: string;
  readonly ownedByEil3: true;
  readonly executesRuntime: false;
  readonly performsBusinessLogic: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Lifecycle catalog declaration. */
export interface RoutingLifecycle {
  readonly lifecycleId: "EIL-3:1/IntegrationRoutingLifecycle";
  readonly sourcePhase: "EIL-3:1";
  readonly states: readonly RoutingLifecycleState[];
  readonly stateCount: number;
  readonly transitions: Readonly<
    Record<RoutingLifecycleState, readonly RoutingLifecycleState[]>
  >;
  readonly currentState: "Verified";
  readonly foundationReadiness: RoutingFoundationReadiness;
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic foundation summary. */
export interface RoutingFoundationSummary {
  readonly foundationId: "EIL-3:1/IntegrationRoutingFoundation";
  readonly version: "1.0.0";
  readonly name: "Integration Routing Foundation";
  readonly namespace: "nexora.eil.integration-routing.foundation";
  readonly status: RoutingFoundationStatus;
  readonly readiness: RoutingFoundationReadiness;
  readonly routingCategoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly terminologyCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic foundation inventory. */
export interface RoutingFoundationInventory {
  readonly inventoryId: "EIL-3:1/Inventory";
  readonly routingCategoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly totalFoundationEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
