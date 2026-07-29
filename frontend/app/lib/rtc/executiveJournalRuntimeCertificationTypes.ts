/**
 * RTC-2:9 — Executive Journal Runtime Certification Types.
 *
 * Closed certification, gate, exception, and readiness vocabularies.
 * Evidence evaluation only — never deploys, approves, or authorizes.
 *
 * Ownership: owned exclusively by RTC-2:9.
 */

import type { ExecutiveJournalRuntimeAssuranceResultKind } from "./executiveJournalRuntimeAssuranceTypes.ts";

/** Certification status. */
export type ExecutiveJournalRuntimeCertificationStatus = "Certification";

/**
 * Terminal consumer readiness for RTC-2:9 Certification.
 * Preserves ReadyForConsumer; no authorized RTC-2:10 successor exists.
 */
export type ExecutiveJournalRuntimeCertificationReadiness =
  "ReadyForConsumer";

/** Closed certification result vocabulary. */
export type ExecutiveJournalRuntimeCertificationResultKind =
  | "NotReady"
  | "ConditionallyReady"
  | "ReadyForAuthorization";

/** Closed gate-result vocabulary. */
export type ExecutiveJournalRuntimeCertificationGateResultKind =
  | "Pass"
  | "Fail"
  | "Exception"
  | "NotEvaluated";

/** Canonical certification gate IDs. */
export type ExecutiveJournalRuntimeCertificationGateId =
  | "G-01"
  | "G-02"
  | "G-03"
  | "G-04"
  | "G-05"
  | "G-06"
  | "G-07"
  | "G-08"
  | "G-09"
  | "G-10"
  | "G-11"
  | "G-12"
  | "G-13"
  | "G-14"
  | "G-15"
  | "G-16"
  | "G-17"
  | "G-18";

/** Open-issue release classification — never inferred. */
export type ExecutiveJournalRuntimeOpenIssueReleaseEffect =
  | "Unclassified"
  | "ReleaseBlocking"
  | "NonBlocking";

/** Phase identity evidence for the RTC-2 chain. */
export interface ExecutiveJournalRuntimePhaseIdentityEvidence {
  readonly phaseId: string;
  readonly identity: string;
  readonly namespace: string;
  readonly readiness: string;
}

/** Suite test evidence. */
export interface ExecutiveJournalRuntimeTestSuiteEvidence {
  readonly suiteId: string;
  readonly passed: boolean;
  readonly present: boolean;
}

/** Approved exception evidence. */
export interface ExecutiveJournalRuntimeCertificationException {
  readonly exceptionId: string;
  readonly affectedGateId: ExecutiveJournalRuntimeCertificationGateId;
  readonly rationale: string;
  readonly accountableOwner: string;
  readonly approvingAuthorityRef: string;
  readonly approvingActorKind: string;
  readonly compensatingControl: string;
  readonly scope: string;
  readonly expiry: string;
  readonly reviewRequired: true;
  readonly evidenceRef: string;
  readonly approved: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Open-issue register entry. */
export interface ExecutiveJournalRuntimeCertificationOpenIssue {
  readonly issueId: string;
  readonly issue: string;
  readonly accountableOwner: string;
  readonly resolved: false;
  readonly releaseEffect: ExecutiveJournalRuntimeOpenIssueReleaseEffect;
  readonly releaseEffectAuthorityRef: string | null;
}

/** Immutable certification evidence package. */
export interface ExecutiveJournalRuntimeCertificationEvidencePackage {
  readonly packageId: string;
  readonly candidateIdentity: string;
  readonly candidateVersion: string;
  readonly assuranceResultKind: ExecutiveJournalRuntimeAssuranceResultKind | null;
  readonly assuranceResultRef: string | null;
  readonly phaseIdentities: readonly ExecutiveJournalRuntimePhaseIdentityEvidence[];
  readonly testSuites: readonly ExecutiveJournalRuntimeTestSuiteEvidence[];
  readonly typescriptPassed: boolean | null;
  readonly eslintZeroWarnings: boolean | null;
  readonly dependencyBoundaryOk: boolean | null;
  readonly determinismOk: boolean | null;
  readonly immutabilityOk: boolean | null;
  readonly appendOnlyOk: boolean | null;
  readonly authorityBoundaryOk: boolean | null;
  readonly aiBoundaryOk: boolean | null;
  readonly privateReflectionIsolationOk: boolean | null;
  readonly disclosureFailClosedOk: boolean | null;
  readonly telemetryPayloadExcludedOk: boolean | null;
  readonly idempotencyOk: boolean | null;
  readonly sequenceContinuityOk: boolean | null;
  readonly atomicityOk: boolean | null;
  readonly integrityEvidenceOk: boolean | null;
  readonly replayRecoveryOk: boolean | null;
  readonly replayRecoveryRequired: boolean;
  readonly openIssues: readonly ExecutiveJournalRuntimeCertificationOpenIssue[];
  readonly exceptions: readonly ExecutiveJournalRuntimeCertificationException[];
  readonly accountableOwnerRefs: readonly string[];
  readonly evidencePackageDigest: string;
  readonly claimsDeploymentAuthorization: boolean;
  readonly claimsLegalApproval: boolean;
  readonly claimsPrivacyApproval: boolean;
  readonly claimsRecordsPolicyApproval: boolean;
  readonly claimsAiApproval: boolean;
  readonly evaluationTime: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly containsPayload: false;
}

/** Ordered gate evaluation result. */
export interface ExecutiveJournalRuntimeCertificationGateResult {
  readonly gateId: ExecutiveJournalRuntimeCertificationGateId;
  readonly gateName: string;
  readonly order: number;
  readonly result: ExecutiveJournalRuntimeCertificationGateResultKind;
  readonly waivable: boolean;
  readonly reasonCode: string;
  readonly message: string;
  readonly exceptionId: string | null;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable readiness manifest. */
export interface ExecutiveJournalRuntimeCertificationManifest {
  readonly certificationId: "RTC-2:9/ExecutiveJournalRuntimeCertification";
  readonly certificationVersion: "1.0.0";
  readonly candidateIdentity: string;
  readonly candidateVersion: string;
  readonly upstreamIdentityChain: readonly string[];
  readonly result: ExecutiveJournalRuntimeCertificationResultKind;
  readonly gateResults: readonly ExecutiveJournalRuntimeCertificationGateResult[];
  readonly failedGateIds: readonly ExecutiveJournalRuntimeCertificationGateId[];
  readonly exceptionBoundGateIds: readonly ExecutiveJournalRuntimeCertificationGateId[];
  readonly openIssueIds: readonly string[];
  readonly requiresHumanAuthorization: true;
  readonly prohibitedAutomatedActions: readonly string[];
  readonly evidencePackageDigest: string;
  readonly summary: string;
  readonly isDeploymentAuthorization: false;
  readonly isLegalApproval: false;
  readonly isPrivacyApproval: false;
  readonly isRecordsPolicyApproval: false;
  readonly canBeApprovedByAi: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Discriminated certification assessment result. */
export type ExecutiveJournalRuntimeCertificationResult =
  | {
      readonly kind: "NotReady";
      readonly reasonCode: string;
      readonly reason: string;
      readonly packageId: string;
      readonly gateResults: readonly ExecutiveJournalRuntimeCertificationGateResult[];
      readonly manifest: ExecutiveJournalRuntimeCertificationManifest;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly authorizesDeployment: false;
    }
  | {
      readonly kind: "ConditionallyReady";
      readonly reasonCode: string;
      readonly reason: string;
      readonly packageId: string;
      readonly gateResults: readonly ExecutiveJournalRuntimeCertificationGateResult[];
      readonly manifest: ExecutiveJournalRuntimeCertificationManifest;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly authorizesDeployment: false;
    }
  | {
      readonly kind: "ReadyForAuthorization";
      readonly reasonCode: string;
      readonly reason: string;
      readonly packageId: string;
      readonly gateResults: readonly ExecutiveJournalRuntimeCertificationGateResult[];
      readonly manifest: ExecutiveJournalRuntimeCertificationManifest;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly authorizesDeployment: false;
      readonly requiresHumanAuthorization: true;
    };

/**
 * Closed human-authorization result vocabulary for RTC-2.
 *
 * AuthorizedForMetadataConsumption means RTC-2:1 through RTC-2:9 are
 * authorized for metadata-only consumption within their certified contract
 * boundaries. It does not permit integration implementation, public-index
 * publication, UI or APP-8 use, network or persistence behavior, production
 * activation, deployment, or creation of RTC-2:10.
 */
export type ExecutiveJournalRuntimeAuthorizationResult =
  | "AuthorizationMissing"
  | "AuthorizationRejected"
  | "AuthorizationConditional"
  | "AuthorizedForMetadataConsumption";

/** Immutable human authorization record for RTC-2:1 through RTC-2:9. */
export interface ExecutiveJournalRuntimeHumanAuthorization {
  readonly authorizationId: "RTC2-AUTH-2026-07-25-01";
  readonly authorizingHuman: "Bahadoor";
  readonly authorityBasis: "Project Owner and final architecture decision-maker";
  readonly effectiveDate: "2026-07-25";
  readonly subject: "NPA-T — RTC-2:1 through RTC-2:9 — Executive Journal Runtime";
  readonly decision: "Approved";
  readonly result: "AuthorizedForMetadataConsumption";
  readonly allowsMetadataConsumption: true;
  readonly allowsUiIntegration: false;
  readonly allowsApp8Integration: false;
  readonly allowsNetworkIntegration: false;
  readonly allowsPersistenceIntegration: false;
  readonly allowsPublicIndexPublication: false;
  readonly allowsProductionActivation: false;
  readonly scope: readonly string[];
  readonly prohibited: readonly string[];
  readonly conditions: string;
  readonly residualRiskAcknowledgement: string;
  readonly fullProjectTypeScriptDisclosure: string;
  readonly certificationEvidenceReference: string;
  readonly architectureDecisionsAccepted: readonly ["AD-RTC2-07", "AD-RTC2-10"];
  readonly openIssuesRemainUnresolved: readonly [
    "OI-01",
    "OI-02",
    "OI-03",
    "OI-04",
    "OI-05",
    "OI-06",
  ];
  readonly reviewRequirement: string;
  readonly automaticExpiry: false;
  readonly deploymentAuthorized: false;
  readonly createsRtc210: false;
  readonly modifiesRtc19: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly evidenceRef: "RTC2-AUTH-2026-07-25-01";
}

/** Accepted architecture decision AD-RTC2-10 (Option A). */
export interface ExecutiveJournalRuntimeAdrtc210Decision {
  readonly decisionId: "AD-RTC2-10";
  readonly title: "Terminate RTC-2 sequence at certified consumer-ready metadata";
  readonly status: "Accepted";
  readonly selectedOption: "A";
  readonly decision: string;
  readonly alternativesConsidered: readonly ["A", "B", "C", "D"];
  readonly consequences: readonly string[];
  readonly explicitExclusions: readonly string[];
  readonly authorizationId: "RTC2-AUTH-2026-07-25-01";
  readonly preservesAdrtc207: true;
  readonly createsRtc210: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveJournalRuntimeCertificationIdentityDescriptor {
  readonly id: "RTC-2:9/ExecutiveJournalRuntimeCertification";
  readonly name: "Executive Journal Runtime Certification & Release Readiness";
  readonly phaseId: "RTC-2:9";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.journal.certification";
  readonly status: ExecutiveJournalRuntimeCertificationStatus;
  readonly readiness: ExecutiveJournalRuntimeCertificationReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Journal Runtime";
  readonly sourceAssurance: "RTC-2:8/ExecutiveJournalRuntimeReconciliationAssurance";
  readonly upstream: "RTC-2:8 — Executive Journal Runtime Reconciliation & Assurance";
  readonly nextPhaseDecisionRequired: true;
  readonly sequenceTerminatedAtRtc29: true;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveJournalRuntimeCertificationSummary {
  readonly certificationId: "RTC-2:9/ExecutiveJournalRuntimeCertification";
  readonly version: "1.0.0";
  readonly name: "Executive Journal Runtime Certification & Release Readiness";
  readonly namespace: "nexora.rtc.executive.journal.certification";
  readonly status: ExecutiveJournalRuntimeCertificationStatus;
  readonly readiness: ExecutiveJournalRuntimeCertificationReadiness;
  readonly gateCount: number;
  readonly nonWaivableGateCount: number;
  readonly openIssueCount: number;
  readonly sourceAssurance: "RTC-2:8/ExecutiveJournalRuntimeReconciliationAssurance";
  readonly nextPhaseDecisionRequired: true;
  readonly sequenceTerminatedAtRtc29: true;
  readonly authorizationId: "RTC2-AUTH-2026-07-25-01";
  readonly authorizationResult: "AuthorizedForMetadataConsumption";
  readonly architectureDecisionIds: readonly ["AD-RTC2-10"];
  readonly deploymentAuthorized: false;
  readonly createsRtc210: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
