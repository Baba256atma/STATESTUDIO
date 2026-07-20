/**
 * NEA-5:1 — Gateway Routing Foundation Types.
 *
 * Readonly contracts and closed vocabularies for Gateway Routing.
 * Metadata-only. No runtime routing, consumer selection, or networking.
 *
 * Ownership: owned exclusively by NEA-5:1.
 */

/** Foundation status for NEA-5:1. */
export type GatewayRoutingFoundationStatus = "Foundation";

/** Immediate downstream readiness — Registry only. */
export type GatewayRoutingFoundationReadiness = "ReadyForRegistry";

/** Immutable routing lifecycle states. */
export type GatewayRoutingLifecycleState =
  | "Received"
  | "Evaluated"
  | "DestinationResolved"
  | "RoutingPrepared"
  | "Routed"
  | "Completed";

/** Canonical routing destination identifiers. */
export type GatewayRoutingDestinationId =
  | "ExecutiveEngine"
  | "DataKnowledgeLayer"
  | "Advisor"
  | "Director"
  | "EVE"
  | "Operations"
  | "BusinessPlatform"
  | "InternalService"
  | "Reject"
  | "DeadLetter";

/** Immutable routing decision identifiers. */
export type GatewayRoutingDecisionId =
  | "Accepted"
  | "Routed"
  | "Deferred"
  | "Rejected"
  | "Failed"
  | "Unknown";

/** Declarative routing context dimension identifiers. */
export type GatewayRoutingContextDimensionId =
  | "Tenant"
  | "Workspace"
  | "Session"
  | "Conversation"
  | "Security"
  | "Connector"
  | "Request"
  | "Priority";

/** Declarative routing capability identifiers. */
export type GatewayRoutingCapabilityId =
  | "DestinationResolution"
  | "ConsumerSelection"
  | "ContextPropagation"
  | "RouteMetadataDeclaration"
  | "RoutePolicyDeclaration"
  | "PriorityDeclaration"
  | "CorrelationPropagation"
  | "RoutingSummaryDeclaration"
  | "RoutingResultDeclaration";

/** Contract declaration for a routing foundation surface. */
export interface GatewayRoutingContractDeclaration {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

/** Destination declaration. */
export interface GatewayRoutingDestinationDeclaration {
  readonly destinationId: GatewayRoutingDestinationId;
  readonly destinationName: string;
  readonly description: string;
  readonly routesAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Decision declaration. */
export interface GatewayRoutingDecisionDeclaration {
  readonly decisionId: GatewayRoutingDecisionId;
  readonly decisionName: string;
  readonly description: string;
  readonly evaluatesAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Context dimension declaration. */
export interface GatewayRoutingContextDimensionDeclaration {
  readonly dimensionId: GatewayRoutingContextDimensionId;
  readonly dimensionName: string;
  readonly description: string;
  readonly propagatesAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Capability declaration. */
export interface GatewayRoutingCapabilityDeclaration {
  readonly capabilityId: GatewayRoutingCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical foundation identity. */
export interface GatewayRoutingFoundationIdentity {
  readonly foundationId: string;
  readonly foundationName: string;
  readonly foundationVersion: string;
  readonly foundationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:1";
  readonly stage: "Foundation";
  readonly sourcePhase: "NEA-5:1";
  readonly owner: string;
  readonly status: GatewayRoutingFoundationStatus;
  readonly readiness: GatewayRoutingFoundationReadiness;
  readonly description: string;
  readonly publicIndexId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic foundation summary. */
export interface GatewayRoutingFoundationSummary {
  readonly foundationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:1";
  readonly status: GatewayRoutingFoundationStatus;
  readonly readiness: GatewayRoutingFoundationReadiness;
  readonly publicIndexId: string;
  readonly contractCount: number;
  readonly destinationCount: number;
  readonly decisionCount: number;
  readonly contextDimensionCount: number;
  readonly capabilityCount: number;
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
