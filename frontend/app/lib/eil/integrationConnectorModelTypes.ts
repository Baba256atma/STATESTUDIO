/**
 * EIL-2:3 — Integration Connector Model Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Connector Model.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-2:3.
 */

/** Model status for EIL-2:3. */
export type IntegrationConnectorModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type IntegrationConnectorModelReadiness = "ReadyForValidation";

/** Closed domain-model category vocabulary. */
export type IntegrationConnectorModelCategory =
  | "Connector"
  | "ConnectorEndpoint"
  | "ConnectorProtocol"
  | "ConnectorConfiguration"
  | "ConnectorAuthentication"
  | "ConnectorAuthorization"
  | "ConnectorPayload"
  | "ConnectorMapping"
  | "ConnectorCompatibility"
  | "ConnectorLifecycle"
  | "ConnectorCategory"
  | "ConnectorOwnership"
  | "ConnectorDependency"
  | "ConnectorContext"
  | "ConnectorRoute"
  | "ConnectorTopology";

/** Closed relationship-type vocabulary. */
export type IntegrationConnectorRelationshipType =
  | "owns"
  | "references"
  | "dependsOn"
  | "compatibleWith"
  | "mappedTo"
  | "connectedTo"
  | "exposes"
  | "belongsTo"
  | "extends"
  | "composedOf"
  | "secures"
  | "transports";

/** Closed endpoint-type vocabulary. */
export type IntegrationConnectorEndpointType =
  | "Ingress"
  | "Egress"
  | "Bidirectional"
  | "Control"
  | "Data"
  | "Event"
  | "File"
  | "Service";

/** Closed endpoint-role vocabulary. */
export type IntegrationConnectorEndpointRole =
  | "Producer"
  | "Consumer"
  | "Gateway"
  | "Bridge"
  | "Observer";

/** Closed endpoint-visibility vocabulary. */
export type IntegrationConnectorEndpointVisibility =
  | "Internal"
  | "External"
  | "Shared";

/** Closed protocol-family vocabulary (descriptive metadata only). */
export type IntegrationConnectorProtocolFamily =
  | "ApiMetadata"
  | "EventMetadata"
  | "MessageMetadata"
  | "FileMetadata"
  | "DatabaseMetadata"
  | "ServiceMetadata"
  | "GatewayMetadata"
  | "CustomMetadata";

/** Closed lifecycle-state vocabulary. */
export type IntegrationConnectorModelLifecycleState =
  | "Declared"
  | "Designed"
  | "Verified"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated"
  | "Retired";

/** Closed model ownership vocabulary. */
export type IntegrationConnectorModelOwnership =
  | "EIL-2:3"
  | "EIL-2 Integration Connector Model";

/** Immutable registry reference — never duplicates registry values. */
export interface IntegrationConnectorRegistryReference {
  readonly registryId: "EIL-2:2/IntegrationConnectorRegistry";
  readonly registryNamespace: "nexora.eil.integration-connector.registry";
  readonly entryPoint: "integrationConnectorRegistry.ts";
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
export interface IntegrationConnectorDomainModel {
  readonly modelId: `EIL-2:3/Model/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: IntegrationConnectorModelCategory;
  readonly sourceRegistryReference: IntegrationConnectorRegistryReference;
  readonly ownership: IntegrationConnectorModelOwnership;
  readonly lifecycle: IntegrationConnectorModelLifecycleState;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable relationship model. */
export interface IntegrationConnectorRelationshipModel {
  readonly relationshipId: `EIL-2:3/Relationship/${string}`;
  readonly relationshipType: IntegrationConnectorRelationshipType;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourceModelKey: string;
  readonly targetModelKey: string;
  readonly sourceRegistryReference: IntegrationConnectorRegistryReference;
  readonly ownership: IntegrationConnectorModelOwnership;
  readonly lifecycle: IntegrationConnectorModelLifecycleState;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly resolvesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable endpoint model. */
export interface IntegrationConnectorEndpointModel {
  readonly endpointModelId: `EIL-2:3/Endpoint/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly endpointType: IntegrationConnectorEndpointType;
  readonly endpointRole: IntegrationConnectorEndpointRole;
  readonly visibility: IntegrationConnectorEndpointVisibility;
  readonly classification: string;
  readonly compatibility: string;
  readonly lifecycle: IntegrationConnectorModelLifecycleState;
  readonly ownership: IntegrationConnectorModelOwnership;
  readonly sourceRegistryReference: IntegrationConnectorRegistryReference;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly communicates: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable protocol model. */
export interface IntegrationConnectorProtocolModel {
  readonly protocolModelId: `EIL-2:3/Protocol/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly protocolFamily: IntegrationConnectorProtocolFamily;
  readonly classification: string;
  readonly compatibility: string;
  readonly lifecycle: IntegrationConnectorModelLifecycleState;
  readonly ownership: IntegrationConnectorModelOwnership;
  readonly scope: string;
  readonly protocolVersionMetadata: "1.0.0";
  readonly sourceRegistryReference: IntegrationConnectorRegistryReference;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly implementsProtocol: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable topology model. */
export interface IntegrationConnectorTopologyModel {
  readonly topologyModelId: "EIL-2:3/Topology/ConnectorTopology";
  readonly canonicalKey: "ConnectorTopology";
  readonly canonicalName: "Connector Topology";
  readonly description: string;
  readonly nodeKeys: readonly string[];
  readonly relationshipTypeCount: number;
  readonly sourceRegistryReference: IntegrationConnectorRegistryReference;
  readonly ownership: IntegrationConnectorModelOwnership;
  readonly lifecycle: IntegrationConnectorModelLifecycleState;
  readonly version: "1.0.0";
  readonly graphEngine: false;
  readonly routingEngine: false;
  readonly visualization: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical model identity descriptor. */
export interface IntegrationConnectorModelIdentityDescriptor {
  readonly phaseId: "EIL-2:3";
  readonly canonicalId: "EIL-2:3/IntegrationConnectorModel";
  readonly name: "Integration Connector Model";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-connector.model";
  readonly layer: "EIL";
  readonly platform: "EIL-2";
  readonly phaseType: "Model";
  readonly status: IntegrationConnectorModelStatus;
  readonly readiness: IntegrationConnectorModelReadiness;
  readonly registryDependency: "EIL-2:2/IntegrationConnectorRegistry";
  readonly registryEntryPoint: "integrationConnectorRegistry.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate model collections. */
export interface IntegrationConnectorModelCollectionsDescriptor {
  readonly collectionsId: "EIL-2:3/Collections";
  readonly sourcePhase: "EIL-2:3";
  readonly domains: readonly IntegrationConnectorDomainModel[];
  readonly relationships: readonly IntegrationConnectorRelationshipModel[];
  readonly endpoints: readonly IntegrationConnectorEndpointModel[];
  readonly protocols: readonly IntegrationConnectorProtocolModel[];
  readonly domainModelCount: number;
  readonly relationshipCount: number;
  readonly endpointModelCount: number;
  readonly protocolModelCount: number;
  readonly totalModelEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate model inventory. */
export interface IntegrationConnectorModelInventory {
  readonly inventoryId: "EIL-2:3/Inventory";
  readonly domainModelCount: number;
  readonly relationshipCount: number;
  readonly endpointModelCount: number;
  readonly protocolModelCount: number;
  readonly relationshipTypeCount: number;
  readonly totalModelEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate model summary. */
export interface IntegrationConnectorModelSummaryDescriptor {
  readonly modelId: "EIL-2:3/IntegrationConnectorModel";
  readonly version: "1.0.0";
  readonly name: "Integration Connector Model";
  readonly namespace: "nexora.eil.integration-connector.model";
  readonly status: IntegrationConnectorModelStatus;
  readonly readiness: IntegrationConnectorModelReadiness;
  readonly registryId: "EIL-2:2/IntegrationConnectorRegistry";
  readonly domainModelCount: number;
  readonly relationshipCount: number;
  readonly endpointModelCount: number;
  readonly protocolModelCount: number;
  readonly totalModelEntryCount: number;
  readonly nextPhase: "EIL-2:4 — Integration Connector Validation";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
