/**
 * RTC-2:3 — Executive Journal Runtime Model Identity.
 *
 * Canonical identity, namespace, aliases, and identity guards.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by RTC-2:3.
 */

import type { ExecutiveJournalRuntimeModelIdentityDescriptor } from "./executiveJournalRuntimeModelTypes.ts";

/** Canonical model identity constant. */
export const ExecutiveJournalRuntimeModelId =
  "RTC-2:3/ExecutiveJournalRuntimeModel" as const;

/** Human-readable model name. */
export const ExecutiveJournalRuntimeModelName =
  "Executive Journal Runtime Model" as const;

/** Semantic version. */
export const ExecutiveJournalRuntimeModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveJournalRuntimeModelNamespace =
  "nexora.rtc.executive.journal.model" as const;

/** Model status. */
export const ExecutiveJournalRuntimeModelStatus = "Model" as const;

/** Immediate next-phase readiness. */
export const ExecutiveJournalRuntimeModelReadiness =
  "ReadyForValidation" as const;

/** Canonical next phase. */
export const ExecutiveJournalRuntimeModelNextPhase =
  "RTC-2:4 — Executive Journal Runtime Validation" as const;

/** Approved aliases for the model identity. */
export const ExecutiveJournalRuntimeModelAliases = Object.freeze([
  "ExecutiveJournalRuntimeModel",
  "RTC-2:3",
] as const);

/**
 * Immutable identity descriptor for RTC-2:3 Executive Journal Runtime Model.
 */
export const ExecutiveJournalRuntimeModelIdentity:
  ExecutiveJournalRuntimeModelIdentityDescriptor = Object.freeze({
    id: ExecutiveJournalRuntimeModelId,
    name: ExecutiveJournalRuntimeModelName,
    phaseId: "RTC-2:3" as const,
    version: ExecutiveJournalRuntimeModelVersion,
    namespace: ExecutiveJournalRuntimeModelNamespace,
    status: ExecutiveJournalRuntimeModelStatus,
    readiness: ExecutiveJournalRuntimeModelReadiness,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    domain: "Executive Journal Runtime" as const,
    sourceRegistry: "RTC-2:2/ExecutiveJournalRuntimeRegistry" as const,
    upstream: "RTC-2:2 — Executive Journal Runtime Registry" as const,
    nextPhase: ExecutiveJournalRuntimeModelNextPhase,
    description:
      "Canonical immutable domain model for the Executive Journal Runtime. Defines entity structure, state distinctions, provenance, authority, privacy, projection, correction, dispute, and disposition without behaviour, validation, persistence, or UI.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/** Well-formed model identity query (no normalization). */
export function isWellFormedJournalModelIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value === value.trim();
}

/** True when value equals the canonical RTC-2:3 model ID. */
export function isCanonicalJournalModelId(
  value: string,
): value is typeof ExecutiveJournalRuntimeModelId {
  return value === ExecutiveJournalRuntimeModelId;
}
