import { WorkflowPublicApiRegistry } from "./workflowMetadataIndex.ts";
import {
  ExecutiveWorkflowIntelligenceFoundation,
  WorkflowIntelligencePublicApis,
  WorkflowIntelligenceIdentity,
} from "./workflowIntelligenceIndex.ts";
import {
  WorkflowApprovalModel,
  WorkflowDependencyModel,
  WorkflowIdentityModel,
  WorkflowReadinessModel,
  WorkflowStageModel,
  WorkflowTaskLinkModel,
  WorkflowTransitionModel,
  WorkflowTriggerModel,
} from "./workflowModelIndex.ts";
import type { WorkflowValidationEntry } from "./workflowValidationTypes.ts";

const objectModels = Object.freeze([
  WorkflowIdentityModel,
  WorkflowDependencyModel,
  WorkflowApprovalModel,
]);

const arrayModels = Object.freeze([
  WorkflowStageModel,
  WorkflowTransitionModel,
  WorkflowTriggerModel,
  WorkflowReadinessModel,
  WorkflowTaskLinkModel,
]);

export const WorkflowPublicApiValidation = Object.freeze([
  Object.freeze({
    id: "workflow-public-api-stability",
    name: "Public API Stability",
    description: "Validates stable public API exposure across OPS-3 phases.",
    category: "PublicApi",
    status:
      WorkflowIntelligencePublicApis.length === 3 &&
      WorkflowPublicApiRegistry.length >= 9
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-public-api-consumer-only",
    name: "Public API Consumer Only",
    description: "Validates public API remains consumer-facing and metadata-only.",
    category: "PublicApi",
    status:
      objectModels.every((model) => model.metadata.metadataOnly) &&
      arrayModels.every(
        (model) => Object.isFrozen(model) && model.every((entry) => entry.metadata.metadataOnly),
      ) &&
      WorkflowIntelligenceIdentity.metadataOnly &&
      ExecutiveWorkflowIntelligenceFoundation.metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-public-api-immutability",
    name: "Public API Immutability",
    description: "Validates immutable public API registry and exported models.",
    category: "Immutability",
    status:
      Object.isFrozen(WorkflowPublicApiRegistry) &&
      Object.isFrozen(WorkflowIdentityModel) &&
      Object.isFrozen(WorkflowStageModel) &&
      Object.isFrozen(WorkflowTransitionModel) &&
      Object.isFrozen(WorkflowDependencyModel) &&
      Object.isFrozen(WorkflowTriggerModel) &&
      Object.isFrozen(WorkflowApprovalModel) &&
      Object.isFrozen(WorkflowReadinessModel) &&
      Object.isFrozen(WorkflowTaskLinkModel)
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
] as const);
