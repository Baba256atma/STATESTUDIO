/**
 * RTC-3:6 — Executive Decision Register Enforcement Identity.
 *
 * Ownership: owned exclusively by RTC-3:6.
 */

import type { ExecutiveDecisionRegisterEnforcementIdentityDescriptor } from "./executiveDecisionRegisterEnforcementTypes.ts";

export const ExecutiveDecisionRegisterEnforcementId =
  "RTC-3:6/ExecutiveDecisionRegisterEnforcement" as const;

export const ExecutiveDecisionRegisterEnforcementName =
  "Executive Decision Register Enforcement" as const;

export const ExecutiveDecisionRegisterEnforcementVersion = "1.0.0" as const;

export const ExecutiveDecisionRegisterEnforcementNamespace =
  "nexora.rtc.executive.decision.register.enforcement" as const;

export const ExecutiveDecisionRegisterEnforcementStatus =
  "Enforcement" as const;

/**
 * ReadyForExecutionContract — established by AD-RTC3-06 (Accepted).
 * RTC-2:6 historically used ReadyForCertification for its equivalent transition.
 */
export const ExecutiveDecisionRegisterEnforcementReadiness =
  "ReadyForExecutionContract" as const;

export const ExecutiveDecisionRegisterEnforcementNextPhase =
  "RTC-3:7 — Executive Decision Register Execution Contract" as const;

export const ExecutiveDecisionRegisterEnforcementAliases = Object.freeze([
  "ExecutiveDecisionRegisterEnforcement",
  "RTC-3:6",
] as const);

export const ExecutiveDecisionRegisterEnforcementIdentity:
  ExecutiveDecisionRegisterEnforcementIdentityDescriptor = Object.freeze({
    id: ExecutiveDecisionRegisterEnforcementId,
    name: ExecutiveDecisionRegisterEnforcementName,
    phaseId: "RTC-3:6" as const,
    version: ExecutiveDecisionRegisterEnforcementVersion,
    namespace: ExecutiveDecisionRegisterEnforcementNamespace,
    status: ExecutiveDecisionRegisterEnforcementStatus,
    readiness: ExecutiveDecisionRegisterEnforcementReadiness,
    layer: "Runtime Layer" as const,
    architecture: "NPA-T vNext" as const,
    domain: "Executive Decision Register" as const,
    sourcePolicy: "RTC-3:5/ExecutiveDecisionRegisterPolicy" as const,
    upstream: "RTC-3:5 — Executive Decision Register Policy" as const,
    nextPhase: ExecutiveDecisionRegisterEnforcementNextPhase,
    description:
      "Deterministic enforcement-planning layer over RTC-3:5 Policy. Converts Allow, Deny, and RequireConfirmation into Blocked, AwaitingConfirmation, or Enforceable plans. Planning descriptors only — never executes writes, disclosure, export, retention, disposition, or external calls.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

export function isWellFormedDecisionRegisterEnforcementIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value === value.trim();
}
