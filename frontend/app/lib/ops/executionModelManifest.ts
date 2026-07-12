import { ExecutiveExecutionFoundation } from "./executionIndex.ts";
import {
  ExecutionCapabilityRegistry,
  ExecutionPlatformMetadata,
} from "./executionMetadataIndex.ts";
import { ExecutionAutomationModel } from "./executionAutomationModel.ts";
import { ExecutionMonitoringModel } from "./executionMonitoringModel.ts";
import { ExecutionProjectModel } from "./executionProjectModel.ts";
import { ExecutionResourceModel } from "./executionResourceModel.ts";
import { ExecutionScheduleModel } from "./executionScheduleModel.ts";
import { ExecutionTaskModel } from "./executionTaskModel.ts";
import { ExecutionWorkflowModel } from "./executionWorkflowModel.ts";

const executionModels = Object.freeze([
  ExecutionTaskModel,
  ExecutionWorkflowModel,
  ExecutionProjectModel,
  ExecutionResourceModel,
  ExecutionScheduleModel,
  ExecutionMonitoringModel,
  ExecutionAutomationModel,
]);

const mappedCapabilityIds = Object.freeze(
  executionModels.map((model) => model.metadata.registryCapabilityId),
) as readonly string[];

const unmappedCapabilities = Object.freeze(
  ExecutionCapabilityRegistry.filter(
    (capability) => !mappedCapabilityIds.includes(capability.id),
  ),
);

export const buildExecutionModelManifest = () =>
  Object.freeze({
    foundation: ExecutiveExecutionFoundation,
    metadata: ExecutionPlatformMetadata,
    models: Object.freeze({
      task: ExecutionTaskModel,
      workflow: ExecutionWorkflowModel,
      project: ExecutionProjectModel,
      resource: ExecutionResourceModel,
      schedule: ExecutionScheduleModel,
      monitoring: ExecutionMonitoringModel,
      automation: ExecutionAutomationModel,
      all: executionModels,
    }),
    compatibility: Object.freeze({
      compatibilityVersion: ExecutionPlatformMetadata.compatibilityVersion,
      registryCapabilityCount: ExecutionCapabilityRegistry.length,
      modeledCapabilityCount: executionModels.length,
      mappedCapabilityIds,
      unmappedCapabilities,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
