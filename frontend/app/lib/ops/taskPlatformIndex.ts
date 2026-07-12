export * from "./taskIntelligenceIndex.ts";
export * from "./taskMetadataIndex.ts";
export * from "./taskModelIndex.ts";
export * from "./taskValidationIndex.ts";
export * from "./taskPlatformManifestIndex.ts";

export {
  ExecutiveTaskIntelligencePlatform,
} from "./taskPlatformNamespace.ts";

export {
  ExecutiveTaskIntelligencePlatformPublicRegistry,
} from "./taskPlatformPublicRegistry.ts";

export {
  ExecutiveTaskIntelligencePlatformReleaseSummary,
} from "./taskPlatformReleaseSummary.ts";

export {
  validateTaskPlatformIndex,
} from "./taskPlatformIndexValidation.ts";

export type {
  TaskPlatformIndexRegistryEntry,
  TaskPlatformIndexValidationEntry,
  TaskPlatformReleaseSummaryDescriptor,
} from "./taskPlatformIndexTypes.ts";
