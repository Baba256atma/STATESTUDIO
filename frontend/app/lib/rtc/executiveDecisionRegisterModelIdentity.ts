/**
 * RTC-3:3 — Executive Decision Register Model Identity.
 *
 * Canonical identity, namespace, aliases, and identity guards.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by RTC-3:3.
 */

import type { ExecutiveDecisionRegisterModelIdentityDescriptor } from "./executiveDecisionRegisterModelTypes.ts";

/** Canonical model identity constant. */
export const ExecutiveDecisionRegisterModelId =
  "RTC-3:3/ExecutiveDecisionRegisterModel" as const;

/** Human-readable model name. */
export const ExecutiveDecisionRegisterModelName =
  "Executive Decision Register Model" as const;

/** Semantic version. */
export const ExecutiveDecisionRegisterModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveDecisionRegisterModelNamespace =
  "nexora.rtc.executive.decision.register.model" as const;

/** Model status. */
export const ExecutiveDecisionRegisterModelStatus = "Model" as const;

/** Immediate next-phase readiness. */
export const ExecutiveDecisionRegisterModelReadiness =
  "ReadyForValidation" as const;

/** Canonical next phase (metadata declaration only). */
export const ExecutiveDecisionRegisterModelNextPhase =
  "RTC-3:4 — Executive Decision Register Validation" as const;

/** Approved aliases for the model identity. */
export const ExecutiveDecisionRegisterModelAliases = Object.freeze([
  "ExecutiveDecisionRegisterModel",
  "RTC-3:3",
] as const);

/**
 * Immutable identity descriptor for RTC-3:3 Executive Decision Register Model.
 */
export const ExecutiveDecisionRegisterModelIdentity:
  ExecutiveDecisionRegisterModelIdentityDescriptor = Object.freeze({
    id: ExecutiveDecisionRegisterModelId,
    name: ExecutiveDecisionRegisterModelName,
    phaseId: "RTC-3:3" as const,
    version: ExecutiveDecisionRegisterModelVersion,
    namespace: ExecutiveDecisionRegisterModelNamespace,
    status: ExecutiveDecisionRegisterModelStatus,
    readiness: ExecutiveDecisionRegisterModelReadiness,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    domain: "Executive Decision Register" as const,
    sourceRegistry: "RTC-3:2/ExecutiveDecisionRegisterRegistry" as const,
    upstream: "RTC-3:2 — Executive Decision Register Registry" as const,
    nextPhase: ExecutiveDecisionRegisterModelNextPhase,
    description:
      "Canonical immutable domain model for the Executive Decision Register. Declares entity structure, closed state distinctions, append-only relationships, authority and confirmation contracts, evidence and projection rules, and AI/privacy/telemetry boundaries. Consumes RTC-3:1 only through the sealed RTC-3:2 registry. Metadata only — no validation, persistence, or UI.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Identity query is well-formed when it is a non-empty trimmed string.
 * Whitespace padding and non-strings fail closed (no normalization).
 */
export function isWellFormedDecisionRegisterModelIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value === value.trim();
}

/** True when value equals the canonical RTC-3:3 model ID. */
export function isCanonicalDecisionRegisterModelId(
  value: string,
): value is typeof ExecutiveDecisionRegisterModelId {
  return value === ExecutiveDecisionRegisterModelId;
}
