/**
 * EIL-1:1 — Integration Foundation Types.
 *
 * Readonly contracts and closed vocabularies for the Executive Integration Layer.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-1:1.
 */

export type IntegrationFoundationStatus = "Foundation";

export type IntegrationFoundationReadiness = "ReadyForRegistry";

export type IntegrationLifecycleState =
  | "Declared"
  | "Designed"
  | "Verified"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated"
  | "Retired";

export type IntegrationPlatformId =
  | "ENG"
  | "DKL"
  | "NEA"
  | "Director"
  | "Advisor"
  | "EVE"
  | "OPS"
  | "BUS"
  | "CORE"
  | "CORE-TEN";

export type IntegrationContractName =
  | "IntegrationContract"
  | "PlatformContract"
  | "ConsumerContract"
  | "ProducerContract"
  | "EventContract"
  | "RequestContract"
  | "ResponseContract"
  | "CoordinationContract"
  | "RoutingContract"
  | "CompatibilityContract";

export type IntegrationCapabilityId =
  | "PlatformIntegration"
  | "RoutingCoordination"
  | "DependencyAwareness"
  | "Interoperability"
  | "CompatibilityValidation"
  | "ServiceDiscovery"
  | "ContractPreservation"
  | "OrchestrationSupport"
  | "IntegrationLifecycleAwareness"
  | "ExecutiveCoordination";

export type IntegrationResponsibilityId =
  | "PreservePlatformBoundaries"
  | "CoordinateIntegrations"
  | "ExposeCanonicalMetadata"
  | "MaintainInteroperability"
  | "PreventIllegalCoupling"
  | "PreserveDependencyDirection"
  | "MaintainArchitecturalConsistency"
  | "SupportFutureRuntimeLayers";

/** Canonical foundation identity fields. */
export interface IntegrationFoundationIdentityDescriptor {
  readonly foundationId: "EIL-1:1/IntegrationFoundation";
  readonly foundationName: "Integration Foundation";
  readonly foundationVersion: "1.0.0";
  readonly foundationNamespace: "nexora.eil.integration.foundation";
  readonly layer: "Executive Integration Layer";
  readonly phase: "EIL-1";
  readonly stage: "Foundation";
  readonly sourcePhase: "EIL-1:1";
  readonly owner: "EIL-1 Integration Foundation";
  readonly status: IntegrationFoundationStatus;
  readonly readiness: IntegrationFoundationReadiness;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Declarative platform integration identity (no module import). */
export interface IntegrationPlatformIdentity {
  readonly platformId: IntegrationPlatformId;
  readonly platformName: string;
  readonly role: "Producer" | "Consumer" | "Coordinator" | "Both";
  readonly integrationMode: "MetadataDeclarationOnly";
  readonly executesBusinessLogic: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Immutable contract declaration. */
export interface IntegrationContractDeclaration {
  readonly contractId: `EIL-1:1/Contract/${IntegrationContractName}`;
  readonly contractName: IntegrationContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Descriptive capability declaration. */
export interface IntegrationCapabilityDeclaration {
  readonly capabilityId: `EIL-1:1/Capability/${IntegrationCapabilityId}`;
  readonly capabilityKey: IntegrationCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly ownedByEil: true;
  readonly executesRuntime: false;
  readonly performsInference: false;
  readonly performsDecision: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Descriptive responsibility declaration. */
export interface IntegrationResponsibilityDeclaration {
  readonly responsibilityId: IntegrationResponsibilityId;
  readonly responsibilityName: string;
  readonly description: string;
  readonly ownedByEil: true;
  readonly executesRuntime: false;
  readonly performsBusinessLogic: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Lifecycle catalog declaration. */
export interface IntegrationLifecycleDeclaration {
  readonly lifecycleId: "EIL-1:1/IntegrationLifecycle";
  readonly sourcePhase: "EIL-1:1";
  readonly states: readonly IntegrationLifecycleState[];
  readonly stateCount: number;
  readonly transitions: Readonly<
    Record<IntegrationLifecycleState, readonly IntegrationLifecycleState[]>
  >;
  readonly currentState: "Verified";
  readonly foundationReadiness: IntegrationFoundationReadiness;
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic foundation summary. */
export interface IntegrationFoundationSummary {
  readonly foundationId: "EIL-1:1/IntegrationFoundation";
  readonly version: "1.0.0";
  readonly name: "Integration Foundation";
  readonly namespace: "nexora.eil.integration.foundation";
  readonly status: IntegrationFoundationStatus;
  readonly readiness: IntegrationFoundationReadiness;
  readonly platformCount: number;
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
