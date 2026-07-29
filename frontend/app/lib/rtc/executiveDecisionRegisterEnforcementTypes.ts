/**
 * RTC-3:6 — Executive Decision Register Enforcement Types.
 *
 * Closed enforcement vocabularies and planning result unions.
 * Planning descriptors only — no execution.
 *
 * Ownership: owned exclusively by RTC-3:6.
 */

import type {
  ExecutiveDecisionRegisterPolicyDecision,
  ExecutiveDecisionRegisterPolicyObligationKind,
} from "./executiveDecisionRegisterPolicyTypes.ts";

/** Enforcement status. */
export type ExecutiveDecisionRegisterEnforcementStatus = "Enforcement";

/**
 * Immediate next-phase readiness.
 * Established by AD-RTC3-06 (Accepted): ReadyForExecutionContract
 * describes the intended RTC-3:7 ExecutionContract phase.
 * RTC-2:6 historically used ReadyForCertification for its equivalent
 * enforcement→execution-contract transition.
 */
export type ExecutiveDecisionRegisterEnforcementReadiness =
  "ReadyForExecutionContract";

/** Closed enforcement result vocabulary. */
export type ExecutiveDecisionRegisterEnforcementResultKind =
  | "Blocked"
  | "AwaitingConfirmation"
  | "Enforceable";

/** Closed enforcement-step vocabulary (planning descriptors only). */
export type ExecutiveDecisionRegisterEnforcementStepKind =
  | "VerifyValidation"
  | "VerifyPolicyDecision"
  | "VerifyActor"
  | "VerifyAuthority"
  | "VerifyDelegation"
  | "VerifyPurpose"
  | "VerifyLifecyclePrecondition"
  | "VerifyEvidence"
  | "VerifyConfirmation"
  | "VerifyPrivacyBoundary"
  | "ApplyFieldFilter"
  | "ApplyRedaction"
  | "BindProjectionScope"
  | "PrepareProposalEvent"
  | "PrepareConfirmationEvent"
  | "PrepareEffectiveDecisionEvent"
  | "PrepareCorrectionEvent"
  | "PrepareDisputeEvent"
  | "PrepareDisputeResolutionEvent"
  | "PrepareSupersessionEvent"
  | "PrepareOutcomeReferenceEvent"
  | "PrepareClosureEvent"
  | "PrepareDisclosureEvidence"
  | "PrepareExportEvidence"
  | "PrepareRetentionEvidence"
  | "PrepareDispositionEvent"
  | "PrepareBreakGlassReview"
  | "SealEnforcementPlan";

/** Confirmation evidence bound to a policy decision. */
export interface ExecutiveDecisionRegisterEnforcementConfirmationEvidence {
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
}

/** Architecture decision owned by RTC-3:6 (metadata-only). */
export interface ExecutiveDecisionRegisterArchitectureDecision {
  readonly decisionId: "AD-RTC3-06";
  readonly title: "Introduce explicit execution-contract readiness for RTC-3";
  readonly status: "Accepted";
  readonly decision: string;
  readonly rationale: string;
  readonly consequences: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Optional break-glass metadata for planning. */
export interface ExecutiveDecisionRegisterEnforcementBreakGlassInput {
  readonly emergencyCategory: string;
  readonly reason: string;
  readonly narrowScope: string;
  readonly expiryRequired: boolean;
  readonly reviewRequired: boolean;
}

/** Enforcement planning request. */
export interface ExecutiveDecisionRegisterEnforcementRequest {
  readonly requestId: string;
  readonly policyDecision: ExecutiveDecisionRegisterPolicyDecision;
  readonly operation: string;
  readonly actorId: string;
  readonly actorKind: string;
  readonly authorityRef: string | null;
  readonly authorityStatus:
    | "Active"
    | "Revoked"
    | "Expired"
    | "OutOfScope"
    | "Incomplete"
    | "Unknown"
    | null;
  readonly authoritySubstitute:
    | "Identity"
    | "Title"
    | "Role"
    | "Attendance"
    | "Silence"
    | "AiConfidence"
    | "PriorAccess"
    | "ClientAssertion"
    | null;
  readonly purpose: string | null;
  readonly targetRegister: string;
  readonly targetEntityKind: string;
  readonly targetEntityId: string;
  readonly currentLifecycleState: string;
  readonly proposedLifecycleState: string | null;
  readonly privacyCategory: string;
  readonly classification: string | null;
  readonly proposedEffect: string;
  readonly validationOutcome: "Valid" | "Invalid" | "Missing";
  readonly validationReference: string | null;
  readonly evidenceRefs: readonly string[];
  readonly predecessorRef: string | null;
  readonly successorRef: string | null;
  readonly challengedDecisionRef: string | null;
  readonly activeDisputePresent: boolean;
  readonly closureMetadataPresent: boolean;
  readonly dispositionGovernanceEvidencePresent: boolean;
  readonly inPlaceMutation: boolean;
  readonly privateReflectionAsDecisionRecord: boolean;
  readonly projectionCreatesAuthority: boolean;
  readonly projectionHidesDispute: boolean;
  readonly projectionErasesLineage: boolean;
  readonly retentionPolicyRef: string | null;
  readonly dispositionPolicyRef: string | null;
  readonly exportPolicyRef: string | null;
  readonly confirmationEvidence:
    | ExecutiveDecisionRegisterEnforcementConfirmationEvidence
    | null;
  readonly breakGlass: ExecutiveDecisionRegisterEnforcementBreakGlassInput | null;
  readonly requiresUnresolvedOpenIssueDefault: boolean;
}

/** Immutable enforcement step descriptor. */
export interface ExecutiveDecisionRegisterEnforcementStep {
  readonly stepId: string;
  readonly kind: ExecutiveDecisionRegisterEnforcementStepKind;
  readonly order: number;
  readonly description: string;
  readonly effectBearing: boolean;
  readonly obligationsSatisfied: readonly ExecutiveDecisionRegisterPolicyObligationKind[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly executes: false;
}

/** Enforceable plan body. */
export interface ExecutiveDecisionRegisterEnforcementPlan {
  readonly planId: string;
  readonly policyDecisionCode: string;
  readonly policyDecisionId: string;
  readonly policyVersion: string;
  readonly validationReference: string | null;
  readonly requestId: string;
  readonly actorId: string;
  readonly authorityRef: string;
  readonly purpose: string | null;
  readonly operation: string;
  readonly targetRegister: string;
  readonly targetEntityId: string;
  readonly currentLifecycleState: string;
  readonly proposedLifecycleState: string | null;
  readonly steps: readonly ExecutiveDecisionRegisterEnforcementStep[];
  readonly obligationToStepMap: Readonly<
    Record<string, readonly ExecutiveDecisionRegisterEnforcementStepKind[]>
  >;
  readonly requiredEvidence: readonly string[];
  readonly privacyCategory: string;
  readonly classification: string | null;
  readonly expectedAppendOnlyEffect: string;
  readonly failureBehavior: "FailClosed";
  readonly summary: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly executes: false;
}

/** Discriminated enforcement planning result. */
export type ExecutiveDecisionRegisterEnforcementResult =
  | {
      readonly kind: "Blocked";
      readonly reasonCode: string;
      readonly reason: string;
      readonly policyDecisionCode: string;
      readonly requestId: string;
      readonly matchingRuleIds: readonly string[];
      readonly obligations: readonly ExecutiveDecisionRegisterPolicyObligationKind[];
      readonly steps: readonly [];
      readonly plan: null;
      readonly unsupportedObligation:
        | ExecutiveDecisionRegisterPolicyObligationKind
        | null;
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
      readonly obligations: readonly ExecutiveDecisionRegisterPolicyObligationKind[];
      readonly preparationSteps: readonly ExecutiveDecisionRegisterEnforcementStep[];
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
      readonly obligations: readonly ExecutiveDecisionRegisterPolicyObligationKind[];
      readonly steps: readonly ExecutiveDecisionRegisterEnforcementStep[];
      readonly plan: ExecutiveDecisionRegisterEnforcementPlan;
      readonly revealsProtectedMetadata: false;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
      readonly executes: false;
    };

export interface ExecutiveDecisionRegisterEnforcementIdentityDescriptor {
  readonly id: "RTC-3:6/ExecutiveDecisionRegisterEnforcement";
  readonly name: "Executive Decision Register Enforcement";
  readonly phaseId: "RTC-3:6";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.decision.register.enforcement";
  readonly status: ExecutiveDecisionRegisterEnforcementStatus;
  readonly readiness: ExecutiveDecisionRegisterEnforcementReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Decision Register";
  readonly sourcePolicy: "RTC-3:5/ExecutiveDecisionRegisterPolicy";
  readonly upstream: "RTC-3:5 — Executive Decision Register Policy";
  readonly nextPhase: "RTC-3:7 — Executive Decision Register Execution Contract";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDecisionRegisterEnforcementSummary {
  readonly enforcementId: "RTC-3:6/ExecutiveDecisionRegisterEnforcement";
  readonly version: "1.0.0";
  readonly name: "Executive Decision Register Enforcement";
  readonly namespace: "nexora.rtc.executive.decision.register.enforcement";
  readonly status: ExecutiveDecisionRegisterEnforcementStatus;
  readonly readiness: ExecutiveDecisionRegisterEnforcementReadiness;
  readonly ruleCount: number;
  readonly stepKindCount: number;
  readonly obligationMappingCount: number;
  readonly openIssueCount: number;
  readonly decisionCount: number;
  readonly sourcePolicy: "RTC-3:5/ExecutiveDecisionRegisterPolicy";
  readonly nextPhase: "RTC-3:7 — Executive Decision Register Execution Contract";
  readonly architectureDecisionIds: readonly ["AD-RTC3-06"];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
