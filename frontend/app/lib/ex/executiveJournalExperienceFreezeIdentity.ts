/** EX-2:8 canonical Freeze identity. */

export const ExecutiveJournalExperienceFreezeId =
  "EX-2:8/ExecutiveJournalExperienceFreeze" as const;
export const ExecutiveJournalExperienceFreezeNamespace =
  "nexora.ex.executive.journal.experience.freeze" as const;
export const ExecutiveJournalExperienceFreezeStatus = "Frozen" as const;
export const ExecutiveJournalExperienceFreezeReadiness =
  "ReadyForPublicIndex" as const;
export const ExecutiveJournalExperienceFreezePreviousPhase =
  "EX-2:7 — Executive Journal Experience Certification" as const;
export const ExecutiveJournalExperienceFreezeNextPhase =
  "EX-2:9 — Executive Journal Experience Public Index" as const;
export const ExecutiveJournalExperienceFreezeApprovedAliases = Object.freeze([
  "ExecutiveJournalExperienceFreeze",
  "EX-2:8",
] as const);

export const ExecutiveJournalExperienceFreezeIdentity = Object.freeze({
  id: ExecutiveJournalExperienceFreezeId,
  namespace: ExecutiveJournalExperienceFreezeNamespace,
  status: ExecutiveJournalExperienceFreezeStatus,
  readiness: ExecutiveJournalExperienceFreezeReadiness,
  phase: "EX-2:8" as const,
  phaseKind: "Freeze" as const,
  previousPhase: ExecutiveJournalExperienceFreezePreviousPhase,
  nextPhase: ExecutiveJournalExperienceFreezeNextPhase,
  aliases: ExecutiveJournalExperienceFreezeApprovedAliases,
  authorizationDecisionId: "AD-EX2-14" as const,
  upstreamCertificationIdentity:
    "EX-2:7/ExecutiveJournalExperienceCertification" as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
  sealed: true as const,
  readyForPublicIndexAuthorizesEx29: false as const,
});

export type ExecutiveJournalExperienceFreezeIdentityResolution =
  | Readonly<{
    ok: true;
    code: "Resolved";
    canonicalId: typeof ExecutiveJournalExperienceFreezeId;
    resolvedBy: "id" | "namespace" | "alias";
  }>
  | Readonly<{
    ok: false;
    code: "MalformedIdentity" | "UnknownIdentity";
    canonicalId: null;
  }>;

const isWellFormed = (value: unknown): value is string =>
  typeof value === "string"
  && value.length > 0
  && value === value.trim()
  && /^[A-Za-z0-9:./-]+$/.test(value);

export const resolveExecutiveJournalExperienceFreezeIdentity = (
  value: unknown,
): ExecutiveJournalExperienceFreezeIdentityResolution => {
  if (!isWellFormed(value)) {
    return Object.freeze({
      ok: false,
      code: "MalformedIdentity",
      canonicalId: null,
    });
  }
  if (value === ExecutiveJournalExperienceFreezeId) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveJournalExperienceFreezeId,
      resolvedBy: "id",
    });
  }
  if (value === ExecutiveJournalExperienceFreezeNamespace) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveJournalExperienceFreezeId,
      resolvedBy: "namespace",
    });
  }
  if (
    ExecutiveJournalExperienceFreezeApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveJournalExperienceFreezeId,
      resolvedBy: "alias",
    });
  }
  return Object.freeze({
    ok: false,
    code: "UnknownIdentity",
    canonicalId: null,
  });
};

export const assertExecutiveJournalExperienceFreezeIdentity = (
  value: unknown,
): typeof ExecutiveJournalExperienceFreezeId => {
  const result = resolveExecutiveJournalExperienceFreezeIdentity(value);
  if (!result.ok) {
    throw new Error(`EX-2:8 Freeze identity rejected: ${result.code}`);
  }
  return result.canonicalId;
};
