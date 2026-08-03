/** EX-3:6 canonical Platform identity. */

export const ExecutiveTimelineExperiencePlatformId =
  "EX-3:6/ExecutiveTimelineExperiencePlatform" as const;
export const ExecutiveTimelineExperiencePlatformNamespace =
  "nexora.ex.executive.timeline.experience.platform" as const;
export const ExecutiveTimelineExperiencePlatformStatus = "Platform" as const;
export const ExecutiveTimelineExperiencePlatformReadiness =
  "ReadyForCertification" as const;
export const ExecutiveTimelineExperiencePlatformVersion = "1.0.0" as const;
export const ExecutiveTimelineExperiencePlatformPreviousPhase =
  "EX-3:5 — Executive Timeline Experience Manifest" as const;
export const ExecutiveTimelineExperiencePlatformNextPhase =
  "EX-3:7 — Executive Timeline Experience Certification" as const;
export const ExecutiveTimelineExperiencePlatformApprovedAliases = Object.freeze([
  "ExecutiveTimelineExperiencePlatform",
  "EX-3:6",
] as const);

export const ExecutiveTimelineExperiencePlatformIdentity = Object.freeze({
  id: ExecutiveTimelineExperiencePlatformId,
  namespace: ExecutiveTimelineExperiencePlatformNamespace,
  version: ExecutiveTimelineExperiencePlatformVersion,
  status: ExecutiveTimelineExperiencePlatformStatus,
  readiness: ExecutiveTimelineExperiencePlatformReadiness,
  phase: "EX-3:6" as const,
  phaseKind: "Platform" as const,
  architecturalLayer: "Executive Experience (EX)" as const,
  module: "Executive Timeline Experience" as const,
  previousPhase: ExecutiveTimelineExperiencePlatformPreviousPhase,
  nextPhase: ExecutiveTimelineExperiencePlatformNextPhase,
  aliases: ExecutiveTimelineExperiencePlatformApprovedAliases,
  upstreamManifestIdentity:
    "EX-3:5/ExecutiveTimelineExperienceManifest" as const,
  authorizationReference:
    "EX-3:6/ReadyForCertificationDoesNotAuthorizeCertification" as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
  readyForCertificationAuthorizesEx37: false as const,
});

export type ExecutiveTimelineExperiencePlatformIdentityResolution =
  | Readonly<{
    ok: true;
    code: "Resolved";
    canonicalId: typeof ExecutiveTimelineExperiencePlatformId;
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

export const resolveExecutiveTimelineExperiencePlatformIdentity = (
  value: unknown,
): ExecutiveTimelineExperiencePlatformIdentityResolution => {
  if (!isWellFormed(value)) {
    return Object.freeze({
      ok: false,
      code: "MalformedIdentity",
      canonicalId: null,
    });
  }
  if (value === ExecutiveTimelineExperiencePlatformId) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperiencePlatformId,
      resolvedBy: "id",
    });
  }
  if (value === ExecutiveTimelineExperiencePlatformNamespace) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperiencePlatformId,
      resolvedBy: "namespace",
    });
  }
  if (
    ExecutiveTimelineExperiencePlatformApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperiencePlatformId,
      resolvedBy: "alias",
    });
  }
  return Object.freeze({
    ok: false,
    code: "UnknownIdentity",
    canonicalId: null,
  });
};

export const assertExecutiveTimelineExperiencePlatformIdentity = (
  value: unknown,
): typeof ExecutiveTimelineExperiencePlatformId => {
  const result = resolveExecutiveTimelineExperiencePlatformIdentity(value);
  if (!result.ok) {
    throw new Error(`EX-3:6 Platform identity rejected: ${result.code}`);
  }
  return result.canonicalId;
};
