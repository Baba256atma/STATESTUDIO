/**
 * NEA-5:3 — Gateway Routing Model Types.
 *
 * Strongly typed immutable domain model contracts for Gateway Routing.
 * Consumes Registry declarations by reference only. Metadata-only.
 *
 * Ownership: owned exclusively by NEA-5:3.
 */

/** Model status for NEA-5:3. */
export type GatewayRoutingModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type GatewayRoutingModelReadiness = "ReadyForValidation";

/** Canonical domain model kind identifiers — exactly twenty. */
export type GatewayRoutingModelKind =
  | "RouteIdentity"
  | "RouteDefinition"
  | "RouteDestination"
  | "RouteDecision"
  | "RouteContext"
  | "RouteStrategy"
  | "RoutePriority"
  | "RouteStatus"
  | "RouteResult"
  | "RoutePolicy"
  | "RouteMetadata"
  | "RouteCapability"
  | "RouteLifecycle"
  | "RouteRequest"
  | "RouteResponse"
  | "RouteResolution"
  | "RouteDiagnostics"
  | "RouteSummary"
  | "RouteConfiguration"
  | "RouteReference";

/** Model-phase lifecycle states for domain model artifacts. */
export type GatewayRoutingModelLifecycleState =
  | "Declared"
  | "Typed"
  | "Composed"
  | "Related"
  | "Boundaried"
  | "ReadyForValidation";

/** Registry collection names referenced by models. */
export type GatewayRoutingRegistryCollectionName =
  | "routeIdentities"
  | "destinations"
  | "decisions"
  | "strategies"
  | "priorities"
  | "statuses"
  | "results"
  | "contexts"
  | "routingPolicies"
  | "contracts"
  | "lifecycleEntries"
  | "capabilities"
  | "registryPolicies";

/** Registry reference — never duplicates registry values. */
export interface GatewayRoutingRegistryReference {
  readonly registryEntryId: string;
  readonly registryCollection: GatewayRoutingRegistryCollectionName;
  readonly preservesCanonicalReference: true;
  readonly duplicatesRegistryValue: false;
}

/** Domain model kind descriptor. */
export interface GatewayRoutingModelKindDescriptor {
  readonly modelKind: GatewayRoutingModelKind;
  readonly modelName: string;
  readonly description: string;
  readonly registryCollections: readonly GatewayRoutingRegistryCollectionName[];
  readonly fieldCount: number;
  readonly composesModels: readonly GatewayRoutingModelKind[];
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Model relationship declaration. */
export interface GatewayRoutingModelRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceModelKind: GatewayRoutingModelKind;
  readonly targetModelKind: GatewayRoutingModelKind;
  readonly cardinality: "one-to-one" | "one-to-many" | "many-to-one";
  readonly required: boolean;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Route Identity Model — structure only. */
export interface RouteIdentityModel {
  readonly modelKind: "RouteIdentity";
  readonly routeId: string;
  readonly version: string;
  readonly destination: string;
  readonly decision: string;
  readonly priority: string;
  readonly status: string;
  readonly registryIdentityRef: string;
  readonly routesAtRuntime: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical model identity. */
export interface GatewayRoutingModelIdentity {
  readonly modelId: string;
  readonly modelName: string;
  readonly modelVersion: string;
  readonly modelNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:3";
  readonly stage: "Model";
  readonly sourcePhase: "NEA-5:3";
  readonly owner: string;
  readonly status: GatewayRoutingModelStatus;
  readonly readiness: GatewayRoutingModelReadiness;
  readonly registryId: string;
  readonly registryVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic model summary. */
export interface GatewayRoutingModelSummary {
  readonly modelId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:3";
  readonly status: GatewayRoutingModelStatus;
  readonly readiness: GatewayRoutingModelReadiness;
  readonly registryId: string;
  readonly domainModelCount: number;
  readonly routeIdentityModelCount: number;
  readonly relationshipCount: number;
  readonly lifecycleStateCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
