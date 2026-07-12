import type { ExecutiveRequestIntentPlatformMetadata as PlatformMetadata } from "./executiveRequestIntentPlatformTypes.ts";

export const ExecutiveRequestIntentPlatformMetadata = Object.freeze({
  platformId: "ENG-2:6", platformName: "Executive Request & Intent Platform", version: "1.0.0",
  namespace: "nexora.engine.executive.request-intent.platform", owner: "ENG-2",
  description: "Canonical metadata-only platform aggregation for the Executive Request & Intent architectural layers.",
  architecturalLayer: "ExecutiveEnginePlatform", stability: "PlatformFoundation", releaseStatus: "Draft",
  ownershipPolicy: Object.freeze({
    eng1OwnershipPreserved: true, eng2OwnershipPreserved: true,
    collisionSafeSymbols: true, antiDuplicationEnforced: true,
    dependencyPolicy: "PublicIndicesOnly",
  }),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies PlatformMetadata);
