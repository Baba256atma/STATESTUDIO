export * from "./resourceIntelligenceIndex.ts";
export * from "./resourceMetadataIndex.ts";
export * from "./resourceModelIndex.ts";
export * from "./resourceValidationIndex.ts";
export * from "./resourcePlatformManifestIndex.ts";

export {
  ExecutiveResourceIntelligencePlatform,
} from "./resourcePlatformNamespace.ts";

export {
  ExecutiveResourceIntelligencePlatformPublicRegistry,
} from "./resourcePlatformPublicRegistry.ts";

export {
  ExecutiveResourceIntelligencePlatformReleaseSummary,
} from "./resourcePlatformReleaseSummary.ts";

export {
  validateResourcePlatformIndex,
} from "./resourcePlatformIndexValidation.ts";

export type {
  ResourcePlatformIndexRegistryEntry,
  ResourcePlatformIndexValidationEntry,
  ResourcePlatformReleaseSummaryDescriptor,
} from "./resourcePlatformIndexTypes.ts";
