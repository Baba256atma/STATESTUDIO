export type {
  ExecutivePlanModelDescriptor,
  ExecutivePlanningDependencyModelDescriptor,
  ExecutivePlanningGraphModelDescriptor,
  ExecutivePlanningModelBase,
  ExecutivePlanningModelCategory,
  ExecutivePlanningModelDescriptor,
  ExecutivePlanningModelId,
  ExecutivePlanningModelLifecycleStage,
  ExecutivePlanningModelNamespace,
  ExecutivePlanningModelOwner,
  ExecutivePlanningModelPhase,
  ExecutivePlanningModelPlatformMetadata,
  ExecutivePlanningModelStatus,
  ExecutivePlanningModelVersion,
  ExecutivePlanningModelVisibility,
  ExecutivePlanningOutcomeModelDescriptor,
  ExecutivePlanningStepModelDescriptor,
} from "./executivePlanningModelTypes.ts";

export {
  ExecutivePlanningDependencyModels,
  getExecutivePlanningDependencyModel,
  getExecutivePlanningDependencyModels,
} from "./executivePlanningDependencyModels.ts";

export {
  ExecutivePlanningGraphModels,
  getExecutivePlanningGraphModel,
  getExecutivePlanningGraphModels,
} from "./executivePlanningGraphModels.ts";

export {
  ExecutivePlanningModelPlatform,
  getExecutivePlanningModelById,
  getExecutivePlanningModelInventory,
  getExecutivePlanningModelMetadata,
  getExecutivePlanningModelPlatform,
} from "./executivePlanningModelPlatform.ts";

export {
  ExecutivePlanningOutcomeModels,
  getExecutivePlanningOutcomeModel,
  getExecutivePlanningOutcomeModels,
} from "./executivePlanningOutcomeModels.ts";

export {
  ExecutivePlanModels,
  getExecutivePlanModel,
  getExecutivePlanModels,
} from "./executivePlanModels.ts";

export {
  ExecutivePlanningStepModels,
  getExecutivePlanningStepModel,
  getExecutivePlanningStepModels,
} from "./executivePlanningStepModels.ts";

export const ExecutivePlanningModelPlatformId = "ENG-5:3" as const;
export const ExecutivePlanningModelPlatformVersion = "1.0.0" as const;
export const ExecutivePlanningModelPlatformName = "Executive Planning Model Platform" as const;
export const ExecutivePlanningModelPlatformNamespace =
  "nexora.engine.executive.planning.model" as const;
export const ExecutivePlanningModelPlatformDescription =
  "Canonical immutable metadata-only model platform defining executive planning domain structures for later ENG-5 phases." as const;
export const ExecutivePlanningModelPlatformStatus = Object.freeze({
  model: "Model",
  metadataOnly: "MetadataOnly",
  runtimeFree: "RuntimeFree",
  immutable: "Immutable",
  deterministic: "Deterministic",
  readyForValidation: "ReadyForValidation",
} as const);
