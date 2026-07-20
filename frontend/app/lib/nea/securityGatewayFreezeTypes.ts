/**
 * NEA-4:8 — Security Gateway Freeze Types.
 *
 * Readonly contracts for declarative Security Gateway freeze.
 * Metadata-only. No runtime freeze logic.
 *
 * Ownership: owned exclusively by NEA-4:8.
 */

/** Freeze status for NEA-4:8. */
export type SecurityGatewayFreezeStatus = "Freeze";

/** Immediate downstream readiness — Public Index only. */
export type SecurityGatewayFreezeReadiness = "ReadyForPublicIndex";

/** Freeze lock identifiers — exactly seventeen. */
export type SecurityGatewayFreezeLockId =
  | "FoundationLock"
  | "RegistryLock"
  | "ModelLock"
  | "ValidationLock"
  | "ManifestLock"
  | "PlatformLock"
  | "CertificationLock"
  | "SecurityIdentityLock"
  | "SecurityPolicyLock"
  | "PermissionLock"
  | "NamespaceLock"
  | "PublicSurfaceLock"
  | "MetadataLock"
  | "InventoryLock"
  | "DependencyLock"
  | "CompatibilityLock"
  | "ReleaseLock";

/** Declarative lock status. */
export type SecurityGatewayFreezeLockStatus = "Locked";

/** Compatibility dimension identifiers — exactly ten. */
export type SecurityGatewayFreezeCompatibilityId =
  | "PlatformCompatibility"
  | "NamespaceCompatibility"
  | "ConsumerCompatibility"
  | "SecurityIdentityCompatibility"
  | "SecurityPolicyCompatibility"
  | "PermissionCompatibility"
  | "PublicApiCompatibility"
  | "InventoryCompatibility"
  | "VersionCompatibility"
  | "CertificationCompatibility";

/** Freeze lock declaration. */
export interface SecurityGatewayFreezeLock {
  readonly lockId: SecurityGatewayFreezeLockId;
  readonly lockName: string;
  readonly description: string;
  readonly protectedSurface: string;
  readonly status: SecurityGatewayFreezeLockStatus;
  readonly protectionLevel: "Permanent";
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compatibility declaration. */
export interface SecurityGatewayFreezeCompatibilityDeclaration {
  readonly compatibilityId: SecurityGatewayFreezeCompatibilityId;
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
export interface SecurityGatewayFreezeComponent {
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
export interface SecurityGatewayFreezeIdentity {
  readonly freezeId: string;
  readonly freezeName: string;
  readonly freezeVersion: string;
  readonly freezeNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:8";
  readonly stage: "Freeze";
  readonly sourcePhase: "NEA-4:8";
  readonly owner: string;
  readonly status: SecurityGatewayFreezeStatus;
  readonly readiness: SecurityGatewayFreezeReadiness;
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic freeze summary. */
export interface SecurityGatewayFreezeSummary {
  readonly freezeId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:8";
  readonly status: SecurityGatewayFreezeStatus;
  readonly readiness: SecurityGatewayFreezeReadiness;
  readonly certificationId: string;
  readonly certificationOutcome: "Pass" | "Fail";
  readonly lockCount: number;
  readonly lockedLockCount: number;
  readonly compatibilityCount: number;
  readonly componentCount: number;
  readonly securityIdentityCount: number;
  readonly securityPolicyCount: number;
  readonly permissionCount: number;
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
