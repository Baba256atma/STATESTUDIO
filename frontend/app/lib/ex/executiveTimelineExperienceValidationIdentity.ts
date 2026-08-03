/** EX-3:4 canonical Validation identity. */

export const ExecutiveTimelineExperienceValidationId =
  "EX-3:4/ExecutiveTimelineExperienceValidation" as const;
export const ExecutiveTimelineExperienceValidationNamespace =
  "nexora.ex.executive.timeline.experience.validation" as const;
export const ExecutiveTimelineExperienceValidationStatus = "Validation" as const;
export const ExecutiveTimelineExperienceValidationReadiness =
  "ReadyForManifest" as const;
export const ExecutiveTimelineExperienceValidationVersion = "1.0.0" as const;
export const ExecutiveTimelineExperienceValidationPreviousPhase =
  "EX-3:3 — Executive Timeline Experience Model" as const;
export const ExecutiveTimelineExperienceValidationNextPhase =
  "EX-3:5 — Executive Timeline Experience Manifest" as const;
export const ExecutiveTimelineExperienceValidationApprovedAliases = Object.freeze([
  "ExecutiveTimelineExperienceValidation",
  "EX-3:4",
] as const);

export const ExecutiveTimelineExperienceValidationIdentity = Object.freeze({
  id: ExecutiveTimelineExperienceValidationId,
  namespace: ExecutiveTimelineExperienceValidationNamespace,
  version: ExecutiveTimelineExperienceValidationVersion,
  status: ExecutiveTimelineExperienceValidationStatus,
  readiness: ExecutiveTimelineExperienceValidationReadiness,
  phase: "EX-3:4" as const,
  phaseKind: "Validation" as const,
  architecturalLayer: "Executive Experience (EX)" as const,
  module: "Executive Timeline Experience" as const,
  previousPhase: ExecutiveTimelineExperienceValidationPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceValidationNextPhase,
  aliases: ExecutiveTimelineExperienceValidationApprovedAliases,
  upstreamModelIdentity: "EX-3:3/ExecutiveTimelineExperienceModel" as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
  readyForManifestAuthorizesEx35: false as const,
});

export type ExecutiveTimelineExperienceValidationIdentityResolution =
  | Readonly<{
    ok: true;
    code: "Resolved";
    canonicalId: typeof ExecutiveTimelineExperienceValidationId;
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

export const resolveExecutiveTimelineExperienceValidationIdentity = (
  value: unknown,
): ExecutiveTimelineExperienceValidationIdentityResolution => {
  if (!isWellFormed(value)) {
    return Object.freeze({
      ok: false,
      code: "MalformedIdentity",
      canonicalId: null,
    });
  }
  if (value === ExecutiveTimelineExperienceValidationId) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceValidationId,
      resolvedBy: "id",
    });
  }
  if (value === ExecutiveTimelineExperienceValidationNamespace) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceValidationId,
      resolvedBy: "namespace",
    });
  }
  if (
    ExecutiveTimelineExperienceValidationApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceValidationId,
      resolvedBy: "alias",
    });
  }
  return Object.freeze({
    ok: false,
    code: "UnknownIdentity",
    canonicalId: null,
  });
};

export const assertExecutiveTimelineExperienceValidationIdentity = (
  value: unknown,
): typeof ExecutiveTimelineExperienceValidationId => {
  const result = resolveExecutiveTimelineExperienceValidationIdentity(value);
  if (!result.ok) {
    throw new Error(`EX-3:4 Validation identity rejected: ${result.code}`);
  }
  return result.canonicalId;
};
