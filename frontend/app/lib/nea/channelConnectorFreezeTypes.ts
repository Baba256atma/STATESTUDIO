/**
 * NEA-2:8 — Channel Connectors Freeze Types.
 *
 * Readonly contracts for declarative Channel Connectors freeze.
 * Metadata-only. No runtime freeze logic.
 *
 * Ownership: owned exclusively by NEA-2:8.
 */

/** Freeze status for NEA-2:8. */
export type ChannelConnectorFreezeStatus = "Freeze";

/** Immediate downstream readiness — Public Index only. */
export type ChannelConnectorFreezeReadiness = "ReadyForPublicIndex";

/** Freeze lock identifiers. */
export type ChannelConnectorFreezeLockId =
  | "FoundationLock"
  | "RegistryLock"
  | "ModelLock"
  | "ValidationLock"
  | "ManifestLock"
  | "PlatformLock"
  | "CertificationLock"
  | "ConnectorIdentityLock"
  | "NamespaceLock"
  | "PublicSurfaceLock"
  | "MetadataLock"
  | "InventoryLock"
  | "OwnershipLock"
  | "DependencyLock"
  | "CompatibilityLock"
  | "ReleaseLock";

/** Declarative lock status. */
export type ChannelConnectorFreezeLockStatus = "Locked";

/** Compatibility dimension identifiers. */
export type ChannelConnectorFreezeCompatibilityId =
  | "PlatformCompatibility"
  | "NamespaceCompatibility"
  | "ConsumerCompatibility"
  | "ConnectorIdentityCompatibility"
  | "PublicApiCompatibility"
  | "InventoryCompatibility"
  | "VersionCompatibility"
  | "DependencyCompatibility"
  | "CertificationCompatibility";

/** Freeze lock declaration. */
export interface ChannelConnectorFreezeLock {
  readonly lockId: ChannelConnectorFreezeLockId;
  readonly lockName: string;
  readonly description: string;
  readonly protectedSurface: string;
  readonly status: ChannelConnectorFreezeLockStatus;
  readonly protectionLevel: "Permanent";
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compatibility declaration. */
export interface ChannelConnectorFreezeCompatibilityDeclaration {
  readonly compatibilityId: ChannelConnectorFreezeCompatibilityId;
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
export interface ChannelConnectorFreezeComponent {
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
export interface ChannelConnectorFreezeIdentity {
  readonly freezeId: string;
  readonly freezeName: string;
  readonly freezeVersion: string;
  readonly freezeNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:8";
  readonly stage: "Freeze";
  readonly sourcePhase: "NEA-2:8";
  readonly owner: string;
  readonly status: ChannelConnectorFreezeStatus;
  readonly readiness: ChannelConnectorFreezeReadiness;
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic freeze summary. */
export interface ChannelConnectorFreezeSummary {
  readonly freezeId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:8";
  readonly status: ChannelConnectorFreezeStatus;
  readonly readiness: ChannelConnectorFreezeReadiness;
  readonly certificationId: string;
  readonly certificationOutcome: "Pass" | "Fail";
  readonly lockCount: number;
  readonly lockedLockCount: number;
  readonly compatibilityCount: number;
  readonly componentCount: number;
  readonly connectorIdentityCount: number;
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
