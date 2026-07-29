/**
 * RTC-3:5 — Executive Decision Register Policy Identity.
 *
 * Canonical identity, namespace, aliases, and identity guards.
 *
 * Ownership: owned exclusively by RTC-3:5.
 */

import type { ExecutiveDecisionRegisterPolicyIdentityDescriptor } from "./executiveDecisionRegisterPolicyTypes.ts";

export const ExecutiveDecisionRegisterPolicyId =
  "RTC-3:5/ExecutiveDecisionRegisterPolicy" as const;

export const ExecutiveDecisionRegisterPolicyName =
  "Executive Decision Register Policy" as const;

export const ExecutiveDecisionRegisterPolicyVersion = "1.0.0" as const;

export const ExecutiveDecisionRegisterPolicyNamespace =
  "nexora.rtc.executive.decision.register.policy" as const;

export const ExecutiveDecisionRegisterPolicyStatus = "Policy" as const;

export const ExecutiveDecisionRegisterPolicyReadiness =
  "ReadyForEnforcement" as const;

export const ExecutiveDecisionRegisterPolicyNextPhase =
  "RTC-3:6 — Executive Decision Register Enforcement" as const;

export const ExecutiveDecisionRegisterPolicyAliases = Object.freeze([
  "ExecutiveDecisionRegisterPolicy",
  "RTC-3:5",
] as const);

export const ExecutiveDecisionRegisterPolicyIdentity:
  ExecutiveDecisionRegisterPolicyIdentityDescriptor = Object.freeze({
    id: ExecutiveDecisionRegisterPolicyId,
    name: ExecutiveDecisionRegisterPolicyName,
    phaseId: "RTC-3:5" as const,
    version: ExecutiveDecisionRegisterPolicyVersion,
    namespace: ExecutiveDecisionRegisterPolicyNamespace,
    status: ExecutiveDecisionRegisterPolicyStatus,
    readiness: ExecutiveDecisionRegisterPolicyReadiness,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    domain: "Executive Decision Register" as const,
    sourceValidation: "RTC-3:4/ExecutiveDecisionRegisterValidation" as const,
    upstream: "RTC-3:4 — Executive Decision Register Validation" as const,
    nextPhase: ExecutiveDecisionRegisterPolicyNextPhase,
    description:
      "Closed deterministic policy layer for Executive Decision Register operations. Produces Allow, Deny, or RequireConfirmation with immutable obligations. Fail-closed, purpose-bound, authority-aware, and privacy-aware. Consumes RTC-3:4 Validation only. No authentication, live registry, network, clock, or UI.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/** Well-formed identity query (no normalization). */
export function isWellFormedDecisionRegisterPolicyIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value === value.trim();
}
