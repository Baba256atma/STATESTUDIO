import {
  ExecutivePlanningCapabilityRegistry,
  ExecutivePlanningContracts,
  ExecutivePlanningFoundation,
  ExecutivePlanningLifecycle,
  ExecutivePlanningMetadata,
  ExecutivePlanningOwnership,
} from "./executivePlanningIndex.ts";
import {
  ExecutivePlanningModelPlatformId,
  ExecutivePlanModels,
  ExecutivePlanningDependencyModels,
  ExecutivePlanningGraphModels,
  ExecutivePlanningOutcomeModels,
  ExecutivePlanningStepModels,
} from "./executivePlanningModelIndex.ts";
import {
  ExecutivePlanTypeRegistry,
  ExecutivePlanningDependencyRegistry,
  ExecutivePlanningGraphEdgeRegistry,
  ExecutivePlanningGraphNodeRegistry,
  ExecutivePlanningParallelModeRegistry,
  ExecutivePlanningPriorityRegistry,
  ExecutivePlanningRegistryPlatformId,
  ExecutivePlanningRetryStrategyRegistry,
  ExecutivePlanningStepRegistry,
} from "./executivePlanningRegistryIndex.ts";
import {
  ExecutivePlanningFoundationValidation,
  ExecutivePlanningModelValidation,
  ExecutivePlanningOwnershipValidation,
  ExecutivePlanningPublicApiValidation,
  ExecutivePlanningRegistryValidation,
  ExecutivePlanningValidationPlatformId,
} from "./executivePlanningValidationIndex.ts";
import type { ExecutivePlanningManifestComponentSection } from "./executivePlanningManifestTypes.ts";

const lifecycleCompatibility = Object.freeze(
  ExecutivePlanningLifecycle.map(({ name }) => name),
);

export const ExecutivePlanningComponentManifest = Object.freeze([
  Object.freeze({
    id: "eng-5-manifest-component-foundation",
    section: "Foundation",
    phase: "ENG-5:1",
    description: "Executive Planning Foundation establishing contracts, capabilities, lifecycle, ownership, and metadata.",
    publicIndex: "executivePlanningIndex.ts",
    exportedApis: Object.freeze([
      "ExecutivePlanningFoundation",
      "ExecutivePlanningContracts",
      "ExecutivePlanningCapabilityRegistry",
      "ExecutivePlanningLifecycle",
      "ExecutivePlanningOwnership",
      "ExecutivePlanningMetadata",
    ]),
    owner: "ENG-5",
    lifecycleCompatibility,
    metadataOnly: true,
    runtimeFree: true,
    public: true,
    inventory: Object.freeze({
      platformId: ExecutivePlanningFoundation.platformId,
      contractCount: ExecutivePlanningContracts.length,
      capabilityCount: ExecutivePlanningCapabilityRegistry.length,
      lifecycleStageCount: ExecutivePlanningLifecycle.length,
      ownershipOwner: ExecutivePlanningOwnership.owner,
      metadataNextPhase: ExecutivePlanningMetadata.nextPhase,
    }),
  } as const satisfies ExecutivePlanningManifestComponentSection & {
    readonly inventory: object;
  }),
  Object.freeze({
    id: "eng-5-manifest-component-registry",
    section: "Registry",
    phase: "ENG-5:2",
    description: "Executive Planning Registry Platform classifying plan, step, dependency, graph, and policy vocabulary.",
    publicIndex: "executivePlanningRegistryIndex.ts",
    exportedApis: Object.freeze([
      "ExecutivePlanTypeRegistry",
      "ExecutivePlanningStepRegistry",
      "ExecutivePlanningDependencyRegistry",
      "ExecutivePlanningGraphNodeRegistry",
      "ExecutivePlanningGraphEdgeRegistry",
      "ExecutivePlanningPriorityRegistry",
      "ExecutivePlanningParallelModeRegistry",
      "ExecutivePlanningRetryStrategyRegistry",
      "ExecutivePlanningRegistryPlatform",
    ]),
    owner: "ENG-5",
    lifecycleCompatibility,
    metadataOnly: true,
    runtimeFree: true,
    public: true,
    inventory: Object.freeze({
      platformId: ExecutivePlanningRegistryPlatformId,
      planTypeCount: ExecutivePlanTypeRegistry.length,
      stepTypeCount: ExecutivePlanningStepRegistry.length,
      dependencyTypeCount: ExecutivePlanningDependencyRegistry.length,
      graphNodeCount: ExecutivePlanningGraphNodeRegistry.length,
      graphEdgeCount: ExecutivePlanningGraphEdgeRegistry.length,
      priorityCount: ExecutivePlanningPriorityRegistry.length,
      parallelModeCount: ExecutivePlanningParallelModeRegistry.length,
      retryStrategyCount: ExecutivePlanningRetryStrategyRegistry.length,
    }),
  } as const satisfies ExecutivePlanningManifestComponentSection & {
    readonly inventory: object;
  }),
  Object.freeze({
    id: "eng-5-manifest-component-model",
    section: "Model",
    phase: "ENG-5:3",
    description: "Executive Planning Model Platform defining plan, step, graph, dependency, and outcome models.",
    publicIndex: "executivePlanningModelIndex.ts",
    exportedApis: Object.freeze([
      "ExecutivePlanModels",
      "ExecutivePlanningStepModels",
      "ExecutivePlanningGraphModels",
      "ExecutivePlanningDependencyModels",
      "ExecutivePlanningOutcomeModels",
      "ExecutivePlanningModelPlatform",
    ]),
    owner: "ENG-5",
    lifecycleCompatibility,
    metadataOnly: true,
    runtimeFree: true,
    public: true,
    inventory: Object.freeze({
      platformId: ExecutivePlanningModelPlatformId,
      planModelCount: ExecutivePlanModels.length,
      stepModelCount: ExecutivePlanningStepModels.length,
      graphModelCount: ExecutivePlanningGraphModels.length,
      dependencyModelCount: ExecutivePlanningDependencyModels.length,
      outcomeModelCount: ExecutivePlanningOutcomeModels.length,
    }),
  } as const satisfies ExecutivePlanningManifestComponentSection & {
    readonly inventory: object;
  }),
  Object.freeze({
    id: "eng-5-manifest-component-validation",
    section: "Validation",
    phase: "ENG-5:4",
    description: "Executive Planning Validation Platform verifying architectural integrity of ENG-5:1 through ENG-5:3.",
    publicIndex: "executivePlanningValidationIndex.ts",
    exportedApis: Object.freeze([
      "ExecutivePlanningFoundationValidation",
      "ExecutivePlanningRegistryValidation",
      "ExecutivePlanningModelValidation",
      "ExecutivePlanningOwnershipValidation",
      "ExecutivePlanningPublicApiValidation",
      "ExecutivePlanningValidationPlatform",
    ]),
    owner: "ENG-5",
    lifecycleCompatibility,
    metadataOnly: true,
    runtimeFree: true,
    public: true,
    inventory: Object.freeze({
      platformId: ExecutivePlanningValidationPlatformId,
      foundationRuleCount: ExecutivePlanningFoundationValidation.rules.length,
      registryRuleCount: ExecutivePlanningRegistryValidation.rules.length,
      modelRuleCount: ExecutivePlanningModelValidation.rules.length,
      ownershipRuleCount: ExecutivePlanningOwnershipValidation.rules.length,
      publicApiRuleCount: ExecutivePlanningPublicApiValidation.rules.length,
    }),
  } as const satisfies ExecutivePlanningManifestComponentSection & {
    readonly inventory: object;
  }),
] as const);
