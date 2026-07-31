/**
 * EX-2:3 — Executive Journal Experience Model entities.
 *
 * Fourteen canonical EX-owned presentation/consumer descriptors. They contain
 * field structure only and never journal payloads or operational behavior.
 */

import type {
  ExecutiveJournalExperienceModelEntityDescriptor,
  ExecutiveJournalExperienceModelEntityKind,
  ExecutiveJournalExperienceModelFieldDescriptor,
  ExecutiveJournalExperienceModelFieldValueKind,
} from "./executiveJournalExperienceModelTypes.ts";

const field = (
  entityKind: ExecutiveJournalExperienceModelEntityKind,
  fieldName: string,
  valueKind: ExecutiveJournalExperienceModelFieldValueKind,
  order: number,
  required = true,
  opaqueReference = false,
): ExecutiveJournalExperienceModelFieldDescriptor =>
  Object.freeze({
    fieldId: `EX-2:3/Entity/${entityKind}/Field/${fieldName}` as const,
    fieldName,
    valueKind,
    required,
    opaqueReference,
    allowlistedPresentationMetadataOnly: true as const,
    mutable: false as const,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

const entity = (
  kind: ExecutiveJournalExperienceModelEntityKind,
  description: string,
  fields: readonly ExecutiveJournalExperienceModelFieldDescriptor[],
  order: number,
  root = false,
): ExecutiveJournalExperienceModelEntityDescriptor =>
  Object.freeze({
    entityId: `EX-2:3/Entity/${kind}` as const,
    kind,
    description,
    root,
    order,
    fields: Object.freeze([...fields]),
    fieldCount: fields.length,
    owner: "EX" as const,
    ownership: "PresentationConsumer" as const,
    narrativePayloadAllowed: false as const,
    authorityCreationAllowed: false as const,
    mutationCommandsAllowed: false as const,
    storesRuntimeValues: false as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

export const ExecutiveJournalExperienceEntity = entity(
  "ExecutiveJournalExperience",
  "Root descriptor coordinating the read-only Executive Journal presentation model.",
  [
    field(
      "ExecutiveJournalExperience",
      "experience_ref",
      "OpaqueReference",
      1,
      true,
      true,
    ),
    field(
      "ExecutiveJournalExperience",
      "projection",
      "MetadataCollection",
      2,
    ),
    field(
      "ExecutiveJournalExperience",
      "filter_model",
      "MetadataCollection",
      3,
    ),
    field(
      "ExecutiveJournalExperience",
      "tier0_evidence_reference",
      "OpaqueReference",
      4,
      false,
      true,
    ),
  ],
  1,
  true,
);

export const JournalProjectionEntity = entity(
  "JournalProjection",
  "Non-authoritative metadata projection with availability, schema, source, and list presentation.",
  [
    field("JournalProjection", "availability", "ClosedVocabulary", 1),
    field("JournalProjection", "projection_schema_version", "PresentationLabel", 2),
    field("JournalProjection", "source_classification", "ClosedVocabulary", 3),
    field("JournalProjection", "entry_list", "MetadataCollection", 4),
  ],
  2,
);

export const JournalEntryListEntity = entity(
  "JournalEntryList",
  "Ordered presentation collection of shared-eligible metadata summaries.",
  [
    field("JournalEntryList", "presentation_state", "ClosedVocabulary", 1),
    field("JournalEntryList", "summaries", "MetadataCollection", 2),
    field(
      "JournalEntryList",
      "selected_summary_ref",
      "OpaqueReference",
      3,
      false,
      true,
    ),
  ],
  3,
);

export const JournalEntrySummaryEntity = entity(
  "JournalEntrySummary",
  "Allowlisted read-only entry metadata used for list and selection presentation.",
  [
    field("JournalEntrySummary", "entry_ref", "OpaqueReference", 1, true, true),
    field("JournalEntrySummary", "entry_category", "ClosedVocabulary", 2),
    field("JournalEntrySummary", "lifecycle_state", "ClosedVocabulary", 3),
    field("JournalEntrySummary", "origin_classification", "ClosedVocabulary", 4),
    field("JournalEntrySummary", "authority_state", "ClosedVocabulary", 5),
    field("JournalEntrySummary", "integrity_state", "ClosedVocabulary", 6),
    field("JournalEntrySummary", "selected", "MetadataBoolean", 7),
  ],
  4,
);

export const JournalEntryDetailEntity = entity(
  "JournalEntryDetail",
  "Read-only detail composition containing presentation metadata and opaque lineage references only.",
  [
    field("JournalEntryDetail", "summary_ref", "OpaqueReference", 1, true, true),
    field("JournalEntryDetail", "category_presentation", "MetadataCollection", 2),
    field("JournalEntryDetail", "lifecycle_presentation", "MetadataCollection", 3),
    field("JournalEntryDetail", "origin_presentation", "MetadataCollection", 4),
    field("JournalEntryDetail", "authority_presentation", "MetadataCollection", 5),
    field("JournalEntryDetail", "integrity_presentation", "MetadataCollection", 6),
    field(
      "JournalEntryDetail",
      "provenance_presentation",
      "MetadataCollection",
      7,
      false,
    ),
    field(
      "JournalEntryDetail",
      "correction_supersession_presentation",
      "MetadataCollection",
      8,
      false,
    ),
  ],
  5,
);

export const EntryCategoryPresentationEntity = entity(
  "EntryCategoryPresentation",
  "EX-owned label presentation for an allowlisted entry category.",
  [
    field("EntryCategoryPresentation", "entry_category", "ClosedVocabulary", 1),
    field("EntryCategoryPresentation", "display_label", "PresentationLabel", 2),
  ],
  6,
);

export const LifecyclePresentationEntity = entity(
  "LifecyclePresentation",
  "Descriptive lifecycle label that does not close or mutate a journal entry.",
  [
    field("LifecyclePresentation", "lifecycle_state", "ClosedVocabulary", 1),
    field("LifecyclePresentation", "display_label", "PresentationLabel", 2),
  ],
  7,
);

export const OriginPresentationEntity = entity(
  "OriginPresentation",
  "Descriptive presentation of the allowlisted origin classification.",
  [
    field("OriginPresentation", "origin_classification", "ClosedVocabulary", 1),
    field("OriginPresentation", "display_label", "PresentationLabel", 2),
  ],
  8,
);

export const AuthorityPresentationEntity = entity(
  "AuthorityPresentation",
  "Coarse descriptive authority-state presentation without authority creation or confirmation.",
  [
    field("AuthorityPresentation", "authority_state", "ClosedVocabulary", 1),
    field("AuthorityPresentation", "display_label", "PresentationLabel", 2),
    field("AuthorityPresentation", "descriptive_only", "MetadataBoolean", 3),
  ],
  9,
);

export const IntegrityPresentationEntity = entity(
  "IntegrityPresentation",
  "Descriptive integrity-state presentation for allowlisted projection metadata.",
  [
    field("IntegrityPresentation", "integrity_state", "ClosedVocabulary", 1),
    field("IntegrityPresentation", "display_label", "PresentationLabel", 2),
  ],
  10,
);

export const ProvenancePresentationEntity = entity(
  "ProvenancePresentation",
  "Presence and display of an opaque provenance reference without resolving its target.",
  [
    field("ProvenancePresentation", "presence", "ClosedVocabulary", 1),
    field(
      "ProvenancePresentation",
      "provenance_ref",
      "OpaqueReference",
      2,
      true,
      true,
    ),
  ],
  11,
);

export const CorrectionSupersessionPresentationEntity = entity(
  "CorrectionSupersessionPresentation",
  "Opaque correction and supersession lineage references that preserve predecessor relationships.",
  [
    field(
      "CorrectionSupersessionPresentation",
      "correction_ref",
      "OpaqueReference",
      1,
      false,
      true,
    ),
    field(
      "CorrectionSupersessionPresentation",
      "supersession_ref",
      "OpaqueReference",
      2,
      false,
      true,
    ),
    field(
      "CorrectionSupersessionPresentation",
      "presence",
      "ClosedVocabulary",
      3,
    ),
  ],
  12,
);

export const JournalFilterModelEntity = entity(
  "JournalFilterModel",
  "Read-only filters constrained to allowlisted category and lifecycle presentation metadata.",
  [
    field("JournalFilterModel", "category_filter", "ClosedVocabulary", 1),
    field("JournalFilterModel", "lifecycle_filter", "ClosedVocabulary", 2),
    field("JournalFilterModel", "filter_state", "ClosedVocabulary", 3),
  ],
  13,
);

export const Tier0EvidenceReferenceEntity = entity(
  "Tier0EvidenceReference",
  "Exact supporting-evidence identity reference that never copies evidence payloads or completes a phase.",
  [
    field(
      "Tier0EvidenceReference",
      "evidence_id",
      "OpaqueReference",
      1,
      true,
      true,
    ),
    field(
      "Tier0EvidenceReference",
      "evidence_classification",
      "ClosedVocabulary",
      2,
    ),
    field(
      "Tier0EvidenceReference",
      "formal_phase_completion",
      "MetadataBoolean",
      3,
    ),
  ],
  14,
);

export const ExecutiveJournalExperienceModelEntities = Object.freeze([
  ExecutiveJournalExperienceEntity,
  JournalProjectionEntity,
  JournalEntryListEntity,
  JournalEntrySummaryEntity,
  JournalEntryDetailEntity,
  EntryCategoryPresentationEntity,
  LifecyclePresentationEntity,
  OriginPresentationEntity,
  AuthorityPresentationEntity,
  IntegrityPresentationEntity,
  ProvenancePresentationEntity,
  CorrectionSupersessionPresentationEntity,
  JournalFilterModelEntity,
  Tier0EvidenceReferenceEntity,
] as const satisfies readonly ExecutiveJournalExperienceModelEntityDescriptor[]);

export const ExecutiveJournalExperienceModelEntityKinds = Object.freeze(
  ExecutiveJournalExperienceModelEntities.map((descriptor) => descriptor.kind),
);

export const getExecutiveJournalExperienceModelEntity = (
  kind: unknown,
): ExecutiveJournalExperienceModelEntityDescriptor | null => {
  if (typeof kind !== "string" || kind !== kind.trim()) {
    return null;
  }
  return ExecutiveJournalExperienceModelEntities.find(
    (descriptor) => descriptor.kind === kind,
  ) ?? null;
};
