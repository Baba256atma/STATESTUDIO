/**
 * NEA-5:8 — Gateway Routing Freeze Types.
 *
 * Readonly contracts for declarative Gateway Routing freeze.
 * Metadata-only. No runtime freeze logic.
 *
 * Ownership: owned exclusively by NEA-5:8.
 */

/** Freeze status for NEA-5:8. */
export type GatewayRoutingFreezeStatus = "Freeze";

/** Immediate downstream readiness — Public Index only. */
export type GatewayRoutingFreezeReadiness = "ReadyForPublicIndex";

/** Freeze lock identifiers — exactly seventeen. */
export type GatewayRoutingFreezeLockId =
  | "FoundationLock"
  | "RegistryLock"
  | "ModelLock"
  | "ValidationLock"
  | "ManifestLock"
  | "PlatformLock"
  | "CertificationLock"
  | "RouteIdentityLock"
  | "RouteDefinitionLock"
  | "NamespaceLock"
  | "PublicSurfaceLock"
  | "MetadataLock"
  | "InventoryLock"
  | "OwnershipLock"
  | "DependencyLock"
  | "CompatibilityLock"
  | "ReleaseLock";

/** Declarative lock status. */
export type GatewayRoutingFreezeLockStatus = "Locked";

/** Compatibility dimension identifiers — exactly ten. */
export type GatewayRoutingFreezeCompatibilityId =
  | "PlatformCompatibility"
  | "NamespaceCompatibility"
  | "ConsumerCompatibility"
  | "RouteIdentityCompatibility"
  | "RouteDefinitionCompatibility"
  | "PublicApiCompatibility"
  | "InventoryCompatibility"
  | "VersionCompatibility"
  | "DependencyCompatibility"
  | "CertificationCompatibility";

/** Freeze lock declaration. */
export interface GatewayRoutingFreezeLock {
  readonly lockId: GatewayRoutingFreezeLockId;
  readonly lockName: string;
  readonly description: string;
  readonly protectedSurface: string;
  readonly status: GatewayRoutingFreezeLockStatus;
  readonly protectionLevel: "Permanent";
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compatibility declaration. */
export interface GatewayRoutingFreezeCompatibilityDeclaration {
  readonly compatibilityId: GatewayRoutingFreezeCompatibilityId;
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
export interface GatewayRoutingFreezeComponent {
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
export interface GatewayRoutingFreezeIdentity {
  readonly freezeId: string;
  readonly freezeName: string;
  readonly freezeVersion: string;
  readonly freezeNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:8";
  readonly stage: "Freeze";
  readonly sourcePhase: "NEA-5:8";
  readonly owner: string;
  readonly status: GatewayRoutingFreezeStatus;
  readonly readiness: GatewayRoutingFreezeReadiness;
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic freeze summary. */
export interface GatewayRoutingFreezeSummary {
  readonly freezeId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:8";
  readonly status: GatewayRoutingFreezeStatus;
  readonly readiness: GatewayRoutingFreezeReadiness;
  readonly certificationId: string;
  readonly certificationOutcome: "Pass" | "Fail";
  readonly lockCount: number;
  readonly lockedLockCount: number;
  readonly compatibilityCount: number;
  readonly componentCount: number;
  readonly routeIdentityCount: number;
  readonly domainModelCount: number;
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
