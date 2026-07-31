/**
 * EX-2:4 — Executive Journal Experience Validation types.
 *
 * Closed, metadata-only contracts. No payload, runtime authority, repair,
 * mutation, environment access, or operational behavior.
 */

export type ExecutiveJournalExperienceValidationStatus = "Validation";
export type ExecutiveJournalExperienceValidationReadiness = "ReadyForManifest";
export type ExecutiveJournalExperienceValidationResultName = "Valid" | "Invalid";
export type ExecutiveJournalExperienceValidationSeverity =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

export type ExecutiveJournalExperienceValidationLifecycleState =
  | "Declared"
  | "UpstreamBound"
  | "RulesConstructed"
  | "Sealed"
  | "ReadyForManifest";

export type ExecutiveJournalExperienceValidationRuleFamily =
  | "Identity"
  | "Structure"
  | "EntityCatalogue"
  | "RelationshipCatalogue"
  | "Lifecycle"
  | "Vocabulary"
  | "MetadataBoundary"
  | "PrivacyBoundary"
  | "AuthorityBoundary"
  | "Provenance"
  | "CorrectionSupersession"
  | "Projection"
  | "FilterModel"
  | "Tier0EvidenceReference"
  | "Determinism"
  | "Immutability"
  | "DependencyBoundary";

export type ExecutiveJournalExperienceValidationSubjectKind =
  | "Model"
  | "Aggregate"
  | "Summary"
  | "Identity"
  | "Lifecycle"
  | "EntityCatalogue"
  | "ExecutiveJournalExperience"
  | "JournalProjection"
  | "JournalEntryList"
  | "JournalEntrySummary"
  | "JournalEntryDetail"
  | "EntryCategoryPresentation"
  | "LifecyclePresentation"
  | "OriginPresentation"
  | "AuthorityPresentation"
  | "IntegrityPresentation"
  | "ProvenancePresentation"
  | "CorrectionSupersessionPresentation"
  | "JournalFilterModel"
  | "Tier0EvidenceReference"
  | "RelationshipCatalogue"
  | "Relationship"
  | "Vocabulary"
  | "Contract"
  | "Boundary"
  | "Projection"
  | "FilterModel"
  | "Provenance"
  | "CorrectionSupersession"
  | "DependencyBoundary";

export type ExecutiveJournalExperienceValidationIssueCode =
  | "UnknownOrMalformedIdentity"
  | "IncompleteAggregate"
  | "IncompleteSummary"
  | "MissingEntity"
  | "DuplicateEntity"
  | "IncorrectEntityOrder"
  | "UnknownEntityKind"
  | "UnsafeEntityDescriptor"
  | "MissingRelationship"
  | "DuplicateRelationship"
  | "IncorrectRelationshipOrder"
  | "UnknownRelationshipKind"
  | "InvalidRelationshipEndpoints"
  | "LineageErasingRelationship"
  | "UnknownVocabularyValue"
  | "InvalidLifecycleMetadata"
  | "ForbiddenSensitiveSurface"
  | "PrivateReflectionSignal"
  | "EvidenceContent"
  | "AuthorityEvidenceContent"
  | "ActorPii"
  | "JurisdictionLocation"
  | "AuthorityCreatingMetadata"
  | "ConfirmationCreatingMetadata"
  | "OwnershipCreatingMetadata"
  | "DisclosurePermissionCreatingMetadata"
  | "LifecycleTruthCreatingMetadata"
  | "OperationalExecutableMetadata"
  | "MissingProvenanceReference"
  | "InvalidCorrectionSupersessionStructure"
  | "InvalidProjectionDescriptor"
  | "InvalidFilterDescriptor"
  | "InvalidTier0EvidenceReference"
  | "NonDeterministicMetadata"
  | "MutableDescriptor"
  | "ProhibitedDependency"
  | "NormalizationRepairAttempt"
  | "InputMutationAttempt"
  | "IncompleteValidationEvidence";

export type ExecutiveJournalExperienceValidationRuleKey =
  | "CanonicalIdentity"
  | "AggregateStructure"
  | "SummaryStructure"
  | "EntityCatalogueCompleteness"
  | "EntityDescriptorSafety"
  | "RelationshipCatalogueCompleteness"
  | "RelationshipDescriptorSafety"
  | "LifecycleMetadata"
  | "ClosedVocabularies"
  | "MetadataBoundary"
  | "PrivacyBoundary"
  | "AuthorityBoundary"
  | "ProvenanceReference"
  | "CorrectionSupersessionLineage"
  | "ProjectionDescriptor"
  | "FilterModelDescriptor"
  | "Tier0EvidenceReferenceDescriptor"
  | "DeterministicSurface"
  | "ImmutableSurface"
  | "DependencyBoundary";

export interface ExecutiveJournalExperienceValidationRuleDescriptor {
  readonly ruleId: `EX-2:4/Rule/${string}`;
  readonly ruleKey: ExecutiveJournalExperienceValidationRuleKey;
  readonly family: ExecutiveJournalExperienceValidationRuleFamily;
  readonly subject: ExecutiveJournalExperienceValidationSubjectKind;
  readonly order: number;
  readonly statement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveJournalExperienceValidationIssueDescriptor {
  readonly issueId: `EX-2:4/Issue/${ExecutiveJournalExperienceValidationIssueCode}`;
  readonly code: ExecutiveJournalExperienceValidationIssueCode;
  readonly severity: ExecutiveJournalExperienceValidationSeverity;
  readonly ruleId: `EX-2:4/Rule/${string}`;
  readonly ruleFamily: ExecutiveJournalExperienceValidationRuleFamily;
  readonly subject: ExecutiveJournalExperienceValidationSubjectKind;
  readonly detail: string;
  readonly order: number;
  readonly safeStructuralDetailOnly: true;
  readonly repairedInput: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveJournalExperienceValidationInput {
  readonly model: unknown;
  readonly aggregate: unknown;
  readonly summary: unknown;
  readonly identity: unknown;
  readonly lifecycle: unknown;
  readonly entities: unknown;
  readonly relationships: unknown;
  readonly vocabularies: unknown;
  readonly contracts: unknown;
  readonly boundaries: unknown;
  readonly projection: unknown;
  readonly filterModel: unknown;
  readonly tier0EvidenceReference: unknown;
  readonly provenance: unknown;
  readonly correctionSupersession: unknown;
  readonly dependencyDeclaration: unknown;
  readonly validationEvidence: unknown;
  readonly normalizationRequested: unknown;
  readonly repairRequested: unknown;
  readonly coercionRequested: unknown;
  readonly silentStrippingRequested: unknown;
  readonly mutationRequested: unknown;
}

interface ExecutiveJournalExperienceValidationResultBase {
  readonly validationId: "EX-2:4/ExecutiveJournalExperienceValidation";
  readonly issueCount: number;
  readonly issues: readonly ExecutiveJournalExperienceValidationIssueDescriptor[];
  readonly confirmsMetadataConformanceOnly: true;
  readonly productionAuthorized: false;
  readonly integrationAuthorized: false;
  readonly uiAuthorized: false;
  readonly routeAuthorized: false;
  readonly disclosureAuthorized: false;
  readonly rtcConsumptionAuthorized: false;
  readonly deploymentAuthorized: false;
  readonly repairedInput: false;
  readonly mutatedInput: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveJournalExperienceValidationValidResult
  extends ExecutiveJournalExperienceValidationResultBase {
  readonly result: "Valid";
  readonly valid: true;
  readonly issueCount: 0;
  readonly issues: readonly [];
}

export interface ExecutiveJournalExperienceValidationInvalidResult
  extends ExecutiveJournalExperienceValidationResultBase {
  readonly result: "Invalid";
  readonly valid: false;
  readonly issueCount: number;
  readonly issues: readonly ExecutiveJournalExperienceValidationIssueDescriptor[];
}

export type ExecutiveJournalExperienceValidationResult =
  | ExecutiveJournalExperienceValidationValidResult
  | ExecutiveJournalExperienceValidationInvalidResult;

export interface ExecutiveJournalExperienceValidationSummary {
  readonly identity: "EX-2:4/ExecutiveJournalExperienceValidation";
  readonly namespace: "nexora.ex.executive.journal.experience.validation";
  readonly status: "Validation";
  readonly readiness: "ReadyForManifest";
  readonly previousPhase: "EX-2:3 — Executive Journal Experience Model";
  readonly nextPhase: "EX-2:5 — Executive Journal Experience Manifest";
  readonly resultCount: 2;
  readonly severityCount: 4;
  readonly ruleCount: 20;
  readonly ruleFamilyCount: 17;
  readonly subjectKindCount: 30;
  readonly issueCodeCount: 39;
  readonly contractCount: 8;
  readonly decisionCount: 6;
  readonly openIssueCount: 13;
  readonly pendingGateCount: 3;
  readonly upstreamChain: readonly [
    "EX-2:4/ExecutiveJournalExperienceValidation",
    "EX-2:3/ExecutiveJournalExperienceModel",
    "EX-2:2/ExecutiveJournalExperienceRegistry",
    "EX-2:1/ExecutiveJournalExperienceFoundation",
  ];
  readonly authorizationDecisionId: "AD-EX2-12";
  readonly metadataOnly: true;
  readonly sideEffectFree: true;
  readonly deterministic: true;
  readonly failClosed: true;
  readonly repairsInput: false;
  readonly mutatesInput: false;
  readonly ex25Created: false;
  readonly ex25Authorized: false;
  readonly ciLintClassification: "CiStillBlockedByParkedReactCompilerDebt";
}
