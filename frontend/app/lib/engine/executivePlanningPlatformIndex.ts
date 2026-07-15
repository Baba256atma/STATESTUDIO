export type {
  ExecutivePlanningPlatformInventory,
  ExecutivePlanningPlatformMetadataDescriptor,
  ExecutivePlanningPlatformOwner,
  ExecutivePlanningPlatformPhase,
  ExecutivePlanningPlatformReadiness,
  ExecutivePlanningPlatformSectionEntry,
  ExecutivePlanningPlatformSectionName,
  ExecutivePlanningPlatformStatusLabel,
  ExecutivePlanningPlatformSummaryDescriptor,
} from "./executivePlanningPlatformTypes.ts";
export type {
  ExecutivePlanningPlatformNamespace as ExecutivePlanningPlatformNamespaceType,
  ExecutivePlanningPlatformVersion as ExecutivePlanningPlatformVersionType,
} from "./executivePlanningPlatformTypes.ts";

export { ExecutivePlanningPlatform } from "./executivePlanningPlatform.ts";
export { ExecutivePlanningPlatformMetadata } from "./executivePlanningPlatformMetadata.ts";
export { ExecutivePlanningPlatformRegistry } from "./executivePlanningPlatformRegistry.ts";
export { ExecutivePlanningPlatformSummary } from "./executivePlanningPlatformSummary.ts";

export {
  getExecutivePlanningPlatform,
  getExecutivePlanningPlatformInventory,
  getExecutivePlanningPlatformMetadata,
  getExecutivePlanningPlatformRegistry,
  getExecutivePlanningPlatformSummary,
} from "./executivePlanningPlatformHelpers.ts";

export const ExecutivePlanningPlatformId = "ENG-5:6" as const;
export const ExecutivePlanningPlatformVersion = "1.0.0" as const;
export const ExecutivePlanningPlatformName = "Executive Planning Platform" as const;
export const ExecutivePlanningPlatformNamespace =
  "nexora.engine.executive.planning.platform" as const;
export const ExecutivePlanningPlatformDescription =
  "Canonical immutable metadata-only aggregate platform for the complete ENG-5:1 through ENG-5:5 Executive Planning architecture." as const;
export const ExecutivePlanningPlatformStatus = Object.freeze({
  platform: "Platform",
  metadataOnly: "MetadataOnly",
  runtimeFree: "RuntimeFree",
  immutable: "Immutable",
  deterministic: "Deterministic",
  readyForCertification: "ReadyForCertification",
} as const);
