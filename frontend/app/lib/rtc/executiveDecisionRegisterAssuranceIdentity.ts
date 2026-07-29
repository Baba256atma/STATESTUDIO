/**
 * RTC-3:8 — Executive Decision Register Reconciliation & Assurance Identity.
 *
 * Ownership: owned exclusively by RTC-3:8.
 */

import type { ExecutiveDecisionRegisterAssuranceIdentityDescriptor } from "./executiveDecisionRegisterAssuranceTypes.ts";

export const ExecutiveDecisionRegisterAssuranceId =
  "RTC-3:8/ExecutiveDecisionRegisterAssurance" as const;

export const ExecutiveDecisionRegisterAssuranceName =
  "Executive Decision Register Reconciliation & Assurance" as const;

export const ExecutiveDecisionRegisterAssuranceVersion = "1.0.0" as const;

export const ExecutiveDecisionRegisterAssuranceNamespace =
  "nexora.rtc.executive.decision.register.assurance" as const;

export const ExecutiveDecisionRegisterAssuranceStatus = "Assurance" as const;

/** ReadyForCertification — established by AD-RTC3-08 (Accepted). */
export const ExecutiveDecisionRegisterAssuranceReadiness =
  "ReadyForCertification" as const;

export const ExecutiveDecisionRegisterAssurancePreviousPhase =
  "RTC-3:7 — Executive Decision Register Execution Contract" as const;

export const ExecutiveDecisionRegisterAssuranceNextPhase =
  "RTC-3:9 — Executive Decision Register Certification & Release Readiness" as const;

export const ExecutiveDecisionRegisterAssuranceAliases = Object.freeze([
  "ExecutiveDecisionRegisterAssurance",
  "RTC-3:8",
] as const);

export const ExecutiveDecisionRegisterAssuranceIdentity:
  ExecutiveDecisionRegisterAssuranceIdentityDescriptor = Object.freeze({
    id: ExecutiveDecisionRegisterAssuranceId,
    name: ExecutiveDecisionRegisterAssuranceName,
    phaseId: "RTC-3:8" as const,
    version: ExecutiveDecisionRegisterAssuranceVersion,
    namespace: ExecutiveDecisionRegisterAssuranceNamespace,
    status: ExecutiveDecisionRegisterAssuranceStatus,
    readiness: ExecutiveDecisionRegisterAssuranceReadiness,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    domain: "Executive Decision Register" as const,
    sourceExecution:
      "RTC-3:7/ExecutiveDecisionRegisterExecutionContract" as const,
    upstream:
      "RTC-3:7 — Executive Decision Register Execution Contract" as const,
    previousPhase: ExecutiveDecisionRegisterAssurancePreviousPhase,
    nextPhase: ExecutiveDecisionRegisterAssuranceNextPhase,
    description:
      "Deterministic reconciliation and assurance layer over RTC-3:7 Execution Contract. Evaluates supplied intents, batches, receipts, and external evidence into Assured, NotAssured, or Indeterminate. Detects mismatch without repairing, fetching, certifying, or mutating state. Readiness ReadyForCertification is established by AD-RTC3-08.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

export function isWellFormedDecisionRegisterAssuranceIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value === value.trim()
    && value === ExecutiveDecisionRegisterAssuranceId;
}

export function isApprovedDecisionRegisterAssuranceAlias(
  value: unknown,
): boolean {
  return typeof value === "string"
    && (
      ExecutiveDecisionRegisterAssuranceAliases as readonly string[]
    ).includes(value);
}

export function isWellFormedDecisionRegisterAssuranceNamespace(
  value: unknown,
): boolean {
  return typeof value === "string"
    && value === ExecutiveDecisionRegisterAssuranceNamespace;
}
