import { TaskIdentityModel } from "./taskIdentityModel.ts";
import type { TaskDependencyDescriptor } from "./taskModelTypes.ts";

const metadata = TaskIdentityModel.metadata;

export const TaskDependencyModel = Object.freeze({
  prerequisiteTasks: Object.freeze([
    "task-operational-001",
    "task-review-001",
  ]),
  blockingRelationships: Object.freeze([
    "ApprovalRequiredBeforeExecutionPlanning",
    "ReviewRequiredBeforeCompletion",
  ]),
  downstreamImpact: Object.freeze([
    "WorkflowCoordinationImpact",
    "ProjectExecutionImpact",
  ]),
  dependencyType: "CrossPlatformTaskDependency",
  dependencyConfidence: "Validated",
  metadata,
} as const satisfies TaskDependencyDescriptor);
