/**
 * NEA-6:8 — Message Normalization Freeze Types.
 *
 * Readonly contracts for declarative Message Normalization freeze.
 * Metadata-only. No runtime freeze logic.
 *
 * Ownership: owned exclusively by NEA-6:8.
 */

/** Freeze status for NEA-6:8. */
export type MessageNormalizationFreezeStatus = "Freeze";

/** Immediate downstream readiness — Public Index only. */
export type MessageNormalizationFreezeReadiness = "ReadyForPublicIndex";

/** Freeze lock identifiers — exactly seventeen. */
export type MessageNormalizationFreezeLockId =
  | "FoundationLock"
  | "RegistryLock"
  | "ModelLock"
  | "ValidationLock"
  | "ManifestLock"
  | "PlatformLock"
  | "CertificationLock"
  | "ExecutiveMessageLock"
  | "MessageIdentityRegistryLock"
  | "PayloadRegistryLock"
  | "NamespaceLock"
  | "PublicSurfaceLock"
  | "MetadataLock"
  | "InventoryLock"
  | "OwnershipLock"
  | "DependencyLock"
  | "ReleaseLock";

/** Declarative lock status. */
export type MessageNormalizationFreezeLockStatus = "Locked";

/** Compatibility dimension identifiers — exactly ten. */
export type MessageNormalizationFreezeCompatibilityId =
  | "PlatformCompatibility"
  | "NamespaceCompatibility"
  | "ConsumerCompatibility"
  | "ExecutiveMessageCompatibility"
  | "RegistryCompatibility"
  | "PublicApiCompatibility"
  | "InventoryCompatibility"
  | "VersionCompatibility"
  | "DependencyCompatibility"
  | "CertificationCompatibility";

/** Freeze lock declaration. */
export interface MessageNormalizationFreezeLock {
  readonly lockId: MessageNormalizationFreezeLockId;
  readonly lockName: string;
  readonly description: string;
  readonly protectedSurface: string;
  readonly status: MessageNormalizationFreezeLockStatus;
  readonly protectionLevel: "Permanent";
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compatibility declaration. */
export interface MessageNormalizationFreezeCompatibilityDeclaration {
  readonly compatibilityId: MessageNormalizationFreezeCompatibilityId;
  readonly compatibilityName: string;
  readonly description: string;
  readonly compatible: true;
  readonly certificationReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Frozen certified component reference. */
export interface MessageNormalizationFreezeComponent {
  readonly componentId: string;
  readonly componentName: string;
  readonly phase: string;
  readonly version: string;
  readonly status: string;
  readonly sourceReference: string;
  readonly frozen: true;
  readonly certified: true;
  readonly reconstructsUpstream: false;
  readonly duplicatesArchitecture: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical freeze identity. */
export interface MessageNormalizationFreezeIdentity {
  readonly freezeId: string;
  readonly freezeName: string;
  readonly freezeVersion: string;
  readonly freezeNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:8";
  readonly stage: "Freeze";
  readonly sourcePhase: "NEA-6:8";
  readonly owner: string;
  readonly status: MessageNormalizationFreezeStatus;
  readonly readiness: MessageNormalizationFreezeReadiness;
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic freeze summary. */
export interface MessageNormalizationFreezeSummary {
  readonly freezeId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:8";
  readonly status: MessageNormalizationFreezeStatus;
  readonly readiness: MessageNormalizationFreezeReadiness;
  readonly certificationId: string;
  readonly certificationOutcome: "Pass" | "Fail";
  readonly lockCount: number;
  readonly lockedLockCount: number;
  readonly compatibilityCount: number;
  readonly componentCount: number;
  readonly messageIdentityCount: number;
  readonly payloadCount: number;
  readonly canonicalExecutiveMessageCount: number;
  readonly allowedExtensionCount: number;
  readonly forbiddenExtensionCount: number;
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
