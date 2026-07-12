import { ExecutiveWorkflowIntelligenceFoundation } from "./workflowIntelligenceIndex.ts";
import { WorkflowPlatformMetadata } from "./workflowMetadataIndex.ts";
import { WorkflowApprovalModel } from "./workflowApprovalModel.ts";
import { WorkflowDependencyModel } from "./workflowDependencyModel.ts";
import {
  WorkflowIdentityModel,
} from "./workflowIdentityModel.ts";
import {
  WorkflowReadinessModel,
  WorkflowTaskLinkModel,
} from "./workflowReadinessModel.ts";
import { WorkflowStageModel } from "./workflowStageModel.ts";
import { WorkflowTransitionModel } from "./workflowTransitionModel.ts";
import { WorkflowTriggerModel } from "./workflowTriggerModel.ts";

export const buildWorkflowModelManifest = () =>
  Object.freeze({
    foundation: ExecutiveWorkflowIntelligenceFoundation,
    metadata: WorkflowPlatformMetadata,
    models: Object.freeze({
      identity: WorkflowIdentityModel,
      stage: WorkflowStageModel,
      transition: WorkflowTransitionModel,
      dependency: WorkflowDependencyModel,
      trigger: WorkflowTriggerModel,
      approval: WorkflowApprovalModel,
      readiness: WorkflowReadinessModel,
      taskLink: WorkflowTaskLinkModel,
    }),
    compatibility: Object.freeze({
      compatibilityVersion: WorkflowPlatformMetadata.compatibilityVersion,
      supportedDomainCount: WorkflowPlatformMetadata.supportedWorkflowDomains.length,
      stageCount: WorkflowStageModel.length,
      transitionCount: WorkflowTransitionModel.length,
      taskCompatibilityMetadataCount:
        WorkflowTaskLinkModel[0]?.taskCompatibilityMetadata.length ?? 0,
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
