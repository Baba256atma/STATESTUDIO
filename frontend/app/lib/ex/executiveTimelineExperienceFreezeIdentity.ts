/** EX-3:8 canonical Freeze identity. */

export const ExecutiveTimelineExperienceFreezeId =
  "EX-3:8/ExecutiveTimelineExperienceFreeze" as const;
export const ExecutiveTimelineExperienceFreezeNamespace =
  "nexora.ex.executive.timeline.experience.freeze" as const;
export const ExecutiveTimelineExperienceFreezeStatus = "Frozen" as const;
export const ExecutiveTimelineExperienceFreezeReadiness =
  "ReadyForPublicIndex" as const;
export const ExecutiveTimelineExperienceFreezeVersion = "1.0.0" as const;
export const ExecutiveTimelineExperienceFreezePreviousPhase =
  "EX-3:7 — Executive Timeline Experience Certification" as const;
export const ExecutiveTimelineExperienceFreezeNextPhase =
  "EX-3:9 — Executive Timeline Experience Public Index" as const;
export const ExecutiveTimelineExperienceFreezeApprovedAliases = Object.freeze([
  "ExecutiveTimelineExperienceFreeze",
  "EX-3:8",
] as const);

export const ExecutiveTimelineExperienceFreezeIdentity = Object.freeze({
  id: ExecutiveTimelineExperienceFreezeId,
  namespace: ExecutiveTimelineExperienceFreezeNamespace,
  version: ExecutiveTimelineExperienceFreezeVersion,
  status: ExecutiveTimelineExperienceFreezeStatus,
  readiness: ExecutiveTimelineExperienceFreezeReadiness,
  phase: "EX-3:8" as const,
  phaseKind: "Freeze" as const,
  architecturalLayer: "Executive Experience (EX)" as const,
  module: "Executive Timeline Experience" as const,
  previousPhase: ExecutiveTimelineExperienceFreezePreviousPhase,
  nextPhase: ExecutiveTimelineExperienceFreezeNextPhase,
  aliases: ExecutiveTimelineExperienceFreezeApprovedAliases,
  upstreamCertificationIdentity:
    "EX-3:7/ExecutiveTimelineExperienceCertification" as const,
  authorizationReference:
    "EX-3:8/ReadyForPublicIndexDoesNotAuthorizePublicIndex" as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
  sealed: true as const,
  readyForPublicIndexAuthorizesEx39: false as const,
});

export type ExecutiveTimelineExperienceFreezeIdentityResolution =
  | Readonly<{
    ok: true;
    code: "Resolved";
    canonicalId: typeof ExecutiveTimelineExperienceFreezeId;
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

export const resolveExecutiveTimelineExperienceFreezeIdentity = (
  value: unknown,
): ExecutiveTimelineExperienceFreezeIdentityResolution => {
  if (!isWellFormed(value)) {
    return Object.freeze({
      ok: false,
      code: "MalformedIdentity",
      canonicalId: null,
    });
  }
  if (value === ExecutiveTimelineExperienceFreezeId) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceFreezeId,
      resolvedBy: "id",
    });
  }
  if (value === ExecutiveTimelineExperienceFreezeNamespace) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceFreezeId,
      resolvedBy: "namespace",
    });
  }
  if (
    ExecutiveTimelineExperienceFreezeApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceFreezeId,
      resolvedBy: "alias",
    });
  }
  return Object.freeze({
    ok: false,
    code: "UnknownIdentity",
    canonicalId: null,
  });
};

export const assertExecutiveTimelineExperienceFreezeIdentity = (
  value: unknown,
): typeof ExecutiveTimelineExperienceFreezeId => {
  const result = resolveExecutiveTimelineExperienceFreezeIdentity(value);
  if (!result.ok) {
    throw new Error(`EX-3:8 Freeze identity rejected: ${result.code}`);
  }
  return result.canonicalId;
};
