/**
 * RTC-1:1 — Executive Context Runtime Foundation Identity.
 *
 * Canonical immutable identity for the Executive Context Runtime Foundation.
 * Context identity never changes; only state evolves via new snapshots.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by RTC-1:1.
 */

import type {
  ExecutiveContextIdentityFormatDescriptor,
  ExecutiveContextRuntimeIdentityDescriptor,
} from "./executiveContextRuntimeTypes.ts";

/** Canonical foundation identity constant. */
export const ExecutiveContextRuntimeFoundationId =
  "RTC-1:1/ExecutiveContextRuntimeFoundation" as const;

/** Human-readable foundation name. */
export const ExecutiveContextRuntimeFoundationName =
  "Executive Context Runtime Foundation" as const;

/** Semantic version. */
export const ExecutiveContextRuntimeFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveContextRuntimeFoundationNamespace =
  "nexora.rtc.executive.context.foundation" as const;

/** Foundation status. */
export const ExecutiveContextRuntimeFoundationStatus = "Foundation" as const;

/** Immediate next-phase readiness. */
export const ExecutiveContextRuntimeFoundationReadiness =
  "ReadyForRegistry" as const;

/** Canonical next phase. */
export const ExecutiveContextRuntimeFoundationNextPhase =
  "RTC-1:2 — Executive Context Runtime Registry" as const;

/**
 * Immutable identity descriptor for RTC-1:1 Executive Context Runtime Foundation.
 */
export const ExecutiveContextRuntimeIdentity:
  ExecutiveContextRuntimeIdentityDescriptor = Object.freeze({
    foundationId: ExecutiveContextRuntimeFoundationId,
    foundationName: ExecutiveContextRuntimeFoundationName,
    foundationVersion: ExecutiveContextRuntimeFoundationVersion,
    foundationNamespace: ExecutiveContextRuntimeFoundationNamespace,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    phase: "RTC-1" as const,
    stage: "Foundation" as const,
    sourcePhase: "RTC-1:1" as const,
    owner: "RTC-1 Executive Context Runtime Foundation",
    status: ExecutiveContextRuntimeFoundationStatus,
    readiness: ExecutiveContextRuntimeFoundationReadiness,
    target: "Nexora Executive Experience MVP" as const,
    description:
      "Immutable architectural foundation of the Nexora Executive Context Runtime. Declares context identity, lifecycle, contracts, events, consumers, and guarantees that Stage, Journal, Timeline, and Advisor consume a single deterministic Executive Context. No UI, rendering, or business intelligence.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Canonical Executive Context identity format.
 * Identity never changes. State evolves through immutable snapshots.
 */
export const ExecutiveContextIdentityFormat:
  ExecutiveContextIdentityFormatDescriptor = Object.freeze({
    identityId: "RTC-1:1/ContextIdentityFormat" as const,
    prefix: "RTC-CTX" as const,
    example: "RTC-CTX-00000001" as const,
    pattern: "RTC-CTX-{8-digit-sequence}" as const,
    identityImmutable: true as const,
    stateEvolvesViaSnapshot: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
