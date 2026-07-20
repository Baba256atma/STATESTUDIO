/**
 * NEA-1:8 — Executive Gateway Freeze Types.
 *
 * Readonly contracts for declarative Executive Gateway freeze.
 * Metadata-only. No runtime freeze logic.
 *
 * Ownership: owned exclusively by NEA-1:8.
 */

/** Freeze status for NEA-1:8. */
export type ExecutiveGatewayFreezeStatus = "Freeze";

/** Immediate downstream readiness — Public Index only. */
export type ExecutiveGatewayFreezeReadiness = "ReadyForPublicIndex";

/** Freeze lock identifiers. */
export type ExecutiveGatewayFreezeLockId =
  | "FoundationLock"
  | "RegistryLock"
  | "ModelLock"
  | "ValidationLock"
  | "ManifestLock"
  | "PlatformLock"
  | "CertificationLock"
  | "NamespaceLock"
  | "PublicSurfaceLock"
  | "MetadataLock"
  | "InventoryLock"
  | "OwnershipLock"
  | "DependencyLock"
  | "CompatibilityLock"
  | "ArchitectureLock"
  | "ReleaseLock";

/** Declarative lock status. */
export type ExecutiveGatewayFreezeLockStatus = "Locked";

/** Compatibility dimension identifiers. */
export type ExecutiveGatewayFreezeCompatibilityId =
  | "PlatformCompatibility"
  | "NamespaceCompatibility"
  | "ConsumerCompatibility"
  | "PublicApiCompatibility"
  | "InventoryCompatibility"
  | "VersionCompatibility"
  | "DependencyCompatibility"
  | "CertificationCompatibility";

/** Freeze lock declaration. */
export interface ExecutiveGatewayFreezeLock {
  readonly lockId: ExecutiveGatewayFreezeLockId;
  readonly lockName: string;
  readonly description: string;
  readonly protectedSurface: string;
  readonly status: ExecutiveGatewayFreezeLockStatus;
  readonly protectionLevel: "Permanent";
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compatibility declaration. */
export interface ExecutiveGatewayFreezeCompatibilityDeclaration {
  readonly compatibilityId: ExecutiveGatewayFreezeCompatibilityId;
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
export interface ExecutiveGatewayFreezeComponent {
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
export interface ExecutiveGatewayFreezeIdentity {
  readonly freezeId: string;
  readonly freezeName: string;
  readonly freezeVersion: string;
  readonly freezeNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:8";
  readonly stage: "Freeze";
  readonly sourcePhase: "NEA-1:8";
  readonly owner: string;
  readonly status: ExecutiveGatewayFreezeStatus;
  readonly readiness: ExecutiveGatewayFreezeReadiness;
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic freeze summary. */
export interface ExecutiveGatewayFreezeSummary {
  readonly freezeId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:8";
  readonly status: ExecutiveGatewayFreezeStatus;
  readonly readiness: ExecutiveGatewayFreezeReadiness;
  readonly certificationId: string;
  readonly certificationOutcome: "Pass" | "Fail";
  readonly lockCount: number;
  readonly lockedLockCount: number;
  readonly compatibilityCount: number;
  readonly componentCount: number;
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
