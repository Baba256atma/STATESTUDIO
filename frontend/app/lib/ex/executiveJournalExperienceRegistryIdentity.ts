/**
 * EX-2:2 — Executive Journal Experience Registry Identity.
 *
 * Canonical Registry identity, namespace, aliases, and fail-closed guards.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EX-2:2.
 */

import type {
  ExecutiveJournalExperienceRegistryReadiness,
  ExecutiveJournalExperienceRegistryStatus,
} from "./executiveJournalExperienceRegistryTypes.ts";

/** Canonical Registry identity. */
export const ExecutiveJournalExperienceRegistryId =
  "EX-2:2/ExecutiveJournalExperienceRegistry" as const;

/** Human-readable title. */
export const ExecutiveJournalExperienceRegistryTitle =
  "Executive Journal Experience Registry" as const;

/** Canonical namespace. */
export const ExecutiveJournalExperienceRegistryNamespace =
  "nexora.ex.executive.journal.experience.registry" as const;

/** Registry status. */
export const ExecutiveJournalExperienceRegistryStatusValue:
  ExecutiveJournalExperienceRegistryStatus = "Registry";

/** Immediate next-phase readiness. */
export const ExecutiveJournalExperienceRegistryReadinessValue:
  ExecutiveJournalExperienceRegistryReadiness = "ReadyForModel";

/** Phase key. */
export const ExecutiveJournalExperienceRegistryPhase = "EX-2:2" as const;

/** Previous phase metadata. */
export const ExecutiveJournalExperienceRegistryPreviousPhase =
  "EX-2:1 — Executive Journal Experience Foundation" as const;

/** Next phase metadata only — not created or authorized. */
export const ExecutiveJournalExperienceRegistryNextPhase =
  "EX-2:3 — Executive Journal Experience Model" as const;

/** Approved aliases for the Registry identity itself. */
export const ExecutiveJournalExperienceRegistryApprovedAliases = Object.freeze([
  "ExecutiveJournalExperienceRegistry",
  "EX-2:2",
] as const);

export type ExecutiveJournalExperienceRegistryApprovedAlias =
  (typeof ExecutiveJournalExperienceRegistryApprovedAliases)[number];

/**
 * Immutable identity descriptor for EX-2:2 Registry.
 */
export const ExecutiveJournalExperienceRegistryIdentity = Object.freeze({
  id: ExecutiveJournalExperienceRegistryId,
  title: ExecutiveJournalExperienceRegistryTitle,
  phase: ExecutiveJournalExperienceRegistryPhase,
  namespace: ExecutiveJournalExperienceRegistryNamespace,
  status: ExecutiveJournalExperienceRegistryStatusValue,
  readiness: ExecutiveJournalExperienceRegistryReadinessValue,
  previousPhase: ExecutiveJournalExperienceRegistryPreviousPhase,
  nextPhase: ExecutiveJournalExperienceRegistryNextPhase,
  aliases: ExecutiveJournalExperienceRegistryApprovedAliases,
  layer: "Executive Experience" as const,
  architecture: "NPA-T vNext" as const,
  domain: "Executive Journal Experience" as const,
  authorizingDecisionId: "AD-EX2-09" as const,
  description:
    "Metadata-only closed-world Registry for discovering the EX-2:1 Executive Journal Experience Foundation by exact reference. Sealed, deterministic, fail-closed. Does not create EX-2:3, UI, routes, or production behavior." as const,
  metadataOnly: true as const,
  sideEffectFree: true as const,
  closedWorld: true as const,
  sealed: true as const,
  immutable: true as const,
  deterministic: true as const,
  canonical: true as const,
  createsEx23: false as const,
  authorizesEx23: false as const,
} as const);

export const assertExecutiveJournalExperienceRegistryIdentity = (
  value: string,
): typeof ExecutiveJournalExperienceRegistryId => {
  if (value !== ExecutiveJournalExperienceRegistryId) {
    throw new Error(
      `Unknown EX-2:2 Registry identity fails closed: ${JSON.stringify(value)}`,
    );
  }
  return ExecutiveJournalExperienceRegistryId;
};

export const assertExecutiveJournalExperienceRegistryAlias = (
  value: string,
): ExecutiveJournalExperienceRegistryApprovedAlias => {
  if (
    !(
      ExecutiveJournalExperienceRegistryApprovedAliases as readonly string[]
    ).includes(value)
  ) {
    throw new Error(
      `Unknown EX-2:2 Registry alias fails closed: ${JSON.stringify(value)}`,
    );
  }
  return value as ExecutiveJournalExperienceRegistryApprovedAlias;
};

/**
 * Identity query is well-formed when it is a non-empty string with no
 * leading/trailing whitespace. No trim/normalize/repair is performed.
 */
export function isWellFormedExecutiveJournalExperienceRegistryIdentity(
  value: unknown,
): value is string {
  return typeof value === "string"
    && value.length > 0
    && value.trim() === value;
}
