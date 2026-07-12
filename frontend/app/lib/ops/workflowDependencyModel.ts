import { WorkflowIdentityModel } from "./workflowIdentityModel.ts";
import type { WorkflowDependencyDescriptor } from "./workflowModelTypes.ts";

const metadata = WorkflowIdentityModel.metadata;

export const WorkflowDependencyModel = Object.freeze({
  prerequisiteWorkflows: Object.freeze([
    "workflow-executive-001",
    "workflow-review-001",
  ]),
  blockingWorkflows: Object.freeze([
    "workflow-approval-001",
    "workflow-escalation-001",
  ]),
  taskDependencyReferences: Object.freeze([
    "task-approval-001",
    "task-review-001",
    "task-operational-002",
  ]),
  downstreamImpactMetadata: Object.freeze([
    "ProjectExecutionImpact",
    "SchedulingImpact",
    "AutomationBoundaryImpact",
  ]),
  dependencyConfidence: "Validated",
  metadata,
} as const satisfies WorkflowDependencyDescriptor);
