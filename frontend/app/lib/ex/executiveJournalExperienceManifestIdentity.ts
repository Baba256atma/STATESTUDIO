/**
 * EX-2:5 — Executive Journal Experience Manifest canonical identity.
 */

export const ExecutiveJournalExperienceManifestId =
  "EX-2:5/ExecutiveJournalExperienceManifest" as const;
export const ExecutiveJournalExperienceManifestNamespace =
  "nexora.ex.executive.journal.experience.manifest" as const;
export const ExecutiveJournalExperienceManifestStatus = "Manifest" as const;
export const ExecutiveJournalExperienceManifestReadiness =
  "ReadyForPlatform" as const;
export const ExecutiveJournalExperienceManifestPhase = "EX-2:5" as const;
export const ExecutiveJournalExperienceManifestPreviousPhase =
  "EX-2:4 — Executive Journal Experience Validation" as const;
export const ExecutiveJournalExperienceManifestNextPhase =
  "EX-2:6 — Executive Journal Experience Platform" as const;

export const ExecutiveJournalExperienceManifestApprovedAliases = Object.freeze([
  "ExecutiveJournalExperienceManifest",
  "EX-2:5",
] as const);

export const ExecutiveJournalExperienceManifestIdentity = Object.freeze({
  id: ExecutiveJournalExperienceManifestId,
  namespace: ExecutiveJournalExperienceManifestNamespace,
  status: ExecutiveJournalExperienceManifestStatus,
  readiness: ExecutiveJournalExperienceManifestReadiness,
  phase: ExecutiveJournalExperienceManifestPhase,
  previousPhase: ExecutiveJournalExperienceManifestPreviousPhase,
  nextPhase: ExecutiveJournalExperienceManifestNextPhase,
  aliases: ExecutiveJournalExperienceManifestApprovedAliases,
  authorizationDecisionId: "AD-EX2-13" as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
  readyForPlatformAuthorizesEx26: false as const,
});

export type ExecutiveJournalExperienceManifestIdentityResolution =
  | Readonly<{
      ok: true;
      code: "Resolved";
      canonicalId: typeof ExecutiveJournalExperienceManifestId;
      resolvedBy: "id" | "namespace" | "alias";
    }>
  | Readonly<{
      ok: false;
      code: "MalformedIdentity" | "UnknownIdentity";
      canonicalId: null;
    }>;

const isWellFormedIdentity = (value: unknown): value is string =>
  typeof value === "string"
  && value.length > 0
  && value === value.trim()
  && /^[A-Za-z0-9:./-]+$/.test(value);

export const resolveExecutiveJournalExperienceManifestIdentity = (
  value: unknown,
): ExecutiveJournalExperienceManifestIdentityResolution => {
  if (!isWellFormedIdentity(value)) {
    return Object.freeze({
      ok: false as const,
      code: "MalformedIdentity" as const,
      canonicalId: null,
    });
  }
  if (value === ExecutiveJournalExperienceManifestId) {
    return Object.freeze({
      ok: true as const,
      code: "Resolved" as const,
      canonicalId: ExecutiveJournalExperienceManifestId,
      resolvedBy: "id" as const,
    });
  }
  if (value === ExecutiveJournalExperienceManifestNamespace) {
    return Object.freeze({
      ok: true as const,
      code: "Resolved" as const,
      canonicalId: ExecutiveJournalExperienceManifestId,
      resolvedBy: "namespace" as const,
    });
  }
  if (
    ExecutiveJournalExperienceManifestApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true as const,
      code: "Resolved" as const,
      canonicalId: ExecutiveJournalExperienceManifestId,
      resolvedBy: "alias" as const,
    });
  }
  return Object.freeze({
    ok: false as const,
    code: "UnknownIdentity" as const,
    canonicalId: null,
  });
};

export const assertExecutiveJournalExperienceManifestIdentity = (
  value: unknown,
): typeof ExecutiveJournalExperienceManifestId => {
  const resolution =
    resolveExecutiveJournalExperienceManifestIdentity(value);
  if (!resolution.ok) {
    throw new Error(`EX-2:5 manifest identity rejected: ${resolution.code}`);
  }
  return resolution.canonicalId;
};
