/**
 * RTC-2:3 — Executive Journal Runtime Model Entities.
 *
 * Canonical immutable entity descriptors for the journal domain model.
 * Structure only — no repositories, ORM, persistence, or UI.
 *
 * Ownership: owned exclusively by RTC-2:3.
 */

import type {
  ExecutiveJournalRuntimeEntityField,
  ExecutiveJournalRuntimeEntityKind,
  ExecutiveJournalRuntimeEntityModel,
} from "./executiveJournalRuntimeModelTypes.ts";

const field = (
  entityName: ExecutiveJournalRuntimeEntityKind,
  fieldName: string,
  description: string,
  order: number,
  required = true,
  isReference = false,
): ExecutiveJournalRuntimeEntityField =>
  Object.freeze({
    fieldId: `RTC-2:3/${entityName}/Field/${fieldName}`,
    fieldName,
    description,
    required,
    isReference,
    order,
    mutable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const entity = (
  entityName: ExecutiveJournalRuntimeEntityKind,
  description: string,
  fields: readonly ExecutiveJournalRuntimeEntityField[],
  order: number,
  options: {
    readonly root?: boolean;
    readonly requiresAuthorityRef?: boolean;
    readonly allowsPrivateReflection?: boolean;
    readonly mayBeDerived?: boolean;
  } = {},
): ExecutiveJournalRuntimeEntityModel =>
  Object.freeze({
    entityId: `RTC-2:3/Entity/${entityName}` as const,
    entityName,
    description,
    root: options.root === true,
    fields: Object.freeze([...fields]),
    fieldCount: fields.length,
    requiresAuthorityRef: options.requiresAuthorityRef !== false,
    allowsPrivateReflection: options.allowsPrivateReflection === true,
    mayBeDerived: options.mayBeDerived === true,
    stableIdentity: true as const,
    storesRuntimeValues: false as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Shared provenance field set for authoritative/derived states. */
const provenanceFields = (
  entityName: ExecutiveJournalRuntimeEntityKind,
  startOrder: number,
): readonly ExecutiveJournalRuntimeEntityField[] =>
  Object.freeze([
    field(
      entityName,
      "producing_event_refs",
      "Producing event reference or references.",
      startOrder,
      true,
      true,
    ),
    field(entityName, "journal_id", "Owning journal identity.", startOrder + 1, true, true),
    field(
      entityName,
      "journal_sequence",
      "Journal sequence or sequence range.",
      startOrder + 2,
    ),
    field(entityName, "event_type", "Producing event type.", startOrder + 3),
    field(entityName, "event_version", "Producing event version.", startOrder + 4),
    field(entityName, "recorded_at", "System acceptance / recorded time (UTC).", startOrder + 5),
    field(entityName, "actor_ref", "Actor reference.", startOrder + 6, true, true),
    field(
      entityName,
      "authority_ref",
      "Authority reference for consequential effect.",
      startOrder + 7,
      true,
      true,
    ),
    field(
      entityName,
      "evidence_refs",
      "Evidence references where required.",
      startOrder + 8,
      false,
      true,
    ),
  ]);

/** Root Journal entity. */
export const ExecutiveJournalEntityModel = entity(
  "Journal",
  "Canonical append-only executive journal stream identity and classification.",
  Object.freeze([
    field("Journal", "journal_id", "Stable journal identity (RTC-JRN-…).", 1),
    field("Journal", "information_category", "Closed information category.", 2),
    field("Journal", "record_visibility", "SharedExecutiveRecord or PrivateReflection.", 3),
    field("Journal", "acceptance_state", "Proposed or Accepted stream posture.", 4),
    field("Journal", "disposition_state", "Active or Disposed.", 5),
    field("Journal", "confirmation_source", "HumanConfirmed or AiProposed.", 6),
    ...provenanceFields("Journal", 7),
  ]),
  1,
  {
    root: true,
    requiresAuthorityRef: true,
    allowsPrivateReflection: true,
    mayBeDerived: false,
  },
);

export const ExecutiveJournalIntentEntityModel = entity(
  "Intent",
  "Executive intent, objective reframing, and declared constraints.",
  Object.freeze([
    field("Intent", "intent_id", "Stable intent identity.", 1),
    field("Intent", "acceptance_state", "Proposed or Accepted.", 2),
    field("Intent", "currency_state", "Current or Superseded.", 3),
    field("Intent", "confirmation_source", "HumanConfirmed or AiProposed.", 4),
    field("Intent", "record_visibility", "Shared or private reflection visibility.", 5),
    field("Intent", "predecessor_ref", "Superseded predecessor intent.", 6, false, true),
    ...provenanceFields("Intent", 7),
  ]),
  2,
  { allowsPrivateReflection: true },
);

export const ExecutiveJournalDecisionEntityModel = entity(
  "Decision",
  "Decision proposal, confirmation, supersession, and dispute linkage.",
  Object.freeze([
    field("Decision", "decision_id", "Stable decision identity.", 1),
    field("Decision", "acceptance_state", "Proposed or Accepted.", 2),
    field("Decision", "dispute_state", "Undisputed, Disputed, or Resolved.", 3),
    field("Decision", "currency_state", "Current or Superseded.", 4),
    field("Decision", "closure_state", "Open or Closed.", 5),
    field("Decision", "confirmation_source", "HumanConfirmed or AiProposed.", 6),
    field("Decision", "authority_kind", "Authoritative or Derived.", 7),
    field("Decision", "predecessor_ref", "Superseded predecessor decision.", 8, false, true),
    ...provenanceFields("Decision", 9),
  ]),
  3,
);

export const ExecutiveJournalCommitmentEntityModel = entity(
  "Commitment",
  "Commitment ledger entry with owner, due date, and closure evidence.",
  Object.freeze([
    field("Commitment", "commitment_id", "Stable commitment identity.", 1),
    field("Commitment", "acceptance_state", "Proposed or Accepted.", 2),
    field("Commitment", "closure_state", "Open or Closed.", 3),
    field("Commitment", "currency_state", "Current or Superseded.", 4),
    field("Commitment", "confirmation_source", "HumanConfirmed or AiProposed.", 5),
    field("Commitment", "owner_ref", "Commitment owner reference.", 6, true, true),
    field("Commitment", "due_at", "Due date reference.", 7, false),
    field("Commitment", "predecessor_ref", "Superseded predecessor commitment.", 8, false, true),
    ...provenanceFields("Commitment", 9),
  ]),
  4,
);

export const ExecutiveJournalRiskEntityModel = entity(
  "Risk",
  "Material risk raised or accepted within the journal stream.",
  Object.freeze([
    field("Risk", "risk_id", "Stable risk identity.", 1),
    field("Risk", "acceptance_state", "Proposed or Accepted.", 2),
    field("Risk", "currency_state", "Current or Superseded.", 3),
    field("Risk", "confirmation_source", "HumanConfirmed or AiProposed.", 4),
    field("Risk", "closure_state", "Open or Closed.", 5),
    ...provenanceFields("Risk", 6),
  ]),
  5,
);

export const ExecutiveJournalExceptionEntityModel = entity(
  "Exception",
  "Policy exception or escalation granted under authority.",
  Object.freeze([
    field("Exception", "exception_id", "Stable exception identity.", 1),
    field("Exception", "acceptance_state", "Proposed or Accepted.", 2),
    field("Exception", "disposition_state", "Active or Disposed.", 3),
    field("Exception", "confirmation_source", "HumanConfirmed or AiProposed.", 4),
    field("Exception", "expiry_at", "Exception expiry when bounded.", 5, false),
    ...provenanceFields("Exception", 6),
  ]),
  6,
);

export const ExecutiveJournalOutcomeEntityModel = entity(
  "Outcome",
  "Observed outcome, attested metric, realized benefit, or recorded lesson.",
  Object.freeze([
    field("Outcome", "outcome_id", "Stable outcome identity.", 1),
    field("Outcome", "acceptance_state", "Proposed or Accepted.", 2),
    field("Outcome", "authority_kind", "Authoritative or Derived.", 3),
    field("Outcome", "confirmation_source", "HumanConfirmed or AiProposed.", 4),
    field("Outcome", "related_decision_ref", "Related decision when applicable.", 5, false, true),
    field("Outcome", "related_commitment_ref", "Related commitment when applicable.", 6, false, true),
    ...provenanceFields("Outcome", 7),
  ]),
  7,
  { mayBeDerived: true },
);

export const ExecutiveJournalEvidenceReferenceEntityModel = entity(
  "EvidenceReference",
  "Content-addressed or version-pinned evidence reference.",
  Object.freeze([
    field("EvidenceReference", "evidence_id", "Stable evidence identity.", 1),
    field("EvidenceReference", "content_address_or_version_pin", "Pinned evidence locator.", 2),
    field("EvidenceReference", "availability_state", "Available or unavailable marker.", 3),
    field("EvidenceReference", "journal_id", "Owning journal identity.", 4, true, true),
    field("EvidenceReference", "producing_event_refs", "Events citing this evidence.", 5, false, true),
  ]),
  8,
  { requiresAuthorityRef: false, mayBeDerived: false },
);

export const ExecutiveJournalAuthorityReferenceEntityModel = entity(
  "AuthorityReference",
  "Resolvable mandate, role, approval, or policy grant — including bounded delegation.",
  Object.freeze([
    field("AuthorityReference", "authority_ref", "Stable authority reference.", 1),
    field("AuthorityReference", "grant_kind", "Mandate, role, approval, or policy grant.", 2),
    field("AuthorityReference", "delegator", "Named delegator when delegated.", 3, false, true),
    field("AuthorityReference", "delegate", "Named delegate when delegated.", 4, false, true),
    field("AuthorityReference", "scope", "Bounded delegation or grant scope.", 5),
    field("AuthorityReference", "effective_at", "Effective time.", 6),
    field("AuthorityReference", "expires_at", "Expiry time when bounded.", 7, false),
    field("AuthorityReference", "revocation_state", "Active or revoked.", 8),
    field("AuthorityReference", "evidence_refs", "Evidence for the grant or delegation.", 9, true, true),
  ]),
  9,
  { requiresAuthorityRef: false },
);

export const ExecutiveJournalCorrectionEntityModel = entity(
  "Correction",
  "Correction event that supersedes operational effect without erasing history.",
  Object.freeze([
    field("Correction", "correction_id", "Stable correction identity.", 1),
    field("Correction", "affected_ref", "Affected event or entity state.", 2, true, true),
    field("Correction", "corrected_claim", "Corrected claim statement.", 3),
    field("Correction", "reason", "Correction reason.", 4),
    field("Correction", "acceptance_state", "Proposed or Accepted.", 5),
    field("Correction", "confirmation_source", "HumanConfirmed or AiProposed.", 6),
    field("Correction", "original_retained", "Original evidence retention marker.", 7),
    ...provenanceFields("Correction", 8),
  ]),
  10,
);

export const ExecutiveJournalDisputeEntityModel = entity(
  "Dispute",
  "Dispute marker that keeps original evidence visible to permitted reviewers.",
  Object.freeze([
    field("Dispute", "dispute_id", "Stable dispute identity.", 1),
    field("Dispute", "affected_ref", "Disputed event or entity state.", 2, true, true),
    field("Dispute", "dispute_state", "Disputed or Resolved.", 3),
    field("Dispute", "acceptance_state", "Proposed or Accepted.", 4),
    field("Dispute", "confirmation_source", "HumanConfirmed or AiProposed.", 5),
    field("Dispute", "resolution_ref", "Resolution event when resolved.", 6, false, true),
    ...provenanceFields("Dispute", 7),
  ]),
  11,
);

export const ExecutiveJournalProjectionEntityModel = entity(
  "Projection",
  "Deterministic derived view. Remains Derived; never becomes Authoritative by display.",
  Object.freeze([
    field("Projection", "projection_id", "Stable projection identity.", 1),
    field("Projection", "authority_kind", "Always Derived for projection rows.", 2),
    field("Projection", "projector_version", "Registered projector version.", 3),
    field("Projection", "source_event_ids", "Producing accepted event identities.", 4, true, true),
    field("Projection", "journal_id", "Owning journal identity.", 5, true, true),
    field("Projection", "freshness", "Commit-to-query freshness marker.", 6, false),
    field("Projection", "explainable_links", "Links from displayed fact to events/evidence.", 7, true, true),
  ]),
  12,
  { requiresAuthorityRef: false, mayBeDerived: true },
);

export const ExecutiveJournalDisclosureRecordEntityModel = entity(
  "DisclosureRecord",
  "Purpose-bound read or export access decision evidence.",
  Object.freeze([
    field("DisclosureRecord", "disclosure_id", "Stable disclosure identity.", 1),
    field("DisclosureRecord", "purpose", "Bound purpose for the disclosure.", 2),
    field("DisclosureRecord", "access_decision_id", "Policy access decision identity.", 3),
    field("DisclosureRecord", "policy_version", "Policy version applied.", 4),
    field("DisclosureRecord", "record_visibility", "Visibility of disclosed material.", 5),
    field("DisclosureRecord", "confirmation_source", "HumanConfirmed or AiProposed.", 6),
    ...provenanceFields("DisclosureRecord", 7),
  ]),
  13,
);

export const ExecutiveJournalDispositionRecordEntityModel = entity(
  "DispositionRecord",
  "Retention tombstone or cryptographic erasure action with disposition proof.",
  Object.freeze([
    field("DispositionRecord", "disposition_id", "Stable disposition identity.", 1),
    field("DispositionRecord", "affected_ref", "Disposed event or payload reference.", 2, true, true),
    field("DispositionRecord", "disposition_state", "Disposed marker.", 3),
    field("DispositionRecord", "disposition_proof", "Disposition proof reference.", 4, true, true),
    field("DispositionRecord", "confirmation_source", "HumanConfirmed or AiProposed.", 5),
    ...provenanceFields("DispositionRecord", 6),
  ]),
  14,
);

/** Ordered canonical entity collection (exactly fourteen). */
export const ExecutiveJournalRuntimeEntityModels = Object.freeze([
  ExecutiveJournalEntityModel,
  ExecutiveJournalIntentEntityModel,
  ExecutiveJournalDecisionEntityModel,
  ExecutiveJournalCommitmentEntityModel,
  ExecutiveJournalRiskEntityModel,
  ExecutiveJournalExceptionEntityModel,
  ExecutiveJournalOutcomeEntityModel,
  ExecutiveJournalEvidenceReferenceEntityModel,
  ExecutiveJournalAuthorityReferenceEntityModel,
  ExecutiveJournalCorrectionEntityModel,
  ExecutiveJournalDisputeEntityModel,
  ExecutiveJournalProjectionEntityModel,
  ExecutiveJournalDisclosureRecordEntityModel,
  ExecutiveJournalDispositionRecordEntityModel,
] as const satisfies readonly ExecutiveJournalRuntimeEntityModel[]);

export const ExecutiveJournalRuntimeEntityNames = Object.freeze([
  "Journal",
  "Intent",
  "Decision",
  "Commitment",
  "Risk",
  "Exception",
  "Outcome",
  "EvidenceReference",
  "AuthorityReference",
  "Correction",
  "Dispute",
  "Projection",
  "DisclosureRecord",
  "DispositionRecord",
] as const satisfies readonly ExecutiveJournalRuntimeEntityKind[]);
