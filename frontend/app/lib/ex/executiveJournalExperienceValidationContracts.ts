/**
 * EX-2:4 — closed validation vocabularies and immutable contracts.
 */

import type {
  ExecutiveJournalExperienceValidationIssueCode,
  ExecutiveJournalExperienceValidationResultName,
  ExecutiveJournalExperienceValidationRuleKey,
  ExecutiveJournalExperienceValidationSeverity,
  ExecutiveJournalExperienceValidationSubjectKind,
} from "./executiveJournalExperienceValidationTypes.ts";

export const ExecutiveJournalExperienceValidationResults = Object.freeze([
  "Valid",
  "Invalid",
] as const satisfies readonly ExecutiveJournalExperienceValidationResultName[]);

export const ExecutiveJournalExperienceValidationSeverities = Object.freeze([
  "Info",
  "Warning",
  "Error",
  "Critical",
] as const satisfies readonly ExecutiveJournalExperienceValidationSeverity[]);

export const ExecutiveJournalExperienceValidationSubjectKinds = Object.freeze([
  "Model",
  "Aggregate",
  "Summary",
  "Identity",
  "Lifecycle",
  "EntityCatalogue",
  "ExecutiveJournalExperience",
  "JournalProjection",
  "JournalEntryList",
  "JournalEntrySummary",
  "JournalEntryDetail",
  "EntryCategoryPresentation",
  "LifecyclePresentation",
  "OriginPresentation",
  "AuthorityPresentation",
  "IntegrityPresentation",
  "ProvenancePresentation",
  "CorrectionSupersessionPresentation",
  "JournalFilterModel",
  "Tier0EvidenceReference",
  "RelationshipCatalogue",
  "Relationship",
  "Vocabulary",
  "Contract",
  "Boundary",
  "Projection",
  "FilterModel",
  "Provenance",
  "CorrectionSupersession",
  "DependencyBoundary",
] as const satisfies readonly ExecutiveJournalExperienceValidationSubjectKind[]);

type IssueCodeDefinition = Readonly<{
  code: ExecutiveJournalExperienceValidationIssueCode;
  severity: ExecutiveJournalExperienceValidationSeverity;
  ruleKey: ExecutiveJournalExperienceValidationRuleKey;
  order: number;
}>;

export const ExecutiveJournalExperienceValidationIssueCodes = Object.freeze(([
  { code: "UnknownOrMalformedIdentity", severity: "Critical", ruleKey: "CanonicalIdentity", order: 1 },
  { code: "IncompleteAggregate", severity: "Critical", ruleKey: "AggregateStructure", order: 2 },
  { code: "IncompleteSummary", severity: "Error", ruleKey: "SummaryStructure", order: 3 },
  { code: "MissingEntity", severity: "Error", ruleKey: "EntityCatalogueCompleteness", order: 4 },
  { code: "DuplicateEntity", severity: "Error", ruleKey: "EntityCatalogueCompleteness", order: 5 },
  { code: "IncorrectEntityOrder", severity: "Error", ruleKey: "EntityCatalogueCompleteness", order: 6 },
  { code: "UnknownEntityKind", severity: "Critical", ruleKey: "EntityCatalogueCompleteness", order: 7 },
  { code: "UnsafeEntityDescriptor", severity: "Critical", ruleKey: "EntityDescriptorSafety", order: 8 },
  { code: "MissingRelationship", severity: "Error", ruleKey: "RelationshipCatalogueCompleteness", order: 9 },
  { code: "DuplicateRelationship", severity: "Error", ruleKey: "RelationshipCatalogueCompleteness", order: 10 },
  { code: "IncorrectRelationshipOrder", severity: "Error", ruleKey: "RelationshipCatalogueCompleteness", order: 11 },
  { code: "UnknownRelationshipKind", severity: "Critical", ruleKey: "RelationshipCatalogueCompleteness", order: 12 },
  { code: "InvalidRelationshipEndpoints", severity: "Critical", ruleKey: "RelationshipDescriptorSafety", order: 13 },
  { code: "LineageErasingRelationship", severity: "Critical", ruleKey: "RelationshipDescriptorSafety", order: 14 },
  { code: "UnknownVocabularyValue", severity: "Error", ruleKey: "ClosedVocabularies", order: 15 },
  { code: "InvalidLifecycleMetadata", severity: "Error", ruleKey: "LifecycleMetadata", order: 16 },
  { code: "ForbiddenSensitiveSurface", severity: "Critical", ruleKey: "MetadataBoundary", order: 17 },
  { code: "PrivateReflectionSignal", severity: "Critical", ruleKey: "PrivacyBoundary", order: 18 },
  { code: "EvidenceContent", severity: "Critical", ruleKey: "PrivacyBoundary", order: 19 },
  { code: "AuthorityEvidenceContent", severity: "Critical", ruleKey: "PrivacyBoundary", order: 20 },
  { code: "ActorPii", severity: "Critical", ruleKey: "PrivacyBoundary", order: 21 },
  { code: "JurisdictionLocation", severity: "Critical", ruleKey: "PrivacyBoundary", order: 22 },
  { code: "AuthorityCreatingMetadata", severity: "Critical", ruleKey: "AuthorityBoundary", order: 23 },
  { code: "ConfirmationCreatingMetadata", severity: "Critical", ruleKey: "AuthorityBoundary", order: 24 },
  { code: "OwnershipCreatingMetadata", severity: "Critical", ruleKey: "AuthorityBoundary", order: 25 },
  { code: "DisclosurePermissionCreatingMetadata", severity: "Critical", ruleKey: "AuthorityBoundary", order: 26 },
  { code: "LifecycleTruthCreatingMetadata", severity: "Critical", ruleKey: "AuthorityBoundary", order: 27 },
  { code: "OperationalExecutableMetadata", severity: "Critical", ruleKey: "MetadataBoundary", order: 28 },
  { code: "MissingProvenanceReference", severity: "Error", ruleKey: "ProvenanceReference", order: 29 },
  { code: "InvalidCorrectionSupersessionStructure", severity: "Error", ruleKey: "CorrectionSupersessionLineage", order: 30 },
  { code: "InvalidProjectionDescriptor", severity: "Error", ruleKey: "ProjectionDescriptor", order: 31 },
  { code: "InvalidFilterDescriptor", severity: "Error", ruleKey: "FilterModelDescriptor", order: 32 },
  { code: "InvalidTier0EvidenceReference", severity: "Error", ruleKey: "Tier0EvidenceReferenceDescriptor", order: 33 },
  { code: "NonDeterministicMetadata", severity: "Critical", ruleKey: "DeterministicSurface", order: 34 },
  { code: "MutableDescriptor", severity: "Critical", ruleKey: "ImmutableSurface", order: 35 },
  { code: "ProhibitedDependency", severity: "Critical", ruleKey: "DependencyBoundary", order: 36 },
  { code: "NormalizationRepairAttempt", severity: "Critical", ruleKey: "MetadataBoundary", order: 37 },
  { code: "InputMutationAttempt", severity: "Critical", ruleKey: "ImmutableSurface", order: 38 },
  { code: "IncompleteValidationEvidence", severity: "Error", ruleKey: "AggregateStructure", order: 39 },
] as const satisfies readonly IssueCodeDefinition[]).map((definition) =>
  Object.freeze(definition)
));

export const ExecutiveJournalExperienceValidationContracts = Object.freeze([
  { contractId: "EX-2:4/Contract/ValidationInput", subject: "Validation input is unknown, read-only, and never normalized or repaired." },
  { contractId: "EX-2:4/Contract/ValidationRule", subject: "Rules are closed, ordered, pure, deterministic metadata." },
  { contractId: "EX-2:4/Contract/ValidationSubject", subject: "Subjects use a closed vocabulary and unknown subjects fail closed." },
  { contractId: "EX-2:4/Contract/ValidationIssue", subject: "Issues preserve rule and subject identity and contain safe structural detail only." },
  { contractId: "EX-2:4/Contract/ValidResult", subject: "Valid confirms metadata conformance only and creates no authority." },
  { contractId: "EX-2:4/Contract/InvalidResult", subject: "Invalid contains deterministic issues and no repaired input." },
  { contractId: "EX-2:4/Contract/ValidationSummary", subject: "Summary contains counts and control metadata but no payload content." },
  { contractId: "EX-2:4/Contract/BoundaryDeclaration", subject: "Validation creates no ownership, authority, operation, integration, or production authorization." },
].map((contract, index) =>
  Object.freeze({
    ...contract,
    order: index + 1,
    pure: true as const,
    repairsInput: false as const,
    mutatesInput: false as const,
    closedVocabularies: true as const,
    deterministicIssueOrdering: true as const,
    safeIssueDetailsOnly: true as const,
    authorityCreation: false as const,
    ownershipCreation: false as const,
    operationalEffects: false as const,
    productionAuthorization: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })
));

const isMember = <T extends string>(
  catalogue: readonly T[],
  value: unknown,
): value is T =>
  typeof value === "string" && catalogue.some((candidate) => candidate === value);

export const isExecutiveJournalExperienceValidationResult = (
  value: unknown,
): value is ExecutiveJournalExperienceValidationResultName =>
  isMember(ExecutiveJournalExperienceValidationResults, value);

export const isExecutiveJournalExperienceValidationSeverity = (
  value: unknown,
): value is ExecutiveJournalExperienceValidationSeverity =>
  isMember(ExecutiveJournalExperienceValidationSeverities, value);

export const isExecutiveJournalExperienceValidationSubjectKind = (
  value: unknown,
): value is ExecutiveJournalExperienceValidationSubjectKind =>
  isMember(ExecutiveJournalExperienceValidationSubjectKinds, value);

export const isExecutiveJournalExperienceValidationIssueCode = (
  value: unknown,
): value is ExecutiveJournalExperienceValidationIssueCode =>
  typeof value === "string"
  && ExecutiveJournalExperienceValidationIssueCodes.some(
    (definition) => definition.code === value,
  );

export const assertExecutiveJournalExperienceValidationSubjectKind = (
  value: unknown,
): ExecutiveJournalExperienceValidationSubjectKind => {
  if (!isExecutiveJournalExperienceValidationSubjectKind(value)) {
    throw new Error("Unknown EX-2:4 validation subject kind.");
  }
  return value;
};

export const assertExecutiveJournalExperienceValidationIssueCode = (
  value: unknown,
): ExecutiveJournalExperienceValidationIssueCode => {
  if (!isExecutiveJournalExperienceValidationIssueCode(value)) {
    throw new Error("Unknown EX-2:4 validation issue code.");
  }
  return value;
};
