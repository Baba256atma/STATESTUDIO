import type { ExecutiveBrainPlatform } from "./executiveBrainTypes.ts";

export const EXECUTIVE_BRAIN_PLATFORM_ID = "nexora-executive-brain-platform" as const;
export const EXECUTIVE_BRAIN_PLATFORM_NAME = "Nexora Executive Brain Platform" as const;
export const EXECUTIVE_BRAIN_VERSION = "LAY-1" as const;
export const EXECUTIVE_BRAIN_RELEASE_STAGE = "foundation" as const;
export const EXECUTIVE_BRAIN_LAYER_IDENTITY = "LAY" as const;
export const EXECUTIVE_BRAIN_ARCHITECTURAL_ROLE =
  "Metadata-only foundation for future executive cognition capabilities." as const;
export const EXECUTIVE_BRAIN_DESCRIPTION =
  "Canonical architecture, contracts, registries, configuration, validation, and public APIs for the Nexora Executive Brain." as const;

export const EXECUTIVE_BRAIN_PLATFORM: ExecutiveBrainPlatform = Object.freeze({
  platformId: EXECUTIVE_BRAIN_PLATFORM_ID,
  platformName: EXECUTIVE_BRAIN_PLATFORM_NAME,
  version: EXECUTIVE_BRAIN_VERSION,
  releaseStage: EXECUTIVE_BRAIN_RELEASE_STAGE,
  description: EXECUTIVE_BRAIN_DESCRIPTION,
  layerIdentity: EXECUTIVE_BRAIN_LAYER_IDENTITY,
  architecturalRole: EXECUTIVE_BRAIN_ARCHITECTURAL_ROLE,
});
