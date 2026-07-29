/**
 * RTC-3:3 — Executive Decision Register Model Contracts.
 *
 * Entity, authority, confirmation, provenance, privacy, evidence,
 * projection, and lineage contract declarations.
 * Declarations only. No implementation. No UI.
 *
 * Ownership: owned exclusively by RTC-3:3.
 */

export type ExecutiveDecisionRegisterModelContractName =
  | "DecisionRegisterModelEntity"
  | "DecisionRegisterModelAuthority"
  | "DecisionRegisterModelConfirmation"
  | "DecisionRegisterModelProvenance"
  | "DecisionRegisterModelPrivacy"
  | "DecisionRegisterModelEvidence"
  | "DecisionRegisterModelProjection"
  | "DecisionRegisterModelLineage"
  | "DecisionRegisterModelTelemetry"
  | "DecisionRegisterModelAiBoundary";

export interface ExecutiveDecisionRegisterModelContractDeclaration {
  readonly contractId:
    `RTC-3:3/Contract/${ExecutiveDecisionRegisterModelContractName}`;
  readonly contractName: ExecutiveDecisionRegisterModelContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly executable: false;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const contract = (
  contractName: ExecutiveDecisionRegisterModelContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveDecisionRegisterModelContractDeclaration =>
  Object.freeze({
    contractId: `RTC-3:3/Contract/${contractName}` as const,
    contractName,
    canonicalName,
    description,
    fields: Object.freeze([...fields]),
    executable: false as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Public model contracts. Order is deterministic and immutable.
 */
export const ExecutiveDecisionRegisterModelContracts:
  readonly ExecutiveDecisionRegisterModelContractDeclaration[] = Object.freeze([
    contract(
      "DecisionRegisterModelEntity",
      "Decision Register Model Entity",
      "Every canonical entity declares kind, stable identity, root relationship, lifecycle applicability, authority/confirmation/provenance/evidence requirements, privacy, relationships, producing-event, projection eligibility, telemetry restrictions, append-only behavior, and AI restrictions.",
      Object.freeze([
        "entity_kind",
        "stable_identity",
        "parent_root",
        "lifecycle_applicability",
        "authority_requirement",
        "confirmation_requirement",
        "provenance_requirement",
        "evidence_requirement",
        "privacy_category",
        "classification_requirement",
        "allowed_relationship_kinds",
        "producing_event_requirement",
        "projection_eligibility",
        "telemetry_restrictions",
        "append_only",
        "ai_restrictions",
        "deterministic_order",
      ]),
      1,
    ),
    contract(
      "DecisionRegisterModelAuthority",
      "Decision Register Model Authority",
      "Consequential/authoritative state requires authority_ref with kind, issuer, subject, scope, domain, effective point, expiry, revocation, and evidence. Delegation requires delegator, delegate, scope, effective point, expiry, revocation, and evidence. Identity, title, role alone, attendance, silence, prior access, client assertion, or AI MUST NOT satisfy authority. No live authority-registry selection.",
      Object.freeze([
        "authority_ref",
        "authority_kind",
        "issuing_authority",
        "subject_actor",
        "scope",
        "decision_domain",
        "effective_point",
        "expiry",
        "revocation_state",
        "delegation_metadata",
        "evidence_reference",
        "delegator",
        "delegate",
        "identity_not_authority",
        "role_not_authority",
        "no_live_authority_registry",
      ]),
      2,
    ),
    contract(
      "DecisionRegisterModelConfirmation",
      "Decision Register Model Confirmation",
      "Authoritative confirmation binds human confirmer, proposal, exact proposed effect, authority, evidence, purpose, confirmation identity, and single-use requirement. AI, identity alone, title, role alone, attendance, silence, prior access, or client assertion MUST NOT satisfy confirmation.",
      Object.freeze([
        "human_confirmer",
        "decision_proposal",
        "exact_proposed_effect",
        "authority_ref",
        "evidence_set",
        "purpose",
        "policy_version_ref",
        "confirmation_identity",
        "expiry_metadata",
        "single_use",
        "ai_cannot_confirm",
        "identity_alone_insufficient",
        "title_insufficient",
        "role_alone_insufficient",
        "attendance_insufficient",
        "silence_insufficient",
        "prior_access_insufficient",
        "client_assertion_insufficient",
      ]),
      3,
    ),
    contract(
      "DecisionRegisterModelProvenance",
      "Decision Register Model Provenance",
      "Authoritative and derived states retain producing-event provenance. Derived/projection state cannot create authoritative facts.",
      Object.freeze([
        "producing_event_refs",
        "register_id",
        "sequence_position",
        "actor_ref",
        "authority_ref",
        "evidence_refs",
        "derivation_version",
        "derived_retains_producing_events",
      ]),
      4,
    ),
    contract(
      "DecisionRegisterModelPrivacy",
      "Decision Register Model Privacy",
      "Closed SharedExecutiveRecord, RestrictedExecutiveRecord, and RegulatedOrPrivilegedRecord categories. Private reflection is outside the Decision Register model and MUST NOT be treated as an ordinary DecisionRecord. No automatic promotion, succession, or retention defaults.",
      Object.freeze([
        "SharedExecutiveRecord",
        "RestrictedExecutiveRecord",
        "RegulatedOrPrivilegedRecord",
        "private_reflection_outside_model",
        "no_silent_private_reflection_treatment",
        "no_automatic_promotion",
        "no_retention_defaults",
      ]),
      5,
    ),
    contract(
      "DecisionRegisterModelEvidence",
      "Decision Register Model Evidence",
      "Evidence distinguishes Referenced, VersionPinned, ContentAddressed, Unavailable, and Disputed. Unavailable/missing evidence is not silently accepted. OI-03 remains unresolved regarding which sources require pinning.",
      Object.freeze([
        "Referenced",
        "VersionPinned",
        "ContentAddressed",
        "Unavailable",
        "Disputed",
        "evidence_identity",
        "availability_state",
        "integrity_requirement",
        "unavailable_not_silently_accepted",
      ]),
      6,
    ),
    contract(
      "DecisionRegisterModelProjection",
      "Decision Register Model Projection",
      "Projections require identity/version, source register, sequence range, producing-event refs, derivation version, provenance, staleness, and authority limitations. Projections MUST NOT create authoritative facts, create authority, confirm decisions, hide dispute status, or erase lineage.",
      Object.freeze([
        "projection_identity",
        "projection_version",
        "source_register",
        "source_sequence_range",
        "producing_event_refs",
        "derivation_version",
        "provenance",
        "staleness_metadata",
        "authority_limitations",
        "cannot_create_authoritative_facts",
        "cannot_create_authority",
        "cannot_confirm_decisions",
        "cannot_hide_dispute_status",
        "cannot_erase_lineage",
      ]),
      7,
    ),
    contract(
      "DecisionRegisterModelLineage",
      "Decision Register Model Lineage",
      "Append-only relationships preserve original, challenged, dispute, predecessor, outcome, and disposition references. Reopening requires a new event relationship.",
      Object.freeze([
        "ProposedFrom",
        "ConfirmedBy",
        "Corrects",
        "Disputes",
        "ResolvesDispute",
        "Supersedes",
        "ReferencesOutcome",
        "DerivedFrom",
        "DisposedBy",
        "correction_preserves_original",
        "dispute_preserves_challenged",
        "resolution_preserves_dispute",
        "supersession_preserves_predecessor",
        "disposition_preserves_governance_evidence",
        "reopen_requires_new_event_relationship",
      ]),
      8,
    ),
    contract(
      "DecisionRegisterModelTelemetry",
      "Decision Register Model Telemetry",
      "Routine telemetry excludes decision claims, rationale, evidence content, private/privileged content, restricted titles/snippets, export content, and decrypted values. Allowed metadata remains kind/state/counts/codes/correlation only.",
      Object.freeze([
        "exclude_decision_claims",
        "exclude_rationale",
        "exclude_evidence_content",
        "exclude_private_privileged",
        "exclude_restricted_titles",
        "exclude_export_content",
        "exclude_decrypted_values",
        "allow_entity_kind",
        "allow_lifecycle_state",
        "allow_event_count",
        "allow_sequence_position",
        "allow_projection_version",
        "allow_result_codes",
        "allow_correlation_identity",
      ]),
      9,
    ),
    contract(
      "DecisionRegisterModelAiBoundary",
      "Decision Register Model AI Boundary",
      "AI MUST NOT confirm, create/broaden authority, make proposals authoritative, resolve disputes, supersede/close, disclose restricted material, change retention, dispose, or satisfy human confirmation. AI MAY produce only non-authoritative proposals or derived metadata with provenance.",
      Object.freeze([
        "ai_must_not_confirm",
        "ai_must_not_create_authority",
        "ai_must_not_make_authoritative",
        "ai_must_not_resolve_dispute",
        "ai_must_not_supersede",
        "ai_must_not_close",
        "ai_must_not_disclose",
        "ai_must_not_change_retention",
        "ai_must_not_dispose",
        "ai_must_not_satisfy_confirmation",
        "ai_may_non_authoritative_only",
      ]),
      10,
    ),
  ]);

export const ExecutiveDecisionRegisterModelContractNames = Object.freeze([
  "DecisionRegisterModelEntity",
  "DecisionRegisterModelAuthority",
  "DecisionRegisterModelConfirmation",
  "DecisionRegisterModelProvenance",
  "DecisionRegisterModelPrivacy",
  "DecisionRegisterModelEvidence",
  "DecisionRegisterModelProjection",
  "DecisionRegisterModelLineage",
  "DecisionRegisterModelTelemetry",
  "DecisionRegisterModelAiBoundary",
] as const satisfies readonly ExecutiveDecisionRegisterModelContractName[]);

/** Structural invariants (metadata declarations). */
export const ExecutiveDecisionRegisterModelInvariants = Object.freeze([
  "authoritative_requires_authority_and_human_confirmation",
  "proposal_remains_non_authoritative",
  "ai_proposed_remains_non_authoritative",
  "append_only_lineage",
  "corrections_do_not_erase",
  "projections_cannot_create_authority",
  "private_reflection_outside_model",
  "no_direct_foundation_import",
  "foundation_resolved_via_registry_only",
] as const);
