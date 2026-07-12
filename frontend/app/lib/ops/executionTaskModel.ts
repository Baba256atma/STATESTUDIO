import { ExecutionPlatformMetadata } from "./executionMetadataIndex.ts";
import type { ExecutionTask } from "./executionModelTypes.ts";

export const ExecutionTaskModel = Object.freeze({
  identifier: "execution-task-model",
  displayName: "Execution Task Model",
  description: "Canonical metadata model for executive operational tasks.",
  category: "Task",
  status: "Modeled",
  taskType: "ExecutiveOperationalTask",
  priority: "Strategic",
  ownerReference: "ExecutiveOperationsOwner",
  dependencyReferences: Object.freeze([
    "execution-workflow-model",
    "execution-project-model",
  ]),
  estimatedEffort: "MetadataDefined",
  executionState: "Planned",
  metadata: Object.freeze({
    phaseId: "OPS-1:3",
    platformId: ExecutionPlatformMetadata.platformId,
    compatibilityVersion: ExecutionPlatformMetadata.compatibilityVersion,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
    registryCapabilityId: "cap-task-intelligence",
    domainId: "task-intelligence",
  }),
} as const satisfies ExecutionTask);
