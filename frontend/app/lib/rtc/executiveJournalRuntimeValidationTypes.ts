/**
 * RTC-2:4 — Executive Journal Runtime Validation Types.
 *
 * Result, issue, severity, rule, and subject vocabularies.
 * Metadata-only declarations plus pure evaluation shapes.
 *
 * Ownership: owned exclusively by RTC-2:4.
 */

/** Validation status. */
export type ExecutiveJournalRuntimeValidationStatus = "Validation";

/** Immediate next-phase readiness (RTC-1:4 vocabulary). */
export type ExecutiveJournalRuntimeValidationReadiness = "ReadyForManifest";

/** RTC-1:4 severity vocabulary. */
export type ExecutiveJournalRuntimeValidationSeverity =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

/** Discriminated validation outcome. */
export type ExecutiveJournalRuntimeValidationOutcome = "Valid" | "Invalid";

/** Rule family names. */
export type ExecutiveJournalRuntimeValidationRuleFamily =
  | "Identity"
  | "Structure"
  | "AppendOnly"
  | "Provenance"
  | "Authority"
  | "Privacy"
  | "AiBoundary"
  | "Disclosure"
  | "Projection"
  | "Evidence"
  | "Telemetry";

/** Subject kinds under validation. */
export type ExecutiveJournalRuntimeValidationSubjectKind =
  | "Model"
  | "EntityDescriptor"
  | "EntityInstance"
  | "EntityCollection"
  | "RelationshipSet"
  | "TelemetryDescriptor";

/** Closed issue codes. */
export type ExecutiveJournalRuntimeValidationIssueCode =
  | "MalformedIdentity"
  | "UnknownNamespace"
  | "UnknownEntityKind"
  | "DuplicateEntityIdentity"
  | "MissingRequiredField"
  | "UnknownVocabularyValue"
  | "MissingProvenance"
  | "DerivedMarkedAuthoritative"
  | "MissingAuthorityRef"
  | "IncompleteDelegation"
  | "AuthoritySubstituteRejected"
  | "MissingAffectedReference"
  | "MissingPredecessor"
  | "InvalidDisputeTransition"
  | "PrivateReflectionInSharedProjection"
  | "AiConfirmDecision"
  | "AiCreateAuthority"
  | "AiCloseCommitment"
  | "AiDiscloseRestricted"
  | "AiAlterRetention"
  | "AiDisposeRecord"
  | "MissingDisclosurePolicyEvidence"
  | "DisclosureFailClosed"
  | "ProjectionMissingEvents"
  | "TelemetryContainsPayload"
  | "MissingDispositionEvidence"
  | "ModelInvariantBroken"
  | "UnknownField";

/** Immutable validation issue. */
export interface ExecutiveJournalRuntimeValidationIssue {
  readonly ruleId: string;
  readonly issueCode: ExecutiveJournalRuntimeValidationIssueCode;
  readonly severity: ExecutiveJournalRuntimeValidationSeverity;
  readonly subjectKind: ExecutiveJournalRuntimeValidationSubjectKind;
  readonly subjectId: string;
  readonly message: string;
  readonly field: string | null;
  readonly upstreamContract: string;
  readonly orderKey: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Discriminated validation result. */
export type ExecutiveJournalRuntimeValidationResult =
  | {
      readonly outcome: "Valid";
      readonly valid: true;
      readonly issues: readonly ExecutiveJournalRuntimeValidationIssue[];
      readonly errorCount: 0;
      readonly warningCount: number;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
    }
  | {
      readonly outcome: "Invalid";
      readonly valid: false;
      readonly issues: readonly ExecutiveJournalRuntimeValidationIssue[];
      readonly errorCount: number;
      readonly warningCount: number;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
    };

/** Instance subject for pure evaluation (not a persistence entity). */
export interface ExecutiveJournalRuntimeEntityInstance {
  readonly entityKind: string;
  readonly entityId: string;
  readonly fields: Readonly<Record<string, unknown>>;
}

/** Telemetry descriptor subject. */
export interface ExecutiveJournalRuntimeTelemetryDescriptor {
  readonly descriptorId: string;
  readonly fields: Readonly<Record<string, unknown>>;
}

/** Validation identity descriptor. */
export interface ExecutiveJournalRuntimeValidationIdentityDescriptor {
  readonly id: "RTC-2:4/ExecutiveJournalRuntimeValidation";
  readonly name: "Executive Journal Runtime Validation";
  readonly phaseId: "RTC-2:4";
  readonly version: "1.0.0";
  readonly namespace: "nexora.rtc.executive.journal.validation";
  readonly status: ExecutiveJournalRuntimeValidationStatus;
  readonly readiness: ExecutiveJournalRuntimeValidationReadiness;
  readonly layer: "Runtime Layer";
  readonly architecture: "NPA-T vNext";
  readonly domain: "Executive Journal Runtime";
  readonly sourceModel: "RTC-2:3/ExecutiveJournalRuntimeModel";
  readonly upstream: "RTC-2:3 — Executive Journal Runtime Model";
  readonly nextPhase: "RTC-2:5 — Executive Journal Runtime Policy";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic validation summary. */
export interface ExecutiveJournalRuntimeValidationSummary {
  readonly validationId: "RTC-2:4/ExecutiveJournalRuntimeValidation";
  readonly version: "1.0.0";
  readonly name: "Executive Journal Runtime Validation";
  readonly namespace: "nexora.rtc.executive.journal.validation";
  readonly status: ExecutiveJournalRuntimeValidationStatus;
  readonly readiness: ExecutiveJournalRuntimeValidationReadiness;
  readonly ruleCount: number;
  readonly familyCount: number;
  readonly openIssueCount: number;
  readonly sourceModel: "RTC-2:3/ExecutiveJournalRuntimeModel";
  readonly nextPhase: "RTC-2:5 — Executive Journal Runtime Policy";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
