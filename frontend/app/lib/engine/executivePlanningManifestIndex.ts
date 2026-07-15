export type {
  ExecutivePlanningManifestCompatibilityEntry,
  ExecutivePlanningManifestCompatibilityLevel,
  ExecutivePlanningManifestComponentSection,
  ExecutivePlanningManifestDependencyDirection,
  ExecutivePlanningManifestDependencyEntry,
  ExecutivePlanningManifestMetadata,
  ExecutivePlanningManifestNamespace,
  ExecutivePlanningManifestOwner,
  ExecutivePlanningManifestOwnershipSection,
  ExecutivePlanningManifestPhase,
  ExecutivePlanningManifestReadinessState,
  ExecutivePlanningManifestReleaseInventory,
  ExecutivePlanningManifestReleaseState,
  ExecutivePlanningManifestReleaseStateEntry,
  ExecutivePlanningManifestSectionName,
  ExecutivePlanningManifestSummary,
  ExecutivePlanningManifestVersion,
} from "./executivePlanningManifestTypes.ts";

export { ExecutivePlanningCompatibilityManifest } from "./executivePlanningCompatibilityManifest.ts";
export { ExecutivePlanningComponentManifest } from "./executivePlanningComponentManifest.ts";
export { ExecutivePlanningDependencyManifest } from "./executivePlanningDependencyManifest.ts";
export { ExecutivePlanningOwnershipManifest } from "./executivePlanningOwnershipManifest.ts";
export { ExecutivePlanningReleaseManifest } from "./executivePlanningReleaseManifest.ts";

export {
  ExecutivePlanningManifestPlatform,
  getExecutivePlanningManifestComponentById,
  getExecutivePlanningManifestInventory,
  getExecutivePlanningManifestMetadata,
  getExecutivePlanningManifestPlatform,
  getExecutivePlanningManifestSummary,
} from "./executivePlanningManifestPlatform.ts";

export const ExecutivePlanningManifestPlatformId = "ENG-5:5" as const;
export const ExecutivePlanningManifestPlatformVersion = "1.0.0" as const;
export const ExecutivePlanningManifestPlatformName = "Executive Planning Manifest Platform" as const;
export const ExecutivePlanningManifestPlatformNamespace =
  "nexora.engine.executive.planning.manifest" as const;
export const ExecutivePlanningManifestPlatformDescription =
  "Canonical immutable metadata-only manifest consolidating ENG-5:1 Foundation, ENG-5:2 Registry, ENG-5:3 Model, and ENG-5:4 Validation." as const;
export const ExecutivePlanningManifestPlatformStatus = Object.freeze({
  manifest: "Manifest",
  metadataOnly: "MetadataOnly",
  runtimeFree: "RuntimeFree",
  immutable: "Immutable",
  deterministic: "Deterministic",
  readyForPlatform: "ReadyForPlatform",
} as const);
