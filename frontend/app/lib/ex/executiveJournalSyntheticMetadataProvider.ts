/**
 * EX-2 Tier-0 Synthetic Metadata — non-networked in-memory fake provider.
 *
 * Pure read operations only. No network, persistence, RTC-2, clock, or telemetry.
 * Authorized by EX2-AUTH-T0-2026-07-26-01.
 */

import {
  ExecutiveJournalSyntheticProjectionSchemaVersion,
  ExecutiveJournalSyntheticProviderVersion,
  ExecutiveJournalSyntheticSourceClassificationValue,
  isExecutiveJournalSyntheticSafeReference,
} from "./executiveJournalSyntheticMetadataIdentity.ts";
import {
  ExecutiveJournalSyntheticMetadataFixtureCatalogue,
  ExecutiveJournalSyntheticMetadataFixtures,
  getExecutiveJournalSyntheticMetadataFixtureByEntryRef,
} from "./executiveJournalSyntheticMetadataFixtures.ts";
import type {
  ExecutiveJournalSyntheticMetadataProjection,
  ExecutiveJournalSyntheticProviderGetResult,
  ExecutiveJournalSyntheticProviderListResult,
  ExecutiveJournalSyntheticProviderMode,
} from "./executiveJournalSyntheticMetadataTypes.ts";

export interface ExecutiveJournalSyntheticMetadataProvider {
  readonly mode: ExecutiveJournalSyntheticProviderMode;
  readonly listSyntheticJournalMetadata: () => ExecutiveJournalSyntheticProviderListResult;
  readonly getSyntheticJournalMetadataByRef: (
    entryRef: string,
  ) => ExecutiveJournalSyntheticProviderGetResult;
  readonly getSyntheticProviderVersion: () => typeof ExecutiveJournalSyntheticProviderVersion;
  readonly getSyntheticProjectionSchemaVersion: () =>
    typeof ExecutiveJournalSyntheticProjectionSchemaVersion;
  readonly getSyntheticSourceClassification: () =>
    typeof ExecutiveJournalSyntheticSourceClassificationValue;
}

const freezeProjection = (
  projection: ExecutiveJournalSyntheticMetadataProjection,
): ExecutiveJournalSyntheticMetadataProjection =>
  Object.freeze({
    journal_ref: projection.journal_ref,
    entry_ref: projection.entry_ref,
    entry_category: projection.entry_category,
    lifecycle_state: projection.lifecycle_state,
    origin_classification: projection.origin_classification,
    authority_state: projection.authority_state,
    provenance_ref: projection.provenance_ref,
    correction_ref: projection.correction_ref,
    supersession_ref: projection.supersession_ref,
    projection_schema_version: projection.projection_schema_version,
    integrity_state: projection.integrity_state,
    source_classification: projection.source_classification,
  });

export const createExecutiveJournalSyntheticMetadataProvider = (
  mode: ExecutiveJournalSyntheticProviderMode = "Normal",
): ExecutiveJournalSyntheticMetadataProvider => {
  const listSyntheticJournalMetadata =
    (): ExecutiveJournalSyntheticProviderListResult => {
      if (mode === "Empty") {
        return Object.freeze({ result: "Empty" as const });
      }
      if (mode === "Denied") {
        return Object.freeze({ result: "Denied" as const });
      }
      if (mode === "Unavailable") {
        return Object.freeze({ result: "Unavailable" as const });
      }
      if (mode === "Stale") {
        return Object.freeze({ result: "Stale" as const });
      }
      return Object.freeze({
        result: "Available" as const,
        projections: Object.freeze(
          ExecutiveJournalSyntheticMetadataFixtures.map((item) =>
            freezeProjection(item),
          ),
        ),
      });
    };

  const getSyntheticJournalMetadataByRef = (
    entryRef: string,
  ): ExecutiveJournalSyntheticProviderGetResult => {
    if (mode === "Empty") {
      return Object.freeze({ result: "Empty" as const });
    }
    if (mode === "Denied") {
      return Object.freeze({ result: "Denied" as const });
    }
    if (mode === "Unavailable") {
      return Object.freeze({ result: "Unavailable" as const });
    }
    if (mode === "Stale") {
      return Object.freeze({ result: "Stale" as const });
    }
    if (typeof entryRef !== "string" || entryRef.length === 0) {
      return Object.freeze({ result: "Invalid" as const });
    }
    if (!isExecutiveJournalSyntheticSafeReference(entryRef)) {
      return Object.freeze({ result: "Invalid" as const });
    }
    if (!entryRef.startsWith("syn-entry-")) {
      return Object.freeze({ result: "Denied" as const });
    }
    const found = getExecutiveJournalSyntheticMetadataFixtureByEntryRef(entryRef);
    if (!found) {
      return Object.freeze({ result: "Denied" as const });
    }
    return Object.freeze({
      result: "Available" as const,
      projection: freezeProjection(found),
    });
  };

  return Object.freeze({
    mode,
    listSyntheticJournalMetadata,
    getSyntheticJournalMetadataByRef,
    getSyntheticProviderVersion: () => ExecutiveJournalSyntheticProviderVersion,
    getSyntheticProjectionSchemaVersion: () =>
      ExecutiveJournalSyntheticProjectionSchemaVersion,
    getSyntheticSourceClassification: () =>
      ExecutiveJournalSyntheticSourceClassificationValue,
  });
};

export const ExecutiveJournalSyntheticMetadataProviderDefault =
  createExecutiveJournalSyntheticMetadataProvider("Normal");

export const ExecutiveJournalSyntheticMetadataProviderContract =
  Object.freeze({
    providerId: "EX-2:T0/ExecutiveJournalSyntheticMetadataProvider" as const,
    version: ExecutiveJournalSyntheticProviderVersion,
    projectionSchemaVersion: ExecutiveJournalSyntheticProjectionSchemaVersion,
    sourceClassification: ExecutiveJournalSyntheticSourceClassificationValue,
    catalogue: ExecutiveJournalSyntheticMetadataFixtureCatalogue,
    networked: false as const,
    persistent: false as const,
    usesRuntimeClock: false as const,
    usesRandomness: false as const,
    importsRtc2: false as const,
    emitsTelemetry: false as const,
    mutationOperations: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
