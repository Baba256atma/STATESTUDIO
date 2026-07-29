/**
 * RTC-3:4 — Executive Decision Register Validation Types.
 *
 * Result, issue, severity, rule, and subject vocabularies.
 * Metadata-only declarations plus pure evaluation shapes.
 *
 * Ownership: owned exclusively by RTC-3:4.
 */

/** Validation status. */
export type ExecutiveDecisionRegisterValidationStatus = "Validation";

/** Immediate next-phase readiness. */
export type ExecutiveDecisionRegisterValidationReadiness = "ReadyForPolicy";

/** Severity vocabulary (RTC-1:4 / RTC-2:4 catalogue). */
export type ExecutiveDecisionRegisterValidationSeverity =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

/** Discriminated validation outcome. */
export type ExecutiveDecisionRegisterValidationOutcome = "Valid" | "Invalid";

/** Rule family names. */
export type ExecutiveDecisionRegisterValidationRuleFamily =
  | "Identity"
  | "Structure"
  | "Lifecycle"
  | "AppendOnly"
  | "Provenance"
  | "Authority"
  | "Confirmation"
  | "Privacy"
  | "AiBoundary"
  | "Projection"
  | "Evidence"
  | "Disposition"
  | "Telemetry";

/** Subject kinds under validation. */
export type ExecutiveDecisionRegisterValidationSubjectKind =
  | "Model"
  | "EntityDescriptor"
  | "EntityInstance"
  | "EntityCollection"
  | "Relationship"
  | "RelationshipSet"
  | "DecisionRegister"
  | "DecisionRecord"
  | "DecisionProposal"
  | "DecisionAuthority"
  | "DecisionConfirmation"
  | "DecisionAlternative"
  | "DecisionConstraint"
  | "DecisionEvidence"
  | "DecisionCorrection"
  | "DecisionDispute"
  | "DecisionSupersession"
  | "DecisionOutcomeReference"
  | "DecisionProjection"
  | "DecisionDisposition"
  | "TelemetryDescriptor";

/** Closed issue codes. */
export type ExecutiveDecisionRegisterValidationIssueCode =
  | "MalformedIdentity"
  | "UnknownNamespace"
  | "UnknownEntityKind"
  | "UnknownSubjectKind"
  | "DuplicateEntityIdentity"
  | "MissingRequiredField"
  | "UnknownVocabularyValue"
  | "UnknownField"
  | "UnknownRelationshipKind"
  | "MissingProvenance"
  | "MissingDerivationVersion"
  | "DerivedMarkedAuthoritative"
  | "MissingAuthorityRef"
  | "IncompleteDelegation"
  | "RevokedDelegation"
  | "ExpiredDelegation"
  | "AuthoritySubstituteRejected"
  | "MissingHumanConfirmation"
  | "ConfirmationMismatch"
  | "AiConfirmationRejected"
  | "ProposedMarkedAuthoritative"
  | "EffectiveWithoutConfirmedAuthority"
  | "MissingChallengedReference"
  | "MissingDisputeReference"
  | "MissingPredecessor"
  | "MissingSuccessor"
  | "CircularSupersession"
  | "MissingClosureMetadata"
  | "MissingDispositionEvidence"
  | "DisposedToActiveReversal"
  | "MissingAffectedReference"
  | "MissingOriginalReference"
  | "MissingProducingEvent"
  | "MissingOutcomeReference"
  | "UnknownEvidenceCategory"
  | "MissingEvidenceVersion"
  | "MissingEvidenceDigest"
  | "PrivateReflectionAsDecisionRecord"
  | "MissingClassification"
  | "ProjectionMissingEvents"
  | "ProjectionCreatesAuthority"
  | "ProjectionHidesDispute"
  | "AiConfirmDecision"
  | "AiCreateAuthority"
  | "AiMakeAuthoritative"
  | "AiResolveDispute"
  | "AiSupersedeDecision"
  | "AiCloseDecision"
  | "AiDiscloseRestricted"
  | "AiChangeRetention"
  | "AiDisposeRecord"
  | "AiSatisfyConfirmation"
  | "TelemetryContainsPayload"
  | "ModelInvariantBroken"
  | "UpstreamNotReady"
  | "MissingReopenEvent"
  | "MissingActorRef"
  | "MissingPurpose"
  | "MissingAuthorityScope"
  | "MissingAuthorityEvidence"
  | "UnauthorizedConfirmer"
  | "SystemDerivedConfirmer"
  | "MissingConfirmationIdentity"
  | "MissingSingleUse"
  | "MissingPolicyVersion"
  | "InPlaceReplacement"
  | "MissingChallengedEvent"
  | "DisputeErased"
  | "MissingInitiator"
  | "MissingBasis"
  | "MissingReviewOwner"
  | "MissingResolutionAuthority"
  | "MissingResolutionEvidence"
  | "MissingEffectivePoint"
  | "MissingSupersessionAuthority"
  | "MissingSupersessionEvidence"
  | "MissingEvidenceIdentity"
  | "MissingEvidenceType"
  | "MissingAvailabilityState"
  | "MissingIntegrityRequirement"
  | "MissingSourceRegister"
  | "MissingEventVersionOrSequence"
  | "AutomaticPromotion"
  | "CrossCategoryConversion"
  | "MissingDispositionActor"
  | "MissingDispositionAuthority"
  | "HistoricalErasure"
  | "ProjectionMissingIdentity"
  | "ProjectionMissingSourceRegister"
  | "ProjectionMissingSequence"
  | "ProjectionMissingStaleness"
  | "ProjectionMissingAuthorityLimitations"
  | "ProjectionConfirmsDecisions"
  | "ProjectionErasesLineage"
  | "UnknownPrivacyCategory"
  | "MissingOrderingMetadata"
  | "EntityKindMismatch"
  | "AiBroadenAuthority";

/** Immutable validation issue. */
export interface ExecutiveDecisionRegisterValidationIssue {
  readonly ruleId: string;
  readonly issueCode: ExecutiveDecisionRegisterValidationIssueCode;
  readonly severity: ExecutiveDecisionRegisterValidationSeverity;
  readonly subjectKind: ExecutiveDecisionRegisterValidationSubjectKind;
  readonly subjectId: string;
  readonly message: string;
  readonly field: string | null;
  readonly expected: string | null;
  readonly observed: string | null;
  readonly upstreamContract: string;
  readonly orderKey: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Discriminated validation result. */
export type ExecutiveDecisionRegisterValidationResult =
  | {
      readonly outcome: "Valid";
      readonly valid: true;
      readonly issues: readonly ExecutiveDecisionRegisterValidationIssue[];
      readonly errorCount: 0;
      readonly warningCount: number;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
    }
  | {
      readonly outcome: "Invalid";
      readonly valid: false;
      readonly issues: readonly ExecutiveDecisionRegisterValidationIssue[];
      readonly errorCount: number;
      readonly warningCount: number;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
    };

/** Instance subject for pure evaluation (not a persistence entity). */
export interface ExecutiveDecisionRegisterEntityInstance {
  readonly entityKind: string;
  readonly entityId: string;
  readonly fields: Readonly<Record<string, unknown>>;
}

/** Relationship subject for pure evaluation. */
export interface ExecutiveDecisionRegisterRelationshipInstance {
  readonly relationshipKind: string;
  readonly relationshipId: string;
  readonly fromRef: string;
  readonly toRef: string;
  readonly fields?: Readonly<Record<string, unknown>>;
}

/** Telemetry descriptor subject. */
export interface ExecutiveDecisionRegisterTelemetryDescriptor {
  readonly descriptorId: string;
  readonly fields: Readonly<Record<string, unknown>>;
}

/** Validation identity descriptor. */
export interface ExecutiveDecisionRegisterValidationIdentityDescriptor {
  readonly id: "RTC-3:4/ExecutiveDecisionRegisterValidation";
  readonly name: "Executive Decision Register Validation";
  readonly phaseId: "RTC-3:4";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.decision.register.validation";
  readonly status: ExecutiveDecisionRegisterValidationStatus;
  readonly readiness: ExecutiveDecisionRegisterValidationReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Decision Register";
  readonly sourceModel: "RTC-3:3/ExecutiveDecisionRegisterModel";
  readonly upstream: "RTC-3:3 — Executive Decision Register Model";
  readonly nextPhase: "RTC-3:5 — Executive Decision Register Policy";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic validation summary. */
export interface ExecutiveDecisionRegisterValidationSummary {
  readonly validationId: "RTC-3:4/ExecutiveDecisionRegisterValidation";
  readonly version: "1.0.0";
  readonly name: "Executive Decision Register Validation";
  readonly namespace: "nexora.rtc.executive.decision.register.validation";
  readonly status: ExecutiveDecisionRegisterValidationStatus;
  readonly readiness: ExecutiveDecisionRegisterValidationReadiness;
  readonly ruleCount: number;
  readonly familyCount: number;
  readonly openIssueCount: number;
  readonly sourceModel: "RTC-3:3/ExecutiveDecisionRegisterModel";
  readonly nextPhase: "RTC-3:5 — Executive Decision Register Policy";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
