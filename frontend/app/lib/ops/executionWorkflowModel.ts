import { ExecutionPlatformMetadata } from "./executionMetadataIndex.ts";
import type { ExecutionWorkflow } from "./executionModelTypes.ts";

export const ExecutionWorkflowModel = Object.freeze({
  identifier: "execution-workflow-model",
  displayName: "Execution Workflow Model",
  description: "Canonical metadata model for executive workflows.",
  category: "Workflow",
  status: "Modeled",
  stages: Object.freeze([
    "Intake",
    "Coordination",
    "Review",
    "Completion",
  ]),
  transitions: Object.freeze([
    "IntakeToCoordination",
    "CoordinationToReview",
    "ReviewToCompletion",
  ]),
  dependencies: Object.freeze([
    "execution-task-model",
    "execution-schedule-model",
  ]),
  lifecycleMetadata: Object.freeze([
    "Draft",
    "Defined",
    "Archived",
  ]),
  metadata: Object.freeze({
    phaseId: "OPS-1:3",
    platformId: ExecutionPlatformMetadata.platformId,
    compatibilityVersion: ExecutionPlatformMetadata.compatibilityVersion,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
    registryCapabilityId: "cap-workflow-intelligence",
    domainId: "workflow-intelligence",
  }),
} as const satisfies ExecutionWorkflow);
