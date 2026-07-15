export type {
  ExecutivePlanningValidationCategory,
  ExecutivePlanningValidationGroup,
  ExecutivePlanningValidationNamespace,
  ExecutivePlanningValidationOwner,
  ExecutivePlanningValidationPhase,
  ExecutivePlanningValidationPlatformMetadata,
  ExecutivePlanningValidationResult,
  ExecutivePlanningValidationRule,
  ExecutivePlanningValidationSeverity,
  ExecutivePlanningValidationStatus,
  ExecutivePlanningValidationSummary,
  ExecutivePlanningValidationTargetPhase,
  ExecutivePlanningValidationVersion,
} from "./executivePlanningValidationTypes.ts";

export { ExecutivePlanningFoundationValidation } from "./executivePlanningFoundationValidation.ts";
export { ExecutivePlanningModelValidation } from "./executivePlanningModelValidation.ts";
export { ExecutivePlanningOwnershipValidation } from "./executivePlanningOwnershipValidation.ts";
export { ExecutivePlanningPublicApiValidation } from "./executivePlanningPublicApiValidation.ts";
export { ExecutivePlanningRegistryValidation } from "./executivePlanningRegistryValidation.ts";

export {
  ExecutivePlanningValidationPlatform,
  getExecutivePlanningValidationMetadata,
  getExecutivePlanningValidationPlatform,
  getExecutivePlanningValidationRuleById,
  getExecutivePlanningValidationSummary,
} from "./executivePlanningValidationPlatform.ts";

export const ExecutivePlanningValidationPlatformId = "ENG-5:4" as const;
export const ExecutivePlanningValidationPlatformVersion = "1.0.0" as const;
export const ExecutivePlanningValidationPlatformName = "Executive Planning Validation Platform" as const;
export const ExecutivePlanningValidationPlatformNamespace =
  "nexora.engine.executive.planning.validation" as const;
export const ExecutivePlanningValidationPlatformDescription =
  "Canonical immutable metadata-only validation platform verifying ENG-5:1 Foundation, ENG-5:2 Registry, and ENG-5:3 Model architectural integrity." as const;
export const ExecutivePlanningValidationPlatformStatus = Object.freeze({
  validation: "Validation",
  passed: "Pass",
  metadataOnly: "MetadataOnly",
  runtimeFree: "RuntimeFree",
  immutable: "Immutable",
  deterministic: "Deterministic",
  readyForManifest: "ReadyForManifest",
} as const);
