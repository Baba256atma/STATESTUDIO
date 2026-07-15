import { ExecutiveReasoningModelMetadata } from "./executiveReasoningModelMetadata.ts";
import { ExecutiveReasoningModelPlatform } from "./executiveReasoningModelPlatform.ts";
import { ExecutiveReasoningModelRegistry } from "./executiveReasoningModelRegistry.ts";
import { ExecutiveReasoningModels } from "./executiveReasoningModels.ts";
import { ExecutiveReasoningRelationshipModel } from "./executiveReasoningRelationshipModel.ts";

export const ExecutiveReasoningModelSummary = Object.freeze({
  modelPlatformId: ExecutiveReasoningModelMetadata.modelPlatformId,
  phase: "ENG-6:3",
  namespace: ExecutiveReasoningModelMetadata.namespace,
  owner: "ENG-6",
  modelCount: ExecutiveReasoningModels.length,
  registryEntryCount: ExecutiveReasoningModelRegistry.entries.length,
  relationshipEdgeCount: ExecutiveReasoningRelationshipModel.edges.length,
  relationshipFlowCount: ExecutiveReasoningRelationshipModel.flow.length,
  nextPhase: "ENG-6:4",
  validationReady: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const getExecutiveReasoningModelMetadata = () => ExecutiveReasoningModelMetadata;
export const getExecutiveReasoningModelSummary = () => ExecutiveReasoningModelSummary;
export const getExecutiveReasoningModelPlatform = () => ExecutiveReasoningModelPlatform;
