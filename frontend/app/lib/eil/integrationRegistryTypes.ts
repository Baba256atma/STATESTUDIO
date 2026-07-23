/**
 * EIL-1:2 — Integration Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Registry.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-1:2.
 */

/** Registry status for EIL-1:2. */
export type IntegrationRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type IntegrationRegistryReadiness = "ReadyForModel";

/** Closed registry-category vocabulary. */
export type IntegrationRegistryCategory =
  | "IntegrationType"
  | "PlatformRole"
  | "Contract"
  | "Capability"
  | "Responsibility"
  | "Coordination"
  | "Routing"
  | "Compatibility"
  | "Lifecycle"
  | "Ownership";

/** Closed registry ownership vocabulary. */
export type IntegrationRegistryOwnership =
  | "EIL-1:2"
  | "EIL-1 Integration Registry";

/** Closed registry entry status vocabulary. */
export type IntegrationRegistryEntryStatus = "Registered";

/** Closed registry source vocabulary. */
export type IntegrationRegistrySource =
  | "EIL-1:1"
  | "EIL-1:1/IntegrationFoundation";

/** Closed enforcement classification (metadata only). */
export type IntegrationEnforcementClassification =
  | "Declarative"
  | "Architectural"
  | "Boundary"
  | "Deferred";

/** Closed compatibility classification (metadata only). */
export type IntegrationCompatibilityClassification =
  | "Canonical"
  | "Interoperability"
  | "Coordination"
  | "Routing"
  | "Compatibility";

/** Registry entry ID branded shape. */
export type IntegrationRegistryEntryId = `EIL-1:2/Registry/${string}`;

/** Registry lookup key. */
export type IntegrationRegistryKey = string;

/** Immutable registry reference to a Foundation surface. */
export interface IntegrationRegistryReference {
  readonly foundationId: "EIL-1:1/IntegrationFoundation";
  readonly foundationNamespace: "nexora.eil.integration.foundation";
  readonly entryPoint: "integrationFoundation.ts";
  readonly sourcePath: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable registry metadata envelope. */
export interface IntegrationRegistryMetadata {
  readonly metadataId: "EIL-1:2/IntegrationRegistryMetadata";
  readonly registryId: "EIL-1:2/IntegrationRegistry";
  readonly namespace: "nexora.eil.integration.registry";
  readonly version: "1.0.0";
  readonly status: IntegrationRegistryStatus;
  readonly readiness: IntegrationRegistryReadiness;
  readonly sourcePhase: "EIL-1:2";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Base immutable registry entry. */
export interface IntegrationRegistryEntry {
  readonly id: IntegrationRegistryEntryId;
  readonly key: IntegrationRegistryKey;
  readonly canonicalName: string;
  readonly category: IntegrationRegistryCategory;
  readonly description: string;
  readonly sourcePhase: IntegrationRegistrySource;
  readonly sourceNamespace: "nexora.eil.integration.foundation";
  readonly ownership: IntegrationRegistryOwnership;
  readonly status: IntegrationRegistryEntryStatus;
  readonly lifecycleState: string;
  readonly ordinal: number;
  readonly aliases: readonly string[];
  readonly tags: readonly string[];
  readonly sourceReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Contract-specific registry entry. */
export interface IntegrationContractRegistryEntry extends IntegrationRegistryEntry {
  readonly category: "Contract";
  readonly contractKey: string;
  readonly architecturalPurpose: string;
  readonly compatibilityClassification: IntegrationCompatibilityClassification;
}

/** Capability-specific registry entry. */
export interface IntegrationCapabilityRegistryEntry extends IntegrationRegistryEntry {
  readonly category: "Capability";
  readonly capabilityKey: string;
}

/** Responsibility-specific registry entry. */
export interface IntegrationResponsibilityRegistryEntry
  extends IntegrationRegistryEntry {
  readonly category: "Responsibility";
  readonly responsibilityKey: string;
  readonly architecturalOwner: "EIL";
  readonly enforcementClassification: IntegrationEnforcementClassification;
}

/** Generic typed registry collection. */
export interface IntegrationRegistryCollection<T extends IntegrationRegistryEntry> {
  readonly collectionId: string;
  readonly category: IntegrationRegistryCategory;
  readonly sourcePhase: "EIL-1:2";
  readonly entries: readonly T[];
  readonly entryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic lookup result shape (metadata only). */
export interface IntegrationRegistryLookupResult<T extends IntegrationRegistryEntry> {
  readonly found: boolean;
  readonly key: IntegrationRegistryKey;
  readonly entry: T | null;
  readonly collectionId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Validation summary — declarative inventory checks only. */
export interface IntegrationRegistryValidationSummary {
  readonly validationId: "EIL-1:2/ValidationSummary";
  readonly uniqueIds: true;
  readonly uniqueKeys: true;
  readonly deterministicOrdinals: true;
  readonly foundationOrderPreserved: true;
  readonly countsDerivedFromCollections: true;
  readonly executableEntries: false;
  readonly runtimeBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Canonical registry identity descriptor. */
export interface IntegrationRegistryIdentityDescriptor {
  readonly phaseId: "EIL-1:2";
  readonly canonicalId: "EIL-1:2/IntegrationRegistry";
  readonly name: "Integration Registry";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration.registry";
  readonly layer: "EIL";
  readonly platform: "EIL-1";
  readonly phaseType: "Registry";
  readonly status: IntegrationRegistryStatus;
  readonly readiness: IntegrationRegistryReadiness;
  readonly foundationDependency: "EIL-1:1/IntegrationFoundation";
  readonly foundationEntryPoint: "integrationFoundation.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate registry summary. */
export interface IntegrationRegistrySummaryDescriptor {
  readonly registryId: "EIL-1:2/IntegrationRegistry";
  readonly version: "1.0.0";
  readonly name: "Integration Registry";
  readonly namespace: "nexora.eil.integration.registry";
  readonly status: IntegrationRegistryStatus;
  readonly readiness: IntegrationRegistryReadiness;
  readonly foundationId: "EIL-1:1/IntegrationFoundation";
  readonly typeCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly totalRegistryEntryCount: number;
  readonly nextPhase: "EIL-1:3 — Integration Model";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
