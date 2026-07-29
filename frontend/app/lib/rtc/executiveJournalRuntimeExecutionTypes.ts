/**
 * RTC-2:7 — Executive Journal Runtime Execution Contract Types.
 *
 * Closed execution vocabularies, intent/receipt unions.
 * Contracts and pure transforms only — no persistence or side effects.
 *
 * Ownership: owned exclusively by RTC-2:7.
 */

import type { ExecutiveJournalRuntimeEnforcementResult } from "./executiveJournalRuntimeEnforcementTypes.ts";

/** Execution-contract status. */
export type ExecutiveJournalRuntimeExecutionStatus = "ExecutionContract";

/**
 * Immediate next-phase readiness for RTC-2:7 Execution Contract.
 * Intentional architecture divergence governed by AD-RTC2-07
 * (RTC-1:7 uses ReadyForFreeze for Certification → Freeze).
 */
export type ExecutiveJournalRuntimeExecutionReadiness = "ReadyForAssurance";

/** Closed intent-construction result vocabulary. */
export type ExecutiveJournalRuntimeExecutionIntentKind =
  | "Rejected"
  | "Executable";

/** Closed supplied-outcome / receipt vocabulary. */
export type ExecutiveJournalRuntimeExecutionReceiptKind =
  | "Committed"
  | "Conflict"
  | "Failed"
  | "Indeterminate";

/** Closed execution-step vocabulary (descriptors only). */
export type ExecutiveJournalRuntimeExecutionStepKind =
  | "VerifyEnforcementPlan"
  | "VerifyIdempotency"
  | "VerifyExpectedSequence"
  | "VerifyLifecyclePrecondition"
  | "VerifyAuthorityBinding"
  | "VerifyEvidenceBinding"
  | "BeginAtomicBoundary"
  | "AllocateJournalSequence"
  | "PrepareEventEnvelope"
  | "PrepareIntegritySeal"
  | "PrepareEventAppend"
  | "PrepareIdempotencyRecord"
  | "PreparePolicyEvidenceReference"
  | "PrepareTransactionalOutbox"
  | "CommitAtomicBoundary"
  | "ProduceExecutionReceipt";

/** Proposed event descriptor — metadata only, no payload values. */
export interface ExecutiveJournalRuntimeProposedEventDescriptor {
  readonly eventIdDescriptor: string;
  readonly eventType: string;
  readonly eventVersion: string;
  readonly journalId: string;
  readonly sequenceOffset: number;
  readonly actorId: string;
  readonly authorityRef: string;
  readonly purpose: string | null;
  readonly classification: string | null;
  readonly recordCategory: string;
  readonly evidenceRefs: readonly string[];
  readonly causationRef: string | null;
  readonly correlationRef: string;
  readonly payloadSchemaRef: string;
  readonly integrityRequirements: readonly string[];
  readonly predecessorRef: string | null;
  readonly disputeRef: string | null;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly containsPayload: false;
}

/** Confirmation evidence preserved from enforcement (not generated here). */
export interface ExecutiveJournalRuntimeExecutionConfirmationEvidence {
  readonly confirmationId: string;
  readonly actorId: string;
  readonly requestId: string;
  readonly policyDecisionCode: string;
  readonly policyVersion: string;
  readonly targetId: string;
  readonly operation: string;
  readonly proposedEffect: string;
  readonly authorityRef: string;
  readonly singleUse: true;
  readonly expired: boolean;
  readonly expiryMetadata: string;
  readonly reused: boolean;
}

/** Input for constructing an execution intent from an enforcement result. */
export interface ExecutiveJournalRuntimeExecutionIntentRequest {
  readonly requestId: string;
  readonly enforcementResult: ExecutiveJournalRuntimeEnforcementResult;
  readonly policyDecisionCode: string;
  readonly policyVersion: string;
  readonly validationOutcome: "Valid" | "Invalid" | "Missing";
  readonly actorId: string;
  readonly actorKind: string;
  readonly authorityRef: string | null;
  readonly purpose: string | null;
  readonly targetJournalId: string;
  readonly operation: string;
  readonly expectedJournalSequence: number | null;
  readonly idempotencyKey: string | null;
  readonly commandDigest: string | null;
  readonly proposedEvents: readonly ExecutiveJournalRuntimeProposedEventDescriptor[];
  readonly evidenceRefs: readonly string[];
  readonly privacyCategory: string;
  readonly classification: string | null;
  readonly lifecyclePrecondition: string;
  readonly expectedLifecycleResult: string;
  readonly confirmationEvidence:
    | ExecutiveJournalRuntimeExecutionConfirmationEvidence
    | null;
  readonly requiresUnresolvedOpenIssueDefault: boolean;
  readonly requestsInPlaceMutation: boolean;
  readonly requestsHistoricalOverwrite: boolean;
  readonly requestsHistoricalDeletion: boolean;
  readonly requestsSequenceReuse: boolean;
}

/** Immutable execution-step descriptor. */
export interface ExecutiveJournalRuntimeExecutionStep {
  readonly stepId: string;
  readonly kind: ExecutiveJournalRuntimeExecutionStepKind;
  readonly order: number;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly executes: false;
}

/** Canonical execution intent (no real side effects). */
export interface ExecutiveJournalRuntimeExecutionIntent {
  readonly intentId: string;
  readonly enforcementPlanId: string;
  readonly policyDecisionCode: string;
  readonly policyVersion: string;
  readonly validationOutcome: "Valid";
  readonly requestId: string;
  readonly targetJournalId: string;
  readonly actorId: string;
  readonly authorityRef: string;
  readonly purpose: string | null;
  readonly operation: string;
  readonly expectedJournalSequence: number;
  readonly idempotencyKey: string;
  readonly commandDigest: string;
  readonly eventBatch: readonly ExecutiveJournalRuntimeProposedEventDescriptor[];
  readonly eventBatchDigest: string;
  readonly evidenceRefs: readonly string[];
  readonly privacyCategory: string;
  readonly classification: string | null;
  readonly lifecyclePrecondition: string;
  readonly expectedLifecycleResult: string;
  readonly steps: readonly ExecutiveJournalRuntimeExecutionStep[];
  readonly requiredIntegrityOperations: readonly string[];
  readonly requiredTransactionOperations: readonly string[];
  readonly requiredOutboxOperations: readonly string[];
  readonly summary: string;
  readonly telemetry: {
    readonly resultKind: "Executable";
    readonly operation: string;
    readonly entityKind: string;
    readonly batchSize: number;
    readonly policyCode: string;
    readonly enforcementCode: string;
    readonly correlationId: string;
    readonly containsPayload: false;
    readonly metadataOnly: true;
  };
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly executes: false;
}

/** Explicit runtime outcome supplied by the caller — never invented here. */
export interface ExecutiveJournalRuntimeExecutionOutcomeEvidence {
  readonly outcomeKind: ExecutiveJournalRuntimeExecutionReceiptKind;
  readonly durableCommitEvidence: string | null;
  readonly acceptedEventRefs: readonly string[];
  readonly allocatedSequence: string | null;
  readonly integrityEvidenceRef: string | null;
  readonly idempotencyRecordRef: string | null;
  readonly atomicBoundaryEvidence: string | null;
  readonly outboxEvidenceRef: string | null;
  readonly expectedSequence: number | null;
  readonly observedSequence: number | null;
  readonly conflictCode: string | null;
  readonly idempotencyConflict: boolean;
  readonly priorCommandDigest: string | null;
  readonly failureCode: string | null;
  readonly provesNoAcceptedEffect: boolean;
  readonly uncertain: boolean;
  readonly partialCommit: boolean;
  readonly recoveryInstructionCode: string | null;
}

/** Discriminated intent-construction result. */
export type ExecutiveJournalRuntimeExecutionIntentResult =
  | {
      readonly kind: "Rejected";
      readonly reasonCode: string;
      readonly reason: string;
      readonly requestId: string;
      readonly enforcementPlanId: string | null;
      readonly eventBatch: readonly [];
      readonly intent: null;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly executes: false;
    }
  | {
      readonly kind: "Executable";
      readonly reasonCode: string;
      readonly reason: string;
      readonly requestId: string;
      readonly intent: ExecutiveJournalRuntimeExecutionIntent;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly executes: false;
    };

/** Discriminated execution receipt. */
export type ExecutiveJournalRuntimeExecutionReceipt =
  | {
      readonly kind: "Committed";
      readonly receiptId: string;
      readonly intentId: string;
      readonly enforcementPlanId: string;
      readonly policyDecisionCode: string;
      readonly requestId: string;
      readonly idempotencyKey: string;
      readonly commandDigest: string;
      readonly targetJournalId: string;
      readonly eventBatchDigest: string;
      readonly allocatedSequence: string;
      readonly acceptedEventRefs: readonly string[];
      readonly integrityEvidenceRef: string;
      readonly idempotencyRecordRef: string;
      readonly atomicBoundaryEvidence: string;
      readonly outboxEvidenceRef: string | null;
      readonly summary: string;
      readonly telemetry: {
          readonly resultKind: "Committed";
          readonly operation: string;
          readonly batchSize: number;
          readonly sequenceRange: string;
          readonly policyCode: string;
          readonly enforcementCode: string;
          readonly integrityResultCode: string;
          readonly correlationId: string;
          readonly containsPayload: false;
          readonly metadataOnly: true;
        };
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
    }
  | {
      readonly kind: "Conflict";
      readonly receiptId: string;
      readonly intentId: string;
      readonly enforcementPlanId: string;
      readonly policyDecisionCode: string;
      readonly requestId: string;
      readonly idempotencyKey: string;
      readonly commandDigest: string;
      readonly targetJournalId: string;
      readonly eventBatchDigest: string;
      readonly expectedSequence: number;
      readonly observedSequence: number | null;
      readonly conflictCode: string;
      readonly idempotencyConflict: boolean;
      readonly summary: string;
      readonly revealsRestrictedContent: false;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
    }
  | {
      readonly kind: "Failed";
      readonly receiptId: string;
      readonly intentId: string;
      readonly enforcementPlanId: string;
      readonly policyDecisionCode: string;
      readonly requestId: string;
      readonly idempotencyKey: string;
      readonly commandDigest: string;
      readonly targetJournalId: string;
      readonly eventBatchDigest: string;
      readonly failureCode: string;
      readonly provesNoAcceptedEffect: true;
      readonly summary: string;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
    }
  | {
      readonly kind: "Indeterminate";
      readonly receiptId: string;
      readonly intentId: string;
      readonly enforcementPlanId: string;
      readonly policyDecisionCode: string;
      readonly requestId: string;
      readonly idempotencyKey: string;
      readonly commandDigest: string;
      readonly targetJournalId: string;
      readonly eventBatchDigest: string;
      readonly recoveryInstructionCode: string;
      readonly retryRequiresSameIdempotencyKey: true;
      readonly prohibitsNewIdempotencyKey: true;
      readonly acceptedEventRefs: readonly [];
      readonly summary: string;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
    };

export interface ExecutiveJournalRuntimeExecutionIdentityDescriptor {
  readonly id: "RTC-2:7/ExecutiveJournalRuntimeExecutionContract";
  readonly name: "Executive Journal Runtime Execution Contract";
  readonly phaseId: "RTC-2:7";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.journal.execution";
  readonly status: ExecutiveJournalRuntimeExecutionStatus;
  readonly readiness: ExecutiveJournalRuntimeExecutionReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Journal Runtime";
  readonly sourceEnforcement: "RTC-2:6/ExecutiveJournalRuntimePolicyEnforcement";
  readonly upstream: "RTC-2:6 — Executive Journal Runtime Policy Enforcement";
  readonly nextPhase: "RTC-2:8 — Executive Journal Runtime Reconciliation & Assurance";
  readonly architectureDivergence:
    "Intentional architecture divergence governed by AD-RTC2-07";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveJournalRuntimeArchitectureDecision {
  readonly decisionId: "AD-RTC2-07";
  readonly title: "Retain RTC-2:7 as Executive Journal Runtime Execution Contract";
  readonly decision: string;
  readonly consequences: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveJournalRuntimeExecutionSummary {
  readonly executionId: "RTC-2:7/ExecutiveJournalRuntimeExecutionContract";
  readonly version: "1.0.0";
  readonly name: "Executive Journal Runtime Execution Contract";
  readonly namespace: "nexora.rtc.executive.journal.execution";
  readonly status: ExecutiveJournalRuntimeExecutionStatus;
  readonly readiness: ExecutiveJournalRuntimeExecutionReadiness;
  readonly stepKindCount: number;
  readonly contractCount: number;
  readonly openIssueCount: number;
  readonly sourceEnforcement: "RTC-2:6/ExecutiveJournalRuntimePolicyEnforcement";
  readonly nextPhase: "RTC-2:8 — Executive Journal Runtime Reconciliation & Assurance";
  readonly architectureDecisionIds: readonly ["AD-RTC2-07"];
  readonly architectureDivergence:
    "Intentional architecture divergence governed by AD-RTC2-07";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
