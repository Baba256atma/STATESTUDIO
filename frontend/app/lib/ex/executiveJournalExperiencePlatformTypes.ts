/** EX-2:6 closed metadata-only Platform types. */

export type ExecutiveJournalExperiencePlatformEligibility = "Eligible" | "Ineligible";
export type ExecutiveJournalExperiencePlatformBindingStatus = "Bound" | "Unbound" | "Rejected";
export type ExecutiveJournalExperiencePlatformExposureStatus = "Exposed" | "NotExposed" | "Prohibited";
export type ExecutiveJournalExperiencePlatformAvailability = "Available" | "Unavailable" | "Degraded" | "NotEvaluated";
export type ExecutiveJournalExperiencePlatformIsolation = "MetadataOnlyIsolated" | "NotIsolated";
export type ExecutiveJournalExperiencePlatformProviderMode = "NoProvider" | "SyntheticProviderReferenceOnly" | "ProductionProviderProhibited";
export type ExecutiveJournalExperiencePlatformAccessClassification = "NoAccess" | "MetadataOnlyAccess" | "ProductionAccessProhibited";
export type ExecutiveJournalExperiencePlatformSourceClassification = "NoSource" | "SyntheticEvidenceReferenceOnly" | "RealRtc2SourceProhibited" | "ProductionSourceProhibited";
export type ExecutiveJournalExperiencePlatformIntegrityStatus = "Intact" | "Compromised" | "NotEvaluated";
export type ExecutiveJournalExperiencePlatformLifecycleState = "Declared" | "ManifestBound" | "PlatformContractsDeclared" | "Sealed" | "ReadyForCertification";
export type ExecutiveJournalExperiencePlatformReasonCode =
  | "ManifestMissing" | "ManifestIneligible" | "ManifestMalformed" | "ManifestCloned"
  | "ManifestStale" | "ManifestIdentityMismatch" | "ManifestReadinessMismatch"
  | "CapabilityCatalogueMismatch" | "NonCapabilityCatalogueMismatch"
  | "PrerequisiteCatalogueMismatch" | "UpstreamReferenceMismatch"
  | "PlatformAuthorizationMissing" | "PlatformContractUnsealed";
export type ExecutiveJournalExperiencePlatformBindingKind =
  | "ManifestBinding" | "ConsumerBinding" | "CapabilityExposure"
  | "NonCapabilityEnforcement" | "PlatformCompatibility"
  | "AccessClassification" | "DataSourceClassification"
  | "ProviderModeClassification" | "IsolationMode"
  | "AvailabilityClassification" | "IntegrityClassification"
  | "FailureClassification" | "CertificationEvidence"
  | "DependencyBoundary" | "GovernanceCarryForward" | "PlatformSummary";

export interface ExecutiveJournalExperiencePlatformInput {
  readonly manifest: unknown;
  readonly manifestIdentity: unknown;
  readonly manifestEligibility: unknown;
  readonly manifestReadiness: unknown;
  readonly manifestCurrent: unknown;
  readonly capabilities: unknown;
  readonly nonCapabilities: unknown;
  readonly platformPrerequisites: unknown;
  readonly upstream: unknown;
  readonly platformAuthorization: unknown;
  readonly contractsSealed: unknown;
}

export interface ExecutiveJournalExperiencePlatformReason {
  readonly reasonId: `EX-2:6/Reason/${ExecutiveJournalExperiencePlatformReasonCode}`;
  readonly code: ExecutiveJournalExperiencePlatformReasonCode;
  readonly order: number;
  readonly detail: string;
  readonly safeStructuralDetailOnly: true;
  readonly echoesInput: false;
  readonly immutable: true;
}

export interface ExecutiveJournalExperiencePlatformEligibilityResult {
  readonly platformId: "EX-2:6/ExecutiveJournalExperiencePlatform";
  readonly eligibility: ExecutiveJournalExperiencePlatformEligibility;
  readonly eligible: boolean;
  readonly reasonCount: number;
  readonly reasons: readonly ExecutiveJournalExperiencePlatformReason[];
  readonly metadataOnly: true;
  readonly createsAuthority: false;
  readonly productionAuthorized: false;
  readonly ex27Authorized: false;
  readonly repairedInput: false;
  readonly mutatedInput: false;
  readonly deterministic: true;
  readonly immutable: true;
}

export interface ExecutiveJournalExperiencePlatformCapabilityBinding {
  readonly bindingId: `EX26-CAP-BIND-${string}`;
  readonly order: number;
  readonly bindingKind: "CapabilityExposure";
  readonly manifestCapability: unknown;
  readonly exposure: "Exposed";
  readonly exactManifestReferenceRequired: true;
  readonly metadataOnly: true;
  readonly runtimeImplementation: false;
  readonly createsAuthority: false;
  readonly productionApplicable: false;
  readonly immutable: true;
}

export interface ExecutiveJournalExperiencePlatformNonCapabilityEnforcement {
  readonly enforcementId: `EX26-NONCAP-ENFORCE-${string}`;
  readonly order: number;
  readonly bindingKind: "NonCapabilityEnforcement";
  readonly manifestNonCapability: unknown;
  readonly exposure: "Prohibited";
  readonly exactManifestReferenceRequired: true;
  readonly metadataOnly: true;
  readonly productionApplicable: false;
  readonly immutable: true;
}

export interface ExecutiveJournalExperiencePlatformConsumerBinding {
  readonly consumerIdentity: string;
  readonly manifestIdentity: "EX-2:5/ExecutiveJournalExperienceManifest";
  readonly allowedCapabilityReferences: readonly unknown[];
  readonly prohibitedCapabilityReferences: readonly unknown[];
  readonly accessClassification: ExecutiveJournalExperiencePlatformAccessClassification;
  readonly sourceClassification: ExecutiveJournalExperiencePlatformSourceClassification;
  readonly isolationRequirement: ExecutiveJournalExperiencePlatformIsolation;
  readonly compatibilityStatus: "Compatible" | "Incompatible";
  readonly authorizationEvidence: "AD-EX2-14";
  readonly certificationRequirement: "SeparateEX27AuthorizationRequired";
}

export interface ExecutiveJournalExperiencePlatformContract {
  readonly contractId: `EX-2:6/Contract/${string}`;
  readonly order: number;
  readonly subject: string;
  readonly metadataOnly: true;
  readonly exactManifestBinding: true;
  readonly repairsInput: false;
  readonly mutatesInput: false;
  readonly closedVocabularies: true;
  readonly deterministicOrdering: true;
  readonly providerExecution: false;
  readonly authorityCreation: false;
  readonly runtimeEffects: false;
  readonly productionAuthorization: false;
  readonly ex27SeparatelyAuthorized: true;
  readonly immutable: true;
}

export interface ExecutiveJournalExperiencePlatformSummary {
  readonly identity: "EX-2:6/ExecutiveJournalExperiencePlatform";
  readonly namespace: "nexora.ex.executive.journal.experience.platform";
  readonly status: "Platform";
  readonly readiness: "ReadyForCertification";
  readonly previousPhase: "EX-2:5 — Executive Journal Experience Manifest";
  readonly nextPhase: "EX-2:7 — Executive Journal Experience Certification";
  readonly eligibility: "Eligible";
  readonly capabilityBindingCount: 16;
  readonly nonCapabilityEnforcementCount: 19;
  readonly readinessConditionCount: 12;
  readonly consumerBindingFieldCount: 10;
  readonly vocabularyCounts: Readonly<Record<string, number>>;
  readonly contractCount: number;
  readonly decisionCount: 6;
  readonly openIssueCount: 13;
  readonly pendingGateCount: 3;
  readonly authorizationDecisionId: "AD-EX2-14";
  readonly metadataOnly: true;
  readonly contractOnly: true;
  readonly sideEffectFree: true;
  readonly providerExecution: false;
  readonly realRtc2Consumption: false;
  readonly ex27Created: false;
  readonly ex27Authorized: false;
  readonly ciLintClassification: "CiStillBlockedByParkedReactCompilerDebt";
}
