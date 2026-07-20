/**
 * NEA-8:8 — Executive Gateway Suite Freeze Types.
 *
 * Readonly contracts for declarative Executive Gateway Suite freeze.
 * Metadata-only. No runtime freeze logic.
 *
 * Ownership: owned exclusively by NEA-8:8.
 */

/** Freeze status for NEA-8:8. */
export type ExecutiveGatewaySuiteFreezeStatus = "Freeze";

/** Immediate downstream readiness — Public Index only. */
export type ExecutiveGatewaySuiteFreezeReadiness = "ReadyForPublicIndex";

/** Freeze lock identifiers — exactly eighteen. */
export type ExecutiveGatewaySuiteFreezeLockId =
  | "FoundationLock"
  | "RegistryLock"
  | "ModelLock"
  | "ValidationLock"
  | "ManifestLock"
  | "PlatformLock"
  | "CertificationLock"
  | "SuiteCompositionLock"
  | "ComponentIdentityLock"
  | "NamespaceLock"
  | "PublicSurfaceLock"
  | "MetadataLock"
  | "InventoryLock"
  | "OwnershipLock"
  | "DependencyLock"
  | "CompatibilityLock"
  | "ArchitectureLock"
  | "ReleaseLock";

/** Declarative lock state. */
export type ExecutiveGatewaySuiteFreezeLockState = "Locked";

/** Compatibility dimension identifiers — exactly ten. */
export type ExecutiveGatewaySuiteFreezeCompatibilityId =
  | "PlatformCompatibility"
  | "NamespaceCompatibility"
  | "ConsumerCompatibility"
  | "SuiteCompositionCompatibility"
  | "ComponentIdentityCompatibility"
  | "PublicApiCompatibility"
  | "InventoryCompatibility"
  | "VersionCompatibility"
  | "DependencyCompatibility"
  | "CertificationCompatibility";

/** Freeze lock declaration. */
export interface ExecutiveGatewaySuiteFreezeLock {
  readonly id: ExecutiveGatewaySuiteFreezeLockId;
  readonly name: string;
  readonly description: string;
  readonly state: ExecutiveGatewaySuiteFreezeLockState;
  readonly rationale: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compatibility declaration. */
export interface ExecutiveGatewaySuiteFreezeCompatibilityDeclaration {
  readonly compatibilityId: ExecutiveGatewaySuiteFreezeCompatibilityId;
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
export interface ExecutiveGatewaySuiteFreezeComponent {
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
export interface ExecutiveGatewaySuiteFreezeIdentity {
  readonly freezeId: string;
  readonly freezeName: string;
  readonly freezeVersion: string;
  readonly freezeNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:8";
  readonly stage: "Freeze";
  readonly sourcePhase: "NEA-8:8";
  readonly owner: string;
  readonly status: ExecutiveGatewaySuiteFreezeStatus;
  readonly readiness: ExecutiveGatewaySuiteFreezeReadiness;
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic freeze summary. */
export interface ExecutiveGatewaySuiteFreezeSummary {
  readonly freezeId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:8";
  readonly status: ExecutiveGatewaySuiteFreezeStatus;
  readonly readiness: ExecutiveGatewaySuiteFreezeReadiness;
  readonly certificationId: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly certificationOutcome: "Pass" | "Fail";
  readonly lockCount: number;
  readonly lockedLockCount: number;
  readonly compatibilityCount: number;
  readonly componentCount: number;
  readonly suiteComponentCount: number;
  readonly inventoryEntryCount: number;
  readonly totalArchitectureCount: number;
  readonly publicApiInventoryTotal: number;
  readonly composedPhaseCount: number;
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
