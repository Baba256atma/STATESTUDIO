/**
 * RTC-2:1 — Executive Journal Runtime Contracts.
 *
 * Immutable public runtime contract declarations from RTC-2:1.
 * Declarations only. No implementation. No UI. No React. No Next.js.
 *
 * Ownership: owned exclusively by RTC-2:1.
 */

import type {
  ExecutiveJournalRuntimeContractDeclaration,
  ExecutiveJournalRuntimeContractName,
  ExecutiveJournalSectionDeclaration,
  ExecutiveJournalSectionName,
} from "./executiveJournalRuntimeTypes.ts";

const contract = (
  contractName: ExecutiveJournalRuntimeContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveJournalRuntimeContractDeclaration =>
  Object.freeze({
    contractId: `RTC-2:1/Contract/${contractName}` as const,
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

const section = (
  sectionName: ExecutiveJournalSectionName,
  description: string,
  order: number,
): ExecutiveJournalSectionDeclaration =>
  Object.freeze({
    sectionId: `RTC-2:1/Section/${sectionName}` as const,
    sectionName,
    description,
    required: true as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Logical architecture layers (§2.1).
 */
export const ExecutiveJournalRuntimeSections:
  readonly ExecutiveJournalSectionDeclaration[] = Object.freeze([
    section(
      "CaptureAdapters",
      "Normalize inputs from journal UI, meeting workflows, APIs, and approved connectors. MUST NOT treat raw transcript or model output as an accepted decision.",
      1,
    ),
    section(
      "PolicyAuthorityGate",
      "Authenticate actor; resolve mandate; evaluate purpose, sensitivity, consent, and jurisdiction. MUST NOT invent or broaden authority.",
      2,
    ),
    section(
      "EventWriter",
      "Assign journal sequence; seal integrity metadata; persist idempotently. MUST NOT mutate or overwrite accepted events.",
      3,
    ),
    section(
      "CanonicalEventStore",
      "Retain the ordered, tamper-evident record and retention state. MUST NOT serve unfiltered business views directly.",
      4,
    ),
    section(
      "ProjectionEngine",
      "Build decision, commitment, risk, and outcome views; support replay. MUST NOT create facts absent from events.",
      5,
    ),
    section(
      "QueryExportPlane",
      "Enforce row/field policy, redaction, purpose binding, and export watermarking. MUST NOT bypass policy for convenience.",
      6,
    ),
    section(
      "OperationsPlane",
      "Observe health, verify integrity, manage keys, recovery, and approved disposition. MUST NOT expose journal content in ordinary telemetry.",
      7,
    ),
  ]);

/**
 * Public runtime contracts exposed by Foundation.
 * Order is deterministic and immutable.
 */
export const ExecutiveJournalRuntimeContracts:
  readonly ExecutiveJournalRuntimeContractDeclaration[] = Object.freeze([
    contract(
      "JournalEventEnvelope",
      "Journal Event Envelope",
      "Required immutable envelope for every accepted event (§3.1). An accepted event MUST be attributable, ordered, policy-labeled, and integrity-sealed.",
      Object.freeze([
        "event_id",
        "journal_id",
        "sequence",
        "event_type",
        "version",
        "occurred_at",
        "recorded_at",
        "actor",
        "on_behalf_of",
        "authority_ref",
        "classification",
        "purpose",
        "payload",
        "evidence_refs",
        "causation",
        "correlation",
        "integrity",
        "idempotency_key",
      ]),
      1,
    ),
    contract(
      "JournalAuthority",
      "Journal Authority",
      "Identity answers who the actor is; authority answers what they may decide, delegate, disclose, or attest (§4.1). Title is not a universal grant.",
      Object.freeze([
        "identity",
        "authority_ref",
        "delegation",
        "dual_control",
        "break_glass",
        "service_authority",
        "attestation",
        "scope_organization",
        "scope_domain",
        "scope_purpose",
        "scope_time",
        "scope_action",
      ]),
      2,
    ),
    contract(
      "JournalInformationClass",
      "Journal Information Class",
      "Private reflection is a distinct record category, not a visibility flag (§4.2). Categories govern audience and key treatment.",
      Object.freeze([
        "information_class",
        "default_audience",
        "encryption_treatment",
        "index_isolation",
        "promotion_required",
        "training_exclusion_default",
      ]),
      3,
    ),
    contract(
      "JournalProjection",
      "Journal Projection",
      "Deterministic projections rebuilt from accepted events. Every displayed fact MUST link to producing events and evidence (§1.4, §5.1).",
      Object.freeze([
        "projection_id",
        "projector_version",
        "source_event_ids",
        "evidence_refs",
        "freshness",
        "staleness_flag",
        "deterministic_replay",
      ]),
      4,
    ),
    contract(
      "JournalDisclosure",
      "Journal Disclosure",
      "Purpose, role, sensitivity, and jurisdiction controls on every read/export (§1.1 Disclose). Fail closed when policy is unavailable.",
      Object.freeze([
        "purpose",
        "role",
        "sensitivity",
        "jurisdiction",
        "redaction",
        "export_watermark",
        "access_decision_id",
        "policy_version",
      ]),
      5,
    ),
    contract(
      "JournalCorrection",
      "Journal Correction",
      "Corrections are new events. Original evidence remains for authorized reviewers; disputes stay explicit until resolution (§3.3).",
      Object.freeze([
        "affected_event_id",
        "corrected_claim",
        "reason",
        "authority_ref",
        "dispute_state",
        "original_retained",
      ]),
      6,
    ),
    contract(
      "JournalIntegrity",
      "Journal Integrity",
      "Hash chaining, writer signature, key version, and replay verification (§3.1 integrity, §5.1).",
      Object.freeze([
        "event_hash",
        "previous_hash",
        "writer_signature",
        "key_version",
        "sequence_continuity",
        "schema_version",
        "replay_verification",
      ]),
      7,
    ),
    contract(
      "JournalAiBoundary",
      "Journal AI Boundary",
      "NON-DELEGABLE: models may summarize, classify, propose links, and draft candidates. They MUST NOT confirm decisions, create authority, close commitments, disclose restricted material, or alter retention (§4.3).",
      Object.freeze([
        "proposal_label",
        "model_version",
        "prompt_policy",
        "source_set",
        "confirmation_required",
        "private_reflection_excluded",
        "autonomous_authority_forbidden",
      ]),
      8,
    ),
  ]);

export const ExecutiveJournalRuntimeContractNames = Object.freeze([
  "JournalEventEnvelope",
  "JournalAuthority",
  "JournalInformationClass",
  "JournalProjection",
  "JournalDisclosure",
  "JournalCorrection",
  "JournalIntegrity",
  "JournalAiBoundary",
] as const satisfies readonly ExecutiveJournalRuntimeContractName[]);

export const ExecutiveJournalRuntimeSectionNames = Object.freeze([
  "CaptureAdapters",
  "PolicyAuthorityGate",
  "EventWriter",
  "CanonicalEventStore",
  "ProjectionEngine",
  "QueryExportPlane",
  "OperationsPlane",
] as const satisfies readonly ExecutiveJournalSectionName[]);
