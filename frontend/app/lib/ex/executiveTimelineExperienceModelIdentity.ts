/** EX-3:3 canonical Model identity. */

export const ExecutiveTimelineExperienceModelId =
  "EX-3:3/ExecutiveTimelineExperienceModel" as const;
export const ExecutiveTimelineExperienceModelNamespace =
  "nexora.ex.executive.timeline.experience.model" as const;
export const ExecutiveTimelineExperienceModelStatus = "Model" as const;
export const ExecutiveTimelineExperienceModelReadiness =
  "ReadyForValidation" as const;
export const ExecutiveTimelineExperienceModelVersion = "1.0.0" as const;
export const ExecutiveTimelineExperienceModelPreviousPhase =
  "EX-3:2 — Executive Timeline Experience Registry" as const;
export const ExecutiveTimelineExperienceModelNextPhase =
  "EX-3:4 — Executive Timeline Experience Validation" as const;
export const ExecutiveTimelineExperienceModelApprovedAliases = Object.freeze([
  "ExecutiveTimelineExperienceModel",
  "EX-3:3",
] as const);

export const ExecutiveTimelineExperienceModelIdentity = Object.freeze({
  id: ExecutiveTimelineExperienceModelId,
  namespace: ExecutiveTimelineExperienceModelNamespace,
  version: ExecutiveTimelineExperienceModelVersion,
  status: ExecutiveTimelineExperienceModelStatus,
  readiness: ExecutiveTimelineExperienceModelReadiness,
  phase: "EX-3:3" as const,
  phaseKind: "Model" as const,
  architecturalLayer: "Executive Experience (EX)" as const,
  module: "Executive Timeline Experience" as const,
  previousPhase: ExecutiveTimelineExperienceModelPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceModelNextPhase,
  aliases: ExecutiveTimelineExperienceModelApprovedAliases,
  upstreamRegistryIdentity:
    "EX-3:2/ExecutiveTimelineExperienceRegistry" as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
  readyForValidationAuthorizesEx34: false as const,
});

export type ExecutiveTimelineExperienceModelIdentityResolution =
  | Readonly<{
    ok: true;
    code: "Resolved";
    canonicalId: typeof ExecutiveTimelineExperienceModelId;
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

export const resolveExecutiveTimelineExperienceModelIdentity = (
  value: unknown,
): ExecutiveTimelineExperienceModelIdentityResolution => {
  if (!isWellFormed(value)) {
    return Object.freeze({
      ok: false,
      code: "MalformedIdentity",
      canonicalId: null,
    });
  }
  if (value === ExecutiveTimelineExperienceModelId) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceModelId,
      resolvedBy: "id",
    });
  }
  if (value === ExecutiveTimelineExperienceModelNamespace) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceModelId,
      resolvedBy: "namespace",
    });
  }
  if (
    ExecutiveTimelineExperienceModelApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceModelId,
      resolvedBy: "alias",
    });
  }
  return Object.freeze({
    ok: false,
    code: "UnknownIdentity",
    canonicalId: null,
  });
};

export const assertExecutiveTimelineExperienceModelIdentity = (
  value: unknown,
): typeof ExecutiveTimelineExperienceModelId => {
  const result = resolveExecutiveTimelineExperienceModelIdentity(value);
  if (!result.ok) {
    throw new Error(`EX-3:3 Model identity rejected: ${result.code}`);
  }
  return result.canonicalId;
};
