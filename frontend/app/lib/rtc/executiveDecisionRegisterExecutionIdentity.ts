/**
 * RTC-3:7 — Executive Decision Register Execution Contract Identity.
 *
 * Ownership: owned exclusively by RTC-3:7.
 */

import type { ExecutiveDecisionRegisterExecutionIdentityDescriptor } from "./executiveDecisionRegisterExecutionTypes.ts";

export const ExecutiveDecisionRegisterExecutionId =
  "RTC-3:7/ExecutiveDecisionRegisterExecutionContract" as const;

export const ExecutiveDecisionRegisterExecutionName =
  "Executive Decision Register Execution Contract" as const;

export const ExecutiveDecisionRegisterExecutionVersion = "1.0.0" as const;

export const ExecutiveDecisionRegisterExecutionNamespace =
  "nexora.rtc.executive.decision.register.execution" as const;

export const ExecutiveDecisionRegisterExecutionStatus =
  "ExecutionContract" as const;

/** ReadyForAssurance — established by AD-RTC3-07 (Accepted). */
export const ExecutiveDecisionRegisterExecutionReadiness =
  "ReadyForAssurance" as const;

export const ExecutiveDecisionRegisterExecutionNextPhase =
  "RTC-3:8 — Executive Decision Register Reconciliation & Assurance" as const;

export const ExecutiveDecisionRegisterExecutionAliases = Object.freeze([
  "ExecutiveDecisionRegisterExecutionContract",
  "RTC-3:7",
] as const);

export const ExecutiveDecisionRegisterExecutionIdentity:
  ExecutiveDecisionRegisterExecutionIdentityDescriptor = Object.freeze({
    id: ExecutiveDecisionRegisterExecutionId,
    name: ExecutiveDecisionRegisterExecutionName,
    phaseId: "RTC-3:7" as const,
    version: ExecutiveDecisionRegisterExecutionVersion,
    namespace: ExecutiveDecisionRegisterExecutionNamespace,
    status: ExecutiveDecisionRegisterExecutionStatus,
    readiness: ExecutiveDecisionRegisterExecutionReadiness,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    domain: "Executive Decision Register" as const,
    sourceEnforcement:
      "RTC-3:6/ExecutiveDecisionRegisterEnforcement" as const,
    upstream: "RTC-3:6 — Executive Decision Register Enforcement" as const,
    nextPhase: ExecutiveDecisionRegisterExecutionNextPhase,
    description:
      "Deterministic execution-boundary contract over RTC-3:6 Enforcement. Converts Enforceable plans into execution intents and explicit outcomes into receipts. Contracts and pure transforms only — never persists, appends, signs, encrypts, publishes, dispatches, or mutates state. Readiness ReadyForAssurance is established by AD-RTC3-07.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/** Well-formed identity query (no normalization). */
export function isWellFormedDecisionRegisterExecutionIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value === value.trim()
    && value === ExecutiveDecisionRegisterExecutionId;
}

export function isApprovedDecisionRegisterExecutionAlias(
  value: unknown,
): boolean {
  return typeof value === "string"
    && (
      ExecutiveDecisionRegisterExecutionAliases as readonly string[]
    ).includes(value);
}
