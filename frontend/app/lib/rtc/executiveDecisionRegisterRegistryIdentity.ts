/**
 * RTC-3:2 — Executive Decision Register Registry Identity.
 *
 * Canonical identity, namespace, aliases, and identity guards.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by RTC-3:2.
 */

import {
  ExecutiveDecisionRegisterFoundationId,
  ExecutiveDecisionRegisterFoundationNamespace,
} from "./executiveDecisionRegisterFoundation.ts";
import type { ExecutiveDecisionRegisterRegistryIdentityDescriptor } from "./executiveDecisionRegisterRegistryTypes.ts";

/** Canonical registry identity constant. */
export const ExecutiveDecisionRegisterRegistryId =
  "RTC-3:2/ExecutiveDecisionRegisterRegistry" as const;

/** Human-readable registry name. */
export const ExecutiveDecisionRegisterRegistryName =
  "Executive Decision Register Registry" as const;

/** Semantic version. */
export const ExecutiveDecisionRegisterRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveDecisionRegisterRegistryNamespace =
  "nexora.rtc.executive.decision.register.registry" as const;

/** Registry status. */
export const ExecutiveDecisionRegisterRegistryStatus = "Registry" as const;

/** Immediate next-phase readiness. */
export const ExecutiveDecisionRegisterRegistryReadiness =
  "ReadyForModel" as const;

/** Canonical next phase (metadata declaration only). */
export const ExecutiveDecisionRegisterRegistryNextPhase =
  "RTC-3:3 — Executive Decision Register Model" as const;

/** Approved aliases for the registry identity itself. */
export const ExecutiveDecisionRegisterRegistryAliases = Object.freeze([
  "ExecutiveDecisionRegisterRegistry",
  "RTC-3:2",
] as const);

/** Approved aliases for the registered RTC-3:1 foundation entry. */
export const ExecutiveDecisionRegisterFoundationEntryAliases = Object.freeze([
  "ExecutiveDecisionRegisterFoundation",
  "RTC-3:1",
] as const);

/**
 * Immutable identity descriptor for RTC-3:2 Executive Decision Register Registry.
 */
export const ExecutiveDecisionRegisterRegistryIdentity:
  ExecutiveDecisionRegisterRegistryIdentityDescriptor = Object.freeze({
    id: ExecutiveDecisionRegisterRegistryId,
    name: ExecutiveDecisionRegisterRegistryName,
    phaseId: "RTC-3:2" as const,
    version: ExecutiveDecisionRegisterRegistryVersion,
    namespace: ExecutiveDecisionRegisterRegistryNamespace,
    status: ExecutiveDecisionRegisterRegistryStatus,
    readiness: ExecutiveDecisionRegisterRegistryReadiness,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    domain: "Executive Decision Register" as const,
    sourceFoundation: ExecutiveDecisionRegisterFoundationId,
    upstream: "RTC-3:1 — Executive Decision Register Foundation" as const,
    nextPhase: ExecutiveDecisionRegisterRegistryNextPhase,
    description:
      "Deterministic immutable registry for discovering and resolving the approved Executive Decision Register Foundation. Closed-world lookup by canonical identity, namespace, and approved aliases. No UI, confirmation, authority, or open-issue resolution.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Identity query is well-formed when it is a non-empty trimmed string.
 * Whitespace padding and non-strings fail closed (no normalization).
 */
export function isWellFormedDecisionRegisterRegistryIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value === value.trim();
}

/** Inverse of well-formed identity check. */
export function isMalformedDecisionRegisterRegistryIdentity(
  value: unknown,
): boolean {
  return !isWellFormedDecisionRegisterRegistryIdentity(value);
}

/** True when value equals the canonical RTC-3:1 foundation control ID. */
export function isCanonicalDecisionRegisterFoundationControlId(
  value: string,
): value is typeof ExecutiveDecisionRegisterFoundationId {
  return value === ExecutiveDecisionRegisterFoundationId;
}

/** True when value equals the canonical RTC-3:1 foundation namespace. */
export function isCanonicalDecisionRegisterFoundationNamespace(
  value: string,
): value is typeof ExecutiveDecisionRegisterFoundationNamespace {
  return value === ExecutiveDecisionRegisterFoundationNamespace;
}

/** True when value equals the canonical RTC-3:2 registry ID. */
export function isCanonicalDecisionRegisterRegistryId(
  value: string,
): value is typeof ExecutiveDecisionRegisterRegistryId {
  return value === ExecutiveDecisionRegisterRegistryId;
}
