export type {
  ExecutivePlanningCertificationCategory,
  ExecutivePlanningCertificationGate,
  ExecutivePlanningCertificationMetadata,
  ExecutivePlanningCertificationOwner,
  ExecutivePlanningCertificationPhase,
  ExecutivePlanningCertificationPlatformMetadata,
  ExecutivePlanningCertificationReadiness,
  ExecutivePlanningCertificationResult,
  ExecutivePlanningCertificationSeverity,
  ExecutivePlanningCertificationStatus,
  ExecutivePlanningCertificationSummaryDescriptor,
} from "./executivePlanningCertificationTypes.ts";
export type {
  ExecutivePlanningCertificationNamespace as ExecutivePlanningCertificationNamespaceType,
  ExecutivePlanningCertificationVersion as ExecutivePlanningCertificationVersionType,
} from "./executivePlanningCertificationTypes.ts";

export { ExecutivePlanningCertificationGates } from "./executivePlanningCertificationGates.ts";
export { ExecutivePlanningCertificationManifest } from "./executivePlanningCertificationManifest.ts";
export {
  ExecutivePlanningCertificationCategories,
  ExecutivePlanningCertificationRegistry,
  getExecutivePlanningCertificationGateById,
  getExecutivePlanningCertificationRegistry,
} from "./executivePlanningCertificationRegistry.ts";
export { ExecutivePlanningCertificationSummary } from "./executivePlanningCertificationSummary.ts";

export {
  ExecutivePlanningCertificationPlatform,
  getExecutivePlanningCertificationInventory,
  getExecutivePlanningCertificationMetadata,
  getExecutivePlanningCertificationPlatform,
  getExecutivePlanningCertificationSummary,
} from "./executivePlanningCertificationPlatform.ts";

export {
  getExecutivePlanningCertificationGateCount,
  getExecutivePlanningCertificationStatus,
  isExecutivePlanningCertified,
  isExecutivePlanningReadyForFreeze,
} from "./executivePlanningCertificationHelpers.ts";

export const ExecutivePlanningCertificationPlatformId = "ENG-5:7" as const;
export const ExecutivePlanningCertificationPlatformVersion = "1.0.0" as const;
export const ExecutivePlanningCertificationPlatformName =
  "Executive Planning Certification Platform" as const;
export const ExecutivePlanningCertificationPlatformNamespace =
  "nexora.engine.executive.planning.certification" as const;
export const ExecutivePlanningCertificationPlatformDescription =
  "Canonical immutable metadata-only certification platform verifying ENG-5:1 through ENG-5:6 architectural compliance for freeze readiness." as const;
export const ExecutivePlanningCertificationPlatformStatus = Object.freeze({
  certification: "Certification",
  certified: "Certified",
  metadataOnly: "MetadataOnly",
  runtimeFree: "RuntimeFree",
  immutable: "Immutable",
  deterministic: "Deterministic",
  readyForFreeze: "ReadyForFreeze",
} as const);
