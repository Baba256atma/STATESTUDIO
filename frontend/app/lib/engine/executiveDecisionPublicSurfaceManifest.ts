import type { ExecutiveDecisionManifestPublicSurface } from "./executiveDecisionManifestTypes.ts";

const surface = (
  phaseId: ExecutiveDecisionManifestPublicSurface["phaseId"],
  moduleName: string,
  namespace: string,
  approvedExportCount: number,
  exportCategory: string,
  compatibilityDeclaration: string,
) => Object.freeze({
  phaseId,
  moduleName,
  namespace,
  approvedExportCount,
  exportCategory,
  stability: "Stable",
  immutability: "DeeplyFrozen",
  metadataOnly: true,
  supportedConsumers: Object.freeze(["ENG-7:5", "ENG-7:6", "ENG-8", "Advisor"] as const),
  internalImportProhibition: "Prohibited",
  replacementPolicy: "VersionedAdditiveOnly",
  compatibilityDeclaration,
} as const satisfies ExecutiveDecisionManifestPublicSurface);

/**
 * Canonical public-surface manifest for approved ENG-7 phase modules.
 * Final public index belongs to ENG-7:9.
 */
export const ExecutiveDecisionPublicSurfaceManifest = Object.freeze({
  id: "eng-7-manifest-public-surface",
  name: "Executive Decision Public Surface Manifest",
  surfaces: Object.freeze([
    surface(
      "ENG-7:1",
      "executiveDecisionPublicApi.ts",
      "nexora.engine.executive.decision.foundation",
      6,
      "FoundationPublicApi",
      "Compatible with ENG-7 foundation consumers.",
    ),
    surface(
      "ENG-7:2",
      "executiveDecisionRegistryPlatform.ts",
      "Nexora.Engine.ExecutiveDecision.Registry",
      7,
      "RegistryPublicApi",
      "Compatible with ENG-7 registry consumers.",
    ),
    surface(
      "ENG-7:3",
      "executiveDecisionModelPlatform.ts",
      "Nexora.Engine.ExecutiveDecision.Model",
      8,
      "ModelPublicApi",
      "Compatible with ENG-7 model consumers.",
    ),
    surface(
      "ENG-7:4",
      "executiveDecisionValidationPlatform.ts",
      "Nexora.Engine.ExecutiveDecision.Validation",
      6,
      "ValidationPublicApi",
      "Compatible with ENG-7 validation consumers.",
    ),
  ] as const),
  summary: Object.freeze({
    approvedPublicSurfaces: 4,
    approvedPublicExports: 27,
    internalSurfaceExposure: 0,
    publicApiStable: true,
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
