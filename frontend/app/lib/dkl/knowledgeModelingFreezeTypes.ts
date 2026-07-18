/**
 * DKL-4:8 — Knowledge Modeling Freeze Types.
 *
 * Readonly contracts for the canonical immutable Freeze layer.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-4:8.
 */

export type FreezeStatus = "Frozen";
export type FreezeCertificationStatus = "Certified";
export type FreezeStability = "StableAndFrozen";
export type FreezeReadiness = "ReadyForPublicIndex";
export type FreezeLockStatus = "Locked";
export type FreezeProtectionLevel = "Permanent" | "Critical";
export type FreezeCompatibilityStatus =
  | "Compatible"
  | "Frozen"
  | "Protected"
  | "AdditiveOnly"
  | "BreakingChangeForbidden";

export interface KnowledgeModelingFreezeIdentityDescriptor {
  readonly freezeId: string;
  readonly freezeName: string;
  readonly freezeVersion: string;
  readonly freezeNamespace: string;
  readonly phase: "DKL-4:8";
  readonly lockIdentifier: "DKL-4-KNOWLEDGE-MODELING-LOCKED";
  readonly status: FreezeStatus;
  readonly certificationStatus: FreezeCertificationStatus;
  readonly stabilityStatus: FreezeStability;
  readonly readiness: FreezeReadiness;
  readonly owner: string;
  readonly architectureType: "KnowledgeModelingFreeze";
  readonly metadataOnly: true;
  readonly runtimeBehavior: "Forbidden";
  readonly compatibilityMode: "Frozen";
  readonly extensionMode: "AdditiveOnly";
  readonly publicReleaseTarget: "DKL-4:9";
  readonly platformId: "DKL-4";
  readonly sourcePhase: "DKL-4:8";
}

export interface FreezeComponentEntry {
  readonly id: string;
  readonly name: string;
  readonly phase: string;
  readonly version: string;
  readonly namespace: string;
  readonly sourcePublicEntryPoint: string;
  readonly certificationStatus: "Certified";
  readonly freezeStatus: "Frozen";
  readonly ownership: string;
  readonly compatibilityStatus: "Frozen";
  readonly extensionStatus: "AdditiveOnly";
  readonly publicApiCount: 8;
  readonly dependencyOrder: number;
  readonly includedByReference: true;
  readonly protectedFromReOwnership: true;
  readonly protectedFromBreakingChange: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface FreezeLockEntry {
  readonly id: string;
  readonly name: string;
  readonly target: string;
  readonly targetPhase: string;
  readonly lockType: string;
  readonly protectionLevel: FreezeProtectionLevel;
  readonly breakingChangePolicy: "Forbidden";
  readonly additiveChangePolicy: "Controlled";
  readonly ownership: string;
  readonly status: FreezeLockStatus;
  readonly evidence: string;
  readonly unlockPolicy: "Forbidden";
  readonly deterministic: true;
  readonly immutable: true;
}

export interface FreezeCompatibilityEntry {
  readonly compatibilityId: string;
  readonly name: string;
  readonly target: string;
  readonly status: FreezeCompatibilityStatus;
  readonly description: string;
}

export interface FreezeExtensionLockEntry {
  readonly extensionLockId: string;
  readonly name: string;
  readonly protectedSurface: string;
  readonly ownedBy: string;
  readonly allowedChange: "Additive";
  readonly requiresVersioning: true;
  readonly requiresBackwardCompatibility: true;
  readonly requiresRevalidation: true;
  readonly requiresRecertification: true;
  readonly requiresRefreeze: true;
  readonly mutableRegistrationForbidden: true;
  readonly silentReplacementForbidden: true;
  readonly idReuseForbidden: true;
  readonly nameReuseForbidden: true;
  readonly removalForbidden: true;
  readonly reorderForbidden: true;
}

export interface FreezeVerificationCheck {
  readonly checkId: string;
  readonly name: string;
  readonly status: "Pass" | "Fail";
  readonly expected: string;
  readonly observed: string;
}

export interface FreezeSummaryDescriptor {
  readonly freezeId: string;
  readonly version: string;
  readonly namespace: string;
  readonly phase: "DKL-4:8";
  readonly status: FreezeStatus;
  readonly certificationStatus: FreezeCertificationStatus;
  readonly stability: FreezeStability;
  readonly readiness: FreezeReadiness;
  readonly lockIdentifier: "DKL-4-KNOWLEDGE-MODELING-LOCKED";
  readonly componentCount: 7;
  readonly lockCount: number;
  readonly verificationCheckCount: number;
  readonly verificationPassCount: number;
  readonly verificationFailCount: number;
  readonly allVerificationChecksPass: true;
  readonly totalPublicApiCountThroughCertification: 56;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface FreezeStatusDescriptor {
  readonly status: FreezeStatus;
  readonly certificationStatus: FreezeCertificationStatus;
  readonly stability: FreezeStability;
  readonly readiness: FreezeReadiness;
  readonly allVerificationChecksPass: true;
  readonly readyForPublicIndex: true;
  readonly breakingChangesForbidden: true;
  readonly additiveChangesControlled: true;
  readonly nextPhase: "DKL-4:9 — Knowledge Modeling Public Index";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
