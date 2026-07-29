/**
 * RTC-3:1 — Executive Decision Register Foundation Identity.
 *
 * Canonical immutable identity for the Decision Register Foundation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by RTC-3:1.
 */

import type {
  ExecutiveDecisionRegisterIdentityDescriptor,
  ExecutiveDecisionRegisterIdentityFormatDescriptor,
} from "./executiveDecisionRegisterTypes.ts";

export const ExecutiveDecisionRegisterFoundationId =
  "RTC-3:1/ExecutiveDecisionRegisterFoundation" as const;

export const ExecutiveDecisionRegisterFoundationName =
  "Executive Decision Register Foundation" as const;

export const ExecutiveDecisionRegisterFoundationVersion = "1.0.0" as const;

export const ExecutiveDecisionRegisterFoundationNamespace =
  "nexora.rtc.executive.decision.register.foundation" as const;

export const ExecutiveDecisionRegisterFoundationStatus = "Foundation" as const;

export const ExecutiveDecisionRegisterFoundationReadiness =
  "ReadyForRegistry" as const;

export const ExecutiveDecisionRegisterFoundationNextPhase =
  "RTC-3:2 — Executive Decision Register Registry" as const;

export const ExecutiveDecisionRegisterFoundationAliases = Object.freeze([
  "ExecutiveDecisionRegisterFoundation",
  "RTC-3:1",
] as const);

/** Approved identity tokens for fail-closed resolution. */
export const ExecutiveDecisionRegisterApprovedIdentities = Object.freeze([
  ExecutiveDecisionRegisterFoundationId,
  ExecutiveDecisionRegisterFoundationNamespace,
  ...ExecutiveDecisionRegisterFoundationAliases,
] as const);

export const ExecutiveDecisionRegisterIdentity:
  ExecutiveDecisionRegisterIdentityDescriptor = Object.freeze({
    foundationId: ExecutiveDecisionRegisterFoundationId,
    foundationName: ExecutiveDecisionRegisterFoundationName,
    foundationVersion: ExecutiveDecisionRegisterFoundationVersion,
    foundationNamespace: ExecutiveDecisionRegisterFoundationNamespace,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    phase: "RTC-3" as const,
    stage: "Foundation" as const,
    sourcePhase: "RTC-3:1" as const,
    owner: "RTC-3 Executive Decision Register Foundation",
    status: ExecutiveDecisionRegisterFoundationStatus,
    readiness: ExecutiveDecisionRegisterFoundationReadiness,
    target: "Nexora Executive Experience MVP" as const,
    description:
      "Immutable architectural foundation of the Nexora Executive Decision Register. Declares append-only decision lifecycle, authority and human-confirmation boundaries, evidence and privacy models, AI non-delegable limits, projection provenance rules, and telemetry exclusions. Metadata only — no UI, persistence, network, or RTC-2 dependency.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

export const ExecutiveDecisionRegisterIdentityFormat:
  ExecutiveDecisionRegisterIdentityFormatDescriptor = Object.freeze({
    identityId: "RTC-3:1/DecisionRegisterIdentityFormat" as const,
    registerPrefix: "RTC-EDR" as const,
    decisionPrefix: "RTC-DEC" as const,
    eventPrefix: "RTC-DEVT" as const,
    registerExample: "RTC-EDR-00000001" as const,
    decisionExample: "RTC-DEC-00000001" as const,
    eventExample: "RTC-DEVT-00000001" as const,
    registerPattern: "RTC-EDR-{8-digit-sequence}" as const,
    decisionPattern: "RTC-DEC-{8-digit-sequence}" as const,
    eventPattern: "RTC-DEVT-{time-sortable-unique}" as const,
    eventIdNeverReused: true as const,
    sequenceAssignedByWriterOnly: true as const,
    appendOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Structural well-formedness only — not approval. */
export function isWellFormedDecisionRegisterIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value === value.trim();
}

/**
 * Fail-closed approval for foundation identity, namespace, and aliases.
 * Case, whitespace, partial, and unknown values are rejected.
 */
export function isApprovedDecisionRegisterIdentity(
  value: unknown,
): boolean {
  if (!isWellFormedDecisionRegisterIdentity(value)) {
    return false;
  }
  return (ExecutiveDecisionRegisterApprovedIdentities as readonly string[])
    .includes(value);
}
