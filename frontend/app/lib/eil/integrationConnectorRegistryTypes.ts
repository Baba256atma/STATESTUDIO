/**
 * EIL-2:2 — Integration Connector Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Connector Registry.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-2:2.
 */

/** Registry status for EIL-2:2. */
export type IntegrationConnectorRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type IntegrationConnectorRegistryReadiness = "ReadyForModel";

/** Closed registry-category vocabulary. */
export type IntegrationConnectorRegistryCategory =
  | "Category"
  | "Contract"
  | "Capability"
  | "Responsibility"
  | "Lifecycle"
  | "Ownership";

/** Closed registry ownership vocabulary. */
export type IntegrationConnectorRegistryOwnership =
  | "EIL-2:2"
  | "EIL-2 Integration Connector Registry";

/** Closed registry entry status vocabulary. */
export type IntegrationConnectorRegistryEntryStatus = "Registered";

/** Closed registry source vocabulary. */
export type IntegrationConnectorRegistrySource =
  | "EIL-2:1"
  | "EIL-2:1/IntegrationConnectorFoundation";

/** Closed compatibility classification (metadata only). */
export type IntegrationConnectorCompatibilityClassification =
  | "Canonical"
  | "Protocol"
  | "Security"
  | "Payload"
  | "Compatibility"
  | "Configuration"
  | "Lifecycle";

/** Closed contract-type vocabulary (metadata only). */
export type IntegrationConnectorContractType =
  | "Identity"
  | "Endpoint"
  | "Protocol"
  | "Security"
  | "Payload"
  | "Mapping"
  | "Compatibility"
  | "Configuration"
  | "Lifecycle";

/** Registry entry ID branded shape. */
export type IntegrationConnectorRegistryEntryId =
  `EIL-2:2/Registry/${string}`;

/** Base immutable registry entry. */
export interface IntegrationConnectorRegistryEntry {
  readonly id: IntegrationConnectorRegistryEntryId;
  readonly key: string;
  readonly canonicalName: string;
  readonly category: IntegrationConnectorRegistryCategory;
  readonly description: string;
  readonly sourcePhase: IntegrationConnectorRegistrySource;
  readonly sourceNamespace: "nexora.eil.integration-connector.foundation";
  readonly ownership: IntegrationConnectorRegistryOwnership;
  readonly status: IntegrationConnectorRegistryEntryStatus;
  readonly lifecycleState: string;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Category-specific registry entry. */
export interface IntegrationConnectorCategoryRegistryEntry
  extends IntegrationConnectorRegistryEntry {
  readonly category: "Category";
  readonly categoryKey: string;
}

/** Contract-specific registry entry. */
export interface IntegrationConnectorContractRegistryEntry
  extends IntegrationConnectorRegistryEntry {
  readonly category: "Contract";
  readonly contractKey: string;
  readonly contractType: IntegrationConnectorContractType;
  readonly compatibilityClassification: IntegrationConnectorCompatibilityClassification;
}

/** Capability-specific registry entry. */
export interface IntegrationConnectorCapabilityRegistryEntry
  extends IntegrationConnectorRegistryEntry {
  readonly category: "Capability";
  readonly capabilityKey: string;
}

/** Responsibility-specific registry entry. */
export interface IntegrationConnectorResponsibilityRegistryEntry
  extends IntegrationConnectorRegistryEntry {
  readonly category: "Responsibility";
  readonly responsibilityKey: string;
  readonly architecturalOwner: "EIL-2";
}

/** Canonical registry identity descriptor. */
export interface IntegrationConnectorRegistryIdentityDescriptor {
  readonly phaseId: "EIL-2:2";
  readonly canonicalId: "EIL-2:2/IntegrationConnectorRegistry";
  readonly name: "Integration Connector Registry";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-connector.registry";
  readonly layer: "EIL";
  readonly platform: "EIL-2";
  readonly phaseType: "Registry";
  readonly status: IntegrationConnectorRegistryStatus;
  readonly readiness: IntegrationConnectorRegistryReadiness;
  readonly foundationDependency: "EIL-2:1/IntegrationConnectorFoundation";
  readonly foundationEntryPoint: "integrationConnectorFoundation.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate registry collections. */
export interface IntegrationConnectorRegistryCollectionsDescriptor {
  readonly collectionsId: "EIL-2:2/Collections";
  readonly sourcePhase: "EIL-2:2";
  readonly categories: readonly IntegrationConnectorCategoryRegistryEntry[];
  readonly contracts: readonly IntegrationConnectorContractRegistryEntry[];
  readonly capabilities: readonly IntegrationConnectorCapabilityRegistryEntry[];
  readonly responsibilities: readonly IntegrationConnectorResponsibilityRegistryEntry[];
  readonly categoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly totalRegistryEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate registry inventory. */
export interface IntegrationConnectorRegistryInventory {
  readonly inventoryId: "EIL-2:2/Inventory";
  readonly categoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly totalRegistryEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate registry summary. */
export interface IntegrationConnectorRegistrySummaryDescriptor {
  readonly registryId: "EIL-2:2/IntegrationConnectorRegistry";
  readonly version: "1.0.0";
  readonly name: "Integration Connector Registry";
  readonly namespace: "nexora.eil.integration-connector.registry";
  readonly status: IntegrationConnectorRegistryStatus;
  readonly readiness: IntegrationConnectorRegistryReadiness;
  readonly foundationId: "EIL-2:1/IntegrationConnectorFoundation";
  readonly categoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly totalRegistryEntryCount: number;
  readonly nextPhase: "EIL-2:3 — Integration Connector Model";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
