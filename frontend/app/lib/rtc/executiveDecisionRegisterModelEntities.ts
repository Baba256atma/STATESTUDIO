/**
 * RTC-3:3 — Executive Decision Register Model Entities.
 *
 * Canonical immutable entity descriptors for the Decision Register domain model.
 * Structure only — no repositories, ORM, persistence, or UI.
 *
 * Ownership: owned exclusively by RTC-3:3.
 */

import type {
  ExecutiveDecisionRegisterEntityField,
  ExecutiveDecisionRegisterEntityKind,
  ExecutiveDecisionRegisterEntityModel,
  ExecutiveDecisionRegisterRelationshipKind,
} from "./executiveDecisionRegisterModelTypes.ts";

const field = (
  entityName: ExecutiveDecisionRegisterEntityKind,
  fieldName: string,
  description: string,
  order: number,
  required = true,
  isReference = false,
): ExecutiveDecisionRegisterEntityField =>
  Object.freeze({
    fieldId: `RTC-3:3/${entityName}/Field/${fieldName}`,
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
  entityName: ExecutiveDecisionRegisterEntityKind,
  description: string,
  fields: readonly ExecutiveDecisionRegisterEntityField[],
  order: number,
  options: {
    readonly root?: boolean;
    readonly lifecycleApplicability?: readonly string[];
    readonly requiresAuthorityRef?: boolean;
    readonly requiresHumanConfirmation?: boolean;
    readonly requiresProvenance?: boolean;
    readonly requiresEvidence?: boolean;
    readonly privacyCategoryRequired?: boolean;
    readonly classificationRequired?: boolean;
    readonly allowedRelationshipKinds?: readonly ExecutiveDecisionRegisterRelationshipKind[];
    readonly requiresProducingEvent?: boolean;
    readonly projectionEligible?: boolean;
    readonly mayBeDerived?: boolean;
  } = {},
): ExecutiveDecisionRegisterEntityModel =>
  Object.freeze({
    entityId: `RTC-3:3/Entity/${entityName}` as const,
    entityName,
    description,
    root: options.root === true,
    parentRoot: "DecisionRegister" as const,
    fields: Object.freeze([...fields]),
    fieldCount: fields.length,
    lifecycleApplicability: Object.freeze([
      ...(options.lifecycleApplicability ?? [
        "Proposed",
        "Confirmed",
        "Effective",
        "Disputed",
        "Superseded",
        "Closed",
        "Disposed",
      ]),
    ]),
    requiresAuthorityRef: options.requiresAuthorityRef === true,
    requiresHumanConfirmation: options.requiresHumanConfirmation === true,
    requiresProvenance: options.requiresProvenance !== false,
    requiresEvidence: options.requiresEvidence === true,
    privacyCategoryRequired: options.privacyCategoryRequired !== false,
    classificationRequired: options.classificationRequired !== false,
    allowedRelationshipKinds: Object.freeze([
      ...(options.allowedRelationshipKinds ?? []),
    ]),
    requiresProducingEvent: options.requiresProducingEvent !== false,
    projectionEligible: options.projectionEligible === true,
    telemetryRestricted: true as const,
    appendOnly: true as const,
    aiMayCreateAuthoritative: false as const,
    allowsPrivateReflection: false as const,
    mayBeDerived: options.mayBeDerived === true,
    stableIdentity: true as const,
    storesRuntimeValues: false as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Root DecisionRegister entity. */
export const ExecutiveDecisionRegisterRootEntityModel = entity(
  "DecisionRegister",
  "Metadata boundary for an ordered collection of governed executive decisions. Contains no real decision payloads.",
  Object.freeze([
    field("DecisionRegister", "register_id", "Stable register identity (RTC-EDR-…).", 1),
    field("DecisionRegister", "privacy_category", "Closed decision-record privacy category.", 2),
    field("DecisionRegister", "classification", "Classification requirement marker.", 3),
    field("DecisionRegister", "disposition_state", "Active or Disposed.", 4),
    field("DecisionRegister", "sequence_position", "Deterministic register sequence position.", 5),
    field(
      "DecisionRegister",
      "producing_event_refs",
      "Producing-event provenance for register-level state.",
      6,
      true,
      true,
    ),
  ]),
  1,
  {
    root: true,
    lifecycleApplicability: Object.freeze(["Active", "Disposed"]),
    requiresAuthorityRef: true,
    requiresHumanConfirmation: false,
    requiresEvidence: false,
    projectionEligible: true,
    allowedRelationshipKinds: Object.freeze([
      "DerivedFrom",
      "DisposedBy",
    ] as const),
  },
);

export const ExecutiveDecisionRecordEntityModel = entity(
  "DecisionRecord",
  "Canonical governed decision record requiring authority and human confirmation for authoritative state.",
  Object.freeze([
    field("DecisionRecord", "decision_id", "Stable decision identity.", 1),
    field("DecisionRecord", "register_id", "Owning DecisionRegister identity.", 2, true, true),
    field("DecisionRecord", "decision_state", "Closed decision lifecycle state.", 3),
    field("DecisionRecord", "authority_state", "NonAuthoritative or Authoritative.", 4),
    field("DecisionRecord", "origin_state", "HumanAuthored, AiProposed, or SystemDerived.", 5),
    field("DecisionRecord", "actor_ref", "Actor reference.", 6, true, true),
    field("DecisionRecord", "authority_ref", "Authority reference for consequential state.", 7, true, true),
    field("DecisionRecord", "purpose", "Decision purpose.", 8),
    field("DecisionRecord", "classification", "Classification marker.", 9),
    field("DecisionRecord", "record_category", "Closed privacy/record category.", 10),
    field("DecisionRecord", "effective_point", "Effective point metadata.", 11, false),
    field("DecisionRecord", "producing_event_refs", "Producing-event provenance.", 12, true, true),
    field("DecisionRecord", "evidence_refs", "Evidence references.", 13, false, true),
    field("DecisionRecord", "alternative_refs", "Alternative references where applicable.", 14, false, true),
    field("DecisionRecord", "constraint_refs", "Constraint references where applicable.", 15, false, true),
    field("DecisionRecord", "confirmation_ref", "Human confirmation reference when authoritative.", 16, false, true),
    field("DecisionRecord", "correction_refs", "Correction lineage references.", 17, false, true),
    field("DecisionRecord", "dispute_refs", "Dispute lineage references.", 18, false, true),
    field("DecisionRecord", "supersession_refs", "Supersession lineage references.", 19, false, true),
    field("DecisionRecord", "outcome_refs", "Outcome relationship references.", 20, false, true),
    field("DecisionRecord", "disposition_ref", "Disposition reference where applicable.", 21, false, true),
    field("DecisionRecord", "integrity", "Integrity requirements.", 22),
    field("DecisionRecord", "currency_state", "Current or Superseded.", 23),
    field("DecisionRecord", "dispute_state", "Undisputed, Disputed, or Resolved.", 24),
    field("DecisionRecord", "closure_state", "Open or Closed.", 25),
  ]),
  2,
  {
    requiresAuthorityRef: true,
    requiresHumanConfirmation: true,
    requiresEvidence: true,
    allowedRelationshipKinds: Object.freeze([
      "ProposedFrom",
      "ConfirmedBy",
      "Corrects",
      "Disputes",
      "ResolvesDispute",
      "Supersedes",
      "ReferencesOutcome",
      "DerivedFrom",
      "DisposedBy",
    ] as const),
  },
);

export const ExecutiveDecisionProposalEntityModel = entity(
  "DecisionProposal",
  "Non-authoritative decision proposal. AI-generated proposals remain AiProposed and NonAuthoritative until separate human confirmation.",
  Object.freeze([
    field("DecisionProposal", "proposal_id", "Stable proposal identity.", 1),
    field("DecisionProposal", "register_id", "Owning DecisionRegister identity.", 2, true, true),
    field("DecisionProposal", "authority_state", "Always NonAuthoritative for proposals.", 3),
    field("DecisionProposal", "origin_state", "HumanAuthored, AiProposed, or SystemDerived.", 4),
    field("DecisionProposal", "proposing_actor_or_system", "Proposing actor or AI/system descriptor.", 5),
    field("DecisionProposal", "source_refs", "Source references.", 6, false, true),
    field("DecisionProposal", "evidence_refs", "Evidence references.", 7, false, true),
    field("DecisionProposal", "alternative_refs", "Alternative references.", 8, false, true),
    field("DecisionProposal", "constraint_refs", "Constraint references.", 9, false, true),
    field("DecisionProposal", "intended_decision_effect", "Exact intended decision effect.", 10),
    field(
      "DecisionProposal",
      "requires_separate_human_confirmation",
      "Authoritative transition requires separate human confirmation.",
      11,
    ),
    field("DecisionProposal", "producing_event_refs", "Producing-event provenance.", 12, true, true),
  ]),
  3,
  {
    lifecycleApplicability: Object.freeze(["Proposed"]),
    requiresAuthorityRef: false,
    requiresHumanConfirmation: false,
    requiresEvidence: false,
    allowedRelationshipKinds: Object.freeze([
      "ProposedFrom",
      "ConfirmedBy",
      "DerivedFrom",
    ] as const),
  },
);

export const ExecutiveDecisionAuthorityEntityModel = entity(
  "DecisionAuthority",
  "Authority grant including bounded delegation metadata. Does not select or query a live authority registry.",
  Object.freeze([
    field("DecisionAuthority", "authority_ref", "Stable authority reference.", 1),
    field("DecisionAuthority", "authority_kind", "Authority kind.", 2),
    field("DecisionAuthority", "issuing_authority", "Issuing authority.", 3),
    field("DecisionAuthority", "subject_actor", "Subject actor.", 4, true, true),
    field("DecisionAuthority", "scope", "Authority scope.", 5),
    field("DecisionAuthority", "decision_domain", "Decision domain.", 6),
    field("DecisionAuthority", "effective_point", "Effective point.", 7),
    field("DecisionAuthority", "expiry", "Expiry.", 8, false),
    field("DecisionAuthority", "revocation_state", "Revocation state.", 9),
    field("DecisionAuthority", "delegator", "Delegator when delegated.", 10, false, true),
    field("DecisionAuthority", "delegate", "Delegate when delegated.", 11, false, true),
    field("DecisionAuthority", "delegation_scope", "Delegation scope when delegated.", 12, false),
    field("DecisionAuthority", "delegation_effective_point", "Delegation effective point.", 13, false),
    field("DecisionAuthority", "delegation_expiry", "Delegation expiry.", 14, false),
    field("DecisionAuthority", "delegation_revocation_state", "Delegation revocation state.", 15, false),
    field("DecisionAuthority", "evidence_reference", "Evidence reference for the grant or delegation.", 16, true, true),
    field("DecisionAuthority", "selects_live_authority_registry", "Must remain false.", 17),
  ]),
  4,
  {
    lifecycleApplicability: Object.freeze(["Active", "Disposed"]),
    requiresAuthorityRef: false,
    requiresHumanConfirmation: false,
    requiresEvidence: true,
    requiresProducingEvent: false,
    allowedRelationshipKinds: Object.freeze(["DerivedFrom"] as const),
  },
);

export const ExecutiveDecisionConfirmationEntityModel = entity(
  "DecisionConfirmation",
  "Human confirmation binding for authoritative decision transition. AI and non-human substitutes cannot satisfy confirmation.",
  Object.freeze([
    field("DecisionConfirmation", "confirmation_identity", "Stable confirmation identity.", 1),
    field("DecisionConfirmation", "human_confirmer", "Human confirmer actor.", 2, true, true),
    field("DecisionConfirmation", "decision_proposal", "Bound decision proposal.", 3, true, true),
    field("DecisionConfirmation", "exact_proposed_decision_effect", "Exact proposed decision effect.", 4),
    field("DecisionConfirmation", "authority_ref", "Authority reference.", 5, true, true),
    field("DecisionConfirmation", "evidence_set", "Evidence set.", 6, true, true),
    field("DecisionConfirmation", "purpose", "Confirmation purpose.", 7),
    field("DecisionConfirmation", "policy_version_ref", "Policy version reference where applicable.", 8, false, true),
    field("DecisionConfirmation", "expiry_metadata", "Expiry metadata supplied by authority.", 9, false),
    field("DecisionConfirmation", "single_use", "Single-use requirement.", 10),
    field("DecisionConfirmation", "ai_cannot_satisfy", "AI cannot satisfy confirmation.", 11),
    field("DecisionConfirmation", "identity_alone_insufficient", "Identity alone insufficient.", 12),
    field("DecisionConfirmation", "title_insufficient", "Title insufficient.", 13),
    field("DecisionConfirmation", "role_alone_insufficient", "Role alone insufficient.", 14),
    field("DecisionConfirmation", "attendance_insufficient", "Attendance insufficient.", 15),
    field("DecisionConfirmation", "silence_insufficient", "Silence insufficient.", 16),
    field("DecisionConfirmation", "producing_event_refs", "Producing-event provenance.", 17, true, true),
  ]),
  5,
  {
    lifecycleApplicability: Object.freeze(["Confirmed", "Effective"]),
    requiresAuthorityRef: true,
    requiresHumanConfirmation: true,
    requiresEvidence: true,
    allowedRelationshipKinds: Object.freeze([
      "ConfirmedBy",
      "ProposedFrom",
    ] as const),
  },
);

export const ExecutiveDecisionAlternativeEntityModel = entity(
  "DecisionAlternative",
  "Non-authoritative alternative considered for a decision proposal or record.",
  Object.freeze([
    field("DecisionAlternative", "alternative_id", "Stable alternative identity.", 1),
    field("DecisionAlternative", "decision_or_proposal_ref", "Owning decision or proposal.", 2, true, true),
    field("DecisionAlternative", "description_ref", "Alternative description reference.", 3, false, true),
    field("DecisionAlternative", "authority_state", "NonAuthoritative.", 4),
    field("DecisionAlternative", "producing_event_refs", "Producing-event provenance.", 5, true, true),
  ]),
  6,
  {
    lifecycleApplicability: Object.freeze(["Proposed", "Confirmed", "Effective"]),
    requiresAuthorityRef: false,
    requiresHumanConfirmation: false,
    requiresEvidence: false,
    allowedRelationshipKinds: Object.freeze([
      "ProposedFrom",
      "DerivedFrom",
    ] as const),
  },
);

export const ExecutiveDecisionConstraintEntityModel = entity(
  "DecisionConstraint",
  "Constraint attached to a proposal or decision without creating authority.",
  Object.freeze([
    field("DecisionConstraint", "constraint_id", "Stable constraint identity.", 1),
    field("DecisionConstraint", "decision_or_proposal_ref", "Owning decision or proposal.", 2, true, true),
    field("DecisionConstraint", "constraint_kind", "Constraint kind marker.", 3),
    field("DecisionConstraint", "authority_state", "NonAuthoritative unless separately confirmed.", 4),
    field("DecisionConstraint", "producing_event_refs", "Producing-event provenance.", 5, true, true),
  ]),
  7,
  {
    lifecycleApplicability: Object.freeze(["Proposed", "Confirmed", "Effective"]),
    requiresAuthorityRef: false,
    requiresHumanConfirmation: false,
    requiresEvidence: false,
    allowedRelationshipKinds: Object.freeze([
      "ProposedFrom",
      "DerivedFrom",
    ] as const),
  },
);

export const ExecutiveDecisionEvidenceEntityModel = entity(
  "DecisionEvidence",
  "Evidence reference distinguishing Referenced, VersionPinned, ContentAddressed, Unavailable, and Disputed. Does not decide pinning policy (OI-03).",
  Object.freeze([
    field("DecisionEvidence", "evidence_identity", "Stable evidence identity.", 1),
    field("DecisionEvidence", "evidence_type", "Evidence type.", 2),
    field("DecisionEvidence", "evidence_category", "Referenced, VersionPinned, ContentAddressed, Unavailable, or Disputed.", 3),
    field("DecisionEvidence", "version_or_digest_ref", "Version or digest reference where applicable.", 4, false, true),
    field("DecisionEvidence", "availability_state", "Availability state including unavailable.", 5),
    field("DecisionEvidence", "related_entity_ref", "Related proposal, confirmation, correction, dispute, or outcome.", 6, true, true),
    field("DecisionEvidence", "provenance", "Evidence provenance.", 7),
    field("DecisionEvidence", "classification", "Classification marker.", 8),
    field("DecisionEvidence", "integrity_requirement", "Integrity requirement.", 9),
    field("DecisionEvidence", "unavailable_not_silently_accepted", "Unavailable/missing evidence is distinguishable and not silently accepted.", 10),
  ]),
  8,
  {
    lifecycleApplicability: Object.freeze([
      "Proposed",
      "Confirmed",
      "Effective",
      "Disputed",
      "Superseded",
      "Closed",
      "Disposed",
    ]),
    requiresAuthorityRef: false,
    requiresHumanConfirmation: false,
    requiresEvidence: false,
    requiresProducingEvent: false,
    allowedRelationshipKinds: Object.freeze([
      "DerivedFrom",
      "Disputes",
    ] as const),
  },
);

export const ExecutiveDecisionCorrectionEntityModel = entity(
  "DecisionCorrection",
  "Append-only correction that preserves original decision/event references and does not erase history.",
  Object.freeze([
    field("DecisionCorrection", "correction_identity", "Stable correction identity.", 1),
    field("DecisionCorrection", "corrected_decision_ref", "Original decision reference preserved.", 2, true, true),
    field("DecisionCorrection", "affected_event_ref", "Affected event reference preserved.", 3, true, true),
    field("DecisionCorrection", "corrected_claim_or_schema_ref", "Corrected claim or metadata-schema reference.", 4, true, true),
    field("DecisionCorrection", "reason", "Correction reason.", 5),
    field("DecisionCorrection", "actor", "Correction actor.", 6, true, true),
    field("DecisionCorrection", "authority_ref", "Authority reference.", 7, true, true),
    field("DecisionCorrection", "evidence_reference", "Evidence reference.", 8, true, true),
    field("DecisionCorrection", "new_producing_event_ref", "New producing-event reference.", 9, true, true),
    field("DecisionCorrection", "projection_effect", "Projection effect metadata.", 10),
    field("DecisionCorrection", "original_history_retained", "Original history is retained; not erased.", 11),
  ]),
  9,
  {
    lifecycleApplicability: Object.freeze(["Confirmed", "Effective", "Disputed", "Closed"]),
    requiresAuthorityRef: true,
    requiresHumanConfirmation: true,
    requiresEvidence: true,
    allowedRelationshipKinds: Object.freeze([
      "Corrects",
      "DerivedFrom",
    ] as const),
  },
);

export const ExecutiveDecisionDisputeEntityModel = entity(
  "DecisionDispute",
  "Dispute that preserves the challenged decision/event reference. Resolution preserves the dispute; neither is deleted.",
  Object.freeze([
    field("DecisionDispute", "dispute_identity", "Stable dispute identity.", 1),
    field("DecisionDispute", "challenged_decision_ref", "Challenged decision reference preserved.", 2, true, true),
    field("DecisionDispute", "challenged_event_or_claim_ref", "Challenged event or claim reference.", 3, true, true),
    field("DecisionDispute", "initiator", "Dispute initiator.", 4, true, true),
    field("DecisionDispute", "basis", "Dispute basis.", 5),
    field("DecisionDispute", "evidence_refs", "Evidence references.", 6, true, true),
    field("DecisionDispute", "opened_event", "Opened event.", 7, true, true),
    field("DecisionDispute", "review_owner", "Review owner.", 8),
    field("DecisionDispute", "resolution_state", "Undisputed, Disputed, or Resolved.", 9),
    field("DecisionDispute", "resolution_event", "Resolution event when resolved.", 10, false, true),
    field("DecisionDispute", "resolution_authority", "Resolution authority when resolved.", 11, false, true),
    field("DecisionDispute", "dispute_retained_on_resolution", "Dispute and challenged record are retained.", 12),
  ]),
  10,
  {
    lifecycleApplicability: Object.freeze(["Disputed", "Effective", "Closed"]),
    requiresAuthorityRef: true,
    requiresHumanConfirmation: true,
    requiresEvidence: true,
    allowedRelationshipKinds: Object.freeze([
      "Disputes",
      "ResolvesDispute",
      "DerivedFrom",
    ] as const),
  },
);

export const ExecutiveDecisionSupersessionEntityModel = entity(
  "DecisionSupersession",
  "Supersession that preserves predecessor/successor relationship; successor does not silently replace predecessor.",
  Object.freeze([
    field("DecisionSupersession", "predecessor_decision", "Predecessor decision preserved.", 1, true, true),
    field("DecisionSupersession", "successor_decision", "Successor decision.", 2, true, true),
    field("DecisionSupersession", "supersession_event", "Supersession event.", 3, true, true),
    field("DecisionSupersession", "effective_point", "Effective point.", 4),
    field("DecisionSupersession", "actor", "Actor.", 5, true, true),
    field("DecisionSupersession", "authority_ref", "Authority reference.", 6, true, true),
    field("DecisionSupersession", "rationale_or_evidence_ref", "Rationale/evidence reference.", 7, true, true),
    field("DecisionSupersession", "projection_effect", "Projection effect metadata.", 8),
    field("DecisionSupersession", "no_silent_replacement", "Successor does not silently replace predecessor.", 9),
  ]),
  11,
  {
    lifecycleApplicability: Object.freeze(["Superseded", "Effective", "Closed"]),
    requiresAuthorityRef: true,
    requiresHumanConfirmation: true,
    requiresEvidence: true,
    allowedRelationshipKinds: Object.freeze([
      "Supersedes",
      "DerivedFrom",
    ] as const),
  },
);

export const ExecutiveDecisionOutcomeReferenceEntityModel = entity(
  "DecisionOutcomeReference",
  "Outcome relationship metadata. Does not define decision-outcome closure criteria (OI-05).",
  Object.freeze([
    field("DecisionOutcomeReference", "decision_identity", "Decision identity preserved.", 1, true, true),
    field("DecisionOutcomeReference", "outcome_identity_or_ref", "Outcome identity/reference.", 2, true, true),
    field("DecisionOutcomeReference", "observation_or_attestation_ref", "Observation or attestation reference.", 3, false, true),
    field("DecisionOutcomeReference", "producing_event", "Producing event.", 4, true, true),
    field("DecisionOutcomeReference", "evidence", "Evidence.", 5, false, true),
    field("DecisionOutcomeReference", "relationship_kind", "ReferencesOutcome.", 6),
    field("DecisionOutcomeReference", "closure_relevance", "Closure relevance marker; criteria unresolved (OI-05).", 7),
    field("DecisionOutcomeReference", "provenance", "Provenance.", 8),
  ]),
  12,
  {
    lifecycleApplicability: Object.freeze(["Effective", "Closed", "Disposed"]),
    requiresAuthorityRef: false,
    requiresHumanConfirmation: false,
    requiresEvidence: false,
    mayBeDerived: true,
    allowedRelationshipKinds: Object.freeze([
      "ReferencesOutcome",
      "DerivedFrom",
    ] as const),
  },
);

export const ExecutiveDecisionProjectionEntityModel = entity(
  "DecisionProjection",
  "Derived projection metadata. Cannot create authoritative facts, authority, confirmation, hide dispute status, or erase lineage.",
  Object.freeze([
    field("DecisionProjection", "projection_identity", "Projection identity.", 1),
    field("DecisionProjection", "projection_version", "Projection version.", 2),
    field("DecisionProjection", "source_register", "Source DecisionRegister.", 3, true, true),
    field("DecisionProjection", "source_sequence_position_or_range", "Source sequence position or range.", 4),
    field("DecisionProjection", "producing_event_refs", "Producing-event references.", 5, true, true),
    field("DecisionProjection", "derivation_version", "Derivation version.", 6),
    field("DecisionProjection", "provenance", "Projection provenance.", 7),
    field("DecisionProjection", "staleness_metadata", "Staleness metadata.", 8),
    field("DecisionProjection", "authority_limitations", "Authority limitations.", 9),
    field("DecisionProjection", "authority_state", "NonAuthoritative / derived-only.", 10),
    field("DecisionProjection", "cannot_create_authoritative_facts", "Cannot create authoritative facts.", 11),
    field("DecisionProjection", "cannot_create_authority", "Cannot create authority.", 12),
    field("DecisionProjection", "cannot_confirm_decisions", "Cannot confirm decisions.", 13),
    field("DecisionProjection", "cannot_hide_dispute_status", "Cannot hide dispute status.", 14),
    field("DecisionProjection", "cannot_erase_historical_lineage", "Cannot erase historical lineage.", 15),
    field("DecisionProjection", "view_kind", "CurrentDecisionRegister, DecisionTimeline, SupersessionChain, DisputeRegister, DecisionOutcomeRelationshipView, or AuthorityAndConfirmationEvidenceView.", 16),
  ]),
  13,
  {
    lifecycleApplicability: Object.freeze([
      "Proposed",
      "Confirmed",
      "Effective",
      "Disputed",
      "Superseded",
      "Closed",
      "Disposed",
    ]),
    requiresAuthorityRef: false,
    requiresHumanConfirmation: false,
    requiresEvidence: false,
    mayBeDerived: true,
    projectionEligible: true,
    allowedRelationshipKinds: Object.freeze([
      "DerivedFrom",
    ] as const),
  },
);

export const ExecutiveDecisionDispositionEntityModel = entity(
  "DecisionDisposition",
  "Disposition metadata that preserves governance evidence and does not erase append-only history.",
  Object.freeze([
    field("DecisionDisposition", "disposition_identity", "Stable disposition identity.", 1),
    field("DecisionDisposition", "affected_decision_ref", "Disposed decision reference.", 2, true, true),
    field("DecisionDisposition", "disposition_state", "Disposed marker.", 3),
    field("DecisionDisposition", "governance_evidence_refs", "Governance evidence preserved.", 4, true, true),
    field("DecisionDisposition", "actor", "Disposition actor.", 5, true, true),
    field("DecisionDisposition", "authority_ref", "Authority reference.", 6, true, true),
    field("DecisionDisposition", "producing_event_refs", "Producing-event provenance.", 7, true, true),
    field("DecisionDisposition", "history_retained", "Append-only history retained.", 8),
  ]),
  14,
  {
    lifecycleApplicability: Object.freeze(["Disposed"]),
    requiresAuthorityRef: true,
    requiresHumanConfirmation: true,
    requiresEvidence: true,
    allowedRelationshipKinds: Object.freeze([
      "DisposedBy",
      "DerivedFrom",
    ] as const),
  },
);

/** Ordered canonical entity collection (exactly fourteen). */
export const ExecutiveDecisionRegisterEntityModels = Object.freeze([
  ExecutiveDecisionRegisterRootEntityModel,
  ExecutiveDecisionRecordEntityModel,
  ExecutiveDecisionProposalEntityModel,
  ExecutiveDecisionAuthorityEntityModel,
  ExecutiveDecisionConfirmationEntityModel,
  ExecutiveDecisionAlternativeEntityModel,
  ExecutiveDecisionConstraintEntityModel,
  ExecutiveDecisionEvidenceEntityModel,
  ExecutiveDecisionCorrectionEntityModel,
  ExecutiveDecisionDisputeEntityModel,
  ExecutiveDecisionSupersessionEntityModel,
  ExecutiveDecisionOutcomeReferenceEntityModel,
  ExecutiveDecisionProjectionEntityModel,
  ExecutiveDecisionDispositionEntityModel,
] as const satisfies readonly ExecutiveDecisionRegisterEntityModel[]);

export const ExecutiveDecisionRegisterEntityNames = Object.freeze([
  "DecisionRegister",
  "DecisionRecord",
  "DecisionProposal",
  "DecisionAuthority",
  "DecisionConfirmation",
  "DecisionAlternative",
  "DecisionConstraint",
  "DecisionEvidence",
  "DecisionCorrection",
  "DecisionDispute",
  "DecisionSupersession",
  "DecisionOutcomeReference",
  "DecisionProjection",
  "DecisionDisposition",
] as const satisfies readonly ExecutiveDecisionRegisterEntityKind[]);

/** Fail-closed entity-kind guard. */
export function isCanonicalDecisionRegisterEntityKind(
  value: unknown,
): value is ExecutiveDecisionRegisterEntityKind {
  return typeof value === "string"
    && (ExecutiveDecisionRegisterEntityNames as readonly string[]).includes(
      value,
    );
}
