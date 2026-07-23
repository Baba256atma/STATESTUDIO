/**
 * EIL-3:2 — Integration Routing Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Routing Registry.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-3:2.
 */

/** Registry status for EIL-3:2. */
export type RoutingRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type RoutingRegistryReadiness = "ReadyForModel";

/** Closed registry-category vocabulary. */
export type RoutingRegistryCategory =
  | "Category"
  | "Contract"
  | "Capability"
  | "Responsibility"
  | "Lifecycle"
  | "Ownership";

/** Closed registry ownership vocabulary. */
export type RoutingRegistryOwnership =
  | "EIL-3:2"
  | "EIL-3 Integration Routing Registry";

/** Closed registry entry status vocabulary. */
export type RoutingRegistryEntryStatus = "Registered";

/** Closed registry source vocabulary. */
export type RoutingRegistrySource =
  | "EIL-3:1"
  | "EIL-3:1/IntegrationRoutingFoundation";

/** Closed compatibility classification (metadata only). */
export type RoutingCompatibilityClassification =
  | "Canonical"
  | "Identity"
  | "Path"
  | "Policy"
  | "Condition"
  | "Priority"
  | "Compatibility"
  | "Configuration"
  | "Lifecycle"
  | "Metadata";

/** Closed contract-type vocabulary (metadata only). */
export type RoutingContractType =
  | "Identity"
  | "Path"
  | "Policy"
  | "Condition"
  | "Priority"
  | "Compatibility"
  | "Configuration"
  | "Lifecycle"
  | "Metadata";

/** Registry entry ID branded shape. */
export type RoutingRegistryEntryId = `EIL-3:2/Registry/${string}`;

/** Base immutable registry entry. */
export interface RoutingRegistryEntry {
  readonly id: RoutingRegistryEntryId;
  readonly key: string;
  readonly canonicalName: string;
  readonly category: RoutingRegistryCategory;
  readonly description: string;
  readonly sourcePhase: RoutingRegistrySource;
  readonly sourceNamespace: "nexora.eil.integration-routing.foundation";
  readonly ownership: RoutingRegistryOwnership;
  readonly status: RoutingRegistryEntryStatus;
  readonly lifecycleState: string;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Category-specific registry entry. */
export interface RoutingCategoryRegistryEntry extends RoutingRegistryEntry {
  readonly category: "Category";
  readonly categoryKey: string;
}

/** Contract-specific registry entry. */
export interface RoutingContractRegistryEntry extends RoutingRegistryEntry {
  readonly category: "Contract";
  readonly contractKey: string;
  readonly contractType: RoutingContractType;
  readonly compatibilityClassification: RoutingCompatibilityClassification;
}

/** Capability-specific registry entry. */
export interface RoutingCapabilityRegistryEntry extends RoutingRegistryEntry {
  readonly category: "Capability";
  readonly capabilityKey: string;
}

/** Responsibility-specific registry entry. */
export interface RoutingResponsibilityRegistryEntry
  extends RoutingRegistryEntry {
  readonly category: "Responsibility";
  readonly responsibilityKey: string;
  readonly architecturalOwner: "EIL-3";
}

/** Canonical registry identity descriptor. */
export interface RoutingRegistryIdentityDescriptor {
  readonly phaseId: "EIL-3:2";
  readonly canonicalId: "EIL-3:2/IntegrationRoutingRegistry";
  readonly name: "Integration Routing Registry";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-routing.registry";
  readonly layer: "EIL";
  readonly platform: "EIL-3";
  readonly phaseType: "Registry";
  readonly status: RoutingRegistryStatus;
  readonly readiness: RoutingRegistryReadiness;
  readonly foundationDependency: "EIL-3:1/IntegrationRoutingFoundation";
  readonly foundationEntryPoint: "integrationRoutingFoundation.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate registry collections. */
export interface RoutingRegistryCollections {
  readonly collectionsId: "EIL-3:2/Collections";
  readonly sourcePhase: "EIL-3:2";
  readonly categories: readonly RoutingCategoryRegistryEntry[];
  readonly contracts: readonly RoutingContractRegistryEntry[];
  readonly capabilities: readonly RoutingCapabilityRegistryEntry[];
  readonly responsibilities: readonly RoutingResponsibilityRegistryEntry[];
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
export interface RoutingRegistryInventory {
  readonly inventoryId: "EIL-3:2/Inventory";
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
export interface RoutingRegistrySummary {
  readonly registryId: "EIL-3:2/IntegrationRoutingRegistry";
  readonly version: "1.0.0";
  readonly name: "Integration Routing Registry";
  readonly namespace: "nexora.eil.integration-routing.registry";
  readonly status: RoutingRegistryStatus;
  readonly readiness: RoutingRegistryReadiness;
  readonly foundationId: "EIL-3:1/IntegrationRoutingFoundation";
  readonly categoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly totalRegistryEntryCount: number;
  readonly nextPhase: "EIL-3:3 — Integration Routing Model";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
