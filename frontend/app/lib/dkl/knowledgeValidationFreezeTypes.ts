/**
 * DKL-5:8 — Knowledge Validation Freeze Types.
 *
 * Readonly contracts for the canonical immutable Freeze layer.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-5:8.
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

export interface KnowledgeValidationFreezeIdentityDescriptor {
  readonly freezeId: string;
  readonly freezeName: string;
  readonly freezeVersion: string;
  readonly freezeNamespace: string;
  readonly phase: "DKL-5:8";
  readonly lockIdentifier: "DKL-5-KNOWLEDGE-VALIDATION-LOCKED";
  readonly status: FreezeStatus;
  readonly certificationStatus: FreezeCertificationStatus;
  readonly stabilityStatus: FreezeStability;
  readonly readiness: FreezeReadiness;
  readonly owner: string;
  readonly architectureType: "KnowledgeValidation";
  readonly componentCount: 7;
  readonly sourcePhase: "DKL-5:8";
  readonly metadataOnly: true;
  readonly runtimeBehavior: false;
  readonly numericScoring: false;
  readonly trustCalculation: false;
  readonly cleansing: false;
  readonly remediation: false;
  readonly compatibilityMode: "Frozen";
  readonly extensionMode: "AdditiveOnly";
  readonly publicIndexTarget: "DKL-5:9 — Knowledge Validation Public Index";
}

export interface FreezeComponentEntry {
  readonly componentId: string;
  readonly componentName: string;
  readonly phase: string;
  readonly version: string;
  readonly namespace: string;
  readonly sourcePublicEntryPoint: string;
  readonly status: string;
  readonly readiness: string;
  readonly certificationStatus: "Certified";
  readonly freezeStatus: "Frozen";
  readonly owner: string;
  readonly publicApiCount: 8;
  readonly dependencyOrder: number;
  readonly includedByReference: true;
  readonly ownedByFreeze: false;
  readonly protectedFromReOwnership: true;
  readonly protectedFromBreakingChange: true;
  readonly compatibilityStatus: "Frozen";
  readonly extensionStatus: "AdditiveOnly";
  readonly runtimeBehavior: false;
  readonly scoringBehavior: false;
  readonly trustCalculationBehavior: false;
  readonly cleansingBehavior: false;
  readonly remediationBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface FreezeLockEntry {
  readonly lockId: string;
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
  readonly subject: string;
  readonly target: string;
  readonly status: FreezeCompatibilityStatus;
  readonly description: string;
}

export interface FreezeExtensionLockEntry {
  readonly extensionLockId: string;
  readonly subject: string;
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
  readonly weakeningEvidenceForbidden: true;
  readonly weakeningPartialUsabilityForbidden: true;
  readonly weakeningOwnershipForbidden: true;
  readonly numericScoringForbidden: true;
  readonly trustCalculationForbidden: true;
  readonly cleansingRemediationForbidden: true;
  readonly runtimeValidationForbidden: true;
  readonly aiInferenceForbidden: true;
}

export interface FreezeVerificationCheck {
  readonly checkId: string;
  readonly description: string;
  readonly status: "Pass" | "Fail";
  readonly expected: string;
  readonly observed: string;
}

export interface FreezeSummaryDescriptor {
  readonly freezeId: string;
  readonly version: string;
  readonly namespace: string;
  readonly phase: "DKL-5:8";
  readonly status: FreezeStatus;
  readonly certificationStatus: FreezeCertificationStatus;
  readonly stability: FreezeStability;
  readonly readiness: FreezeReadiness;
  readonly lockIdentifier: "DKL-5-KNOWLEDGE-VALIDATION-LOCKED";
  readonly componentCount: 7;
  readonly lockCount: number;
  readonly verificationCheckCount: number;
  readonly verificationPassCount: number;
  readonly verificationFailCount: number;
  readonly allVerificationChecksPass: boolean;
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
  readonly allVerificationChecksPass: boolean;
  readonly readyForPublicIndex: boolean;
  readonly breakingChangesForbidden: true;
  readonly additiveChangesControlled: true;
  readonly nextPhase: "DKL-5:9 — Knowledge Validation Public Index";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
