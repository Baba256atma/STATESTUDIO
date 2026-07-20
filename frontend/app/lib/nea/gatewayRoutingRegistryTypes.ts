/**
 * NEA-5:2 — Gateway Routing Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Gateway Routing Registry.
 * Metadata-only. No runtime routing, consumer selection, or networking.
 *
 * Ownership: owned exclusively by NEA-5:2.
 */

/** Registry status for NEA-5:2. */
export type GatewayRoutingRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type GatewayRoutingRegistryReadiness = "ReadyForModel";

/** Registry-owned routing strategy identifiers. */
export type RoutingStrategyId =
  | "Direct"
  | "Broadcast"
  | "Priority"
  | "Sequential"
  | "Conditional"
  | "Failover"
  | "Deferred"
  | "Manual";

/** Registry-owned routing priority identifiers. */
export type RoutingPriorityId =
  | "Critical"
  | "High"
  | "Normal"
  | "Low"
  | "Deferred";

/** Registry-owned routing status identifiers. */
export type RoutingStatusId =
  | "Registered"
  | "Active"
  | "Deprecated"
  | "Disabled"
  | "Reserved";

/** Registry-owned routing result identifiers. */
export type RoutingResultId =
  | "Success"
  | "Pending"
  | "Rejected"
  | "Failed"
  | "Unknown";

/** Registry-owned routing policy vocabulary identifiers. */
export type RoutingPolicyVocabularyId =
  | "DestinationRequired"
  | "PriorityHonored"
  | "FailoverAllowed"
  | "CorrelationRequired"
  | "ContextPropagationRequired"
  | "RejectOnUnknown";

/** Base registry entry shape. */
export interface GatewayRoutingRegistryEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly sourcePhase: "NEA-5:1" | "NEA-5:2";
  readonly foundationReference: string | null;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/**
 * Declarative routing identity registry entry.
 * Registry only — no executable routing.
 */
export interface RouteIdentityDeclaration {
  readonly routeId: string;
  readonly version: string;
  readonly destination: string;
  readonly decision: string;
  readonly priority: RoutingPriorityId;
  readonly status: RoutingStatusId;
  readonly executesRuntime: false;
  readonly routesAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical registry identity. */
export interface GatewayRoutingRegistryIdentity {
  readonly registryId: string;
  readonly registryName: string;
  readonly registryVersion: string;
  readonly registryNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:2";
  readonly stage: "Registry";
  readonly sourcePhase: "NEA-5:2";
  readonly owner: string;
  readonly status: GatewayRoutingRegistryStatus;
  readonly readiness: GatewayRoutingRegistryReadiness;
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic registry summary. */
export interface GatewayRoutingRegistrySummary {
  readonly registryId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:2";
  readonly status: GatewayRoutingRegistryStatus;
  readonly readiness: GatewayRoutingRegistryReadiness;
  readonly foundationId: string;
  readonly routeIdentityCount: number;
  readonly destinationCount: number;
  readonly decisionCount: number;
  readonly strategyCount: number;
  readonly priorityCount: number;
  readonly statusCount: number;
  readonly resultCount: number;
  readonly contextCount: number;
  readonly routingPolicyCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly lifecycleEntryCount: number;
  readonly registryPolicyCount: number;
  readonly totalRegistryEntryCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
