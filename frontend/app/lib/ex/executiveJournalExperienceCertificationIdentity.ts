/** EX-2:7 canonical Certification identity. */

export const ExecutiveJournalExperienceCertificationId =
  "EX-2:7/ExecutiveJournalExperienceCertification" as const;
export const ExecutiveJournalExperienceCertificationNamespace =
  "nexora.ex.executive.journal.experience.certification" as const;
export const ExecutiveJournalExperienceCertificationStatus = "Certified" as const;
export const ExecutiveJournalExperienceCertificationReadiness =
  "ReadyForFreeze" as const;
export const ExecutiveJournalExperienceCertificationPreviousPhase =
  "EX-2:6 — Executive Journal Experience Platform" as const;
export const ExecutiveJournalExperienceCertificationNextPhase =
  "EX-2:8 — Executive Journal Experience Freeze" as const;
export const ExecutiveJournalExperienceCertificationApprovedAliases = Object.freeze([
  "ExecutiveJournalExperienceCertification",
  "EX-2:7",
] as const);

export const ExecutiveJournalExperienceCertificationIdentity = Object.freeze({
  id: ExecutiveJournalExperienceCertificationId,
  namespace: ExecutiveJournalExperienceCertificationNamespace,
  status: ExecutiveJournalExperienceCertificationStatus,
  readiness: ExecutiveJournalExperienceCertificationReadiness,
  phase: "EX-2:7" as const,
  phaseKind: "Certification" as const,
  previousPhase: ExecutiveJournalExperienceCertificationPreviousPhase,
  nextPhase: ExecutiveJournalExperienceCertificationNextPhase,
  aliases: ExecutiveJournalExperienceCertificationApprovedAliases,
  authorizationDecisionId: "AD-EX2-14" as const,
  upstreamPlatformIdentity:
    "EX-2:6/ExecutiveJournalExperiencePlatform" as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
  readyForFreezeAuthorizesEx28: false as const,
});

export type ExecutiveJournalExperienceCertificationIdentityResolution =
  | Readonly<{
    ok: true;
    code: "Resolved";
    canonicalId: typeof ExecutiveJournalExperienceCertificationId;
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

export const resolveExecutiveJournalExperienceCertificationIdentity = (
  value: unknown,
): ExecutiveJournalExperienceCertificationIdentityResolution => {
  if (!isWellFormed(value)) {
    return Object.freeze({
      ok: false,
      code: "MalformedIdentity",
      canonicalId: null,
    });
  }
  if (value === ExecutiveJournalExperienceCertificationId) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveJournalExperienceCertificationId,
      resolvedBy: "id",
    });
  }
  if (value === ExecutiveJournalExperienceCertificationNamespace) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveJournalExperienceCertificationId,
      resolvedBy: "namespace",
    });
  }
  if (
    ExecutiveJournalExperienceCertificationApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveJournalExperienceCertificationId,
      resolvedBy: "alias",
    });
  }
  return Object.freeze({
    ok: false,
    code: "UnknownIdentity",
    canonicalId: null,
  });
};

export const assertExecutiveJournalExperienceCertificationIdentity = (
  value: unknown,
): typeof ExecutiveJournalExperienceCertificationId => {
  const result = resolveExecutiveJournalExperienceCertificationIdentity(value);
  if (!result.ok) {
    throw new Error(
      `EX-2:7 Certification identity rejected: ${result.code}`,
    );
  }
  return result.canonicalId;
};
