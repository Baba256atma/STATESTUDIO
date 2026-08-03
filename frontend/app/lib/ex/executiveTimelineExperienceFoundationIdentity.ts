/** EX-3:1 canonical Foundation identity. */

export const ExecutiveTimelineExperienceFoundationId =
  "EX-3:1/ExecutiveTimelineExperienceFoundation" as const;
export const ExecutiveTimelineExperienceFoundationNamespace =
  "nexora.ex.executive.timeline.experience.foundation" as const;
export const ExecutiveTimelineExperienceFoundationStatus = "Foundation" as const;
export const ExecutiveTimelineExperienceFoundationReadiness =
  "ReadyForRegistry" as const;
export const ExecutiveTimelineExperienceFoundationVersion = "1.0.0" as const;
export const ExecutiveTimelineExperienceFoundationArchitecturalLayer =
  "Executive Experience (EX)" as const;
export const ExecutiveTimelineExperienceFoundationModule =
  "Executive Timeline Experience" as const;
export const ExecutiveTimelineExperienceFoundationPreviousPhase = null;
export const ExecutiveTimelineExperienceFoundationNextPhase =
  "EX-3:2 — Executive Timeline Experience Registry" as const;
export const ExecutiveTimelineExperienceFoundationApprovedAliases = Object.freeze([
  "ExecutiveTimelineExperienceFoundation",
  "EX-3:1",
] as const);

export const ExecutiveTimelineExperienceFoundationIdentity = Object.freeze({
  id: ExecutiveTimelineExperienceFoundationId,
  namespace: ExecutiveTimelineExperienceFoundationNamespace,
  version: ExecutiveTimelineExperienceFoundationVersion,
  status: ExecutiveTimelineExperienceFoundationStatus,
  readiness: ExecutiveTimelineExperienceFoundationReadiness,
  phase: "EX-3:1" as const,
  phaseKind: "Foundation" as const,
  architecturalLayer: ExecutiveTimelineExperienceFoundationArchitecturalLayer,
  module: ExecutiveTimelineExperienceFoundationModule,
  previousPhase: ExecutiveTimelineExperienceFoundationPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceFoundationNextPhase,
  aliases: ExecutiveTimelineExperienceFoundationApprovedAliases,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
  readyForRegistryAuthorizesEx32: false as const,
});

export type ExecutiveTimelineExperienceFoundationIdentityResolution =
  | Readonly<{
    ok: true;
    code: "Resolved";
    canonicalId: typeof ExecutiveTimelineExperienceFoundationId;
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

export const resolveExecutiveTimelineExperienceFoundationIdentity = (
  value: unknown,
): ExecutiveTimelineExperienceFoundationIdentityResolution => {
  if (!isWellFormed(value)) {
    return Object.freeze({
      ok: false,
      code: "MalformedIdentity",
      canonicalId: null,
    });
  }
  if (value === ExecutiveTimelineExperienceFoundationId) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceFoundationId,
      resolvedBy: "id",
    });
  }
  if (value === ExecutiveTimelineExperienceFoundationNamespace) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceFoundationId,
      resolvedBy: "namespace",
    });
  }
  if (
    ExecutiveTimelineExperienceFoundationApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceFoundationId,
      resolvedBy: "alias",
    });
  }
  return Object.freeze({
    ok: false,
    code: "UnknownIdentity",
    canonicalId: null,
  });
};

export const assertExecutiveTimelineExperienceFoundationIdentity = (
  value: unknown,
): typeof ExecutiveTimelineExperienceFoundationId => {
  const result = resolveExecutiveTimelineExperienceFoundationIdentity(value);
  if (!result.ok) {
    throw new Error(
      `EX-3:1 Foundation identity rejected: ${result.code}`,
    );
  }
  return result.canonicalId;
};
