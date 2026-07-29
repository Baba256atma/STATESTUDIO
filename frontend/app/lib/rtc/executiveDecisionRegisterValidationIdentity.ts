/**
 * RTC-3:4 — Executive Decision Register Validation Identity.
 *
 * Canonical identity, namespace, aliases, and identity guards.
 * Metadata-only. No runtime side effects.
 *
 * Ownership: owned exclusively by RTC-3:4.
 */

import type { ExecutiveDecisionRegisterValidationIdentityDescriptor } from "./executiveDecisionRegisterValidationTypes.ts";

export const ExecutiveDecisionRegisterValidationId =
  "RTC-3:4/ExecutiveDecisionRegisterValidation" as const;

export const ExecutiveDecisionRegisterValidationName =
  "Executive Decision Register Validation" as const;

export const ExecutiveDecisionRegisterValidationVersion = "1.0.0" as const;

export const ExecutiveDecisionRegisterValidationNamespace =
  "nexora.rtc.executive.decision.register.validation" as const;

export const ExecutiveDecisionRegisterValidationStatus = "Validation" as const;

export const ExecutiveDecisionRegisterValidationReadiness =
  "ReadyForPolicy" as const;

export const ExecutiveDecisionRegisterValidationNextPhase =
  "RTC-3:5 — Executive Decision Register Policy" as const;

export const ExecutiveDecisionRegisterValidationAliases = Object.freeze([
  "ExecutiveDecisionRegisterValidation",
  "RTC-3:4",
] as const);

export const ExecutiveDecisionRegisterValidationIdentity:
  ExecutiveDecisionRegisterValidationIdentityDescriptor = Object.freeze({
    id: ExecutiveDecisionRegisterValidationId,
    name: ExecutiveDecisionRegisterValidationName,
    phaseId: "RTC-3:4" as const,
    version: ExecutiveDecisionRegisterValidationVersion,
    namespace: ExecutiveDecisionRegisterValidationNamespace,
    status: ExecutiveDecisionRegisterValidationStatus,
    readiness: ExecutiveDecisionRegisterValidationReadiness,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    domain: "Executive Decision Register" as const,
    sourceModel: "RTC-3:3/ExecutiveDecisionRegisterModel" as const,
    upstream: "RTC-3:3 — Executive Decision Register Model" as const,
    nextPhase: ExecutiveDecisionRegisterValidationNextPhase,
    description:
      "Pure deterministic validation for Executive Decision Register model metadata and candidate records. Evaluates identity, structure, lifecycle, authority, confirmation, append-only lineage, provenance, evidence, projection, privacy, AI boundary, disposition, and telemetry without mutation, repair, network, or clock access.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/** Well-formed identity query (no normalization). */
export function isWellFormedDecisionRegisterValidationIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value === value.trim();
}

/** Canonical RTC-3 control identity pattern (exact, no repair). */
export function isCanonicalRtc3ControlIdentity(value: string): boolean {
  return /^RTC-3:[1-9]\/[A-Za-z][A-Za-z0-9]*$/.test(value);
}
