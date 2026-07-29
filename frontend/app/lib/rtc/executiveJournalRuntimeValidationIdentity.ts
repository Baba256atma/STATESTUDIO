/**
 * RTC-2:4 — Executive Journal Runtime Validation Identity.
 *
 * Canonical identity, namespace, aliases, and identity guards.
 * Metadata-only. No runtime side effects.
 *
 * Ownership: owned exclusively by RTC-2:4.
 */

import type { ExecutiveJournalRuntimeValidationIdentityDescriptor } from "./executiveJournalRuntimeValidationTypes.ts";

export const ExecutiveJournalRuntimeValidationId =
  "RTC-2:4/ExecutiveJournalRuntimeValidation" as const;

export const ExecutiveJournalRuntimeValidationName =
  "Executive Journal Runtime Validation" as const;

export const ExecutiveJournalRuntimeValidationVersion = "1.0.0" as const;

export const ExecutiveJournalRuntimeValidationNamespace =
  "nexora.rtc.executive.journal.validation" as const;

export const ExecutiveJournalRuntimeValidationStatus = "Validation" as const;

export const ExecutiveJournalRuntimeValidationReadiness =
  "ReadyForManifest" as const;

export const ExecutiveJournalRuntimeValidationNextPhase =
  "RTC-2:5 — Executive Journal Runtime Policy" as const;

export const ExecutiveJournalRuntimeValidationAliases = Object.freeze([
  "ExecutiveJournalRuntimeValidation",
  "RTC-2:4",
] as const);

export const ExecutiveJournalRuntimeValidationIdentity:
  ExecutiveJournalRuntimeValidationIdentityDescriptor = Object.freeze({
    id: ExecutiveJournalRuntimeValidationId,
    name: ExecutiveJournalRuntimeValidationName,
    phaseId: "RTC-2:4" as const,
    version: ExecutiveJournalRuntimeValidationVersion,
    namespace: ExecutiveJournalRuntimeValidationNamespace,
    status: ExecutiveJournalRuntimeValidationStatus,
    readiness: ExecutiveJournalRuntimeValidationReadiness,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    domain: "Executive Journal Runtime" as const,
    sourceModel: "RTC-2:3/ExecutiveJournalRuntimeModel" as const,
    upstream: "RTC-2:3 — Executive Journal Runtime Model" as const,
    nextPhase: ExecutiveJournalRuntimeValidationNextPhase,
    description:
      "Pure deterministic validation for Executive Journal Runtime model metadata and instances. Evaluates identity, structure, append-only relationships, provenance, authority, privacy, AI boundary, disclosure, projection, evidence, and telemetry without mutation, repair, network, or clock access.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/** Well-formed identity query (no normalization). */
export function isWellFormedJournalValidationIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value === value.trim();
}

/** Canonical RTC-2 control identity pattern (exact, no repair). */
export function isCanonicalRtc2ControlIdentity(value: string): boolean {
  return /^RTC-2:[1-9]\/[A-Za-z][A-Za-z0-9]*$/.test(value);
}
