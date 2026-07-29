/**
 * RTC-2:5 — Executive Journal Runtime Policy Types.
 *
 * Closed policy vocabularies and discriminated decision unions.
 * Metadata-only. Pure evaluation shapes only.
 *
 * Ownership: owned exclusively by RTC-2:5.
 */

/** Policy status. */
export type ExecutiveJournalRuntimePolicyStatus = "Policy";

/** Immediate next-phase readiness (RTC-1:5 vocabulary). */
export type ExecutiveJournalRuntimePolicyReadiness = "ReadyForPlatform";

/** Closed policy decision vocabulary. */
export type ExecutiveJournalRuntimePolicyDecisionKind =
  | "Allow"
  | "Deny"
  | "RequireConfirmation";

/** Closed actor kinds. */
export type ExecutiveJournalRuntimePolicyActorKind =
  | "Human"
  | "Ai"
  | "Service";

/** Closed operation vocabulary. */
export type ExecutiveJournalRuntimePolicyOperation =
  | "Propose"
  | "Confirm"
  | "Accept"
  | "Correct"
  | "Dispute"
  | "ResolveDispute"
  | "Supersede"
  | "CreateCommitment"
  | "CloseCommitment"
  | "Read"
  | "Search"
  | "Project"
  | "Disclose"
  | "Export"
  | "PromotePrivateReflection"
  | "ApplyRetention"
  | "Dispose"
  | "BreakGlassAccess";

/** Closed obligation vocabulary. */
export type ExecutiveJournalRuntimePolicyObligationKind =
  | "RequireHumanConfirmation"
  | "RequireAuthorityEvidence"
  | "RequireEvidenceReference"
  | "RequirePurposeBinding"
  | "RequireFieldFiltering"
  | "RequireRedaction"
  | "RequireDisclosureEvidence"
  | "RequireExportEvidence"
  | "RequireReview"
  | "RequireExpiry"
  | "RequireBreakGlassReview"
  | "RequireDispositionEvidence";

/** Closed record categories aligned with the model. */
export type ExecutiveJournalRuntimePolicyRecordCategory =
  | "PrivateReflection"
  | "RestrictedWorking"
  | "ExecutiveRecord"
  | "RegulatedPrivileged";

/** Delegation status for policy input (no live registry). */
export type ExecutiveJournalRuntimePolicyDelegationStatus =
  | "Active"
  | "Revoked"
  | "Expired"
  | "OutOfScope";

/** Upstream validation evidence attached to a policy request. */
export interface ExecutiveJournalRuntimePolicyValidationEvidence {
  readonly outcome: "Valid" | "Invalid";
  readonly valid: boolean;
  readonly warningCount: number;
  readonly errorCount: number;
}

/** Optional delegation metadata. */
export interface ExecutiveJournalRuntimePolicyDelegationInput {
  readonly status: ExecutiveJournalRuntimePolicyDelegationStatus;
  readonly scope: string;
  readonly evidenceRef: string | null;
}

/** Optional break-glass metadata. */
export interface ExecutiveJournalRuntimePolicyBreakGlassInput {
  readonly emergencyCategory: string;
  readonly reason: string;
  readonly narrowScope: string;
  readonly expiryRequired: boolean;
  readonly reviewRequired: boolean;
}

/** Deterministic policy request (no journal payload content). */
export interface ExecutiveJournalRuntimePolicyRequest {
  readonly requestId: string;
  readonly operation: string;
  readonly actorId: string;
  readonly actorKind: ExecutiveJournalRuntimePolicyActorKind | string;
  readonly authorityRef: string | null;
  readonly delegation: ExecutiveJournalRuntimePolicyDelegationInput | null;
  readonly purpose: string | null;
  readonly targetJournalId: string;
  readonly targetEntityKind: string;
  readonly targetEntityId: string;
  readonly recordCategory: ExecutiveJournalRuntimePolicyRecordCategory | string;
  readonly classification: string | null;
  readonly proposedEffect: string;
  readonly evidenceRefs: readonly string[];
  readonly lifecycleState: string;
  readonly requestedScope: readonly string[];
  readonly jurisdictionContext: string | null;
  readonly jurisdictionRequired: boolean;
  readonly breakGlass: ExecutiveJournalRuntimePolicyBreakGlassInput | null;
  readonly validation: ExecutiveJournalRuntimePolicyValidationEvidence | null;
  readonly retentionPolicyRef: string | null;
  readonly dispositionPolicyRef: string | null;
  readonly exportPolicyRef: string | null;
  readonly dualControlRequired: boolean;
}

/** Immutable obligation. */
export interface ExecutiveJournalRuntimePolicyObligation {
  readonly obligationId: string;
  readonly kind: ExecutiveJournalRuntimePolicyObligationKind;
  readonly description: string;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Confirmation requirement metadata. */
export interface ExecutiveJournalRuntimePolicyConfirmationRequirement {
  readonly proposedEffect: string;
  readonly confirmingActor: string;
  readonly requiredAuthority: string;
  readonly evidenceToDisplay: readonly string[];
  readonly expiryRequired: true;
  readonly dualControlRequired: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Discriminated policy decision. */
export interface ExecutiveJournalRuntimePolicyDecision {
  readonly decision: ExecutiveJournalRuntimePolicyDecisionKind;
  readonly decisionCode: string;
  readonly matchingRuleIds: readonly string[];
  readonly requestId: string;
  readonly subjectId: string;
  readonly targetId: string;
  readonly purpose: string | null;
  readonly reason: string;
  readonly obligations: readonly ExecutiveJournalRuntimePolicyObligation[];
  readonly validationOutcome: "Valid" | "Invalid" | "Missing";
  readonly policyId: "RTC-2:5/ExecutiveJournalRuntimePolicy";
  readonly policyVersion: "1.0.0";
  readonly evidenceRefs: readonly string[];
  readonly confirmation: ExecutiveJournalRuntimePolicyConfirmationRequirement | null;
  readonly revealsProtectedMetadata: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Policy identity descriptor. */
export interface ExecutiveJournalRuntimePolicyIdentityDescriptor {
  readonly id: "RTC-2:5/ExecutiveJournalRuntimePolicy";
  readonly name: "Executive Journal Runtime Policy";
  readonly phaseId: "RTC-2:5";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.journal.policy";
  readonly status: ExecutiveJournalRuntimePolicyStatus;
  readonly readiness: ExecutiveJournalRuntimePolicyReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Journal Runtime";
  readonly sourceValidation: "RTC-2:4/ExecutiveJournalRuntimeValidation";
  readonly upstream: "RTC-2:4 — Executive Journal Runtime Validation";
  readonly nextPhase: "RTC-2:6 — Executive Journal Runtime Policy Enforcement";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic policy summary. */
export interface ExecutiveJournalRuntimePolicySummary {
  readonly policyId: "RTC-2:5/ExecutiveJournalRuntimePolicy";
  readonly version: "1.0.0";
  readonly name: "Executive Journal Runtime Policy";
  readonly namespace: "nexora.rtc.executive.journal.policy";
  readonly status: ExecutiveJournalRuntimePolicyStatus;
  readonly readiness: ExecutiveJournalRuntimePolicyReadiness;
  readonly ruleCount: number;
  readonly operationCount: number;
  readonly obligationKindCount: number;
  readonly openIssueCount: number;
  readonly sourceValidation: "RTC-2:4/ExecutiveJournalRuntimeValidation";
  readonly nextPhase: "RTC-2:6 — Executive Journal Runtime Policy Enforcement";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
