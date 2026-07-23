/**
 * EIL-2:8 — Integration Connector Freeze Types.
 *
 * Readonly contracts and closed vocabularies for Integration Connector Freeze.
 * Metadata-only. No runtime freeze enforcement.
 *
 * Ownership: owned exclusively by EIL-2:8.
 */

/** Freeze status for EIL-2:8. */
export type IntegrationConnectorFreezeStatus = "Frozen";

/** Immediate downstream readiness — Public Index only. */
export type IntegrationConnectorFreezeReadiness = "ReadyForPublicIndex";

/** Canonical platform lock key. */
export type IntegrationConnectorFreezePlatformLockKey =
  "EIL-2-INTEGRATION-CONNECTOR-LOCKED";

/** Closed architectural-lock vocabulary. */
export type IntegrationConnectorFreezeArchitecturalLockKey =
  | "IdentityLock"
  | "NamespaceLock"
  | "VersionLock"
  | "DependencyLock"
  | "InventoryLock"
  | "CompatibilityLock"
  | "PlatformLock"
  | "CertificationLock"
  | "MetadataLock"
  | "PublicSurfaceLock"
  | "DeterministicOrderingLock"
  | "ReadinessLock";

/** Closed baseline-phase vocabulary. */
export type IntegrationConnectorFreezeBaselinePhase =
  | "EIL-2:1"
  | "EIL-2:2"
  | "EIL-2:3"
  | "EIL-2:4"
  | "EIL-2:5"
  | "EIL-2:6"
  | "EIL-2:7"
  | "EIL-2:8";

/** Closed compatibility-scope vocabulary. */
export type IntegrationConnectorFreezeCompatibilityScope =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Certification"
  | "Forward"
  | "Namespace"
  | "Version";

/** Closed extension-policy vocabulary. */
export type IntegrationConnectorFreezeExtensionKey =
  | "ExtensionAfterPublicIndexOnly"
  | "NoMutationOfFrozenMetadata"
  | "AdditiveEvolutionOnly"
  | "BackwardCompatibilityPreservation"
  | "CanonicalIdentityPreservation"
  | "NamespacePreservation"
  | "DependencyPreservation"
  | "InventoryPreservation";

/** Closed ownership vocabulary. */
export type IntegrationConnectorFreezeOwnership =
  | "EIL-2:8"
  | "EIL-2 Integration Connector Freeze";

/** Closed release-state vocabulary. */
export type IntegrationConnectorFreezeReleaseState = "FrozenBaseline";

/** Canonical freeze identity. */
export interface IntegrationConnectorFreezeIdentityDescriptor {
  readonly phaseId: "EIL-2:8";
  readonly canonicalId: "EIL-2:8/IntegrationConnectorFreeze";
  readonly name: "Integration Connector Freeze";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-connector.freeze";
  readonly layer: "EIL";
  readonly platform: "EIL-2";
  readonly phaseType: "Freeze";
  readonly status: IntegrationConnectorFreezeStatus;
  readonly readiness: IntegrationConnectorFreezeReadiness;
  readonly certificationDependency: "EIL-2:7/IntegrationConnectorCertification";
  readonly certificationEntryPoint: "integrationConnectorCertification.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze lock declaration. */
export interface IntegrationConnectorFreezeLock {
  readonly lockId: `EIL-2:8/Lock/${string}`;
  readonly canonicalKey: string;
  readonly lockName: string;
  readonly namespace: "nexora.eil.integration-connector.freeze";
  readonly version: "1.0.0";
  readonly certificationReference: "EIL-2:7/IntegrationConnectorCertification";
  readonly platformReference: "EIL-2:6/IntegrationConnectorPlatform";
  readonly releaseState: IntegrationConnectorFreezeReleaseState;
  readonly description: string;
  readonly ownership: IntegrationConnectorFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly isCanonicalPlatformLock: boolean;
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze baseline declaration. */
export interface IntegrationConnectorFreezeBaseline {
  readonly baselineId: `EIL-2:8/Baseline/${IntegrationConnectorFreezeBaselinePhase}`;
  readonly sourcePhase: IntegrationConnectorFreezeBaselinePhase;
  readonly version: "1.0.0";
  readonly namespace: string;
  readonly readiness: string;
  readonly status: string;
  readonly description: string;
  readonly ownership: IntegrationConnectorFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze compatibility declaration. */
export interface IntegrationConnectorFreezeCompatibilityDeclaration {
  readonly compatibilityId: `EIL-2:8/Compatibility/${string}`;
  readonly scope: IntegrationConnectorFreezeCompatibilityScope;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze extension policy declaration. */
export interface IntegrationConnectorFreezeExtension {
  readonly extensionId: `EIL-2:8/Extension/${IntegrationConnectorFreezeExtensionKey}`;
  readonly canonicalKey: IntegrationConnectorFreezeExtensionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: IntegrationConnectorFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze inventory. */
export interface IntegrationConnectorFreezeInventory {
  readonly inventoryId: "EIL-2:8/Inventory";
  readonly lockCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionCount: number;
  readonly canonicalPlatformLockCount: 1;
  readonly totalFreezeEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Freeze collections. */
export interface IntegrationConnectorFreezeCollectionsDescriptor {
  readonly collectionsId: "EIL-2:8/Collections";
  readonly sourcePhase: "EIL-2:8";
  readonly locks: readonly IntegrationConnectorFreezeLock[];
  readonly baselines: readonly IntegrationConnectorFreezeBaseline[];
  readonly compatibility: readonly IntegrationConnectorFreezeCompatibilityDeclaration[];
  readonly extensions: readonly IntegrationConnectorFreezeExtension[];
  readonly lockCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionCount: number;
  readonly totalFreezeEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Freeze summary. */
export interface IntegrationConnectorFreezeSummaryDescriptor {
  readonly freezeId: "EIL-2:8/IntegrationConnectorFreeze";
  readonly version: "1.0.0";
  readonly name: "Integration Connector Freeze";
  readonly namespace: "nexora.eil.integration-connector.freeze";
  readonly status: IntegrationConnectorFreezeStatus;
  readonly readiness: IntegrationConnectorFreezeReadiness;
  readonly certificationId: "EIL-2:7/IntegrationConnectorCertification";
  readonly canonicalPlatformLockKey: IntegrationConnectorFreezePlatformLockKey;
  readonly lockCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionCount: number;
  readonly totalFreezeEntryCount: number;
  readonly nextPhase: "EIL-2:9 — Integration Connector Public Index";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
