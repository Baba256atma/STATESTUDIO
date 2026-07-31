/**
 * EX-2:3 — Executive Journal Experience Model identity.
 */

export const ExecutiveJournalExperienceModelId =
  "EX-2:3/ExecutiveJournalExperienceModel" as const;
export const ExecutiveJournalExperienceModelNamespace =
  "nexora.ex.executive.journal.experience.model" as const;
export const ExecutiveJournalExperienceModelStatus = "Model" as const;
export const ExecutiveJournalExperienceModelReadiness =
  "ReadyForValidation" as const;
export const ExecutiveJournalExperienceModelPhase = "EX-2:3" as const;
export const ExecutiveJournalExperienceModelPreviousPhase =
  "EX-2:2 — Executive Journal Experience Registry" as const;
export const ExecutiveJournalExperienceModelNextPhaseMetadata =
  "EX-2:4 — Executive Journal Experience Validation" as const;
export const ExecutiveJournalExperienceModelRoot =
  "ExecutiveJournalExperience" as const;

export const ExecutiveJournalExperienceModelApprovedAliases = Object.freeze([
  "ExecutiveJournalExperienceModel",
  "EX-2:3",
] as const);

export const ExecutiveJournalExperienceModelIdentity = Object.freeze({
  id: ExecutiveJournalExperienceModelId,
  namespace: ExecutiveJournalExperienceModelNamespace,
  status: ExecutiveJournalExperienceModelStatus,
  readiness: ExecutiveJournalExperienceModelReadiness,
  phase: ExecutiveJournalExperienceModelPhase,
  previousPhase: ExecutiveJournalExperienceModelPreviousPhase,
  nextPhaseMetadata: ExecutiveJournalExperienceModelNextPhaseMetadata,
  root: ExecutiveJournalExperienceModelRoot,
  aliases: ExecutiveJournalExperienceModelApprovedAliases,
  authorizationDecisionId: "AD-EX2-10" as const,
  metadataOnly: true as const,
  sideEffectFree: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export type ExecutiveJournalExperienceModelIdentityResolution =
  | Readonly<{
      ok: true;
      code: "Resolved";
      canonicalId: typeof ExecutiveJournalExperienceModelId;
      resolvedBy: "id" | "namespace" | "alias";
      query: string;
    }>
  | Readonly<{
      ok: false;
      code: "MalformedIdentity" | "UnknownIdentity";
      canonicalId: null;
      query: string;
    }>;

const isWellFormedIdentityQuery = (value: unknown): value is string =>
  typeof value === "string"
  && value.length > 0
  && value === value.trim()
  && /^[A-Za-z0-9:./-]+$/.test(value);

export const resolveExecutiveJournalExperienceModelIdentity = (
  value: unknown,
): ExecutiveJournalExperienceModelIdentityResolution => {
  const query = String(value);
  if (!isWellFormedIdentityQuery(value)) {
    return Object.freeze({
      ok: false as const,
      code: "MalformedIdentity" as const,
      canonicalId: null,
      query,
    });
  }
  if (value === ExecutiveJournalExperienceModelId) {
    return Object.freeze({
      ok: true as const,
      code: "Resolved" as const,
      canonicalId: ExecutiveJournalExperienceModelId,
      resolvedBy: "id" as const,
      query: value,
    });
  }
  if (value === ExecutiveJournalExperienceModelNamespace) {
    return Object.freeze({
      ok: true as const,
      code: "Resolved" as const,
      canonicalId: ExecutiveJournalExperienceModelId,
      resolvedBy: "namespace" as const,
      query: value,
    });
  }
  if (
    ExecutiveJournalExperienceModelApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true as const,
      code: "Resolved" as const,
      canonicalId: ExecutiveJournalExperienceModelId,
      resolvedBy: "alias" as const,
      query: value,
    });
  }
  return Object.freeze({
    ok: false as const,
    code: "UnknownIdentity" as const,
    canonicalId: null,
    query: value,
  });
};

export const assertExecutiveJournalExperienceModelIdentity = (
  value: unknown,
): typeof ExecutiveJournalExperienceModelId => {
  const result = resolveExecutiveJournalExperienceModelIdentity(value);
  if (!result.ok) {
    throw new Error(`EX-2:3 model identity rejected: ${result.code}`);
  }
  return result.canonicalId;
};
