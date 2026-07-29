/**
 * EX-1:5 — Executive Stage Manifest Identity.
 *
 * Canonical immutable identity for the Executive Stage Manifest.
 * Identity never changes after release.
 *
 * Ownership: owned exclusively by EX-1:5.
 */

/** Canonical manifest identity. */
export const ExecutiveStageManifestId =
  "EX-1:5/ExecutiveStageManifest" as const;

export const ExecutiveStageManifestName =
  "Executive Stage Manifest" as const;

export const ExecutiveStageName = "Executive Stage" as const;

export const ExecutiveStageManifestVersion = "1.0.0" as const;

export const ExecutiveStageManifestNamespace =
  "nexora.ex.executive.stage.manifest" as const;

export const ExecutiveStageManifestStatus = "Manifest" as const;

export const ExecutiveStageManifestReadiness = "ReadyForPlatform" as const;

export const ExecutiveStageManifestNextPhase =
  "EX-1:6 — Executive Stage Platform" as const;

/**
 * Immutable identity descriptor for EX-1:5 Manifest.
 */
export const ExecutiveStageManifestIdentity = Object.freeze({
  id: ExecutiveStageManifestId,
  name: ExecutiveStageManifestName,
  stageName: ExecutiveStageName,
  phaseId: "EX-1:5" as const,
  version: ExecutiveStageManifestVersion,
  namespace: ExecutiveStageManifestNamespace,
  status: ExecutiveStageManifestStatus,
  readiness: ExecutiveStageManifestReadiness,
  layer: "Executive Experience" as const,
  architecture: "NPA-T vNext" as const,
  domain: "Executive Stage" as const,
  canonical: true as const,
  mutable: false as const,
  identityNeverChangesAfterRelease: true as const,
  sourceValidation: "EX-1:4/ExecutiveStageValidation" as const,
  upstream: "EX-1:4 — Executive Stage Validation" as const,
  target: "Nexora Executive Experience MVP" as const,
  nextPhase: ExecutiveStageManifestNextPhase,
  description:
    "Canonical release description of the Executive Stage. Assembles Foundation, Registry, Model and Validation into one immutable architectural package description without rendering, Runtime state, or business behaviour.",
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
