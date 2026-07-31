/**
 * EX-2:3 — Executive Journal Experience Model contracts and relationships.
 */

import type {
  ExecutiveJournalExperienceModelEntityKind,
  ExecutiveJournalExperienceModelRelationshipDescriptor,
  ExecutiveJournalExperienceModelRelationshipKind,
} from "./executiveJournalExperienceModelTypes.ts";

export const ExecutiveJournalExperienceModelVocabularies = Object.freeze({
  projectionAvailability: Object.freeze([
    "Available",
    "Empty",
    "Denied",
    "Unavailable",
    "Stale",
    "Invalid",
  ] as const),
  presentationState: Object.freeze([
    "Loading",
    "Ready",
    "Empty",
    "NotFound",
    "PrivacyRejected",
    "UnsupportedVersion",
    "IntegrityUnavailable",
    "ProviderUnavailable",
    "Failure",
  ] as const),
  entryCategory: Object.freeze([
    "Commitment",
    "Risk",
    "Exception",
    "Outcome",
    "Control",
    "General",
  ] as const),
  lifecycle: Object.freeze([
    "Proposed",
    "Accepted",
    "Disputed",
    "Superseded",
    "Closed",
    "Disposed",
  ] as const),
  origin: Object.freeze([
    "HumanOrigin",
    "AiProposed",
    "SystemDerived",
  ] as const),
  authority: Object.freeze(["Present", "Absent", "Unavailable"] as const),
  integrity: Object.freeze(["Verified", "Failed", "Unavailable"] as const),
  referencePresence: Object.freeze(["Present", "Absent"] as const),
  filterState: Object.freeze(["All", "Filtered", "NoMatches"] as const),
  sourceClassification: Object.freeze([
    "SyntheticSourceOnly",
    "ProductionSourceNotIntegrated",
  ] as const),
  tier0EvidenceClassification: Object.freeze([
    "SyntheticTier0SupportingEvidenceOnly",
  ] as const),
});

export type ExecutiveJournalExperienceModelVocabularyName =
  keyof typeof ExecutiveJournalExperienceModelVocabularies;

export const isExecutiveJournalExperienceModelVocabularyValue = (
  vocabulary: unknown,
  value: unknown,
): boolean => {
  if (
    typeof vocabulary !== "string"
    || typeof value !== "string"
    || value !== value.trim()
    || !Object.prototype.hasOwnProperty.call(
      ExecutiveJournalExperienceModelVocabularies,
      vocabulary,
    )
  ) {
    return false;
  }
  const values =
    ExecutiveJournalExperienceModelVocabularies[
      vocabulary as ExecutiveJournalExperienceModelVocabularyName
    ] as readonly string[];
  return values.some((candidate) => candidate === value);
};

export const assertExecutiveJournalExperienceModelVocabularyValue = (
  vocabulary: unknown,
  value: unknown,
): string => {
  if (!isExecutiveJournalExperienceModelVocabularyValue(vocabulary, value)) {
    throw new Error(`Unknown EX-2:3 model vocabulary value: ${vocabulary}/${value}`);
  }
  return value as string;
};

const relationship = (
  kind: ExecutiveJournalExperienceModelRelationshipKind,
  from: ExecutiveJournalExperienceModelEntityKind,
  to: ExecutiveJournalExperienceModelEntityKind,
  cardinality: "OneToOne" | "OneToMany" | "OptionalOne",
  description: string,
  order: number,
): ExecutiveJournalExperienceModelRelationshipDescriptor =>
  Object.freeze({
    relationshipId: `EX-2:3/Relationship/${kind}` as const,
    kind,
    from,
    to,
    cardinality,
    description,
    order,
    authorityCreating: false as const,
    ownershipCreating: false as const,
    confirmationCreating: false as const,
    disclosurePermissionCreating: false as const,
    lifecycleTruthCreating: false as const,
    lineageErasing: false as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveJournalExperienceModelRelationships = Object.freeze([
  relationship(
    "ExperienceContainsProjection",
    "ExecutiveJournalExperience",
    "JournalProjection",
    "OneToOne",
    "Experience contains its metadata projection.",
    1,
  ),
  relationship(
    "ProjectionContainsEntryList",
    "JournalProjection",
    "JournalEntryList",
    "OneToOne",
    "Projection contains the entry-list presentation.",
    2,
  ),
  relationship(
    "EntryListContainsSummaries",
    "JournalEntryList",
    "JournalEntrySummary",
    "OneToMany",
    "Entry list contains allowlisted summaries.",
    3,
  ),
  relationship(
    "SelectedSummaryPresentsDetail",
    "JournalEntrySummary",
    "JournalEntryDetail",
    "OptionalOne",
    "A selected summary may present one read-only detail.",
    4,
  ),
  relationship("DetailPresentsCategory", "JournalEntryDetail", "EntryCategoryPresentation", "OneToOne", "Detail presents an EX-owned category label.", 5),
  relationship("DetailPresentsLifecycle", "JournalEntryDetail", "LifecyclePresentation", "OneToOne", "Detail presents lifecycle metadata.", 6),
  relationship("DetailPresentsOrigin", "JournalEntryDetail", "OriginPresentation", "OneToOne", "Detail presents origin metadata.", 7),
  relationship("DetailPresentsAuthority", "JournalEntryDetail", "AuthorityPresentation", "OneToOne", "Detail presents descriptive coarse authority state.", 8),
  relationship("DetailPresentsIntegrity", "JournalEntryDetail", "IntegrityPresentation", "OneToOne", "Detail presents integrity metadata.", 9),
  relationship("DetailPresentsProvenance", "JournalEntryDetail", "ProvenancePresentation", "OptionalOne", "Detail may present an opaque provenance reference.", 10),
  relationship("DetailPresentsCorrectionSupersession", "JournalEntryDetail", "CorrectionSupersessionPresentation", "OptionalOne", "Detail may present opaque correction or supersession lineage.", 11),
  relationship("FilterConstrainsEntryList", "JournalFilterModel", "JournalEntryList", "OneToOne", "Filter model constrains allowlisted list presentation only.", 12),
  relationship("Tier0EvidenceSupportsModelProvenance", "Tier0EvidenceReference", "ExecutiveJournalExperience", "OptionalOne", "Tier-0 evidence supports provenance without completing a formal phase.", 13),
] as const satisfies readonly ExecutiveJournalExperienceModelRelationshipDescriptor[]);

export const getExecutiveJournalExperienceModelRelationship = (
  kind: unknown,
): ExecutiveJournalExperienceModelRelationshipDescriptor | null => {
  if (typeof kind !== "string" || kind !== kind.trim()) {
    return null;
  }
  return ExecutiveJournalExperienceModelRelationships.find(
    (descriptor) => descriptor.kind === kind,
  ) ?? null;
};

export const ExecutiveJournalExperienceModelContracts = Object.freeze([
  Object.freeze({
    contractId: "EX-2:3/Contract/MetadataOnlyProjection" as const,
    statement: "Projection fields describe presentation metadata and cannot create authoritative facts." as const,
  }),
  Object.freeze({
    contractId: "EX-2:3/Contract/ReadOnlyPresentation" as const,
    statement: "List, selection, detail, and filters are read-only presentation contracts." as const,
  }),
  Object.freeze({
    contractId: "EX-2:3/Contract/OpaqueReferences" as const,
    statement: "References remain opaque and are never resolved to payload content by this model." as const,
  }),
  Object.freeze({
    contractId: "EX-2:3/Contract/DescriptiveAuthority" as const,
    statement: "Authority presentation is coarse and descriptive only." as const,
  }),
  Object.freeze({
    contractId: "EX-2:3/Contract/PrivacyExclusion" as const,
    statement: "Private-reflection signals, evidence payloads, and actor identity data are excluded." as const,
  }),
  Object.freeze({
    contractId: "EX-2:3/Contract/LineagePreservation" as const,
    statement: "Correction and supersession references preserve lineage without mutation." as const,
  }),
  Object.freeze({
    contractId: "EX-2:3/Contract/AllowlistedFilters" as const,
    statement: "Filters operate only on allowlisted category and lifecycle presentation metadata." as const,
  }),
  Object.freeze({
    contractId: "EX-2:3/Contract/Tier0EvidenceReferenceOnly" as const,
    statement: "Tier-0 evidence preserves exact identity only and never completes a formal phase." as const,
  }),
].map((descriptor, index) =>
  Object.freeze({
    ...descriptor,
    order: index + 1,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })
));
