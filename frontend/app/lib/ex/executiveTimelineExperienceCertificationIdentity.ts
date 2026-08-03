/** EX-3:7 canonical Certification identity. */

export const ExecutiveTimelineExperienceCertificationId =
  "EX-3:7/ExecutiveTimelineExperienceCertification" as const;
export const ExecutiveTimelineExperienceCertificationNamespace =
  "nexora.ex.executive.timeline.experience.certification" as const;
export const ExecutiveTimelineExperienceCertificationStatus = "Certified" as const;
export const ExecutiveTimelineExperienceCertificationReadiness =
  "ReadyForFreeze" as const;
export const ExecutiveTimelineExperienceCertificationVersion = "1.0.0" as const;
export const ExecutiveTimelineExperienceCertificationPreviousPhase =
  "EX-3:6 — Executive Timeline Experience Platform" as const;
export const ExecutiveTimelineExperienceCertificationNextPhase =
  "EX-3:8 — Executive Timeline Experience Freeze" as const;
export const ExecutiveTimelineExperienceCertificationApprovedAliases =
  Object.freeze([
    "ExecutiveTimelineExperienceCertification",
    "EX-3:7",
  ] as const);

export const ExecutiveTimelineExperienceCertificationIdentity = Object.freeze({
  id: ExecutiveTimelineExperienceCertificationId,
  namespace: ExecutiveTimelineExperienceCertificationNamespace,
  version: ExecutiveTimelineExperienceCertificationVersion,
  status: ExecutiveTimelineExperienceCertificationStatus,
  readiness: ExecutiveTimelineExperienceCertificationReadiness,
  phase: "EX-3:7" as const,
  phaseKind: "Certification" as const,
  architecturalLayer: "Executive Experience (EX)" as const,
  module: "Executive Timeline Experience" as const,
  previousPhase: ExecutiveTimelineExperienceCertificationPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceCertificationNextPhase,
  aliases: ExecutiveTimelineExperienceCertificationApprovedAliases,
  upstreamPlatformIdentity:
    "EX-3:6/ExecutiveTimelineExperiencePlatform" as const,
  authorizationReference:
    "EX-3:7/ReadyForFreezeDoesNotAuthorizeFreeze" as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
  readyForFreezeAuthorizesEx38: false as const,
});

export type ExecutiveTimelineExperienceCertificationIdentityResolution =
  | Readonly<{
    ok: true;
    code: "Resolved";
    canonicalId: typeof ExecutiveTimelineExperienceCertificationId;
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

export const resolveExecutiveTimelineExperienceCertificationIdentity = (
  value: unknown,
): ExecutiveTimelineExperienceCertificationIdentityResolution => {
  if (!isWellFormed(value)) {
    return Object.freeze({
      ok: false,
      code: "MalformedIdentity",
      canonicalId: null,
    });
  }
  if (value === ExecutiveTimelineExperienceCertificationId) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceCertificationId,
      resolvedBy: "id",
    });
  }
  if (value === ExecutiveTimelineExperienceCertificationNamespace) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceCertificationId,
      resolvedBy: "namespace",
    });
  }
  if (
    ExecutiveTimelineExperienceCertificationApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceCertificationId,
      resolvedBy: "alias",
    });
  }
  return Object.freeze({
    ok: false,
    code: "UnknownIdentity",
    canonicalId: null,
  });
};

export const assertExecutiveTimelineExperienceCertificationIdentity = (
  value: unknown,
): typeof ExecutiveTimelineExperienceCertificationId => {
  const result = resolveExecutiveTimelineExperienceCertificationIdentity(value);
  if (!result.ok) {
    throw new Error(`EX-3:7 Certification identity rejected: ${result.code}`);
  }
  return result.canonicalId;
};
