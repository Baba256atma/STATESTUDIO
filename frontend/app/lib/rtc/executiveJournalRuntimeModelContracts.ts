/**
 * RTC-2:3 — Executive Journal Runtime Model Contracts.
 *
 * Model invariants, provenance, privacy, authority, and projection contracts.
 * Declarations only. No implementation. No UI.
 *
 * Ownership: owned exclusively by RTC-2:3.
 */

export type ExecutiveJournalRuntimeModelContractName =
  | "JournalModelInvariants"
  | "JournalModelProvenance"
  | "JournalModelAuthority"
  | "JournalModelPrivacy"
  | "JournalModelProjection"
  | "JournalModelCorrection"
  | "JournalModelDelegation";

export interface ExecutiveJournalRuntimeModelContractDeclaration {
  readonly contractId:
    `RTC-2:3/Contract/${ExecutiveJournalRuntimeModelContractName}`;
  readonly contractName: ExecutiveJournalRuntimeModelContractName;
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
  contractName: ExecutiveJournalRuntimeModelContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveJournalRuntimeModelContractDeclaration =>
  Object.freeze({
    contractId: `RTC-2:3/Contract/${contractName}` as const,
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
export const ExecutiveJournalRuntimeModelContracts:
  readonly ExecutiveJournalRuntimeModelContractDeclaration[] = Object.freeze([
    contract(
      "JournalModelInvariants",
      "Journal Model Invariants",
      "Append-only accepted history; corrections reference affected state; supersession preserves predecessors; reopen creates a new transition.",
      Object.freeze([
        "append_only_accepted_history",
        "correction_references_affected",
        "corrections_do_not_erase",
        "supersession_preserves_predecessor",
        "reopen_creates_new_transition",
      ]),
      1,
    ),
    contract(
      "JournalModelProvenance",
      "Journal Model Provenance",
      "Every authoritative or derived state identifies producing events, journal identity, sequence, event type/version, recorded time, actor, authority, and evidence where required.",
      Object.freeze([
        "producing_event_refs",
        "journal_id",
        "journal_sequence",
        "event_type",
        "event_version",
        "recorded_at",
        "actor_ref",
        "authority_ref",
        "evidence_refs",
        "projection_version",
      ]),
      2,
    ),
    contract(
      "JournalModelAuthority",
      "Journal Model Authority",
      "Consequential modeled state requires authority_ref. Identity, title, attendance, silence, or AI confidence MUST NOT substitute for authority.",
      Object.freeze([
        "authority_ref",
        "confirmation_source",
        "human_confirmed_required_for_consequential",
        "title_is_not_authority",
        "silence_is_not_authority",
        "ai_confidence_is_not_authority",
      ]),
      3,
    ),
    contract(
      "JournalModelPrivacy",
      "Journal Model Privacy",
      "Private reflection is a distinct record visibility and information category — not a visibility flag on shared content.",
      Object.freeze([
        "record_visibility",
        "information_category",
        "private_reflection_isolated",
        "promotion_required_for_shared_use",
        "training_exclusion_default",
      ]),
      4,
    ),
    contract(
      "JournalModelProjection",
      "Journal Model Projection",
      "Derived projection state remains Derived. Derived state MUST NOT become Authoritative merely by appearing in a projection.",
      Object.freeze([
        "authority_kind",
        "projector_version",
        "source_event_ids",
        "derived_not_authoritative_by_display",
        "explainable_links",
      ]),
      5,
    ),
    contract(
      "JournalModelCorrection",
      "Journal Model Correction",
      "Corrections and disputes preserve original evidence; operational effect updates only through new accepted events.",
      Object.freeze([
        "affected_ref",
        "corrected_claim",
        "reason",
        "authority_ref",
        "dispute_state",
        "original_retained",
      ]),
      6,
    ),
    contract(
      "JournalModelDelegation",
      "Journal Model Delegation",
      "Delegation remains explicit and bounded by delegator, delegate, scope, effective time, expiry, revocation state, and evidence.",
      Object.freeze([
        "delegator",
        "delegate",
        "scope",
        "effective_at",
        "expires_at",
        "revocation_state",
        "evidence_refs",
      ]),
      7,
    ),
  ]);

export const ExecutiveJournalRuntimeModelContractNames = Object.freeze([
  "JournalModelInvariants",
  "JournalModelProvenance",
  "JournalModelAuthority",
  "JournalModelPrivacy",
  "JournalModelProjection",
  "JournalModelCorrection",
  "JournalModelDelegation",
] as const satisfies readonly ExecutiveJournalRuntimeModelContractName[]);

/** Normative model invariants as frozen statements. */
export const ExecutiveJournalRuntimeModelInvariants = Object.freeze([
  "Accepted history is append-only",
  "Corrections reference affected event or entity state",
  "Corrections do not erase or replace historical evidence",
  "Supersession preserves predecessor relationships",
  "Reopening creates a new modeled transition",
  "Consequential state requires authority_ref",
  "Derived projection state is not authoritative by display",
  "Private reflection is structurally separate",
  "AI-proposed state remains AiProposed until HumanConfirmed",
  "Identity, title, attendance, silence, or AI confidence is not authority",
] as const);
