/**
 * RTC-2:6 — Executive Journal Runtime Policy Enforcement Types.
 *
 * Closed enforcement vocabularies and planning result unions.
 * Planning descriptors only — no execution.
 *
 * Ownership: owned exclusively by RTC-2:6.
 */

import type {
  ExecutiveJournalRuntimePolicyDecision,
  ExecutiveJournalRuntimePolicyObligationKind,
} from "./executiveJournalRuntimePolicyTypes.ts";

/** Enforcement status. */
export type ExecutiveJournalRuntimeEnforcementStatus = "Enforcement";

/** Immediate next-phase readiness (RTC-1:6 vocabulary). */
export type ExecutiveJournalRuntimeEnforcementReadiness =
  "ReadyForCertification";

/** Closed enforcement result vocabulary. */
export type ExecutiveJournalRuntimeEnforcementResultKind =
  | "Blocked"
  | "AwaitingConfirmation"
  | "Enforceable";

/** Closed enforcement-step vocabulary (planning descriptors only). */
export type ExecutiveJournalRuntimeEnforcementStepKind =
  | "VerifyValidation"
  | "VerifyPolicyDecision"
  | "VerifyActor"
  | "VerifyAuthority"
  | "VerifyDelegation"
  | "VerifyPurpose"
  | "VerifyLifecyclePrecondition"
  | "VerifyEvidence"
  | "VerifyConfirmation"
  | "ApplyFieldFilter"
  | "ApplyRedaction"
  | "BindProjectionScope"
  | "PrepareEventAppend"
  | "PrepareCorrectionAppend"
  | "PrepareDisputeAppend"
  | "PrepareSupersessionAppend"
  | "PrepareDisclosureEvidence"
  | "PrepareExportEvidence"
  | "PrepareRetentionEvidence"
  | "PrepareDispositionEvidence"
  | "PrepareBreakGlassReview"
  | "SealEnforcementPlan";

/** Confirmation evidence bound to a policy decision. */
export interface ExecutiveJournalRuntimeEnforcementConfirmationEvidence {
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
}

/** Enforcement planning request. */
export interface ExecutiveJournalRuntimeEnforcementRequest {
  readonly requestId: string;
  readonly policyDecision: ExecutiveJournalRuntimePolicyDecision;
  readonly operation: string;
  readonly actorId: string;
  readonly actorKind: string;
  readonly authorityRef: string | null;
  readonly authorityStatus: "Active" | "Revoked" | "Expired" | "OutOfScope" | "Unknown" | null;
  readonly purpose: string | null;
  readonly targetJournalId: string;
  readonly targetEntityKind: string;
  readonly targetEntityId: string;
  readonly proposedEffect: string;
  readonly lifecycleState: string;
  readonly recordCategory: string;
  readonly classification: string | null;
  readonly validationOutcome: "Valid" | "Invalid" | "Missing";
  readonly evidenceRefs: readonly string[];
  readonly predecessorRef: string | null;
  readonly affectedRef: string | null;
  readonly retentionPolicyRef: string | null;
  readonly dispositionPolicyRef: string | null;
  readonly exportPolicyRef: string | null;
  readonly confirmationEvidence:
    | ExecutiveJournalRuntimeEnforcementConfirmationEvidence
    | null;
  readonly requiresUnresolvedOpenIssueDefault: boolean;
}

/** Immutable enforcement step descriptor. */
export interface ExecutiveJournalRuntimeEnforcementStep {
  readonly stepId: string;
  readonly kind: ExecutiveJournalRuntimeEnforcementStepKind;
  readonly order: number;
  readonly description: string;
  readonly effectBearing: boolean;
  readonly obligationsSatisfied: readonly ExecutiveJournalRuntimePolicyObligationKind[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly executes: false;
}

/** Enforceable plan body. */
export interface ExecutiveJournalRuntimeEnforcementPlan {
  readonly planId: string;
  readonly policyDecisionCode: string;
  readonly policyVersion: string;
  readonly requestId: string;
  readonly actorId: string;
  readonly authorityRef: string;
  readonly purpose: string | null;
  readonly targetJournalId: string;
  readonly targetEntityId: string;
  readonly operation: string;
  readonly steps: readonly ExecutiveJournalRuntimeEnforcementStep[];
  readonly requiredEvidence: readonly string[];
  readonly lifecyclePrecondition: string;
  readonly resultingLifecycleState: string;
  readonly privacyCategory: string;
  readonly classification: string | null;
  readonly failureBehavior: "FailClosed";
  readonly compensationMetadata: string | null;
  readonly summary: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly executes: false;
}

/** Discriminated enforcement planning result. */
export type ExecutiveJournalRuntimeEnforcementResult =
  | {
      readonly kind: "Blocked";
      readonly reasonCode: string;
      readonly reason: string;
      readonly policyDecisionCode: string;
      readonly requestId: string;
      readonly matchingRuleIds: readonly string[];
      readonly obligations: readonly ExecutiveJournalRuntimePolicyObligationKind[];
      readonly steps: readonly [];
      readonly plan: null;
      readonly unsupportedObligation: ExecutiveJournalRuntimePolicyObligationKind | null;
      readonly revealsProtectedMetadata: false;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly executes: false;
    }
  | {
      readonly kind: "AwaitingConfirmation";
      readonly reasonCode: string;
      readonly reason: string;
      readonly policyDecisionCode: string;
      readonly requestId: string;
      readonly matchingRuleIds: readonly string[];
      readonly obligations: readonly ExecutiveJournalRuntimePolicyObligationKind[];
      readonly preparationSteps: readonly ExecutiveJournalRuntimeEnforcementStep[];
      readonly steps: readonly [];
      readonly plan: null;
      readonly confirmationChallenge: {
          readonly requestId: string;
          readonly policyDecisionCode: string;
          readonly policyVersion: string;
          readonly targetId: string;
          readonly operation: string;
          readonly proposedEffect: string;
          readonly requiredAuthority: string;
          readonly metadataOnly: true;
          readonly immutable: true;
        };
      readonly revealsProtectedMetadata: false;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly executes: false;
    }
  | {
      readonly kind: "Enforceable";
      readonly reasonCode: string;
      readonly reason: string;
      readonly policyDecisionCode: string;
      readonly requestId: string;
      readonly matchingRuleIds: readonly string[];
      readonly obligations: readonly ExecutiveJournalRuntimePolicyObligationKind[];
      readonly steps: readonly ExecutiveJournalRuntimeEnforcementStep[];
      readonly plan: ExecutiveJournalRuntimeEnforcementPlan;
      readonly revealsProtectedMetadata: false;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly executes: false;
    };

export interface ExecutiveJournalRuntimeEnforcementIdentityDescriptor {
  readonly id: "RTC-2:6/ExecutiveJournalRuntimePolicyEnforcement";
  readonly name: "Executive Journal Runtime Policy Enforcement";
  readonly phaseId: "RTC-2:6";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.journal.enforcement";
  readonly status: ExecutiveJournalRuntimeEnforcementStatus;
  readonly readiness: ExecutiveJournalRuntimeEnforcementReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Journal Runtime";
  readonly sourcePolicy: "RTC-2:5/ExecutiveJournalRuntimePolicy";
  readonly upstream: "RTC-2:5 — Executive Journal Runtime Policy";
  readonly nextPhase: "RTC-2:7 — Executive Journal Runtime Execution Contract";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveJournalRuntimeEnforcementSummary {
  readonly enforcementId: "RTC-2:6/ExecutiveJournalRuntimePolicyEnforcement";
  readonly version: "1.0.0";
  readonly name: "Executive Journal Runtime Policy Enforcement";
  readonly namespace: "nexora.rtc.executive.journal.enforcement";
  readonly status: ExecutiveJournalRuntimeEnforcementStatus;
  readonly readiness: ExecutiveJournalRuntimeEnforcementReadiness;
  readonly stepKindCount: number;
  readonly obligationMappingCount: number;
  readonly openIssueCount: number;
  readonly sourcePolicy: "RTC-2:5/ExecutiveJournalRuntimePolicy";
  readonly nextPhase: "RTC-2:7 — Executive Journal Runtime Execution Contract";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
