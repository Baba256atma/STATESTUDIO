/**
 * NEA-3:8 — Session & Conversation Freeze Types.
 *
 * Readonly contracts for declarative Session & Conversation freeze.
 * Metadata-only. No runtime freeze logic.
 *
 * Ownership: owned exclusively by NEA-3:8.
 */

/** Freeze status for NEA-3:8. */
export type SessionConversationFreezeStatus = "Freeze";

/** Immediate downstream readiness — Public Index only. */
export type SessionConversationFreezeReadiness = "ReadyForPublicIndex";

/** Freeze lock identifiers. */
export type SessionConversationFreezeLockId =
  | "FoundationLock"
  | "RegistryLock"
  | "ModelLock"
  | "ValidationLock"
  | "ManifestLock"
  | "PlatformLock"
  | "CertificationLock"
  | "SessionIdentityLock"
  | "ConversationIdentityLock"
  | "NamespaceLock"
  | "PublicSurfaceLock"
  | "MetadataLock"
  | "InventoryLock"
  | "OwnershipLock"
  | "DependencyLock"
  | "CompatibilityLock"
  | "ReleaseLock";

/** Declarative lock status. */
export type SessionConversationFreezeLockStatus = "Locked";

/** Compatibility dimension identifiers. */
export type SessionConversationFreezeCompatibilityId =
  | "PlatformCompatibility"
  | "NamespaceCompatibility"
  | "ConsumerCompatibility"
  | "SessionIdentityCompatibility"
  | "ConversationIdentityCompatibility"
  | "PublicApiCompatibility"
  | "InventoryCompatibility"
  | "VersionCompatibility"
  | "DependencyCompatibility"
  | "CertificationCompatibility";

/** Freeze lock declaration. */
export interface SessionConversationFreezeLock {
  readonly lockId: SessionConversationFreezeLockId;
  readonly lockName: string;
  readonly description: string;
  readonly protectedSurface: string;
  readonly status: SessionConversationFreezeLockStatus;
  readonly protectionLevel: "Permanent";
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compatibility declaration. */
export interface SessionConversationFreezeCompatibilityDeclaration {
  readonly compatibilityId: SessionConversationFreezeCompatibilityId;
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
export interface SessionConversationFreezeComponent {
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
export interface SessionConversationFreezeIdentity {
  readonly freezeId: string;
  readonly freezeName: string;
  readonly freezeVersion: string;
  readonly freezeNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:8";
  readonly stage: "Freeze";
  readonly sourcePhase: "NEA-3:8";
  readonly owner: string;
  readonly status: SessionConversationFreezeStatus;
  readonly readiness: SessionConversationFreezeReadiness;
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic freeze summary. */
export interface SessionConversationFreezeSummary {
  readonly freezeId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:8";
  readonly status: SessionConversationFreezeStatus;
  readonly readiness: SessionConversationFreezeReadiness;
  readonly certificationId: string;
  readonly certificationOutcome: "Pass" | "Fail";
  readonly lockCount: number;
  readonly lockedLockCount: number;
  readonly compatibilityCount: number;
  readonly componentCount: number;
  readonly sessionIdentityCount: number;
  readonly conversationIdentityCount: number;
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
