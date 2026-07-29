/**
 * RTC-3:8 — Executive Decision Register Reconciliation & Assurance Types.
 *
 * Closed result, finding, severity, subject, evidence, and reason vocabularies.
 * Evaluation only — no repair, fetch, or side effects.
 *
 * Ownership: owned exclusively by RTC-3:8.
 */

import type {
  ExecutiveDecisionRegisterExecutionIntent,
  ExecutiveDecisionRegisterExecutionReceipt,
} from "./executiveDecisionRegisterExecutionTypes.ts";
import type { ExecutiveDecisionRegisterEnforcementPlan } from "./executiveDecisionRegisterEnforcementTypes.ts";

/** Assurance status. */
export type ExecutiveDecisionRegisterAssuranceStatus = "Assurance";

/**
 * Immediate next-phase readiness.
 * Established by AD-RTC3-08 (Accepted): ReadyForCertification.
 */
export type ExecutiveDecisionRegisterAssuranceReadiness =
  "ReadyForCertification";

/** Closed assurance result vocabulary. */
export type ExecutiveDecisionRegisterAssuranceResultKind =
  | "Assured"
  | "NotAssured"
  | "Indeterminate";

/** Finding severity vocabulary. */
export type ExecutiveDecisionRegisterAssuranceSeverity =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

/** Closed assurance subject vocabulary. */
export type ExecutiveDecisionRegisterAssuranceSubjectKind =
  | "ExecutionAggregate"
  | "ExecutionRequest"
  | "EnforcementPlan"
  | "ExecutionIntent"
  | "AtomicBatch"
  | "ExecutionStep"
  | "IdempotencyBinding"
  | "ConcurrencyBinding"
  | "ExecutionReceipt"
  | "OutcomeEvidence"
  | "AuthorityBinding"
  | "ConfirmationBinding"
  | "ObligationBinding"
  | "DecisionRegister"
  | "AppendOnlyClaim"
  | "ProjectionClaim"
  | "TelemetryClaim"
  | "AiBoundary"
  | "PrivacyBoundary"
  | "RetentionClaim";

/** Closed external evidence-kind vocabulary. */
export type ExecutiveDecisionRegisterAssuranceEvidenceKind =
  | "CommitEvidence"
  | "ConcurrencyConflictEvidence"
  | "IdempotencyConflictEvidence"
  | "DefinitiveRejectionEvidence"
  | "RollbackEvidence"
  | "TimeoutEvidence"
  | "AcknowledgementEvidence"
  | "SequenceEvidence"
  | "AtomicityEvidence"
  | "AppendOnlyEventEvidence"
  | "ProjectionEvidence"
  | "OutcomeReferenceEvidence"
  | "TelemetryEvidence"
  | "EvidenceUnavailable";

/** Completeness state for supplied evidence. */
export type ExecutiveDecisionRegisterAssuranceEvidenceCompleteness =
  | "Complete"
  | "Incomplete"
  | "Unavailable"
  | "Contradictory";

/** Immutable assurance finding. */
export interface ExecutiveDecisionRegisterAssuranceFinding {
  readonly ruleId: string;
  readonly findingCode: string;
  readonly severity: ExecutiveDecisionRegisterAssuranceSeverity;
  readonly subjectKind: ExecutiveDecisionRegisterAssuranceSubjectKind;
  readonly subjectPath: string;
  readonly expected: string;
  readonly observed: string;
  readonly upstreamContractRef: string;
  readonly message: string;
  readonly resultHint: ExecutiveDecisionRegisterAssuranceResultKind;
  readonly orderingKey: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly containsPayload: false;
}

/** Single external evidence item — metadata descriptors only. */
export interface ExecutiveDecisionRegisterAssuranceEvidenceItem {
  readonly evidenceId: string;
  readonly evidenceKind: ExecutiveDecisionRegisterAssuranceEvidenceKind;
  readonly producingSource: string;
  readonly requestId: string;
  readonly intentId: string;
  readonly batchDigest: string;
  readonly receiptId: string | null;
  readonly idempotencyKey: string;
  readonly planDigest: string;
  readonly evidenceDigest: string;
  readonly observedSequence: number | null;
  readonly completeness: ExecutiveDecisionRegisterAssuranceEvidenceCompleteness;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly containsPayload: false;
}

/** Immutable assurance evidence bundle. */
export interface ExecutiveDecisionRegisterAssuranceEvidenceBundle {
  readonly bundleId: string;
  readonly assuranceRequestId: string;
  readonly intent: ExecutiveDecisionRegisterExecutionIntent | null;
  readonly receipt: ExecutiveDecisionRegisterExecutionReceipt | null;
  readonly enforcementPlan: ExecutiveDecisionRegisterEnforcementPlan | null;
  readonly evidenceItems: readonly ExecutiveDecisionRegisterAssuranceEvidenceItem[];
  readonly reportedAppendOnlyViolation: boolean;
  readonly reportedHistoricalErasure: boolean;
  readonly reportedAuthorityCreated: boolean;
  readonly reportedAuthorityBroadened: boolean;
  readonly reportedConfirmationSubstituted: boolean;
  readonly reportedAiAuthoritativeAction: boolean;
  readonly reportedSilentRebase: boolean;
  readonly reportedIdempotencyRotation: boolean;
  readonly reportedProjectionCreatesAuthority: boolean;
  readonly reportedProjectionErasesProvenance: boolean;
  readonly reportedUnauthorizedDisclosure: boolean;
  readonly reportedRetentionAltered: boolean;
  readonly reportedTelemetryContainsPayload: boolean;
  readonly reportedIndeterminateUpgraded: boolean;
  readonly requiresUnresolvedOpenIssueDefault: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly containsPayload: false;
}

/** Discriminated assurance assessment result. */
export type ExecutiveDecisionRegisterAssuranceResult =
  | {
      readonly kind: "Assured";
      readonly reasonCode: "ASR-ASSURED";
      readonly reason: string;
      readonly bundleId: string;
      readonly findings: readonly [];
      readonly summary: string;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly repairs: false;
      readonly executes: false;
      readonly certifies: false;
      readonly authorizesConsumption: false;
      readonly authorizesIntegration: false;
      readonly authorizesDeployment: false;
    }
  | {
      readonly kind: "NotAssured";
      readonly reasonCode: string;
      readonly reason: string;
      readonly bundleId: string;
      readonly findings: readonly ExecutiveDecisionRegisterAssuranceFinding[];
      readonly summary: string;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly repairs: false;
      readonly executes: false;
      readonly certifies: false;
      readonly authorizesConsumption: false;
      readonly authorizesIntegration: false;
      readonly authorizesDeployment: false;
    }
  | {
      readonly kind: "Indeterminate";
      readonly reasonCode: string;
      readonly reason: string;
      readonly bundleId: string;
      readonly findings: readonly ExecutiveDecisionRegisterAssuranceFinding[];
      readonly summary: string;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly repairs: false;
      readonly executes: false;
      readonly certifies: false;
      readonly authorizesConsumption: false;
      readonly authorizesIntegration: false;
      readonly authorizesDeployment: false;
    };

/** Architecture decision owned by RTC-3:8. */
export interface ExecutiveDecisionRegisterAssuranceArchitectureDecision {
  readonly decisionId: "AD-RTC3-08";
  readonly title: "Advance RTC-3 Assurance to Certification";
  readonly status: "Accepted";
  readonly decision: string;
  readonly rationale: string;
  readonly consequences: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveDecisionRegisterAssuranceIdentityDescriptor {
  readonly id: "RTC-3:8/ExecutiveDecisionRegisterAssurance";
  readonly name: "Executive Decision Register Reconciliation & Assurance";
  readonly phaseId: "RTC-3:8";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.decision.register.assurance";
  readonly status: ExecutiveDecisionRegisterAssuranceStatus;
  readonly readiness: ExecutiveDecisionRegisterAssuranceReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Decision Register";
  readonly sourceExecution: "RTC-3:7/ExecutiveDecisionRegisterExecutionContract";
  readonly upstream: "RTC-3:7 — Executive Decision Register Execution Contract";
  readonly previousPhase: "RTC-3:7 — Executive Decision Register Execution Contract";
  readonly nextPhase: "RTC-3:9 — Executive Decision Register Certification & Release Readiness";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDecisionRegisterAssuranceSummary {
  readonly assuranceId: "RTC-3:8/ExecutiveDecisionRegisterAssurance";
  readonly version: "1.0.0";
  readonly name: "Executive Decision Register Reconciliation & Assurance";
  readonly namespace: "nexora.rtc.executive.decision.register.assurance";
  readonly status: ExecutiveDecisionRegisterAssuranceStatus;
  readonly readiness: ExecutiveDecisionRegisterAssuranceReadiness;
  readonly ruleCount: number;
  readonly subjectKindCount: number;
  readonly evidenceKindCount: number;
  readonly findingCodeCount: number;
  readonly openIssueCount: number;
  readonly decisionCount: number;
  readonly sourceExecution: "RTC-3:7/ExecutiveDecisionRegisterExecutionContract";
  readonly previousPhase: "RTC-3:7 — Executive Decision Register Execution Contract";
  readonly nextPhase: "RTC-3:9 — Executive Decision Register Certification & Release Readiness";
  readonly architectureDecisionIds: readonly [
    "AD-RTC3-06",
    "AD-RTC3-07",
    "AD-RTC3-08",
  ];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
