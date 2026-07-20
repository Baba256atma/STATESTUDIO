/**
 * NEA-2:3 — Channel Connectors Model Types.
 *
 * Strongly typed immutable domain model contracts for Channel Connectors.
 * Consumes Registry declarations by reference only. Metadata-only.
 *
 * Ownership: owned exclusively by NEA-2:3.
 */

/** Model status for NEA-2:3. */
export type ChannelConnectorModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type ChannelConnectorModelReadiness = "ReadyForValidation";

/** Canonical domain model kind identifiers. */
export type ChannelConnectorModelKind =
  | "ConnectorIdentity"
  | "ConnectorDefinition"
  | "ConnectorFamily"
  | "ConnectorType"
  | "ConnectorProtocol"
  | "ConnectorDirection"
  | "ConnectorCapability"
  | "ConnectorAuthentication"
  | "ConnectorHealth"
  | "ConnectorStatus"
  | "ConnectorEvent"
  | "ConnectorPayload"
  | "ConnectorPolicy"
  | "ConnectorEndpoint"
  | "ConnectorSession"
  | "ConnectorMetadata"
  | "ConnectorConfiguration"
  | "ConnectorDiagnostics"
  | "ConnectorResult"
  | "ConnectorSummary";

/** Model-phase lifecycle states for domain model artifacts. */
export type ChannelConnectorModelLifecycleState =
  | "Declared"
  | "Typed"
  | "Composed"
  | "Related"
  | "Boundaried"
  | "ReadyForValidation";

/** Registry collection names referenced by models. */
export type ChannelConnectorRegistryCollectionName =
  | "families"
  | "types"
  | "identities"
  | "protocols"
  | "directions"
  | "authenticationMethods"
  | "lifecycleStates"
  | "healthStates"
  | "statuses"
  | "eventTypes"
  | "payloadTypes"
  | "capabilities"
  | "policies";

/** Registry reference — never duplicates registry values. */
export interface ChannelConnectorRegistryReference {
  readonly registryEntryId: string;
  readonly registryCollection: ChannelConnectorRegistryCollectionName;
  readonly preservesCanonicalReference: true;
  readonly duplicatesRegistryValue: false;
}

/** Domain model kind descriptor. */
export interface ChannelConnectorModelKindDescriptor {
  readonly modelKind: ChannelConnectorModelKind;
  readonly modelName: string;
  readonly description: string;
  readonly registryCollections: readonly ChannelConnectorRegistryCollectionName[];
  readonly fieldCount: number;
  readonly composesModels: readonly ChannelConnectorModelKind[];
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Model relationship declaration. */
export interface ChannelConnectorModelRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceModelKind: ChannelConnectorModelKind;
  readonly targetModelKind: ChannelConnectorModelKind;
  readonly cardinality: "one-to-one" | "one-to-many" | "many-to-one";
  readonly required: boolean;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Connector Identity Model — structure only. */
export interface ConnectorIdentityModel {
  readonly modelKind: "ConnectorIdentity";
  readonly connectorId: string;
  readonly connectorName: string;
  readonly connectorVersion: string;
  readonly connectorFamily: string;
  readonly connectorType: string;
  readonly connectorProtocol: string;
  readonly connectorDirection: string;
  readonly connectorStatus: string;
  readonly registryIdentityRef: string;
  readonly implementsConnector: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical model identity. */
export interface ChannelConnectorModelIdentity {
  readonly modelId: string;
  readonly modelName: string;
  readonly modelVersion: string;
  readonly modelNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:3";
  readonly stage: "Model";
  readonly sourcePhase: "NEA-2:3";
  readonly owner: string;
  readonly status: ChannelConnectorModelStatus;
  readonly readiness: ChannelConnectorModelReadiness;
  readonly registryId: string;
  readonly registryVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic model summary. */
export interface ChannelConnectorModelSummary {
  readonly modelId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:3";
  readonly status: ChannelConnectorModelStatus;
  readonly readiness: ChannelConnectorModelReadiness;
  readonly registryId: string;
  readonly domainModelCount: number;
  readonly identityModelCount: number;
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
