import { ExecutiveTaskIntelligenceFoundation } from "./taskIntelligenceIndex.ts";
import { TaskPlatformMetadata } from "./taskMetadataIndex.ts";
import { TaskDependencyModel } from "./taskDependencyModel.ts";
import { TaskEffortModel } from "./taskEffortModel.ts";
import { TaskIdentityModel, TaskExecutionReadinessModel } from "./taskIdentityModel.ts";
import { TaskLifecycleModel } from "./taskLifecycleModel.ts";
import { TaskOwnershipModel } from "./taskOwnershipModel.ts";
import { TaskPriorityModel } from "./taskPriorityModel.ts";
import { TaskRiskModel } from "./taskRiskModel.ts";

export const buildTaskModelManifest = () =>
  Object.freeze({
    foundation: ExecutiveTaskIntelligenceFoundation,
    metadata: TaskPlatformMetadata,
    models: Object.freeze({
      identity: TaskIdentityModel,
      lifecycle: TaskLifecycleModel,
      priority: TaskPriorityModel,
      ownership: TaskOwnershipModel,
      dependency: TaskDependencyModel,
      effort: TaskEffortModel,
      risk: TaskRiskModel,
      executionReadiness: TaskExecutionReadinessModel,
    }),
    compatibility: Object.freeze({
      compatibilityVersion: TaskPlatformMetadata.compatibilityVersion,
      supportedDomainCount: TaskPlatformMetadata.supportedTaskDomains.length,
      lifecycleStateCount: TaskLifecycleModel.length,
      priorityDescriptorCount: TaskPriorityModel.length,
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
