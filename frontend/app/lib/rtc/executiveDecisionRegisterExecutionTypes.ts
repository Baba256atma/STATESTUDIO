/**
 * RTC-3:7 — Executive Decision Register Execution Contract Types.
 *
 * Closed intent, receipt, conflict, evidence, step, and reason vocabularies.
 * Contracts and pure transforms only — no persistence or side effects.
 *
 * Ownership: owned exclusively by RTC-3:7.
 */

import type {
  ExecutiveDecisionRegisterEnforcementPlan,
  ExecutiveDecisionRegisterEnforcementResult,
} from "./executiveDecisionRegisterEnforcementTypes.ts";
import type { ExecutiveDecisionRegisterPolicyObligationKind } from "./executiveDecisionRegisterPolicyTypes.ts";

/** Execution-contract status. */
export type ExecutiveDecisionRegisterExecutionStatus = "ExecutionContract";

/**
 * Immediate next-phase readiness.
 * Established by AD-RTC3-07 (Accepted): ReadyForAssurance.
 */
export type ExecutiveDecisionRegisterExecutionReadiness = "ReadyForAssurance";

/** Closed intent-construction result vocabulary. */
export type ExecutiveDecisionRegisterExecutionIntentKind =
  | "Rejected"
  | "Executable";

/** Closed success-code vocabulary for Executable results. */
export type ExecutiveDecisionRegisterExecutionSuccessCode = "EXEC-EXECUTABLE";

/**
 * Closed rejection-reason vocabulary for Rejected results.
 * Does not include success codes.
 */
export type ExecutiveDecisionRegisterExecutionRejectionCode =
  | "EXEC-UNKNOWN-KIND"
  | "EXEC-BLOCKED"
  | "EXEC-AWAITING-CONFIRMATION"
  | "EXEC-MISSING-PLAN"
  | "EXEC-UNKNOWN-ENFORCEMENT"
  | "EXEC-MISSING-POLICY"
  | "EXEC-POLICY-MISMATCH"
  | "EXEC-MISSING-VALIDATION"
  | "EXEC-MISSING-AUTHORITY"
  | "EXEC-AUTHORITY-MISMATCH"
  | "EXEC-ACTOR-MISMATCH"
  | "EXEC-REQUEST-MISMATCH"
  | "EXEC-REGISTER-MISMATCH"
  | "EXEC-SUBJECT-MISMATCH"
  | "EXEC-OPERATION-MISMATCH"
  | "EXEC-AI"
  | "EXEC-MISSING-IDEMPOTENCY"
  | "EXEC-MISSING-DIGEST"
  | "EXEC-MISSING-OBLIGATION-DIGEST"
  | "EXEC-MISSING-SEQUENCE"
  | "EXEC-EMPTY-BATCH"
  | "EXEC-UNKNOWN-STEP"
  | "EXEC-EVENT-ORDER"
  | "EXEC-EXTRA-STEP"
  | "EXEC-MISSING-STEP"
  | "EXEC-MULTI-REGISTER"
  | "EXEC-APPEND-ONLY"
  | "EXEC-SUPERSESSION"
  | "EXEC-DISPUTE"
  | "EXEC-DISPOSITION"
  | "EXEC-OPEN-ISSUE"
  | "EXEC-PRIVATE"
  | "EXEC-CLASSIFICATION"
  | "EXEC-CONFIRMATION-MISSING"
  | "EXEC-CONFIRMATION-MISMATCH"
  | "EXEC-AUTHORIZATION-EXPIRED";

/** Closed supplied-outcome / receipt vocabulary. */
export type ExecutiveDecisionRegisterExecutionReceiptKind =
  | "Committed"
  | "Conflict"
  | "Failed"
  | "Indeterminate";

/** Closed step role vocabulary. */
export type ExecutiveDecisionRegisterExecutionStepRole =
  | "verification-only"
  | "executor-facing"
  | "effect-requesting"
  | "receipt-producing";

/** Closed execution-step vocabulary (descriptors only). */
export type ExecutiveDecisionRegisterExecutionStepKind =
  | "VerifyIntentBinding"
  | "VerifyIdempotencyBinding"
  | "VerifyExpectedSequence"
  | "VerifyAuthorityAndConfirmationBinding"
  | "VerifyObligationCompletion"
  | "VerifyAppendOnlyBoundary"
  | "BeginAtomicBoundary"
  | "AllocateRegisterSequence"
  | "PrepareEventEnvelope"
  | "PrepareIntegritySeal"
  | "RequestAppendOnlyEventCommit"
  | "PrepareIdempotencyRecord"
  | "RequestProjectionUpdate"
  | "RequestOutcomeCapture"
  | "CommitAtomicBoundary"
  | "ProduceExecutionReceipt";

/** Proposed event descriptor — metadata only, no payload values. */
export interface ExecutiveDecisionRegisterProposedEventDescriptor {
  readonly eventIdDescriptor: string;
  readonly eventType: string;
  readonly eventVersion: string;
  readonly registerId: string;
  readonly sequenceOffset: number;
  /** Enforcement-plan step kind this batch item claims to fulfill. */
  readonly stepKind: string;
  readonly actorId: string;
  readonly authorityRef: string;
  readonly purpose: string | null;
  readonly classification: string | null;
  readonly privacyCategory: string;
  readonly evidenceRefs: readonly string[];
  readonly causationRef: string | null;
  readonly correlationRef: string;
  readonly payloadSchemaRef: string;
  readonly integrityRequirements: readonly string[];
  readonly predecessorRef: string | null;
  readonly successorRef: string | null;
  readonly disputeRef: string | null;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly containsPayload: false;
}

/** Confirmation evidence preserved from enforcement (not generated here). */
export interface ExecutiveDecisionRegisterExecutionConfirmationEvidence {
  readonly confirmationId: string;
  readonly actorId: string;
  readonly actorKind: "Human";
  readonly requestId: string;
  readonly policyDecisionCode: string;
  readonly policyDecisionId: string;
  readonly policyVersion: string;
  readonly targetId: string;
  readonly operation: string;
  readonly proposedEffect: string;
  readonly authorityRef: string;
  readonly evidenceSet: readonly string[];
  readonly obligationKinds: readonly ExecutiveDecisionRegisterPolicyObligationKind[];
  readonly singleUse: true;
  readonly expired: boolean;
  readonly expiryMetadata: string;
  readonly reused: boolean;
}

/** Input for constructing an execution intent from an enforcement result. */
export interface ExecutiveDecisionRegisterExecutionIntentRequest {
  readonly requestId: string;
  readonly enforcementResult: ExecutiveDecisionRegisterEnforcementResult;
  readonly policyDecisionCode: string;
  readonly policyVersion: string;
  readonly validationOutcome: "Valid" | "Invalid" | "Missing";
  readonly actorId: string;
  readonly actorKind: string;
  readonly authorityRef: string | null;
  readonly purpose: string | null;
  readonly targetRegister: string;
  readonly targetEntityId: string;
  readonly operation: string;
  readonly expectedRegisterSequence: number | null;
  readonly idempotencyKey: string | null;
  readonly planDigest: string | null;
  readonly obligationDigest: string | null;
  readonly proposedEvents: readonly ExecutiveDecisionRegisterProposedEventDescriptor[];
  readonly evidenceRefs: readonly string[];
  readonly privacyCategory: string;
  readonly classification: string | null;
  readonly currentLifecycleState: string;
  readonly proposedLifecycleState: string | null;
  readonly confirmationEvidence:
    | ExecutiveDecisionRegisterExecutionConfirmationEvidence
    | null;
  readonly requiresUnresolvedOpenIssueDefault: boolean;
  readonly requestsInPlaceMutation: boolean;
  readonly requestsHistoricalOverwrite: boolean;
  readonly requestsHistoricalDeletion: boolean;
  readonly requestsSequenceReuse: boolean;
  readonly executionAuthorizationExpired: boolean;
}

/** Immutable execution-step descriptor. */
export interface ExecutiveDecisionRegisterExecutionStep {
  readonly stepId: string;
  readonly kind: ExecutiveDecisionRegisterExecutionStepKind;
  readonly order: number;
  readonly role: ExecutiveDecisionRegisterExecutionStepRole;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly executes: false;
}

/** Canonical execution intent (no real side effects). */
export interface ExecutiveDecisionRegisterExecutionIntent {
  readonly intentId: string;
  readonly enforcementPlanId: string;
  /** Exact RTC-3:6 Enforceable plan object reference (not a copy). */
  readonly enforcementPlan: ExecutiveDecisionRegisterEnforcementPlan;
  readonly policyDecisionCode: string;
  readonly policyVersion: string;
  readonly validationOutcome: "Valid";
  readonly requestId: string;
  readonly targetRegister: string;
  readonly targetEntityId: string;
  readonly actorId: string;
  readonly authorityRef: string;
  readonly purpose: string | null;
  readonly operation: string;
  readonly expectedRegisterSequence: number;
  readonly idempotencyKey: string;
  readonly planDigest: string;
  readonly obligationDigest: string;
  readonly eventBatch: readonly ExecutiveDecisionRegisterProposedEventDescriptor[];
  readonly eventBatchDigest: string;
  readonly evidenceRefs: readonly string[];
  readonly privacyCategory: string;
  readonly classification: string | null;
  readonly currentLifecycleState: string;
  readonly proposedLifecycleState: string | null;
  readonly steps: readonly ExecutiveDecisionRegisterExecutionStep[];
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
  readonly persists: false;
  readonly dispatches: false;
  readonly publishes: false;
  readonly createsAuthority: false;
  readonly confirmsDecisions: false;
  readonly mutatesDomainState: false;
}

/** Explicit runtime outcome supplied by the caller — never invented here. */
export interface ExecutiveDecisionRegisterExecutionOutcomeEvidence {
  readonly outcomeKind: ExecutiveDecisionRegisterExecutionReceiptKind;
  readonly outcomeEvidenceId: string | null;
  readonly outcomeEvidenceDigest: string | null;
  readonly durableCommitEvidence: string | null;
  readonly acceptedEventRefs: readonly string[];
  readonly allocatedSequence: string | null;
  readonly integrityEvidenceRef: string | null;
  readonly idempotencyRecordRef: string | null;
  readonly atomicBoundaryEvidence: string | null;
  readonly expectedSequence: number | null;
  readonly observedSequence: number | null;
  readonly conflictCode: string | null;
  readonly idempotencyConflict: boolean;
  readonly priorPlanDigest: string | null;
  readonly failureCode: string | null;
  readonly provesNoAcceptedEffect: boolean;
  readonly uncertain: boolean;
  readonly partialCommit: boolean;
  readonly submissionAcknowledgementOnly: boolean;
  readonly timedOut: boolean;
  readonly recoveryInstructionCode: string | null;
}

/** Discriminated intent-construction result. */
export type ExecutiveDecisionRegisterExecutionIntentResult =
  | {
      readonly kind: "Rejected";
      readonly reasonCode: ExecutiveDecisionRegisterExecutionRejectionCode;
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
      readonly reasonCode: ExecutiveDecisionRegisterExecutionSuccessCode;
      readonly reason: string;
      readonly requestId: string;
      readonly intent: ExecutiveDecisionRegisterExecutionIntent;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly executes: false;
    };

/** Shared receipt bindings preserved from the executable intent and outcome. */
export interface ExecutiveDecisionRegisterExecutionReceiptBindings {
  readonly receiptId: string;
  readonly intentId: string;
  readonly enforcementPlanId: string;
  readonly policyDecisionCode: string;
  readonly requestId: string;
  readonly authorityRef: string;
  readonly idempotencyKey: string;
  readonly planDigest: string;
  readonly targetRegister: string;
  readonly eventBatchDigest: string;
  readonly expectedRegisterSequence: number;
  readonly outcomeEvidenceId: string | null;
  readonly outcomeEvidenceDigest: string | null;
  readonly summary: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly createsAuthority: false;
  readonly confirmsDecisions: false;
  readonly mutatesDomainState: false;
}

/** Discriminated execution receipt. */
export type ExecutiveDecisionRegisterExecutionReceipt =
  | (ExecutiveDecisionRegisterExecutionReceiptBindings & {
      readonly kind: "Committed";
      readonly allocatedSequence: string;
      readonly acceptedEventRefs: readonly string[];
      readonly integrityEvidenceRef: string;
      readonly idempotencyRecordRef: string;
      readonly atomicBoundaryEvidence: string;
    })
  | (ExecutiveDecisionRegisterExecutionReceiptBindings & {
      readonly kind: "Conflict";
      readonly conflictCode: string;
      readonly expectedSequence: number | null;
      readonly observedSequence: number | null;
      readonly priorPlanDigest: string | null;
    })
  | (ExecutiveDecisionRegisterExecutionReceiptBindings & {
      readonly kind: "Failed";
      readonly failureCode: string;
      readonly provesNoAcceptedEffect: true;
    })
  | (ExecutiveDecisionRegisterExecutionReceiptBindings & {
      readonly kind: "Indeterminate";
      readonly recoveryInstructionCode: string;
    });

/** Architecture decision owned by RTC-3:7 (metadata-only). */
export interface ExecutiveDecisionRegisterArchitectureDecision {
  readonly decisionId: "AD-RTC3-07";
  readonly title: "Advance RTC-3 Execution Contract to Reconciliation and Assurance";
  readonly status: "Accepted";
  readonly decision: string;
  readonly rationale: string;
  readonly consequences: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveDecisionRegisterExecutionIdentityDescriptor {
  readonly id: "RTC-3:7/ExecutiveDecisionRegisterExecutionContract";
  readonly name: "Executive Decision Register Execution Contract";
  readonly phaseId: "RTC-3:7";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.decision.register.execution";
  readonly status: ExecutiveDecisionRegisterExecutionStatus;
  readonly readiness: ExecutiveDecisionRegisterExecutionReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Decision Register";
  readonly sourceEnforcement: "RTC-3:6/ExecutiveDecisionRegisterEnforcement";
  readonly upstream: "RTC-3:6 — Executive Decision Register Enforcement";
  readonly nextPhase: "RTC-3:8 — Executive Decision Register Reconciliation & Assurance";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDecisionRegisterExecutionSummary {
  readonly executionId: "RTC-3:7/ExecutiveDecisionRegisterExecutionContract";
  readonly version: "1.0.0";
  readonly name: "Executive Decision Register Execution Contract";
  readonly namespace: "nexora.rtc.executive.decision.register.execution";
  readonly status: ExecutiveDecisionRegisterExecutionStatus;
  readonly readiness: ExecutiveDecisionRegisterExecutionReadiness;
  readonly ruleCount: number;
  readonly stepKindCount: number;
  readonly contractCount: number;
  readonly openIssueCount: number;
  readonly decisionCount: number;
  readonly sourceEnforcement: "RTC-3:6/ExecutiveDecisionRegisterEnforcement";
  readonly nextPhase: "RTC-3:8 — Executive Decision Register Reconciliation & Assurance";
  readonly architectureDecisionIds: readonly ["AD-RTC3-06", "AD-RTC3-07"];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
