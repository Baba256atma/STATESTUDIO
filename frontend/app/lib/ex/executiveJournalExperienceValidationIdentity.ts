/**
 * EX-2:4 — Executive Journal Experience Validation identity.
 */

export const ExecutiveJournalExperienceValidationId =
  "EX-2:4/ExecutiveJournalExperienceValidation" as const;
export const ExecutiveJournalExperienceValidationNamespace =
  "nexora.ex.executive.journal.experience.validation" as const;
export const ExecutiveJournalExperienceValidationStatus =
  "Validation" as const;
export const ExecutiveJournalExperienceValidationReadiness =
  "ReadyForManifest" as const;
export const ExecutiveJournalExperienceValidationPhase = "EX-2:4" as const;
export const ExecutiveJournalExperienceValidationPreviousPhase =
  "EX-2:3 — Executive Journal Experience Model" as const;
export const ExecutiveJournalExperienceValidationNextPhase =
  "EX-2:5 — Executive Journal Experience Manifest" as const;

export const ExecutiveJournalExperienceValidationApprovedAliases =
  Object.freeze([
    "ExecutiveJournalExperienceValidation",
    "EX-2:4",
  ] as const);

export const ExecutiveJournalExperienceValidationIdentity = Object.freeze({
  id: ExecutiveJournalExperienceValidationId,
  namespace: ExecutiveJournalExperienceValidationNamespace,
  status: ExecutiveJournalExperienceValidationStatus,
  readiness: ExecutiveJournalExperienceValidationReadiness,
  phase: ExecutiveJournalExperienceValidationPhase,
  previousPhase: ExecutiveJournalExperienceValidationPreviousPhase,
  nextPhase: ExecutiveJournalExperienceValidationNextPhase,
  aliases: ExecutiveJournalExperienceValidationApprovedAliases,
  authorizationDecisionId: "AD-EX2-12" as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
});

export type ExecutiveJournalExperienceValidationIdentityResolution =
  | Readonly<{
      ok: true;
      code: "Resolved";
      canonicalId: typeof ExecutiveJournalExperienceValidationId;
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

export const resolveExecutiveJournalExperienceValidationIdentity = (
  value: unknown,
): ExecutiveJournalExperienceValidationIdentityResolution => {
  if (!isWellFormedIdentity(value)) {
    return Object.freeze({
      ok: false as const,
      code: "MalformedIdentity" as const,
      canonicalId: null,
    });
  }
  if (value === ExecutiveJournalExperienceValidationId) {
    return Object.freeze({
      ok: true as const,
      code: "Resolved" as const,
      canonicalId: ExecutiveJournalExperienceValidationId,
      resolvedBy: "id" as const,
    });
  }
  if (value === ExecutiveJournalExperienceValidationNamespace) {
    return Object.freeze({
      ok: true as const,
      code: "Resolved" as const,
      canonicalId: ExecutiveJournalExperienceValidationId,
      resolvedBy: "namespace" as const,
    });
  }
  if (
    ExecutiveJournalExperienceValidationApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true as const,
      code: "Resolved" as const,
      canonicalId: ExecutiveJournalExperienceValidationId,
      resolvedBy: "alias" as const,
    });
  }
  return Object.freeze({
    ok: false as const,
    code: "UnknownIdentity" as const,
    canonicalId: null,
  });
};

export const assertExecutiveJournalExperienceValidationIdentity = (
  value: unknown,
): typeof ExecutiveJournalExperienceValidationId => {
  const result = resolveExecutiveJournalExperienceValidationIdentity(value);
  if (!result.ok) {
    throw new Error(`EX-2:4 validation identity rejected: ${result.code}`);
  }
  return result.canonicalId;
};
