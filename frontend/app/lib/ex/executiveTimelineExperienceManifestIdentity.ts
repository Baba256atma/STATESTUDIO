/** EX-3:5 canonical Manifest identity. */

export const ExecutiveTimelineExperienceManifestId =
  "EX-3:5/ExecutiveTimelineExperienceManifest" as const;
export const ExecutiveTimelineExperienceManifestNamespace =
  "nexora.ex.executive.timeline.experience.manifest" as const;
export const ExecutiveTimelineExperienceManifestStatus = "Manifest" as const;
export const ExecutiveTimelineExperienceManifestReadiness =
  "ReadyForPlatform" as const;
export const ExecutiveTimelineExperienceManifestVersion = "1.0.0" as const;
export const ExecutiveTimelineExperienceManifestPreviousPhase =
  "EX-3:4 — Executive Timeline Experience Validation" as const;
export const ExecutiveTimelineExperienceManifestNextPhase =
  "EX-3:6 — Executive Timeline Experience Platform" as const;
export const ExecutiveTimelineExperienceManifestApprovedAliases = Object.freeze([
  "ExecutiveTimelineExperienceManifest",
  "EX-3:5",
] as const);

export const ExecutiveTimelineExperienceManifestIdentity = Object.freeze({
  id: ExecutiveTimelineExperienceManifestId,
  namespace: ExecutiveTimelineExperienceManifestNamespace,
  version: ExecutiveTimelineExperienceManifestVersion,
  status: ExecutiveTimelineExperienceManifestStatus,
  readiness: ExecutiveTimelineExperienceManifestReadiness,
  phase: "EX-3:5" as const,
  phaseKind: "Manifest" as const,
  architecturalLayer: "Executive Experience (EX)" as const,
  module: "Executive Timeline Experience" as const,
  previousPhase: ExecutiveTimelineExperienceManifestPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceManifestNextPhase,
  aliases: ExecutiveTimelineExperienceManifestApprovedAliases,
  upstreamValidationIdentity:
    "EX-3:4/ExecutiveTimelineExperienceValidation" as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
  readyForPlatformAuthorizesEx36: false as const,
});

export type ExecutiveTimelineExperienceManifestIdentityResolution =
  | Readonly<{
    ok: true;
    code: "Resolved";
    canonicalId: typeof ExecutiveTimelineExperienceManifestId;
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

export const resolveExecutiveTimelineExperienceManifestIdentity = (
  value: unknown,
): ExecutiveTimelineExperienceManifestIdentityResolution => {
  if (!isWellFormed(value)) {
    return Object.freeze({
      ok: false,
      code: "MalformedIdentity",
      canonicalId: null,
    });
  }
  if (value === ExecutiveTimelineExperienceManifestId) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceManifestId,
      resolvedBy: "id",
    });
  }
  if (value === ExecutiveTimelineExperienceManifestNamespace) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceManifestId,
      resolvedBy: "namespace",
    });
  }
  if (
    ExecutiveTimelineExperienceManifestApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceManifestId,
      resolvedBy: "alias",
    });
  }
  return Object.freeze({
    ok: false,
    code: "UnknownIdentity",
    canonicalId: null,
  });
};

export const assertExecutiveTimelineExperienceManifestIdentity = (
  value: unknown,
): typeof ExecutiveTimelineExperienceManifestId => {
  const result = resolveExecutiveTimelineExperienceManifestIdentity(value);
  if (!result.ok) {
    throw new Error(`EX-3:5 Manifest identity rejected: ${result.code}`);
  }
  return result.canonicalId;
};
