/** EX-3:2 canonical Registry identity. */

export const ExecutiveTimelineExperienceRegistryId =
  "EX-3:2/ExecutiveTimelineExperienceRegistry" as const;
export const ExecutiveTimelineExperienceRegistryNamespace =
  "nexora.ex.executive.timeline.experience.registry" as const;
export const ExecutiveTimelineExperienceRegistryStatus = "Registry" as const;
export const ExecutiveTimelineExperienceRegistryReadiness =
  "ReadyForModel" as const;
export const ExecutiveTimelineExperienceRegistryVersion = "1.0.0" as const;
export const ExecutiveTimelineExperienceRegistryPreviousPhase =
  "EX-3:1 — Executive Timeline Experience Foundation" as const;
export const ExecutiveTimelineExperienceRegistryNextPhase =
  "EX-3:3 — Executive Timeline Experience Model" as const;
export const ExecutiveTimelineExperienceRegistryApprovedAliases = Object.freeze([
  "ExecutiveTimelineExperienceRegistry",
  "EX-3:2",
] as const);

export const ExecutiveTimelineExperienceRegistryIdentity = Object.freeze({
  id: ExecutiveTimelineExperienceRegistryId,
  namespace: ExecutiveTimelineExperienceRegistryNamespace,
  version: ExecutiveTimelineExperienceRegistryVersion,
  status: ExecutiveTimelineExperienceRegistryStatus,
  readiness: ExecutiveTimelineExperienceRegistryReadiness,
  phase: "EX-3:2" as const,
  phaseKind: "Registry" as const,
  architecturalLayer: "Executive Experience (EX)" as const,
  module: "Executive Timeline Experience" as const,
  previousPhase: ExecutiveTimelineExperienceRegistryPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceRegistryNextPhase,
  aliases: ExecutiveTimelineExperienceRegistryApprovedAliases,
  upstreamFoundationIdentity:
    "EX-3:1/ExecutiveTimelineExperienceFoundation" as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
  failClosed: true as const,
  readyForModelAuthorizesEx33: false as const,
});

export type ExecutiveTimelineExperienceRegistryIdentityResolution =
  | Readonly<{
    ok: true;
    code: "Resolved";
    canonicalId: typeof ExecutiveTimelineExperienceRegistryId;
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

export const resolveExecutiveTimelineExperienceRegistryIdentity = (
  value: unknown,
): ExecutiveTimelineExperienceRegistryIdentityResolution => {
  if (!isWellFormed(value)) {
    return Object.freeze({
      ok: false,
      code: "MalformedIdentity",
      canonicalId: null,
    });
  }
  if (value === ExecutiveTimelineExperienceRegistryId) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceRegistryId,
      resolvedBy: "id",
    });
  }
  if (value === ExecutiveTimelineExperienceRegistryNamespace) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceRegistryId,
      resolvedBy: "namespace",
    });
  }
  if (
    ExecutiveTimelineExperienceRegistryApprovedAliases.some(
      (alias) => alias === value,
    )
  ) {
    return Object.freeze({
      ok: true,
      code: "Resolved",
      canonicalId: ExecutiveTimelineExperienceRegistryId,
      resolvedBy: "alias",
    });
  }
  return Object.freeze({
    ok: false,
    code: "UnknownIdentity",
    canonicalId: null,
  });
};

export const assertExecutiveTimelineExperienceRegistryIdentity = (
  value: unknown,
): typeof ExecutiveTimelineExperienceRegistryId => {
  const result = resolveExecutiveTimelineExperienceRegistryIdentity(value);
  if (!result.ok) {
    throw new Error(`EX-3:2 Registry identity rejected: ${result.code}`);
  }
  return result.canonicalId;
};
