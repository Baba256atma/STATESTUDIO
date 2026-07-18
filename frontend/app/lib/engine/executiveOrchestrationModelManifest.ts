import {
  ExecutiveAdvisorHandoffModel,
  ExecutiveCoordinationRouteModel,
  ExecutiveDependencyChainModel,
  ExecutiveExecutionGroupModel,
  ExecutiveExecutionStageModel,
  ExecutiveOrchestrationModelPlatform,
  ExecutiveOrchestrationPlanModel,
  ExecutiveOrchestrationRequestModel,
  getExecutiveOrchestrationModelPlatform,
} from "./executiveOrchestrationModelPlatform.ts";

/**
 * Immutable model inventory for ENG-8:5.
 * References ENG-8:3 only through its public API.
 */
export const ExecutiveOrchestrationModelManifest = Object.freeze({
  id: "eng-8-manifest-model",
  section: "Model",
  name: "Executive Orchestration Model Manifest",
  description:
    "Immutable inventory summarizing ENG-8:3 canonical orchestration models.",
  modelPlatform: getExecutiveOrchestrationModelPlatform(),
  modelPlatformId: ExecutiveOrchestrationModelPlatform.metadata.id,
  inventory: Object.freeze({
    request: ExecutiveOrchestrationRequestModel.id,
    plan: ExecutiveOrchestrationPlanModel.id,
    executionStage: ExecutiveExecutionStageModel.id,
    coordinationRoute: ExecutiveCoordinationRouteModel.id,
    dependencyChain: ExecutiveDependencyChainModel.id,
    executionGroup: ExecutiveExecutionGroupModel.id,
    advisorHandoff: ExecutiveAdvisorHandoffModel.id,
    modelCount: ExecutiveOrchestrationModelPlatform.modelRegistry.entries.length,
  } as const),
  kinds: ExecutiveOrchestrationModelPlatform.modelRegistry.kinds,
  relationshipChain: ExecutiveOrchestrationModelPlatform.relationshipChain,
  supportedExecutionModes: ExecutiveExecutionGroupModel.supportedExecutionModes,
  status: "Complete",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  deeplyFrozen: true,
} as const);
