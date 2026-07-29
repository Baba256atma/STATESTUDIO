/**
 * RTC-2:1 — Executive Journal Runtime Foundation Identity.
 *
 * Canonical immutable identity for the Executive Journal Runtime Foundation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by RTC-2:1.
 */

import type {
  ExecutiveJournalIdentityFormatDescriptor,
  ExecutiveJournalRuntimeIdentityDescriptor,
} from "./executiveJournalRuntimeTypes.ts";

/** Canonical foundation identity constant. */
export const ExecutiveJournalRuntimeFoundationId =
  "RTC-2:1/ExecutiveJournalRuntimeFoundation" as const;

/** Human-readable foundation name. */
export const ExecutiveJournalRuntimeFoundationName =
  "Executive Journal Runtime Foundation" as const;

/** Semantic version. */
export const ExecutiveJournalRuntimeFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveJournalRuntimeFoundationNamespace =
  "nexora.rtc.executive.journal.foundation" as const;

/** Foundation status. */
export const ExecutiveJournalRuntimeFoundationStatus = "Foundation" as const;

/** Immediate next-phase readiness. */
export const ExecutiveJournalRuntimeFoundationReadiness =
  "ReadyForRegistry" as const;

/** Canonical next phase. */
export const ExecutiveJournalRuntimeFoundationNextPhase =
  "RTC-2:2 — Executive Journal Runtime Registry" as const;

/**
 * Immutable identity descriptor for RTC-2:1 Executive Journal Runtime Foundation.
 */
export const ExecutiveJournalRuntimeIdentity:
  ExecutiveJournalRuntimeIdentityDescriptor = Object.freeze({
    foundationId: ExecutiveJournalRuntimeFoundationId,
    foundationName: ExecutiveJournalRuntimeFoundationName,
    foundationVersion: ExecutiveJournalRuntimeFoundationVersion,
    foundationNamespace: ExecutiveJournalRuntimeFoundationNamespace,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    phase: "RTC-2" as const,
    stage: "Foundation" as const,
    sourcePhase: "RTC-2:1" as const,
    owner: "RTC-2 Executive Journal Runtime Foundation",
    status: ExecutiveJournalRuntimeFoundationStatus,
    readiness: ExecutiveJournalRuntimeFoundationReadiness,
    target: "Nexora Executive Experience MVP" as const,
    description:
      "Immutable architectural foundation of the Nexora Executive Journal Runtime. Declares the append-only journal contract, authority and privacy model, event envelope, processing lifecycle, projections, disclosure controls, and AI non-delegable boundary. No UI, capture execution, or autonomous authority.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Canonical journal and event identity format.
 * Sequence is assigned only by the event writer. Event IDs are never reused.
 */
export const ExecutiveJournalIdentityFormat:
  ExecutiveJournalIdentityFormatDescriptor = Object.freeze({
    identityId: "RTC-2:1/JournalIdentityFormat" as const,
    journalPrefix: "RTC-JRN" as const,
    eventPrefix: "RTC-JEVT" as const,
    journalExample: "RTC-JRN-00000001" as const,
    eventExample: "RTC-JEVT-00000001" as const,
    journalPattern: "RTC-JRN-{8-digit-sequence}" as const,
    eventPattern: "RTC-JEVT-{time-sortable-unique}" as const,
    eventIdNeverReused: true as const,
    sequenceAssignedByWriterOnly: true as const,
    appendOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
