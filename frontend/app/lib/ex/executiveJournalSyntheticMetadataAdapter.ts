/**
 * EX-2 Tier-0 Synthetic Metadata — pure fail-closed privacy projection adapter.
 *
 * Whole-projection rejection. No silent strip/repair. No mutation/network/telemetry.
 * Authorized by EX2-AUTH-T0-2026-07-26-01.
 */

import {
  ExecutiveJournalSyntheticProjectionSchemaVersion,
  isExecutiveJournalSyntheticSafeReference,
} from "./executiveJournalSyntheticMetadataIdentity.ts";
import {
  ExecutiveJournalSyntheticAllowlistFields,
  ExecutiveJournalSyntheticAuthorityStates,
  ExecutiveJournalSyntheticDeniedFields,
  ExecutiveJournalSyntheticEntryCategories,
  ExecutiveJournalSyntheticIntegrityStates,
  ExecutiveJournalSyntheticLifecycleStates,
  ExecutiveJournalSyntheticOriginClassifications,
  type ExecutiveJournalSyntheticAdapterOutcome,
  type ExecutiveJournalSyntheticAdapterRejectionCode,
  type ExecutiveJournalSyntheticMetadataProjection,
} from "./executiveJournalSyntheticMetadataTypes.ts";

const rejected = (
  code: ExecutiveJournalSyntheticAdapterRejectionCode,
  field: string | null = null,
): ExecutiveJournalSyntheticAdapterOutcome =>
  Object.freeze({
    result: "Rejected" as const,
    code,
    field,
  });

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object"
  && value !== null
  && !Array.isArray(value);

const includesClosed = <T extends string>(
  catalogue: readonly T[],
  value: unknown,
): value is T => typeof value === "string" && (catalogue as readonly string[]).includes(value);

/**
 * Validate unknown input and produce an approved projection or fail closed.
 *
 * Precedence:
 * 1 shape → 2 exact field set → 3 denylist → 4 unknown → 5 required →
 * 6 source → 7 schema → 8 references → 9 closed values → 10 optional refs →
 * 11 immutable projection.
 */
export const adaptExecutiveJournalSyntheticMetadata = (
  input: unknown,
): ExecutiveJournalSyntheticAdapterOutcome => {
  if (!isPlainObject(input)) {
    return rejected("EX2-SYNTH-NOT-OBJECT");
  }

  const keys = Object.keys(input);

  for (const key of keys) {
    if (
      (ExecutiveJournalSyntheticDeniedFields as readonly string[]).includes(key)
    ) {
      return rejected("EX2-SYNTH-DENIED-FIELD", key);
    }
  }

  for (const key of keys) {
    if (
      !(
        ExecutiveJournalSyntheticAllowlistFields as readonly string[]
      ).includes(key)
    ) {
      return rejected("EX2-SYNTH-UNKNOWN-FIELD", key);
    }
  }

  if (keys.length !== ExecutiveJournalSyntheticAllowlistFields.length) {
    for (const required of ExecutiveJournalSyntheticAllowlistFields) {
      if (!(required in input)) {
        return rejected("EX2-SYNTH-MISSING-FIELD", required);
      }
    }
  }

  for (const required of ExecutiveJournalSyntheticAllowlistFields) {
    if (!(required in input)) {
      return rejected("EX2-SYNTH-MISSING-FIELD", required);
    }
  }

  const source = input.source_classification;
  if (source !== "SyntheticSourceOnly") {
    return rejected("EX2-SYNTH-SOURCE-CLASSIFICATION", "source_classification");
  }

  if (
    input.projection_schema_version
      !== ExecutiveJournalSyntheticProjectionSchemaVersion
  ) {
    return rejected("EX2-SYNTH-SCHEMA-VERSION", "projection_schema_version");
  }

  if (!isExecutiveJournalSyntheticSafeReference(input.journal_ref)) {
    return rejected("EX2-SYNTH-REFERENCE", "journal_ref");
  }
  if (!isExecutiveJournalSyntheticSafeReference(input.entry_ref)) {
    return rejected("EX2-SYNTH-REFERENCE", "entry_ref");
  }
  if (
    typeof input.entry_ref === "string"
    && !input.entry_ref.startsWith("syn-entry-")
  ) {
    return rejected("EX2-SYNTH-REFERENCE", "entry_ref");
  }
  if (
    typeof input.journal_ref === "string"
    && !input.journal_ref.startsWith("syn-journal-")
  ) {
    return rejected("EX2-SYNTH-REFERENCE", "journal_ref");
  }

  if (!includesClosed(ExecutiveJournalSyntheticEntryCategories, input.entry_category)) {
    return rejected("EX2-SYNTH-ENTRY-CATEGORY", "entry_category");
  }
  if (!includesClosed(ExecutiveJournalSyntheticLifecycleStates, input.lifecycle_state)) {
    return rejected("EX2-SYNTH-LIFECYCLE", "lifecycle_state");
  }
  if (
    !includesClosed(
      ExecutiveJournalSyntheticOriginClassifications,
      input.origin_classification,
    )
  ) {
    return rejected("EX2-SYNTH-ORIGIN", "origin_classification");
  }
  if (
    !includesClosed(ExecutiveJournalSyntheticAuthorityStates, input.authority_state)
  ) {
    return rejected("EX2-SYNTH-AUTHORITY", "authority_state");
  }
  if (
    !includesClosed(ExecutiveJournalSyntheticIntegrityStates, input.integrity_state)
  ) {
    return rejected("EX2-SYNTH-INTEGRITY", "integrity_state");
  }

  for (const optionalField of [
    "provenance_ref",
    "correction_ref",
    "supersession_ref",
  ] as const) {
    const value = input[optionalField];
    if (value === null) {
      continue;
    }
    if (!isExecutiveJournalSyntheticSafeReference(value)) {
      return rejected("EX2-SYNTH-OPTIONAL-REFERENCE", optionalField);
    }
    if (
      optionalField === "provenance_ref"
      && !value.startsWith("syn-provenance-")
    ) {
      return rejected("EX2-SYNTH-OPTIONAL-REFERENCE", optionalField);
    }
    if (
      optionalField === "correction_ref"
      && !value.startsWith("syn-correction-")
    ) {
      return rejected("EX2-SYNTH-OPTIONAL-REFERENCE", optionalField);
    }
    if (
      optionalField === "supersession_ref"
      && !value.startsWith("syn-supersession-")
    ) {
      return rejected("EX2-SYNTH-OPTIONAL-REFERENCE", optionalField);
    }
  }

  const projection: ExecutiveJournalSyntheticMetadataProjection = Object.freeze({
    journal_ref: input.journal_ref as string,
    entry_ref: input.entry_ref as string,
    entry_category: input.entry_category as ExecutiveJournalSyntheticMetadataProjection["entry_category"],
    lifecycle_state: input.lifecycle_state as ExecutiveJournalSyntheticMetadataProjection["lifecycle_state"],
    origin_classification:
      input.origin_classification as ExecutiveJournalSyntheticMetadataProjection["origin_classification"],
    authority_state:
      input.authority_state as ExecutiveJournalSyntheticMetadataProjection["authority_state"],
    provenance_ref: input.provenance_ref as string | null,
    correction_ref: input.correction_ref as string | null,
    supersession_ref: input.supersession_ref as string | null,
    projection_schema_version: ExecutiveJournalSyntheticProjectionSchemaVersion,
    integrity_state:
      input.integrity_state as ExecutiveJournalSyntheticMetadataProjection["integrity_state"],
    source_classification: "SyntheticSourceOnly",
  });

  return Object.freeze({
    result: "Accepted" as const,
    projection,
  });
};

export const ExecutiveJournalSyntheticMetadataAdapterContract = Object.freeze({
  adapterId: "EX-2:T0/ExecutiveJournalSyntheticMetadataPrivacyAdapter" as const,
  allowlistFields: ExecutiveJournalSyntheticAllowlistFields,
  deniedFields: ExecutiveJournalSyntheticDeniedFields,
  wholeProjectionRejection: true as const,
  silentFieldStripping: false as const,
  silentRepair: false as const,
  mutatesInput: false as const,
  networked: false as const,
  persistent: false as const,
  emitsTelemetry: false as const,
  createsAuthority: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});
