/**
 * RTC-3:1 — Executive Decision Register Contracts.
 *
 * Immutable public contract declarations for decision, authority, provenance,
 * evidence, privacy, AI, projection, and telemetry boundaries.
 * Declarations only. No implementation.
 *
 * Ownership: owned exclusively by RTC-3:1.
 */

import type {
  ExecutiveDecisionRegisterContractDeclaration,
  ExecutiveDecisionRegisterContractName,
  ExecutiveDecisionRegisterDecisionDescriptorFieldFlags,
} from "./executiveDecisionRegisterTypes.ts";

const contract = (
  contractName: ExecutiveDecisionRegisterContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveDecisionRegisterContractDeclaration =>
  Object.freeze({
    contractId: `RTC-3:1/Contract/${contractName}` as const,
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

/** Required metadata fields on a canonical decision descriptor. */
export const ExecutiveDecisionRegisterDecisionDescriptorFields:
  ExecutiveDecisionRegisterDecisionDescriptorFieldFlags = Object.freeze({
    decisionIdentity: true as const,
    journalOrRegisterIdentity: true as const,
    decisionState: true as const,
    claimSchemaReference: true as const,
    actorReference: true as const,
    authorityReference: true as const,
    purpose: true as const,
    classification: true as const,
    recordCategory: true as const,
    effectivePoint: true as const,
    evidenceReferences: true as const,
    alternativesReferences: true as const,
    rationaleReference: true as const,
    constraintReferences: true as const,
    causationReference: true as const,
    correlationReference: true as const,
    producingEventReferences: true as const,
    predecessorOrSupersessionReferences: true as const,
    disputeReferences: true as const,
    outcomeReferences: true as const,
    integrityRequirements: true as const,
    containsDecisionPayload: false as const,
  });

export const ExecutiveDecisionRegisterDecisionDescriptorFieldNames =
  Object.freeze([
    "decision_id",
    "register_id",
    "decision_state",
    "claim_schema_ref",
    "actor_ref",
    "authority_ref",
    "purpose",
    "classification",
    "record_category",
    "effective_point",
    "evidence_refs",
    "alternatives_refs",
    "rationale_ref",
    "constraint_refs",
    "causation_ref",
    "correlation_ref",
    "producing_event_refs",
    "predecessor_ref",
    "supersession_ref",
    "original_decision_ref",
    "correction_of_event_ref",
    "dispute_refs",
    "active_dispute_ref",
    "outcome_refs",
    "integrity_requirements",
  ] as const);

/**
 * Public Decision Register contracts exposed by Foundation.
 * Order is deterministic and immutable.
 */
export const ExecutiveDecisionRegisterContracts:
  readonly ExecutiveDecisionRegisterContractDeclaration[] = Object.freeze([
    contract(
      "DecisionRecord",
      "ExecutiveDecisionRecordDescriptor",
      "Canonical decision descriptor metadata without claim payloads. Append-only lineage fields required.",
      ExecutiveDecisionRegisterDecisionDescriptorFieldNames,
      1,
    ),
    contract(
      "DecisionAuthority",
      "ExecutiveDecisionAuthorityBoundary",
      "Consequential states require authority_ref. Title, silence, AI confidence, and client assertion never substitute for authority. Delegation must declare delegator, delegate, scope, effective point, expiry, revocation, and evidence.",
      Object.freeze([
        "authority_ref",
        "delegator_ref",
        "delegate_ref",
        "scope",
        "effective_point",
        "expiry",
        "revocation_state",
        "evidence_ref",
        "non_substitutes",
      ]),
      2,
    ),
    contract(
      "DecisionConfirmation",
      "ExecutiveDecisionHumanConfirmationBoundary",
      "Only an authorized human may confirm. Confirmation binds exact actor, proposal, claim, authority, evidence set, intended effect, and policy version when applicable.",
      Object.freeze([
        "actor_kind",
        "actor_ref",
        "proposal_ref",
        "claim_schema_ref",
        "authority_ref",
        "evidence_set_ref",
        "intended_effect",
        "policy_version",
        "human_only",
      ]),
      3,
    ),
    contract(
      "DecisionProvenance",
      "ExecutiveDecisionProvenanceBoundary",
      "Every authoritative or derived fact retains producing-event, actor, and authority provenance. Corrections and supersessions preserve lineage.",
      Object.freeze([
        "producing_event_refs",
        "actor_ref",
        "authority_ref",
        "predecessor_ref",
        "supersession_ref",
        "causation_ref",
        "correlation_ref",
      ]),
      4,
    ),
    contract(
      "DecisionEvidence",
      "ExecutiveDecisionEvidenceBoundary",
      "Distinguishes evidence reference, version-pinned, content-addressed, unavailable, and disputed evidence. Missing evidence remains visible.",
      Object.freeze([
        "evidence_kind",
        "evidence_ref",
        "version_pin",
        "content_address",
        "unavailable",
        "disputed",
        "missing_visible",
      ]),
      5,
    ),
    contract(
      "DecisionPrivacy",
      "ExecutiveDecisionPrivacyBoundary",
      "Closed privacy categories for shared, restricted, and regulated/privileged records. Private reflection must not silently become a Decision Register record.",
      Object.freeze([
        "privacy_category",
        "classification",
        "record_category",
        "private_reflection_silent_promotion_forbidden",
        "promotion_requires_human_and_authority",
      ]),
      6,
    ),
    contract(
      "DecisionAiBoundary",
      "ExecutiveDecisionAiBoundary",
      "AI may draft and assist. AI must not confirm, create authority, resolve disputes, supersede, close, disclose restricted material, change retention, or dispose.",
      Object.freeze([
        "ai_may",
        "ai_must_not",
        "ai_output_non_authoritative",
        "ai_cannot_confirm",
        "ai_cannot_create_authority",
      ]),
      7,
    ),
    contract(
      "DecisionProjection",
      "ExecutiveDecisionProjectionBoundary",
      "Declared projections are derived views only. They never create authoritative facts and must retain producing-event provenance.",
      Object.freeze([
        "projection_name",
        "derived_only",
        "producing_event_provenance_required",
        "cannot_create_authority",
        "not_implemented_in_foundation",
      ]),
      8,
    ),
    contract(
      "DecisionTelemetry",
      "ExecutiveDecisionTelemetryBoundary",
      "Routine telemetry excludes claim, rationale, evidence content, restricted titles, private content, export content, and decrypted values.",
      Object.freeze([
        "allowed_event_kind",
        "allowed_decision_state",
        "allowed_entity_count",
        "allowed_sequence_position",
        "allowed_result_codes",
        "allowed_correlation_identity",
        "forbidden_payloads",
      ]),
      9,
    ),
  ]);

export const ExecutiveDecisionRegisterContractNames = Object.freeze([
  "DecisionRecord",
  "DecisionAuthority",
  "DecisionConfirmation",
  "DecisionProvenance",
  "DecisionEvidence",
  "DecisionPrivacy",
  "DecisionAiBoundary",
  "DecisionProjection",
  "DecisionTelemetry",
] as const);

/** Authority non-substitutes. */
export const ExecutiveDecisionRegisterAuthorityNonSubstitutes = Object.freeze([
  "Identity",
  "Job title",
  "Organizational role alone",
  "Meeting attendance",
  "Silence",
  "AI confidence",
  "Prior access",
  "Client assertion",
] as const);

/** AI MAY capabilities. */
export const ExecutiveDecisionRegisterAiMay = Object.freeze([
  "Draft a decision proposal",
  "Summarize evidence",
  "Identify alternatives",
  "Identify missing metadata",
  "Suggest relationships",
  "Produce non-authoritative derived material",
] as const);

/** AI MUST NOT capabilities. */
export const ExecutiveDecisionRegisterAiMustNot = Object.freeze([
  "Confirm a decision",
  "Create or broaden authority",
  "Make a proposal authoritative",
  "Resolve a dispute",
  "Supersede an effective decision",
  "Close a decision",
  "Disclose restricted material",
  "Change retention",
  "Dispose a record",
  "Satisfy human confirmation",
] as const);

/** Declared projection surfaces (not implemented). */
export const ExecutiveDecisionRegisterProjectionNames = Object.freeze([
  "CurrentDecisionRegister",
  "DecisionTimeline",
  "SupersessionChain",
  "DisputeRegister",
  "DecisionOutcomeRelationshipView",
  "AuthorityAndConfirmationEvidenceView",
] as const);

/** Telemetry forbidden content classes. */
export const ExecutiveDecisionRegisterTelemetryForbidden = Object.freeze([
  "Decision claim payload",
  "Rationale payload",
  "Evidence content",
  "Restricted title",
  "Private content",
  "Export content",
  "Decrypted values",
] as const);

/** Telemetry allowed metadata classes. */
export const ExecutiveDecisionRegisterTelemetryAllowed = Object.freeze([
  "Event kind",
  "Decision state",
  "Entity count",
  "Sequence position",
  "Validation-result code",
  "Policy-result code",
  "Integrity-result code",
  "Correlation identity",
] as const);

/** Append-only semantic rules. */
export const ExecutiveDecisionRegisterAppendOnlyRules = Object.freeze([
  "Accepted decisions are append-only.",
  "Corrections create new events.",
  "Corrections require the original decision and event references.",
  "Corrections do not erase original claims.",
  "Supersession preserves predecessor relationships.",
  "Disputes preserve the challenged decision.",
  "Resolution creates a new event.",
  "Resolution preserves the active dispute reference.",
  "Reopening creates a new lifecycle event.",
  "Disposition preserves governance evidence.",
  "Current-state projections remain derivable from event history.",
] as const);

/** Private-reflection promotion requirements (contract only). */
export const ExecutiveDecisionRegisterPrivateReflectionPromotionRequirements =
  Object.freeze([
    "Explicit selection",
    "Human confirmation",
    "Authority",
    "New shared event",
    "Preserved source provenance",
  ] as const);
