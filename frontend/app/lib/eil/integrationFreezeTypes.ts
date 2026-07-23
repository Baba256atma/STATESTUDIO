/**
 * EIL-1:8 — Integration Freeze Types.
 *
 * Readonly contracts and closed vocabularies for Integration Freeze.
 * Metadata-only. No runtime freeze enforcement.
 *
 * Ownership: owned exclusively by EIL-1:8.
 */

/** Freeze status for EIL-1:8. */
export type IntegrationFreezeStatus = "Frozen";

/** Immediate downstream readiness — Public Index only. */
export type IntegrationFreezeReadiness = "ReadyForPublicIndex";

/** Canonical platform lock key. */
export type IntegrationFreezePlatformLockKey = "EIL-1-INTEGRATION-LOCKED";

/** Closed architectural-lock vocabulary. */
export type IntegrationFreezeArchitecturalLockKey =
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
export type IntegrationFreezeBaselinePhase =
  | "EIL-1:1"
  | "EIL-1:2"
  | "EIL-1:3"
  | "EIL-1:4"
  | "EIL-1:5"
  | "EIL-1:6"
  | "EIL-1:7"
  | "EIL-1:8";

/** Closed compatibility-scope vocabulary. */
export type IntegrationFreezeCompatibilityScope =
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
export type IntegrationFreezeExtensionKey =
  | "ExtensionAfterPublicIndexOnly"
  | "NoMutationOfFrozenMetadata"
  | "AdditiveEvolutionOnly"
  | "BackwardCompatibilityPreservation"
  | "CanonicalIdentityPreservation"
  | "NamespacePreservation"
  | "DependencyPreservation"
  | "InventoryPreservation";

/** Closed ownership vocabulary. */
export type IntegrationFreezeOwnership =
  | "EIL-1:8"
  | "EIL-1 Integration Freeze";

/** Closed release-state vocabulary. */
export type IntegrationFreezeReleaseState = "FrozenBaseline";

/** Canonical freeze identity. */
export interface IntegrationFreezeIdentityDescriptor {
  readonly phaseId: "EIL-1:8";
  readonly canonicalId: "EIL-1:8/IntegrationFreeze";
  readonly name: "Integration Freeze";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration.freeze";
  readonly layer: "EIL";
  readonly platform: "EIL-1";
  readonly phaseType: "Freeze";
  readonly status: IntegrationFreezeStatus;
  readonly readiness: IntegrationFreezeReadiness;
  readonly certificationDependency: "EIL-1:7/IntegrationCertification";
  readonly certificationEntryPoint: "integrationCertification.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze lock declaration. */
export interface IntegrationFreezeLock {
  readonly lockId: `EIL-1:8/Lock/${string}`;
  readonly canonicalKey: string;
  readonly lockName: string;
  readonly namespace: "nexora.eil.integration.freeze";
  readonly version: "1.0.0";
  readonly certificationReference: "EIL-1:7/IntegrationCertification";
  readonly platformReference: "EIL-1:6/IntegrationPlatform";
  readonly releaseState: IntegrationFreezeReleaseState;
  readonly description: string;
  readonly ownership: IntegrationFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly isCanonicalPlatformLock: boolean;
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze baseline declaration. */
export interface IntegrationFreezeBaseline {
  readonly baselineId: `EIL-1:8/Baseline/${IntegrationFreezeBaselinePhase}`;
  readonly sourcePhase: IntegrationFreezeBaselinePhase;
  readonly version: "1.0.0";
  readonly namespace: string;
  readonly readiness: string;
  readonly status: string;
  readonly description: string;
  readonly ownership: IntegrationFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze compatibility declaration. */
export interface IntegrationFreezeCompatibilityDeclaration {
  readonly compatibilityId: `EIL-1:8/Compatibility/${string}`;
  readonly scope: IntegrationFreezeCompatibilityScope;
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
export interface IntegrationFreezeExtension {
  readonly extensionId: `EIL-1:8/Extension/${IntegrationFreezeExtensionKey}`;
  readonly canonicalKey: IntegrationFreezeExtensionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: IntegrationFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze inventory. */
export interface IntegrationFreezeInventory {
  readonly inventoryId: "EIL-1:8/Inventory";
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
export interface IntegrationFreezeCollectionsDescriptor {
  readonly collectionsId: "EIL-1:8/Collections";
  readonly sourcePhase: "EIL-1:8";
  readonly locks: readonly IntegrationFreezeLock[];
  readonly baselines: readonly IntegrationFreezeBaseline[];
  readonly compatibility: readonly IntegrationFreezeCompatibilityDeclaration[];
  readonly extensions: readonly IntegrationFreezeExtension[];
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
export interface IntegrationFreezeSummaryDescriptor {
  readonly freezeId: "EIL-1:8/IntegrationFreeze";
  readonly version: "1.0.0";
  readonly name: "Integration Freeze";
  readonly namespace: "nexora.eil.integration.freeze";
  readonly status: IntegrationFreezeStatus;
  readonly readiness: IntegrationFreezeReadiness;
  readonly certificationId: "EIL-1:7/IntegrationCertification";
  readonly canonicalPlatformLockKey: IntegrationFreezePlatformLockKey;
  readonly lockCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionCount: number;
  readonly totalFreezeEntryCount: number;
  readonly nextPhase: "EIL-1:9 — Integration Public Index";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
