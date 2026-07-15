import {
  ExecutivePlanningFoundation,
  ExecutivePlanningOwnership,
} from "./executivePlanningIndex.ts";
import {
  ExecutivePlanningDependencyRegistry,
  getExecutivePlanningDependencyById,
} from "./executivePlanningDependencyRegistry.ts";
import {
  ExecutivePlanningGraphEdgeRegistry,
  ExecutivePlanningGraphNodeRegistry,
  getExecutivePlanningGraphEdgeById,
  getExecutivePlanningGraphNodeById,
} from "./executivePlanningGraphRegistry.ts";
import {
  ExecutivePlanTypeRegistry,
  getExecutivePlanTypeById,
} from "./executivePlanTypeRegistry.ts";
import {
  ExecutivePlanningParallelModeRegistry,
  ExecutivePlanningPriorityRegistry,
  ExecutivePlanningRetryStrategyRegistry,
  getExecutivePlanningParallelModeById,
  getExecutivePlanningPriorityById,
  getExecutivePlanningRetryStrategyById,
} from "./executivePlanningPolicyRegistry.ts";
import type {
  ExecutivePlanningRegistryLookupEntry,
  ExecutivePlanningRegistryPlatformMetadata,
} from "./executivePlanningRegistryTypes.ts";
import {
  ExecutivePlanningStepRegistry,
  getExecutivePlanningStepById,
} from "./executivePlanningStepRegistry.ts";

const metadata = Object.freeze({
  platformId: "ENG-5:2",
  name: "Executive Planning Registry Platform",
  version: "1.0.0",
  namespace: "nexora.engine.executive.planning.registry",
  description:
    "Canonical immutable metadata-only registry platform classifying executive planning vocabulary for later ENG-5 phases.",
  status: Object.freeze({
    registry: "Registry",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    immutable: "Immutable",
    deterministic: "Deterministic",
  } as const),
  dependencyOnEng51: "executivePlanningIndex.ts",
  ownership: "ENG-5",
  foundationReference: ExecutivePlanningFoundation.platformId,
  ownershipBoundary: ExecutivePlanningOwnership.boundary,
  metadataOnly: true,
  runtimeFree: true,
  deterministic: true,
  readinessForModel: "ReadyForModel",
  nextPhase: "ENG-5:3",
  planTypeCount: 8,
  stepTypeCount: 10,
  dependencyTypeCount: 9,
  graphNodeCount: 6,
  graphEdgeCount: 7,
  priorityCount: 5,
  parallelModeCount: 5,
  retryStrategyCount: 6,
  totalRegistryEntryCount: 56,
} as const satisfies ExecutivePlanningRegistryPlatformMetadata & {
  readonly foundationReference: string;
  readonly ownershipBoundary: typeof ExecutivePlanningOwnership.boundary;
});

export const ExecutivePlanningRegistryPlatform = Object.freeze({
  metadata,
  planTypes: ExecutivePlanTypeRegistry,
  stepTypes: ExecutivePlanningStepRegistry,
  dependencyTypes: ExecutivePlanningDependencyRegistry,
  graphNodes: ExecutivePlanningGraphNodeRegistry,
  graphEdges: ExecutivePlanningGraphEdgeRegistry,
  priorities: ExecutivePlanningPriorityRegistry,
  parallelModes: ExecutivePlanningParallelModeRegistry,
  retryStrategies: ExecutivePlanningRetryStrategyRegistry,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

const inventory = Object.freeze({
  planTypeCount: ExecutivePlanTypeRegistry.length,
  stepTypeCount: ExecutivePlanningStepRegistry.length,
  dependencyTypeCount: ExecutivePlanningDependencyRegistry.length,
  graphNodeCount: ExecutivePlanningGraphNodeRegistry.length,
  graphEdgeCount: ExecutivePlanningGraphEdgeRegistry.length,
  priorityCount: ExecutivePlanningPriorityRegistry.length,
  parallelModeCount: ExecutivePlanningParallelModeRegistry.length,
  retryStrategyCount: ExecutivePlanningRetryStrategyRegistry.length,
  totalRegistryEntryCount:
    ExecutivePlanTypeRegistry.length
    + ExecutivePlanningStepRegistry.length
    + ExecutivePlanningDependencyRegistry.length
    + ExecutivePlanningGraphNodeRegistry.length
    + ExecutivePlanningGraphEdgeRegistry.length
    + ExecutivePlanningPriorityRegistry.length
    + ExecutivePlanningParallelModeRegistry.length
    + ExecutivePlanningRetryStrategyRegistry.length,
  ownership: "ENG-5",
  executionOwner: "OPS",
  nextPhase: "ENG-5:3",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const lookupResolvers = Object.freeze([
  getExecutivePlanTypeById,
  getExecutivePlanningStepById,
  getExecutivePlanningDependencyById,
  getExecutivePlanningGraphNodeById,
  getExecutivePlanningGraphEdgeById,
  getExecutivePlanningPriorityById,
  getExecutivePlanningParallelModeById,
  getExecutivePlanningRetryStrategyById,
] as const);

export const getExecutivePlanningRegistryPlatform = () => ExecutivePlanningRegistryPlatform;
export const getExecutivePlanningRegistryPlatformMetadata = () => metadata;
export const getExecutivePlanningRegistryInventory = () => inventory;

export const getExecutivePlanningRegistryEntryById = (
  id: string,
): ExecutivePlanningRegistryLookupEntry | undefined => {
  for (const resolve of lookupResolvers) {
    const entry = resolve(id);
    if (entry) return entry;
  }
  return undefined;
};
