/**
 * EIL-3:8 — Integration Routing Freeze Types.
 *
 * Readonly contracts and closed vocabularies for Integration Routing Freeze.
 * Metadata-only. No runtime freeze enforcement.
 *
 * Ownership: owned exclusively by EIL-3:8.
 */

/** Freeze status for EIL-3:8. */
export type RoutingFreezeStatus = "Frozen";

/** Immediate downstream readiness — Public Index only. */
export type RoutingFreezeReadinessState = "ReadyForPublicIndex";

/** Canonical platform lock key. */
export type RoutingFreezePlatformLockKey = "EIL-3-INTEGRATION-ROUTING-LOCKED";

/** Closed architectural-lock vocabulary. */
export type RoutingFreezeArchitecturalLockKey =
  | "Identity"
  | "Namespace"
  | "Version"
  | "Dependency"
  | "Inventory"
  | "Compatibility"
  | "Platform"
  | "Certification"
  | "Metadata"
  | "PublicSurface"
  | "DeterministicOrdering"
  | "Readiness";

/** Closed lock-scope vocabulary. */
export type RoutingFreezeLockScope =
  | "Canonical"
  | "Identity"
  | "Namespace"
  | "Version"
  | "Dependency"
  | "Inventory"
  | "Compatibility"
  | "Platform"
  | "Certification"
  | "Metadata"
  | "PublicSurface"
  | "DeterministicOrdering"
  | "Readiness";

/** Closed baseline-phase vocabulary. */
export type RoutingFreezeBaselinePhase =
  | "EIL-3:1"
  | "EIL-3:2"
  | "EIL-3:3"
  | "EIL-3:4"
  | "EIL-3:5"
  | "EIL-3:6"
  | "EIL-3:7"
  | "EIL-3:8";

/** Closed compatibility-scope vocabulary. */
export type RoutingFreezeCompatibilityScope =
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
export type RoutingFreezeExtensionKey =
  | "PublicIndexExtensionOnly"
  | "NoFrozenMetadataMutation"
  | "AdditiveEvolutionOnly"
  | "BackwardCompatibilityPreservation"
  | "CanonicalIdentityPreservation"
  | "NamespacePreservation"
  | "DependencyPreservation"
  | "InventoryPreservation";

/** Closed ownership vocabulary. */
export type RoutingFreezeOwnership =
  | "EIL-3:8"
  | "EIL-3 Integration Routing Freeze";

/** Closed release-state vocabulary. */
export type RoutingFreezeReleaseState = "FrozenBaseline";

/** Canonical freeze identity. */
export interface RoutingFreezeIdentity {
  readonly phaseId: "EIL-3:8";
  readonly canonicalId: "EIL-3:8/IntegrationRoutingFreeze";
  readonly name: "Integration Routing Freeze";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-routing.freeze";
  readonly layer: "EIL";
  readonly platform: "EIL-3";
  readonly phaseType: "Freeze";
  readonly status: RoutingFreezeStatus;
  readonly readiness: RoutingFreezeReadinessState;
  readonly certificationDependency: "EIL-3:7/IntegrationRoutingCertification";
  readonly certificationEntryPoint: "integrationRoutingCertification.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze lock declaration. */
export interface RoutingFreezeLock {
  readonly lockId: `EIL-3:8/Lock/${string}`;
  readonly canonicalKey: string;
  readonly lockName: string;
  readonly description: string;
  readonly scope: RoutingFreezeLockScope;
  readonly sourceReference: string;
  readonly namespace: "nexora.eil.integration-routing.freeze";
  readonly version: "1.0.0";
  readonly certificationReference: "EIL-3:7/IntegrationRoutingCertification";
  readonly platformReference: "EIL-3:6/IntegrationRoutingPlatform";
  readonly releaseState: RoutingFreezeReleaseState;
  readonly ownership: RoutingFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly isCanonicalPlatformLock: boolean;
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze baseline declaration. */
export interface RoutingFreezeBaseline {
  readonly baselineId: `EIL-3:8/Baseline/${RoutingFreezeBaselinePhase}`;
  readonly sourcePhase: RoutingFreezeBaselinePhase;
  readonly version: "1.0.0";
  readonly namespace: string;
  readonly readiness: string;
  readonly status: string;
  readonly description: string;
  readonly ownership: RoutingFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze compatibility declaration. */
export interface RoutingFreezeCompatibility {
  readonly compatibilityId: `EIL-3:8/Compatibility/${string}`;
  readonly scope: RoutingFreezeCompatibilityScope;
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
export interface RoutingFreezeExtension {
  readonly extensionId: `EIL-3:8/Extension/${RoutingFreezeExtensionKey}`;
  readonly canonicalKey: RoutingFreezeExtensionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: RoutingFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze inventory. */
export interface RoutingFreezeInventory {
  readonly inventoryId: "EIL-3:8/Inventory";
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
export interface RoutingFreezeCollections {
  readonly collectionsId: "EIL-3:8/Collections";
  readonly sourcePhase: "EIL-3:8";
  readonly locks: readonly RoutingFreezeLock[];
  readonly baselines: readonly RoutingFreezeBaseline[];
  readonly compatibility: readonly RoutingFreezeCompatibility[];
  readonly extensions: readonly RoutingFreezeExtension[];
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
export interface RoutingFreezeSummary {
  readonly freezeId: "EIL-3:8/IntegrationRoutingFreeze";
  readonly version: "1.0.0";
  readonly name: "Integration Routing Freeze";
  readonly namespace: "nexora.eil.integration-routing.freeze";
  readonly status: RoutingFreezeStatus;
  readonly readiness: RoutingFreezeReadinessState;
  readonly certificationId: "EIL-3:7/IntegrationRoutingCertification";
  readonly canonicalPlatformLockKey: RoutingFreezePlatformLockKey;
  readonly lockCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionCount: number;
  readonly totalFreezeEntryCount: number;
  readonly nextPhase: "EIL-3:9 — Integration Routing Public Index";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
