/** EX-2:6 canonical Platform identity. */

export const ExecutiveJournalExperiencePlatformId = "EX-2:6/ExecutiveJournalExperiencePlatform" as const;
export const ExecutiveJournalExperiencePlatformNamespace = "nexora.ex.executive.journal.experience.platform" as const;
export const ExecutiveJournalExperiencePlatformStatus = "Platform" as const;
export const ExecutiveJournalExperiencePlatformReadiness = "ReadyForCertification" as const;
export const ExecutiveJournalExperiencePlatformPreviousPhase = "EX-2:5 — Executive Journal Experience Manifest" as const;
export const ExecutiveJournalExperiencePlatformNextPhase = "EX-2:7 — Executive Journal Experience Certification" as const;
export const ExecutiveJournalExperiencePlatformApprovedAliases = Object.freeze(["ExecutiveJournalExperiencePlatform", "EX-2:6"] as const);

export const ExecutiveJournalExperiencePlatformIdentity = Object.freeze({
  id: ExecutiveJournalExperiencePlatformId,
  namespace: ExecutiveJournalExperiencePlatformNamespace,
  status: ExecutiveJournalExperiencePlatformStatus,
  readiness: ExecutiveJournalExperiencePlatformReadiness,
  phase: "EX-2:6" as const,
  previousPhase: ExecutiveJournalExperiencePlatformPreviousPhase,
  nextPhase: ExecutiveJournalExperiencePlatformNextPhase,
  aliases: ExecutiveJournalExperiencePlatformApprovedAliases,
  authorizationDecisionId: "AD-EX2-14" as const,
  metadataOnly: true as const,
  contractOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
  readyForCertificationAuthorizesEx27: false as const,
});

export type ExecutiveJournalExperiencePlatformIdentityResolution =
  | Readonly<{ ok: true; code: "Resolved"; canonicalId: typeof ExecutiveJournalExperiencePlatformId; resolvedBy: "id" | "namespace" | "alias" }>
  | Readonly<{ ok: false; code: "MalformedIdentity" | "UnknownIdentity"; canonicalId: null }>;

const isWellFormed = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0 && value === value.trim()
  && /^[A-Za-z0-9:./-]+$/.test(value);

export const resolveExecutiveJournalExperiencePlatformIdentity = (
  value: unknown,
): ExecutiveJournalExperiencePlatformIdentityResolution => {
  if (!isWellFormed(value)) return Object.freeze({ ok: false, code: "MalformedIdentity", canonicalId: null });
  if (value === ExecutiveJournalExperiencePlatformId) return Object.freeze({ ok: true, code: "Resolved", canonicalId: ExecutiveJournalExperiencePlatformId, resolvedBy: "id" });
  if (value === ExecutiveJournalExperiencePlatformNamespace) return Object.freeze({ ok: true, code: "Resolved", canonicalId: ExecutiveJournalExperiencePlatformId, resolvedBy: "namespace" });
  if (ExecutiveJournalExperiencePlatformApprovedAliases.some((alias) => alias === value)) {
    return Object.freeze({ ok: true, code: "Resolved", canonicalId: ExecutiveJournalExperiencePlatformId, resolvedBy: "alias" });
  }
  return Object.freeze({ ok: false, code: "UnknownIdentity", canonicalId: null });
};

export const assertExecutiveJournalExperiencePlatformIdentity = (value: unknown): typeof ExecutiveJournalExperiencePlatformId => {
  const result = resolveExecutiveJournalExperiencePlatformIdentity(value);
  if (!result.ok) throw new Error(`EX-2:6 Platform identity rejected: ${result.code}`);
  return result.canonicalId;
};
