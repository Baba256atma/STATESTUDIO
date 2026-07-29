/**
 * RTC-2:2 — Executive Journal Runtime Registry Identity.
 *
 * Canonical identity, namespace, aliases, and identity guards.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by RTC-2:2.
 */

import {
  ExecutiveJournalRuntimeFoundationId,
  ExecutiveJournalRuntimeFoundationNamespace,
} from "./executiveJournalRuntimeFoundation.ts";
import type { ExecutiveJournalRuntimeRegistryIdentityDescriptor } from "./executiveJournalRuntimeRegistryTypes.ts";

/** Canonical registry identity constant. */
export const ExecutiveJournalRuntimeRegistryId =
  "RTC-2:2/ExecutiveJournalRuntimeRegistry" as const;

/** Human-readable registry name. */
export const ExecutiveJournalRuntimeRegistryName =
  "Executive Journal Runtime Registry" as const;

/** Semantic version. */
export const ExecutiveJournalRuntimeRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveJournalRuntimeRegistryNamespace =
  "nexora.rtc.executive.journal.registry" as const;

/** Registry status. */
export const ExecutiveJournalRuntimeRegistryStatus = "Registry" as const;

/** Immediate next-phase readiness. */
export const ExecutiveJournalRuntimeRegistryReadiness =
  "ReadyForModel" as const;

/** Canonical next phase. */
export const ExecutiveJournalRuntimeRegistryNextPhase =
  "RTC-2:3 — Executive Journal Runtime Model" as const;

/** Approved aliases for the registry identity itself. */
export const ExecutiveJournalRuntimeRegistryAliases = Object.freeze([
  "ExecutiveJournalRuntimeRegistry",
  "RTC-2:2",
] as const);

/** Approved aliases for the registered RTC-2:1 foundation entry. */
export const ExecutiveJournalRuntimeFoundationEntryAliases = Object.freeze([
  "ExecutiveJournalRuntimeFoundation",
  "RTC-2:1",
] as const);

/**
 * Immutable identity descriptor for RTC-2:2 Executive Journal Runtime Registry.
 */
export const ExecutiveJournalRuntimeRegistryIdentity:
  ExecutiveJournalRuntimeRegistryIdentityDescriptor = Object.freeze({
    id: ExecutiveJournalRuntimeRegistryId,
    name: ExecutiveJournalRuntimeRegistryName,
    phaseId: "RTC-2:2" as const,
    version: ExecutiveJournalRuntimeRegistryVersion,
    namespace: ExecutiveJournalRuntimeRegistryNamespace,
    status: ExecutiveJournalRuntimeRegistryStatus,
    readiness: ExecutiveJournalRuntimeRegistryReadiness,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    domain: "Executive Journal Runtime" as const,
    sourceFoundation: ExecutiveJournalRuntimeFoundationId,
    upstream: "RTC-2:1 — Executive Journal Runtime Foundation" as const,
    nextPhase: ExecutiveJournalRuntimeRegistryNextPhase,
    description:
      "Deterministic immutable registry for discovering and resolving the approved Executive Journal Runtime Foundation. Closed-world lookup by canonical identity, namespace, and approved aliases. No UI, capture, disclosure, or authority decisions.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Identity query is well-formed when it is a non-empty trimmed string.
 * Whitespace padding and non-strings fail closed (no normalization).
 */
export function isWellFormedJournalRegistryIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value === value.trim();
}

/** Inverse of well-formed identity check. */
export function isMalformedJournalRegistryIdentity(
  value: unknown,
): boolean {
  return !isWellFormedJournalRegistryIdentity(value);
}

/** True when value equals the canonical RTC-2:1 foundation control ID. */
export function isCanonicalJournalFoundationControlId(
  value: string,
): value is typeof ExecutiveJournalRuntimeFoundationId {
  return value === ExecutiveJournalRuntimeFoundationId;
}

/** True when value equals the canonical RTC-2:1 foundation namespace. */
export function isCanonicalJournalFoundationNamespace(
  value: string,
): value is typeof ExecutiveJournalRuntimeFoundationNamespace {
  return value === ExecutiveJournalRuntimeFoundationNamespace;
}

/** True when value equals the canonical RTC-2:2 registry ID. */
export function isCanonicalJournalRegistryId(
  value: string,
): value is typeof ExecutiveJournalRuntimeRegistryId {
  return value === ExecutiveJournalRuntimeRegistryId;
}
