/**
 * NEA-7:8 — Intake Orchestration Freeze Types.
 *
 * Readonly contracts for declarative Intake Orchestration freeze.
 * Metadata-only. No runtime freeze logic.
 *
 * Ownership: owned exclusively by NEA-7:8.
 */

/** Freeze status for NEA-7:8. */
export type IntakeOrchestrationFreezeStatus = "Freeze";

/** Immediate downstream readiness — Public Index only. */
export type IntakeOrchestrationFreezeReadiness = "ReadyForPublicIndex";

/** Freeze lock identifiers — exactly seventeen. */
export type IntakeOrchestrationFreezeLockId =
  | "FoundationLock"
  | "RegistryLock"
  | "ModelLock"
  | "ValidationLock"
  | "ManifestLock"
  | "PlatformLock"
  | "CertificationLock"
  | "ExecutiveIntakePackageLock"
  | "IntakeIdentityRegistryLock"
  | "ReferenceRegistryLock"
  | "NamespaceLock"
  | "PublicSurfaceLock"
  | "MetadataLock"
  | "InventoryLock"
  | "OwnershipLock"
  | "DependencyLock"
  | "ReleaseLock";

/** Declarative lock status. */
export type IntakeOrchestrationFreezeLockStatus = "Locked";

/** Compatibility dimension identifiers — exactly ten. */
export type IntakeOrchestrationFreezeCompatibilityId =
  | "PlatformCompatibility"
  | "NamespaceCompatibility"
  | "ConsumerCompatibility"
  | "ExecutiveIntakePackageCompatibility"
  | "RegistryCompatibility"
  | "PublicApiCompatibility"
  | "InventoryCompatibility"
  | "VersionCompatibility"
  | "DependencyCompatibility"
  | "CertificationCompatibility";

/** Freeze lock declaration. */
export interface IntakeOrchestrationFreezeLock {
  readonly lockId: IntakeOrchestrationFreezeLockId;
  readonly lockName: string;
  readonly description: string;
  readonly protectedSurface: string;
  readonly status: IntakeOrchestrationFreezeLockStatus;
  readonly protectionLevel: "Permanent";
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Compatibility declaration. */
export interface IntakeOrchestrationFreezeCompatibilityDeclaration {
  readonly compatibilityId: IntakeOrchestrationFreezeCompatibilityId;
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
export interface IntakeOrchestrationFreezeComponent {
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
export interface IntakeOrchestrationFreezeIdentity {
  readonly freezeId: string;
  readonly freezeName: string;
  readonly freezeVersion: string;
  readonly freezeNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:8";
  readonly stage: "Freeze";
  readonly sourcePhase: "NEA-7:8";
  readonly owner: string;
  readonly status: IntakeOrchestrationFreezeStatus;
  readonly readiness: IntakeOrchestrationFreezeReadiness;
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic freeze summary. */
export interface IntakeOrchestrationFreezeSummary {
  readonly freezeId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:8";
  readonly status: IntakeOrchestrationFreezeStatus;
  readonly readiness: IntakeOrchestrationFreezeReadiness;
  readonly certificationId: string;
  readonly certificationOutcome: "Pass" | "Fail";
  readonly lockCount: number;
  readonly lockedLockCount: number;
  readonly compatibilityCount: number;
  readonly componentCount: number;
  readonly intakeIdentityCount: number;
  readonly referenceTypeCount: number;
  readonly canonicalExecutiveIntakePackageCount: number;
  readonly inventoryEntryCount: number;
  readonly totalArchitectureCount: number;
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
