export type {
  ExecutivePlanningFreezeCompatibilityEntry,
  ExecutivePlanningFreezeCompatibilityLevel,
  ExecutivePlanningFreezeMetadataDescriptor,
  ExecutivePlanningFreezeOwner,
  ExecutivePlanningFreezePhase,
  ExecutivePlanningFreezePlatformMetadata,
  ExecutivePlanningFreezeReadiness,
  ExecutivePlanningFreezeRegistryEntry,
  ExecutivePlanningFreezeStatus,
  ExecutivePlanningFreezeSummaryDescriptor,
} from "./executivePlanningFreezeTypes.ts";
export type {
  ExecutivePlanningFreezeNamespaceLiteral as ExecutivePlanningFreezeNamespaceType,
  ExecutivePlanningFreezeVersionLiteral as ExecutivePlanningFreezeVersionType,
} from "./executivePlanningFreezeTypes.ts";

export { ExecutivePlanningFreezeCompatibility } from "./executivePlanningFreezeCompatibility.ts";
export { ExecutivePlanningFreezeManifest } from "./executivePlanningFreezeManifest.ts";
export { ExecutivePlanningFreezeMetadata } from "./executivePlanningFreezeMetadata.ts";
export {
  ExecutivePlanningFreezePlatform,
  getExecutivePlanningFreezeSummary,
} from "./executivePlanningFreezePlatform.ts";
export {
  ExecutivePlanningFreezeRegistry,
  getExecutivePlanningFreezeEntryById,
  getExecutivePlanningFreezeRegistry,
} from "./executivePlanningFreezeRegistry.ts";

export {
  getExecutivePlanningFreezeMetadata,
  getExecutivePlanningFreezePlatform,
  isExecutivePlanningFrozen,
  isExecutivePlanningReadyForPublicIndex,
} from "./executivePlanningFreezeHelpers.ts";

export const ExecutivePlanningFreezePlatformId = "ENG-5:8" as const;
export const ExecutivePlanningFreezePlatformVersion = "1.0.0" as const;
export const ExecutivePlanningFreezePlatformName = "Executive Planning Freeze Platform" as const;
export const ExecutivePlanningFreezePlatformNamespace =
  "nexora.engine.executive.planning.freeze" as const;
export const ExecutivePlanningFreezePlatformDescription =
  "Canonical immutable metadata-only freeze platform locking ENG-5:1 through ENG-5:7 for public index publication." as const;
export const ExecutivePlanningFreezePlatformStatus = Object.freeze({
  freeze: "Freeze",
  certified: "Certified",
  frozen: "Frozen",
  readyForPublicIndex: "ReadyForPublicIndex",
  metadataOnly: "MetadataOnly",
  runtimeFree: "RuntimeFree",
  immutable: "Immutable",
  deterministic: "Deterministic",
  lockIdentifier: "ENG-5-LOCKED",
} as const);
