/**
 * EX-2 Tier-0 Synthetic Metadata — deterministic hand-authored fixtures.
 *
 * No clock, randomness, UUIDs, real people, payloads, or private signals.
 * Authorized by EX2-AUTH-T0-2026-07-26-01.
 */

import {
  ExecutiveJournalSyntheticProjectionSchemaVersion,
  ExecutiveJournalSyntheticSourceClassificationValue,
} from "./executiveJournalSyntheticMetadataIdentity.ts";
import type { ExecutiveJournalSyntheticMetadataProjection } from "./executiveJournalSyntheticMetadataTypes.ts";

const fixture = (
  value: ExecutiveJournalSyntheticMetadataProjection,
): ExecutiveJournalSyntheticMetadataProjection => Object.freeze({ ...value });

/**
 * Ordered immutable Tier-0 synthetic fixture catalogue.
 * Internal array order is display/test order only — not canonical journal sequence.
 */
export const ExecutiveJournalSyntheticMetadataFixtures = Object.freeze([
  fixture({
    journal_ref: "syn-journal-001",
    entry_ref: "syn-entry-001",
    entry_category: "Commitment",
    lifecycle_state: "Accepted",
    origin_classification: "HumanOrigin",
    authority_state: "Present",
    provenance_ref: "syn-provenance-001",
    correction_ref: null,
    supersession_ref: null,
    projection_schema_version: ExecutiveJournalSyntheticProjectionSchemaVersion,
    integrity_state: "Verified",
    source_classification: ExecutiveJournalSyntheticSourceClassificationValue,
  }),
  fixture({
    journal_ref: "syn-journal-001",
    entry_ref: "syn-entry-002",
    entry_category: "Risk",
    lifecycle_state: "Proposed",
    origin_classification: "AiProposed",
    authority_state: "Absent",
    provenance_ref: null,
    correction_ref: null,
    supersession_ref: null,
    projection_schema_version: ExecutiveJournalSyntheticProjectionSchemaVersion,
    integrity_state: "Unavailable",
    source_classification: ExecutiveJournalSyntheticSourceClassificationValue,
  }),
  fixture({
    journal_ref: "syn-journal-001",
    entry_ref: "syn-entry-003",
    entry_category: "Exception",
    lifecycle_state: "Accepted",
    origin_classification: "HumanOrigin",
    authority_state: "Present",
    provenance_ref: "syn-provenance-002",
    correction_ref: "syn-correction-001",
    supersession_ref: null,
    projection_schema_version: ExecutiveJournalSyntheticProjectionSchemaVersion,
    integrity_state: "Verified",
    source_classification: ExecutiveJournalSyntheticSourceClassificationValue,
  }),
  fixture({
    journal_ref: "syn-journal-002",
    entry_ref: "syn-entry-004",
    entry_category: "Outcome",
    lifecycle_state: "Superseded",
    origin_classification: "SystemDerived",
    authority_state: "Unavailable",
    provenance_ref: "syn-provenance-003",
    correction_ref: null,
    supersession_ref: "syn-supersession-001",
    projection_schema_version: ExecutiveJournalSyntheticProjectionSchemaVersion,
    integrity_state: "Failed",
    source_classification: ExecutiveJournalSyntheticSourceClassificationValue,
  }),
  fixture({
    journal_ref: "syn-journal-002",
    entry_ref: "syn-entry-005",
    entry_category: "Control",
    lifecycle_state: "Closed",
    origin_classification: "HumanOrigin",
    authority_state: "Present",
    provenance_ref: null,
    correction_ref: null,
    supersession_ref: null,
    projection_schema_version: ExecutiveJournalSyntheticProjectionSchemaVersion,
    integrity_state: "Verified",
    source_classification: ExecutiveJournalSyntheticSourceClassificationValue,
  }),
  fixture({
    journal_ref: "syn-journal-002",
    entry_ref: "syn-entry-006",
    entry_category: "General",
    lifecycle_state: "Disposed",
    origin_classification: "AiProposed",
    authority_state: "Absent",
    provenance_ref: "syn-provenance-004",
    correction_ref: null,
    supersession_ref: null,
    projection_schema_version: ExecutiveJournalSyntheticProjectionSchemaVersion,
    integrity_state: "Unavailable",
    source_classification: ExecutiveJournalSyntheticSourceClassificationValue,
  }),
] as const);

export const ExecutiveJournalSyntheticMetadataFixtureCatalogue =
  Object.freeze({
    catalogueId: "EX-2:T0/SyntheticFixtureCatalogue/v1" as const,
    fixtures: ExecutiveJournalSyntheticMetadataFixtures,
    fixtureCount: ExecutiveJournalSyntheticMetadataFixtures.length,
    handAuthored: true as const,
    deterministic: true as const,
    immutable: true as const,
    usesRuntimeClock: false as const,
    usesRandomness: false as const,
    containsProductionIdentifiers: false as const,
    containsPrivateReflectionSignals: false as const,
    containsEvidenceSignals: false as const,
    containsTimestamps: false as const,
    containsSequencePositions: false as const,
    containsCounts: false as const,
    displayOrderIsNotCanonicalJournalSequence: true as const,
    metadataOnly: true as const,
  });

export const getExecutiveJournalSyntheticMetadataFixtureByEntryRef = (
  entryRef: string,
): ExecutiveJournalSyntheticMetadataProjection | null => {
  const found = ExecutiveJournalSyntheticMetadataFixtures.find(
    (item) => item.entry_ref === entryRef,
  );
  return found ?? null;
};
