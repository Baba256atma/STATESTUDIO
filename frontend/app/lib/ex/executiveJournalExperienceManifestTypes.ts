/**
 * EX-2:5 — Executive Journal Experience Manifest closed types.
 *
 * Metadata declarations only. These contracts create no runtime, platform,
 * authority, provider, UI, route, production, or deployment behavior.
 */

export type ExecutiveJournalExperienceManifestStatus = "Manifest";
export type ExecutiveJournalExperienceManifestReadiness = "ReadyForPlatform";
export type ExecutiveJournalExperienceManifestEligibility =
  | "Eligible"
  | "Ineligible";
export type ExecutiveJournalExperienceManifestCapabilitySupport =
  | "Declared"
  | "NotDeclared"
  | "Prohibited";
export type ExecutiveJournalExperienceManifestCompatibility =
  | "Compatible"
  | "Incompatible"
  | "NotEvaluated";
export type ExecutiveJournalExperienceManifestRequirementStatus =
  | "Satisfied"
  | "Unsatisfied"
  | "Pending";
export type ExecutiveJournalExperienceManifestEntryKind =
  | "Identity"
  | "Capability"
  | "Compatibility"
  | "Requirement"
  | "NonCapability"
  | "DependencyBoundary"
  | "EvidenceReference"
  | "OpenIssue"
  | "PendingGate"
  | "PlatformPrerequisite"
  | "Summary";
export type ExecutiveJournalExperienceManifestReasonCode =
  | "ValidationEvidenceMissing"
  | "ValidationEvidenceInvalid"
  | "ValidationEvidenceMalformed"
  | "ValidationEvidenceCloned"
  | "ValidationEvidenceStale"
  | "ValidationEvidenceMismatched"
  | "ValidationEvidenceUnknown"
  | "UnsupportedCapability"
  | "ProhibitedCapability"
  | "DependencyBoundaryViolation"
  | "ManifestEntryUnsealed"
  | "PlatformAuthorizationMissing";
export type ExecutiveJournalExperienceManifestLifecycleState =
  | "Declared"
  | "ValidationBound"
  | "CapabilitiesDeclared"
  | "Sealed"
  | "ReadyForPlatform";

export interface ExecutiveJournalExperienceManifestValidationBinding {
  readonly validation: unknown;
  readonly validationIdentity: unknown;
  readonly validationAggregateDescriptor: unknown;
  readonly validationResult: unknown;
  readonly validatedModel: unknown;
  readonly evidenceCurrent: unknown;
  readonly evidenceComplete: unknown;
  readonly evidenceCanonical: unknown;
  readonly evidenceKnown: unknown;
  readonly evidenceImpliesProductionAuthority: unknown;
}

export interface ExecutiveJournalExperienceManifestInput
  extends ExecutiveJournalExperienceManifestValidationBinding {
  readonly capabilities: unknown;
  readonly nonCapabilities: unknown;
  readonly platformPrerequisites: unknown;
  readonly lifecycle: unknown;
  readonly dependencyBoundaryIntact: unknown;
  readonly entriesSealed: unknown;
  readonly separatePlatformAuthorizationRequired: unknown;
  readonly prohibitedDeclarationConflict: unknown;
  readonly unsupportedCapabilityDeclared: unknown;
  readonly ex26Authorized: unknown;
}

export interface ExecutiveJournalExperienceManifestCapabilityEntry {
  readonly capabilityId: `EX25-CAP-${string}`;
  readonly order: number;
  readonly capability: string;
  readonly entryKind: "Capability";
  readonly support: "Declared";
  readonly supportingReference: unknown;
  readonly supportingReferenceIdentity: string;
  readonly metadataOnly: true;
  readonly runtimeBehavior: false;
  readonly createsAuthority: false;
  readonly productionApplicable: false;
  readonly immutable: true;
}

export interface ExecutiveJournalExperienceManifestNonCapabilityEntry {
  readonly nonCapabilityId: `EX25-NONCAP-${string}`;
  readonly order: number;
  readonly nonCapability: string;
  readonly entryKind: "NonCapability";
  readonly support: "Prohibited";
  readonly supportingReference: unknown;
  readonly metadataOnly: true;
  readonly runtimeBehavior: false;
  readonly createsAuthority: false;
  readonly productionApplicable: false;
  readonly immutable: true;
}

export interface ExecutiveJournalExperienceManifestPlatformPrerequisite {
  readonly prerequisiteId: `EX25-PREREQ-${string}`;
  readonly order: number;
  readonly prerequisite: string;
  readonly entryKind: "PlatformPrerequisite";
  readonly status: ExecutiveJournalExperienceManifestRequirementStatus;
  readonly supportingReference: unknown;
  readonly productionApplicable: boolean;
  readonly authorizesPlatformImplementation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveJournalExperienceManifestReason {
  readonly reasonId: `EX-2:5/Reason/${ExecutiveJournalExperienceManifestReasonCode}`;
  readonly code: ExecutiveJournalExperienceManifestReasonCode;
  readonly order: number;
  readonly detail: string;
  readonly safeStructuralDetailOnly: true;
  readonly echoesInput: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

interface ExecutiveJournalExperienceManifestEligibilityResultBase {
  readonly manifestId: "EX-2:5/ExecutiveJournalExperienceManifest";
  readonly eligibility: ExecutiveJournalExperienceManifestEligibility;
  readonly eligible: boolean;
  readonly reasonCount: number;
  readonly reasons: readonly ExecutiveJournalExperienceManifestReason[];
  readonly validationResultRequired: "Valid";
  readonly createsAuthority: false;
  readonly implementsCapabilities: false;
  readonly productionAuthorized: false;
  readonly platformAuthorized: false;
  readonly ex26Authorized: false;
  readonly repairedInput: false;
  readonly mutatedInput: false;
  readonly metadataOnly: true;
  readonly sideEffectFree: true;
  readonly deterministic: true;
  readonly immutable: true;
}

export interface ExecutiveJournalExperienceManifestEligibleResult
  extends ExecutiveJournalExperienceManifestEligibilityResultBase {
  readonly eligibility: "Eligible";
  readonly eligible: true;
  readonly reasonCount: 0;
  readonly reasons: readonly [];
}

export interface ExecutiveJournalExperienceManifestIneligibleResult
  extends ExecutiveJournalExperienceManifestEligibilityResultBase {
  readonly eligibility: "Ineligible";
  readonly eligible: false;
}

export type ExecutiveJournalExperienceManifestEligibilityResult =
  | ExecutiveJournalExperienceManifestEligibleResult
  | ExecutiveJournalExperienceManifestIneligibleResult;

export interface ExecutiveJournalExperienceManifestContract {
  readonly contractId: `EX-2:5/Contract/${string}`;
  readonly order: number;
  readonly subject: string;
  readonly metadataOnly: true;
  readonly exactValidationBinding: true;
  readonly repairsInput: false;
  readonly mutatesInput: false;
  readonly closedVocabularies: true;
  readonly deterministicOrdering: true;
  readonly safeDetailsOnly: true;
  readonly authorityCreation: false;
  readonly runtimeEffects: false;
  readonly productionAuthorization: false;
  readonly ex26SeparatelyAuthorized: true;
  readonly immutable: true;
}

export interface ExecutiveJournalExperienceManifestSummary {
  readonly identity: "EX-2:5/ExecutiveJournalExperienceManifest";
  readonly namespace: "nexora.ex.executive.journal.experience.manifest";
  readonly status: "Manifest";
  readonly readiness: "ReadyForPlatform";
  readonly previousPhase: "EX-2:4 — Executive Journal Experience Validation";
  readonly nextPhase: "EX-2:6 — Executive Journal Experience Platform";
  readonly eligibility: "Eligible";
  readonly capabilityCount: 16;
  readonly nonCapabilityCount: 19;
  readonly platformPrerequisiteCount: 9;
  readonly eligibilityValueCount: 2;
  readonly capabilitySupportValueCount: 3;
  readonly compatibilityValueCount: 3;
  readonly requirementStatusValueCount: 3;
  readonly entryKindCount: 11;
  readonly reasonCodeCount: 12;
  readonly lifecycleStateCount: 5;
  readonly contractCount: 8;
  readonly decisionCount: 6;
  readonly openIssueCount: 13;
  readonly pendingGateCount: 3;
  readonly authorizationDecisionId: "AD-EX2-13";
  readonly upstreamChain: readonly [
    "EX-2:5/ExecutiveJournalExperienceManifest",
    "EX-2:4/ExecutiveJournalExperienceValidation",
    "EX-2:3/ExecutiveJournalExperienceModel",
    "EX-2:2/ExecutiveJournalExperienceRegistry",
    "EX-2:1/ExecutiveJournalExperienceFoundation",
  ];
  readonly metadataOnly: true;
  readonly sideEffectFree: true;
  readonly deterministic: true;
  readonly failClosed: true;
  readonly createsAuthority: false;
  readonly implementsCapabilities: false;
  readonly ex26Created: false;
  readonly ex26Authorized: false;
  readonly ciLintClassification: "CiStillBlockedByParkedReactCompilerDebt";
}
