/**
 * EX-2:1 — Executive Journal Experience Foundation Identity.
 *
 * Canonical immutable identity, aliases, and fail-closed guards.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EX-2:1.
 */

import type {
  ExecutiveJournalExperienceFoundationPhase,
  ExecutiveJournalExperienceFoundationReadiness,
  ExecutiveJournalExperienceFoundationStatus,
} from "./executiveJournalExperienceTypes.ts";

/** Canonical foundation identity. */
export const ExecutiveJournalExperienceFoundationId =
  "EX-2:1/ExecutiveJournalExperienceFoundation" as const;

/** Human-readable title. */
export const ExecutiveJournalExperienceFoundationTitle =
  "Executive Journal Experience Foundation" as const;

/** Canonical namespace. */
export const ExecutiveJournalExperienceFoundationNamespace =
  "nexora.ex.executive.journal.experience.foundation" as const;

/** Foundation status. */
export const ExecutiveJournalExperienceFoundationStatusValue:
  ExecutiveJournalExperienceFoundationStatus = "Foundation";

/** Immediate next-phase readiness. */
export const ExecutiveJournalExperienceFoundationReadinessValue:
  ExecutiveJournalExperienceFoundationReadiness = "ReadyForRegistry";

/** Phase key. */
export const ExecutiveJournalExperienceFoundationPhaseValue:
  ExecutiveJournalExperienceFoundationPhase = "EX-2:1";

/** Canonical next phase metadata only — not created or authorized. */
export const ExecutiveJournalExperienceFoundationNextPhase =
  "EX-2:2 — Executive Journal Experience Registry" as const;

/** Approved aliases — exact match only. */
export const ExecutiveJournalExperienceFoundationApprovedAliases =
  Object.freeze([
    "ExecutiveJournalExperienceFoundation",
    "EX-2:1",
  ] as const);

export type ExecutiveJournalExperienceFoundationApprovedAlias =
  (typeof ExecutiveJournalExperienceFoundationApprovedAliases)[number];

/**
 * Immutable identity descriptor for EX-2:1 Foundation.
 */
export const ExecutiveJournalExperienceIdentity = Object.freeze({
  id: ExecutiveJournalExperienceFoundationId,
  title: ExecutiveJournalExperienceFoundationTitle,
  phase: ExecutiveJournalExperienceFoundationPhaseValue,
  namespace: ExecutiveJournalExperienceFoundationNamespace,
  status: ExecutiveJournalExperienceFoundationStatusValue,
  readiness: ExecutiveJournalExperienceFoundationReadinessValue,
  nextPhase: ExecutiveJournalExperienceFoundationNextPhase,
  aliases: ExecutiveJournalExperienceFoundationApprovedAliases,
  layer: "Executive Experience" as const,
  architecture: "NPA-T vNext" as const,
  domain: "Executive Journal Experience" as const,
  target: "Nexora Executive Experience MVP" as const,
  authorizingDecisionId: "AD-EX2-08" as const,
  description:
    "Metadata-only architectural foundation of the Nexora Executive Journal Experience. Establishes identity, boundaries, evidence references, decisions, open issues, and ReadyForRegistry readiness for EX-2:2 Registry. Does not create UI, routes, providers, runtime integrations, or later EX-2 phases." as const,
  metadataOnly: true as const,
  sideEffectFree: true as const,
  immutable: true as const,
  deterministic: true as const,
  canonical: true as const,
  mutable: false as const,
  createsEx22: false as const,
  authorizesEx22: false as const,
} as const);

export const assertExecutiveJournalExperienceFoundationIdentity = (
  value: string,
): typeof ExecutiveJournalExperienceFoundationId => {
  if (value !== ExecutiveJournalExperienceFoundationId) {
    throw new Error(
      `Unknown EX-2:1 Foundation identity fails closed: ${JSON.stringify(value)}`,
    );
  }
  return ExecutiveJournalExperienceFoundationId;
};

export const assertExecutiveJournalExperienceFoundationAlias = (
  value: string,
): ExecutiveJournalExperienceFoundationApprovedAlias => {
  if (
    !(
      ExecutiveJournalExperienceFoundationApprovedAliases as readonly string[]
    ).includes(value)
  ) {
    throw new Error(
      `Unknown EX-2:1 Foundation alias fails closed: ${JSON.stringify(value)}`,
    );
  }
  return value as ExecutiveJournalExperienceFoundationApprovedAlias;
};

export const isExecutiveJournalExperienceFoundationIdentityOrAlias = (
  value: string,
): boolean =>
  value === ExecutiveJournalExperienceFoundationId
  || (
    ExecutiveJournalExperienceFoundationApprovedAliases as readonly string[]
  ).includes(value);

export const resolveExecutiveJournalExperienceFoundationIdentity = (
  value: string,
): typeof ExecutiveJournalExperienceFoundationId => {
  if (value === ExecutiveJournalExperienceFoundationId) {
    return ExecutiveJournalExperienceFoundationId;
  }
  if (
    (
      ExecutiveJournalExperienceFoundationApprovedAliases as readonly string[]
    ).includes(value)
  ) {
    return ExecutiveJournalExperienceFoundationId;
  }
  throw new Error(
    `Unknown EX-2:1 Foundation identity or alias fails closed: ${JSON.stringify(value)}`,
  );
};
