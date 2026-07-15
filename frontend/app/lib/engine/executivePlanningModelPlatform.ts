import {
  ExecutivePlanningFoundation,
  ExecutivePlanningOwnership,
} from "./executivePlanningIndex.ts";
import {
  ExecutivePlanningRegistryPlatformId,
} from "./executivePlanningRegistryIndex.ts";
import {
  ExecutivePlanningDependencyModels,
  getExecutivePlanningDependencyModel,
} from "./executivePlanningDependencyModels.ts";
import {
  ExecutivePlanningGraphModels,
  getExecutivePlanningGraphModel,
} from "./executivePlanningGraphModels.ts";
import type {
  ExecutivePlanningModelDescriptor,
  ExecutivePlanningModelPlatformMetadata,
} from "./executivePlanningModelTypes.ts";
import {
  ExecutivePlanningOutcomeModels,
  getExecutivePlanningOutcomeModel,
} from "./executivePlanningOutcomeModels.ts";
import {
  ExecutivePlanModels,
  getExecutivePlanModel,
} from "./executivePlanModels.ts";
import {
  ExecutivePlanningStepModels,
  getExecutivePlanningStepModel,
} from "./executivePlanningStepModels.ts";

const metadata = Object.freeze({
  platformId: "ENG-5:3",
  name: "Executive Planning Model Platform",
  version: "1.0.0",
  namespace: "nexora.engine.executive.planning.model",
  description:
    "Canonical immutable metadata-only model platform defining executive planning domain structures for later ENG-5 phases.",
  status: Object.freeze({
    model: "Model",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    immutable: "Immutable",
    deterministic: "Deterministic",
  } as const),
  dependencyOnFoundation: "executivePlanningIndex.ts",
  dependencyOnRegistry: "executivePlanningRegistryIndex.ts",
  foundationReference: ExecutivePlanningFoundation.platformId,
  registryReference: ExecutivePlanningRegistryPlatformId,
  ownership: "ENG-5",
  ownershipBoundary: ExecutivePlanningOwnership.boundary,
  metadataOnly: true,
  runtimeFree: true,
  deterministic: true,
  readinessForValidation: "ReadyForValidation",
  nextPhase: "ENG-5:4",
  planModelCount: 8,
  stepModelCount: 10,
  graphModelCount: 6,
  dependencyModelCount: 6,
  outcomeModelCount: 8,
  totalModelCount: 38,
} as const satisfies ExecutivePlanningModelPlatformMetadata & {
  readonly foundationReference: string;
  readonly registryReference: "ENG-5:2";
  readonly ownershipBoundary: typeof ExecutivePlanningOwnership.boundary;
});

export const ExecutivePlanningModelPlatform = Object.freeze({
  metadata,
  plans: ExecutivePlanModels,
  steps: ExecutivePlanningStepModels,
  graphs: ExecutivePlanningGraphModels,
  dependencies: ExecutivePlanningDependencyModels,
  outcomes: ExecutivePlanningOutcomeModels,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

const inventory = Object.freeze({
  planModelCount: ExecutivePlanModels.length,
  stepModelCount: ExecutivePlanningStepModels.length,
  graphModelCount: ExecutivePlanningGraphModels.length,
  dependencyModelCount: ExecutivePlanningDependencyModels.length,
  outcomeModelCount: ExecutivePlanningOutcomeModels.length,
  totalModelCount:
    ExecutivePlanModels.length
    + ExecutivePlanningStepModels.length
    + ExecutivePlanningGraphModels.length
    + ExecutivePlanningDependencyModels.length
    + ExecutivePlanningOutcomeModels.length,
  ownership: "ENG-5",
  executionOwner: "OPS",
  nextPhase: "ENG-5:4",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const lookupResolvers = Object.freeze([
  getExecutivePlanModel,
  getExecutivePlanningStepModel,
  getExecutivePlanningGraphModel,
  getExecutivePlanningDependencyModel,
  getExecutivePlanningOutcomeModel,
] as const);

export const getExecutivePlanningModelPlatform = () => ExecutivePlanningModelPlatform;
export const getExecutivePlanningModelMetadata = () => metadata;
export const getExecutivePlanningModelInventory = () => inventory;

export const getExecutivePlanningModelById = (
  id: string,
): ExecutivePlanningModelDescriptor | undefined => {
  for (const resolve of lookupResolvers) {
    const model = resolve(id);
    if (model) return model;
  }
  return undefined;
};
