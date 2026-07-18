/**
 * DKL-3:8 — Data Understanding Freeze Types.
 *
 * Readonly contracts for the canonical immutable Freeze layer.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-3:8.
 */

export type FreezeStatus = "Frozen";
export type FreezeStability = "Stable";
export type FreezeReadiness = "ReadyForPublicIndex";
export type FreezeLockStatus = "Locked";
export type FreezeProtectionLevel = "Permanent";

export interface DataUnderstandingFreezeIdentityDescriptor {
  readonly freezeId: string;
  readonly freezeVersion: string;
  readonly freezeName: string;
  readonly freezeNamespace: string;
  readonly platformId: "DKL-3";
  readonly platformVersion: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-3:8";
  readonly certificationStatus: "Certified";
  readonly freezeStatus: FreezeStatus;
  readonly stability: FreezeStability;
  readonly readiness: FreezeReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface FreezeComponentEntry {
  readonly componentId: string;
  readonly componentName: string;
  readonly sourcePhase: string;
  readonly kind: string;
  readonly publicApiCount: 8;
  readonly frozen: true;
}

export interface FreezeLock {
  readonly lockId: string;
  readonly lockName: string;
  readonly description: string;
  readonly protectedSurface: string;
  readonly sourcePhase: string;
  readonly protectionLevel: FreezeProtectionLevel;
  readonly status: FreezeLockStatus;
  readonly readinessImpact: string;
}

export interface FreezeCompatibilityEntry {
  readonly compatibilityId: string;
  readonly name: string;
  readonly status: "Compatible" | "ForwardCompatible" | "Restricted" | "Forbidden" | "Locked";
  readonly description: string;
}

export interface FreezeCounts {
  readonly frozenPhaseCount: 7;
  readonly frozenPublicApiCount: 56;
  readonly lockCount: number;
  readonly lockedLockCount: number;
  readonly compatibilityCount: number;
  readonly componentCount: number;
  readonly dependencyCount: number;
  readonly publicApiCount: 8;
}

export interface FreezeReadinessDescriptor {
  readonly FoundationFrozen: true;
  readonly RegistryFrozen: true;
  readonly ModelFrozen: true;
  readonly ValidationFrozen: true;
  readonly ManifestFrozen: true;
  readonly PlatformFrozen: true;
  readonly CertificationFrozen: true;
  readonly DependenciesFrozen: true;
  readonly CompatibilityFrozen: true;
  readonly OwnershipFrozen: true;
  readonly BoundariesFrozen: true;
  readonly PublicApisFrozen: true;
  readonly ExtensionsFrozen: true;
  readonly VersionFrozen: true;
  readonly ReleaseFrozen: true;
  readonly ReadyForPublicIndex: true;
  readonly Frozen: true;
  readonly Stable: true;
  readonly MetadataOnly: true;
  readonly FreezeOnly: true;
  readonly UnderstandingForbidden: true;
  readonly ValidationExecutionForbidden: true;
  readonly CertificationExecutionForbidden: true;
  readonly BusinessObjectCreationForbidden: true;
  readonly KnowledgeGraphForbidden: true;
  readonly PersistenceForbidden: true;
  readonly AIFree: true;
  readonly EngineFree: true;
}
