/**
 * RTC-2:8 — Executive Journal Runtime Reconciliation & Assurance Types.
 *
 * Closed assurance vocabularies and result unions.
 * Evidence evaluation only — no repair, replay, or side effects.
 *
 * Ownership: owned exclusively by RTC-2:8.
 */

import type {
  ExecutiveJournalRuntimeExecutionIntent,
  ExecutiveJournalRuntimeExecutionReceipt,
} from "./executiveJournalRuntimeExecutionTypes.ts";

/** Assurance status. */
export type ExecutiveJournalRuntimeAssuranceStatus = "Assurance";

/**
 * Immediate next-phase readiness for RTC-2:8 Assurance.
 * Advances to RTC-2:9 Certification (not RTC-1:8 Freeze / ReadyForPublicIndex).
 */
export type ExecutiveJournalRuntimeAssuranceReadiness =
  "ReadyForCertification";

/** Closed assurance result vocabulary. */
export type ExecutiveJournalRuntimeAssuranceResultKind =
  | "Reconciled"
  | "Divergent"
  | "Indeterminate"
  | "Invalid";

/** Finding severity for assurance findings. */
export type ExecutiveJournalRuntimeAssuranceSeverity =
  | "Critical"
  | "Error"
  | "Warning";

/** Closed assurance subject vocabulary. */
export type ExecutiveJournalRuntimeAssuranceSubjectKind =
  | "ExecutionIntent"
  | "ExecutionReceipt"
  | "EventBatch"
  | "AcceptedEvent"
  | "JournalSequence"
  | "IdempotencyRecord"
  | "IntegrityEvidence"
  | "PolicyEvidence"
  | "EnforcementEvidence"
  | "AuthorityEvidence"
  | "ConfirmationEvidence"
  | "DisclosureEvidence"
  | "ExportEvidence"
  | "RetentionEvidence"
  | "DispositionEvidence"
  | "ProjectionCheckpoint"
  | "ReplayEvidence"
  | "RecoveryEvidence"
  | "TelemetryEvidence";

/** Immutable assurance finding. */
export interface ExecutiveJournalRuntimeAssuranceFinding {
  readonly ruleId: string;
  readonly findingCode: string;
  readonly severity: ExecutiveJournalRuntimeAssuranceSeverity;
  readonly subjectKind: ExecutiveJournalRuntimeAssuranceSubjectKind;
  readonly subjectPath: string;
  readonly expected: string;
  readonly observed: string;
  readonly upstreamContractRef: string;
  readonly message: string;
  readonly recommendedResponseCode: string;
  readonly orderingKey: string;
  readonly resultHint: ExecutiveJournalRuntimeAssuranceResultKind;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly containsPayload: false;
}

/** Projection checkpoint evidence (metadata only). */
export interface ExecutiveJournalRuntimeProjectionEvidence {
  readonly projectorId: string;
  readonly projectorVersion: string;
  readonly sourceJournalId: string;
  readonly sourceSequencePosition: number;
  readonly producingEventRefs: readonly string[];
  readonly checkpointId: string;
  readonly reconciliationDigest: string;
  readonly hasProvenance: boolean;
}

/** Replay / recovery evidence (metadata only). */
export interface ExecutiveJournalRuntimeReplayRecoveryEvidence {
  readonly restoredRange: string;
  readonly sequenceContinuityOk: boolean;
  readonly acceptedEventCount: number;
  readonly integrityVerificationResult: string;
  readonly projectorId: string;
  readonly projectorVersion: string;
  readonly projectionReconciliationOk: boolean;
  readonly accessControlProbeOk: boolean;
  readonly provenanceProbeOk: boolean;
  readonly residualRiskRefs: readonly string[];
}

/** Immutable assurance evidence bundle — no journal payloads. */
export interface ExecutiveJournalRuntimeAssuranceEvidenceBundle {
  readonly bundleId: string;
  readonly intent: ExecutiveJournalRuntimeExecutionIntent | null;
  readonly receipt: ExecutiveJournalRuntimeExecutionReceipt | null;
  readonly enforcementPlanId: string | null;
  readonly policyDecisionCode: string | null;
  readonly validationOutcome: "Valid" | "Invalid" | "Missing" | null;
  readonly requestId: string | null;
  readonly idempotencyKey: string | null;
  readonly commandDigest: string | null;
  readonly targetJournalId: string | null;
  readonly expectedJournalSequence: number | null;
  readonly reportedSequenceRange: string | null;
  readonly eventBatchDigest: string | null;
  readonly proposedEventRefs: readonly string[];
  readonly acceptedEventRefs: readonly string[];
  readonly allocatedSequences: readonly number[];
  readonly atomicCommitEvidence: string | null;
  readonly idempotencyRecordEvidence: string | null;
  readonly integrityEvidence: string | null;
  readonly previousEventDigestRef: string | null;
  readonly batchDigestEvidence: string | null;
  readonly writerSignatureEvidenceRef: string | null;
  readonly keyVersionRef: string | null;
  readonly integrityVerificationResult: string | null;
  readonly outboxEvidence: string | null;
  readonly projection: ExecutiveJournalRuntimeProjectionEvidence | null;
  readonly replay: ExecutiveJournalRuntimeReplayRecoveryEvidence | null;
  readonly recovery: ExecutiveJournalRuntimeReplayRecoveryEvidence | null;
  readonly privacyCategory: string | null;
  readonly classification: string | null;
  readonly authorityRef: string | null;
  readonly confirmationEvidenceRef: string | null;
  readonly confirmationReused: boolean;
  readonly confirmationActorKind: string | null;
  readonly actorKind: string | null;
  readonly operation: string | null;
  readonly disclosureEvidenceRef: string | null;
  readonly exportEvidenceRef: string | null;
  readonly exportFormatSelected: boolean;
  readonly retentionEvidenceRef: string | null;
  readonly retentionPeriodSelected: boolean;
  readonly dispositionEvidenceRef: string | null;
  readonly governanceEventRef: string | null;
  readonly predecessorRef: string | null;
  readonly disputeRef: string | null;
  readonly affectedHistoricalRef: string | null;
  readonly appendOnlyViolation: boolean;
  readonly inPlaceCorrection: boolean;
  readonly historicalOverwrite: boolean;
  readonly historicalDeletion: boolean;
  readonly sequenceReuse: boolean;
  readonly duplicateCommittedEffect: boolean;
  readonly partialCommit: boolean;
  readonly crossJournalBatch: boolean;
  readonly aiSatisfiedConfirmation: boolean;
  readonly aiCreatedAuthority: boolean;
  readonly aiClosedCommitment: boolean;
  readonly aiDisclosedOrExported: boolean;
  readonly aiRetentionOrDisposition: boolean;
  readonly privateInSharedSearch: boolean;
  readonly privateInSharedProjection: boolean;
  readonly privateExported: boolean;
  readonly privatePromotionValid: boolean | null;
  readonly telemetryContainsPayload: boolean;
  readonly requiresUnresolvedOpenIssueDefault: boolean;
  readonly externalSequenceHistoryPresent: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly containsPayload: false;
}

/** Discriminated assurance assessment result. */
export type ExecutiveJournalRuntimeAssuranceResult =
  | {
      readonly kind: "Reconciled";
      readonly reasonCode: string;
      readonly reason: string;
      readonly bundleId: string;
      readonly findings: readonly ExecutiveJournalRuntimeAssuranceFinding[];
      readonly summary: string;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly repairs: false;
    }
  | {
      readonly kind: "Divergent";
      readonly reasonCode: string;
      readonly reason: string;
      readonly bundleId: string;
      readonly findings: readonly ExecutiveJournalRuntimeAssuranceFinding[];
      readonly summary: string;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly repairs: false;
    }
  | {
      readonly kind: "Indeterminate";
      readonly reasonCode: string;
      readonly reason: string;
      readonly bundleId: string;
      readonly findings: readonly ExecutiveJournalRuntimeAssuranceFinding[];
      readonly summary: string;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly repairs: false;
    }
  | {
      readonly kind: "Invalid";
      readonly reasonCode: string;
      readonly reason: string;
      readonly bundleId: string;
      readonly findings: readonly ExecutiveJournalRuntimeAssuranceFinding[];
      readonly summary: string;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly repairs: false;
    };

export interface ExecutiveJournalRuntimeAssuranceIdentityDescriptor {
  readonly id: "RTC-2:8/ExecutiveJournalRuntimeReconciliationAssurance";
  readonly name: "Executive Journal Runtime Reconciliation & Assurance";
  readonly phaseId: "RTC-2:8";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.journal.assurance";
  readonly status: ExecutiveJournalRuntimeAssuranceStatus;
  readonly readiness: ExecutiveJournalRuntimeAssuranceReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Journal Runtime";
  readonly sourceExecution: "RTC-2:7/ExecutiveJournalRuntimeExecutionContract";
  readonly upstream: "RTC-2:7 — Executive Journal Runtime Execution Contract";
  readonly previousPhase: "RTC-2:7 — Executive Journal Runtime Execution Contract";
  readonly nextPhase: "RTC-2:9 — Executive Journal Runtime Certification & Release Readiness";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveJournalRuntimeAssuranceSummary {
  readonly assuranceId: "RTC-2:8/ExecutiveJournalRuntimeReconciliationAssurance";
  readonly version: "1.0.0";
  readonly name: "Executive Journal Runtime Reconciliation & Assurance";
  readonly namespace: "nexora.rtc.executive.journal.assurance";
  readonly status: ExecutiveJournalRuntimeAssuranceStatus;
  readonly readiness: ExecutiveJournalRuntimeAssuranceReadiness;
  readonly ruleCount: number;
  readonly subjectKindCount: number;
  readonly openIssueCount: number;
  readonly sourceExecution: "RTC-2:7/ExecutiveJournalRuntimeExecutionContract";
  readonly previousPhase: "RTC-2:7 — Executive Journal Runtime Execution Contract";
  readonly nextPhase: "RTC-2:9 — Executive Journal Runtime Certification & Release Readiness";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
