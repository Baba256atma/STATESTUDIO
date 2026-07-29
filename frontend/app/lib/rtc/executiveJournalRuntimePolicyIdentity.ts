/**
 * RTC-2:5 — Executive Journal Runtime Policy Identity.
 *
 * Canonical identity, namespace, aliases, and identity guards.
 *
 * Ownership: owned exclusively by RTC-2:5.
 */

import type { ExecutiveJournalRuntimePolicyIdentityDescriptor } from "./executiveJournalRuntimePolicyTypes.ts";

export const ExecutiveJournalRuntimePolicyId =
  "RTC-2:5/ExecutiveJournalRuntimePolicy" as const;

export const ExecutiveJournalRuntimePolicyName =
  "Executive Journal Runtime Policy" as const;

export const ExecutiveJournalRuntimePolicyVersion = "1.0.0" as const;

export const ExecutiveJournalRuntimePolicyNamespace =
  "nexora.rtc.executive.journal.policy" as const;

export const ExecutiveJournalRuntimePolicyStatus = "Policy" as const;

export const ExecutiveJournalRuntimePolicyReadiness =
  "ReadyForPlatform" as const;

export const ExecutiveJournalRuntimePolicyNextPhase =
  "RTC-2:6 — Executive Journal Runtime Policy Enforcement" as const;

export const ExecutiveJournalRuntimePolicyAliases = Object.freeze([
  "ExecutiveJournalRuntimePolicy",
  "RTC-2:5",
] as const);

export const ExecutiveJournalRuntimePolicyIdentity:
  ExecutiveJournalRuntimePolicyIdentityDescriptor = Object.freeze({
    id: ExecutiveJournalRuntimePolicyId,
    name: ExecutiveJournalRuntimePolicyName,
    phaseId: "RTC-2:5" as const,
    version: ExecutiveJournalRuntimePolicyVersion,
    namespace: ExecutiveJournalRuntimePolicyNamespace,
    status: ExecutiveJournalRuntimePolicyStatus,
    readiness: ExecutiveJournalRuntimePolicyReadiness,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    domain: "Executive Journal Runtime" as const,
    sourceValidation: "RTC-2:4/ExecutiveJournalRuntimeValidation" as const,
    upstream: "RTC-2:4 — Executive Journal Runtime Validation" as const,
    nextPhase: ExecutiveJournalRuntimePolicyNextPhase,
    description:
      "Closed deterministic policy layer for Executive Journal Runtime operations. Produces Allow, Deny, or RequireConfirmation with immutable obligations. Fail-closed, purpose-bound, authority-aware, and privacy-aware. No authentication, live registry, network, clock, or UI.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

export function isWellFormedJournalPolicyIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value === value.trim();
}
