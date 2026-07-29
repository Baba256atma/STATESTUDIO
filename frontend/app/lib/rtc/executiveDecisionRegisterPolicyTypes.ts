/**
 * RTC-3:5 — Executive Decision Register Policy Types.
 *
 * Closed policy vocabularies and discriminated decision unions.
 * Metadata-only. Pure evaluation shapes only.
 *
 * Ownership: owned exclusively by RTC-3:5.
 */

/** Policy status. */
export type ExecutiveDecisionRegisterPolicyStatus = "Policy";

/** Immediate next-phase readiness. */
export type ExecutiveDecisionRegisterPolicyReadiness = "ReadyForEnforcement";

/** Closed policy decision vocabulary. */
export type ExecutiveDecisionRegisterPolicyDecisionKind =
  | "Allow"
  | "Deny"
  | "RequireConfirmation";

/** Closed actor kinds. */
export type ExecutiveDecisionRegisterPolicyActorKind =
  | "Human"
  | "Ai"
  | "Service";

/** Closed operation vocabulary. */
export type ExecutiveDecisionRegisterPolicyOperation =
  | "ProposeDecision"
  | "ConfirmDecision"
  | "MakeDecisionEffective"
  | "CorrectDecision"
  | "OpenDispute"
  | "ResolveDispute"
  | "SupersedeDecision"
  | "CloseDecision"
  | "ReferenceOutcome"
  | "ReadDecision"
  | "SearchDecisions"
  | "ProjectDecisionRegister"
  | "DiscloseDecision"
  | "ExportDecision"
  | "ApplyRetention"
  | "DisposeDecision"
  | "BreakGlassAccess";

/** Closed obligation vocabulary. */
export type ExecutiveDecisionRegisterPolicyObligationKind =
  | "RequireHumanConfirmation"
  | "RequireAuthorityEvidence"
  | "RequirePurposeBinding"
  | "RequireEvidenceReference"
  | "RequireAppendOnlyEvent"
  | "RequireProvenance"
  | "RequireFieldFiltering"
  | "RequireRedaction"
  | "RequireDisclosureEvidence"
  | "RequireExportEvidence"
  | "RequireRetentionEvidence"
  | "RequireDispositionEvidence"
  | "RequireReview"
  | "RequireExpiry"
  | "RequireBreakGlassReview";

/** Closed privacy categories aligned with the model. */
export type ExecutiveDecisionRegisterPolicyPrivacyCategory =
  | "ExecutiveRecord"
  | "RestrictedExecutiveRecord"
  | "RegulatedPrivileged"
  | "PrivateReflection"
  | string;

/** Delegation status for policy input (no live registry). */
export type ExecutiveDecisionRegisterPolicyDelegationStatus =
  | "Active"
  | "Revoked"
  | "Expired"
  | "OutOfScope"
  | "Incomplete";

/** Authority substitute rejection vocabulary. */
export type ExecutiveDecisionRegisterPolicyAuthoritySubstitute =
  | "Identity"
  | "Title"
  | "Role"
  | "Attendance"
  | "Silence"
  | "AiConfidence"
  | "PriorAccess"
  | "ClientAssertion";

/** Upstream validation evidence attached to a policy request. */
export interface ExecutiveDecisionRegisterPolicyValidationEvidence {
  readonly outcome: "Valid" | "Invalid";
  readonly valid: boolean;
  readonly warningCount: number;
  readonly errorCount: number;
  readonly validationResultRef: string;
}

/** Optional delegation metadata. */
export interface ExecutiveDecisionRegisterPolicyDelegationInput {
  readonly status: ExecutiveDecisionRegisterPolicyDelegationStatus;
  readonly scope: string;
  readonly evidenceRef: string | null;
}

/** Optional break-glass metadata. */
export interface ExecutiveDecisionRegisterPolicyBreakGlassInput {
  readonly emergencyCategory: string;
  readonly reason: string;
  readonly narrowScope: string;
  readonly expiryRequired: boolean;
  readonly reviewRequired: boolean;
}

/** Optional confirmation binding metadata. */
export interface ExecutiveDecisionRegisterPolicyConfirmationContext {
  readonly humanConfirmer: boolean;
  readonly proposalRef: string | null;
  readonly expectedProposalRef: string | null;
  readonly proposedEffect: string | null;
  readonly expectedEffect: string | null;
  readonly authorityRef: string | null;
  readonly expectedAuthorityRef: string | null;
  readonly evidenceSet: readonly string[];
  readonly expectedEvidenceSet: readonly string[];
  readonly policyVersionRef: string | null;
  readonly singleUse: boolean;
}

/** Deterministic policy request (no decision payload content). */
export interface ExecutiveDecisionRegisterPolicyRequest {
  readonly requestId: string;
  readonly operation: string;
  readonly actorId: string;
  readonly actorKind: ExecutiveDecisionRegisterPolicyActorKind | string;
  readonly authorityRef: string | null;
  readonly delegation: ExecutiveDecisionRegisterPolicyDelegationInput | null;
  readonly purpose: string | null;
  readonly targetRegister: string;
  readonly targetEntityKind: string;
  readonly targetEntityId: string;
  readonly currentLifecycleState: string;
  readonly proposedLifecycleState: string | null;
  readonly authorityState: string;
  readonly originState: string;
  readonly privacyCategory: ExecutiveDecisionRegisterPolicyPrivacyCategory;
  readonly classification: string | null;
  readonly proposedEffect: string;
  readonly evidenceRefs: readonly string[];
  readonly validation: ExecutiveDecisionRegisterPolicyValidationEvidence | null;
  readonly requestedScope: readonly string[];
  readonly confirmationContext: ExecutiveDecisionRegisterPolicyConfirmationContext | null;
  readonly jurisdictionContext: string | null;
  readonly jurisdictionRequired: boolean;
  readonly breakGlass: ExecutiveDecisionRegisterPolicyBreakGlassInput | null;
  readonly authoritySubstitute: ExecutiveDecisionRegisterPolicyAuthoritySubstitute | null;
  readonly inPlaceMutation: boolean;
  readonly historicalOverwrite: boolean;
  readonly historicalDeletion: boolean;
  readonly reopeningWithoutEvent: boolean;
  readonly privateReflectionAsDecisionRecord: boolean;
  readonly automaticPrivateReflectionPromotion: boolean;
  readonly crossCategoryConversionWithoutEvent: boolean;
  readonly activeDisputePresent: boolean;
  readonly challengedDecisionRef: string | null;
  readonly predecessorDecisionRef: string | null;
  readonly successorDecisionRef: string | null;
  readonly supersessionEffectivePoint: string | null;
  readonly closureMetadataPresent: boolean;
  readonly dispositionGovernanceEvidencePresent: boolean;
  readonly projectionSourceRegisterPresent: boolean;
  readonly projectionProvenancePresent: boolean;
  readonly projectionCreatesAuthority: boolean;
  readonly projectionHidesDispute: boolean;
  readonly projectionErasesLineage: boolean;
  readonly projectionNonAuthoritative: boolean;
  readonly retentionPolicyRef: string | null;
  readonly dispositionPolicyRef: string | null;
  readonly exportPolicyRef: string | null;
  readonly dualControlRequired: boolean;
}

/** Immutable obligation. */
export interface ExecutiveDecisionRegisterPolicyObligation {
  readonly obligationId: string;
  readonly kind: ExecutiveDecisionRegisterPolicyObligationKind;
  readonly description: string;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Confirmation requirement metadata. */
export interface ExecutiveDecisionRegisterPolicyConfirmationRequirement {
  readonly proposedEffect: string;
  readonly confirmingActor: string;
  readonly requiredAuthority: string;
  readonly evidenceToDisplay: readonly string[];
  readonly policyVersionRequired: true;
  readonly singleUseRequired: true;
  readonly expiryRequired: true;
  readonly dualControlRequired: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Discriminated policy decision. */
export interface ExecutiveDecisionRegisterPolicyDecision {
  readonly decision: ExecutiveDecisionRegisterPolicyDecisionKind;
  readonly decisionCode: string;
  readonly matchingRuleIds: readonly string[];
  readonly requestId: string;
  readonly actorRef: string;
  readonly authorityRef: string | null;
  readonly purpose: string | null;
  readonly operation: string;
  readonly targetId: string;
  readonly reason: string;
  readonly obligations: readonly ExecutiveDecisionRegisterPolicyObligation[];
  readonly validationOutcome: "Valid" | "Invalid" | "Missing";
  readonly validationReference: string | null;
  readonly policyId: "RTC-3:5/ExecutiveDecisionRegisterPolicy";
  readonly policyVersion: "1.0.0";
  readonly evidenceRefs: readonly string[];
  readonly confirmation: ExecutiveDecisionRegisterPolicyConfirmationRequirement | null;
  readonly revealsProtectedMetadata: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Policy identity descriptor. */
export interface ExecutiveDecisionRegisterPolicyIdentityDescriptor {
  readonly id: "RTC-3:5/ExecutiveDecisionRegisterPolicy";
  readonly name: "Executive Decision Register Policy";
  readonly phaseId: "RTC-3:5";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.decision.register.policy";
  readonly status: ExecutiveDecisionRegisterPolicyStatus;
  readonly readiness: ExecutiveDecisionRegisterPolicyReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Decision Register";
  readonly sourceValidation: "RTC-3:4/ExecutiveDecisionRegisterValidation";
  readonly upstream: "RTC-3:4 — Executive Decision Register Validation";
  readonly nextPhase: "RTC-3:6 — Executive Decision Register Enforcement";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic policy summary. */
export interface ExecutiveDecisionRegisterPolicySummary {
  readonly policyId: "RTC-3:5/ExecutiveDecisionRegisterPolicy";
  readonly version: "1.0.0";
  readonly name: "Executive Decision Register Policy";
  readonly namespace: "nexora.rtc.executive.decision.register.policy";
  readonly status: ExecutiveDecisionRegisterPolicyStatus;
  readonly readiness: ExecutiveDecisionRegisterPolicyReadiness;
  readonly ruleCount: number;
  readonly operationCount: number;
  readonly obligationKindCount: number;
  readonly openIssueCount: number;
  readonly decisionCount: number;
  readonly sourceValidation: "RTC-3:4/ExecutiveDecisionRegisterValidation";
  readonly nextPhase: "RTC-3:6 — Executive Decision Register Enforcement";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
