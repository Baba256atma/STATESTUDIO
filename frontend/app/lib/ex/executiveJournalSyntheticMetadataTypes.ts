/**
 * EX-2 Tier-0 Synthetic Metadata — closed vocabularies and contracts.
 *
 * EX-owned synthetic display vocabularies only. Do not claim RTC-2 authority.
 * Authorized by EX2-AUTH-T0-2026-07-26-01.
 */

export const ExecutiveJournalSyntheticAllowlistFields = Object.freeze([
  "journal_ref",
  "entry_ref",
  "entry_category",
  "lifecycle_state",
  "origin_classification",
  "authority_state",
  "provenance_ref",
  "correction_ref",
  "supersession_ref",
  "projection_schema_version",
  "integrity_state",
  "source_classification",
] as const);

export type ExecutiveJournalSyntheticAllowlistField =
  (typeof ExecutiveJournalSyntheticAllowlistFields)[number];

export const ExecutiveJournalSyntheticEntryCategories = Object.freeze([
  "Commitment",
  "Risk",
  "Exception",
  "Outcome",
  "Control",
  "General",
] as const);

export type ExecutiveJournalSyntheticEntryCategory =
  (typeof ExecutiveJournalSyntheticEntryCategories)[number];

export const ExecutiveJournalSyntheticLifecycleStates = Object.freeze([
  "Proposed",
  "Accepted",
  "Disputed",
  "Superseded",
  "Closed",
  "Disposed",
] as const);

export type ExecutiveJournalSyntheticLifecycleState =
  (typeof ExecutiveJournalSyntheticLifecycleStates)[number];

export const ExecutiveJournalSyntheticOriginClassifications = Object.freeze([
  "HumanOrigin",
  "AiProposed",
  "SystemDerived",
] as const);

export type ExecutiveJournalSyntheticOriginClassification =
  (typeof ExecutiveJournalSyntheticOriginClassifications)[number];

export const ExecutiveJournalSyntheticAuthorityStates = Object.freeze([
  "Present",
  "Absent",
  "Unavailable",
] as const);

export type ExecutiveJournalSyntheticAuthorityState =
  (typeof ExecutiveJournalSyntheticAuthorityStates)[number];

export const ExecutiveJournalSyntheticIntegrityStates = Object.freeze([
  "Verified",
  "Failed",
  "Unavailable",
] as const);

export type ExecutiveJournalSyntheticIntegrityState =
  (typeof ExecutiveJournalSyntheticIntegrityStates)[number];

export const ExecutiveJournalSyntheticSourceClassifications = Object.freeze([
  "SyntheticSourceOnly",
] as const);

export type ExecutiveJournalSyntheticSourceClassification =
  (typeof ExecutiveJournalSyntheticSourceClassifications)[number];

export const ExecutiveJournalSyntheticProviderResults = Object.freeze([
  "Available",
  "Empty",
  "Denied",
  "Unavailable",
  "Stale",
  "Invalid",
] as const);

export type ExecutiveJournalSyntheticProviderResult =
  (typeof ExecutiveJournalSyntheticProviderResults)[number];

export const ExecutiveJournalSyntheticAdapterResults = Object.freeze([
  "Accepted",
  "Rejected",
] as const);

export type ExecutiveJournalSyntheticAdapterResult =
  (typeof ExecutiveJournalSyntheticAdapterResults)[number];

export const ExecutiveJournalSyntheticAdapterRejectionCodes = Object.freeze([
  "EX2-SYNTH-NOT-OBJECT",
  "EX2-SYNTH-DENIED-FIELD",
  "EX2-SYNTH-UNKNOWN-FIELD",
  "EX2-SYNTH-MISSING-FIELD",
  "EX2-SYNTH-SOURCE-CLASSIFICATION",
  "EX2-SYNTH-SCHEMA-VERSION",
  "EX2-SYNTH-REFERENCE",
  "EX2-SYNTH-ENTRY-CATEGORY",
  "EX2-SYNTH-LIFECYCLE",
  "EX2-SYNTH-ORIGIN",
  "EX2-SYNTH-AUTHORITY",
  "EX2-SYNTH-INTEGRITY",
  "EX2-SYNTH-OPTIONAL-REFERENCE",
] as const);

export type ExecutiveJournalSyntheticAdapterRejectionCode =
  (typeof ExecutiveJournalSyntheticAdapterRejectionCodes)[number];

export const ExecutiveJournalSyntheticViewStates = Object.freeze([
  "Loading",
  "Ready",
  "Empty",
  "NotFound",
  "PrivacyRejected",
  "UnsupportedVersion",
  "IntegrityUnavailable",
  "ProviderUnavailable",
  "Failure",
] as const);

export type ExecutiveJournalSyntheticViewState =
  (typeof ExecutiveJournalSyntheticViewStates)[number];

export const ExecutiveJournalSyntheticDeniedFields = Object.freeze([
  "body",
  "payload",
  "narrative",
  "rationale",
  "private_reflection",
  "private_reflection_exists",
  "private_reflection_count",
  "private_reflection_timestamp",
  "private_reflection_category",
  "evidence",
  "evidence_content",
  "evidence_present",
  "evidence_uri",
  "authority_evidence",
  "actor",
  "actor_ref",
  "actor_name",
  "email",
  "jurisdiction",
  "location",
  "retention",
  "disclosure",
  "export",
  "command",
  "mutation",
  "timestamp",
  "date_bucket",
  "canonical_sequence_position",
  "sparse_sequence_position",
  "raw_source_offset",
  "record_count",
  "projected_entry_count",
  "private_filter_count",
  "telemetry_payload",
  "secret",
  "credential",
  "token",
  "url",
  "infrastructure_id",
  "production_id",
  // Architecture absolute denylist identities (itemId / canonical forms)
  "journal_body",
  "private_reflection_content",
  "private_reflection_identity",
  "private_reflection_existence",
  "resolvable_evidence_uri",
  "actor_pii",
  "jurisdiction_location",
  "retention_instructions",
  "disclosure_export_details",
  "operational_commands",
  "mutation_apis",
  "shareable_entry_category",
  "projection_version",
] as const);

export type ExecutiveJournalSyntheticDeniedField =
  (typeof ExecutiveJournalSyntheticDeniedFields)[number];

export interface ExecutiveJournalSyntheticMetadataProjection {
  readonly journal_ref: string;
  readonly entry_ref: string;
  readonly entry_category: ExecutiveJournalSyntheticEntryCategory;
  readonly lifecycle_state: ExecutiveJournalSyntheticLifecycleState;
  readonly origin_classification: ExecutiveJournalSyntheticOriginClassification;
  readonly authority_state: ExecutiveJournalSyntheticAuthorityState;
  readonly provenance_ref: string | null;
  readonly correction_ref: string | null;
  readonly supersession_ref: string | null;
  readonly projection_schema_version: "ex2-tier0-synthetic-projection/v1";
  readonly integrity_state: ExecutiveJournalSyntheticIntegrityState;
  readonly source_classification: "SyntheticSourceOnly";
}

export type ExecutiveJournalSyntheticProviderListResult =
  | {
      readonly result: "Available";
      readonly projections: readonly ExecutiveJournalSyntheticMetadataProjection[];
    }
  | { readonly result: "Empty" }
  | { readonly result: "Denied" }
  | { readonly result: "Unavailable" }
  | { readonly result: "Stale" }
  | { readonly result: "Invalid" };

export type ExecutiveJournalSyntheticProviderGetResult =
  | {
      readonly result: "Available";
      readonly projection: ExecutiveJournalSyntheticMetadataProjection;
    }
  | { readonly result: "Empty" }
  | { readonly result: "Denied" }
  | { readonly result: "Unavailable" }
  | { readonly result: "Stale" }
  | { readonly result: "Invalid" };

export type ExecutiveJournalSyntheticAdapterOutcome =
  | {
      readonly result: "Accepted";
      readonly projection: ExecutiveJournalSyntheticMetadataProjection;
    }
  | {
      readonly result: "Rejected";
      readonly code: ExecutiveJournalSyntheticAdapterRejectionCode;
      readonly field: string | null;
    };

export interface ExecutiveJournalSyntheticNonProductionMarker {
  readonly classification: "Synthetic";
  readonly tier: "Tier0";
  readonly environment: "NonProduction";
  readonly label: "Synthetic / Tier 0 / Non-production";
}

export type ExecutiveJournalSyntheticViewContract =
  | {
      readonly state: "Loading";
      readonly marker: ExecutiveJournalSyntheticNonProductionMarker;
    }
  | {
      readonly state: "Ready";
      readonly marker: ExecutiveJournalSyntheticNonProductionMarker;
      readonly projections: readonly ExecutiveJournalSyntheticMetadataProjection[];
      readonly displayOrder: readonly string[];
    }
  | {
      readonly state: "Empty";
      readonly marker: ExecutiveJournalSyntheticNonProductionMarker;
    }
  | {
      readonly state: "NotFound";
      readonly marker: ExecutiveJournalSyntheticNonProductionMarker;
    }
  | {
      readonly state: "PrivacyRejected";
      readonly marker: ExecutiveJournalSyntheticNonProductionMarker;
      readonly code: ExecutiveJournalSyntheticAdapterRejectionCode;
    }
  | {
      readonly state: "UnsupportedVersion";
      readonly marker: ExecutiveJournalSyntheticNonProductionMarker;
    }
  | {
      readonly state: "IntegrityUnavailable";
      readonly marker: ExecutiveJournalSyntheticNonProductionMarker;
      readonly projection: ExecutiveJournalSyntheticMetadataProjection;
    }
  | {
      readonly state: "ProviderUnavailable";
      readonly marker: ExecutiveJournalSyntheticNonProductionMarker;
    }
  | {
      readonly state: "Failure";
      readonly marker: ExecutiveJournalSyntheticNonProductionMarker;
    };

export const ExecutiveJournalSyntheticProviderModes = Object.freeze([
  "Normal",
  "Empty",
  "Denied",
  "Unavailable",
  "Stale",
] as const);

export type ExecutiveJournalSyntheticProviderMode =
  (typeof ExecutiveJournalSyntheticProviderModes)[number];

/** Immutable allowlist coverage table — order and membership must match production. */
export const ExecutiveJournalSyntheticAllowlistFieldCoverage = Object.freeze(
  ExecutiveJournalSyntheticAllowlistFields.map((field, index) =>
    Object.freeze({
      field,
      index,
      required: true as const,
      allowed: true as const,
    }),
  ),
);

/** Immutable denylist coverage table — every production denied field. */
export const ExecutiveJournalSyntheticDenylistFieldCoverage = Object.freeze(
  ExecutiveJournalSyntheticDeniedFields.map((field) =>
    Object.freeze({
      field,
      requiredRejectionCode: "EX2-SYNTH-DENIED-FIELD" as const,
      wholeProjectionRejection: true as const,
      noPayloadEcho: true as const,
    }),
  ),
);

/** Immutable rejection-code coverage table — every production code. */
export const ExecutiveJournalSyntheticRejectionCodeCoverage = Object.freeze(
  ExecutiveJournalSyntheticAdapterRejectionCodes.map((code) =>
    Object.freeze({
      code,
      result: "Rejected" as const,
      acceptedProjectionForbidden: true as const,
    }),
  ),
);

/** Architecture denylist itemId → package denied field (explicit, no silent divergence). */
export const ExecutiveJournalSyntheticArchitectureDenylistMapping =
  Object.freeze([
    Object.freeze({
      architectureItemId: "journal_body",
      packageField: "journal_body",
    }),
    Object.freeze({
      architectureItemId: "narrative",
      packageField: "narrative",
    }),
    Object.freeze({
      architectureItemId: "rationale",
      packageField: "rationale",
    }),
    Object.freeze({
      architectureItemId: "private_reflection_content",
      packageField: "private_reflection_content",
    }),
    Object.freeze({
      architectureItemId: "private_reflection_identity",
      packageField: "private_reflection_identity",
    }),
    Object.freeze({
      architectureItemId: "private_reflection_timestamp",
      packageField: "private_reflection_timestamp",
    }),
    Object.freeze({
      architectureItemId: "private_reflection_count",
      packageField: "private_reflection_count",
    }),
    Object.freeze({
      architectureItemId: "private_reflection_existence",
      packageField: "private_reflection_existence",
    }),
    Object.freeze({
      architectureItemId: "evidence_content",
      packageField: "evidence_content",
    }),
    Object.freeze({
      architectureItemId: "resolvable_evidence_uri",
      packageField: "resolvable_evidence_uri",
    }),
    Object.freeze({
      architectureItemId: "authority_evidence",
      packageField: "authority_evidence",
    }),
    Object.freeze({
      architectureItemId: "actor_pii",
      packageField: "actor_pii",
    }),
    Object.freeze({
      architectureItemId: "jurisdiction_location",
      packageField: "jurisdiction_location",
    }),
    Object.freeze({
      architectureItemId: "retention_instructions",
      packageField: "retention_instructions",
    }),
    Object.freeze({
      architectureItemId: "disclosure_export_details",
      packageField: "disclosure_export_details",
    }),
    Object.freeze({
      architectureItemId: "operational_commands",
      packageField: "operational_commands",
    }),
    Object.freeze({
      architectureItemId: "mutation_apis",
      packageField: "mutation_apis",
    }),
  ] as const);

/** Package-local denied fields beyond architecture itemIds (task + synthetic exclusions). */
export const ExecutiveJournalSyntheticPackageLocalDeniedFields = Object.freeze([
  "body",
  "payload",
  "private_reflection",
  "private_reflection_exists",
  "private_reflection_category",
  "evidence",
  "evidence_present",
  "evidence_uri",
  "actor",
  "actor_ref",
  "actor_name",
  "email",
  "jurisdiction",
  "location",
  "retention",
  "disclosure",
  "export",
  "command",
  "mutation",
  "timestamp",
  "date_bucket",
  "canonical_sequence_position",
  "sparse_sequence_position",
  "raw_source_offset",
  "record_count",
  "projected_entry_count",
  "private_filter_count",
  "telemetry_payload",
  "secret",
  "credential",
  "token",
  "url",
  "infrastructure_id",
  "production_id",
  "shareable_entry_category",
  "projection_version",
] as const);

export const ExecutiveJournalSyntheticCertificationGateResults = Object.freeze([
  "Pass",
  "Fail",
  "NotEvaluated",
  "DisclosureOnly",
] as const);

export type ExecutiveJournalSyntheticCertificationGateResult =
  (typeof ExecutiveJournalSyntheticCertificationGateResults)[number];

export const ExecutiveJournalSyntheticCertificationGateIds = Object.freeze([
  "C-01",
  "C-02",
  "C-03",
  "C-04",
  "C-05",
  "C-06",
  "C-07",
  "C-08",
  "C-09",
  "C-10",
  "C-11",
  "C-12",
  "C-13",
  "C-14",
  "C-15",
  "C-16",
  "C-17",
  "C-18",
  "C-19",
  "C-20",
  "C-21",
  "C-22",
  "C-23",
  "C-24",
  "C-25",
] as const);

export type ExecutiveJournalSyntheticCertificationGateId =
  (typeof ExecutiveJournalSyntheticCertificationGateIds)[number];
