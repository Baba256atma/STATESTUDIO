/**
 * EIL-2:1 — Integration Connector Foundation Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Connector Platform.
 * Metadata-only. No runtime connector enforcement.
 *
 * Ownership: owned exclusively by EIL-2:1.
 */

export type IntegrationConnectorFoundationStatus = "Foundation";

export type IntegrationConnectorFoundationReadiness = "ReadyForRegistry";

export type IntegrationConnectorLifecycleState =
  | "Declared"
  | "Designed"
  | "Verified"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated"
  | "Retired";

export type IntegrationConnectorCategoryKey =
  | "InternalPlatformConnector"
  | "ExternalPlatformConnector"
  | "ApiConnector"
  | "EventConnector"
  | "MessageConnector"
  | "FileConnector"
  | "DatabaseConnector"
  | "ServiceConnector"
  | "IntegrationGatewayConnector"
  | "CustomConnector";

export type IntegrationConnectorContractName =
  | "ConnectorContract"
  | "EndpointContract"
  | "ProtocolContract"
  | "AuthenticationContract"
  | "AuthorizationContract"
  | "PayloadContract"
  | "MappingContract"
  | "CompatibilityContract"
  | "ConfigurationContract"
  | "LifecycleContract";

export type IntegrationConnectorCapabilityId =
  | "ConnectorRegistration"
  | "ConnectorDiscoveryMetadata"
  | "EndpointDescription"
  | "ProtocolDeclaration"
  | "CompatibilityDeclaration"
  | "LifecycleAwareness"
  | "DependencyAwareness"
  | "ConfigurationMetadata"
  | "ConnectorClassification"
  | "IntegrationReadiness";

export type IntegrationConnectorResponsibilityId =
  | "PreserveConnectorIdentity"
  | "PreservePlatformBoundaries"
  | "ExposeConnectorMetadata"
  | "MaintainCompatibility"
  | "MaintainDeterministicInventories"
  | "PreserveDependencyDirection"
  | "SupportFutureRuntimePlatforms"
  | "MaintainArchitecturalConsistency";

/** Canonical connector foundation identity. */
export interface IntegrationConnectorIdentity {
  readonly foundationId: "EIL-2:1/IntegrationConnectorFoundation";
  readonly foundationName: "Integration Connector Foundation";
  readonly foundationVersion: "1.0.0";
  readonly foundationNamespace: "nexora.eil.integration-connector.foundation";
  readonly layer: "EIL";
  readonly platform: "EIL-2";
  readonly phaseId: "EIL-2:1";
  readonly phaseType: "Foundation";
  readonly owner: "EIL-2 Integration Connector Foundation";
  readonly status: IntegrationConnectorFoundationStatus;
  readonly readiness: IntegrationConnectorFoundationReadiness;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable connector category declaration. */
export interface IntegrationConnectorCategory {
  readonly categoryId: `EIL-2:1/Category/${IntegrationConnectorCategoryKey}`;
  readonly categoryKey: IntegrationConnectorCategoryKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly runtimeImplemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Immutable connector contract declaration. */
export interface IntegrationConnectorContract {
  readonly contractId: `EIL-2:1/Contract/${IntegrationConnectorContractName}`;
  readonly contractName: IntegrationConnectorContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Descriptive connector capability declaration. */
export interface IntegrationConnectorCapability {
  readonly capabilityId: `EIL-2:1/Capability/${IntegrationConnectorCapabilityId}`;
  readonly capabilityKey: IntegrationConnectorCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly ownedByEil2: true;
  readonly executesRuntime: false;
  readonly performsNetworking: false;
  readonly performsAuthentication: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Descriptive connector responsibility declaration. */
export interface IntegrationConnectorResponsibility {
  readonly responsibilityId: IntegrationConnectorResponsibilityId;
  readonly responsibilityName: string;
  readonly description: string;
  readonly ownedByEil2: true;
  readonly executesRuntime: false;
  readonly performsBusinessLogic: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Lifecycle catalog declaration. */
export interface IntegrationConnectorLifecycle {
  readonly lifecycleId: "EIL-2:1/IntegrationConnectorLifecycle";
  readonly sourcePhase: "EIL-2:1";
  readonly states: readonly IntegrationConnectorLifecycleState[];
  readonly stateCount: number;
  readonly transitions: Readonly<
    Record<
      IntegrationConnectorLifecycleState,
      readonly IntegrationConnectorLifecycleState[]
    >
  >;
  readonly currentState: "Verified";
  readonly foundationReadiness: IntegrationConnectorFoundationReadiness;
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic foundation summary. */
export interface IntegrationConnectorFoundationSummary {
  readonly foundationId: "EIL-2:1/IntegrationConnectorFoundation";
  readonly version: "1.0.0";
  readonly name: "Integration Connector Foundation";
  readonly namespace: "nexora.eil.integration-connector.foundation";
  readonly status: IntegrationConnectorFoundationStatus;
  readonly readiness: IntegrationConnectorFoundationReadiness;
  readonly categoryCount: number;
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
export interface IntegrationConnectorFoundationInventory {
  readonly inventoryId: "EIL-2:1/Inventory";
  readonly categoryCount: number;
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
